import { NextResponse } from "next/server";
import { SERVICE_IDS, type ServiceId } from "@/config/pricing";
import { buildEmail, sanitizeAnswers, strip, validateInquiry, type InquiryFields } from "@/lib/inquiry";

export const runtime = "nodejs";

const MAX_FILES = 3;
const MAX_TOTAL = 4 * 1024 * 1024;
const FILE_RE = /\.(jpe?g|png|webp|pdf)$/i;

// 簡易レート制限（同一IPから10分間に5件まで）。サーバーレスのインスタンス単位の対策です。
// より強い対策が必要になったら Vercel の Firewall / Bot Protection や Cloudflare Turnstile の導入を検討してください。
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const win = 10 * 60 * 1000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) for (const [k, v] of hits) if (v.every((t) => now - t >= win)) hits.delete(k);
  return list.length > 5;
}

const fail = (message: string, status = 400, fieldErrors?: Record<string, string>) =>
  NextResponse.json({ ok: false, message, fieldErrors }, { status });

export async function POST(request: Request) {
  // 同一オリジンからの送信のみ受け付ける
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return fail("不正なリクエストです。", 403);
    } catch {
      return fail("不正なリクエストです。", 403);
    }
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return fail("短時間に送信が集中しています。しばらく経ってからもう一度お試しください。", 429);

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return fail("送信内容を読み取れませんでした。ファイルのサイズをご確認ください。", 400);
  }

  // スパム対策：ハニーポット入力あり、または入力が不自然に速い場合は成功を装って破棄
  if (strip(fd.get("website"))) return NextResponse.json({ ok: true });
  const elapsed = Number(strip(fd.get("elapsed"), 20));
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < 2500) return NextResponse.json({ ok: true });

  const kind = strip(fd.get("kind"), 20) === "estimate" ? "estimate" : "contact";
  const serviceRaw0 = strip(fd.get("service"), 40);
  const serviceRaw = serviceRaw0 as ServiceId;
  const service = SERVICE_IDS.includes(serviceRaw) ? serviceRaw : undefined;

  let answers: InquiryFields["answers"];
  if (kind === "estimate" && service) {
    try {
      answers = sanitizeAnswers(service, JSON.parse(strip(fd.get("answers"), 2000) || "{}"));
    } catch {
      answers = {};
    }
  }

  const fields: InquiryFields = {
    kind,
    company: strip(fd.get("company"), 100),
    name: strip(fd.get("name"), 60),
    email: strip(fd.get("email"), 200),
    phone: strip(fd.get("phone"), 30),
    note: strip(fd.get("note"), 2000),
    service,
    answers,
    prefecture: strip(fd.get("prefecture"), 40),
    city: strip(fd.get("city"), 60),
    facilityName: strip(fd.get("facilityName"), 100),
    address: strip(fd.get("address"), 200),
    timing: strip(fd.get("timing"), 100),
    contactMethod: strip(fd.get("contactMethod"), 20),
    otherConsult: strip(fd.get("otherConsult"), 2000),
    facilityScale: strip(fd.get("facilityScale"), 100),
    serviceLabel: kind === "contact" && serviceRaw0 === "other" ? "その他・まだ決まっていない" : undefined,
  };

  const fieldErrors = validateInquiry(fields);
  if (Object.keys(fieldErrors).length) return fail("入力内容をご確認ください。", 422, fieldErrors);

  // 添付ファイル
  const files = fd.getAll("files").filter((v): v is File => typeof v !== "string" && v.size > 0);
  if (files.length > MAX_FILES) return fail(`添付できるファイルは${MAX_FILES}件までです。`, 422);
  if (files.reduce((s, f) => s + f.size, 0) > MAX_TOTAL) return fail("添付ファイルの合計サイズは4MBまでです。", 422);
  if (files.some((f) => !FILE_RE.test(f.name))) return fail("添付できる形式は、JPG・PNG・WebP・PDFです。", 422);
  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: f.name.replace(/[^\w.\-\u3040-\u30ff\u4e00-\u9fff]/g, "_").slice(0, 80),
      content: Buffer.from(await f.arrayBuffer()).toString("base64"),
    })),
  );

  const { subject, text } = buildEmail(fields, { pricingShown: strip(fd.get("pricingShown"), 10) !== "false" });

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "施設診断技研 <onboarding@resend.dev>";

  if (!apiKey || to.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      // 開発中は、メール送信設定がなくても動作確認できるようにコンソールへ出力します。
      console.log("[contact] メール送信設定が未設定のため、内容をコンソールに出力します。\n", subject, "\n", text);
      return NextResponse.json({ ok: true });
    }
    console.error("[contact] RESEND_API_KEY または CONTACT_TO_EMAIL が未設定です。");
    return fail("現在、フォームからの送信を一時的に受け付けられません。お手数ですが、時間をおいて再度お試しください。", 503);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: fields.email,
        subject,
        text,
        ...(attachments.length ? { attachments } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
      return fail("送信に失敗しました。時間をおいて、もう一度お試しください。", 502);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return fail("送信に失敗しました。時間をおいて、もう一度お試しください。", 502);
  }
}


