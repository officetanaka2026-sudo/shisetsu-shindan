import { contact } from "@/config/contact";
import { TrackedAnchor, TrackedLink } from "./TrackedLink";

type Props = {
  title?: string;
  text?: string;
  primaryLabel?: string;
  /** GAのパラメータ用の識別子 */
  location?: string;
};

/** ページ最下部などに置く最終CTA */
export function CtaBanner({
  title = "まずは60秒で、料金の目安を確認してください",
  text = "点検内容と施設規模を選ぶだけ。連絡先を入力する前に、概算料金が分かります。正式なお見積りは無料です。",
  primaryLabel = "60秒で料金を確認",
  location = "cta_banner",
}: Props) {
  return (
    <section className="bg-navy py-14 text-center text-white sm:py-16">
      <div className="container-x">
        <h2 className="text-2xl !text-white sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">{text}</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <TrackedLink
            href="/estimate"
            event="contact_click"
            eventParams={{ location, target: "estimate" }}
            className="btn btn-primary btn-lg w-full sm:w-auto"
          >
            {primaryLabel}
          </TrackedLink>
          <TrackedLink
            href="/contact"
            event="contact_click"
            eventParams={{ location, target: "contact" }}
            className="btn btn-ghost-light w-full sm:w-auto"
          >
            通常のお問い合わせフォーム
          </TrackedLink>
        </div>
        {(contact.phone || contact.email) && (
          <p className="mt-5 text-sm text-white/80">
            {contact.phone && contact.phoneHref && (
              <TrackedAnchor href={contact.phoneHref} event="phone_click" eventParams={{ location }} className="underline underline-offset-4">
                お電話：{contact.phone}
              </TrackedAnchor>
            )}
            {contact.phone && contact.email && <span className="mx-3" />}
            {contact.email && contact.emailHref && (
              <TrackedAnchor href={contact.emailHref} event="email_click" eventParams={{ location }} className="underline underline-offset-4">
                メール：{contact.email}
              </TrackedAnchor>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
