import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { EstimateSection } from "@/components/EstimateSection";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/Section";
import { TrackedLink } from "@/components/TrackedLink";
import { features } from "@/config/features";
import { startingPrice, yenFrom } from "@/config/pricing";
import { areaList, getArea } from "@/content/areas";
import { services } from "@/content/services";
import { areaServiceJsonLd, buildMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return areaList.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArea(slug);
  if (!a) return {};
  return buildMetadata({ title: a.title, description: a.metaDescription, path: `/areas/${a.slug}` });
}

export default async function AreaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const a = getArea(slug);
  if (!a) notFound();
  const others = areaList.filter((x) => x.slug !== a.slug);

  return (
    <>
      <JsonLd data={areaServiceJsonLd(a)} />
      <Breadcrumb items={[{ name: "対応エリア", path: "/areas" }, { name: a.name, path: `/areas/${a.slug}` }]} />

      <section className="bg-gradient-to-b from-blue-tint to-white">
        <div className="container-x py-10 sm:py-14">
          <p className="eyebrow flex items-center gap-2">
            <Icon name="area" className="h-5 w-5" />
            対応エリア：{a.name}
          </p>
          <h1 className="mt-3 text-3xl leading-[1.4] sm:text-4xl">{a.h1}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{a.lead}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href="#estimate"
              event="contact_click"
              eventParams={{ location: `area_${a.slug}_hero`, target: "estimate" }}
              className="btn btn-primary btn-lg"
            >
              60秒で料金を確認
            </TrackedLink>
            <Link href="#services" className="btn btn-secondary btn-lg">
              対応サービスを見る
            </Link>
          </div>
        </div>
      </section>

      <Section eyebrow="NEEDS" title={a.needsTitle} tone="white">
        <ul className="grid gap-3 md:grid-cols-2">
          {a.needs.map((n) => (
            <li key={n} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
              <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-blue" />
              <span className="leading-7">{n}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="services" eyebrow="SERVICES" title={`${a.name}で対応しているドローン点検`} tone="light">
        <ul className="grid gap-4 sm:grid-cols-2">
          {a.focusServices.map((id) => {
            const s = services[id];
            return (
              <li key={id} className="flex flex-col rounded-xl border border-line bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-tint text-blue">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg">
                    {a.short}の{s.name}
                  </h3>
                </div>
                {features.pricingEnabled && <p className="mt-2 text-sm font-bold text-blue-dark">料金の目安 {yenFrom(startingPrice[id])}</p>}
                <p className="mt-2 flex-1 text-sm leading-7 text-muted">{a.serviceNotes[id] ?? s.summary}</p>
                <TrackedLink
                  href={`/services/${s.slug}`}
                  event="service_click"
                  eventParams={{ service: s.slug, location: `area_${a.slug}` }}
                  className="btn btn-secondary mt-4 w-full !min-h-11 text-sm"
                >
                  {s.name}の詳細
                </TrackedLink>
              </li>
            );
          })}
        </ul>
      </Section>

      <EstimateSection placement={`area_${a.slug}`} title={`${a.name}の施設の点検、いくらかかる？`} lead="点検内容と規模を選ぶだけで、概算料金が分かります。正式なお見積りは無料です。" />

      <Section eyebrow="RULES" title={`${a.name}で飛行する前に確認すること`} lead="ドローンの飛行には、場所に応じた法令や施設のルールがあります。事前に確認し、必要な手続きを行ったうえで実施します。" tone="white">
        <ul className="max-w-3xl space-y-3">
          {a.rules.map((r) => (
            <li key={r} className="flex items-start gap-3 text-sm leading-7 sm:text-base">
              <Icon name="shield" className="mt-1 h-5 w-5 shrink-0 text-blue" />
              {r}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="AREA" title={`${a.name}の主な対応地域`} tone="light">
        <ul className="flex flex-wrap gap-2">
          {a.cities.map((c) => (
            <li key={c} className="rounded-full border border-line bg-white px-3 py-1 text-sm">
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">記載のない市区町村も対応しています。現地までの距離によっては、交通費等が別途必要になる場合があります。</p>
        <p className="mt-6 text-sm">
          ほかの対応エリア：
          {others.map((o, i) => (
            <span key={o.slug}>
              {i > 0 && "／"}
              <Link href={`/areas/${o.slug}`} className="font-bold text-blue-dark underline underline-offset-4">
                {o.name}
              </Link>
            </span>
          ))}
        </p>
      </Section>

      <Section eyebrow="FAQ" title={`${a.name}のドローン点検でよくあるご質問`} center tone="white">
        <Faq items={a.faqs} />
      </Section>

      <CtaBanner location={`area_${a.slug}_bottom`} title={`${a.name}の施設の点検を相談する`} text="60秒で料金の目安を確認したうえで、正式なお見積りを無料でご依頼いただけます。" />
    </>
  );
}
