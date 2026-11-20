// SEO監視。公開中のサイト（既定は本番）を巡回し、検索エンジンに関わる基本項目を確認してレポートを出します。
//   使い方: node scripts/seo-monitor.mjs [ベースURL] [--out レポートの保存先ディレクトリ] [--prev 前回のJSON]
//   例:     node scripts/seo-monitor.mjs https://shisetsu-shindan.jp --out docs/seo/reports
// 出力: <out>/YYYY-MM-DD.md（人が読むレポート）と <out>/YYYY-MM-DD.json（次回との比較用）
// 問題が1つでもあれば終了コード 1 を返します。
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? "https://shisetsu-shindan.jp").replace(/\/$/, "");
const outDir = opt("--out");
const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); // 日本時間の日付

const len = (s) => [...(s ?? "")].length;
const decode = (s) =>
  (s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
const pick = (html, re) => decode(html.match(re)?.[1]?.trim());

async function get(url, redirect = "follow") {
  const t = Date.now();
  try {
    const res = await fetch(url, { redirect, headers: { "user-agent": "shisetsu-shindan-seo-monitor" } });
    const type = res.headers.get("content-type") ?? "";
    const text = type.includes("text") || type.includes("xml") ? await res.text() : "";
    return { status: res.status, ms: Date.now() - t, text, location: res.headers.get("location"), robotsHeader: res.headers.get("x-robots-tag") };
  } catch (e) {
    return { status: 0, ms: Date.now() - t, text: "", error: String(e) };
  }
}

const problems = []; // 直すべき問題
const warnings = []; // 改善の余地
const pages = [];

// 1. robots.txt と sitemap.xml
const robots = await get(`${base}/robots.txt`);
if (robots.status !== 200) problems.push(`robots.txt が取得できません（HTTP ${robots.status}）`);
else {
  if (/^Disallow:\s*\/\s*$/m.test(robots.text)) problems.push("robots.txt がサイト全体のクロールを拒否しています");
  if (!/^Sitemap:/im.test(robots.text)) warnings.push("robots.txt にサイトマップの記載がありません");
}

const sitemap = await get(`${base}/sitemap.xml`);
const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (sitemap.status !== 200 || urls.length === 0) problems.push(`sitemap.xml が取得できないか空です（HTTP ${sitemap.status}）`);

// 2. ドメインの正規化（www・http からのリダイレクト）
const host = new URL(base).host;
if (!host.startsWith("localhost")) {
  for (const from of [`https://www.${host}/`, `http://${host}/`]) {
    const r = await get(from, "manual");
    const to = r.location ? new URL(r.location, from).href : "";
    if (![301, 308].includes(r.status) || !to.startsWith(`${base}/`)) problems.push(`${from} が ${base}/ へ恒久リダイレクトされていません（HTTP ${r.status} → ${to || "なし"}）`);
  }
}

// 3. 各ページ
const linkedFrom = new Map(); // パス → そのページへリンクしているページ数
for (const url of urls) {
  const p = new URL(url).pathname || "/";
  const r = await get(base + p);
  const html = r.text;
  const page = {
    path: p,
    status: r.status,
    ms: r.ms,
    title: pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: pick(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
    canonical: pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i),
    robots: pick(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i),
    h1: [...html.matchAll(/<h1[\s>]/gi)].length,
    jsonLd: [...html.matchAll(/application\/ld\+json/gi)].length,
    ogImage: !!/property="og:image"/i.test(html),
    imgNoAlt: [...html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)].length,
    // 本文の文字数（タグ・スクリプト・空白を除いたおおよその値）
    chars: len(
      html
        .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, "")
        .replace(/<(header|footer|nav)[\s\S]*?<\/\1>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, ""),
    ),
  };
  pages.push(page);

  if (r.status !== 200) {
    problems.push(`${p}: HTTP ${r.status}`);
    continue;
  }
  if (/noindex/i.test(page.robots ?? "") || /noindex/i.test(r.robotsHeader ?? "")) problems.push(`${p}: noindex になっています（検索結果に出ません）`);
  if (!page.title) problems.push(`${p}: title がありません`);
  else if (len(page.title) > 60) warnings.push(`${p}: title が長めです（${len(page.title)}文字）`);
  if (!page.description) problems.push(`${p}: meta description がありません`);
  else if (len(page.description) < 50 || len(page.description) > 175) warnings.push(`${p}: meta description の長さ ${len(page.description)}文字（目安 80〜160）`);
  const expected = base + (p === "/" ? "" : p);
  if (!page.canonical) problems.push(`${p}: canonical がありません`);
  else if (page.canonical.replace(/\/$/, "") !== expected.replace(/\/$/, "")) problems.push(`${p}: canonical が別のURLを指しています（${page.canonical}）`);
  if (page.h1 !== 1) warnings.push(`${p}: h1 が ${page.h1} 個あります（1個が目安）`);
  if (page.imgNoAlt) warnings.push(`${p}: alt のない画像が ${page.imgNoAlt} 枚あります`);
  if (r.ms > 3000) warnings.push(`${p}: 応答が遅めです（${r.ms}ms）`);
  if (p.startsWith("/guides/") && page.chars < 2000) warnings.push(`${p}: 本文が短めです（約${page.chars}字）`);

  for (const m of html.matchAll(/<a\s[^>]*href="(\/[^"#?]*)/g)) {
    const to = m[1].replace(/\/$/, "") || "/";
    if (to === p) continue;
    linkedFrom.set(to, (linkedFrom.get(to) ?? 0) + 1);
  }
}

// 4. サイト全体
const dup = (key) => {
  const seen = new Map();
  for (const pg of pages) if (pg[key]) seen.set(pg[key], [...(seen.get(pg[key]) ?? []), pg.path]);
  return [...seen.values()].filter((v) => v.length > 1);
};
for (const g of dup("title")) problems.push(`title が重複しています: ${g.join("、")}`);
for (const g of dup("description")) problems.push(`meta description が重複しています: ${g.join("、")}`);
for (const pg of pages) {
  if (pg.path !== "/" && !linkedFrom.get(pg.path)) warnings.push(`${pg.path}: サイト内のどのページからもリンクされていません`);
}

// 5. 前回との比較
const guides = pages.filter((p) => p.path.startsWith("/guides/")).map((p) => p.path);
const summary = { date: today, base, pages: pages.length, guides: guides.length, problems, warnings, paths: pages.map((p) => p.path) };
let prevPath = opt("--prev");
if (!prevPath && outDir && fs.existsSync(outDir)) {
  const files = fs.readdirSync(outDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f !== `${today}.json`).sort();
  if (files.length) prevPath = path.join(outDir, files.at(-1));
}
let diff = null;
if (prevPath && fs.existsSync(prevPath)) {
  const prev = JSON.parse(fs.readFileSync(prevPath, "utf8"));
  diff = {
    since: prev.date,
    added: summary.paths.filter((p) => !prev.paths.includes(p)),
    removed: prev.paths.filter((p) => !summary.paths.includes(p)),
    newProblems: problems.filter((x) => !prev.problems.includes(x)),
    fixed: prev.problems.filter((x) => !problems.includes(x)),
  };
}

// 6. レポート
const lines = [
  `# SEO監視レポート ${today}`,
  "",
  `対象：${base}　ページ数：${pages.length}（うち記事 ${guides.length}）`,
  "",
  `## 結果：${problems.length ? `問題 ${problems.length}件` : "問題なし"}／改善の余地 ${warnings.length}件`,
  "",
];
if (diff) {
  lines.push(`## 前回（${diff.since}）からの変化`, "");
  lines.push(`- 増えたページ：${diff.added.length ? diff.added.join("、") : "なし"}`);
  lines.push(`- 消えたページ：${diff.removed.length ? diff.removed.join("、") : "なし"}`);
  lines.push(`- 新しい問題：${diff.newProblems.length ? diff.newProblems.join(" ／ ") : "なし"}`);
  lines.push(`- 解消した問題：${diff.fixed.length ? diff.fixed.join(" ／ ") : "なし"}`, "");
}
lines.push("## 問題（直すべきもの）", "", ...(problems.length ? problems.map((x) => `- ${x}`) : ["- なし"]), "");
lines.push("## 改善の余地", "", ...(warnings.length ? warnings.map((x) => `- ${x}`) : ["- なし"]), "");
lines.push("## ページ一覧", "", "| パス | HTTP | 応答ms | title文字数 | description文字数 | 本文の字数 |", "|---|---|---|---|---|---|");
for (const p of pages) lines.push(`| ${p.path} | ${p.status} | ${p.ms} | ${len(p.title)} | ${len(p.description)} | ${p.chars} |`);
const report = lines.join("\n") + "\n";

if (outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${today}.md`), report);
  fs.writeFileSync(path.join(outDir, `${today}.json`), JSON.stringify(summary, null, 2) + "\n");
}
console.log(report);
process.exit(problems.length ? 1 : 0);
