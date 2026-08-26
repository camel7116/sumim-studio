import Image from "next/image";
import { founder } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { EyebrowLabel, MaskLines } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

/**
 * 대표 소개 (2026-08-23 시안 ② — 신설) · **라임 밴드**
 *
 * 자리: **FAQ(흰) 다음 · Final CTA(검정) 앞**. 앞뒤가 흰·검정이라 라임을 끼워야
 * 밴드 교차 규칙(인접 동일색 없음, START_HERE §3)이 유지된다.
 * 네비의 `About` 항목이 이 섹션의 `#about` 을 가리킨다.
 *
 * 구성 (데스크톱 2단 / 모바일 세로 스택)
 * ┌ 좌 : 320px **정사각** 모노그램 — 사진 확정 전이라 검정 박스에 이니셜 "H"
 * └ 우 : eyebrow → 헤딩(다른 섹션과 같은 `text-h1`) → 소개 2줄
 *
 * 🚨 **2026-08-23 중복 제거** — 우측 끝에 있던 **사실 4개 체크 리스트**가 빠졌습니다.
 *    이 섹션은 이제 "대표가 처음부터 끝까지"를 말하는 **유일한 자리**입니다
 *    (`process.ts` 인트로 · FAQ "담당자가 바뀌지 않나요" 도 같은 날 제거).
 *
 * 🚨 **박스는 전부 직각**이다(2026-08-21 "박스들 라운드 전부 제거"). 새 색도 쓰지 않는다 —
 *    모노그램 면은 `bg-ink`, 글자는 `text-surface` 라 밴드 토큰(=colorLab·팔레트)을 따라간다.
 * 🚨 **새 사실·수치를 만들지 않았다.** 문구는 전부 `site.ts` 의 `founder` 하나에서 온다.
 * 🔀 `founder.enabled` 를 false 로 내리면 섹션이 통째로 빠진다(FAQ 흰 → CTA 검정으로
 *    이어져 교차 규칙은 그대로). 네비의 About 항목도 같이 지울 것.
 */

/*
 * 2026-08-23 중복 제거 — 사실 체크 리스트가 빠지면서 이 아이콘도 쓰이지 않습니다.
 * 보존본(되살릴 때 그대로 주석만 풀면 됩니다):
 *
 * // 사실 체크 아이콘 — 서비스 카드·약속 리스트와 **같은 글리프**(14px, 획만)
 * function CheckIcon() {
 *   return (
 *     <svg
 *       aria-hidden="true"
 *       width="14"
 *       height="14"
 *       viewBox="0 0 16 16"
 *       fill="none"
 *       className="mt-[5px] shrink-0 text-cta"
 *     >
 *       <path
 *         d="M3 8.4l3.2 3.2L13 4.8"
 *         stroke="currentColor"
 *         strokeWidth="1.8"
 *         strokeLinecap="round"
 *         strokeLinejoin="round"
 *       />
 *     </svg>
 *   );
 * }
 */

/**
 * 모노그램 / 사진 — **320px 정사각**.
 * `founder.photo` 가 null 인 동안은 검정 박스 + 이니셜 한 글자다(워드마크와 같은 결).
 * 경로 문자열을 넣으면 같은 상자 안에서 사진으로 바뀐다.
 */
function FounderPortrait() {
  const initial = founder.name.slice(0, 1);

  return (
    <div className="relative aspect-square w-full max-w-[320px] overflow-hidden bg-ink">
      {founder.photo ? (
        <Image
          src={founder.photo}
          alt={`${founder.name} ${founder.role}`}
          fill
          sizes="320px"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center text-[128px] leading-none font-bold tracking-[-0.04em] text-surface select-none"
        >
          {initial}
        </span>
      )}
    </div>
  );
}

export function Founder() {
  if (!founder.enabled) return null;

  return (
    <Section
      id="about"
      tone="canvas"
      /* 밴드 배정: FAQ(흰) → **대표 소개 라임** → Final CTA(검정) */
      band="mist"
      /*
        🚨 **2026-08-23 — 하단 여백 축소.** 사실 4줄이 빠지면서 1440 에서 본문 아래로 라임이
        크게 비었습니다(실측: 섹션 718px · 상하 패딩 160/160 · 우측 텍스트 컬럼은 440px 에서
        끝나 그 아래 278px 가 빈 라임). `lg` 에서만 하단을 160 → **96px** 로 줄입니다.
        되돌릴 값: 이 `lg:pb-24!` 한 클래스를 지우면 기본 `lg:py-40`(160/160)으로 복귀합니다.
        ⚠️ lg 미만은 컬럼이 세로로 쌓여 상·하 여백이 이미 같으므로 **건드리지 않았습니다**.
        ⚠️ 남는 빈 라임의 진짜 원인은 두 컬럼 높이 차(좌 모노그램 398px / 우 텍스트 260px)입니다.
           완전히 없애려면 `lg:items-start` → `lg:items-center` 인데, 지시 범위 밖이라 두었습니다.
      */
      className="relative lg:pb-24!"
      aria-labelledby="founder-heading"
    >
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          <Reveal className="lg:col-span-4">
            <FounderPortrait />
            {/* 이름·역할은 상자 바로 아래 — 상자 안에 글자를 겹치지 않는다 */}
            <p className="mt-5 text-h3 font-semibold text-ink">{founder.name}</p>
            <p className="text-caption mt-1.5 text-ink-secondary">{founder.role}</p>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-8">
            <EyebrowLabel className="mb-6">{founder.eyebrow}</EyebrowLabel>
            {/* 헤딩 스케일은 다른 섹션과 같은 text-h1 — 줄 단위 마스크 리빌도 같다 */}
            <h2 id="founder-heading" className="text-h1 mask-reveal break-keep">
              <MaskLines text={founder.heading} />
            </h2>

            <div className="mt-8 max-w-[640px] space-y-3">
              {founder.intro.map((line) => (
                <p key={line} className="text-body-l break-keep text-ink-secondary">
                  {line}
                </p>
              ))}
            </div>

            {/*
              🚨 **2026-08-23 중복 제거** — 여기 있던 **사실 4개 체크 리스트**를 뺐습니다.
              네 줄 전부 다른 섹션과 겹쳤습니다(부산·제작+블로그 = 히어로 사실 한 줄 /
              예약제·환불 100% = 라임 밴드). 문자열 보존본은 `site.ts` 의 `founder.facts` 주석입니다.
              되살리려면 `founder.facts` 주석을 풀고 아래를 이 자리에 다시 넣으세요
              (`CheckIcon` 도 함께 복구):

              <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                {founder.facts.map((fact) => (
                  <li key={fact} className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span className="text-body-m break-keep text-ink">{fact}</span>
                  </li>
                ))}
              </ul>
            */}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
