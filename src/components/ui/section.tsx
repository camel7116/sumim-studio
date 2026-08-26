import { cn } from "@/lib/utils";

type SectionTone = "canvas" | "surface" | "subtle" | "dark";

type SectionProps = {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: React.ReactNode;
  "aria-labelledby"?: string;
  /**
   * 전역 파티클 배경이 이 섹션에서 취할 형태 (2026-08-18).
   * components/ui/particle-backdrop.tsx의 SHAPES 키. data-shape 속성으로 내려간다.
   */
  shape?: string;
  /**
   * 무채색 배경 밴드 (2026-08-19 사용자 요청 — Apple 레퍼런스의 white/gray 교차 리듬).
   * paper=흰색 · mist=밝은 회색 · void=검정.
   * 배경은 이 요소가 칠하지 않는다 — 전역 캔버스가 밴드로 칠하고, 여기서는
   * data-band만 내려보내 글자색 토큰(globals.css)과 캔버스 색 선택의 기준이 된다.
   */
  band?: "paper" | "mist" | "void";
  /**
   * 세로 패딩 (2026-08-23). 기본은 지금까지의 `py-20 md:py-28 lg:py-40`.
   * `"none"` 이면 아무 패딩도 넣지 않으므로 **호출부가 className 으로 직접** 잡는다.
   * (Q&A `style:"combo"` 처럼 한 화면에 담아야 하는 섹션 전용 — 같은 특이도의
   *  유틸리티끼리 부딪혀 순서가 승자를 정하는 상황을 피하려고 프로퍼티로 뺐다.)
   */
  paddingY?: "default" | "none";
};

const toneClass: Record<SectionTone, string> = {
  canvas: "bg-canvas",
  surface: "bg-surface",
  subtle: "bg-surface-subtle",
  dark: "bg-ink text-white",
};

/** 공통 섹션: 패딩 80/112/160 (문서 §5.3), 배경 리듬 (문서 §6.4) */
export function Section({
  id,
  tone = "canvas",
  className,
  children,
  shape,
  band,
  paddingY = "default",
  "aria-labelledby": ariaLabelledby,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      data-shape={shape}
      data-band={band}
      className={cn(
        "scroll-mt-20",
        paddingY === "default" && "py-20 md:py-28 lg:py-40",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}
