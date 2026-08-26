"use client";

import { useEffect, useRef } from "react";

/**
 * 스크롤 진행 인디케이터 — 상단 2px 바가 스크롤 백분율만큼 `scaleX` 된다.
 * rAF 스로틀 + passive listener, 외부 라이브러리 없이 vanilla DOM 만 쓴다.
 *
 * 🚨 **2026-08-21 정리 패스 — 우하단 플로팅 3단(▲TOP / 상담문의 / 카톡문의)은 삭제했다.**
 * 2026-08-20 3차에 하단 고정 상담 바(`sticky-consult-bar.tsx`)가 전화·문의를 가져가면서
 * 이미 **렌더되지 않는 코드**였다(같은 동선이 두 벌이라 끈 것). 스냅샷은
 * `_archive/particle-shell-2026-08-21/components/ui/scroll-progress.tsx` 에 있고,
 * 되살리려면 그 파일의 `floating-action-stack` 블록을 여기로 다시 가져오면 된다.
 * ⚠️ 함께 사라진 것: **▲TOP 버튼** — 재도입 여부는 팀 확인 대기(START_HERE 참고).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    /* 상단 진행 바 — 네비게이션(z-50)보다 위 */
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5">
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-indigo" />
    </div>
  );
}
