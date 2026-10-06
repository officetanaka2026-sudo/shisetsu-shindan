import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { Section } from "@/components/Section";
import { cases } from "@/config/cases";
import { features } from "@/config/features";
import { buildMetadata } from "@/lib/seo";

/**
 * 導入事例（将来用）。CASES_ENABLED=true かつ src/config/cases.ts に実際の事例がある場合のみ公開されます。
 * 現在は実績がないため、このページは 404 を返し、サイトマップにも含まれません。
 */
export const metadata: Metadata = buildMetadata({
  title: "導入事例｜施設診断技研",
  description: "施設診断技研のドローン点検の導入事例です。施設種別・地域・規模・課題・点検方法・結果をご紹介します。",
  path: "/cases",
  noindex: !features.casesEnabled || cases.length === 0,
});

export default function CasesPage() {
  if (!features.casesEnabled || cases.length === 0) notFound();
  return (
    <>
      <Breadcrumb items={[{ name: "導入事例", path: "/cases" }]} />
      <Section as="h1" eyebrow="CASES" title="導入事例" tone="white">
        <div className="grid gap-5 md:grid-cols-2">
          {cases.map((c) => (
            <article key={c.slug} className="rounded-xl border border-line bg-white p-5">
              <p className="text-xs font-bold text-blue">
                {c.facilityType}／{c.area}／{c.scale}
              </p>
              <h2 className="mt-2 text-lg">{c.title}</h2>
              <dl className="mt-3 space-y-1 text-sm leading-7">
                <div><dt className="inline font-bold">課題：</dt><dd className="inline">{c.challenge}</dd></div>
                <div><dt className="inline font-bold">点検方法：</dt><dd className="inline">{c.method}</dd></div>
                <div><dt className="inline font-bold">所要時間：</dt><dd className="inline">{c.duration}</dd></div>
                <div><dt className="inline font-bold">結果：</dt><dd className="inline">{c.result}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </Section>
      <CtaBanner location="cases_bottom" />
    </>
  );
}
