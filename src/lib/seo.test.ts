import { describe, expect, it } from "vitest";
import { SERVICE_IDS } from "@/config/pricing";
import { getService } from "@/content/services";
import { getAllGuides } from "./guides";
import { homeDescription, serviceTitle } from "./seo";
import { priceTokens } from "./priceTokens";

const len = (s: string) => [...s].length;

describe("SEO metadata", () => {
  it("サービスLPのmeta descriptionは120〜160文字程度で、ページごとに異なる", () => {
    const seen = new Set<string>();
    for (const id of SERVICE_IDS) {
      const d = getService(id)!.metaDescription;
      expect(len(d), `${id}: ${len(d)}文字`).toBeGreaterThanOrEqual(115);
      expect(len(d), `${id}: ${len(d)}文字`).toBeLessThanOrEqual(165);
      expect(seen.has(d)).toBe(false);
      seen.add(d);
    }
    expect(len(homeDescription)).toBeGreaterThanOrEqual(100);
    expect(len(homeDescription)).toBeLessThanOrEqual(175);
  });
  it("タイトルに料金が自動反映される", () => {
    expect(serviceTitle("solar")).toContain("29,800円〜");
    expect(serviceTitle("construction")).toContain("39,800円〜");
    expect(serviceTitle("roof-wall")).toContain("赤外線調査対応");
  });
  it("ガイド記事: 必須項目があり、料金トークンが残っておらず、サービスLPへ内部リンクがある", () => {
    const guides = getAllGuides();
    expect(guides.length).toBeGreaterThanOrEqual(5);
    for (const g of guides) {
      expect(g.body, g.slug).not.toMatch(/\{\{price:/);
      expect(g.body, g.slug).toContain("{{service}}");
      expect(g.body, g.slug).toContain("{{estimate}}");
      expect(SERVICE_IDS).toContain(g.service);
      expect(len(g.description), `${g.slug}: ${len(g.description)}文字`).toBeLessThanOrEqual(175);
    }
  });
  it("サービスLPの関連ガイドが実在する（リンク切れなし）", () => {
    const slugs = new Set(getAllGuides().map((g) => g.slug));
    for (const id of SERVICE_IDS) for (const g of getService(id)!.guides) expect(slugs.has(g), `${id} → ${g}`).toBe(true);
  });
  it("ガイド内の内部リンク先が実在する", () => {
    const slugs = new Set(getAllGuides().map((g) => g.slug));
    const pages = new Set(["/pricing", "/estimate", "/contact", "/about", "/guides", "/privacy", "/services"]);
    for (const g of getAllGuides()) {
      for (const m of g.body.matchAll(/\]\((\/[^)]*)\)/g)) {
        const href = m[1];
        const ok = pages.has(href) || (href.startsWith("/guides/") && slugs.has(href.slice(8))) || href.startsWith("/services/");
        expect(ok, `${g.slug} → ${href}`).toBe(true);
      }
    }
  });
});

describe("料金トークン", () => {
  it("設定値から生成される", () => {
    expect(priceTokens["wall-infrared-sqm"]).toBe("130円/㎡〜");
    expect(priceTokens["wall-example-1000"]).toBe("130,000円〜");
    expect(priceTokens["wall-example-500"]).toBe("120,000円〜");
  });
});
