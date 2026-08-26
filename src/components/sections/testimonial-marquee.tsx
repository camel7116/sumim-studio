"use client";

import { reviewBand, trustProof } from "@/content/site";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { EyebrowLabel, MaskLines } from "@/components/ui/section-header";
import { CountUp } from "@/components/ui/count-up";
import { useMarquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

/**
 * 포지션 선언 + 후기 마키 **병합 섹션** (2026-08-21 병합·연화, 페이블) · **banded 전용** · 라임(mist)
 *
 * 6차의 두 섹션(포지션 밴드 네이비 + 후기 마키 라임)을 사용자 지시로 하나로 합쳤다.
 *
 * 구성 (2026-08-21 저녁 — **전폭 마키**로 재편 / 밤 — 스탯을 **헤딩 옆**으로)
 * ┌ 상단(Container 안) — **좌**: eyebrow → 선언 헤딩(`reviewBand.heading`)
 * │                      **우**: 검증 스탯 2개 **가로**(사이 세로 헤어라인) + 그 아래 작게
 * │                             예약제 안내(`trustProof.note`) · 두 단은 `items-end` 아랫단 정렬
 * │                      그 아래 전폭으로 마키 캡션 한 줄
 * └ 하단(Container **밖**) — 후기 마키가 **뷰포트 전체 폭**으로 흐른다
 *
 * 🚨 좌우 2단(좌 선언 / 우 컬럼 마키) 구도는 **폐기**했다 — 컬럼 폭 784px 에 440px 카드가
 *    1.7장밖에 안 걸려 "하나만 보인다"는 지적을 받았다. 전폭이면 1536 에서 3.3장이 걸린다.
 *
 * 마키 동작(rAF 구동 · 누르는 동안만 정지+드래그 · 화면 밖 정지 · reduced-motion 정지)은
 * `components/ui/marquee.tsx` 공용 훅 그대로다 — **컨테이너만 넓어졌다**.
 *
 * 🚨 후기 5건은 전부 **자리표시**다(`trustProof.testimonialsArePlaceholder`).
 *    실제 후기를 받기 전까지 지어낸 후기를 쓰지 않는다 — 허위 후기는 표시광고법 위반.
 *    그래서 별점·업종 배지도 "내용"이 아니라 자리의 모양만 잡고 있다.
 * 🚨 평점·건수(메이커리 "4.9 / 1000+")는 여전히 쓰지 않는다 — 검증된 수치가 없다.
 */
export function TestimonialMarquee() {
  const { testimonials } = trustProof;
  const { viewportRef, trackRef } = useMarquee();

  if (!reviewBand.enabled) return null;

  // 검증된 스탯만 (고객만족도는 value: null 이라 자동으로 빠진다)
  const stats = trustProof.stats.filter(
    (stat): stat is typeof stat & { value: number } =>
      typeof stat.value === "number",
  );

  /**
   * 🔀 **시안 ②-a (2026-08-23)** — 후기가 아직 자리표시인 동안 **마키와 그 위 캡션을 감춘다.**
   *
   * 두 조건이 **모두** 참일 때만 감춘다:
   *   ① `trustProof.testimonialsArePlaceholder` (후기 5건이 전부 자리)
   *   ② `reviewBand.hideMarqueeWhilePlaceholder` (스위치, 기본 true)
   * → 실후기가 들어와 ①이 false 가 되면 스위치와 무관하게 마키가 자동 복귀한다.
   *
   * 감춘 자리를 빈 라임 덩어리로 두지 않기 위해 ⓐ 섹션 패딩을 한 단계 줄이고
   * ⓑ 스탯 아래에 `trustProof.promises` 중 `enabled: true` 두 건을 짧은 2칸 줄로 세운다.
   */
  const hideMarquee =
    trustProof.testimonialsArePlaceholder && reviewBand.hideMarqueeWhilePlaceholder;
  const promises = hideMarquee
    ? trustProof.promises.filter((promise) => promise.enabled)
    : [];

  return (
    <Section
      tone="canvas"
      band="mist"
      className={cn(
        "band-deep relative overflow-hidden",
        /* 마키가 빠지면 밴드가 헐거워진다 — 패딩을 한 단계 줄인다
           (되돌릴 값: `lg:py-24!` 만 있는 2026-08-23 오전 상태) */
        hideMarquee ? "py-14! md:py-16! lg:py-20!" : "lg:py-24!",
      )}
      aria-labelledby="reviews-heading"
    >
      {/*
        🚨 **전폭 마키 구조** (2026-08-21 저녁 사용자 "마키가 좁아 카드가 하나만 보인다").
        컬럼 안(784px)에서는 440px 카드가 1.7장밖에 안 걸려 흐름이 안 읽혔다.
        상단(헤딩·스탯)만 `Container` 안에 두고 **마키는 Container 밖 = 뷰포트 전체 폭**으로
        흘린다(셸 시절 마키가 쓰던 방식). 1536 기준 카드 3.3장이 동시에 보인다.
      */}
      <Container>
        {/*
          🚨 **헤딩 좌 / 스탯 우 가로 배치** (2026-08-21 밤 사용자 "남은 티오·불만족(환불)
          스탯을 옆으로 보내자"). 전폭 마키로 바꾸며 스탯을 헤딩 **아래 세로 스택**으로
          쌓았더니 상단 블록이 길어져 마키가 첫 화면에서 밀렸다. 1~3차 시절 `WHY SUMIM`
          2단과 같은 구도로 되돌린다 — **좌 선언 / 우 스탯 2개(가로, 사이 세로 헤어라인)**,
          `items-end` 로 **아랫단 정렬**해 헤딩 마지막 줄과 스탯 밑선이 한 선에 선다.
          1024px 미만은 그대로 세로로 흐른다(스탯도 세로 스택 → `sm:` 부터 가로).

          🚨 **모바일도 헤딩 옆으로** (2026-08-22 사용자 "모바일에서 티오·환불이 헤딩 아래로
          스택되니 데스크톱처럼 헤딩 옆에"). `lg:` 접두사를 떼어 **전 폭에서 2단**이 되고,
          스탯끼리는 `sm` 미만에서 **세로 2개 소형**(숫자 28px)으로 쌓입니다 — 390px 에서
          가로로 늘어놓으면 스탯 컬럼이 헤딩을 밀어냅니다.
          🚨 스탯 컬럼은 `sm` 미만에서 **고정 폭 104px** 입니다 — `shrink-0` 만 주면 컬럼 폭이
          예약제 안내 문장의 max-content(≈220px)로 벌어져 헤딩이 110px 로 짓눌립니다(계산).
          104px 는 가장 긴 스탯 라벨("불만족 시 환불" ≈94px)이 한 줄로 들어가는 최소치입니다.

          🚨 **두 단을 한 덩어리로 중앙 배치** (2026-08-22 사용자 "리뷰 제목, 티오·환불 양쪽
          여백 똑같이 하고 중앙으로"). 모바일에서 헤딩 컬럼의 **`flex-1` 을 뺐습니다** —
          `flex-1` 이면 컬럼이 남는 폭을 다 먹어 스탯이 화면 오른쪽 끝에 못 박히고, 헤딩 글줄은
          그 안에서만 가운데라 **왼쪽 여백 39px / 오른쪽 20px** 로 어긋났습니다(실측).
          이제 헤딩은 글줄 폭(max-content)만 차지하고 `justify-center` 가 [헤딩+스탯] 덩어리를
          통째로 가운데 세워 **좌우 여백이 같아집니다**. `lg:justify-between` + `lg:flex-none`
          이라 데스크톱 2단(좌 헤딩 / 우 스탯)은 그대로입니다.
          🚨 **모바일 전용 마감** (2026-08-22 사용자 주석 캡처 — "모바일 버전만이야"):
          ① 제목 블록(eyebrow+헤딩)은 자기 영역 안에서 **텍스트 중앙 정렬** — eyebrow 는 flex 라
             부모의 `text-center` 를 안 따르므로 `justify-center` 를 따로 줍니다(§5-B 2차 전례).
          ② 세로는 **`items-center`** 로 스탯 블록과 가운데를 맞춥니다.
          ③ 스탯·안내는 **우측 끝 정렬**(`text-right`) — 컬럼 오른쪽 변이 컨테이너 우측 여백에
             딱 붙습니다(왼쪽 정렬이면 숫자·문장 길이가 달라 오른쪽이 들쭉날쭉했습니다).
          🚨 셋 다 **`lg` 미만 전용**입니다 — `lg:items-end` · `lg:text-left` · `lg:justify-start`
             로 데스크톱 상단 2단(좌 헤딩 / 우 스탯, 아랫단 정렬)은 **한 픽셀도 안 바뀝니다**.
        */}
        <Reveal className="flex flex-wrap items-center justify-center gap-x-3 lg:flex-nowrap lg:items-end lg:justify-between lg:gap-12">
          <div className="min-w-0 text-center lg:max-w-[640px] lg:flex-none lg:text-left">
            {/*
              🔀 2026-08-23 중복 제거 — 마키를 감춘 동안 이 밴드가 말하는 것은 사실상 **약속**이라
              eyebrow 를 `OUR PROMISE` 로 바꿔 답니다(병합 섹션에서 뺀 라벨이 이 자리로 옮겨온 셈).
              실후기가 들어와 `testimonialsArePlaceholder` 가 false 가 되면 자동으로 `REVIEWS` 복귀.
            */}
            <EyebrowLabel className="mb-6 justify-center lg:justify-start">
              {hideMarquee ? reviewBand.eyebrowWhilePlaceholder : reviewBand.eyebrow}
            </EyebrowLabel>
            {/*
              🚨 **모바일 미세 조정** (2026-08-22 사용자 "'견적,' '퀄리티.' 옆의 쉼표·마침표
              없애자, 폰트 사이즈 좀 줄이고").
              ① 부호는 **문자열을 고치지 않고** `MaskLines` 의 `punctuationClassName` 으로
                 줄 끝 부호만 `<span hidden lg:inline>` 에 감싸 `lg` 미만에서 감춥니다 —
                 `site.ts` 의 `reviewBand.heading` 은 한 벌 그대로고 데스크톱은 부호가 그대로 뜹니다.
                 (모바일용 문자열을 따로 두면 문구를 고칠 때 두 곳을 맞춰야 합니다)
              ② 크기는 `max-sm:` 로 **24px** — 클램프 하한(28px)이 걸리는 구간이 곧 폰 폭이라,
                 클램프 자체를 건드리면 데스크톱 계산식까지 흔들립니다. `sm`(640px) 이상은
                 기존 유동값 그대로라 태블릿(768 = 36.7px)·데스크톱(48px)은 안 바뀝니다.
                 줄간은 `leading-[1.35]` 무단위라 폰트에 **비례해서 같이 줄어듭니다**.
            */}
            <h2
              id="reviews-heading"
              className="mask-reveal text-[length:clamp(1.75rem,0.9rem+2.9vw,3rem)] leading-[1.35] break-keep whitespace-pre-line text-ink max-sm:text-[1.5rem]"
            >
              <MaskLines
                text={reviewBand.heading}
                step={110}
                punctuationClassName="hidden lg:inline"
              />
            </h2>
          </div>

          <div className="shrink-0">
            {/* 스탯끼리도 가로 — 사이는 세로 헤어라인(`divide-x`) 한 줄만 (모바일 포함) */}
            <div className="flex divide-x divide-line">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={
                    index === 0 ? "pr-2 sm:pr-8 lg:pr-10" : "pl-2 sm:pl-8 lg:pl-10"
                  }
                >
                  {/* 🚨 라벨·노트만 `sm` 미만에서 한 단계 작습니다 — 숫자(28px)·헤딩(28px)은
                      그대로 두고 **가장 넓은 글줄**인 이 둘을 줄여야 가로 2단이 390px 에 들어갑니다 */}
                  <p className="text-label text-cta max-sm:text-[11.5px]">{stat.label}</p>
                  <p className="mt-1.5 text-[1.75rem] leading-none font-bold tracking-[-0.03em] whitespace-nowrap text-ink sm:mt-2 sm:text-[clamp(2.25rem,1.9rem+1.9vw,3.25rem)]">
                    <CountUp value={stat.value} decimals={stat.decimals} />
                    <span className="ml-0.5 align-baseline text-[0.45em] font-semibold text-ink-secondary">
                      {stat.suffix}
                    </span>
                  </p>
                  <p className="text-caption mt-1.5 text-ink-secondary max-sm:text-[11px] sm:mt-2">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>

            {/*
              "높은 퀄리티를 위해 예약제로 진행됩니다" — 티오 수치와 같은 자리에서 읽혀야 해서
              스탯 **바로 아래 작게** 붙인다(본문 크기 → caption). 스탯 블록 폭 안에서 끝난다.
              🚨 `lg` 미만에서는 **아래 형제 노드가 대신 그립니다** — 이 자리에 두면 문장의
                 max-content(≈220px)가 스탯 컬럼 폭을 결정해 헤딩을 밀어냅니다(계산·실측).
            */}
            <p className="text-caption mt-5 hidden text-ink-secondary lg:block">
              {trustProof.note}
            </p>
          </div>

          {/*
            🚨 **모바일 전용 자리** — 같은 `trustProof.note` 를 [헤딩+스탯] 2단 **아래 전체 폭**에
            한 줄로 세웁니다(`order-last w-full`, 부모가 `flex-wrap`). 390px 에서 실제로 한 줄에
            들어가고, 스탯 컬럼이 이 문장 길이에 끌려가지 않습니다.
            ⚠️ 노드가 둘이지만 **동시에 보이는 것은 하나**입니다(`lg:hidden` ↔ `hidden lg:block`) —
               `display:none` 이라 보조기술도 한 번만 읽습니다. 문구는 `site.ts` 한 곳에서 옵니다.
          */}
          <p className="text-caption order-last mt-6 w-full text-center text-ink-secondary lg:hidden">
            {trustProof.note}
          </p>
        </Reveal>

        {/*
          🆕 **확정된 약속 2건** (2026-08-23 시안 ②-a) — 마키를 감춘 동안에만 나온다.
          새 카피가 아니라 `trustProof.promises` 중 **`enabled: true` 인 것 그대로**다
          (병합 섹션의 약속 리스트와 같은 소스 — 미확정 2건은 여기서도 안 나온다).
          체크 아이콘은 서비스 카드·약속 리스트와 같은 글리프를 쓴다.
        */}
        {promises.length > 0 ? (
          <Reveal delay={100}>
            <ul className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2 sm:gap-6">
              {promises.map((promise) => (
                <li key={promise.title} className="flex items-start gap-2.5">
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="mt-[5px] shrink-0 text-cta"
                  >
                    <path
                      d="M3 8.4l3.2 3.2L13 4.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-body-m break-keep text-ink">
                    <span className="font-semibold">{promise.title}</span>
                    <span className="text-ink-secondary"> — {promise.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {/*
          마키 **바로 위** 캡션 — 문구는 `testimonialsArePlaceholder` 가 고른다(site.ts 주석):
          지금은 자리표시라 "담길 자리입니다", 실후기가 들어오면 "직접 남긴 이야기입니다".
          우측 컬럼에 띄웠더니 헤딩과 멀어 떠 보여서(캡처 비교) **마키 위 캡션 자리**로 내렸다.
        */}
        {/* 🔀 마키를 감춘 동안에는 이 캡션("…담길 자리입니다.")도 함께 빠진다 */}
        {hideMarquee ? null : (
          <Reveal delay={100}>
            {/* 모바일은 상단 블록이 통째로 중앙이라 이 라벨도 중앙에 세운다(2026-08-22 사용자 지시) */}
            <p className="mt-12 text-center text-[13.5px] leading-relaxed font-medium text-ink-secondary md:mt-14 lg:text-left">
              {trustProof.testimonialsArePlaceholder
                ? reviewBand.marqueeNote.placeholder
                : reviewBand.marqueeNote.real}
            </p>
          </Reveal>
        )}
      </Container>

      {/* 마키 — **Container 밖**(뷰포트 전체 폭). 좌우 끝은 .marquee 의 mask 가 페이드시킨다.
          🔀 시안 ②-a: 후기가 자리표시인 동안에는 렌더하지 않는다(위 `hideMarquee` 주석 참고) */}
      {hideMarquee ? null : (
      <Reveal delay={140}>
        <div ref={viewportRef} className="marquee mt-5" aria-label="고객 후기">
          <div ref={trackRef} className="marquee-track">
            {/* 같은 목록을 2벌 이어 붙여 이음매 없이 순환시킨다 */}
            {[0, 1].map((copy) => (
              <ul key={copy} className="marquee-group" aria-hidden={copy === 1}>
                {testimonials.map((item, index) => (
                  <li
                    key={`${copy}-${index}`}
                    /* 직각 카드 — 2026-08-21 "박스들 라운드 전부 제거". 라운드 0 은
                           `.card-surface` 자체 규칙이라 여기서 덮을 것이 없다(안쪽 업종 배지 pill 은 유지).

                           🚨 **크기 복원 (2026-08-21 저녁 사용자 "후기 박스가 너무 작다")** —
                           병합하며 420 → 340px 로 줄였던 폭을 **440px** 로 되돌리고,
                           같은 날 "세로도 넉넉하게"로 패딩 24→**32px**(p-8) · 별점 15→**17px** ·
                           인용문 최소 높이 3줄→**4줄**(min-h-[7em])까지 키웠다. 실측 440×314px. */
                    className="card-surface w-[min(84vw,440px)] shrink-0 p-8"
                  >
                    <div aria-hidden="true" className="flex gap-1 text-cta">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <svg
                          key={star}
                          width="17"
                          height="17"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6z" />
                        </svg>
                      ))}
                    </div>
                    {/* 인용문 — **4줄 최소 높이**(min-h-[7em] = 1.75 × 4, 2026-08-21 저녁
                            "카드가 세로로 넉넉하게"). 실후기가 길어져도 카드가 흔들리지 않는다 */}
                    <p className="text-body-m mt-5 min-h-[7em] break-keep leading-[1.75] text-ink">
                      “{item.quote}”
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-subtle text-[13px] font-semibold text-ink-secondary"
                      >
                        {item.author.slice(0, 1)}
                      </span>
                      <span>
                        <span className="text-body-m block font-semibold text-ink">
                          {item.author}
                        </span>
                        <span className="text-caption block text-ink-secondary">
                          <span className="trade-badge">{item.company}</span>
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Reveal>
      )}
    </Section>
  );
}
