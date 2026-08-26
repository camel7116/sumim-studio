import type { CSSProperties } from "react";

/** className 조합 유틸리티 (외부 패키지 없이 최소 구현) */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * `.reveal-load`(CSS 전용 진입 애니메이션)의 지연 시간을 지정한다.
 * above-the-fold 콘텐츠는 JS 기반 Reveal 대신 이 방식을 사용해 LCP 지연을 막는다.
 */
export function revealDelay(seconds: string): CSSProperties {
  return { "--reveal-delay": seconds } as CSSProperties;
}
