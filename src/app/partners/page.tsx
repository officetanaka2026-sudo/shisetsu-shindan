import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CtaBanner } from "@/components/CtaBanner";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { Section } from "@/components/Section";
import { TrackedLink } from "@/components/TrackedLink";
import { site } from "@/config/site";
import { areaList } from "@/content/areas";
import type { Faq as FaqItem, IconName } from "@/content/types";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `ドローン調査の外注先をお探しの施工会社・管理会社さまへ｜関東対応｜${site.name}`,
  description:
    "外壁塗装・リフォーム会社、ビル・マンション管理会社、建設会社さま向けに、屋根・外壁・設備のドローン撮影・調査を1件から承ります。写真番号と撮影位置で整理した写真・報告書を納品し、見積や施主への説明にそのまま使えます。関東対応。",
  path: "/partners",
});

const audiences: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "roof",
    title: "外壁塗装・リフォーム・屋根工事会社さま",
    text: "見積の前に屋根や高い外壁の状態を確認したい。はしごや足場をかけずに、施主に見せられる写真がほしい。",
  },
  {
    icon: "document",
    title: "ビル・マンション管理会社さま",
    text: "管理物件の屋上・外壁の状態を記録しておきたい。修繕計画や理事会への説明に使える資料がほしい。",
  },
  {
    icon: "construction",
    title: "建設会社・工務店さま",
    text: "工事の進捗や竣工時の状態を上空から記録したい。社内にドローンの担当者や機材がない。",
  },
];

const scenes = [
  "台風や強風のあと、管理物件の屋根に被害がないかまとめて確認したい",
  "外壁改修の見積前に、劣化の範囲を写真で把握したい",
  "高所の屋根で、職人が上って確認するのは危ないと感じている",
  "施主や管理組合に、工事が必要な理由を写真で説明したい",
  "ドローンを自社で持つほどの件数はないが、ときどき必要になる",
];

const deliverables: { title: string; text: string }[] = [
  { title: "撮影写真（全データ）", text: "撮影したデータは整理したうえで、すべてお渡しします。" },
  { title: "写真番号・撮影位置の一覧", text: "どの写真が建物のどこを写したものか、図や一覧で分かるようにします。" },
  { title: "気になる箇所のコメント", text: "割れ・浮き・汚れ・変形など、目視で気になった箇所に印とコメントを付けます。" },
  { title: "報告書（PDF）", text: "社内の検討や、施主・管理組合への説明資料としてそのまま使える形にまとめます。" },
];

const steps: { title: string; text: string }[] = [
  { title: "ご相談", text: "物件の所在地・建物の種類・確認したい範囲をお知らせください。図面や過去の写真があればあわせてお送りください。" },
  { title: "飛行の確認と見積", text: "空港の周辺や人口集中地区などに当たるか、近隣への配慮が必要かを確認し、手続きと費用をご案内します。" },
  { title: "撮影", text: "天候を見て日程を決め、現地で撮影します。立ち会いが必要かどうかは、物件ごとにご相談します。" },
  { title: "納品", text: "撮影データ・写真一覧・報告書をお渡しします。補足のご質問にもお答えします。" },
];

const faqs: FaqItem[] = [
  { q: "1件だけの依頼でもよいですか？", a: "はい、1件からお受けしています。定期的にご依頼いただける場合や、複数の物件をまとめてご依頼いただける場合は、日程や費用をご相談ください。" },
  {
    q: "報告書を、自社から施主に渡す資料として使ってもよいですか？",
    a: "はい、見積や説明の資料としてお使いいただけます。表紙の表記や体裁にご希望がある場合は、ご依頼の際にお知らせください。",
  },
  { q: "劣化の診断や、修繕の要否の判断までしてもらえますか？", a: "ドローンで分かるのは、外から見える状態です。撮影結果をもとに気になる箇所をお伝えしますが、修繕の要否や工法の判断は、貴社や専門の技術者の方にお願いしています。" },
  { q: "どの地域まで対応していますか？", a: `${site.areaText}しています。${site.areaOutsideText}` },
  { q: "飛行の許可や近隣への説明はどうなりますか？", a: "飛行に必要な手続きは、場所に応じて事前に確認し、こちらで行います。近隣へのお知らせが必要な場合の進め方は、物件ごとにご相談します。" },
];

export default function PartnersPage() {
  return (
    <>
      <Breadcrumb items={[{ name: "施工会社・管理会社さまへ", path: "/partners" }]} />

      <section className="bg-gradient-to-b from-blue-tint to-white">
        <div className="container-x py-10 sm:py-14">
          <p className="eyebrow flex items-center gap-2">
            <Icon name="drone" className="h-5 w-5" />
            施工会社・管理会社さまへ
          </p>
          <h1 className="mt-3 text-3xl leading-[1.4] sm:text-4xl">ドローン調査を、必要なときだけ外注できます</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
            自社でドローンや担当者を持たなくても、屋根・外壁・屋上設備の撮影と調査を1件からお任せいただけます。写真番号と撮影位置で整理した写真と報告書を納品するので、見積や施主・管理組合への説明にそのまま使えます。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <TrackedLink href="/contact" event="contact_click" eventParams={{ location: "partners_hero", target: "contact" }} className="btn btn-primary btn-lg">
              物件について相談する
            </TrackedLink>
            <Link href="/pricing" className="btn btn-secondary btn-lg">
              料金の目安を見る
            </Link>
          </div>
        </div>
      </section>

      <Section eyebrow="FOR" title="こんな会社さまからのご相談を想定しています" tone="white">
        <ul className="grid gap-4 md:grid-cols-3">
          {audiences.map((a) => (
            <li key={a.title} className="rounded-xl border border-line bg-white p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-tint text-blue">
                <Icon name={a.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-3 text-lg">{a.title}</h3>
              <p className="mt-1 text-sm leading-7 text-muted">{a.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="SCENES" title="よくあるご依頼の場面" tone="light">
        <ul className="grid gap-3 md:grid-cols-2">
          {scenes.map((s) => (
            <li key={s} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
              <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-blue" />
              <span className="leading-7">{s}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-7">
          関連する記事：
          <Link href="/guides/typhoon-roof-damage-check" className="font-bold text-blue-dark underline underline-offset-4">
            台風・強風のあとの屋根の被害確認
          </Link>
          ／
          <Link href="/guides/drone-vs-scaffold-inspection" className="font-bold text-blue-dark underline underline-offset-4">
            ドローン点検と足場点検の違い
          </Link>
        </p>
      </Section>

      <Section eyebrow="DELIVERABLES" title="納品するもの" lead="撮影しただけで終わらせず、社内でも社外でも使える形に整理してお渡しします。" tone="white">
        <ul className="grid gap-4 sm:grid-cols-2">
          {deliverables.map((d) => (
            <li key={d.title} className="flex items-start gap-3 rounded-xl border border-line bg-white p-5">
              <Icon name="document" className="mt-1 h-5 w-5 shrink-0 text-blue" />
              <div>
                <h3 className="text-base">{d.title}</h3>
                <p className="mt-1 text-sm leading-7 text-muted">{d.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="FLOW" title="ご依頼の流れ" tone="light">
        <ol className="grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-line bg-white p-5">
              <p className="text-sm font-bold text-blue">STEP {i + 1}</p>
              <h3 className="mt-1 text-lg">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="AREA" title="対応エリア" tone="white">
        <p className="max-w-3xl leading-8">
          {site.areaText}しています。都県ごとの特徴と、飛行の前に確認することは各ページをご覧ください。
        </p>
        <p className="mt-4 text-sm">
          {areaList.map((a, i) => (
            <span key={a.slug}>
              {i > 0 && "／"}
              <Link href={`/areas/${a.slug}`} className="font-bold text-blue-dark underline underline-offset-4">
                {a.name}
              </Link>
            </span>
          ))}
        </p>
      </Section>

      <Section eyebrow="FAQ" title="施工会社・管理会社さまからのよくあるご質問" center tone="light">
        <Faq items={faqs} />
      </Section>

      <CtaBanner location="partners_bottom" title="物件の撮影・調査について相談する" text="所在地と建物の種類が分かれば、飛行の可否と費用の目安をご案内します。お見積りは無料です。" />
    </>
  );
}
