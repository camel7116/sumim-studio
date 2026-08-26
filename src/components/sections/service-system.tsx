import { axisTagline, serviceAxes, serviceSystem } from "@/content/services";
// 2026-08-23 중복 제거: `promiseSection` 은 약속 컬럼과 함께 빠졌습니다(site.ts 에 필드는 보존).
import { trustProof } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { EyebrowLabel } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * 약속 + 서비스 **병합 섹션** (2026-08-21).
 *
 * 구도 재편 (2026-08-21 저녁 — 사용자 "구도가 안 예쁨.
 * **프로미스는 텍스트(헤딩) 옆에 박스 없이**, **시스템은 텍스트 밑에**"):
 *
 * ┌ 상단 2단 — 좌(7/12): 공통 헤딩(기존 약속 헤딩)
 * │            우(5/12): 두 줄 설명(기존 Services 설명) · 밑선 정렬(`lg:items-end`)
 * └ 하단 전체 폭 — `SERVICE SYSTEM` 라벨 + 서비스 4종 **직각 카드 4열**
 *
 * 🚨 **2026-08-23 중복 제거** — 우측에 있던 `OUR PROMISE` 약속 리스트를 뺐습니다.
 *    약속 2건(환불 100% · 예약제 소수정예)은 이제 **라임 밴드**(`testimonial-marquee.tsx`)
 *    한 곳에서만 말합니다. 보존본은 아래 `PromiseList` 주석 블록입니다.
 *
 * 🚨 직전 구도(좌 약속 카드 / 우 서비스 2열 + 좌우 끝선 스트레치)는 **폐기**했습니다.
 *    카드가 좌우 양쪽에 있어 무게가 갈리고, 약속 2장을 서비스 4장 높이에 맞춰 늘리느라
 *    카드 안이 비어 보였습니다. 지금은 **카드가 한 종류(서비스)뿐**이라 위계가 분명합니다.
 * 🚨 약속은 **카드·배경·그림자 없이** 텍스트로만 섭니다 — 헤딩 옆 자리라 면을 깔면
 *    헤딩과 경쟁합니다. 구분은 항목 사이 헤어라인 하나로 충분합니다.
 * 🚨 서비스 카드는 **4열**입니다(2×2 안과 비교해 선택 — 판단 근거는 START_HERE §5-B).
 *    카드 **안**은 2026-08-22 부터 **좌우 2단**(좌 텍스트 / 우 체크 4)이고, 4열이 되는
 *    `lg` 이상에서만 세로 구성으로 돌아갑니다 — 스위치는 아래 `DESKTOP_CARDS`.
 * 🚨 새 카피 0줄 — 기존 문구를 자리만 옮겼습니다. 서비스마다 "건수"는 붙이지 않습니다
 *    (검증된 실적 수치가 없습니다 — START_HERE §6).
 *
 * `promise-cards.tsx` 는 병합으로 페이지 배열에서 빠졌지만 **파일은 보존**합니다.
 * lg 미만은 헤딩 → 약속 리스트 → 서비스 카드 순으로 자연 스택됩니다.
 */

/*
 * 🚨 **2026-08-23 중복 제거 — 약속 리스트 보존본**
 *
 * 환불 100% · 예약제 소수정예 두 가지는 **라임 밴드 한 곳**(`testimonial-marquee.tsx`)에서만
 * 말하기로 해서 이 섹션의 `OUR PROMISE` 컬럼이 통째로 빠졌습니다. 되살리려면 아래 함수의
 * 주석을 풀고, `promiseSection` import 와 상단 2단의 우측 컬럼 두 줄
 * (`<EyebrowLabel>{promiseSection.eyebrow}</EyebrowLabel>` + `<PromiseList />`)을 복구하세요.
 *
 * 약속 리스트 — `trustProof.promises` 중 `enabled: true` 인 것만.
 * (미확정 2건 "무제한 수정"·"월 작업량 한정"은 계속 대기 — 확정되면 항목이 늘어납니다)
 *
 * function PromiseList() {
 *   const visible = trustProof.promises.filter((promise) => promise.enabled);
 *   if (visible.length === 0) return null;
 *
 *   return (
 *     // 박스 없음 — 위아래 헤어라인과 항목 사이 divide 로만 구분한다
 *     <ul className="mt-6 divide-y divide-line border-y border-line">
 *       {visible.map((promise) => (
 *         <li key={promise.title} className="flex gap-4 py-6 first:pt-5 last:pb-5">
 *           // 유채색은 액센트 하나 — 체크 표시에만 찍는다(원형 아이콘은 직각화 대상 아님)
 *           <span
 *             aria-hidden="true"
 *             className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cta/10 text-cta"
 *           >
 *             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
 *               <path
 *                 d="M3 8.4l3.2 3.2L13 4.8"
 *                 stroke="currentColor"
 *                 strokeWidth="1.8"
 *                 strokeLinecap="round"
 *                 strokeLinejoin="round"
 *               />
 *             </svg>
 *           </span>
 *           <div>
 *             <h3 className="text-h3 font-semibold break-keep text-ink">{promise.title}</h3>
 *             <p className="text-body-m mt-2 leading-[1.75] break-keep text-ink-secondary">
 *               {promise.desc}
 *             </p>
 *           </div>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 */

/**
 * 축별 **얇은 선 아이콘** (2026-08-21) — 나침반(전략) · 격자(웹) · 돋보기(검색) · 연필(콘텐츠).
 *
 * 🚨 인라인 SVG 다 — 아이콘 **라이브러리를 쓰지 않는다**(번들·라이선스). 1.5px 스트로크에
 *    `currentColor` 라 밴드 토큰을 그대로 따라간다. 22px, 장식이라 `aria-hidden`.
 *    (아이콘 유/무 두 안을 캡처로 비교해 **유** 로 확정 — 근거는 START_HERE §5-B)
 */
function AxisIcon({ slug }: { slug: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (slug === "strategy") {
    // 나침반 — 방향을 정한다
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M15.2 8.8l-2 4.4-4.4 2 2-4.4z" />
      </svg>
    );
  }
  if (slug === "experience") {
    // 레이아웃 격자 — 화면 구조를 짠다
    return (
      <svg {...common}>
        <rect x="3.5" y="4" width="17" height="16" rx="1.5" />
        <path d="M3.5 9h17M10 9v11" />
      </svg>
    );
  }
  if (slug === "search") {
    // 돋보기 — 발견되는 구조
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M15.8 15.8L20.5 20.5" />
      </svg>
    );
  }
  // 연필 — 계속 쓴다
  return (
    <svg {...common}>
      <path d="M4 20l1-4 11-11 3 3-11 11z" />
      <path d="M14 7l3 3" />
    </svg>
  );
}

/**
 * 데스크톱(lg 이상) 서비스 카드 배치 **스위치** (2026-08-22).
 *
 * - `"4col"`      — 4열 × **세로 구성**(아이콘·제목·설명 위 / 체크 4 아래). 카드 폭 285px.
 * - `"2col-wide"` — 2열 **와이드 카드 × 좌우 2단**(좌 텍스트 / 우 체크). 카드 폭 590px 대.
 *
 * 사용자 지시대로 두 안을 캡처·실측해 **섹션 총높이가 더 압축되는 쪽**을 채택했다
 * (수치·판단 근거는 START_HERE §5-B "서비스 카드 좌우 2단"). 값만 바꾸면 즉시 뒤집힌다.
 *
 * 🚨 **lg 미만은 스위치와 무관하게 항상 좌우 2단**이다 — 모바일 1열(카드 폭 350px)에서
 *    상/하 구성은 카드 하나가 355px 나 되어 섹션이 세로로 길어진다(실측).
 */
const DESKTOP_CARDS: "4col" | "2col-wide" = "4col";

/**
 * 서비스 카드 — 내용은 `services.ts` 의 **`serviceAxes` 4종을 그대로** 쓴다.
 * (제목 `titleKo`/`title`, 한 줄 설명 `tagline`, 항목 `cardItems` 4개)
 *
 * 🚨 2026-08-21 **pill 칩 → 체크 리스트**: 사용자 "밑에 작은 버튼들이 난잡 — 아이콘 활용해
 *    더 짧게/정돈되게". 테두리·배경 있는 알약 4개가 폭에 따라 제멋대로 접히던 자리를
 *    **14px 체크(원 배경 없이 획만) + 한 줄 라벨** 세로 리스트로 바꿨다. 항목 간 9px.
 *    라벨은 `services.ts` 의 `cardItems`(압축본) — 원문 `includes` 는 /services 가 계속 쓴다.
 *
 * 🚨 2026-08-22 **상/하 → 좌/우 2단**(사용자 "체크리스트를 옆에 두어 공간 효율화"):
 *    좌 = 아이콘·번호·영문명·제목·한 줄 설명 / 우 = 체크 4. 비율은 `basis-0` + `grow-[55]`/
 *    `grow-[45]` 로 **남는 폭을 55:45 로 나눕니다** — 퍼센트 basis 는 gap 을 못 빼서 넘칩니다.
 *    두 컬럼 다 `min-w-0` 이라야 긴 한글 라벨이 카드를 밀지 않습니다.
 */
function ServiceCards() {
  const wide = DESKTOP_CARDS === "2col-wide";

  return (
    <ul
      className={cn(
        "mt-6 grid auto-rows-fr gap-5 md:grid-cols-2",
        wide ? "lg:grid-cols-2" : "lg:grid-cols-4",
      )}
    >
      {serviceAxes.map((axis) => (
        <li
          key={axis.slug}
          className={cn(
            /* 기본(모바일·768 2열) = 좌우 2단. 패딩은 좁은 폭에서 한 단계 줄인다 */
            "card-surface flex h-full gap-4 p-6 sm:gap-5 sm:p-7",
            wide
              ? "lg:gap-8 lg:p-8"
              : /* 4열(285px)은 좌우 2단이 안 들어가 세로 구성으로 되돌린다 */
                "lg:flex-col lg:gap-0 lg:p-8",
          )}
        >
          {/* 좌 — 아이콘·번호·제목·설명 */}
          <div className={cn("min-w-0 basis-0 grow-[55]", !wide && "lg:basis-auto lg:grow-0")}>
            {/* 축 아이콘 — 컬럼 맨 위, 번호 줄 위에 한 칸 */}
            <span className="service-axis-icon block text-ink">
              <AxisIcon slug={axis.slug} />
            </span>
            <div className="mt-4 flex items-baseline gap-3 lg:mt-5">
              {/* 번호는 유채색 자리 하나 — 섹션 라벨의 액센트 틱과 같은 언어 */}
              <span className="text-label font-bold text-cta">{axis.number}</span>
              <span className="text-caption text-ink-muted">{axis.title}</span>
            </div>
            <h3 className="text-h3 mt-2.5 font-semibold break-keep text-ink lg:mt-3">
              {axis.titleKo}
            </h3>
            {/* 🔀 한 줄 설명 — `copyMode: "plain"`(현재)이면 쉬운 말 판,
                `"original"` 이면 2026-08-23 오전 문구. 고르는 곳은 `services.ts` 의 axisTagline */}
            <p className="text-body-m mt-2 break-keep text-ink-secondary lg:mt-2.5">
              {axisTagline(axis)}
            </p>
          </div>

          {/* 우 — 항목 체크 리스트(테두리·배경 없음). 4열에서만 아래로 돌아간다 */}
          <ul
            className={cn(
              "min-w-0 basis-0 grow-[45] space-y-[9px]",
              !wide && "lg:mt-6 lg:basis-auto lg:grow-0",
            )}
          >
            {axis.cardItems.map((item) => (
              /* 체크와 라벨 사이 — 좁은 폭에서만 한 단계 좁힌다(lg 는 기존 10px 그대로) */
              <li key={item} className="flex items-start gap-2 lg:gap-2.5">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="mt-[3px] shrink-0 text-cta"
                >
                  <path
                    d="M3 8.4l3.2 3.2L13 4.8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* `service-card-item` = 시안 ③-d 훅 — `typeScale: "large"` 면 15px 로 커진다
                    (globals `html[data-type="large"] .service-card-item`). "default" 면 13.5px 그대로 */}
                <span className="service-card-item text-[13.5px] leading-[1.5] break-keep text-ink-secondary">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function ServiceSystem() {
  const { heading, highlight } = trustProof;

  return (
    <Section
      /* 네비 앵커는 이 섹션이 그대로 물려받는다 (#services) */
      id="services"
      tone="canvas"
      /* 밴드 배정: 브릿지(검정) → **병합 섹션 흰** → 병합 리뷰(진한 라임) */
      band="paper"
      className="relative"
      aria-labelledby="promise-heading"
    >
      <Container className="relative">
        {/* 상단 2단 — 좌 헤딩 / 우 약속 텍스트 리스트 */}
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10">
          {/*
            🚨 헤딩 줄바꿈 — 이 컬럼에서는 원문의 **하드 줄바꿈(
)을 쓰지 않는다.**
            전체 폭(≈1200px)에서는 그 줄바꿈이 딱 2줄을 만들지만, 절반 폭(≈683px)에서는
            **각 줄이 한 번 더 접혀 4줄**이 되고 "기획하고" 같은 한 마디 줄이 남는다(실측).
            그래서 `whitespace-normal` 로 
 을 공백으로 흘리고 `text-wrap: balance` 로
            줄 길이를 고르게 맞춘다 — 문구는 한 글자도 바꾸지 않았다.
          */}
          {/*
            2026-08-23 중복 제거 이후 이 컬럼은 **헤딩만** 담는다 — 폭은 7/12 그대로다.
            (약속 리스트가 있던 우측 5/12 자리는 아래 설명 컬럼이 그대로 이어받는다)
          */}
          <Reveal className="lg:col-span-7">
            <h2
              id="promise-heading"
              className="text-h1 max-w-[640px] break-keep whitespace-normal [text-wrap:balance]"
            >
              {heading.split(highlight).map((part, index, all) => (
                <span key={`${index}-${part}`}>
                  {part}
                  {index < all.length - 1 ? <span className="text-cta">{highlight}</span> : null}
                </span>
              ))}
            </h2>
          </Reveal>

          {/*
            🚨 **2026-08-23 중복 제거** — 여기 있던 `OUR PROMISE` 컬럼(약속 2건 텍스트 리스트)을
            뺐습니다. 환불 100% · 예약제 소수정예는 이제 **라임 밴드 한 곳**
            (`testimonial-marquee.tsx`)에서만 말합니다. 되살리려면 아래 두 줄을 이 자리에
            다시 넣고 `PromiseList` 함수와 `promiseSection` import 를 복구하면 됩니다:
                <EyebrowLabel>{promiseSection.eyebrow}</EyebrowLabel>
                <PromiseList />

            🚨 **빈 칸이 남지 않게** 두 줄 설명(`serviceSystem.description`)을 이 우측 5/12 칸으로
            옮겼습니다 — 컬럼을 지우고 헤딩만 남기면 1440 에서 오른쪽 절반이 통째로 비고,
            헤딩을 12칸으로 늘리면 글줄이 1100px 넘게 늘어져 읽기가 나빠집니다(§5-B 실측 기준).
            `lg:items-end` 로 설명 밑선이 헤딩 마지막 줄과 한 선에 서서 상단 행이 균형을 잡습니다.
            lg 미만은 예전과 같이 헤딩 → 설명 순으로 자연 스택됩니다(390 확인).
          */}
          <Reveal delay={100} className="mt-6 lg:col-span-5 lg:mt-0">
            <p className="text-body-l max-w-[560px] break-keep whitespace-pre-line text-ink-secondary">
              {serviceSystem.description}
            </p>
          </Reveal>
        </div>

        {/* 하단 — 서비스 카드 전체 폭 */}
        <Reveal delay={140} className="mt-16 md:mt-20">
          <EyebrowLabel>{serviceSystem.eyebrow}</EyebrowLabel>
          <ServiceCards />
        </Reveal>
      </Container>
    </Section>
  );
}
