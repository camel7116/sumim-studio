"use client";

import { Fragment } from "react";
import { graphicTicker, graphicTickerWords } from "@/content/site";
import { BrandGlyph, glyphForIndex } from "@/components/ui/brand-glyphs";
import { useMarquee } from "@/components/ui/marquee";

/**
 * 그래픽 마퀴 띠 (2026-08-31 · 미디어팔레트 방향 ②)
 *
 * `[✳ BRAND ● WEB 〰 SEO ✳ CONTENT ●]` 처럼 **영문 대문자 단어 + 브랜드 도형**이
 * 번갈아 흐르는 전폭 롤링 띠 한 줄이다.
 *
 * 🚨 **밴드 리듬을 건드리지 않는다** — 새 섹션을 만들지 않고 Work(흰) 섹션
 *    **안쪽 맨 위**에 넣는다. 그래서 Hero(검정) → Work(흰) 교차가 그대로다.
 * 🚨 **구동 코드를 새로 만들지 않았다** — 후기 마키와 같은 `useMarquee` 훅이다.
 *    그 훅이 이미 갖고 있는 것을 그대로 받는다:
 *      · **화면 밖이면 rAF 정지**(IntersectionObserver) · 숨긴 탭도 정지
 *      · `prefers-reduced-motion` 이면 훅이 손을 떼고, globals 의
 *        `@media (prefers-reduced-motion) .marquee-track { animation: none }` 이 CSS 폴백까지 끈다
 *      · 누르는 동안 정지 + 드래그
 * 🚨 속도는 **Q&A 티커와 같은 ≈31px/s 대역**으로 고정한다(아래 상수). 후기 마키처럼
 *    "트랙 절반을 46초"로 두면 단어 수에 따라 속도가 흔들린다.
 * 🚨 좌우 끝 페이드(`.marquee` 의 mask)는 **끈다** — 띠는 뷰포트 끝까지 꽉 차야 한다
 *    (globals 의 `.gticker { mask-image: none }`). Q&A 티커와 같은 판단이다.
 *
 * 색은 잉크(밴드 토큰) + 도형만 액센트다 — 유채색은 액센트 하나 원칙 그대로.
 * 스위치는 `site.ts` 의 `graphicTicker`.
 */

/** 초당 픽셀 — Q&A 티커 실측(≈31.5px/s)과 같은 대역 */
const GRAPHIC_TICKER_PX_PER_SEC = 31;

export function GraphicTicker() {
  /* ⚠️ 훅은 조건보다 먼저 부른다 — early return 을 위에 두면 훅 순서가 깨진다 */
  const { viewportRef, trackRef } = useMarquee({
    pxPerSec: GRAPHIC_TICKER_PX_PER_SEC,
  });

  if (!graphicTicker || graphicTickerWords.length === 0) return null;

  /**
   * 한 벌 = 단어 + 그 뒤 도형. 도형은 3종을 순환하므로 단어마다 다른 모양이 붙는다.
   * 순환하려면 같은 벌이 두 번 필요한데, **두 번째 벌은 보조기술에서 제외**한다
   * (후기 마키·Q&A 티커와 같은 규칙).
   */
  const renderGroup = (duplicate: boolean) => (
    <div
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center"
    >
      {graphicTickerWords.map((word, index) => (
        <Fragment key={word}>
          <span className="whitespace-nowrap">{word}</span>
          {/* 도형은 액센트 한 점 — 단어 사이를 끊는 구두점 역할이다.
              🚨 자리(폭·좌우 여백)는 **바깥 span 이 쥔다** — `brandGlyphs` 를 끄면
                 도형만 사라지고 단어 간격은 그대로 남아 띠가 뭉치지 않는다 */}
          <span className="mx-7 inline-flex w-[30px] shrink-0 justify-center text-cta md:mx-10">
            <BrandGlyph name={glyphForIndex(index)} size={30} />
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      ref={viewportRef}
      /* `.marquee` 의 기계(overflow hidden · no-JS CSS 폴백 · reduced-motion 정지)를
         그대로 쓰고, `.gticker` 가 좌우 mask 페이드만 끈다 */
      className="marquee gticker border-y border-line py-3 md:py-4"
      aria-label="스밈 스튜디오 작업 영역"
    >
      <div
        ref={trackRef}
        className="marquee-track items-center text-[40px] leading-none font-extrabold tracking-[-0.02em] text-ink md:text-[56px]"
      >
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </div>
  );
}
