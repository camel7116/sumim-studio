"use client";

import { useEffect, useRef } from "react";

/**
 * 화면에 들어오면 0 → value로 세는 숫자 (2026-08-08 TrustProof 도입).
 *
 * 2026-08-20 6차: TrustProof 가 세 섹션으로 분해되면서 **공용 모듈로 옮겼다.**
 * 구현은 그대로다 — trust-proof.tsx(셸) 와 position-band.tsx(banded) 가 같은 것을 쓴다.
 *
 * 서버 렌더 결과는 최종값이라 JS가 없어도 정확한 수치가 보인다.
 * 값 갱신은 매 프레임 상태를 바꾸지 않고 DOM 텍스트에 직접 쓴다(리렌더 0회).
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1400,
}: {
  value: number;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start = 0;
    node.textContent = (0).toFixed(decimals);

    const step = (time: number) => {
      if (!start) start = time;
      const progress = Math.min(1, (time - start) / duration);
      // ease-out cubic — 빠르게 올라가다 끝에서 감속
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = (value * eased).toFixed(decimals);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            frame = requestAnimationFrame(step);
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
    </span>
  );
}
