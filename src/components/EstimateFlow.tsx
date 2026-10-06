"use client";

import Link from "next/link";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { pricing, SERVICE_IDS, type ServiceId } from "@/config/pricing";
import { serviceList, services } from "@/content/services";
import {
  calculateEstimate,
  describeAnswers,
  formatResult,
  getSizeSteps,
  NEEDS_CHECK_TEXT,
  type Answers,
  type EstimateResult,
} from "@/lib/estimate";
import { track } from "@/lib/analytics";
import { submitInquiry, validateFiles } from "@/lib/submit";
import { Icon } from "./Icon";
import { Field } from "./Field";

/**
 * 60秒簡易見積。
 * STEP: 1 点検内容 → 2 規模 → 3 場所 → 4 見積（概算料金を先に表示）→ 5 連絡先
 * 入力内容は localStorage に保持され、ページ遷移・戻る操作・LPから見積ページへ移動しても残ります。
 */

type Stage = "service" | "size" | "location" | "result" | "contact" | "done";

type State = {
  stage: Stage;
  service?: ServiceId;
  answers: Answers;
  sizeIndex: number;
  prefecture?: string;
  city: string;
  form: ContactDraft;
};

type ContactDraft = {
  company: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  facilityName: string;
  address: string;
  timing: string;
  contactMethod: string;
  otherConsult: string;
};

const emptyForm: ContactDraft = {
  company: "",
  name: "",
  email: "",
  phone: "",
  note: "",
  facilityName: "",
  address: "",
  timing: "",
  contactMethod: "",
  otherConsult: "",
};

const initialState: State = { stage: "service", answers: {}, sizeIndex: 0, city: "", form: emptyForm };

const STORAGE_KEY = "shisetsu-shindan:estimate:v1";

const PROGRESS = ["点検内容", "規模", "場所", "見積", "連絡先"] as const;
const stageToStep: Record<Stage, number> = { service: 1, size: 2, location: 3, result: 4, contact: 5, done: 5 };

function loadState(): State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<State>;
    if (!p || typeof p !== "object") return null;
    if (p.stage === "done") return null;
    if (p.service && !SERVICE_IDS.includes(p.service)) return null;
    return { ...initialState, ...p, form: { ...emptyForm, ...(p.form ?? {}) } };
  } catch {
    return null;
  }
}

function saveState(s: State) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* 保存できない環境では何もしない */
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

type Props = {
  /** サービスLP・ガイド記事から使う場合、最初から点検内容を選択済みにする */
  initialService?: ServiceId;
  /** 料金表示を行うか（Feature Flag） */
  pricingEnabled?: boolean;
  /** 配置場所の識別（GAのパラメータ用） */
  placement?: string;
};

export function EstimateFlow({ initialService, pricingEnabled = true, placement = "page" }: Props) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const startedRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const interactedRef = useRef(false);
  const openedAtRef = useRef(0);

  // 保存済みの入力を復元（初回描画後に実行。サーバー描画との不一致を避けるため）
  useEffect(() => {
    openedAtRef.current = Date.now();
    const stored = loadState();
    const queryService = new URLSearchParams(window.location.search).get("service") as ServiceId | null;
    const wanted = queryService && SERVICE_IDS.includes(queryService) ? queryService : initialService;
    let next: State = stored ?? initialState;
    if (wanted && next.service !== wanted) {
      next = { ...initialState, form: next.form, stage: "size", service: wanted };
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 変更のたびに保存
  useEffect(() => {
    if (ready && state.stage !== "done") saveState(state);
  }, [state, ready]);

  // ステップ移動時、見出しにフォーカス（ユーザー操作後のみ）
  useEffect(() => {
    if (interactedRef.current) headingRef.current?.focus({ preventScroll: true });
  }, [state.stage, state.sizeIndex]);

  const update = useCallback((patch: Partial<State>) => {
    interactedRef.current = true;
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const startOnce = useCallback(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("estimate_start", { placement });
    }
  }, [placement]);

  const service = state.service;
  const sizeSteps = service ? getSizeSteps(service) : [];
  const result: EstimateResult | null = service ? calculateEstimate(service, state.answers) : null;

  // 料金表示の計測（結果ステージに入ったとき1回）
  const viewedRef = useRef(false);
  useEffect(() => {
    if (state.stage === "result" && service && result && !viewedRef.current) {
      viewedRef.current = true;
      track("estimate_price_viewed", { service, status: result.status, placement });
    }
    if (state.stage !== "result") viewedRef.current = false;
  }, [state.stage, service, result, placement]);

  // ---- 操作 ----
  const chooseService = (id: ServiceId) => {
    startOnce();
    track("estimate_service_selected", { service: id, placement });
    update({ service: id, answers: {}, sizeIndex: 0, stage: "size" });
  };

  const chooseSize = (key: string, optionId: string) => {
    if (!service) return;
    track("estimate_size_selected", { service, step: key, value: optionId, placement });
    const answers = { ...state.answers, [key]: optionId };
    if (state.sizeIndex < sizeSteps.length - 1) update({ answers, sizeIndex: state.sizeIndex + 1 });
    else update({ answers, stage: "location" });
  };

  const back = () => {
    if (state.stage === "size") {
      if (state.sizeIndex > 0) update({ sizeIndex: state.sizeIndex - 1 });
      else update({ stage: "service" });
    } else if (state.stage === "location") update({ stage: "size", sizeIndex: Math.max(sizeSteps.length - 1, 0) });
    else if (state.stage === "result") update({ stage: "location" });
    else if (state.stage === "contact") update({ stage: "result" });
  };

  const restart = () => {
    clearState();
    startedRef.current = false;
    update({ ...initialState, form: state.form });
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-8" data-estimate-flow>
      <Progress current={stageToStep[state.stage]} />

      <div className="mt-6 sm:mt-8" aria-live="polite">
        {state.stage === "service" && (
          <>
            <StageHeading ref={headingRef}>何を点検したいですか？</StageHeading>
            <p className="mt-1 text-sm text-muted">点検内容と施設規模を選ぶだけ。正式なお見積りは無料です。</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {serviceList.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => chooseService(s.id)}
                    className="flex w-full items-center gap-4 rounded-xl border-2 border-line bg-white p-4 text-left transition hover:border-blue hover:bg-blue-tint focus-visible:border-blue sm:p-5"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-blue">
                      <Icon name={s.icon} className="h-8 w-8" />
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-navy">{s.short === "太陽光" ? "太陽光設備" : s.short}</span>
                      <span className="block text-sm leading-6 text-muted">{s.cardText}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {state.stage === "size" && service && sizeSteps[state.sizeIndex] && (
          <>
            <BackButton onClick={back} />
            <p className="mt-2 text-sm font-bold text-blue">{services[service].name}</p>
            <StageHeading ref={headingRef}>{sizeSteps[state.sizeIndex].title}</StageHeading>
            {sizeSteps.length > 1 && (
              <p className="mt-1 text-xs text-muted">
                質問 {state.sizeIndex + 1} / {sizeSteps.length}
              </p>
            )}
            <OptionGrid
              options={sizeSteps[state.sizeIndex].options}
              selected={state.answers[sizeSteps[state.sizeIndex].key]}
              onSelect={(id) => chooseSize(sizeSteps[state.sizeIndex].key, id)}
            />
          </>
        )}

        {state.stage === "location" && (
          <>
            <BackButton onClick={back} />
            <StageHeading ref={headingRef}>施設はどちらにありますか？</StageHeading>
            <p className="mt-1 text-sm text-muted">正確な住所は、この段階では不要です。</p>
            <OptionGrid
              options={pricing.locations}
              selected={state.prefecture}
              onSelect={(id) => {
                track("estimate_location_selected", { prefecture: id, placement });
                update({ prefecture: id });
              }}
              columns="location"
            />
            {state.prefecture === "other" && (
              <p className="mt-3 rounded-lg bg-light p-3 text-sm text-muted">
                関東外の場合も、案件内容によりご相談いただけます。まずは概算をご確認ください。
              </p>
            )}
            <div className="mt-5 max-w-sm">
              <Field
                label="市区町村"
                name="city"
                value={state.city}
                onChange={(e) => update({ city: e.target.value })}
                placeholder="例：川崎市"
                autoComplete="address-level2"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg mt-6 w-full sm:w-auto"
              disabled={!state.prefecture}
              onClick={() => update({ stage: "result" })}
            >
              概算料金を見る
            </button>
          </>
        )}

        {state.stage === "result" && service && result && (
          <ResultView
            ref={headingRef}
            service={service}
            answers={state.answers}
            prefecture={state.prefecture}
            city={state.city}
            result={result}
            pricingEnabled={pricingEnabled}
            onBack={back}
            onRequest={() => {
              track("estimate_contact_start", { service, placement });
              update({ stage: "contact" });
            }}
            onRestart={restart}
          />
        )}

        {state.stage === "contact" && service && (
          <ContactStep
            ref={headingRef}
            service={service}
            state={state}
            result={result}
            pricingEnabled={pricingEnabled}
            getOpenedAt={() => openedAtRef.current}
            onChange={(form) => update({ form })}
            onBack={back}
            onDone={() => {
              clearState();
              interactedRef.current = true;
              setState({ ...initialState, stage: "done" });
            }}
            placement={placement}
          />
        )}

        {state.stage === "done" && (
          <div className="py-6 text-center" role="status">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok/10 text-ok">
              <Icon name="check" className="h-8 w-8" />
            </span>
            <h3 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-bold text-navy">
              お見積りのご依頼を受け付けました
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
              ご入力のメールアドレス宛に、担当者よりご連絡します。内容によっては、ご連絡までにお時間をいただく場合があります。
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className="btn btn-secondary">
                トップページへ戻る
              </Link>
              <Link href="/guides" className="btn btn-secondary">
                お役立ち情報を見る
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

function Progress({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="見積の進行状況">
      {PROGRESS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-1" aria-current={active ? "step" : undefined}>
            <span
              className={`h-1.5 w-full rounded-full ${done || active ? "bg-blue" : "bg-line"}`}
              aria-hidden="true"
            />
            <span className={`text-[11px] leading-tight sm:text-xs ${active ? "font-bold text-navy" : "text-muted"}`}>
              <span className="sr-only">ステップ{n}：</span>
              <span aria-hidden="true">{n} </span>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}


const StageHeading = forwardRef<HTMLHeadingElement, { children: React.ReactNode }>(function StageHeading({ children }, ref) {
  return (
    <h3 ref={ref} tabIndex={-1} className="text-xl font-bold text-navy outline-none sm:text-2xl">
      {children}
    </h3>
  );
});

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="-ml-1 inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm text-muted hover:text-navy">
      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
        <path d="M8 2L4 6l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      戻る
    </button>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
  columns = "default",
}: {
  options: { id: string; label: string }[];
  selected?: string;
  onSelect: (id: string) => void;
  columns?: "default" | "location";
}) {
  return (
    <ul className={`mt-5 grid gap-3 ${columns === "location" ? "grid-cols-2 sm:grid-cols-5" : "sm:grid-cols-2"}`}>
      {options.map((o) => {
        const on = selected === o.id;
        return (
          <li key={o.id}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(o.id)}
              className={`flex min-h-14 w-full items-center justify-center rounded-xl border-2 px-4 py-3 text-center text-base font-bold transition ${
                on ? "border-blue bg-blue text-white" : "border-line bg-white text-navy hover:border-blue hover:bg-blue-tint"
              }`}
            >
              {o.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------------------------

const ResultView = forwardRef<
  HTMLHeadingElement,
  {
    service: ServiceId;
    answers: Answers;
    prefecture?: string;
    city: string;
    result: EstimateResult;
    pricingEnabled: boolean;
    onBack: () => void;
    onRequest: () => void;
    onRestart: () => void;
  }
>(function ResultView({ service, answers, prefecture, city, result, pricingEnabled, onBack, onRequest, onRestart }, ref) {
  const conditions = [
    { label: "点検内容", value: services[service].name },
    ...describeAnswers(service, answers),
    { label: "所在地", value: `${pricing.locations.find((l) => l.id === prefecture)?.label ?? "未選択"}${city ? ` ${city}` : ""}` },
  ];
  const showPrice = pricingEnabled;
  const included = pricing.includes.filter((i) => i.enabled);

  return (
    <>
      <BackButton onClick={onBack} />
      <h3 ref={ref} tabIndex={-1} className="mt-2 text-xl font-bold text-navy outline-none sm:text-2xl">
        概算料金
      </h3>

      <div className="mt-4 rounded-xl bg-navy p-5 text-white sm:p-8" data-testid="estimate-result">
        {showPrice && result.status === "priced" && (
          <>
            <p className="text-3xl font-bold tracking-wide sm:text-5xl">
              {formatResult(result)}
            </p>
            {result.lines.length > 1 && (
              <ul className="mt-3 space-y-1 text-sm text-white/85">
                {result.lines.map((l) => (
                  <li key={l.label}>
                    {l.label}：{l.max && l.max > l.min ? `${l.min.toLocaleString("ja-JP")}円〜${l.max.toLocaleString("ja-JP")}円` : `${l.min.toLocaleString("ja-JP")}円〜`}
                    {l.suffix ?? ""}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {showPrice && result.status === "individual" && (
          <>
            <p className="text-3xl font-bold sm:text-4xl">個別見積</p>
            <p className="mt-2 text-sm text-white/85">{result.reason}</p>
          </>
        )}
        {(!showPrice || result.status === "needs-check") && (
          <>
            <p className="text-2xl font-bold sm:text-3xl">{NEEDS_CHECK_TEXT}</p>
            {showPrice && result.status === "needs-check" && result.reference.length > 0 && (
              <div className="mt-3 text-sm text-white/85">
                <p className="font-bold">参考：</p>
                <ul className="mt-1 space-y-0.5">
                  {result.reference.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        <p className="mt-4 text-sm text-white/85">{pricing.disclaimer}</p>
      </div>

      {showPrice && result.notes.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {result.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}

      <dl className="mt-5 grid gap-x-6 gap-y-1 rounded-xl bg-light p-4 text-sm sm:grid-cols-2">
        {conditions.map((c) => (
          <div key={c.label} className="flex gap-2">
            <dt className="shrink-0 text-muted">{c.label}：</dt>
            <dd className="font-medium text-navy">{c.value}</dd>
          </div>
        ))}
      </dl>

      <details className="mt-4 rounded-xl border border-line p-4 text-sm">
        <summary className="cursor-pointer font-bold text-navy">料金に含まれる想定項目・追加料金について</summary>
        {included.length > 0 && (
          <>
            <p className="mt-3 font-bold">含まれる想定項目</p>
            <p className="mt-1 text-muted">{included.map((i) => i.label).join("、")}</p>
          </>
        )}
        <p className="mt-3 font-bold">現場により追加料金が必要になる場合</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted">
          {pricing.extras.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </details>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" className="btn btn-primary btn-lg w-full sm:w-auto" onClick={onRequest}>
          この条件で無料見積を依頼
        </button>
        <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={onRestart}>
          条件を変えてやり直す
        </button>
      </div>
      <p className="mt-3 text-xs text-muted">無料見積の依頼は、会社名・ご担当者名・メールアドレス・電話番号だけで送信できます。</p>
    </>
  );
});

// ---------------------------------------------------------------------------------------------

const ContactStep = forwardRef<
  HTMLHeadingElement,
  {
    service: ServiceId;
    state: State;
    result: EstimateResult | null;
    pricingEnabled: boolean;
    getOpenedAt: () => number;
    onChange: (f: ContactDraft) => void;
    onBack: () => void;
    onDone: () => void;
    placement: string;
  }
>(function ContactStep({ service, state, result, pricingEnabled, getOpenedAt, onChange, onBack, onDone, placement }, ref) {
  const f = state.form;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof ContactDraft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...f, [k]: e.target.value });

  const summary = [
    services[service].name,
    ...describeAnswers(service, state.answers).map((a) => a.value),
    pricing.locations.find((l) => l.id === state.prefecture)?.label ?? "",
  ]
    .filter(Boolean)
    .join(" / ");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setFieldErrors({});
    const files = Array.from(fileRef.current?.files ?? []);
    const fileError = validateFiles(files);
    if (fileError) {
      setError(fileError);
      return;
    }
    const fd = new FormData();
    fd.set("kind", "estimate");
    fd.set("service", service);
    fd.set("answers", JSON.stringify(state.answers));
    fd.set("prefecture", state.prefecture ?? "");
    fd.set("city", state.city);
    fd.set("pricingShown", String(pricingEnabled));
    for (const k of Object.keys(f) as (keyof ContactDraft)[]) fd.set(k, f[k]);
    fd.set("website", ""); // ハニーポット（人間は入力しない）
    fd.set("elapsed", String(Date.now() - getOpenedAt()));
    files.forEach((file) => fd.append("files", file));

    setSubmitting(true);
    const res = await submitInquiry(fd);
    setSubmitting(false);
    if (res.ok) {
      track("estimate_submit", { service, status: result?.status ?? "unknown", placement });
      onDone();
    } else {
      setError(res.message);
      if (res.fieldErrors) setFieldErrors(res.fieldErrors);
    }
  };

  return (
    <>
      <BackButton onClick={onBack} />
      <h3 ref={ref} tabIndex={-1} className="mt-2 text-xl font-bold text-navy outline-none sm:text-2xl">
        ご連絡先を入力してください
      </h3>
      <p className="mt-2 rounded-lg bg-light p-3 text-sm text-muted">
        <span className="font-bold text-navy">選択した条件：</span>
        {summary}
        {pricingEnabled && result?.status === "priced" && <> ／ 概算 {formatResult(result)}</>}
        <br />
        <span className="text-xs">※ 条件はそのまま送信されます。再入力は不要です。</span>
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate={false}>
        <Field label="会社名" name="company" value={f.company} onChange={set("company")} required autoComplete="organization" error={fieldErrors.company} maxLength={100} />
        <Field label="ご担当者名" name="name" value={f.name} onChange={set("name")} required autoComplete="name" error={fieldErrors.name} maxLength={60} />
        <Field label="メールアドレス" name="email" type="email" value={f.email} onChange={set("email")} required autoComplete="email" inputMode="email" error={fieldErrors.email} maxLength={200} />
        <Field label="電話番号" name="phone" type="tel" value={f.phone} onChange={set("phone")} required autoComplete="tel" inputMode="tel" error={fieldErrors.phone} maxLength={30} hint="ハイフンありでもなしでも構いません" />
        <Field as="textarea" label="補足事項" name="note" value={f.note} onChange={set("note")} error={fieldErrors.note} maxLength={2000} placeholder="ご質問やご要望があればご記入ください" />

        <details className="rounded-xl border border-line p-4">
          <summary className="cursor-pointer text-sm font-bold text-navy">詳しい情報を追加する（任意）</summary>
          <div className="mt-4 space-y-4">
            <Field label="施設名称" name="facilityName" value={f.facilityName} onChange={set("facilityName")} maxLength={100} />
            <Field label="正確な住所" name="address" value={f.address} onChange={set("address")} autoComplete="street-address" maxLength={200} />
            <Field label="希望点検時期" name="timing" value={f.timing} onChange={set("timing")} placeholder="例：来月中、年内など" maxLength={100} />
            <Field
              as="select"
              label="希望連絡方法"
              name="contactMethod"
              value={f.contactMethod}
              onChange={set("contactMethod")}
              options={[
                { value: "", label: "指定なし" },
                { value: "メール", label: "メール" },
                { value: "電話", label: "電話" },
              ]}
            />
            <div>
              <label htmlFor="estimate-files" className="block text-sm font-bold text-navy">
                対象の写真・図面 <span className="ml-1.5 rounded bg-light px-1.5 py-0.5 align-middle text-[11px] font-medium text-muted">任意</span>
              </label>
              <input
                id="estimate-files"
                ref={fileRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-tint file:px-3 file:py-2 file:font-bold file:text-blue-dark"
              />
              <p className="mt-1 text-xs text-muted">JPG・PNG・WebP・PDF／3件まで・合計4MBまで</p>
            </div>
            <Field as="textarea" label="その他の相談内容" name="otherConsult" value={f.otherConsult} onChange={set("otherConsult")} maxLength={2000} />
          </div>
        </details>

        {/* ハニーポット：画面外に配置し、ボットのみが入力する想定 */}
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
          {submitting ? "送信中…" : "無料見積を依頼する"}
        </button>
        <p className="text-xs leading-6 text-muted">
          送信により、
          <Link href="/privacy" className="underline underline-offset-4" target="_blank">
            プライバシーポリシー
          </Link>
          に同意したものとします。営業目的の無断配信は行いません。
        </p>
      </form>
    </>
  );
});

