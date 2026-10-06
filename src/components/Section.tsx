import type { ReactNode } from "react";

type Props = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** 背景色 */
  tone?: "white" | "light" | "navy";
  center?: boolean;
  children?: ReactNode;
  /** h1 にしたい場合のみ指定（通常は h2） */
  as?: "h1" | "h2";
};

/** 1セクション1メッセージ。見出し・リード・本文をそろえて表示します。 */
export function Section({ id, eyebrow, title, lead, tone = "white", center, children, as: Tag = "h2" }: Props) {
  const bg = tone === "light" ? "bg-light" : tone === "navy" ? "bg-navy text-white" : "bg-white";
  return (
    <section id={id} className={`section ${bg}`}>
      <div className="container-x">
        <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow && <p className={`eyebrow ${tone === "navy" ? "!text-blue-tint" : ""}`}>{eyebrow}</p>}
          <Tag className={`mt-1 text-2xl sm:text-3xl ${tone === "navy" ? "!text-white" : ""}`}>{title}</Tag>
          {lead && <p className={`mt-4 text-base leading-8 ${tone === "navy" ? "text-white/85" : "text-muted"}`}>{lead}</p>}
        </div>
        {children && <div className="mt-8 sm:mt-10">{children}</div>}
      </div>
    </section>
  );
}
