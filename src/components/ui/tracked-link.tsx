"use client";

import Link from "next/link";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type TrackedLinkProps = {
  event: AnalyticsEvent;
  href: string;
  className?: string;
  children: React.ReactNode;
};

/** 클릭 시 분석 이벤트를 보내는 링크 (GA 미설정 시 no-op) */
export function TrackedLink({ event, href, className, children }: TrackedLinkProps) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent(event)}>
      {children}
    </Link>
  );
}
