import { flowSteps } from "@/content/common";

/** 点検・納品の流れ */
export function ProcessSteps({ steps = flowSteps }: { steps?: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-xl border border-line bg-white p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white" aria-hidden="true">
            {i + 1}
          </span>
          <h3 className="mt-3 text-lg">
            <span className="sr-only">ステップ{i + 1}：</span>
            {s.title}
          </h3>
          <p className="mt-1 text-sm leading-7 text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
