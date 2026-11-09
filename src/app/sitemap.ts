import type { MetadataRoute } from "next";
import { features } from "@/config/features";
import { serviceList } from "@/content/services";
import { areaList } from "@/content/areas";
import { getAllGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/seo";

/** sitemap.xml を自動生成（サービス・ガイド・固定ページ）。noindex のページは含めません。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["/", "/services", "/pricing", "/estimate", "/contact", "/about", "/guides", "/areas", "/partners", "/privacy"];
  const entries: MetadataRoute.Sitemap = [
    ...fixed.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...serviceList.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.9 })),
    ...areaList.map((a) => ({ url: absoluteUrl(`/areas/${a.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...getAllGuides().map((g) => ({
      url: absoluteUrl(`/guides/${g.slug}`),
      lastModified: g.updated ?? g.published,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
  if (features.casesEnabled) {
    entries.push({ url: absoluteUrl("/cases"), changeFrequency: "monthly", priority: 0.6 });
  }
  return entries;
}

