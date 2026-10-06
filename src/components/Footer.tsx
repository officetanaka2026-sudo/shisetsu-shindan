import Link from "next/link";
import { site } from "@/config/site";
import { contact } from "@/config/contact";
import { features } from "@/config/features";
import { serviceList } from "@/content/services";
import { TrackedAnchor } from "./TrackedLink";

export function Footer() {
  return (
    <footer className="bg-navy pb-24 text-white/85 md:pb-0">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-lg font-bold text-white">{site.name}</p>
          <p className="mt-1 text-sm text-white/70">{site.tagline}</p>
          <p className="mt-4 text-sm leading-7">
            {site.businessDescription}。
            <br />
            対応地域：{site.areaText}
          </p>
          {(contact.phone || contact.email) && (
            <ul className="mt-4 space-y-1 text-sm">
              {contact.phone && contact.phoneHref && (
                <li>
                  <TrackedAnchor href={contact.phoneHref} event="phone_click" eventParams={{ location: "footer" }} className="underline underline-offset-4">
                    電話：{contact.phone}
                  </TrackedAnchor>
                </li>
              )}
              {contact.email && contact.emailHref && (
                <li>
                  <TrackedAnchor href={contact.emailHref} event="email_click" eventParams={{ location: "footer" }} className="underline underline-offset-4">
                    メール：{contact.email}
                  </TrackedAnchor>
                </li>
              )}
            </ul>
          )}
        </div>

        <nav aria-label="サービス">
          <p className="text-sm font-bold text-white">サービス</p>
          <ul className="mt-3 space-y-2 text-sm">
            {serviceList.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:underline">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="料金・見積">
          <p className="text-sm font-bold text-white">料金・ご相談</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/pricing" className="hover:underline">
                料金
              </Link>
            </li>
            <li>
              <Link href="/estimate" className="hover:underline">
                60秒簡易見積
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                お問い合わせ
              </Link>
            </li>
            <li>
              <Link href="/#flow" className="hover:underline">
                点検の流れ
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="会社情報">
          <p className="text-sm font-bold text-white">{site.name}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                施設診断技研について
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:underline">
                お役立ち情報
              </Link>
            </li>
            {features.casesEnabled && (
              <li>
                <Link href="/cases" className="hover:underline">
                  導入事例
                </Link>
              </li>
            )}
            <li>
              <Link href="/privacy" className="hover:underline">
                プライバシーポリシー
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <p className="container-x py-4 text-xs text-white/60">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
