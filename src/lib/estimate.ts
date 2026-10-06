import { pricing, UNKNOWN_ID, yenFrom, yen, type ServiceId } from "@/config/pricing";

/**
 * 簡易見積のロジック。すべて src/config/pricing.ts の値から算出します（金額のハードコード禁止）。
 */

export type Answers = Record<string, string>;

export type StepDef = {
  key: string;
  title: string;
  /** 結果画面・メールで使う短い名称 */
  label: string;
  options: { id: string; label: string }[];
};

/** サービスごとの「規模」質問（STEP2）。順番に1問ずつ表示します。 */
export function getSizeSteps(service: ServiceId): StepDef[] {
  switch (service) {
    case "solar":
      return [{ key: "capacity", label: "設備容量", title: pricing.solar.question, options: pricing.solar.tiers }];
    case "construction":
      return [
        { key: "type", label: "撮影", title: pricing.construction.typeQuestion, options: pricing.construction.types },
        { key: "scale", label: "現場規模", title: pricing.construction.scaleQuestion, options: pricing.construction.scales },
      ];
    case "roof-wall":
      return [
        { key: "target", label: "点検対象", title: pricing.roofWall.targetQuestion, options: pricing.roofWall.targets },
        { key: "area", label: "広さ", title: pricing.roofWall.areaQuestion, options: pricing.roofWall.areas },
      ];
    case "factory-warehouse":
      return [
        { key: "place", label: "点検箇所", title: pricing.factory.placeQuestion, options: pricing.factory.places },
        { key: "scale", label: "施設規模", title: pricing.factory.scaleQuestion, options: pricing.factory.scales },
      ];
  }
}

export type PriceLine = { label: string; min: number; max?: number; suffix?: string };

export type EstimateResult =
  | { status: "priced"; min: number; max?: number; suffix?: string; lines: PriceLine[]; notes: string[] }
  | { status: "individual"; reason: string; notes: string[] }
  | { status: "needs-check"; reference: string[]; notes: string[] };

export const NEEDS_CHECK_TEXT = "条件を確認後お見積り";

/** 見積結果を「49,800円〜」「49,800円〜69,800円」の形式に整形 */
export function formatRange(min: number, max?: number, suffix = ""): string {
  if (max !== undefined && max > min) return `${yen(min)}〜${yen(max)}${suffix}`;
  return `${yenFrom(min)}${suffix}`;
}

export function formatResult(r: EstimateResult): string {
  if (r.status === "priced") return formatRange(r.min, r.max, r.suffix ?? "");
  if (r.status === "individual") return "個別見積";
  return NEEDS_CHECK_TEXT;
}

const needsCheck = (reference: string[] = [], notes: string[] = []): EstimateResult => ({
  status: "needs-check",
  reference,
  notes,
});

/** 必要な質問がすべて回答済みか */
export function isSizeComplete(service: ServiceId, answers: Answers): boolean {
  return getSizeSteps(service).every((s) => Boolean(answers[s.key]));
}

export function calculateEstimate(service: ServiceId, answers: Answers): EstimateResult {
  switch (service) {
    case "solar":
      return calcSolar(answers);
    case "construction":
      return calcConstruction(answers);
    case "roof-wall":
      return calcRoofWall(answers);
    case "factory-warehouse":
      return calcFactory(answers);
  }
}

function calcSolar(a: Answers): EstimateResult {
  const tier = pricing.solar.tiers.find((t) => t.id === a.capacity);
  if (!tier) return needsCheck();
  if (tier.individual)
    return { status: "individual", reason: "1MW以上の大規模設備は、規模・設備構成に応じて個別にお見積りします。", notes: [] };
  if (tier.unknown || tier.from === undefined)
    return needsCheck(
      pricing.solar.tiers.flatMap((t) => (t.from ? [`${t.label}：${yenFrom(t.from)}`] : [])),
      ["設備容量が分かれば、より正確な目安をお伝えできます。"],
    );
  return {
    status: "priced",
    min: tier.from,
    lines: [{ label: `太陽光設備点検（${tier.label}）`, min: tier.from }],
    notes: [],
  };
}

function calcConstruction(a: Answers): EstimateResult {
  const c = pricing.construction;
  const type = c.types.find((t) => t.id === a.type);
  const scale = c.scales.find((s) => s.id === a.scale);
  if (!type) return needsCheck();
  if (scale?.id === "large" && c.largeSiteIndividual)
    return { status: "individual", reason: "大規模な現場は、撮影範囲・回数に応じて個別にお見積りします。", notes: [] };
  if (type.unknown || type.from === undefined) {
    const single = c.types.find((t) => t.id === "single");
    const regular = c.types.find((t) => t.id === "monthly1");
    return needsCheck(
      [
        ...(single?.from ? [`単発：${yenFrom(single.from)}`] : []),
        ...(regular?.from ? [`定期撮影：${yenFrom(regular.from)}／回`] : []),
      ],
      ["撮影の頻度が決まっていなくても、ご相談いただけます。"],
    );
  }
  const notes: string[] = [];
  if (type.perVisit) notes.push(`定期料金は、${c.regularMinVisits}回以上のご依頼を想定した1回あたりの目安です。`);
  if (scale?.id === "large") notes.push("大規模な現場は、撮影範囲により料金が変わる場合があります。");
  return {
    status: "priced",
    min: type.from,
    suffix: type.perVisit ? "／回" : "",
    lines: [{ label: `建設現場撮影（${type.label}）`, min: type.from, suffix: type.perVisit ? "／回" : "" }],
    notes,
  };
}

function calcRoofWall(a: Answers): EstimateResult {
  const r = pricing.roofWall;
  const target = r.targets.find((t) => t.id === a.target);
  const area = r.areas.find((x) => x.id === a.area);
  if (!target || !area) return needsCheck();

  const refs = [`屋根の可視光簡易点検：${yenFrom(r.visibleSimple)}`, `赤外線外壁調査：${r.infraredPerSqm}円/㎡〜（最低${yenFrom(r.infraredMinimum)}）`];
  if (target.id === UNKNOWN_ID) return needsCheck(refs, ["点検対象が決まっていなくてもご相談いただけます。"]);

  const wantsRoof = target.id === "roof" || target.id === "both";
  const wantsWall = target.id === "wall" || target.id === "both";

  if (area.unknown || area.lower === undefined) {
    // 広さが不明なとき、屋根のみなら基本料金の目安を示せる。外壁は面積が必要。
    if (target.id === "roof")
      return {
        status: "priced",
        min: r.visibleSimple,
        lines: [{ label: "屋根 可視光簡易点検", min: r.visibleSimple }],
        notes: ["広さにより料金は変動します。面積が分かればより正確な目安をお伝えできます。"],
      };
    return needsCheck(refs, ["外壁の赤外線調査は面積によって料金が決まるため、広さを確認後にお見積りします。"]);
  }

  const lines: PriceLine[] = [];
  const notes: string[] = [];

  if (wantsRoof) {
    if (area.roofIndividual)
      return { status: "individual", reason: "5,000㎡以上の屋根は、規模・形状に応じて個別にお見積りします。", notes: [] };
    lines.push({ label: "屋根 可視光簡易点検", min: r.visibleSimple });
  }
  if (wantsWall) {
    const lowerRaw = (area.lower ?? 0) * r.infraredPerSqm;
    const upperRaw = area.upper != null ? area.upper * r.infraredPerSqm : undefined;
    const min = Math.max(r.infraredMinimum, lowerRaw);
    const max = upperRaw !== undefined ? Math.max(r.infraredMinimum, upperRaw) : undefined;
    lines.push({ label: "外壁 赤外線調査", min, max });
    notes.push(`外壁の赤外線調査は ${r.infraredPerSqm}円/㎡〜（最低料金 ${yenFrom(r.infraredMinimum)}）で計算しています。`);
  }
  const min = lines.reduce((s, l) => s + l.min, 0);
  const hasMax = lines.some((l) => l.max !== undefined);
  const max = hasMax ? lines.reduce((s, l) => s + (l.max ?? l.min), 0) : undefined;
  return { status: "priced", min, max, lines, notes };
}

function calcFactory(a: Answers): EstimateResult {
  const f = pricing.factory;
  const place = f.places.find((p) => p.id === a.place);
  const scale = f.scales.find((s) => s.id === a.scale);
  if (!place || !scale) return needsCheck();
  if (scale.individual)
    return { status: "individual", reason: "10,000㎡以上の大型施設は、規模・点検範囲に応じて個別にお見積りします。", notes: [] };

  switch (place.plan) {
    case "visibleRoof": {
      const label = place.id === "roof" ? "可視光屋根点検" : `可視光点検（${place.label}）`;
      return { status: "priced", min: f.visibleRoof, lines: [{ label, min: f.visibleRoof }], notes: [] };
    }
    case "detailed":
      return {
        status: "priced",
        min: f.detailed,
        lines: [{ label: "赤外線等を含む詳細点検（施設全体）", min: f.detailed }],
        notes: ["点検範囲・施設の形状により料金は変動します。"],
      };
    case "solar":
      return needsCheck(
        pricing.solar.tiers.flatMap((t) => (t.from ? [`太陽光設備 ${t.label}：${yenFrom(t.from)}`] : [])),
        ["太陽光設備の点検は設備容量で料金が決まります。容量が分かればお伝えできます。"],
      );
    default:
      return needsCheck(
        [`可視光屋根点検：${yenFrom(f.visibleRoof)}`, `赤外線等を含む詳細点検：${yenFrom(f.detailed)}`],
        ["点検したい場所が決まっていなくても、状況に合わせてご提案します。"],
      );
  }
}

/** 選択済み回答を、問い合わせ内容として人が読める形にする */
export function describeAnswers(service: ServiceId, answers: Answers): { label: string; value: string }[] {
  return getSizeSteps(service).flatMap((s) => {
    const opt = s.options.find((o) => o.id === answers[s.key]);
    return opt ? [{ label: s.label, value: opt.label }] : [];
  });
}
