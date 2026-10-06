import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { contact } from "@/config/contact";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "プライバシーポリシー｜施設診断技研",
  description: "施設診断技研のプライバシーポリシー。お問い合わせフォームで取得する情報、利用目的、アクセス解析（Google Analytics）、外部サービスへの情報送信について記載しています。",
  path: "/privacy",
});

// 公開前に制定日・事業者情報を確認してください（README「公開前チェックリスト」参照）
const ENACTED = "2026年10月2日";

export default function PrivacyPage() {
  const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA_ID?.trim());
  return (
    <>
      <Breadcrumb items={[{ name: "プライバシーポリシー", path: "/privacy" }]} />
      <section className="section bg-white">
        <div className="container-x">
          <div className="prose-ja mx-auto max-w-3xl">
            <p className="eyebrow">PRIVACY POLICY</p>
            <h1 className="mt-1 text-2xl sm:text-3xl">プライバシーポリシー</h1>
            <p>
              {site.name}（以下「当事業」といいます）は、当サイト（{site.url}）における個人情報の取扱いについて、以下のとおり定めます。
            </p>

            <h2>1. 取得する情報</h2>
            <p>当サイトでは、お問い合わせ・お見積りのご依頼の際に、次の情報をご入力いただきます。</p>
            <ul>
              <li>会社名、ご担当者名、メールアドレス、電話番号</li>
              <li>点検内容、施設の規模・所在地（都道府県・市区町村、または住所）、希望時期などのご相談内容</li>
              <li>お客様が任意で添付された写真・図面などのファイル</li>
            </ul>

            <h2>2. 利用目的</h2>
            <p>取得した情報は、次の目的の範囲でのみ利用します。</p>
            <ul>
              <li>お問い合わせへの回答、お見積りの作成・ご連絡</li>
              <li>ご依頼いただいたサービスの提供に関する連絡</li>
              <li>サービス改善のための統計的な分析（個人を特定しない形）</li>
            </ul>

            <h2>3. 第三者への提供・外部サービスの利用</h2>
            <p>法令に基づく場合を除き、ご本人の同意なく、取得した個人情報を第三者に提供しません。ただし、サイトの運営にあたり、次の外部サービスを利用しています。</p>
            <ul>
              <li>お問い合わせ内容のメール送信：Resend（メール配信サービス）</li>
              <li>サイトのホスティング：Vercel</li>
              {gaEnabled && <li>アクセス解析：Google Analytics（Google LLC）</li>}
            </ul>
            <p>これらのサービスの提供事業者は、日本国外のサーバーで情報を取り扱う場合があります。</p>

            <h2>4. Cookie（クッキー）とアクセス解析</h2>
            {gaEnabled ? (
              <>
                <p>
                  当サイトでは、サイトの利用状況を把握し、改善に役立てるため、Google Analytics を使用しています。Google Analytics は Cookie を利用して、閲覧したページ、操作の内容、利用環境などの情報を収集します。収集された情報には、個人を特定する情報は含まれません。
                </p>
                <p>Cookie の利用は、ブラウザの設定で無効にできます。Google Analytics の詳細は、Google のポリシーをご確認ください。</p>
              </>
            ) : (
              <p>現在、当サイトではアクセス解析ツールを使用していません。将来使用する場合は、本ポリシーに明記します。</p>
            )}
            <p>また、お見積り機能の入力内容は、入力の途中経過を保持するため、お客様のブラウザ内（ローカルストレージ）に保存されます。送信が完了した場合は削除されます。</p>

            <h2>5. 安全管理</h2>
            <p>取得した個人情報は、漏えい・滅失・毀損を防ぐため、必要かつ適切な安全管理措置を講じて取り扱います。</p>

            <h2>6. 開示・訂正・削除のご請求</h2>
            <p>ご本人から、保有する個人情報の開示・訂正・削除のご請求があった場合は、本人確認のうえ、法令に従って対応します。次の窓口までご連絡ください。</p>
            <p>
              窓口：{site.name}{" "}
              {contact.email ? `（${contact.email}）` : "（当サイトのお問い合わせフォームよりご連絡ください）"}
            </p>

            <h2>7. 本ポリシーの改定</h2>
            <p>必要に応じて、本ポリシーの内容を変更することがあります。変更後の内容は、当サイトに掲載した時点から効力を生じます。</p>

            <p className="text-sm text-muted">制定日：{ENACTED}</p>
          </div>
        </div>
      </section>
    </>
  );
}
