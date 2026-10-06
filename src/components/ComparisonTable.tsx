type Row = { item: string; conventional: string; drone: string };

/** 従来方法との比較表。スマホでは項目ごとのカードに切り替わります。 */
export function ComparisonTable({ rows, note }: { rows: Row[]; note?: string }) {
  return (
    <div>
      {/* PC */}
      <div className="hidden overflow-hidden rounded-xl border border-line md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">従来方法とドローン点検の比較</caption>
          <thead>
            <tr className="bg-navy text-white">
              <th scope="col" className="w-36 px-4 py-3 font-bold">
                比較項目
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                従来方法
              </th>
              <th scope="col" className="bg-blue px-4 py-3 font-bold">
                ドローン点検
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.item} className="border-t border-line">
                <th scope="row" className="bg-light px-4 py-3 font-bold text-navy">
                  {r.item}
                </th>
                <td className="px-4 py-3 text-muted">{r.conventional}</td>
                <td className="bg-blue-tint/50 px-4 py-3 text-ink">{r.drone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* スマホ */}
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.item} className="rounded-xl border border-line bg-white p-4">
            <p className="font-bold text-navy">{r.item}</p>
            <p className="mt-2 text-sm">
              <span className="mr-2 rounded bg-light px-1.5 py-0.5 text-xs font-bold text-muted">従来</span>
              {r.conventional}
            </p>
            <p className="mt-2 text-sm">
              <span className="mr-2 rounded bg-blue px-1.5 py-0.5 text-xs font-bold text-white">ドローン</span>
              {r.drone}
            </p>
          </li>
        ))}
      </ul>
      {note && <p className="mt-3 text-xs text-muted">※ {note}</p>}
    </div>
  );
}
