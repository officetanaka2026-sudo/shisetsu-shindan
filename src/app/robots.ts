import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionEnv } from "@/lib/seo";

/**
 * robots.txt。本番はクロール可。開発・Vercel の Preview 環境は全体を noindex 扱い（クロール拒否）にします。
 * ※ このSEO実装だけで検索順位を保証するものではありません。
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionEnv) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
