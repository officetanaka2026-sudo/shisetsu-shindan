import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { Section } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { serviceList } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ドローン点検サービス一覧｜太陽光・建設現場・屋根外壁・工場倉庫｜施設診断技研",
  description:
    "施設診断技研のドローン点検サービス一覧。太陽光設備点検、建設現場撮影・点検、屋根・外壁点検、工場・倉庫点検の4分野を、東京・神奈川・埼玉・千葉を中心に関東で対応します。",
  path: "/services",
});

export default function ServicesIndex() {
  return (
    <>
      <Breadcrumb items={[{ name: "サービス", path: "/services" }]} />
      <Section as="h1" eyebrow="SERVICES" title="ドローン点検サービス" lead="目的に合わせて、点検の種類をお選びください。料金の目安は各ページ・料金ページでご確認いただけます。" tone="white">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceList.map((s) => (
            <ServiceCard key={s.id} s={s} />
          ))}
        </div>
      </Section>
      <CtaBanner location="services_bottom" />
    </>
  );
}
