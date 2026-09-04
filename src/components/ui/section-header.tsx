import type { CSSProperties } from "react";
import { giantHeadings } from "@/content/site";
import { BrandGlyph, type BrandGlyphName } from "@/components/ui/brand-glyphs";
import { cn } from "@/lib/utils";

/**
 * 섹션 라벨 (eyebrow) — **액센트 틱 + 대문자 라벨** (2026-08-20 2차 확정).
 *
 * 라벨 왼쪽에 18×3px 액센트 바 + uppercase 12.5px 굵은 글자(자간 .14em).
 * 유채색을 쓰는 자리를 3px 바 하나로 줄인 형태다.
 *
 * 🚨 2026-08-21 정리 패스: 셸 시절의 **pill 배지 분기**(테두리만 있는 알약)는 걷어냈다.
 *    스냅샷은 `_archive/particle-shell-2026-08-21/components/ui/section-header.tsx`.
 *
 * 🆕 2026-08-31 — `glyph` 를 주면 라벨 **오른쪽에** 브랜드 도형 하나가 붙는다
 *    (`brandGlyphs` 가 false 면 도형 컴포넌트가 알아서 null 을 낸다).
 *    값을 안 주면 렌더 결과가 예전과 완전히 동일하다.
 */
export function EyebrowLabel({
  children,
  className,
  glyph,
}: {
  children: React.ReactNode;
  className?: string;
  /** 🆕 라벨 옆 브랜드 도형 (2026-08-31 · `site.ts` 의 `brandGlyphs` 가 마스터 스위치) */
  glyph?: BrandGlyphName;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[12.5px] leading-none font-bold tracking-[0.14em] text-ink uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="block h-[3px] w-[18px] shrink-0 bg-cta" />
      {children}
      {glyph ? <BrandGlyph name={glyph} size={16} className="text-cta" /> : null}
    </p>
  );
}

/**
 * 거대 영문 섹션 타이포 (2026-08-31 · 미디어팔레트 방향 ③)
 *
 * 섹션 헤더 **위**에 서는 한 줄짜리 영문 라벨이다. 데스크톱 ~90px · 모바일 ~44px
 * (`globals.css` 의 `.giant-heading` — clamp 한 줄, weight 800, 자간 −0.02em).
 * 색은 밴드 토큰(`--color-ink`)이라 **밝은 밴드에서는 잉크 · 검정 밴드에서는 흰색**이다.
 *
 * 🚨 `giantHeadings` 가 false 면 **아무것도 렌더하지 않는다** — 그러면 각 섹션이
 *    원래의 eyebrow(액센트 틱 + 12.5px 라벨)를 그대로 다시 보여준다.
 * 🚨 eyebrow 와 **역할이 겹치므로 둘 중 하나만** 화면에 선다(같은 말을 두 번 하지 않는다).
 *    그래서 `aria-hidden` 을 붙이지 않는다 — 이 줄이 그 섹션의 영문 라벨 자체다.
 * 🚨 라벨 문자열은 `site.ts` 의 `giantSectionLabels` 한 곳에서만 관리한다.
 *
 * 도형(`glyph`)을 주면 라벨 오른쪽에 브랜드 도형이 하나 붙는다.
 */
export function GiantHeading({
  children,
  glyph,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  glyph?: BrandGlyphName;
  align?: "left" | "center";
  className?: string;
}) {
  if (!giantHeadings) return null;

  return (
    <p
      className={cn(
        "giant-heading flex items-center gap-4 text-ink",
        align === "center" && "justify-center",
        className,
      )}
    >
      {children}
      {/* 도형 크기는 글자에 비례해야 한다 — em 이 아니라 px 인자라 0.34em 상당을
          CSS 변수 없이 맞추기 어려워, 시각 무게가 맞는 고정값(32px)을 쓴다.
          `text-cta` 로 액센트 한 점만 찍는다(유채색은 액센트 하나 원칙). */}
      {glyph ? <BrandGlyph name={glyph} size={32} className="text-cta" /> : null}
    </p>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  heading: string;
  headingId?: string;
  /** 페이지의 유일한 h1으로 사용할 때 "h1" 지정 (기본 h2) */
  as?: "h1" | "h2";
  description?: string;
  action?: React.ReactNode;
  /** 다크 섹션 위에서 사용 시 true */
  onDark?: boolean;
  /**
   * 가운데 정렬 헤더인지 (2026-08-20).
   * banded 의 주황 틱 eyebrow 는 flex 라 부모의 text-center 를 따르지 않는다 —
   * 이 값이 "center" 일 때만 틱까지 가운데로 모은다.
   */
  align?: "left" | "center";
  /**
   * 🆕 **거대 영문 섹션 타이포** (2026-08-31). 값을 주면 헤더 맨 위에 한 줄이 서고,
   * **그 섹션의 eyebrow 는 숨는다**(같은 말이 두 번 나기 때문).
   * 🚨 마스터 스위치는 `site.ts` 의 `giantHeadings` 다 — `false` 면 이 값을 넘겨도
   *    거대 타이포가 렌더되지 않고 **eyebrow 가 그대로 복귀**한다.
   */
  giant?: string;
  /** 🆕 헤더 옆 브랜드 도형 (2026-08-31 · `brandGlyphs` 가 마스터 스위치) */
  glyph?: BrandGlyphName;
  className?: string;
};

/**
 * 섹션 헤더: Eyebrow + Heading + Description + Optional Action (문서 §7.3)
 * heading/description의 "\n"은 줄바꿈으로 렌더링된다.
 *
 * heading은 줄 단위 마스크 리빌(.mask-reveal)로 렌더한다.
 * - 줄 단위이므로 문서 §11.5의 "모든 글자가 한 글자씩 등장" 금지에 해당하지 않는다.
 * - as="h1"(LCP 요소)일 때는 IO를 기다리지 않는 CSS 전용 변형(.mask-reveal-load)을 쓴다.
 * - 그 외에는 감싸고 있는 <Reveal>의 .is-visible이 트리거한다 (형광펜과 동일한 방식).
 * - Reveal 조상이 없으면 CSS 게이트가 걸리지 않아 그냥 보인다(콘텐츠 소실 없음).
 */
export function SectionHeader({
  eyebrow,
  heading,
  headingId,
  as: Heading = "h2",
  description,
  action,
  onDark = false,
  align = "left",
  giant,
  glyph,
  className,
}: SectionHeaderProps) {
  const isLcpHeading = Heading === "h1";
  /** 거대 타이포가 실제로 서는 경우에만 eyebrow 를 접는다 (스위치가 꺼지면 자동 복귀) */
  const giantOn = Boolean(giant) && giantHeadings;

  return (
    <div className={cn("max-w-[720px]", className)}>
      {giant ? (
        <GiantHeading glyph={glyph} align={align} className="mb-5">
          {giant}
        </GiantHeading>
      ) : null}
      {eyebrow && !giantOn ? (
        <EyebrowLabel
          className={cn("mb-6", align === "center" && "justify-center")}
          glyph={glyph}
        >
          {eyebrow}
        </EyebrowLabel>
      ) : null}
      <Heading
        id={headingId}
        className={cn("text-h1", isLcpHeading ? "mask-reveal-load" : "mask-reveal")}
      >
        <MaskLines text={heading} />
      </Heading>
      {description ? (
        <p
          className={cn(
            "text-body-l mt-6 max-w-[620px] whitespace-pre-line",
            onDark ? "text-white/70" : "text-ink-secondary",
          )}
        >
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}

/** 마스크 리빌용 줄 지연 (줄마다 stagger) */
export function maskDelay(index: number, step = 80): CSSProperties {
  return { "--mask-delay": `${index * step}ms` } as CSSProperties;
}

/** 줄 끝 문장부호(쉼표·마침표·물음표…) — `punctuationClassName` 이 있을 때만 떼어 낸다 */
const TRAILING_PUNCTUATION = /[.,!?…·]+$/;

/**
 * "\n"으로 나뉜 문자열을 줄 단위 마스크 구조로 렌더한다.
 * 빈 줄은 높이를 유지하기 위해 no-break space를 넣는다.
 *
 * `punctuationClassName` (2026-08-22) — 주면 **각 줄 끝의 문장부호만** 그 클래스를 단
 * `<span>` 으로 감싼다. 폭에 따라 부호만 숨기려고 만든 갈고리다
 * (리뷰 헤딩: 모바일에서 "견적," · "퀄리티." 의 부호를 `hidden lg:inline` 로 감춘다).
 * 🚨 **`site.ts` 문자열은 한 벌 그대로**다 — 모바일용 문구를 따로 두지 않는다.
 * 값을 안 주면 예전과 완전히 동일하게 렌더된다(다른 호출부 영향 0).
 */
export function MaskLines({
  text,
  step = 80,
  punctuationClassName,
}: {
  text: string;
  step?: number;
  punctuationClassName?: string;
}) {
  return (
    <>
      {text.split("\n").map((line, index) => {
        const tail = punctuationClassName ? (line.match(TRAILING_PUNCTUATION)?.[0] ?? "") : "";
        const body = tail ? line.slice(0, -tail.length) : line;
        return (
          <span key={`${index}-${line}`} className="mask-line">
            <span className="mask-inner" style={maskDelay(index, step)}>
              {line === "" ? " " : body}
              {tail ? <span className={punctuationClassName}>{tail}</span> : null}
            </span>
          </span>
        );
      })}
    </>
  );
}
