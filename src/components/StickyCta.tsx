"use client";

import { usePathname } from "next/navigation";
import { contact } from "@/config/contact";
import { TrackedAnchor, TrackedLink } from "./TrackedLink";

/** スマホ下部固定CTA。見積・問い合わせページでは非表示。 */
export function StickyCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/estimate") || pathname.startsWith("/contact")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 py-2 shadow-[0_-4px_12px_rgba(11,31,51,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        {contact.phone && contact.phoneHref ? (
          <TrackedAnchor
            href={contact.phoneHref}
            event="phone_click"
            eventParams={{ location: "sticky" }}
            className="btn btn-secondary flex-1 !min-h-11 !px-3 !py-2 text-sm"
          >
            電話
          </TrackedAnchor>
        ) : (
          <TrackedLink
            href="/pricing"
            event="pricing_view"
            eventParams={{ location: "sticky" }}
            className="btn btn-secondary flex-1 !min-h-11 !px-3 !py-2 text-sm"
          >
            料金を見る
          </TrackedLink>
        )}
        <TrackedLink
          href="/estimate"
          event="contact_click"
          eventParams={{ location: "sticky", target: "estimate" }}
          className="btn btn-primary flex-[1.4] !min-h-11 !px-3 !py-2 text-sm"
        >
          無料見積
        </TrackedLink>
      </div>
    </div>
  );
}

