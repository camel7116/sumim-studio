import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * 섹션 라벨 (eyebrow) — **액센트 틱 + 대문자 라벨** (2026-08-20 2차 확정).
 *
 * 라벨 왼쪽에 18×3px 액센트 바 + uppercase 12.5px 굵은 글자(자간 .14em).
 * 유채색을 쓰는 자리를 3px 바 하나로 줄인 형태다.
 *
 * 🚨 2026-08-21 정리 패스: 셸 시절의 **pill 배지 분기**(테두리만 있는 알약)는 걷어냈다.
 *    스냅샷은 `_archive/particle-shell-2026-08-21/components/ui/section-header.tsx`.
 */
export function EyebrowLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
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
  className,
}: SectionHeaderProps) {
  const isLcpHeading = Heading === "h1";

  return (
    <div className={cn("max-w-[720px]", className)}>
      {eyebrow ? (
        <EyebrowLabel className={cn("mb-6", align === "center" && "justify-center")}>
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
