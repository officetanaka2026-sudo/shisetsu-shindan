import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { GuideCard } from "@/components/GuideCard";
import { Section } from "@/components/Section";
import { SERVICE_IDS } from "@/config/pricing";
import { services } from "@/content/services";
import { getAllGuides } from "@/lib/guides";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ドローン点検のお役立ち情報｜外壁調査・太陽光・屋根点検の基礎知識｜施設診断技研",
  description:
    "ドローンによる外壁調査・屋根点検・太陽光パネル点検・建設現場の定点撮影について、費用の目安や点検方法、メリットなどの疑問に分かりやすく答えるお役立ち情報です。",
  path: "/guides",
});

export default function GuidesPage() {
  const guides = getAllGuides();
  return (
    <>
      <Breadcrumb items={[{ name: "お役立ち情報", path: "/guides" }]} />
      <Section as="h1" eyebrow="GUIDES" title="お役立ち情報" lead="点検の方法・費用・ドローンの使いどころなど、検討時によくある疑問にお答えします。" tone="white">
        {SERVICE_IDS.map((id) => {
          const list = guides.filter((g) => g.service === id);
          if (list.length === 0) return null;
          return (
            <div key={id} className="mb-10 last:mb-0">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="text-xl">{services[id].name}</h2>
                <Link href={`/services/${services[id].slug}`} className="text-sm font-bold text-blue-dark underline underline-offset-4">
                  サービスを見る
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((g) => (
                  <GuideCard key={g.slug} guide={g} />
                ))}
              </div>
            </div>
          );
        })}
      </Section>
      <CtaBanner location="guides_bottom" />
    </>
  );
}
