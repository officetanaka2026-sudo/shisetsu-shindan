import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { Section } from "@/components/Section";
import { site } from "@/config/site";
import { areaList } from "@/content/areas";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `関東のドローン点検 対応エリア｜東京・神奈川・埼玉・千葉｜${site.name}`,
  description:
    "東京都・神奈川県・埼玉県・千葉県を中心に、関東の建物・設備のドローン点検（外壁調査・屋根点検・太陽光パネル点検・工場倉庫・建設現場の撮影）に対応しています。都県ごとの特徴と飛行時の注意点をご紹介します。",
  path: "/areas",
});

export default function AreasPage() {
  return (
    <>
      <Breadcrumb items={[{ name: "対応エリア", path: "/areas" }]} />
      <Section as="h1" eyebrow="AREA" title="関東のドローン点検 対応エリア" lead={`${site.areaText}しています。都県ごとに、建物・設備の傾向や飛行時に確認が必要なことが異なります。`} tone="white">
        <ul className="grid gap-4 sm:grid-cols-2">
          {areaList.map((a) => (
            <li key={a.slug}>
              <Link href={`/areas/${a.slug}`} className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition hover:border-blue hover:shadow-md">
                <span className="flex items-center gap-2 text-lg font-bold text-navy">
                  <Icon name="area" className="h-5 w-5 text-blue" />
                  {a.h1}
                </span>
                <span className="mt-2 text-sm leading-7 text-muted">{a.lead}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">{site.areaOutsideText}</p>
      </Section>
      <CtaBanner location="areas_bottom" />
    </>
  );
}
