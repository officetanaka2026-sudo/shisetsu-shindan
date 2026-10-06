"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  event?: AnalyticsEvent;
  eventParams?: Record<string, string | number | boolean | undefined>;
};

/** クリック時にGAイベントを送るリンク（内部リンク用） */
export function TrackedLink({ event, eventParams, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        if (event) track(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}

type AProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: AnalyticsEvent;
  eventParams?: Record<string, string | number | boolean | undefined>;
};

/** tel: / mailto: など外部スキーム用 */
export function TrackedAnchor({ event, eventParams, onClick, ...rest }: AProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
