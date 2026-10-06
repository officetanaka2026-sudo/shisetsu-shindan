import { describe, expect, it } from "vitest";
import { pricing, SERVICE_IDS, startingPrice } from "@/config/pricing";
import { calculateEstimate, formatResult, getSizeSteps, NEEDS_CHECK_TEXT, type Answers } from "./estimate";

/** 全回答の組み合わせを列挙（4サービス × 各規模） */
function allCombos(service: (typeof SERVICE_IDS)[number]): Answers[] {
  const steps = getSizeSteps(service);
  return steps.reduce<Answers[]>(
    (acc, step) => acc.flatMap((a) => step.options.map((o) => ({ ...a, [step.key]: o.id }))),
    [{}],
  );
}

describe("簡易見積：全組み合わせで必ず結果が返る", () => {
  for (const service of SERVICE_IDS) {
    it(`${service}: 全${allCombos(service).length}通りで計算できる（「分からない」でも先へ進める）`, () => {
      for (const answers of allCombos(service)) {
        const r = calculateEstimate(service, answers);
        const text = formatResult(r);
        expect(text.length).toBeGreaterThan(0);
        if (r.status === "priced") {
          expect(r.min).toBeGreaterThan(0);
          if (r.max !== undefined) expect(r.max).toBeGreaterThanOrEqual(r.min);
        }
      }
    });
  }
});

describe("太陽光", () => {
  it("設備容量ごとの料金が設定値と一致する", () => {
    for (const t of pricing.solar.tiers) {
      const r = calculateEstimate("solar", { capacity: t.id });
      if (t.from) expect(r).toMatchObject({ status: "priced", min: t.from });
      else if (t.individual) expect(r.status).toBe("individual");
      else expect(formatResult(r)).toBe(NEEDS_CHECK_TEXT);
    }
  });
  it("50kW未満は 49,800円〜", () => {
    expect(formatResult(calculateEstimate("solar", { capacity: "lt50" }))).toBe("49,800円〜");
  });
});

describe("建設現場", () => {
  it("単発は 49,800円〜、定期は 39,800円〜／回", () => {
    expect(formatResult(calculateEstimate("construction", { type: "single", scale: "small" }))).toBe("49,800円〜");
    expect(formatResult(calculateEstimate("construction", { type: "monthly1", scale: "medium" }))).toBe("39,800円〜／回");
    expect(formatResult(calculateEstimate("construction", { type: "fullterm", scale: "unknown" }))).toBe("39,800円〜／回");
  });
  it("大規模な現場は個別見積", () => {
    expect(formatResult(calculateEstimate("construction", { type: "single", scale: "large" }))).toBe("個別見積");
  });
  it("撮影頻度が未定でも先へ進める", () => {
    const r = calculateEstimate("construction", { type: "unknown", scale: "unknown" });
    expect(r.status).toBe("needs-check");
  });
});

describe("屋根・外壁", () => {
  it("屋根 〜500㎡ は最低料金 49,800円〜", () => {
    expect(calculateEstimate("roof-wall", { target: "roof", area: "lt500" })).toMatchObject({ status: "priced", min: 49800, max: 50000 });
  });
  it("屋根 1,000〜3,000㎡ は 100円/㎡ で 100,000円〜300,000円", () => {
    expect(formatResult(calculateEstimate("roof-wall", { target: "roof", area: "1000-3000" }))).toBe("100,000円〜300,000円");
  });
  it("外壁は最低料金 150,000円 を下回らない", () => {
    const r = calculateEstimate("roof-wall", { target: "wall", area: "lt500" });
    expect(r).toMatchObject({ status: "priced", min: 150000 });
  });
  it("外壁 1,000〜3,000㎡ は 250,000円〜750,000円", () => {
    expect(formatResult(calculateEstimate("roof-wall", { target: "wall", area: "1000-3000" }))).toBe("250,000円〜750,000円");
  });
  it("屋根＋外壁は両方を合算する", () => {
    const r = calculateEstimate("roof-wall", { target: "both", area: "1000-3000" });
    expect(r).toMatchObject({ status: "priced", min: 100000 + 250000, max: 300000 + 750000 });
  });
  it("5,000㎡以上は個別見積", () => {
    expect(formatResult(calculateEstimate("roof-wall", { target: "roof", area: "ge5000" }))).toBe("個別見積");
    expect(formatResult(calculateEstimate("roof-wall", { target: "wall", area: "ge5000" }))).toBe("個別見積");
  });
  it("外壁で広さが分からない場合は『条件を確認後お見積り』", () => {
    expect(formatResult(calculateEstimate("roof-wall", { target: "wall", area: "unknown" }))).toBe(NEEDS_CHECK_TEXT);
  });
});

describe("工場・倉庫", () => {
  it("屋根 3,000〜5,000㎡ は 300,000円〜500,000円", () => {
    expect(formatResult(calculateEstimate("factory-warehouse", { place: "roof", scale: "3000-5000" }))).toBe("300,000円〜500,000円");
  });
  it("施設全体 〜1,000㎡ は詳細点検 150,000円〜250,000円", () => {
    expect(formatResult(calculateEstimate("factory-warehouse", { place: "whole", scale: "lt1000" }))).toBe("150,000円〜250,000円");
  });
  it("広さが分からない場合は最低料金から", () => {
    expect(formatResult(calculateEstimate("factory-warehouse", { place: "roof", scale: "unknown" }))).toBe("49,800円〜");
  });
  it("10,000㎡以上は個別見積", () => {
    expect(formatResult(calculateEstimate("factory-warehouse", { place: "roof", scale: "ge10000" }))).toBe("個別見積");
  });
});

describe("料金表と簡易見積が同じデータソース", () => {
  it("最低料金が設定値から算出される", () => {
    expect(startingPrice.solar).toBe(49800);
    expect(startingPrice.construction).toBe(39800);
    expect(startingPrice["factory-warehouse"]).toBe(pricing.factory.visibleRoof);
  });
});
