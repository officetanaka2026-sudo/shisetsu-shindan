import fs from "node:fs";
import path from "node:path";
import type { ServiceId } from "@/config/pricing";
import { applyPriceTokens } from "./priceTokens";

/**
 * お役立ち情報（ガイド記事）の読み込み。
 * src/content/guides/ に Markdown ファイル（.md）を追加するだけで記事が増えます（CMS不要）。
 *
 * 先頭のフロントマター例:
 * ---
 * title: 記事タイトル
 * description: 記事の説明（検索結果に表示される文章）
 * service: roof-wall          # 関連サービス（solar / construction / roof-wall / factory-warehouse）
 * published: 2026-10-02       # 公開日
 * updated: 2026-10-02         # 最終更新日（任意）
 * author: 施設診断技研         # 著者（任意。個人名は実在する方のみ）
 * supervisor:                 # 監修者（任意。実在する方のみ）
 * ---
 */
export type Guide = {
  slug: string;
  title: string;
  description: string;
  service: ServiceId;
  published: string;
  updated?: string;
  author?: string;
  supervisor?: string;
  body: string;
};

const GUIDES_DIR = path.join(process.cwd(), "src", "content", "guides");

function parse(slug: string, raw: string): Guide {
  const m = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`ガイド記事 ${slug} にフロントマターがありません`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    meta[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .replace(/\s+#.*$/, "")
      .trim();
  }
  for (const k of ["title", "description", "service", "published"]) {
    if (!meta[k]) throw new Error(`ガイド記事 ${slug} に ${k} がありません`);
  }
  return {
    slug,
    title: meta.title,
    description: meta.description,
    service: meta.service as ServiceId,
    published: meta.published,
    updated: meta.updated || undefined,
    author: meta.author || undefined,
    supervisor: meta.supervisor || undefined,
    body: applyPriceTokens(m[2].trim(), `${slug}.md`),
  };
}

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parse(f.replace(/\.md$/, ""), fs.readFileSync(path.join(GUIDES_DIR, f), "utf8")))
    .sort((a, b) => (b.updated ?? b.published).localeCompare(a.updated ?? a.published));
}

export function getGuide(slug: string): Guide | undefined {
  return getAllGuides().find((g) => g.slug === slug);
}

export function getGuidesByService(service: ServiceId): Guide[] {
  return getAllGuides().filter((g) => g.service === service);
}

