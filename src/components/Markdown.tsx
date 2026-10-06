import Link from "next/link";
import { Fragment } from "react";
import type { ServiceId } from "@/config/pricing";
import { services } from "@/content/services";
import { EstimateFlow } from "./EstimateFlow";
import { features } from "@/config/features";
import { TrackedLink } from "./TrackedLink";

/**
 * ガイド記事用の最小限のMarkdownレンダラー（外部ライブラリ不要）。
 *
 * 対応記法:
 *   ## 見出し2 / ### 見出し3 / - 箇条書き / 1. 番号リスト / > 注記 / | 表 |
 *   **太字** / [リンク](/path)
 *   {{estimate}}  … 記事の途中に「あなたの施設の場合はいくら？」の簡易見積を表示
 *   {{service}}   … 関連サービスLPへの案内カードを表示
 */

type Node =
  | { t: "h2" | "h3"; text: string; id: string }
  | { t: "p"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "quote"; text: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "estimate" }
  | { t: "service" };

export function extractHeadings(body: string): { id: string; text: string }[] {
  return parse(body).flatMap((n) => (n.t === "h2" ? [{ id: n.id, text: n.text }] : []));
}

function parse(body: string): Node[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const nodes: Node[] = [];
  let h = 0;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.trim() === "{{estimate}}") {
      nodes.push({ t: "estimate" });
      i++;
    } else if (line.trim() === "{{service}}") {
      nodes.push({ t: "service" });
      i++;
    } else if (line.startsWith("## ")) {
      nodes.push({ t: "h2", text: line.slice(3).trim(), id: `s${++h}` });
      i++;
    } else if (line.startsWith("### ")) {
      nodes.push({ t: "h3", text: line.slice(4).trim(), id: `s${++h}` });
      i++;
    } else if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) items.push(lines[i++].slice(2).trim());
      nodes.push({ t: "ul", items });
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, "").trim());
      nodes.push({ t: "ol", items });
    } else if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) buf.push(lines[i++].slice(2));
      nodes.push({ t: "quote", text: buf.join(" ") });
    } else if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(
          lines[i++]
            .replace(/^\||\|$/g, "")
            .split("|")
            .map((c) => c.trim()),
        );
      }
      const [head, , ...rest] = rows; // 2行目は区切り行（---）
      nodes.push({ t: "table", head, rows: rest });
    } else {
      const buf: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(#{2,3} |[-*] |\d+\. |> |\||\{\{)/.test(lines[i])
      ) {
        buf.push(lines[i++].trim());
      }
      nodes.push({ t: "p", text: buf.join("") });
    }
  }
  return nodes;
}

function Inline({ text }: { text: string }) {
  // **太字** と [テキスト](リンク) のみ対応
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const bold = p.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const href = link[2];
          return href.startsWith("/") ? (
            <Link key={i} href={href}>
              {link[1]}
            </Link>
          ) : (
            <a key={i} href={href} rel="noopener noreferrer" target="_blank">
              {link[1]}
            </a>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export function Markdown({ body, service }: { body: string; service: ServiceId }) {
  const nodes = parse(body);
  const s = services[service];
  return (
    <div className="prose-ja text-base leading-8">
      {nodes.map((n, i) => {
        switch (n.t) {
          case "h2":
            return (
              <h2 key={i} id={n.id}>
                {n.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={n.id}>
                {n.text}
              </h3>
            );
          case "p":
            return (
              <p key={i}>
                <Inline text={n.text} />
              </p>
            );
          case "ul":
          case "ol": {
            const Tag = n.t;
            return (
              <Tag key={i}>
                {n.items.map((it) => (
                  <li key={it}>
                    <Inline text={it} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "quote":
            return (
              <p key={i} className="mt-5 rounded-lg border border-blue/30 bg-blue-tint p-4 text-sm leading-7">
                <Inline text={n.text} />
              </p>
            );
          case "table":
            return (
              <div key={i} className="mt-5 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-navy text-white">
                      {n.head.map((h, j) => (
                        <th key={j} scope="col" className="px-4 py-3 font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {n.rows.map((r, ri) => (
                      <tr key={ri} className="border-t border-line align-top">
                        {r.map((c, ci) =>
                          ci === 0 ? (
                            <th key={ci} scope="row" className="bg-light px-4 py-3 font-bold text-navy">
                              <Inline text={c} />
                            </th>
                          ) : (
                            <td key={ci} className="px-4 py-3">
                              <Inline text={c} />
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "estimate":
            return (
              <aside key={i} className="not-prose my-10 rounded-2xl bg-light p-4 sm:p-6" aria-label="簡易見積">
                <p className="text-center text-xl font-bold text-navy sm:text-2xl">あなたの施設の場合はいくら？</p>
                <p className="mt-1 text-center text-sm text-muted">60秒で料金の目安が分かります。正式なお見積りは無料です。</p>
                <div className="mt-5">
                  <EstimateFlow initialService={service} pricingEnabled={features.pricingEnabled} placement="guide" />
                </div>
              </aside>
            );
          case "service":
            return (
              <aside key={i} className="my-8 rounded-xl border border-line bg-white p-5">
                <p className="text-xs font-bold text-blue">関連サービス</p>
                <p className="mt-1 text-lg font-bold text-navy">{s.name}</p>
                <p className="mt-1 text-sm leading-7 text-muted">{s.summary}</p>
                <TrackedLink
                  href={`/services/${s.slug}`}
                  event="service_click"
                  eventParams={{ service: s.slug, location: "guide" }}
                  className="btn btn-secondary mt-3 !min-h-11 text-sm"
                >
                  {s.name}の詳細・料金を見る
                </TrackedLink>
              </aside>
            );
        }
      })}
    </div>
  );
}
