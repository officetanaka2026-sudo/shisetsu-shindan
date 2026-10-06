import type { Metadata } from "next";
import { site } from "@/config/site";
import { pricing, startingPrice, yenFrom, type ServiceId } from "@/config/pricing";
import { getService } from "@/content/services";

/**
 * SEO関連のヘルパー。
 * ※ このSEO実装だけで検索順位を保証するものではありません。
 *   検索順位は、コンテンツの質・実績・被リンク・事例などの積み重ねで決まります。
 */

/** 本番環境かどうか（Vercel の Preview / 開発環境は noindex にする） */
export const isProductionEnv = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export const absoluteUrl = (path = "/") => `${site.url}${path === "/" ? "" : path}`;

type MetaInput = {
  title: string;
  description: string;
  path: string;
  /** OGP画像のパス（public/og/ 内）。未指定は共通画像 */
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/** ページごとの metadata（title・description・canonical・OGP・Twitter） */
export function buildMetadata({ title, description, path, image = "/og/default.png", noindex, type = "website", publishedTime, modifiedTime }: MetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex || !isProductionEnv ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: `${site.name}｜${site.tagline}` }],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** サービスLPのtitle。料金は pricing.ts から自動同期されます。 */
export function serviceTitle(id: ServiceId): string {
  switch (id) {
    case "solar":
      return `太陽光パネルのドローン・赤外線点検｜料金${yenFrom(startingPrice.solar)}｜${site.name}`;
    case "construction": {
      const single = pricing.construction.types.find((t) => t.id === "single")?.from ?? startingPrice.construction;
      return `建設現場のドローン撮影・定点撮影｜${yenFrom(single)}｜${site.name}`;
    }
    case "roof-wall":
      return `ドローン外壁調査・屋根点検｜赤外線調査対応｜${site.name}`;
    case "factory-warehouse":
      return `工場・倉庫の屋根・設備ドローン点検｜${site.name}`;
  }
}

export const homeTitle = `ドローンによる建物・設備点検｜${site.name}｜関東対応`;
export const homeDescription = `${site.name}は、ドローンを活用して工場・倉庫・ビル・太陽光発電所などの点検を支援。点検結果は写真・報告書・撮影データに整理して納品。屋根・外壁・太陽光・建設現場の4分野を、東京・神奈川・埼玉・千葉を中心に関東で対応。60秒で料金の目安が分かり、見積は無料です。`;

// ---------------------------------------------------------------- 構造化データ（実態に合うものだけ）

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  description: site.businessDescription,
  areaServed: site.prefectures.map((p) => ({ "@type": "AdministrativeArea", name: p })),
  // 住所・電話・営業時間・代表者などが確定したら site.ts / contact.ts に入力してください
  // （LocalBusiness は事業所情報が確定してから追加します）。
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  inLanguage: "ja",
  publisher: { "@id": `${site.url}/#organization` },
});

export const serviceJsonLd = (id: ServiceId) => {
  const s = getService(id)!;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.metaDescription,
    url: absoluteUrl(`/services/${s.slug}`),
    provider: { "@id": `${site.url}/#organization` },
    areaServed: site.prefectures.map((p) => ({ "@type": "AdministrativeArea", name: p })),
  };
};

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const articleJsonLd = (a: { title: string; description: string; path: string; published: string; updated?: string; author?: string }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  mainEntityOfPage: absoluteUrl(a.path),
  datePublished: a.published,
  dateModified: a.updated ?? a.published,
  inLanguage: "ja",
  // 著者が個人として確定するまでは、運営者（屋号）を著者として表示します。架空人物は使用しません。
  author: { "@type": "Organization", name: a.author ?? site.name },
  publisher: { "@id": `${site.url}/#organization` },
});
