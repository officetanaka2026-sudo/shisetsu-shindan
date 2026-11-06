import Link from "next/link";
import { site } from "@/config/site";
import { areaList } from "@/content/areas";
import { Icon } from "./Icon";

/** 対応地域。都県別ページ（/areas/[slug]）は、都県ごとに内容を書き分けたもののみ作る（地域名だけを変えた量産はしない）。 */
export function AreaSection() {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
      <div>
        <ul className="grid grid-cols-2 gap-3">
          {areaList.map((a) => (
            <li key={a.slug}>
              <Link href={`/areas/${a.slug}`} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-3 font-bold text-navy hover:border-blue">
                <Icon name="area" className="h-5 w-5 text-blue" />
                {a.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{site.areaOutsideText}</p>
      </div>
      <div className="text-sm leading-8 text-muted sm:text-base">
        <p>
          {site.areaText}しています。現地までの距離や交通手段によっては、交通費等が別途必要になる場合があります。
        </p>
        <p className="mt-3">対象の施設が関東にあるかどうか迷う場合や、関東外の施設については、お気軽にご相談ください。</p>
      </div>
    </div>
  );
}
