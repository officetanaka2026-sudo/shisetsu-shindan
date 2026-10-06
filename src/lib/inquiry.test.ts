import { describe, expect, it } from "vitest";
import { buildEmail, sanitizeAnswers, validateInquiry, type InquiryFields } from "./inquiry";

const base: InquiryFields = {
  kind: "estimate",
  company: "テスト管理株式会社",
  name: "山田 太郎",
  email: "yamada@example.com",
  phone: "03-1234-5678",
  note: "",
  service: "roof-wall",
  answers: { target: "wall", area: "1000-3000" },
  prefecture: "kanagawa",
  city: "川崎市",
};

describe("問い合わせの検証", () => {
  it("必須項目がそろっていればエラーなし", () => {
    expect(validateInquiry(base)).toEqual({});
  });
  it("会社名・メール・電話の不備を検出する", () => {
    const e = validateInquiry({ ...base, company: "", email: "abc", phone: "12" });
    expect(Object.keys(e).sort()).toEqual(["company", "email", "phone"]);
  });
  it("お問い合わせフォームは『その他』を許容し、未選択はエラー", () => {
    expect(validateInquiry({ ...base, kind: "contact", service: undefined, serviceLabel: "その他・まだ決まっていない" })).toEqual({});
    expect(validateInquiry({ ...base, kind: "contact", service: undefined })).toHaveProperty("service");
  });
  it("見積ルートでサービスが不正ならエラー", () => {
    expect(validateInquiry({ ...base, service: undefined })).toHaveProperty("service");
  });
});

describe("見積条件の改ざん対策", () => {
  it("選択肢にない値は取り除く", () => {
    expect(sanitizeAnswers("solar", { capacity: "lt50", evil: "x" })).toEqual({ capacity: "lt50" });
    expect(sanitizeAnswers("solar", { capacity: "<script>" })).toEqual({});
    expect(sanitizeAnswers("solar", null)).toEqual({});
  });
});

describe("通知メール", () => {
  it("見積条件と概算がサーバー側で再計算されて本文に入る", () => {
    const { subject, text } = buildEmail(base, { pricingShown: true });
    expect(subject).toContain("無料見積のご依頼");
    expect(text).toContain("点検内容：屋根・外壁点検");
    expect(text).toContain("点検対象：外壁");
    expect(text).toContain("所在地：神奈川県 川崎市");
    expect(text).toContain("250,000円〜750,000円");
    expect(text).toContain("電話：03-1234-5678");
  });
  it("件名に改行が混入しない（ヘッダーインジェクション対策）", () => {
    const { subject } = buildEmail({ ...base, company: "A社\r\nBcc: x@evil.example" }, { pricingShown: true });
    expect(subject).not.toMatch(/[\r\n]/);
  });
});
