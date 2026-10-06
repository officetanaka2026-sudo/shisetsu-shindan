"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { serviceList } from "@/content/services";
import { track } from "@/lib/analytics";
import { submitInquiry, validateFiles } from "@/lib/submit";
import { Field } from "./Field";
import { Icon } from "./Icon";

/** 通常のお問い合わせフォーム（/contact）。60秒簡易見積を使わない方向けに残しています。 */
export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const openedAt = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setFieldErrors({});
    const form = e.currentTarget;
    const files = Array.from(fileRef.current?.files ?? []);
    const fileError = validateFiles(files);
    if (fileError) {
      setError(fileError);
      return;
    }
    const fd = new FormData(form);
    fd.delete("files");
    files.forEach((f) => fd.append("files", f));
    fd.set("kind", "contact");
    fd.set("elapsed", String(Date.now() - openedAt.current));

    setSubmitting(true);
    const res = await submitInquiry(fd);
    setSubmitting(false);
    if (res.ok) {
      track("contact_click", { location: "contact_page", target: "contact_form_submit" });
      setDone(true);
    } else {
      setError(res.message);
      if (res.fieldErrors) setFieldErrors(res.fieldErrors);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok/10 text-ok">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h2 ref={doneRef} tabIndex={-1} className="mt-4 text-2xl">
          お問い合わせを受け付けました
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
          ご入力のメールアドレス宛に、担当者よりご連絡します。内容によっては、ご連絡までにお時間をいただく場合があります。
        </p>
        <Link href="/" className="btn btn-secondary mt-6">
          トップページへ戻る
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-8">
      <Field label="会社名" name="company" required autoComplete="organization" error={fieldErrors.company} maxLength={100} />
      <Field label="ご担当者名" name="name" required autoComplete="name" error={fieldErrors.name} maxLength={60} />
      <Field label="メールアドレス" name="email" type="email" required autoComplete="email" inputMode="email" error={fieldErrors.email} maxLength={200} />
      <Field label="電話番号" name="phone" type="tel" required autoComplete="tel" inputMode="tel" error={fieldErrors.phone} maxLength={30} hint="ハイフンありでもなしでも構いません" />
      <Field
        as="select"
        label="ご相談のサービス"
        name="service"
        required
        defaultValue=""
        error={fieldErrors.service}
        options={[
          { value: "", label: "選択してください" },
          ...serviceList.map((s) => ({ value: s.id, label: s.name })),
          { value: "other", label: "その他・まだ決まっていない" },
        ]}
      />
      <Field label="所在地" name="address" autoComplete="address-level1" placeholder="例：神奈川県川崎市" maxLength={200} />
      <Field label="施設規模" name="facilityScale" placeholder="例：延床5,000㎡程度の倉庫／太陽光 300kW" maxLength={100} />
      <Field label="希望時期" name="timing" placeholder="例：来月中、年内など" maxLength={100} />
      <Field as="textarea" label="詳細・ご相談内容" name="note" maxLength={2000} rows={6} placeholder="点検したい場所、目的、気になっている点などをご記入ください" />
      <div>
        <label htmlFor="contact-files" className="block text-sm font-bold text-navy">
          画像・図面の添付 <span className="ml-1.5 rounded bg-light px-1.5 py-0.5 align-middle text-[11px] font-medium text-muted">任意</span>
        </label>
        <input
          id="contact-files"
          ref={fileRef}
          name="files"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-tint file:px-3 file:py-2 file:font-bold file:text-blue-dark"
        />
        <p className="mt-1 text-xs text-muted">JPG・PNG・WebP・PDF／3件まで・合計4MBまで。大きいファイルは、見積後にお送りいただけます。</p>
      </div>

      {/* ハニーポット */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          ウェブサイト（入力しないでください）
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-cta/40 bg-cta/5 p-3 text-sm font-medium text-cta">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting}>
        {submitting ? "送信中…" : "送信する"}
      </button>
      <p className="text-xs leading-6 text-muted">
        送信により、
        <Link href="/privacy" className="underline underline-offset-4" target="_blank">
          プライバシーポリシー
        </Link>
        に同意したものとします。営業目的の無断配信は行いません。
      </p>
    </form>
  );
}

