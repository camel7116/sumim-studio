/**
 * 분석 설정 (문서 §14.2)
 * 환경변수가 있을 때만 활성화된다. 개인정보를 이벤트 값으로 보내지 않는다.
 */

export const gaId = process.env.NEXT_PUBLIC_GA_ID;
export const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

export type AnalyticsEvent =
  | "hero_primary_click"
  | "hero_secondary_click"
  | "portfolio_open"
  | "service_interest"
  | "contact_start"
  | "contact_submit"
  | "email_click"
  /* 본문 흐름 중간 CTA 2개 (2026-08-21) — 어느 자리에서 문의로 넘어오는지 구분한다 */
  | "bridge_cta_click"
  | "process_cta_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** 클라이언트 컴포넌트에서 호출. GA 미설정 시 no-op. */
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", event);
}
