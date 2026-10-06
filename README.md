# 施設診断技研 公式Webサイト

ドローンを活用した法人向け施設・設備点検サービス「施設診断技研」の公式サイトです。
本番ドメイン：`shisetsu-shindan.jp`（Vercel にデプロイして独自ドメインを接続します）

- 技術構成：Next.js（App Router）／ TypeScript ／ Tailwind CSS ／ Vercel
- 設計思想：「必要な情報を、必要なタイミングで、必要な量だけ」。最短で **60秒簡易見積 → 無料見積依頼** に進めること

> **SEOについて**：このサイトのSEO実装（metadata・構造化データ・sitemap・内部リンクなど）は、検索結果で上位表示されるための土台です。**検索順位を保証するものではありません。** 順位は、コンテンツの質、実績、被リンク、導入事例、専門情報の積み重ねによって決まります。実績・事例・監修者などが確定したら、追加できる構造にしてあります。

---

## 目次

1. [ローカル起動](#1-ローカル起動)
2. [環境変数](#2-環境変数)
3. [Vercel へのデプロイ](#3-vercel-へのデプロイ)
4. [独自ドメインとDNS設定](#4-独自ドメインとdns設定)
5. [問い合わせメールの設定（Resend）](#5-問い合わせメールの設定resend)
6. [料金の変更](#6-料金の変更)
7. [電話番号・メールアドレスの設定](#7-電話番号メールアドレスの設定)
8. [Google Analytics（GA4）](#8-google-analyticsga4)
9. [Google Search Console](#9-google-search-console)
10. [ガイド記事の追加方法](#10-ガイド記事の追加方法)
11. [サイトマップ・robots・canonical・OGP](#11-サイトマップrobotscanonicalogp)
12. [使用機体の追加](#12-使用機体の追加)
13. [導入事例（実績）の追加](#13-導入事例実績の追加)
14. [Feature Flags](#14-feature-flags)
15. [画像の差し替え](#15-画像の差し替え)
16. [公開前に人間が確認すること](#16-公開前に人間が確認すること)
17. [開発コマンド・ディレクトリ構成](#17-開発コマンドディレクトリ構成)

---

## 1. ローカル起動

Node.js 20 以上（動作確認：Node 24）が必要です。

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev                  # http://localhost:3000
```

本番ビルドの確認：

```bash
npm run build && npm run start
```

品質チェック（公開前に必ず実行）：

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # 見積計算・問い合わせ検証・SEOの自動テスト
npm run build       # 本番ビルド
```

## 2. 環境変数

`.env.example` を `.env.local` にコピーして値を設定します（**秘密値は Git にコミットしないこと**。`.env*` は `.gitignore` 済みです）。Vercel では「Project → Settings → Environment Variables」に同じ名前で登録します。

| 変数名 | 用途 | 未設定の場合 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 本番URL（canonical・sitemap・OGPの基準）。`https://shisetsu-shindan.jp` | 同URLが使われます |
| `NEXT_PUBLIC_CONTACT_PHONE` | 電話番号 | 電話番号は**どこにも表示されません** |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 公開用メールアドレス | メールアドレスは**表示されません** |
| `NEXT_PUBLIC_GA_ID` | GA4 測定ID（`G-XXXXXXXXXX`） | 計測しません |
| `RESEND_API_KEY` | メール送信（Resend）のAPIキー | 本番では送信エラー表示（開発時はコンソールに出力） |
| `CONTACT_TO_EMAIL` | 問い合わせの通知先（カンマ区切り可） | 同上 |
| `CONTACT_FROM_EMAIL` | 送信元（Resendで認証済みドメインのアドレス） | `onboarding@resend.dev`（テスト用） |
| `NEXT_PUBLIC_PRICING_ENABLED` | 料金表示のON/OFF | `true` |
| `LEGAL_INSPECTION_ENABLED` | 法定点検対応の表示 | `false` |
| `EQUIPMENT_SECTION_ENABLED` | 使用機体セクションの表示 | `false` |
| `CASES_ENABLED` | 導入事例ページの公開 | `false` |

## 3. Vercel へのデプロイ

1. このフォルダを GitHub などの Git リポジトリにプッシュします（`git init` → `git add .` → `git commit` → リモート追加 → `git push`）。
2. [Vercel](https://vercel.com/) にログインし、**Add New → Project** で上記リポジトリをインポートします（Framework は Next.js が自動検出されます）。
3. **Environment Variables** に [環境変数](#2-環境変数) を登録します（まず `NEXT_PUBLIC_SITE_URL` と `RESEND_API_KEY`・`CONTACT_TO_EMAIL`・`CONTACT_FROM_EMAIL`）。
4. **Deploy** を押します。以降、`main` ブランチへのプッシュで本番に自動反映されます。

**Preview 環境について**：Vercel の Preview デプロイ（ブランチ・PRごとのURL）は、自動的に `noindex`（検索エンジンに登録させない）になり、`robots.txt` もクロール拒否になります（`VERCEL_ENV` で判定）。本番（Production）のみ、検索エンジンに公開されます。

## 4. 独自ドメインとDNS設定

目標：`https://shisetsu-shindan.jp`（www なし）を正規URLにします。

1. Vercel の **Project → Settings → Domains** で `shisetsu-shindan.jp` を追加します。
2. 続けて `www.shisetsu-shindan.jp` も追加し、**`shisetsu-shindan.jp` へリダイレクト**する設定にします（www あり/なしの重複を避けるため）。
3. ドメインを管理している会社（お名前.com、Cloudflare、ムームードメイン等）の DNS 設定で、Vercel の画面に表示された値を登録します。一般的には次のとおりです（**必ず Vercel の画面に表示された値を優先してください**）。

   | 種類 | ホスト名 | 値 |
   | --- | --- | --- |
   | A | `@`（ルート） | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

4. 反映には数分〜最大48時間かかります。Vercel の Domains 画面が **Valid Configuration** になれば完了です。HTTPS 証明書は自動で発行されます。
5. 公開後、`https://shisetsu-shindan.jp` にアクセスし、`http://` や `www` から正規URLにリダイレクトされることを確認します。

> ネームサーバーを Vercel に向ける方法もあります（Vercel の Domains 画面の案内に従ってください）。メール受信用の MX レコードなど既存のDNS設定を消さないよう注意してください。

## 5. 問い合わせメールの設定（Resend）

問い合わせフォーム・簡易見積の送信は、サーバー（`src/app/api/contact/route.ts`）から [Resend](https://resend.com/) の API でメール送信します（Resend 以外のサービスに替える場合は、このファイルの送信部分のみ変更します）。

1. Resend でアカウントを作成し、**Domains** で `shisetsu-shindan.jp` を追加します。表示された DNS レコード（SPF・DKIM など）を、DNS 設定に登録して **Verified** にします。
2. **API Keys** で APIキーを作成し、`RESEND_API_KEY` に設定します。
3. `CONTACT_TO_EMAIL` に、通知を受け取るメールアドレスを設定します（複数ならカンマ区切り）。
4. `CONTACT_FROM_EMAIL` に、認証済みドメインのアドレス（例：`施設診断技研 <noreply@shisetsu-shindan.jp>`）を設定します。
5. デプロイ後、本番サイトの `/contact` から**実際に1件テスト送信**して、通知メールが届くことを確認します。

**スパム対策**：ハニーポット項目、入力の速すぎる送信の破棄、同一IPのレート制限、同一オリジン確認、入力値の検証・長さ制限を実装しています。スパムが増えた場合は、Vercel の Firewall / Bot Protection や Cloudflare Turnstile の導入を検討してください。

**添付ファイル**：JPG・PNG・WebP・PDF、3件・合計4MBまで（Vercel の本文サイズ上限に収まる範囲）。

**メールの受信（info@ など）**：公開用のメールアドレス（`info@shisetsu-shindan.jp` 等）を使う場合は、別途メールホスティング（Google Workspace、レンタルサーバー付属メール等）の設定が必要です。受信設定が完了してから、`NEXT_PUBLIC_CONTACT_EMAIL` を設定してください（空の間は表示されません）。

## 6. 料金の変更

**料金は `src/config/pricing.ts` の1か所で管理しています。** ここを書き換えると、次の箇所がすべて自動で変わります。

- 料金ページ（`/pricing`）と各サービスLPの料金表
- 60秒簡易見積の概算料金
- TOP・サービス一覧のカードの「◯円〜」
- 各LPの `title`（例：`太陽光パネルのドローン・赤外線点検｜料金29,800円〜｜…`）
- ガイド記事内の料金表記（記事内の `{{price:◯◯}}` トークン。`src/lib/priceTokens.ts` で定義）
- 問い合わせメールに記載される概算

変更後は `npm run test` を実行し、料金計算のテストが通ることを確認してください（金額を変えた場合は、テスト内の期待値も更新が必要です）。

| 設定項目 | 場所 |
| --- | --- |
| 太陽光：容量帯ごとの料金 | `pricing.solar.tiers` |
| 建設現場：単発・定期の料金、定期の目安回数 | `pricing.construction` |
| 屋根・外壁：可視光簡易点検、赤外線の㎡単価、最低料金 | `pricing.roofWall` |
| 工場・倉庫：可視光屋根点検、詳細点検、大型施設の個別見積条件 | `pricing.factory` |
| 料金に含まれる項目（ON/OFF） | `pricing.includes` |
| 追加料金が発生しうる項目 | `pricing.extras` |

> ⚠ 現在の金額は**仮料金**です。運用が確定したら変更してください。
> 「分からない」を選んだ場合や、計算できない条件では「条件を確認後お見積り」と表示されます。

## 7. 電話番号・メールアドレスの設定

- 電話番号：`NEXT_PUBLIC_CONTACT_PHONE` を設定すると、ヘッダー・フッター・スマホ下部の固定ボタン・各CTAに表示されます（クリックでGAに `phone_click` が送信されます）。**架空の番号は絶対に設定しないでください。**
- メールアドレス：`NEXT_PUBLIC_CONTACT_EMAIL` を設定すると表示されます（`email_click` を計測）。メール受信の設定が完了してから設定してください。
- 変更後は再デプロイが必要です（環境変数はビルド時に反映されます）。

## 8. Google Analytics（GA4）

1. [Google Analytics](https://analytics.google.com/) で GA4 のプロパティを作成し、**測定ID（`G-XXXXXXXXXX`）** を取得します。
2. `NEXT_PUBLIC_GA_ID` に設定して再デプロイします（未設定なら計測コードは読み込まれません）。
3. 管理画面の **イベント** で、下表のイベントが記録されることを確認します。主要なものは **キーイベント（コンバージョン）** に設定してください（推奨：`estimate_submit`、`estimate_price_viewed`）。

| イベント名 | 送信タイミング | 主な用途 |
| --- | --- | --- |
| `estimate_start` | 簡易見積で最初の選択をしたとき（1回） | 見積開始数 |
| `estimate_service_selected` | STEP1：点検内容を選択 | STEP1完了率 |
| `estimate_size_selected` | STEP2：規模などを選択 | STEP2完了率 |
| `estimate_location_selected` | STEP3：所在地を選択 | 離脱の把握 |
| `estimate_price_viewed` | 概算料金を表示 | **料金表示率** |
| `estimate_contact_start` | 「この条件で無料見積を依頼」を押下 | **料金表示→問い合わせ率** |
| `estimate_submit` | 見積の送信完了 | **第二KPI／フォーム離脱率** |
| `contact_click` | 見積・問い合わせへのCTAクリック（`location` / `target` 付き） | 第一KPI導線の分析 |
| `phone_click` / `email_click` | 電話・メールのクリック | 第三KPI |
| `service_click` | サービスLPへのリンクのクリック | 第四KPI |
| `pricing_view` | 料金ページ表示／料金リンクのクリック | 料金への関心 |

**ファネル分析の見方**：探索レポートで `estimate_start → estimate_service_selected → estimate_size_selected → estimate_price_viewed → estimate_contact_start → estimate_submit` のファネルを作ると、どこで離脱しているかが分かります。価格やUIの改善に使ってください。

> GAを有効にした場合は、プライバシーポリシー（`/privacy`）に自動でGoogle Analyticsの記載が追加されます。Cookie同意バナーが必要かどうかは、運用方針に合わせて確認してください。

## 9. Google Search Console

公開後すぐに登録します（`sitemap.xml`・`robots.txt`・canonical は自動生成済み）。

1. [Search Console](https://search.google.com/search-console/) で **プロパティを追加 → ドメイン** を選び、`shisetsu-shindan.jp` を入力します。
2. 表示された **TXTレコード** を DNS に登録し、**確認** を押します（所有権の確認）。
3. **サイトマップ** メニューで `sitemap.xml` を入力して送信します（`https://shisetsu-shindan.jp/sitemap.xml`）。
4. **URL検査** にトップページと主要LP（`/services/roof-wall` など）のURLを入力し、**インデックス登録をリクエスト** します。
5. 数日〜数週間後、**ページ → インデックス登録** で登録状況を、**検索パフォーマンス** で検索クエリを確認します。実際の検索クエリから、ガイド記事の新テーマを考えると効果的です。

## 10. ガイド記事の追加方法

CMSは不要です。`src/content/guides/` に Markdown ファイル（`.md`）を追加するだけで、記事ページ・一覧・サイトマップ・構造化データ（Article）が自動で作られます。

```markdown
---
title: 記事タイトル
description: 検索結果に表示される説明文（120〜160文字程度）
service: roof-wall          # solar / construction / roof-wall / factory-warehouse
published: 2026-10-02       # 公開日
updated: 2026-11-01         # 最終更新日（任意）
author: 施設診断技研         # 著者（任意。実在する人物のみ）
supervisor:                 # 監修者（任意。実在する方のみ。架空の人物は書かない）
---

結論を最初の1〜2文で書く（検索した人が一番知りたい答えを冒頭に）。

## 見出し

本文。**太字**、[内部リンク](/services/roof-wall)、箇条書き、表が使えます。

{{estimate}}   ← ここに「あなたの施設の場合はいくら？」の簡易見積を表示

{{service}}    ← 関連サービスLPへの案内カードを表示
```

- ファイル名がURLになります（`foo.md` → `/guides/foo`）。公開後は**ファイル名を変更しない**でください。
- 記事内の料金は `{{price:wall-infrared-sqm}}` のようなトークンで書くと、料金変更に自動追従します（使えるトークンは `src/lib/priceTokens.ts`）。
- 記事から該当サービスLPへの内部リンク（`{{service}}` やテキストリンク）を必ず入れてください。サービスLP側から関連ガイドへ出すには `src/content/services.ts` の `guides`（slug の配列）に追加します。
- 方針：薄い記事の大量生成はしない。実際の問い合わせで出た疑問を、質の高い記事にしていく。

## 11. サイトマップ・robots・canonical・OGP

- `sitemap.xml`：`src/app/sitemap.ts` が、固定ページ・サービスLP・ガイド記事から自動生成します（noindex のページは含みません）。
- `robots.txt`：`src/app/robots.ts`。本番はクロール可（`/api/` は除外）、Preview・開発環境は全拒否。
- `canonical`：各ページに自動設定。正規URLは `NEXT_PUBLIC_SITE_URL`（`https://shisetsu-shindan.jp`）。
- 構造化データ：`Organization`・`WebSite`・`Service`・`BreadcrumbList`・`Article` を実態に合わせて出力。**事業所の住所・電話・営業時間が確定するまで `LocalBusiness` は使いません。** 確定したら `src/config/site.ts` の `address` などに入力します。
- OGP画像：`public/og/*.png`（1200×630）。文言を変える場合は `scripts/generate-og.mjs` を編集して `node scripts/generate-og.mjs` を実行します（Microsoft Edge または Chrome が必要）。
- title / description：サービスLPは `src/content/services.ts`・`src/lib/seo.ts` で管理。LPのtitleの料金は `pricing.ts` から自動同期されます。

## 12. 使用機体の追加

機体は現在**未確定**のため、セクションは非表示です（架空の機体は載せません）。

1. `src/config/equipment.ts` の `equipment` 配列に、実機の情報（名称・写真・カメラ・赤外線性能・飛行時間・耐風性能・用途）を追加します。写真は `public/images/` に置きます。
2. 環境変数 `EQUIPMENT_SECTION_ENABLED=true` にして再デプロイします。サービスLPと About に表示されます。

## 13. 導入事例（実績）の追加

現在、実績がないため `/cases` は公開されません（404・サイトマップ非掲載）。**架空の実績・顧客・口コミ・企業ロゴは載せないでください。**

1. 実際の事例を取得したら、`src/config/cases.ts` の `cases` 配列に追加します（施設種別・地域・規模・課題・点検方法・所要時間・結果・写真）。顧客の掲載許可を必ず取得してください。
2. `CASES_ENABLED=true` にして再デプロイすると、`/cases` が公開され、フッターにリンクが表示され、サイトマップに追加されます。
3. 事例ごとの個別ページが必要になったら、`src/app/cases/[slug]/page.tsx` を追加します。

## 14. Feature Flags

| 変数 | 既定 | 内容 |
| --- | --- | --- |
| `NEXT_PUBLIC_PRICING_ENABLED` | `true` | `false` にすると、料金表・概算料金を非表示にし、「条件を確認後お見積り」のみ表示 |
| `LEGAL_INSPECTION_ENABLED` | `false` | 法定点検（建築基準法12条点検等）の外壁調査としての相談対応の記載を表示。**資格者との連携を確認してから** `true` に。`false` の間も、法制度の一般的な説明と「事前にご相談ください」の案内は表示されます。「12条点検対応」「国交省認定」等の断定表示はしません |
| `EQUIPMENT_SECTION_ENABLED` | `false` | 使用機体セクションの表示（[12](#12-使用機体の追加)） |
| `CASES_ENABLED` | `false` | 導入事例の公開（[13](#13-導入事例実績の追加)） |

電話番号の表示は `NEXT_PUBLIC_CONTACT_PHONE` の有無で自動的に切り替わります。

## 15. 画像の差し替え

現在、サイト内の画像は**自作のイメージイラスト（SVG）**です（`public/images/`、`scripts/generate-images.mjs` で生成）。実際の案件の写真と誤認されないよう、alt テキストにも「イメージイラスト」と明記しています。

写真に差し替える場合は、以下を守ってください。

- **商用利用が可能な素材**、または自社撮影の写真のみ使用する（競合サイトの画像のコピーは禁止）。
- 実績写真のように見せない（架空の実績の示唆をしない）。
- ファイル名は意味のある英語名（例：`drone-solar-panel-inspection.jpg`）、alt は内容を説明する自然な日本語（キーワードの羅列は不可）。
- `next/image` を使う（`unoptimized` はSVG用です。JPG/PNG/WebP に替えたら外して構いません）。
- 画像のパスは `src/content/services.ts` の `heroImage`、TOPは `src/app/page.tsx` で指定しています。

## 16. 公開前に人間が確認すること

- [ ] **料金**：`src/config/pricing.ts` の金額は仮料金です。実際の価格に変更したか（税込/税抜の扱いも）。
- [ ] **環境変数**：`RESEND_API_KEY`・`CONTACT_TO_EMAIL`・`CONTACT_FROM_EMAIL`・`NEXT_PUBLIC_SITE_URL` を Vercel に設定したか。本番から**実際に1件テスト送信**して、メールが届くか。
- [ ] **連絡先**：電話番号・メールアドレスは確定後に設定（架空の値は入れない）。
- [ ] **Google Analytics**：測定IDの設定と、イベントの記録確認。
- [ ] **Search Console**：登録・サイトマップ送信・主要URLのインデックス登録リクエスト。
- [ ] **法令・表現**：外壁調査の法制度の説明（`src/components/ServicePage.tsx` の `LegalSection`）、飛行に関する記載（許可・承認）が、実際の運用と合っているか。専門家（行政書士・建築士等）に確認すると安心です。
- [ ] **航空法の許可・承認**：特定飛行に該当する案件で、必要な許可・承認を取得できる体制か。
- [ ] **保険・資格**：加入保険・保有資格を表示する場合は、実態が確定してから `src/config/site.ts` に入力（未入力の間は表示されません）。
- [ ] **プライバシーポリシー**：制定日（`src/app/privacy/page.tsx` の `ENACTED`）、事業者情報、開示請求の窓口。必要に応じて専門家に確認。
- [ ] **法人化後**：法人格（株式会社等）の表示は、登記完了後に追加（現在は意図的に表示していません）。
- [ ] **実績・口コミ・機体・住所**：架空の情報が入っていないか（現在は入っていません）。
- [ ] **スマホ実機確認**：フォーム入力・見積・固定ボタンの操作性。
- [ ] **ドメイン**：`https://shisetsu-shindan.jp` が表示され、`www` や `http` からリダイレクトされるか。
- [ ] **Preview の noindex**：Vercel の Preview URL が検索に出ない設定になっているか（自動対応済み。念のため Preview のHTMLに `noindex` があるか確認）。

## 17. 開発コマンド・ディレクトリ構成

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` / `npm run start` | 本番ビルド／起動 |
| `npm run lint` / `npm run typecheck` | 静的解析 |
| `npm run test` | 自動テスト（見積計算、問い合わせ検証、SEO、記事リンク切れ） |

```
src/
├─ app/                  ページ（/, /services/[slug], /pricing, /estimate, /contact, /about, /guides, /privacy, /cases）、api/contact、sitemap、robots
├─ components/           UI部品（Header, Footer, EstimateFlow, ContactForm, ServicePage など）
├─ config/               設定値（site / pricing / contact / features / equipment / cases）← 運用で触る場所
├─ content/              文章データ（services.ts：4サービスLPの文章、common.ts：共通文章、guides/*.md：ガイド記事）
└─ lib/                  ロジック（estimate：見積計算、inquiry：問い合わせ検証、seo、analytics、guides）
public/
├─ images/               イメージイラスト（SVG）
└─ og/                   OGP画像（PNG）
scripts/                 画像生成スクリプト
```

**簡易見積の保存**：入力内容はブラウザの `localStorage`（キー `shisetsu-shindan:estimate:v1`）に保存され、ページ遷移・戻る操作・LPから見積ページへの移動でも保持されます。送信完了時に削除されます。
