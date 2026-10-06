import { pricing, yenFrom, type ServiceId } from "@/config/pricing";

export type PriceRow = { label: string; price: string; note?: string };

/** 料金表の行を pricing.ts から生成（簡易見積と同じデータソース） */
export function getPriceRows(service: ServiceId): PriceRow[] {
  switch (service) {
    case "solar":
      return pricing.solar.tiers
        .filter((t) => !("unknown" in t && t.unknown))
        .map((t) => ({
          label: `設備容量 ${t.label}`,
          price: t.from ? yenFrom(t.from) : "個別見積",
        }));
    case "construction":
      return pricing.construction.types
        .filter((t) => t.from)
        .map((t) => ({
          label: t.label === "単発" ? "単発撮影" : `定期撮影（${t.label}）`,
          price: `${yenFrom(t.from!)}${t.perVisit ? "／回" : ""}`,
          note: t.perVisit ? `${pricing.construction.regularMinVisits}回以上のご依頼を想定` : undefined,
        }));
    case "roof-wall":
      return [
        { label: "屋根 可視光点検", price: `${pricing.roofWall.visiblePerSqm}円/㎡`, note: `最低料金 ${yenFrom(pricing.roofWall.visibleSimple)}（〜500㎡）` },
        { label: "外壁 赤外線調査", price: `${pricing.roofWall.infraredPerSqm}円/㎡`, note: `最低料金 ${yenFrom(pricing.roofWall.infraredMinimum)}` },
        { label: "5,000㎡以上", price: "個別見積" },
      ];
    case "factory-warehouse":
      return [
        { label: "可視光 屋根点検", price: `${pricing.roofWall.visiblePerSqm}円/㎡`, note: `最低料金 ${yenFrom(pricing.factory.visibleRoof)}` },
        { label: "赤外線等を含む詳細点検", price: `${pricing.roofWall.infraredPerSqm}円/㎡`, note: `最低料金 ${yenFrom(pricing.factory.detailed)}` },
        { label: "大型施設（10,000㎡以上 等）", price: "個別見積" },
      ];
  }
}
