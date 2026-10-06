// イメージイラスト（SVG）を生成するスクリプト。
// 実際の写真（商用利用可能な素材 / 自社撮影）に差し替える場合は、同じファイル名で
// public/images/ に配置し、各ページの heroImage.src（src/content/services.ts）を更新してください。
//   実行: node scripts/generate-images.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images");
fs.mkdirSync(OUT, { recursive: true });

const NAVY = "#0b1f33";
const BLUE = "#1769aa";
const SKY1 = "#eaf3fb";
const SKY2 = "#cfe3f3";
const ORANGE = "#be4f05";

const drone = (x, y, s = 1) => `
<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-34 -6 L-62 -22 M34 -6 L62 -22 M-34 6 L-62 22 M34 6 L62 22" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>
  ${[[-62, -22], [62, -22], [-62, 22], [62, 22]]
    .map(([a, b]) => `<ellipse cx="${a}" cy="${b - 4}" rx="22" ry="5" fill="${BLUE}" opacity="0.85"/><circle cx="${a}" cy="${b}" r="4" fill="${NAVY}"/>`)
    .join("")}
  <rect x="-36" y="-14" width="72" height="28" rx="12" fill="${NAVY}"/>
  <rect x="-18" y="-8" width="36" height="8" rx="4" fill="${BLUE}"/>
  <circle cx="0" cy="18" r="9" fill="#fff" stroke="${NAVY}" stroke-width="4"/>
  <circle cx="0" cy="18" r="3.5" fill="${BLUE}"/>
</g>`;

const beam = (x, y, x1, y1, x2, y2) => `<path d="M${x} ${y + 24} L${x1} ${y1} L${x2} ${y2} Z" fill="${BLUE}" opacity="0.14"/>
<path d="M${x} ${y + 24} L${x1} ${y1} M${x} ${y + 24} L${x2} ${y2}" stroke="${BLUE}" stroke-width="2" stroke-dasharray="6 6" opacity="0.6"/>`;

const wrap = (w, h, title, body, desc) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${title}</title><desc id="d">${desc}</desc>
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY2}"/><stop offset="1" stop-color="${SKY1}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#sky)"/>
${body}
</svg>
`;

const windows = (x, y, cols, rows, gx, gy, w, h, fill = "#9fc0dc") =>
  Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => `<rect x="${x + c * gx}" y="${y + r * gy}" width="${w}" height="${h}" rx="2" fill="${fill}"/>`).join(""),
  ).join("");

const panels = (x, y, cols, rows, w, h, skew, hot = []) =>
  Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const px = x + c * (w + 6) - r * skew;
      const py = y + r * (h + 6);
      const isHot = hot.some(([hc, hr]) => hc === c && hr === r);
      return `<path d="M${px + skew} ${py} h${w} l${-skew} ${h} h${-w} z" fill="${isHot ? ORANGE : "#27527a"}" stroke="#a9c4dc" stroke-width="1.5"/>`;
    }).join(""),
  ).join("");

// 1. トップ（ヒーロー）
fs.writeFileSync(
  path.join(OUT, "drone-building-inspection-hero.svg"),
  wrap(
    1200,
    800,
    "ドローンが工場・ビルを点検するイメージ",
    `
<circle cx="960" cy="140" r="70" fill="#fff" opacity="0.7"/>
<rect x="0" y="640" width="1200" height="160" fill="#b6c9da"/>
<rect x="0" y="700" width="1200" height="100" fill="#9fb6ca"/>
<!-- ビル -->
<rect x="130" y="260" width="200" height="400" fill="#1b3b5a"/>
${windows(150, 285, 4, 8, 44, 44, 28, 26, "#7fb0d8")}
<rect x="120" y="248" width="220" height="16" fill="${NAVY}"/>
<!-- 工場 -->
<path d="M380 660 V430 l90 -50 v50 l90 -50 v50 l90 -50 v50 l90 -50 v50 l90 -50 V660 z" fill="#34597d"/>
<rect x="380" y="560" width="440" height="100" fill="#27476a"/>
${[400, 480, 560, 640, 720].map((x) => `<rect x="${x}" y="585" width="62" height="75" fill="#16324d"/>`).join("")}
<rect x="800" y="330" width="26" height="130" fill="#6d8ca8"/>
<rect x="795" y="320" width="36" height="14" fill="#546f89"/>
<!-- 太陽光 -->
${panels(870, 600, 3, 2, 70, 42, 18)}
<!-- ドローン -->
${beam(560, 190, 430, 430, 700, 430)}
${drone(560, 190, 1.5)}
<g fill="none" stroke="${ORANGE}" stroke-width="4" stroke-dasharray="8 6"><rect x="600" y="378" width="70" height="46" rx="4"/></g>
`,
    "ドローンが工場の屋根を上空から撮影している様子を表した、イメージイラストです。",
  ),
);

// 2. 太陽光
fs.writeFileSync(
  path.join(OUT, "drone-solar-panel-inspection.svg"),
  wrap(
    1000,
    700,
    "太陽光パネルを点検するドローンのイメージ",
    `
<circle cx="860" cy="110" r="56" fill="#fff" opacity="0.8"/>
<path d="M0 480 L1000 400 V700 H0 z" fill="#9fb6ca"/>
${panels(150, 420, 8, 3, 80, 46, 30, [[3, 1], [6, 2]])}
${beam(500, 170, 330, 440, 700, 440)}
${drone(500, 170, 1.6)}
<g fill="none" stroke="${ORANGE}" stroke-width="4" stroke-dasharray="8 6"><rect x="353" y="468" width="96" height="62" rx="4"/></g>
<text x="360" y="455" font-size="22" font-weight="700" fill="${ORANGE}" font-family="sans-serif">異常候補</text>
`,
    "ドローンが太陽光パネルを上空から撮影し、温度の異常候補を確認しているイメージです。",
  ),
);

// 3. 建設現場
fs.writeFileSync(
  path.join(OUT, "drone-construction-site-survey.svg"),
  wrap(
    1000,
    700,
    "建設現場を撮影するドローンのイメージ",
    `
<rect x="0" y="560" width="1000" height="140" fill="#aebfce"/>
<!-- 建物の骨組み -->
${[0, 1, 2, 3].map((f) => `<rect x="300" y="${470 - f * 90}" width="320" height="10" fill="#4a6b8a"/>`).join("")}
${[300, 400, 500, 610].map((x) => `<rect x="${x}" y="200" width="10" height="360" fill="#34597d"/>`).join("")}
<!-- クレーン -->
<rect x="760" y="140" width="14" height="420" fill="#d9a441"/>
<rect x="560" y="140" width="330" height="12" fill="#d9a441"/>
<path d="M760 140 L690 100 L840 100 Z" fill="none" stroke="#d9a441" stroke-width="5"/>
<path d="M600 152 V230" stroke="${NAVY}" stroke-width="3"/>
<rect x="585" y="230" width="30" height="22" fill="${NAVY}"/>
<!-- 資材 -->
<rect x="110" y="520" width="90" height="40" fill="#8ea6bd"/><rect x="130" y="490" width="90" height="30" fill="#7690a8"/>
${beam(300, 150, 120, 540, 520, 560)}
${drone(300, 150, 1.5)}
`,
    "ドローンが建設現場を上空から撮影し、工程の進み具合を記録しているイメージです。",
  ),
);

// 4. 屋根・外壁
fs.writeFileSync(
  path.join(OUT, "drone-roof-wall-inspection.svg"),
  wrap(
    1000,
    700,
    "建物の外壁と屋根を点検するドローンのイメージ",
    `
<rect x="0" y="600" width="1000" height="100" fill="#aebfce"/>
<rect x="470" y="150" width="300" height="450" fill="#d7dee6" stroke="#8ea6bd" stroke-width="3"/>
<path d="M450 150 L620 80 L790 150 Z" fill="#34597d"/>
${windows(500, 190, 5, 7, 56, 56, 38, 34, "#8fb6d6")}
<path d="M690 330 l14 28 -10 22 18 30" fill="none" stroke="${NAVY}" stroke-width="3"/>
<g fill="none" stroke="${ORANGE}" stroke-width="4" stroke-dasharray="8 6"><rect x="660" y="318" width="74" height="106" rx="4"/></g>
${beam(240, 280, 470, 300, 470, 460)}
${drone(240, 280, 1.5)}
<text x="650" y="305" font-size="22" font-weight="700" fill="${ORANGE}" font-family="sans-serif">ひび割れ候補</text>
`,
    "ドローンが建物の外壁を撮影し、ひび割れなどの候補を確認しているイメージです。",
  ),
);

// 5. 工場・倉庫
fs.writeFileSync(
  path.join(OUT, "drone-factory-warehouse-inspection.svg"),
  wrap(
    1000,
    700,
    "工場・倉庫の屋根を点検するドローンのイメージ",
    `
<rect x="0" y="560" width="1000" height="140" fill="#aebfce"/>
<path d="M100 560 V360 L500 300 L900 360 V560 Z" fill="#34597d"/>
<path d="M100 360 L500 300 L900 360 L500 340 Z" fill="#4a6f93"/>
${Array.from({ length: 12 }, (_, i) => `<line x1="${130 + i * 65}" y1="${355 - i * 0.5}" x2="${130 + i * 65}" y2="${345 + 0}" stroke="#7b9bb9" stroke-width="2"/>`).join("")}
${[170, 330, 490, 650].map((x) => `<rect x="${x}" y="450" width="110" height="110" fill="#16324d"/>`).join("")}
<rect x="760" y="250" width="40" height="70" fill="#6d8ca8"/><rect x="752" y="240" width="56" height="12" fill="#546f89"/>
${beam(450, 130, 250, 340, 760, 360)}
${drone(450, 130, 1.6)}
<g fill="none" stroke="${ORANGE}" stroke-width="4" stroke-dasharray="8 6"><rect x="560" y="330" width="90" height="36" rx="4"/></g>
`,
    "ドローンが工場や倉庫の大きな屋根を上空から撮影しているイメージです。",
  ),
);

console.log("generated:", fs.readdirSync(OUT).join(", "));
