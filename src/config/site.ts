/**
 * サイト基本情報。屋号・キャッチコピー・対応地域などはここで一括管理します。
 * 法人格（株式会社・合同会社 等）は法人化・登記が完了するまで表示しないこと。
 */
export const site = {
  name: "施設診断技研",
  nameKana: "しせつしんだんぎけん",
  tagline: "空から診る。施設を守る。",
  heroTitle: ["点検の人手と時間を、", "ドローンで減らす。"],
  heroLead:
    "足場や高所作業の人員を減らし、点検の人件費と作業時間を抑えます。点検結果はデータとして整理して納品し、人手が限られる中小企業の施設管理を支えます。",
  /** ヒーローに並べる強み（点検のデータ化） */
  heroPoints: ["撮影位置・写真番号つきで整理", "報告書と撮影データで納品", "次回点検と並べて比較できる"],
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://shisetsu-shindan.jp",
  domain: "shisetsu-shindan.jp",
  locale: "ja_JP",
  areaText: "東京都・神奈川県・埼玉県・千葉県・群馬県・栃木県を中心に関東対応",
  areaOutsideText: "関東外については、案件内容によりご相談ください。",
  prefectures: ["東京都", "神奈川県", "埼玉県", "千葉県", "群馬県", "栃木県"] as const,
  businessDescription: "ドローンを活用した建物・設備の撮影・点検・調査支援",
  /** 所在地（市区町村まで。番地は載せない） */
  location: "東京都目黒区" as null | string,
  representative: "田中賢斗" as null | string,
  /** 飛行を担当する操縦者の条件（実際に提携先を選ぶときの基準と一致させること） */
  pilotPolicy:
    "無人航空機操縦士（国家資格）を持つ操縦者、または国土交通省の飛行許可・承認を受けた操縦者が飛行を担当します。" as null | string,
  /** 保険（操縦者側の加入を条件にしている。提携先を選ぶときに必ず確認すること） */
  insurancePolicy: "対人・対物の賠償責任保険に加入している操縦者が担当します。" as null | string,
  /** お問い合わせへの返信の目安（2026-11-17 kento決定） */
  replyTime: "1営業日以内（土日祝を除く）" as null | string,
  foundedLabel: null as null | string,
} as const;

export const navItems = [
  { label: "サービス", href: "/services/solar", children: true },
  { label: "料金", href: "/pricing" },
  { label: "点検の流れ", href: "/#flow" },
  { label: "お役立ち情報", href: "/guides" },
  { label: "施設診断技研について", href: "/about" },
] as const;
