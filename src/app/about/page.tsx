import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { EquipmentSection } from "@/components/EquipmentSection";
import { Icon } from "@/components/Icon";
import { Section } from "@/components/Section";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import type { IconName } from "@/content/types";

export const metadata: Metadata = buildMetadata({
  title: "施設診断技研について｜ドローンを活用した施設診断サービス",
  description:
    "施設診断技研は、ドローンを活用して建物・設備の状態把握を支援する施設診断サービスです。安全性・点検効率・費用の透明性・状態の可視化を大切に、関東で対応します。",
  path: "/about",
});

const values: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "安全性", text: "高所での人の作業を減らし、安全に確認できる方法を提案します。" },
  { icon: "speed", title: "点検効率", text: "広い範囲を短時間で確認し、点検にかかる負担を軽くします。" },
  { icon: "yen", title: "費用の透明性", text: "料金の目安を公開し、事前に費用感が分かるようにします。" },
  { icon: "document", title: "状態の可視化", text: "写真・位置・コメントで整理し、状態が一目で分かる報告書にします。" },
  { icon: "database", title: "データの保存", text: "撮影データを記録として残し、経年の比較にも使えるようにします。" },
  { icon: "check", title: "異常の早期発見支援", text: "劣化や異常の兆候を早い段階で把握し、保守の判断を支援します。" },
];

export default function AboutPage() {
  // 事業情報は site.ts に値が入っている項目のみ表示します（架空の情報は載せません）。
  const rows: [string, string][] = [
    ["屋号", site.name],
    ["事業内容", site.businessDescription],
    ["対応地域", site.areaText],
    ...(site.representative ? ([["代表者", site.representative]] as [string, string][]) : []),
    ...(site.address ? ([["所在地", `〒${site.address.postalCode} ${site.address.region}${site.address.locality}${site.address.street}`]] as [string, string][]) : []),
    ...(site.qualifications.length ? ([["保有資格", site.qualifications.join("、")]] as [string, string][]) : []),
    ...(site.insurance ? ([["加入保険", site.insurance]] as [string, string][]) : []),
  ];

  return (
    <>
      <Breadcrumb items={[{ name: "施設診断技研について", path: "/about" }]} />
      <Section
        as="h1"
        eyebrow="ABOUT"
        title="施設診断技研について"
        lead="施設診断技研は、ドローンを活用して、建物・設備の状態把握を支援する施設診断サービスです。"
        tone="white"
      >
        <div className="max-w-3xl space-y-4 leading-8">
          <p>
            私たちが提供するのは、ドローンの撮影そのものではありません。高所や広い範囲にある施設・設備の状態を、安全に、効率よく、費用を明らかにしたうえで把握していただくための「診断」です。
          </p>
          <p>
            ビル・マンションの管理会社、建物オーナー、工場・倉庫の運営会社、建設会社、太陽光発電事業者など、法人のお客様を中心に、点検・記録・報告をお手伝いします。
          </p>
        </div>
      </Section>

      <Section eyebrow="VALUES" title="大切にしていること" tone="light">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <li key={v.title} className="rounded-xl border border-line bg-white p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-tint text-blue">
                <Icon name={v.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-3 text-lg">{v.title}</h3>
              <p className="mt-1 text-sm leading-7 text-muted">{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="OUTLINE" title="事業概要" tone="white">
        <dl className="max-w-3xl divide-y divide-line rounded-xl border border-line">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 px-4 py-4 sm:grid-cols-[9rem_1fr] sm:px-5">
              <dt className="font-bold text-navy">{k}</dt>
              <dd className="leading-7">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{site.areaOutsideText}</p>
      </Section>

      <EquipmentSection />

      <CtaBanner location="about_bottom" />
    </>
  );
}
