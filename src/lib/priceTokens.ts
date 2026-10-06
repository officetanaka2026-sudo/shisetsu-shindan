import { pricing, yen, yenFrom } from "@/config/pricing";

/**
 * ガイド記事（Markdown）内で使える料金トークン。
 * 記事中に {{price:wall-infrared-sqm}} のように書くと、pricing.ts の現在の値に置き換わります。
 * 料金を変更しても、記事の金額が自動で同期されます。
 */
const solar = Object.fromEntries(pricing.solar.tiers.flatMap((t) => (t.from ? [[`solar-${t.id}`, yenFrom(t.from)]] : [])));

const wallExample = (area: number) => yenFrom(Math.max(pricing.roofWall.infraredMinimum, area * pricing.roofWall.infraredPerSqm));

export const priceTokens: Record<string, string> = {
  ...solar,
  "solar-min": yenFrom(Math.min(...pricing.solar.tiers.flatMap((t) => (t.from ? [t.from] : [])))),
  "roof-visible": yenFrom(pricing.roofWall.visibleSimple),
  "wall-infrared-sqm": `${pricing.roofWall.infraredPerSqm}円/㎡〜`,
  "wall-infrared-min": yenFrom(pricing.roofWall.infraredMinimum),
  "wall-example-500": wallExample(500),
  "wall-example-1000": wallExample(1000),
  "wall-example-3000": wallExample(3000),
  "factory-roof": yenFrom(pricing.factory.visibleRoof),
  "factory-detailed": yenFrom(pricing.factory.detailed),
  "construction-single": yenFrom(pricing.construction.types.find((t) => t.id === "single")?.from ?? 0),
  "construction-regular": `${yenFrom(pricing.construction.types.find((t) => t.id === "monthly1")?.from ?? 0)}／回`,
  "regular-min-visits": `${pricing.construction.regularMinVisits}回`,
  "yen-min-wall": yen(pricing.roofWall.infraredMinimum),
};

export function applyPriceTokens(body: string, file = ""): string {
  return body.replace(/\{\{price:([a-z0-9-]+)\}\}/g, (_, key: string) => {
    const v = priceTokens[key];
    if (!v) throw new Error(`未定義の料金トークン {{price:${key}}} が ${file} にあります`);
    return v;
  });
}
