import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { features } from "@/config/features";
import { startingPrice, yenFrom } from "@/config/pricing";
import { serviceList } from "@/content/services";
import { commonFaqs as c } from "@/content/common";
import { buildMetadata, homeDescription, homeTitle } from "@/lib/seo";
import { EstimateSection } from "@/components/EstimateSection";
import { ServiceCard } from "@/components/ServiceCard";
import { Section } from "@/components/Section";
import { Merits } from "@/components/Merits";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ReportPreview } from "@/components/ReportPreview";
import { AreaSection } from "@/components/AreaSection";
import { Faq } from "@/components/Faq";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { Phrases } from "@/components/Phrases";
import { TrackedLink } from "@/components/TrackedLink";
import type { IconName } from "@/content/types";

export const metadata: Metadata = buildMetadata({ title: homeTitle, description: homeDescription, path: "/" });

const trust: { icon: IconName; label: string; sub: string }[] = [
  { icon: "area", label: "関東対応", sub: "東京・神奈川・埼玉・千葉" },
  { icon: "yen", label: "明朗料金", sub: "事前に費用感が分かる" },
  { icon: "check", label: "法人対応", sub: "管理会社・工場・建設会社" },
  { icon: "document", label: "無料見積", sub: "お見積りは無料" },
];

const problems = [
  "高所・大面積で、人が確認すると時間も危険も大きい",
  "足場を組むほどではないが、状態は確認しておきたい",
  "点検結果を、写真付きで記録として残したい",
  "工事や点検のたびに、費用の目安が分からず困る",
  "屋根・外壁・太陽光など、複数の設備をまとめて相談したい",
];

const reasons = [
  { n: "01", title: "料金が分かりやすい", text: "料金の目安を公開し、60秒で概算を確認できます。" },
  { n: "02", title: "4分野をまとめて相談できる", text: "太陽光・建設現場・屋根外壁・工場倉庫を、1か所で相談できます。" },
  { n: "03", title: "関東中心の対応", text: "東京・神奈川・埼玉・千葉を中心に、現地へ伺います。" },
  { n: "04", title: "データを残せる", text: "写真・動画と報告書を、点検記録として保存できます。" },
  { n: "05", title: "単発・定期どちらも相談可", text: "必要なタイミングで、1回だけでも定期でも対応を相談できます。" },
  { n: "06", title: "必要な点検のみ提案", text: "目的に合わない点検は勧めず、必要な内容だけをご提案します。" },
];

const comparisonRows = [
  { item: "足場", conventional: "必要になる場合が多い", drone: "不要になる場合がある" },
  { item: "高所作業", conventional: "人が高所に上がる必要がある", drone: "高所での作業を減らせる" },
  { item: "作業時間", conventional: "面積が広いほど長くなる", drone: "広い範囲を短時間で撮影" },
  { item: "広範囲確認", conventional: "部分ごとの確認になりやすい", drone: "全体を俯瞰して確認" },
  { item: "画像記録", conventional: "撮影の仕方に差が出る", drone: "写真番号と位置で整理して保存" },
  { item: "経年比較", conventional: "同じ条件で撮るのが難しい", drone: "同条件で撮影して比較しやすい" },
  { item: "費用", conventional: "足場・人員が必要な場合は大きくなりやすい", drone: "条件によって抑えられる可能性" },
];

export default function HomePage() {
  const faqs = [c.free, c.area, c.rain, c.noFly, c.time, c.data, c.report, c.legal];
  return (
    <>
      {/* Hero：情報は詰め込まない */}
      <section className="bg-gradient-to-b from-blue-tint to-white">
        <div className="container-x grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-20">
          <div>
            <p className="eyebrow">{site.tagline}</p>
            <h1 className="mt-3 text-3xl leading-[1.35] sm:text-4xl lg:text-[2.6rem]">
              <Phrases text={site.heroTitle[0]} />
              <br className="hidden sm:block" />
              <Phrases text={site.heroTitle[1]} />
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted">{site.heroLead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="#estimate"
                event="contact_click"
                eventParams={{ location: "hero", target: "estimate" }}
                className="btn btn-primary btn-lg"
              >
                60秒で料金を確認
              </TrackedLink>
              <Link href="#services" className="btn btn-secondary btn-lg">
                サービスを見る
              </Link>
            </div>
          </div>
          <div className="order-first lg:order-none">
            <Image
              src="/images/hero-facility-aerial.webp"
              alt="ドローンで真上から撮影した工場・プラント施設"
              width={1600}
              height={1067}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full rounded-2xl border border-line shadow-sm"
            />          </div>
        </div>
        <div className="container-x pb-8">
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {trust.map((t) => (
              <li key={t.label} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-blue">
                  <Icon name={t.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-bold text-navy">{t.label}</span>
                  <span className="hidden text-xs text-muted sm:block">{t.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Hero直下：簡易見積（TOPの中心機能） */}
      <EstimateSection placement="home" />

      <Section id="services" eyebrow="SERVICES" title="4つの点検サービス" lead="目的に合わせて、点検の種類をお選びください。" tone="white">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceList.map((s) => (
            <ServiceCard key={s.id} s={s} />
          ))}
        </div>
      </Section>

      <Section eyebrow="CHALLENGES" title="ドローン点検が向いている課題" tone="light">
        <ul className="grid gap-3 md:grid-cols-2">
          {problems.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
              <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-blue" />
              <span className="leading-7">{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <h3 className="mb-4 text-xl">ドローンを使うメリット</h3>
          <Merits />
        </div>
      </Section>

      <Section eyebrow="WHY US" title="施設診断技研が選ばれる理由" tone="white">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <li key={r.n} className="rounded-xl border border-line bg-white p-5">
              <p className="text-2xl font-bold text-blue/70">{r.n}</p>
              <h3 className="mt-1 text-lg">{r.title}</h3>
              <p className="mt-1 text-sm leading-7 text-muted">{r.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {features.pricingEnabled && (
        <Section
          eyebrow="PRICING"
          title="料金の目安"
          lead="必要な点検だけを選べる、明朗な料金設定です。表示は目安で、現場の条件により正式料金は変わります。"
          tone="light"
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceList.map((s) => (
              <li key={s.id} className="rounded-xl border border-line bg-white p-5">
                <p className="text-sm font-bold text-muted">{s.name}</p>
                <p className="mt-2 text-2xl font-bold text-navy">{yenFrom(startingPrice[s.id])}</p>
                <Link href={`/services/${s.slug}#pricing`} className="mt-3 inline-block text-sm font-bold text-blue-dark underline underline-offset-4">
                  料金の詳細
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <TrackedLink href="/pricing" event="pricing_view" eventParams={{ location: "home" }} className="btn btn-secondary">
              料金ページを見る
            </TrackedLink>
            <Link href="#estimate" className="btn btn-primary">
              自分の施設の場合は？
            </Link>
          </div>
        </Section>
      )}

      <Section eyebrow="COMPARISON" title="従来の方法との比較" lead="足場や高所作業が必要な点検と比べた、ドローン点検の特徴です。" tone="white">
        <ComparisonTable rows={comparisonRows} note="現場条件により異なる場合があります。ドローンだけでは確認が難しい箇所は、他の方法との併用をご提案します。" />
      </Section>

      <Section id="flow" eyebrow="FLOW" title="点検・納品の流れ" lead="ご相談から報告書のご提出までの流れです。" tone="light">
        <ProcessSteps />
      </Section>

      <Section eyebrow="REPORT" title="撮影して終わりではなく、報告書まで" lead="撮影した画像を整理し、状態が分かる形でお渡しします。" tone="white">
        <ReportPreview />
      </Section>

      <Section eyebrow="AREA" title="対応地域" lead={site.areaText} tone="light">
        <AreaSection />
      </Section>

      <Section eyebrow="FAQ" title="よくあるご質問" center tone="white">
        <Faq items={faqs} />
      </Section>

      <CtaBanner location="home_bottom" />
    </>
  );
}
