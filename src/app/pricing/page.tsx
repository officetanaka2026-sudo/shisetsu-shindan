import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { Faq } from "@/components/Faq";
import { PageViewEvent } from "@/components/PageViewEvent";
import { PriceCta, PriceDisclaimer, PriceNotes, PriceTable } from "@/components/PricingTable";
import { Section } from "@/components/Section";
import { features } from "@/config/features";
import { SERVICE_IDS, startingPrice, yenFrom } from "@/config/pricing";
import { commonFaqs as c } from "@/content/common";
import { buildMetadata } from "@/lib/seo";

const min = Math.min(...Object.values(startingPrice));

export const metadata: Metadata = buildMetadata({
  title: features.pricingEnabled ? `ドローン点検の料金｜${yenFrom(min)}｜明朗料金｜施設診断技研` : "ドローン点検の料金｜施設診断技研",
  description: features.pricingEnabled
    ? `太陽光設備・建設現場・屋根外壁・工場倉庫のドローン点検料金の目安を公開。${yenFrom(min)}から、必要な点検だけ選べる明朗料金です。60秒で概算が分かる簡易見積も。関東対応・見積無料。`
    : "ドローン点検の料金は、点検内容や施設の条件を確認のうえ、お見積りでご案内します。60秒簡易見積で目安をご確認いただけます。関東対応・見積無料。",
  path: "/pricing",
});

const faqs = [
  { q: "料金はこれで確定ですか？", a: "掲載している金額は目安です。現場環境・飛行条件・対象範囲等によって正式料金は変わります。正式なお見積りは無料です。" },
  { q: "「〜円から」の金額に含まれるものは何ですか？", a: "事前ヒアリング、飛行計画、撮影、撮影データ、基本解析、基本報告書を想定しています。含まれる内容は、お見積り時に明記します。" },
  { q: "追加料金が発生するのはどんなときですか？", a: "特殊飛行申請、警備員の配置、交通規制、遠距離の交通費、宿泊、特殊機材、専門資格者の同行などが必要な場合です。お見積りの段階で、想定される追加費用をお伝えします。" },
  c.free,
  c.periodic,
  c.area,
];

export default function PricingPage() {
  return (
    <>
      <PageViewEvent event="pricing_view" params={{ location: "pricing_page" }} />
      <Breadcrumb items={[{ name: "料金", path: "/pricing" }]} />
      <Section
        as="h1"
        eyebrow="PRICING"
        title="ドローン点検の料金"
        lead="事前に費用感が分かる、明朗な料金です。必要な点検だけを選べます。"
        tone="white"
      >
        <PriceDisclaimer />
        <PriceCta />
      </Section>

      <Section eyebrow="BY SERVICE" title="サービス別の料金の目安" tone="light">
        <div className="grid gap-5 lg:grid-cols-2">
          {SERVICE_IDS.map((id) => (
            <PriceTable key={id} service={id} showLink />
          ))}
        </div>
        {!features.pricingEnabled && <p className="mt-4 text-sm text-muted">現在、料金は個別のお見積りでご案内しています。</p>}
      </Section>

      <Section eyebrow="INCLUDED" title="含まれる項目と、追加料金について" tone="white">
        <PriceNotes />
      </Section>

      <Section eyebrow="FAQ" title="料金についてのご質問" center tone="light">
        <Faq items={faqs} />
      </Section>

      <CtaBanner location="pricing_bottom" />
    </>
  );
}
