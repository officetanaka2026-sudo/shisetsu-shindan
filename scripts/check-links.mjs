// リンク切れチェック。起動中のサイト（本番ビルドを `npm run start` したもの）の全ページを巡回し、
// 内部リンク・ページ内アンカー（#id）・画像が有効かを確認します。
//   使い方: npm run build && npm run start    （別ターミナルで）
//           node scripts/check-links.mjs [ベースURL。既定 http://localhost:3000]
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const get = async (path) => {
  const res = await fetch(base + path, { redirect: "manual" });
  return { status: res.status, text: res.headers.get("content-type")?.includes("text/html") ? await res.text() : "" };
};

const sitemap = await (await fetch(base + "/sitemap.xml")).text();
// sitemap の URL は本番ドメインなので、パス部分だけ取り出して検査対象にする
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || "/");
pages.push("/this-page-does-not-exist"); // 404 の確認用

const problems = [];
const checked = new Map();
const status = async (p) => {
  if (!checked.has(p)) checked.set(p, (await get(p)).status);
  return checked.get(p);
};

for (const page of pages) {
  const { status: st, text } = await get(page);
  if (page === "/this-page-does-not-exist") {
    if (st !== 404) problems.push(`404ページが 404 を返していません（${st}）`);
    continue;
  }
  if (st !== 200) {
    problems.push(`${page}: HTTP ${st}`);
    continue;
  }
  const ids = new Set([...text.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of text.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|https?:\/\/(?!localhost))/.test(href)) continue;
    if (href.startsWith("#")) {
      if (!ids.has(href.slice(1))) problems.push(`${page}: ページ内アンカー ${href} の移動先がありません`);
      continue;
    }
    const [path, hash] = href.replace(base, "").split("#");
    if (!path.startsWith("/")) continue;
    const s = await status(path || "/");
    if (s !== 200) problems.push(`${page}: リンク ${href} → HTTP ${s}`);
    else if (hash) {
      const target = (await get(path)).text;
      if (!new RegExp(`\\sid="${hash}"`).test(target)) problems.push(`${page}: ${href} のアンカー先がありません`);
    }
  }
  for (const m of text.matchAll(/<img\s[^>]*src="([^"]+)"/g)) {
    const src = m[1].replace(/&amp;/g, "&");
    if (!/<img\s[^>]*alt="[^"]+"/.test(m[0]) && !/alt=""/.test(m[0])) problems.push(`${page}: 画像 ${src} に alt がありません`);
    const s = await status(src.startsWith("/_next/image") ? decodeURIComponent(src.split("url=")[1].split("&")[0]) : src);
    if (s !== 200) problems.push(`${page}: 画像 ${src} → HTTP ${s}`);
  }
  const h1 = (text.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problems.push(`${page}: h1 が ${h1} 個あります（1個が望ましい）`);
}

console.log(`巡回ページ数: ${pages.length - 1} / 確認したURL数: ${checked.size}`);
if (problems.length) {
  console.log("問題あり:\n" + problems.map((p) => " - " + p).join("\n"));
  process.exit(1);
}
console.log("リンク切れ・アンカー・画像・h1 に問題はありません。");
