/** 連絡先。環境変数に値がある場合のみ表示されます（架空の番号・アドレスは設定しないこと）。 */
const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";

export const contact = {
  phone: phone || null,
  /** tel: リンク用（ハイフン・空白を除去） */
  phoneHref: phone ? `tel:${phone.replace(/[^0-9+]/g, "")}` : null,
  email: email || null,
  emailHref: email ? `mailto:${email}` : null,
};
