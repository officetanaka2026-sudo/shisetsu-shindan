import { features } from "@/config/features";
import type { ServiceId } from "@/config/pricing";
import { EstimateFlow } from "./EstimateFlow";

type Props = {
  id?: string;
  initialService?: ServiceId;
  placement: string;
  title?: string;
  lead?: string;
  tone?: "white" | "light";
  /** 見出しをh1にする（/estimate専用） */
  heading?: "h1" | "h2";
};

/** 60秒簡易見積の配置用ラッパー。TOP直下・各LP・ガイド記事で共通利用します。 */
export function EstimateSection({
  id = "estimate",
  initialService,
  placement,
  title = "60秒で料金の目安が分かります",
  lead = "点検内容と施設規模を選ぶだけ。正式なお見積りは無料です。",
  tone = "light",
  heading: Tag = "h2",
}: Props) {
  return (
    <section id={id} className={`section ${tone === "light" ? "bg-light" : "bg-white"}`}>
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">60秒簡易見積</p>
            <Tag className="mt-1 text-2xl sm:text-3xl">{title}</Tag>
            <p className="mt-3 text-sm text-muted sm:text-base">{lead}</p>
          </div>
          <div className="mt-8">
            <EstimateFlow initialService={initialService} pricingEnabled={features.pricingEnabled} placement={placement} />
          </div>
        </div>
      </div>
    </section>
  );
}
