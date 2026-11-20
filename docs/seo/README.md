# SEOの運用

検索からの問い合わせを増やすため、次の2つを毎日回します。

| 仕組み | いつ | 何をするか | 結果の見方 |
|---|---|---|---|
| SEO監視（GitHub Actions `SEO監視`） | 毎日 5:47 | 本番サイトの全ページを巡回し、表示できないページ、noindex、title・description の欠け・重複、canonical、リダイレクト、内部リンク、本文の短さなどを確認する | GitHub の Actions → SEO監視 → 実行結果の Summary。問題があった日は Issue「SEO監視で問題が見つかりました」に記録される |
| 記事の追加・改善（Claude の日次ルーティン） | 毎日 | 監視結果を確認し、問題があれば先に直す。なければ `keyword-plan.md` の上から1本記事を書くか、既存記事を加筆する。PR を作る | PR の内容を確認してマージすると、本番に公開される |

- 記事の書き方：[article-rules.md](./article-rules.md)
- 書く予定の記事：[keyword-plan.md](./keyword-plan.md)
- 監視スクリプト：`scripts/seo-monitor.mjs`（手元で試す場合は `npm run seo:monitor -- https://shisetsu-shindan.jp`）

## まだ足りないもの
- **Google Search Console**：実際の検索順位、表示回数、クリック数、インデックス状況は Search Console でしか正確に分からない。登録後、監視に順位とクリック数のデータを加える。
- **GA4**：問い合わせにつながったかを測るため、`NEXT_PUBLIC_GA_ID` を設定する。
