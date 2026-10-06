import Image from "next/image";
import Link from "next/link";
import { features } from "@/config/features";
import { startingPrice, yenFrom } from "@/config/pricing";
import { cannotFly, safetyItems, flowSteps } from "@/content/common";
import { getService } from "@/content/services";
import { getAllGuides } from "@/lib/guides";
import { Breadcrumb } from "./Breadcrumb";
import { ComparisonTable } from "./ComparisonTable";
import { CtaBanner } from "./CtaBanner";
import { EquipmentSection } from "./EquipmentSection";
import { EstimateSection } from "./EstimateSection";
import { Faq } from "./Faq";
import { GuideCard } from "./GuideCard";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";
import { Merits } from "./Merits";
import { PriceCta, PriceDisclaimer, PriceNotes, PriceTable } from "./PricingTable";
import { ProcessSteps } from "./ProcessSteps";
import { ReportPreview } from "./ReportPreview";
import { RichBlocks } from "./RichBlocks";
import { Section } from "./Section";
import { TrackedLink } from "./TrackedLink";
import { serviceJsonLd } from "@/lib/seo";
import type { ServiceId } from "@/config/pricing";

/** サービスLPの共通骨格。内容（検索意図に合わせた文章）は src/content/services.ts で個別に定義します。 */
export function ServicePage({ id }: { id: ServiceId }) {
  const s = getService(id)!;
  const guides = s.guides.flatMap((slug) => getAllGuides().filter((g) => g.slug === slug));
  const extra = s.extraSections ?? [];
  const extraBefore = extra.filter((e) => e.id !== "comprehensive");
  const extraAfter = extra.filter((e) => e.id === "comprehensive");

  return (
    <>
      <JsonLd data={serviceJsonLd(id)} />
      <Breadcrumb items={[{ name: "サービス", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }]} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-tint to-white">
        <div className="container-x grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <Icon name={s.icon} className="h-5 w-5" />
              {s.name}
            </p>
            <h1 className="mt-3 text-3xl leading-[1.4] sm:text-4xl">{s.h1}</h1>
            <p className="mt-5 text-base leading-8 text-muted">{s.heroLead}</p>
            {features.pricingEnabled && (
              <p className="mt-5 inline-flex items-baseline gap-2 rounded-lg border border-line bg-white px-4 py-2">
                <span className="text-sm text-muted">料金の目安</span>
                <span className="text-2xl font-bold text-navy">{yenFrom(startingPrice[id])}</span>
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="#estimate"
                event="contact_click"
                eventParams={{ location: "service_hero", target: "estimate", service: id }}
                className="btn btn-primary btn-lg"
              >
                60秒で料金を確認
              </TrackedLink>
              <Link href="#pricing" className="btn btn-secondary btn-lg">
                料金表を見る
              </Link>
            </div>
          </div>
          <Image
            src={s.heroImage.src}
            alt={s.heroImage.alt}
            width={1000}
            height={700}
            priority
            unoptimized
            className="h-auto w-full rounded-2xl border border-line shadow-sm"
          />
        </div>
      </section>

      {/* 料金・簡易見積CTA */}
      <EstimateSection initialService={id} placement={`service_${id}`} title={`${s.short}の点検、いくらかかる？`} lead="規模を選ぶだけで、概算料金が分かります。正式なお見積りは無料です。" />

      <Section eyebrow="CHALLENGES" title={s.problemsTitle} tone="white">
        <ul className="grid gap-3 md:grid-cols-2">
          {s.problems.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
              <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-blue" />
              <span className="leading-7">{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="ABOUT" title={s.explainTitle} tone="light">
        <div className="max-w-3xl space-y-4 leading-8">
          {s.explain.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </Section>

      <Section eyebrow="WHAT WE CHECK" title={s.checksTitle} lead={s.checksLead} tone="white">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.checks.map((c) => (
            <li key={c.label} className="rounded-xl border border-line bg-white p-5">
              <h3 className="text-lg">{c.label}</h3>
              <p className="mt-1 text-sm leading-7 text-muted">{c.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {extraBefore.map((e, i) => (
        <Section key={e.id} id={e.id} title={e.title} lead={e.lead} tone={i % 2 === 0 ? "light" : "white"}>
          <RichBlocks blocks={e.blocks} />
        </Section>
      ))}

      {id === "roof-wall" && <LegalSection />}

      <Section eyebrow="MERITS" title="ドローンを使うメリット" tone="light">
        <Merits />
      </Section>

      <Section id="pricing" eyebrow="PRICING" title={`${s.name}の料金`} lead="必要な点検だけを選べる、明朗な料金設定です。" tone="white">
        <div className="max-w-3xl">
          <PriceTable service={id} />
          {features.pricingEnabled && (
            <ul className="mt-4 list-disc space-y-1 pl-6 text-sm leading-7 text-muted">
              {s.priceNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
          <PriceDisclaimer />
        </div>
        <div className="mt-8">
          <PriceNotes />
        </div>
        <PriceCta service={id} />
      </Section>

      <Section eyebrow="COMPARISON" title="従来方法との比較" tone="light">
        <ComparisonTable rows={s.comparison} note={s.comparisonNote} />
      </Section>

      <Section eyebrow="REPORT" title={s.reportTitle} lead={s.reportLead} tone="white">
        <ReportPreview points={s.reportPoints} />
      </Section>

      <Section id="flow" eyebrow="FLOW" title="点検の流れ" tone="light">
        <ProcessSteps steps={s.flow ?? flowSteps} />
      </Section>

      <Section eyebrow="SAFETY" title="安全管理" lead="安全を最優先に、次の点を確認したうえで飛行します。" tone="white">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <ul className="space-y-3">
            {safetyItems.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm leading-7 sm:text-base">
                <Icon name="shield" className="mt-1 h-5 w-5 shrink-0 text-blue" />
                {t}
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-line bg-light p-5">
            <h3 className="text-lg">飛行できないケース</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
              {cannotFly.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <EquipmentSection />

      {extraAfter.map((e) => (
        <Section key={e.id} id={e.id} title={e.title} lead={e.lead} tone="light">
          <RichBlocks blocks={e.blocks} />
        </Section>
      ))}

      {guides.length > 0 && (
        <Section eyebrow="GUIDES" title="関連するお役立ち情報" tone="white">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </Section>
      )}

      <Section eyebrow="FAQ" title="よくあるご質問" center tone="light">
        <Faq items={s.faqs} />
      </Section>

      <CtaBanner
        location={`service_${id}_bottom`}
        title={`${s.name}の無料見積を依頼する`}
        text="60秒で料金の目安を確認したうえで、正式なお見積りを無料でご依頼いただけます。"
      />
    </>
  );
}

/** 法制度（屋根・外壁LP）。法定点検への対応は、資格者との連携確認が済むまで表示しません。 */
function LegalSection() {
  return (
    <Section id="law" eyebrow="LAW" title="法制度について" tone="white">
      <div className="max-w-3xl space-y-4 leading-8">
        <p>
          建築基準法に基づく定期調査の外壁調査では、国土交通省の告示の改正（令和4年）により、一定の条件のもとで、ドローン（無人航空機）に搭載した赤外線装置による調査が、調査方法の一つとして位置付けられています。
        </p>
        <p>
          どのような建物・調査が対象となるか、また調査に必要な資格や条件は、建物の種類・規模・経過年数などによって異なります。最新の告示・通知の内容は、国土交通省や所管の行政庁の情報をご確認ください。
        </p>
        <p className="rounded-lg border border-blue/30 bg-blue-tint p-4 text-sm leading-7">
          法定点検としての利用をご希望の場合は、対象建物・調査内容・必要資格等によって扱いが異なりますので、事前にご相談ください。
        </p>
        {features.legalInspectionEnabled && (
          <p>有資格者との連携のもと、法定点検の外壁調査としての実施についてもご相談を承ります。</p>
        )}
      </div>
    </Section>
  );
}
