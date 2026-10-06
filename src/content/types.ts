import type { ServiceId } from "@/config/pricing";

export type IconName =
  | "solar"
  | "construction"
  | "roof"
  | "factory"
  | "shield"
  | "speed"
  | "yen"
  | "database"
  | "check"
  | "area"
  | "document"
  | "phone"
  | "mail"
  | "drone";

export type Faq = { q: string; a: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type ExtraSection = { id: string; title: string; lead?: string; blocks: Block[] };

export type ServiceContent = {
  id: ServiceId;
  slug: ServiceId;
  /** 表示名（例: 太陽光設備点検） */
  name: string;
  /** 短い名称（カード・パンくず用） */
  short: string;
  icon: IconName;
  /** TOPのカード・見積STEP1の説明（短く） */
  cardText: string;
  /** TOPの4サービス説明 */
  summary: string;
  cta: string;
  heroImage: { src: string; alt: string };
  metaDescription: string;
  h1: string;
  heroLead: string;
  problemsTitle: string;
  problems: string[];
  explainTitle: string;
  explain: string[];
  checksTitle: string;
  checksLead?: string;
  checks: { label: string; text: string }[];
  /** 従来方法との比較（項目ごとに従来/ドローン） */
  comparison: { item: string; conventional: string; drone: string }[];
  comparisonNote: string;
  reportTitle: string;
  reportLead: string;
  reportPoints: string[];
  /** 点検の流れ（サービス別に差し替える場合） */
  flow?: { title: string; text: string }[];
  /** 料金セクション用の補足 */
  priceNotes: string[];
  faqs: Faq[];
  /** 関連ガイド（slug） */
  guides: string[];
  /** 追加セクション（屋根・外壁LPなど、情報量を増やすページ用） */
  extraSections?: ExtraSection[];
};
