// OGP画像（1200x630 PNG）を生成するスクリプト。Microsoft Edge（ヘッドレス）で描画します。
//   実行: node scripts/generate-og.mjs
// 文言や画像を変えたい場合は、下の pages を編集して再実行し、生成された public/og/*.png をコミットしてください。
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outDir = path.join(root, "public", "og");
fs.mkdirSync(outDir, { recursive: true });

const candidates = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/microsoft-edge",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const browser = candidates.find((p) => fs.existsSync(p));
if (!browser) {
  console.error("Edge / Chrome が見つかりません。OGP画像を生成できませんでした。");
  process.exit(1);
}

const pages = [
  { file: "default", title: ["高所・広範囲の点検を、", "もっと安全に、速く、明朗に。"], sub: "ドローンによる建物・設備点検", img: "drone-building-inspection-hero.svg" },
  { file: "solar", title: ["太陽光パネルの", "ドローン・赤外線点検"], sub: "ホットスポット候補・汚れ・破損の把握を支援", img: "drone-solar-panel-inspection.svg" },
  { file: "construction", title: ["建設現場の", "ドローン撮影・定点撮影"], sub: "工程進捗・発注者報告・竣工記録に", img: "drone-construction-site-survey.svg" },
  { file: "roof-wall", title: ["ドローン外壁調査・", "屋根点検"], sub: "赤外線調査対応／足場を組まずに状態を確認", img: "drone-roof-wall-inspection.svg" },
  { file: "factory-warehouse", title: ["工場・倉庫の屋根・", "設備ドローン点検"], sub: "広い施設を、人が歩き回る前に空から確認", img: "drone-factory-warehouse-inspection.svg" },
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-"));
for (const p of pages) {
  const img = pathToFileURL(path.join(root, "public", "images", p.img)).href;
  const html = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#0b1f33;color:#fff;font-family:"Yu Gothic","Meiryo","Hiragino Sans",sans-serif;display:flex;overflow:hidden}
  .l{flex:1;padding:56px 0 48px 64px;display:flex;flex-direction:column}
  .brand{font-size:30px;font-weight:700;letter-spacing:.06em;display:flex;align-items:center;gap:14px}
  .brand i{display:inline-block;width:14px;height:14px;border-radius:50%;background:#4aa3e0}
  .tag{margin-top:6px;font-size:22px;color:#9fc3df}
  h1{margin-top:auto;font-size:60px;line-height:1.3;font-weight:800}
  .sub{margin-top:22px;font-size:26px;color:#cfe3f3}
  .area{margin-top:28px;font-size:21px;color:#9fc3df}
  .r{width:470px;display:flex;align-items:center;padding-right:48px}
  .r img{width:100%;border-radius:18px;border:3px solid rgba(255,255,255,.2)}
  </style>
  <div class="l"><div class="brand"><i></i>施設診断技研</div><div class="tag">空から診る。施設を守る。</div>
  <h1>${p.title.join("<br>")}</h1><div class="sub">${p.sub}</div><div class="area">東京・神奈川・埼玉・千葉を中心に関東対応｜見積無料</div></div>
  <div class="r"><img src="${img}"></div>`;
  const htmlFile = path.join(tmp, `${p.file}.html`);
  fs.writeFileSync(htmlFile, html);
  const out = path.join(outDir, `${p.file}.png`);
  execFileSync(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", `--screenshot=${out}`, "--window-size=1200,630", pathToFileURL(htmlFile).href], { stdio: "ignore", timeout: 60000 });
  console.log("generated", path.relative(root, out), fs.statSync(out).size, "bytes");
}
