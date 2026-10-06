import type { Faq as FaqItem } from "@/content/types";

/**
 * よくある質問。<details> を使うため、本文はサーバー側で出力され、検索エンジンにも読める状態です。
 * （FAQリッチリザルトの表示を目的とした実装ではありません。ユーザーの疑問解消のためのコンテンツです。）
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-xl border border-line bg-white">
      {items.map((it) => (
        <details key={it.q} className="group p-4 sm:p-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-bold text-navy [&::-webkit-details-marker]:hidden">
            <span>
              <span className="mr-2 text-blue">Q.</span>
              {it.q}
            </span>
            <svg viewBox="0 0 12 12" className="mt-2 h-3 w-3 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true">
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </summary>
          <p className="mt-3 pl-7 text-sm leading-7 text-muted sm:text-base sm:leading-8">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
