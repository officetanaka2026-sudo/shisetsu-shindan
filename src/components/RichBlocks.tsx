import type { Block } from "@/content/types";

/** サービスLPの追加セクション用。段落・リスト・表・注記を描画します。 */
export function RichBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-base leading-8 text-ink">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h3":
            return (
              <h3 key={i} className="pt-2 text-xl">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc space-y-2 pl-6">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case "note":
            return (
              <p key={i} className="rounded-lg border border-blue/30 bg-blue-tint p-4 text-sm leading-7 text-ink">
                {b.text}
              </p>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-navy text-white">
                      {b.head.map((h, j) => (
                        <th key={j} scope="col" className="px-4 py-3 font-bold">
                          {h || <span className="sr-only">項目</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri} className="border-t border-line align-top">
                        {r.map((c, ci) =>
                          ci === 0 ? (
                            <th key={ci} scope="row" className="bg-light px-4 py-3 font-bold text-navy">
                              {c}
                            </th>
                          ) : (
                            <td key={ci} className="px-4 py-3">
                              {c}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
