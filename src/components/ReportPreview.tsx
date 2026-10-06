import { site } from "@/config/site";

/**
 * 報告書イメージ。架空の建物を使ったサンプルであり、実際の案件の報告書ではありません。
 * ・「報告書イメージ」の表示を必ず残すこと。
 */
export function ReportPreview({ points }: { points?: string[] }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
      <figure className="relative mx-auto w-full max-w-xl" aria-label="報告書イメージ（架空の建物を使用したサンプル）">
        <span className="absolute -top-3 left-4 z-10 rounded-full bg-cta px-3 py-1 text-xs font-bold text-white shadow">報告書イメージ</span>
        <div className="rounded-xl border border-line bg-white p-4 shadow-md sm:p-6">
          <div className="flex items-start justify-between border-b border-line pb-3">
            <div>
              <p className="text-xs text-muted">点検報告書</p>
              <p className="text-base font-bold text-navy">サンプル倉庫 屋根点検</p>
            </div>
            <p className="text-right text-[11px] leading-5 text-muted">
              撮影日：2026年◯月◯日
              <br />
              {site.name}
            </p>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:text-xs">
            <div className="flex gap-1">
              <dt className="text-muted">施設概要：</dt>
              <dd>鉄骨造・平屋（架空）</dd>
            </div>
            <div className="flex gap-1">
              <dt className="text-muted">点検範囲：</dt>
              <dd>屋根全面</dd>
            </div>
          </dl>

          <div className="mt-3 grid grid-cols-[1.2fr_1fr] gap-3">
            {/* 位置図 */}
            <div className="rounded-lg border border-line bg-light p-2">
              <p className="mb-1 text-[11px] font-bold text-navy">位置図・撮影位置</p>
              <svg viewBox="0 0 200 120" className="w-full" role="img" aria-label="屋根の位置図のイメージ。撮影位置1〜4と異常候補箇所A・Bを示しています">
                <rect x="20" y="20" width="160" height="80" fill="#dfe7ee" stroke="#8fa3b5" strokeWidth="1.5" />
                {[40, 70, 100, 130, 160].map((x) => (
                  <line key={x} x1={x} y1="20" x2={x} y2="100" stroke="#b9c7d3" strokeWidth="1" />
                ))}
                {[
                  [45, 35, "1"],
                  [150, 35, "2"],
                  [45, 85, "3"],
                  [150, 85, "4"],
                ].map(([x, y, n]) => (
                  <g key={n as string}>
                    <circle cx={x as number} cy={y as number} r="7" fill="#1769aa" />
                    <text x={x as number} y={(y as number) + 3.5} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">
                      {n}
                    </text>
                  </g>
                ))}
                <rect x="95" y="50" width="22" height="16" fill="none" stroke="#be4f05" strokeWidth="2" strokeDasharray="3 2" />
                <text x="106" y="46" textAnchor="middle" fontSize="9" fill="#be4f05" fontWeight="700">
                  A
                </text>
                <rect x="55" y="62" width="14" height="12" fill="none" stroke="#be4f05" strokeWidth="2" strokeDasharray="3 2" />
                <text x="62" y="58" textAnchor="middle" fontSize="9" fill="#be4f05" fontWeight="700">
                  B
                </text>
              </svg>
            </div>
            {/* 写真 */}
            <div className="space-y-2">
              {["写真 No.01", "写真 No.02"].map((label, i) => (
                <div key={label} className="rounded-lg border border-line p-1.5">
                  <div className={`h-12 rounded ${i === 0 ? "bg-gradient-to-br from-slate-300 to-slate-400" : "bg-gradient-to-br from-slate-200 to-slate-400"}`} aria-hidden="true" />
                  <p className="mt-1 text-[10px] text-muted">{label}（サンプル画像）</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-cta/30 bg-cta/5 p-2.5">
            <p className="text-[11px] font-bold text-cta">異常候補箇所</p>
            <ul className="mt-1 space-y-0.5 text-[11px] leading-5 text-ink">
              <li>A：屋根材の浮きの可能性（写真 No.01）</li>
              <li>B：錆の進行が見られる箇所（写真 No.02）</li>
            </ul>
          </div>
        </div>
        <figcaption className="mt-3 text-xs text-muted">※ 架空の建物を使用した、報告書のレイアウトイメージです。実際の案件の報告書ではありません。</figcaption>
      </figure>

      <div>
        <p className="font-bold text-navy">報告書に含まれる主な内容</p>
        <ul className="mt-3 space-y-2">
          {(points ?? ["施設概要", "撮影位置", "写真番号", "画像", "異常候補箇所", "コメント", "位置図", "撮影日"]).map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm leading-7">
              <svg viewBox="0 0 24 24" className="mt-1.5 h-4 w-4 shrink-0 text-ok" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
