import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/ServicePage";
import { getService, serviceList } from "@/content/services";
import { buildMetadata, serviceTitle } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return buildMetadata({
    title: serviceTitle(s.id),
    description: s.metaDescription,
    path: `/services/${s.slug}`,
    image: `/og/${s.slug}.png`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  return <ServicePage id={s.id} />;
}
