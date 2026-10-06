import { pricing, SERVICE_IDS, type ServiceId } from "@/config/pricing";
import { services } from "@/content/services";
import { calculateEstimate, describeAnswers, formatResult, getSizeSteps, type Answers } from "@/lib/estimate";

/** 問い合わせの検証・メール本文の組み立て（サーバー側。純粋関数なのでテスト可能） */

export type InquiryKind = "estimate" | "contact";

export type InquiryFields = {
  kind: InquiryKind;
  company: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  // 見積ルート
  service?: ServiceId;
  answers?: Answers;
  prefecture?: string;
  city?: string;
  // 詳細（任意）
  facilityName?: string;
  address?: string;
  timing?: string;
  contactMethod?: string;
  otherConsult?: string;
  // /contact ルート
  facilityScale?: string;
  /** 「その他・未定」を選んだ場合の表示名 */
  serviceLabel?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const strip = (v: FormDataEntryValue | null | undefined, max = 2000): string =>
  typeof v === "string" ? v.replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";

export function validateInquiry(f: InquiryFields): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.company) e.company = "会社名を入力してください。";
  if (!f.name) e.name = "ご担当者名を入力してください。";
  if (!f.email) e.email = "メールアドレスを入力してください。";
  else if (!EMAIL_RE.test(f.email)) e.email = "メールアドレスの形式をご確認ください。";
  const digits = f.phone.replace(/\D/g, "");
  if (!f.phone) e.phone = "電話番号を入力してください。";
  else if (digits.length < 9 || digits.length > 15 || !/^[0-9+\-\s()（）－ー]+$/.test(f.phone)) e.phone = "電話番号の形式をご確認ください。";

  if (f.kind === "estimate") {
    if (!f.service || !SERVICE_IDS.includes(f.service)) e.service = "見積条件が正しく選択されていません。お手数ですが最初からやり直してください。";
  } else if (!(f.service && SERVICE_IDS.includes(f.service)) && !f.serviceLabel) {
    e.service = "ご相談のサービスを選択してください。";
  }
  return e;
}

/** answers の内容が選択肢に存在するものだけを残す（改ざん対策） */
export function sanitizeAnswers(service: ServiceId, raw: unknown): Answers {
  const out: Answers = {};
  if (!raw || typeof raw !== "object") return out;
  for (const step of getSizeSteps(service)) {
    const v = (raw as Record<string, unknown>)[step.key];
    if (typeof v === "string" && step.options.some((o) => o.id === v)) out[step.key] = v;
  }
  return out;
}

const line = (label: string, value?: string) => (value ? `${label}：${value}` : null);

/** 通知メールの件名と本文 */
export function buildEmail(f: InquiryFields, meta: { pricingShown: boolean }): { subject: string; text: string } {
  const service = f.service ? services[f.service] : undefined;
  const sections: string[] = [];

  if (f.kind === "estimate" && f.service && service) {
    const answers = f.answers ?? {};
    const result = calculateEstimate(f.service, answers);
    const pref = pricing.locations.find((l) => l.id === f.prefecture)?.label ?? "";
    sections.push(
      [
        "■ 見積条件（60秒簡易見積）",
        `点検内容：${service.name}`,
        ...describeAnswers(f.service, answers).map((a) => `${a.label}：${a.value}`),
        `所在地：${[pref, f.city].filter(Boolean).join(" ")}`,
        `表示した概算：${meta.pricingShown ? formatResult(result) : "（料金非表示設定）"}`,
      ].join("\n"),
    );
  } else {
    sections.push(
      ["■ ご相談内容（お問い合わせフォーム）", line("相談サービス", service?.name ?? f.serviceLabel), line("所在地", f.address || f.prefecture), line("施設規模", f.facilityScale), line("希望時期", f.timing)]
        .filter(Boolean)
        .join("\n"),
    );
  }

  sections.push(["■ ご連絡先", `会社名：${f.company}`, `ご担当者名：${f.name}`, `メール：${f.email}`, `電話：${f.phone}`, line("希望連絡方法", f.contactMethod)].filter(Boolean).join("\n"));

  const detail = [line("施設名称", f.facilityName), f.kind === "estimate" ? line("正確な住所", f.address) : null, f.kind === "estimate" ? line("希望点検時期", f.timing) : null].filter(Boolean);
  if (detail.length) sections.push(["■ 詳細情報", ...detail].join("\n"));

  const free = [f.note, f.otherConsult].filter(Boolean);
  if (free.length) sections.push(["■ 補足・ご相談", ...free].join("\n\n"));

  const subject = `【施設診断技研】${f.kind === "estimate" ? "無料見積のご依頼" : "お問い合わせ"}：${service?.short ?? f.serviceLabel ?? ""} ${f.company}`.replace(/[\r\n]+/g, " ").slice(0, 150);
  return { subject, text: sections.join("\n\n") + "\n" };
}

