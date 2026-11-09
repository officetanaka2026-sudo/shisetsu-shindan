/** 連絡先。環境変数に値がある場合のみ表示されます（架空の番号・アドレスは設定しないこと）。 */
// 2026-11-09 営業電話が増えたため、電話番号はサイトに表示しない（問い合わせはフォームとメールで受付）。
// 再表示する場合は下の行を process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "" に戻す。
const phone: string = "";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";

export const contact = {
  phone: phone || null,
  /** tel: リンク用（ハイフン・空白を除去） */
  phoneHref: phone ? `tel:${phone.replace(/[^0-9+]/g, "")}` : null,
  email: email || null,
  emailHref: email ? `mailto:${email}` : null,
};
