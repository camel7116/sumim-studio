"use client";

import { useEffect, useRef } from "react";

/**
 * 후기 마키 — 2026-08-19 사용자 요청
 * "호버했을 때 멈추지 않게. 클릭(누르고 있을 때)만 멈추거나 슬라이드해서 볼 수 있고,
 *  클릭을 떼면 바로 다시 무한루프 진행."
 *
 * 2026-08-20 6차: TrustProof 가 세 섹션으로 분해되면서 **공용 훅으로 옮겼다.**
 * 구현은 그대로다 — trust-proof.tsx(셸) 와 testimonial-marquee.tsx(banded) 가 같은 것을 쓴다.
 *
 * CSS 키프레임만으로는 "드래그한 위치에서 이어 달리기"가 안 된다(애니메이션을 멈췄다
 * 풀면 원래 궤도로 돌아간다). 그래서 rAF 로 transform 을 직접 민다.
 * - 속도는 기존 CSS(트랙 절반을 46초에 통과)와 같게 맞춘다.
 * - 트랙이 2벌 복제라 offset 이 절반을 넘어가면 되돌려 이음매 없이 순환한다.
 * - 누르는 동안만 정지 + 드래그, 떼면 **그 자리에서** 즉시 재개.
 * - 화면 밖·숨긴 탭이면 rAF 정지. prefers-reduced-motion 이면 아예 돌리지 않는다
 *   (기존 정책대로 CSS 가 가로 스크롤로 대체).
 */
const MARQUEE_CYCLE_SEC = 46;

/**
 * 🆕 **속도 지정 옵션** (2026-08-31 — 그래픽 마퀴 띠가 같은 훅을 쓰려고 열었다).
 *
 * 후기 마키는 "트랙 절반을 46초"라 **트랙이 길어지면 빨라지는** 구조다(카드 수에 종속).
 * 그래픽 띠는 Q&A 티커와 같은 **≈31px/s 대역**에 고정해야 해서 초당 픽셀을 직접 준다.
 *
 * 🚨 인자를 **안 주면 계산이 예전과 한 글자도 다르지 않다** — 기존 호출부
 *    (`testimonial-marquee.tsx`)의 동작·속도가 그대로다.
 */
type MarqueeOptions = {
  /** 초당 픽셀. 주면 트랙 길이와 무관하게 이 속도로 흐른다 */
  pxPerSec?: number;
};

export function useMarquee(options?: MarqueeOptions) {
  const pxPerSec = options?.pxPerSec;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // JS 가 구동하므로 CSS 애니메이션(no-JS 폴백)은 끈다
    track.classList.add("marquee-js");
    viewport.classList.add("marquee-drag");

    let offset = 0;
    let half = track.scrollWidth / 2;
    let raf = 0;
    let last = 0;
    let running = false;
    let dragging = false;
    let lastX = 0;

    const wrap = () => {
      if (half <= 0) return;
      while (offset <= -half) offset += half;
      while (offset > 0) offset -= half;
    };
    const apply = () => {
      track.style.transform = `translate3d(${offset.toFixed(2)}px,0,0)`;
    };

    const frame = (ts: number) => {
      if (!running) return;
      if (last > 0 && !dragging) {
        const dt = Math.min(0.05, (ts - last) / 1000);
        offset -= (pxPerSec ?? half / MARQUEE_CYCLE_SEC) * dt;
        wrap();
        apply();
      }
      last = ts;
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      offset += e.clientX - lastX;
      lastX = e.clientX;
      wrap();
      apply();
    };
    const onUp = () => {
      // 떼는 즉시 지금 위치에서 이어서 흐른다 (점프 없음)
      dragging = false;
      viewport.classList.remove("is-dragging");
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("lostpointercapture", onUp);

    const ro = new ResizeObserver(() => {
      half = track.scrollWidth / 2;
      wrap();
      apply();
    });
    ro.observe(track);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(viewport);

    const onVisibility = () => {
      if (document.visibilityState !== "visible") stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("lostpointercapture", onUp);
      track.classList.remove("marquee-js");
      viewport.classList.remove("marquee-drag", "is-dragging");
      track.style.transform = "";
    };
    // pxPerSec 은 상수로 넘어오므로 실제로는 다시 걸리지 않는다(기존 호출부는 undefined)
  }, [pxPerSec]);

  return { viewportRef, trackRef };
}
