# 引き継ぎメモ（Windows → Mac）

最終更新：2026-10-06。**このファイルに、APIキーなどの秘密の値は書かないこと。**

## 現在の状態
- サイト：https://shisetsu-shindan.vercel.app に本番デプロイ済み（Vercel Pro、アカウント `officetanaka2026-5099`、チーム `kentotanaka`、プロジェクト `shisetsu-shindan`）
- 独自ドメイン `shisetsu-shindan.jp` / `www.shisetsu-shindan.jp` は Vercel に追加済み。**DNSがまだ反映されていない**（下記）
- 問い合わせフォームは、メール環境変数が未設定のため**送信エラー**になる
- 料金は仮料金のまま（`src/config/pricing.ts`）

## 未完了の作業
1. **お名前.comのネームサーバー切替**（最優先）
   - DNSレコードは、`01〜04.dnsv.jp` 側には正しく入っている（A `@`→76.76.21.21、CNAME `www`→cname.vercel-dns.com、Resend用の `send` / `rsend` CNAME と `resend._domainkey` TXT）。
   - しかし、ドメインに登録されているネームサーバーは `dns1/dns2.onamae.com`（旧）のままで、レコードが世界に見えていない。
   - お名前.com Navi →「ネームサーバーの変更」で、`dnsv.jp` 系を使う設定に切り替える。反映は数時間〜48時間。
2. **Resend**：Domains の Verify を押し、Verified になるのを確認。
3. **Vercel 環境変数（Production）**：`RESEND_API_KEY`（秘密。田中さん本人が登録）、`CONTACT_TO_EMAIL`、`CONTACT_FROM_EMAIL`（例：`施設診断技研 <noreply@shisetsu-shindan.jp>`）。
   - 登録後に**再デプロイ**が必要（Vercel のダッシュボードの Deployments → ⋯ → Redeploy でも可）。
4. 本番で `/contact` から**テスト送信**し、通知メールが届くか確認。
5. Vercel の Domains 画面で、`www` を `shisetsu-shindan.jp` にリダイレクト。
6. 料金の確定、電話・公開メール・GA測定ID の設定、Search Console 登録（README 参照）。

## 確認コマンド（DNSの反映）
```bash
dig +short shisetsu-shindan.jp A          # 76.76.21.21 になれば反映済み
dig +short www.shisetsu-shindan.jp CNAME  # cname.vercel-dns.com
dig +short send.shisetsu-shindan.jp CNAME # send.forge.rmta.net
```

## 参考
- 運用・設定の全手順：`README.md`
- 会社全体の方針・決定ログ：`C:\workspace\CLAUDE.md`、`C:\workspace\company\chief-of-staff\LOG.md`（Macへ持っていく場合は、別途コピーが必要）
