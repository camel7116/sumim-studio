"use client";

import { useState, type ReactNode } from "react";
import { clientProblems, copyMode, inlineCta } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { EyebrowLabel, MaskLines } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

/**
 * Q&A 셀프 체크리스트 (2026-08-23 밤) — `style: "check"` 와 `style: "combo"` 가 함께 쓴다.
 *
 * 앞선 4종(chat·sheet·cards·list)이 전부 "박스 안에 Q/A 4쌍"이라 반려됐다.
 * 이 안은 형태가 아니라 **읽는 방식**이 다르다 — 방문자가 네 문장을 **직접 눌러**
 * 자기 상황을 고르고, 고른 개수만큼 하단 요약 바 문구가 바뀐다(진단의 시작을
 * 화면 안에서 한 번 체험시키는 구조).
 *
 * 🚨 이 파일만 **클라이언트 컴포넌트**다 — 나머지 안들은 서버 렌더 그대로다.
 *    (`client-problems.tsx` 전체를 "use client" 로 올리면 반려 대기 중인 다른 안들까지
 *     클라이언트 번들로 내려간다. `combo` 에서도 티커는 서버 조각으로 남는다.)
 *
 * 규칙 (다른 안과 공통)
 * - 밴드 흰색 고정 · 직각 · 새 색 없음 · 라운드 0.
 * - 검정 요약 바는 **중첩 `data-band="void"`** 라 팔레트/colorLab 을 그대로 따라간다.
 * - 모션은 기존 `Reveal` + 답변 펼침(≤200ms) 뿐이다. 행 호버 이동·확대 없음(문서 §11.5).
 */
type SelfCheckProps = {
  /**
   * 행 배치.
   * - `"list"`(기본, `style:"check"`) : 1열 4행 + 행 사이 1px 검정 룰
   * - `"grid"`(`style:"combo"`) : **1024px 이상에서 2×2**, 그 아래는 1열.
   *   칸마다 아래쪽에만 룰을 두고 열 간격은 48px.
   */
  layout?: "list" | "grid";
  /** 헤딩 블록(eyebrow·h2·안내 한 줄)을 이 컴포넌트가 그릴지 — `combo` 는 밖에서 그린다 */
  withHeader?: boolean;
  /** 한 화면에 담기게 줄인 판 (글자·패딩·요약 바 여백을 한 단계 축소) */
  compact?: boolean;
  /**
   * 🧪 2026-08-25 — 체크 4행과 **검정 요약 바 사이**에 끼워 넣을 조각.
   * `combo` 의 티커 배치 후보 B(체크 → 티커 → 요약 바)를 만들기 위한 슬롯이다.
   * 넘기지 않으면 예전과 완전히 같은 마크업이 나온다(기본 `undefined`).
   */
  beforeSummary?: ReactNode;
};

export function SelfCheck({
  layout = "list",
  withHeader = true,
  compact = false,
  beforeSummary,
}: SelfCheckProps) {
  const {
    cards,
    heading,
    checkEyebrow,
    checkHint,
    checkSummaryZero,
    checkSummarySome,
  } = clientProblems;

  /** 체크 상태 — 클라이언트 전용, 저장하지 않는다(새로고침하면 전부 해제) */
  const [checked, setChecked] = useState<boolean[]>(() => cards.map(() => false));
  const count = checked.filter(Boolean).length;

  const toggle = (index: number) =>
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));

  const summary =
    count === 0 ? checkSummaryZero : checkSummarySome.replace("{n}", String(count));

  const isGrid = layout === "grid";

  return (
    <>
      {withHeader ? (
        <div className="max-w-[720px]">
          <Reveal>
            <EyebrowLabel>{checkEyebrow}</EyebrowLabel>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="client-problems-heading" className="text-h1 mask-reveal mt-6">
              <MaskLines text={heading} />
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-body-l mt-5 text-ink-secondary">{checkHint}</p>
          </Reveal>
        </div>
      ) : null}

      {/*
        list — 행 사이 1px 검정 룰(위·아래 마감 포함).
        grid — 칸마다 아래쪽 룰만. 위쪽은 바로 앞 티커의 마감 룰이 대신한다.
      */}
      <ul
        className={cn(
          isGrid
            ? "grid lg:grid-cols-2 lg:gap-x-12"
            : "mt-12 divide-y divide-ink border-y border-ink md:mt-14",
        )}
      >
        {cards.map((card, index) => {
          const isChecked = checked[index];
          const answer = copyMode === "plain" ? card.descriptionPlain : card.description;

          return (
            <li key={card.title} className={isGrid ? "border-b border-ink" : undefined}>
              <Reveal delay={index * 70}>
                <button
                  type="button"
                  aria-pressed={isChecked}
                  onClick={() => toggle(index)}
                  className={cn(
                    "flex w-full items-start gap-4 text-left md:gap-5",
                    compact ? "py-[18px]" : "py-7",
                  )}
                >
                  {/* 28×28 정사각 체크박스 — 체크되면 바이올렛 면 + 흰 체크 */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border-2 border-ink transition-colors duration-200 motion-reduce:transition-none",
                      isChecked && "border-cta bg-cta",
                    )}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="square"
                      className={cn(
                        "h-4 w-4 text-white transition-opacity duration-200 motion-reduce:transition-none",
                        isChecked ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <path d="M4 12.5 9.5 18 20 6.5" />
                    </svg>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block leading-[1.4] font-bold break-keep transition-colors duration-200 motion-reduce:transition-none",
                        compact
                          ? "text-[18px] lg:text-[20px]"
                          : "text-[19px] md:text-[24px]",
                        isChecked ? "text-cta" : "text-ink",
                      )}
                    >
                      {card.title}
                    </span>

                    {/*
                      체크했을 때만 보이는 답변 한 줄.
                      grid-template-rows 0fr→1fr 이라 높이를 하드코딩하지 않고도
                      부드럽게 열린다(내용 길이와 무관).
                    */}
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
                        isChecked ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span
                          className={cn(
                            "block leading-[1.65] break-keep whitespace-pre-line text-ink-secondary",
                            compact
                              ? "mt-2 text-[15px] lg:text-[16px]"
                              : "mt-3 text-[16px] md:text-[17px]",
                          )}
                        >
                          {answer}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {/* 🧪 체크 4행과 요약 바 사이 슬롯 (티커 배치 후보 B) — 안 넘기면 아무것도 안 나온다 */}
      {beforeSummary}

      {/* 요약 바 — 중첩 검정 밴드. 좌 문구(개수 반응) / 우 통합 CTA */}
      <Reveal delay={120}>
        <div
          data-band="void"
          className={cn(
            "flex flex-col gap-6 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-8",
            compact ? "mt-5" : "mt-10",
          )}
        >
          <p
            aria-live="polite"
            className="text-[17px] leading-[1.6] font-medium break-keep text-ink md:text-[19px]"
          >
            {summary}
          </p>
          <Button href={inlineCta.bridge.href} className="shrink-0">
            {inlineCta.bridge.label}
          </Button>
        </div>
      </Reveal>
    </>
  );
}

/** `style: "check"` — 헤딩 + 1열 4행 + 요약 바 (기본 판) */
export function ProblemChecklist() {
  return <SelfCheck />;
}
