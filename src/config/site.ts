/**
 * サイト基本情報。屋号・キャッチコピー・対応地域などはここで一括管理します。
 * 法人格（株式会社・合同会社 等）は法人化・登記が完了するまで表示しないこと。
 */
export const site = {
  name: "施設診断技研",
  nameKana: "しせつしんだんぎけん",
  tagline: "空から診る。施設を守る。",
  heroTitle: ["高所・広範囲の点検を、", "もっと安全に、速く、明朗に。"],
  heroLead:
    "施設診断技研は、東京都・神奈川県・埼玉県・千葉県を中心に、ドローンを活用した建物・設備点検を提供します。",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://shisetsu-shindan.jp",
  domain: "shisetsu-shindan.jp",
  locale: "ja_JP",
  areaText: "東京都・神奈川県・埼玉県・千葉県を中心に関東対応",
  areaOutsideText: "関東外については、案件内容によりご相談ください。",
  prefectures: ["東京都", "神奈川県", "埼玉県", "千葉県"] as const,
  businessDescription: "ドローンを活用した建物・設備の撮影・点検・調査支援",
  // 事業所の住所・営業時間などが確定したらここに入力（入力後に構造化データへ反映できます）
  address: null as null | { postalCode: string; region: string; locality: string; street: string },
  representative: null as null | string,
  qualifications: [] as string[],
  insurance: null as null | string,
  foundedLabel: null as null | string,
} as const;

export const navItems = [
  { label: "サービス", href: "/services/solar", children: true },
  { label: "料金", href: "/pricing" },
  { label: "点検の流れ", href: "/#flow" },
  { label: "お役立ち情報", href: "/guides" },
  { label: "施設診断技研について", href: "/about" },
] as const;
