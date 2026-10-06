"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** ページ表示時に1回だけイベントを送る（例: pricing_view） */
export function PageViewEvent({ event, params }: { event: AnalyticsEvent; params?: Record<string, string> }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
