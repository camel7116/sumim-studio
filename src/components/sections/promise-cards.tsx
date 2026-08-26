import { promiseSection, trustProof } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { EyebrowLabel } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

/**
 * 약속 섹션 (2026-08-20 6차 — 메이커리 "Special Point" 자리) · **banded 전용**
 *
 * 1차에서 TrustProof 안에 끼워 넣었던 약속 카드를 **독립 섹션으로 승격**했다
 * (사용자 지시: 메이커리 구조로 전면 재편). 순서상 브릿지 밴드 바로 뒤 —
 * "만든 것으로 보여드립니다" 다음에 "어떻게 일하는가"가 온다.
 *
 * - 헤딩은 **새로 쓰지 않고** 기존 `trustProof.heading`(+`highlight`)을 그대로 가져온다.
 *   TrustProof 는 banded 에서 렌더되지 않으므로 문구가 중복되지 않는다.
 * - 🚨 카드는 `trustProof.promises` 중 **`enabled: true` 인 것만** 나간다.
 *   미확정 약속("무제한 수정" · "월 작업량 한정")은 계속 대기 상태다 (START_HERE §6 🚨).
 */
export function PromiseCards() {
  const { heading, highlight, promises } = trustProof;
  const visible = promises.filter((promise) => promise.enabled);
  if (visible.length === 0) return null;

  return (
    <Section
      tone="canvas"
      band="mist"
      className="relative lg:py-28!"
      aria-labelledby="promise-heading"
    >
      <Container>
        <Reveal>
          <EyebrowLabel className="mb-6">{promiseSection.eyebrow}</EyebrowLabel>
          <h2
            id="promise-heading"
            className="text-h1 max-w-[820px] break-keep whitespace-pre-line"
          >
            {heading.split(highlight).map((part, index, all) => (
              <span key={`${index}-${part}`}>
                {part}
                {index < all.length - 1 ? <span className="text-cta">{highlight}</span> : null}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <ul
            className={cn(
              "mt-12 grid gap-5 md:mt-14 md:grid-cols-2",
              // 카드 수는 확정된 약속 개수를 그대로 따른다 — 빈 칸을 지어내 채우지 않는다
              visible.length > 2 && "lg:grid-cols-3",
            )}
          >
            {visible.map((promise) => (
              <li key={promise.title} className="card-surface p-7 md:p-8">
                {/* 유채색은 주황 하나 — 카드에서도 체크 표시에만 찍는다 */}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cta/10 text-cta"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8.4l3.2 3.2L13 4.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="text-h3 mt-5 font-semibold break-keep text-ink">
                  {promise.title}
                </h3>
                <p className="text-body-m mt-2.5 break-keep text-ink-secondary">{promise.desc}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
