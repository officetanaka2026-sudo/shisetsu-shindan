/**
 * Feature Flags。環境変数で公開状態を切り替えます（サーバー側で評価）。
 * 詳細は README の「Feature Flags」を参照してください。
 */
const on = (v: string | undefined, fallback = false) =>
  v === undefined || v === "" ? fallback : v.toLowerCase() === "true";

export const features = {
  /** 料金・概算の表示。false の場合は「条件を確認後お見積り」のみ */
  pricingEnabled: on(process.env.NEXT_PUBLIC_PRICING_ENABLED ?? process.env.PUBLIC_PRICING_ENABLED, true),
  /** 法定点検への対応表示。資格者との連携確認が済むまで false */
  legalInspectionEnabled: on(process.env.LEGAL_INSPECTION_ENABLED, false),
  /** 使用機体セクション。src/config/equipment.ts に実機情報を入力してから true */
  equipmentSectionEnabled: on(process.env.EQUIPMENT_SECTION_ENABLED, false),
  /** 導入事例（/cases）。実績取得後に true */
  casesEnabled: on(process.env.CASES_ENABLED, false),
  /** 電話番号の表示（番号が設定されている場合のみ有効） */
  get phoneEnabled() {
    return Boolean(process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim());
  },
};
