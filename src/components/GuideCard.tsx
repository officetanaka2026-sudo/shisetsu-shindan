import Link from "next/link";
import { services } from "@/content/services";
import type { Guide } from "@/lib/guides";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition hover:border-blue hover:shadow-md">
      <p className="text-xs font-bold text-blue">{services[guide.service].short}</p>
      <h3 className="mt-2 text-lg leading-snug">
        <Link href={`/guides/${guide.slug}`} className="hover:underline">
          {guide.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-7 text-muted">{guide.description}</p>
      <p className="mt-3 text-xs text-muted">
        <time dateTime={guide.updated ?? guide.published}>{formatDate(guide.updated ?? guide.published)}</time>
        {guide.updated ? " 更新" : " 公開"}
      </p>
    </article>
  );
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}
