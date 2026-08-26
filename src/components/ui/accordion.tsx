"use client";

import { useId, useState } from "react";
import { type FaqItem } from "@/content/faq";
import { cn } from "@/lib/utils";

/**
 * 2026-08-20 (banded 2차) 시각 다듬기
 * - 문항 사이 **헤어라인**은 기존 그대로(위 border-t + 항목마다 border-b).
 * - 열린 항목 질문 앞에 **주황 틱** — 섹션 라벨(EyebrowLabel)의 3px 바와 같은 언어.
 *   닫힌 상태에서는 폭 0 이라 자리를 차지하지 않고, 열리면 18px 로 자란다.
 * - 아이콘은 **한 종류(+)로 통일**하고 열릴 때 45° 회전(×)만 한다. 열린 항목은 액센트색.
 *
 * 🚨 2026-08-21 정리 패스: 셸 시절 모습(인디고 호버 · 틱 없음)의 분기를 걷어냈다.
 *    스냅샷은 `_archive/particle-shell-2026-08-21/` 참고.
 */

type AccordionProps = {
  items: readonly FaqItem[];
};

/**
 * FAQ 아코디언 (문서 §7.7)
 * - 기본 상태 모두 닫힘, 여러 개 동시 열기 가능
 * - 1px 구분선, aria-expanded, 키보드 조작(버튼 기본 동작)
 * - 아이콘 회전 180ms
 * - 2026-08-03 사용자 요청: 상단 검색 입력 제거 (질문 수가 적어 목록 스캔으로 충분)
 */
export function Accordion({ items }: AccordionProps) {
  const baseId = useId();
  const [openSet, setOpenSet] = useState<ReadonlySet<number>>(new Set());

  function toggle(index: number) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = openSet.has(index);
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-6 py-6 text-left text-h3 font-semibold transition-colors duration-200",
                  "hover:text-cta",
                )}
              >
                <span className="flex items-center">
                  {/* 열린 항목 액센트 틱 — 닫히면 폭 0 이라 글자 위치가 흔들리지 않는다 */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-[3px] shrink-0 bg-cta transition-[width,margin] duration-[220ms] ease-out motion-reduce:transition-none",
                      isOpen ? "mr-3 w-[18px]" : "mr-0 w-0",
                    )}
                  />
                  {item.question}
                </span>
                {/*
                  아이콘은 **문자 교체가 아니라 두 선 SVG 한 글리프**다 — 열리면 45° 돌아
                  그대로 ×가 된다(문자 '+'는 폰트마다 광학 중심이 달라 회전이 흔들린다).
                  선이 (8,8) 대칭이라 회전 중심이 정확히 교차점이고 크기 변화도 없다.
                  2026-08-21: 회전 시간 180ms → **260ms `ease-out`**(사용자 지시 0.25~0.3s,
                  아래 패널·주황 틱과 같은 이징). 색 전환(열림 = 액센트)은 같은 transition 에 붙어 있고,
                  `prefers-reduced-motion` 이면 전환 없이 회전값이 즉시 적용된다.
                  🚨 **transition 대상은 `transform` 이 아니라 `rotate` 다** — Tailwind v4 의
                  `rotate-45` 는 `transform` 이 아닌 **독립 `rotate` 속성**을 쓴다. 그래서 예전
                  `transition-[transform,color]` 는 아무것도 애니메이션하지 않았고(실측: 열어도
                  `transform: none`, 회전이 즉시 튐) 색만 부드러웠다. `rotate` 로 바꿔야 실제로 돈다.
                */}
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className={cn(
                    "shrink-0 transition-[rotate,color] duration-[260ms] ease-out motion-reduce:transition-none",
                    isOpen && "rotate-45",
                    isOpen ? "text-cta" : "text-ink-secondary",
                  )}
                >
                  <path
                    d="M8 2v12M2 8h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="text-body-m max-w-[680px] pb-6 text-ink-secondary">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
