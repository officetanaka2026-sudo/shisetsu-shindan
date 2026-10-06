import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { GuideCard, formatDate } from "@/components/GuideCard";
import { JsonLd } from "@/components/JsonLd";
import { Markdown, extractHeadings } from "@/components/Markdown";
import { Section } from "@/components/Section";
import { services } from "@/content/services";
import { getAllGuides, getGuide } from "@/lib/guides";
import { articleJsonLd, buildMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return buildMetadata({
    title: `${g.title}｜施設診断技研`,
    description: g.description,
    path: `/guides/${g.slug}`,
    type: "article",
    publishedTime: g.published,
    modifiedTime: g.updated ?? g.published,
  });
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const s = services[g.service];
  const toc = extractHeadings(g.body);
  const related = getAllGuides().filter((x) => x.service === g.service && x.slug !== g.slug).slice(0, 3);
  const hasEstimate = /^\{\{estimate\}\}$/m.test(g.body);

  return (
    <>
      <JsonLd data={articleJsonLd({ title: g.title, description: g.description, path: `/guides/${g.slug}`, published: g.published, updated: g.updated, author: g.author })} />
      <Breadcrumb items={[{ name: "お役立ち情報", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]} />

      <article className="section bg-white">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold text-blue">{s.name}</p>
            <h1 className="mt-2 text-2xl leading-snug sm:text-3xl">{g.title}</h1>
            <p className="mt-4 text-sm text-muted">
              公開：<time dateTime={g.published}>{formatDate(g.published)}</time>
              {g.updated && (
                <>
                  ／ 最終更新：<time dateTime={g.updated}>{formatDate(g.updated)}</time>
                </>
              )}
              {g.author && <>／ 執筆：{g.author}</>}
              {g.supervisor && <>／ 監修：{g.supervisor}</>}
            </p>

            {toc.length > 1 && (
              <nav aria-label="目次" className="mt-6 rounded-xl border border-line bg-light p-5">
                <p className="font-bold text-navy">目次</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-blue-dark underline-offset-4 hover:underline">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <Markdown body={g.body} service={g.service} />

            {!hasEstimate && (
              <p className="mt-10 rounded-xl border border-line bg-light p-5 text-sm">
                あなたの施設の場合の料金は？{" "}
                <Link href="/estimate" className="font-bold text-blue-dark underline underline-offset-4">
                  60秒で料金の目安を確認する
                </Link>
              </p>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <Section eyebrow="RELATED" title="あわせて読みたい" tone="light">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <GuideCard key={r.slug} guide={r} />
            ))}
          </div>
        </Section>
      )}

      <CtaBanner location={`guide_${g.slug}`} />
    </>
  );
}
