import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { EstimateSection } from "@/components/EstimateSection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "60秒簡易見積｜ドローン点検の料金の目安がすぐ分かる｜施設診断技研",
  description:
    "点検内容と施設規模を選ぶだけで、ドローン点検の概算料金が60秒で分かる簡易見積。太陽光・建設現場・屋根外壁・工場倉庫に対応。連絡先の入力前に料金を表示します。正式見積は無料です。",
  path: "/estimate",
});

export default function EstimatePage() {
  return (
    <>
      <Breadcrumb items={[{ name: "60秒簡易見積", path: "/estimate" }]} />
      <EstimateSection heading="h1" placement="estimate_page" />
      <section className="bg-white py-10">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-sm leading-7 text-muted">
            <p>
              連絡先の入力前に、概算料金をご確認いただけます。入力した内容はこのブラウザに保存され、ページを移動しても戻ってきたときに続きから入力できます。
            </p>
            <p className="mt-3">
              選択肢を選ばず、直接ご相談したい場合は
              <Link href="/contact" className="font-bold text-blue-dark underline underline-offset-4">
                お問い合わせフォーム
              </Link>
              をご利用ください。料金の一覧は
              <Link href="/pricing" className="font-bold text-blue-dark underline underline-offset-4">
                料金ページ
              </Link>
              でご確認いただけます。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
