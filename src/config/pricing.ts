/**
 * 料金設定（唯一のデータソース）
 *
 * ・料金ページ（/pricing）、各サービスLPの料金、60秒簡易見積、SEOタイトルの料金表記は
 *   すべてこのファイルの値から生成されます。ここを書き換えれば全体に反映されます。
 * ・金額はすべて「仮料金」です。運用が確定したら実際の価格に変更してください（税抜/税込の表記は notes で管理）。
 * ・価格ロジックをコンポーネント内にハードコードしないこと。
 */

export type ServiceId = "solar" | "construction" | "roof-wall" | "factory-warehouse";

export const SERVICE_IDS: ServiceId[] = ["solar", "construction", "roof-wall", "factory-warehouse"];

type Opt = { id: string; label: string; hint?: string };

/** 「分からない」「まだ決まっていない」を表す共通ID */
export const UNKNOWN_ID = "unknown";

export const pricing = {
  taxNote: "表示金額は仮の目安です（税の扱いは正式見積時にご案内します）。",
  disclaimer: "現場環境・飛行条件・対象範囲等によって正式料金は変わります。",

  // ---------------------------------------------------------------- 太陽光
  solar: {
    question: "設備容量はどれくらいですか？",
    tiers: [
      { id: "lt50", label: "50kW未満", from: 29800 },
      { id: "50-200", label: "50〜200kW", from: 49800 },
      { id: "200-500", label: "200〜500kW", from: 69800 },
      { id: "500-1000", label: "500kW〜1MW", from: 99800 },
      { id: "ge1000", label: "1MW以上", individual: true },
      { id: UNKNOWN_ID, label: "分からない", unknown: true },
    ] as (Opt & { from?: number; individual?: boolean; unknown?: boolean })[],
  },

  // ---------------------------------------------------------------- 建設現場
  construction: {
    typeQuestion: "どのような撮影ですか？",
    types: [
      { id: "single", label: "単発", from: 39800, perVisit: false },
      { id: "monthly1", label: "月1回程度", from: 29800, perVisit: true },
      { id: "monthly2", label: "月2回以上", from: 29800, perVisit: true },
      { id: "fullterm", label: "工期全体で定期撮影", from: 29800, perVisit: true },
      { id: UNKNOWN_ID, label: "まだ決まっていない", unknown: true },
    ] as (Opt & { from?: number; perVisit?: boolean; unknown?: boolean })[],
    /** 定期料金（／回）が適用される目安回数。これ未満の場合は単発料金になる場合があります。 */
    regularMinVisits: 3,
    scaleQuestion: "現場規模は？",
    scales: [
      { id: "small", label: "小規模" },
      { id: "medium", label: "中規模" },
      { id: "large", label: "大規模" },
      { id: UNKNOWN_ID, label: "分からない" },
    ] as Opt[],
    /** true にすると大規模現場を「個別見積」にします */
    largeSiteIndividual: false,
  },

  // ---------------------------------------------------------------- 屋根・外壁
  roofWall: {
    targetQuestion: "点検対象は？",
    targets: [
      { id: "roof", label: "屋根" },
      { id: "wall", label: "外壁" },
      { id: "both", label: "屋根＋外壁" },
      { id: UNKNOWN_ID, label: "分からない" },
    ] as Opt[],
    areaQuestion: "おおよその広さ",
    areas: [
      { id: "lt500", label: "〜500㎡", lower: 0, upper: 500 },
      { id: "500-1000", label: "500〜1,000㎡", lower: 500, upper: 1000 },
      { id: "1000-3000", label: "1,000〜3,000㎡", lower: 1000, upper: 3000 },
      { id: "3000-5000", label: "3,000〜5,000㎡", lower: 3000, upper: 5000 },
      { id: "ge5000", label: "5,000㎡以上", lower: 5000, upper: null, roofIndividual: true },
      { id: UNKNOWN_ID, label: "分からない", unknown: true },
    ] as (Opt & { lower?: number; upper?: number | null; roofIndividual?: boolean; unknown?: boolean })[],
    /** 可視光簡易点検（屋根）の基本料金 */
    visibleSimple: 49800,
    /** 赤外線外壁調査（㎡単価）と最低料金 */
    infraredPerSqm: 130,
    infraredMinimum: 120000,
  },

  // ---------------------------------------------------------------- 工場・倉庫
  factory: {
    placeQuestion: "点検したい場所は？",
    places: [
      { id: "roof", label: "屋根", plan: "visibleRoof" },
      { id: "wall", label: "外壁", plan: "visibleRoof" },
      { id: "solar", label: "太陽光設備", plan: "solar" },
      { id: "high", label: "高所設備", plan: "visibleRoof" },
      { id: "whole", label: "施設全体", plan: "detailed" },
      { id: UNKNOWN_ID, label: "まだ決まっていない", plan: "unknown" },
    ] as (Opt & { plan: "visibleRoof" | "detailed" | "solar" | "unknown" })[],
    scaleQuestion: "施設規模",
    scales: [
      { id: "lt1000", label: "〜1,000㎡" },
      { id: "1000-3000", label: "1,000〜3,000㎡" },
      { id: "3000-5000", label: "3,000〜5,000㎡" },
      { id: "5000-10000", label: "5,000〜10,000㎡" },
      { id: "ge10000", label: "10,000㎡以上", individual: true },
      { id: UNKNOWN_ID, label: "分からない" },
    ] as (Opt & { individual?: boolean })[],
    /** 可視光屋根点検 */
    visibleRoof: 69800,
    /** 赤外線等を含む詳細点検 */
    detailed: 149800,
  },

  // ---------------------------------------------------------------- 所在地（簡易見積STEP3）
  locations: [
    { id: "tokyo", label: "東京都" },
    { id: "kanagawa", label: "神奈川県" },
    { id: "saitama", label: "埼玉県" },
    { id: "chiba", label: "千葉県" },
    { id: "other", label: "その他" },
  ] as Opt[],

  // ---------------------------------------------------------------- 料金に含まれる想定項目（運用確定後にON/OFF）
  includes: [
    { id: "hearing", label: "事前ヒアリング", enabled: true },
    { id: "plan", label: "飛行計画", enabled: true },
    { id: "shoot", label: "撮影", enabled: true },
    { id: "data", label: "撮影データ", enabled: true },
    { id: "analysis", label: "基本解析", enabled: true },
    { id: "report", label: "基本報告書", enabled: true },
  ] as { id: string; label: string; enabled: boolean }[],

  // ---------------------------------------------------------------- 追加料金が発生しうる項目
  extras: [
    "特殊飛行申請（許可・承認の取得が必要な飛行）",
    "警備員の配置",
    "交通規制",
    "遠距離の交通費",
    "宿泊",
    "特殊機材",
    "専門資格者の同行・確認",
  ],
};

/** 料金ページ・LPで使う表示用の「〜円から」ヘルパー */
export const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
export const yenFrom = (n: number) => `${yen(n)}〜`;

/** 各サービスの最低料金（SEOタイトル・カードの「◯円〜」表記用） */
export const startingPrice: Record<ServiceId, number> = {
  solar: Math.min(...pricing.solar.tiers.flatMap((t) => (t.from ? [t.from] : []))),
  construction: Math.min(...pricing.construction.types.flatMap((t) => (t.from ? [t.from] : []))),
  "roof-wall": Math.min(pricing.roofWall.visibleSimple, pricing.roofWall.infraredMinimum),
  "factory-warehouse": pricing.factory.visibleRoof,
};
