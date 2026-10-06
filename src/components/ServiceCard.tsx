import { features } from "@/config/features";
import { startingPrice, yenFrom } from "@/config/pricing";
import type { ServiceContent } from "@/content/types";
import { Icon } from "./Icon";
import { TrackedLink } from "./TrackedLink";

/** TOPの4サービスカード */
export function ServiceCard({ s }: { s: ServiceContent }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition hover:border-blue hover:shadow-md sm:p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-tint text-blue">
        <Icon name={s.icon} className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-xl">{s.name}</h3>
      {features.pricingEnabled && <p className="mt-1 text-sm font-bold text-blue-dark">{yenFrom(startingPrice[s.id])}</p>}
      <p className="mt-2 flex-1 text-sm leading-7 text-muted">{s.summary}</p>
      <TrackedLink
        href={`/services/${s.slug}`}
        event="service_click"
        eventParams={{ service: s.slug, location: "home_cards" }}
        className="btn btn-secondary mt-5 w-full !min-h-11 text-sm"
      >
        {s.cta}
      </TrackedLink>
    </article>
  );
}
