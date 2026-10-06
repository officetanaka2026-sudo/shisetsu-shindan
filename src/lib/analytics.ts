"use client";

/**
 * Google Analytics 4 イベント送信。
 * NEXT_PUBLIC_GA_ID が未設定の場合は何も送信しません（開発時はコンソールに出力）。
 *
 * イベント一覧:
 *  estimate_start / estimate_service_selected / estimate_size_selected / estimate_price_viewed /
 *  estimate_contact_start / estimate_submit / contact_click / phone_click / email_click /
 *  service_click / pricing_view
 */
export type AnalyticsEvent =
  | "estimate_start"
  | "estimate_service_selected"
  | "estimate_size_selected"
  | "estimate_location_selected"
  | "estimate_price_viewed"
  | "estimate_contact_start"
  | "estimate_submit"
  | "contact_click"
  | "phone_click"
  | "email_click"
  | "service_click"
  | "pricing_view";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  } else if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, params);
  }
}
