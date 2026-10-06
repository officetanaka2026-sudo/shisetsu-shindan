import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export type Crumb = { name: string; path: string };

/** パンくずリスト（構造化データ付き）。先頭の「ホーム」は自動で付きます。 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "ホーム", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="パンくずリスト" className="border-b border-line bg-light">
        <ol className="container-x flex flex-wrap items-center gap-x-2 py-2.5 text-xs text-muted sm:text-sm">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="underline-offset-4 hover:underline">
                      {c.name}
                    </Link>
                    <span aria-hidden="true">›</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
