"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessStep } from "@/content/process";
import { inlineCta } from "@/content/site";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * 단계 강조색 (2026-08-20 2차 확정)
 * "유채색은 액센트 하나" 규칙이라 현재 단계 숫자·진행 바·타임라인 마커가 액센트색이고,
 * 비활성 단계는 전 구간 무채색(ink-muted)으로 눌러 둔다.
 * (셸 시절의 인디고 분기는 2026-08-21 정리 패스에서 걷어냈다 — 아카이브 참고)
 */
const ACCENT_TEXT = "text-cta";
const ACCENT_BG = "bg-cta";

type ProcessFlowProps = {
  steps: ProcessStep[];
  /** 서버에서 렌더된 SectionHeader (Reveal 포함) */
  header: React.ReactNode;
};

/**
 * Process 흐름 (문서 §7.5 "Desktop: 수평 또는 스티키 스크롤", §8.7)
 *
 * - lg 이상: 좌측 5/12 컬럼이 sticky로 고정되어 현재 단계 번호를 크게 보여주고,
 *   우측 7/12 컬럼의 8단계를 스크롤하면 IntersectionObserver가 현재 단계를 갱신한다.
 * - lg 미만: 기존 세로/2열 타임라인 그대로.
 * - 스크롤 하이재킹은 하지 않는다 (문서 §11.5 "스크롤 강제 고정" 금지).
 *   순수 position: sticky + 관찰자 기반 강조뿐이며 스크롤 속도·위치는 건드리지 않는다.
 * - prefers-reduced-motion에서는 강조 "전환"만 사라지고 현재 단계 표시는 유지된다.
 */
export function ProcessFlow({ steps, header }: ProcessFlowProps) {
  const [active, setActive] = useState(0);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const nodes = itemsRef.current.filter((node): node is HTMLLIElement => node !== null);
    if (nodes.length === 0) return;

    // 화면 중앙 밴드(위아래 45% 제외)에 들어온 항목을 현재 단계로 본다.
    const visible = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.stepIndex);
          if (Number.isNaN(index)) continue;
          if (entry.isIntersecting) visible.add(index);
          else visible.delete(index);
        }
        if (visible.size === 0) return; // 밴드가 비면 마지막 단계를 유지한다
        setActive(Math.min(...visible));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [steps.length]);

  const current = steps[active] ?? steps[0];

  return (
    // 좌측 컬럼은 기본값(stretch)으로 늘어나야 그 안의 sticky가 움직일 공간을 얻는다.
    // items-start를 주면 컬럼 높이가 콘텐츠 높이로 줄어 sticky가 동작하지 않는다.
    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          {header}

          {/* 현재 단계 대형 표시 — 우측 리스트의 내용을 되풀이하므로 보조기술에는 숨긴다 */}
          {/*
            🚨 세로 예산 (2026-08-21, 1536×745 실측) — 이 패널은 **하단 고정 상담 바(top 672)에
            가리지 않아야** 한다. 아래 버튼까지 합친 높이가 509px 이라, 섹션 진입 시점(패널 top ≈160)
            에도 버튼 하단이 **669px** 로 바 위에 선다. 여백을 키우면 단계 01 에서 버튼이 바 뒤로
            숨으므로 mt 값을 늘리지 말 것(늘리려면 sticky top 을 함께 줄여야 한다).
          */}
          <div aria-hidden="true" className="mt-10 hidden lg:block">
            <span
              key={current.number}
              className={cn(
                "text-display-l step-number-in block tabular-nums",
                ACCENT_TEXT,
              )}
            >
              {current.number}
            </span>
            <p className="text-h3 mt-4">
              {current.title}
              {current.titleNote ? (
                <span className="text-caption ml-2 font-normal text-ink-secondary">
                  {current.titleNote}
                </span>
              ) : null}
            </p>
            {/* 현재 단계 포인트 문구 — 단계 전환마다 주황으로 갱신 (2026-08-08)
                note가 없는 단계에서도 빈 한 줄을 유지해 아래 진행 바가
                위아래로 움직이지 않게 한다 (2026-08-12 사용자 요청) */}
            <p
              key={`hl-${current.number}`}
              className={cn("text-label mt-3 text-cta", current.note && "step-number-in")}
            >
              {current.note ?? "\u00A0"}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="relative block h-px w-40 bg-line-strong">
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 block transition-[width] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    ACCENT_BG,
                  )}
                  style={{ width: `${((active + 1) / steps.length) * 100}%` }}
                />
              </span>
              <span className="text-caption text-ink-secondary tabular-nums">
                {current.number} / {String(steps.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/*
            흐름 중간 CTA ② — **스티키 패널 안, 진행 라인 바로 아래** (2026-08-21 사용자 지시
            "문구 삭제, 버튼만 라인 아래쪽, 1번 단계부터 보이게").

            이 자리에 두면 패널이 sticky 라 **01~08 스크롤 내내 버튼이 따라옵니다** —
            섹션 끝에 두었던 이전 위치는 8단계를 다 지나야 보였습니다.
            🚨 위의 큰 숫자 블록은 `aria-hidden`(우측 리스트의 되풀이)이라 **그 밖에** 둔다 —
               안에 넣으면 버튼이 보조기술에서 사라지고 `hidden lg:block` 에 같이 묶인다.
               그래서 lg 미만에서는 이 버튼이 섹션 헤더 바로 아래에 선다(모바일에도 CTA 유지).
            문구 없이 버튼 단독 — 라벨이 이미 행동을 말한다.
          */}
          <TrackedLink
            event="process_cta_click"
            href={inlineCta.process.href}
            className={buttonClasses("ctaInvert", "mt-6 h-11! px-5! text-[14px]!")}
          >
            {inlineCta.process.label}
          </TrackedLink>
        </div>
      </div>

      <ol className="mt-16 grid gap-y-0 md:grid-cols-2 md:gap-x-10 lg:col-span-7 lg:mt-0 lg:grid-cols-1">
        {steps.map((step, index) => {
          const isActive = index === active;

          return (
            <li
              key={step.number}
              data-step-index={index}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
            >
              <Reveal delay={(index % 2) * 90}>
                <div
                  className={cn(
                    "relative border-l border-line-strong py-8 pl-8 md:border-t md:border-l-0 md:py-10 md:pl-0",
                    // 전환은 lg 프리픽스 없이 둔다. lg 미만에서는 색이 바뀌지 않아 무해하고,
                    // motion-reduce:transition-none이 항상 뒤에 와서 확실히 이긴다.
                    "transition-colors duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    "lg:border-t-0 lg:border-l lg:py-14 lg:pl-10",
                    // 2026-08-08 사용자 요청: 활성 단계에 주황 컬러 포인트
                    isActive ? "lg:border-l-cta" : "lg:border-l-line",
                  )}
                >
                  {/* 타임라인 마커 (lg 미만 전용 — lg에서는 좌측 보더 강조가 대신한다) */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[42px] -left-[3px] h-[7px] w-[7px] rounded-full md:-top-[3px] md:left-0 lg:hidden",
                      ACCENT_BG,
                    )}
                  />
                  <span
                    className={cn(
                      "text-label transition-colors duration-[320ms] motion-reduce:transition-none",
                      // 비활성은 전 구간 무채색
                      isActive ? "text-cta" : "text-ink-muted",
                    )}
                  >
                    {step.number}
                  </span>
                  <h3
                    className={cn(
                      "text-h3 mt-2 transition-colors duration-[320ms] motion-reduce:transition-none",
                      isActive ? "text-ink" : "text-ink lg:text-ink-secondary",
                    )}
                  >
                    {step.title}
                    {/* 제목 옆 작은 회색 부연 (2026-08-08 사용자 요청) */}
                    {step.titleNote ? (
                      <span className="text-caption ml-2 font-normal text-ink-secondary">
                        {step.titleNote}
                      </span>
                    ) : null}
                  </h3>
                  <p className="text-body-m mt-2 text-ink-secondary">{step.description}</p>
                  {/* 활성 단계에서 주황으로 켜지는 포인트 문구 (2026-08-08) —
                      lg 미만(타임라인)에서는 항상 주황으로 노출 */}
                  {step.note ? (
                    <p
                      className={cn(
                        "text-label mt-3 transition-colors duration-[320ms] motion-reduce:transition-none",
                        isActive ? "text-cta" : "text-ink-muted",
                      )}
                    >
                      {step.note}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
