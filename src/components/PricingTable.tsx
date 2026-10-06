import Link from "next/link";
import { pricing, type ServiceId } from "@/config/pricing";
import { features } from "@/config/features";
import { getPriceRows } from "@/lib/priceRows";
import { services } from "@/content/services";
import { TrackedLink } from "./TrackedLink";

/** 1サービス分の料金表。pricing.ts の値から自動生成されます。 */
export function PriceTable({ service, showLink = false }: { service: ServiceId; showLink?: boolean }) {
  const rows = getPriceRows(service);
  const s = services[service];
  return (
    <div className="rounded-xl border border-line bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-light px-4 py-3 sm:px-5">
        <h3 className="text-lg">{s.name}</h3>
        {showLink && (
          <Link href={`/services/${s.slug}`} className="text-sm font-bold text-blue-dark underline underline-offset-4">
            詳しく見る
          </Link>
        )}
      </div>
      {features.pricingEnabled ? (
        <table className="w-full text-left text-sm sm:text-base">
          <caption className="sr-only">{s.name}の料金の目安</caption>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line first:border-t-0">
                <th scope="row" className="px-4 py-3 font-medium text-ink sm:px-5">
                  {r.label}
                  {r.note && <span className="block text-xs font-normal text-muted">{r.note}</span>}
                </th>
                <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-navy sm:px-5">{r.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="px-5 py-4 text-sm text-muted">料金は条件を確認後、お見積りでご案内します。</p>
      )}
    </div>
  );
}

/** 料金に含まれる想定項目・追加料金・注意書き */
export function PriceNotes() {
  const included = pricing.includes.filter((i) => i.enabled);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {included.length > 0 && (
        <div className="rounded-xl border border-line bg-white p-5">
          <h3 className="text-lg">料金に含まれる想定項目</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {included.map((i) => (
              <li key={i.id} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ok" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                {i.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="rounded-xl border border-line bg-white p-5">
        <h3 className="text-lg">現場により追加料金が必要になる場合</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {pricing.extras.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PriceDisclaimer() {
  return (
    <p className="mt-4 text-sm leading-7 text-muted">
      {pricing.disclaimer}
      <br />
      {pricing.taxNote}
    </p>
  );
}

export function PriceCta({ service }: { service?: ServiceId }) {
  return (
    <div className="mt-6">
      <TrackedLink
        href="/estimate"
        event="contact_click"
        eventParams={{ location: "price", target: "estimate", service }}
        className="btn btn-primary btn-lg w-full sm:w-auto"
      >
        自分の施設の場合は？60秒で料金を確認
      </TrackedLink>
    </div>
  );
}
