import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactForm } from "@/components/ContactForm";
import { TrackedAnchor } from "@/components/TrackedLink";
import { contact } from "@/config/contact";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "お問い合わせ・無料見積のご依頼｜施設診断技研",
  description: "ドローンによる施設・設備の点検に関するご相談・お見積りのご依頼フォームです。会社名・担当者名・連絡先だけで送信でき、見積は無料です。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumb items={[{ name: "お問い合わせ", path: "/contact" }]} />
      <section className="section bg-light">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <p className="eyebrow">CONTACT</p>
            <h1 className="mt-1 text-2xl sm:text-3xl">お問い合わせ・無料見積のご依頼</h1>
            <p className="mt-4 leading-8 text-muted">
              ご相談・お見積りは無料です。必要な項目だけご入力ください。
              料金の目安をすぐに知りたい場合は、
              <Link href="/estimate" className="font-bold text-blue-dark underline underline-offset-4">
                60秒簡易見積
              </Link>
              もご利用いただけます。
            </p>
            {(contact.phone || contact.email) && (
              <p className="mt-3 text-sm text-muted">
                {contact.phone && contact.phoneHref && (
                  <TrackedAnchor href={contact.phoneHref} event="phone_click" eventParams={{ location: "contact_page" }} className="font-bold text-navy underline underline-offset-4">
                    お電話：{contact.phone}
                  </TrackedAnchor>
                )}
                {contact.phone && contact.email && <span className="mx-3" />}
                {contact.email && contact.emailHref && (
                  <TrackedAnchor href={contact.emailHref} event="email_click" eventParams={{ location: "contact_page" }} className="font-bold text-navy underline underline-offset-4">
                    メール：{contact.email}
                  </TrackedAnchor>
                )}
              </p>
            )}
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
