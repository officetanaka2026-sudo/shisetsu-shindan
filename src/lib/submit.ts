/** 問い合わせ送信（クライアント側）。/api/contact に FormData を POST します。 */
export type SubmitResult = { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string> };

export const MAX_FILES = 3;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // Vercel の本文サイズ上限（約4.5MB）に収まる範囲

export async function submitInquiry(formData: FormData): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/contact", { method: "POST", body: formData });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; fieldErrors?: Record<string, string> };
    if (res.ok && json.ok) return { ok: true };
    return {
      ok: false,
      message: json.message ?? "送信に失敗しました。時間をおいて、もう一度お試しください。",
      fieldErrors: json.fieldErrors,
    };
  } catch {
    return { ok: false, message: "通信に失敗しました。ネットワークをご確認のうえ、もう一度お試しください。" };
  }
}

/** 選択された添付ファイルの検証（件数・合計サイズ・形式）。問題があればメッセージを返す。 */
export function validateFiles(files: File[]): string | null {
  if (files.length > MAX_FILES) return `添付できるファイルは${MAX_FILES}件までです。`;
  const total = files.reduce((s, f) => s + f.size, 0);
  if (total > MAX_TOTAL_BYTES) return "添付ファイルの合計サイズは4MBまでです。大きいファイルは、見積後にメール等でお送りください。";
  const ok = /\.(jpe?g|png|webp|pdf)$/i;
  if (files.some((f) => !ok.test(f.name))) return "添付できる形式は、JPG・PNG・WebP・PDFです。";
  return null;
}
