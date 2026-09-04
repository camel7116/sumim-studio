import { faqItems, faqSection } from "@/content/faq";
import { giantSectionLabels } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { glyphForIndex } from "@/components/ui/brand-glyphs";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

/** FAQ (문서 §8.12) — 왼쪽 정렬, 아코디언
 *  tone: 앞 섹션과 배경이 겹치지 않게 교차시킨다 (§6.4).
 *  2026-08-08 Work↔Process 순서 교체로 앞 섹션이 Process(canvas)가 되어 surface로 되돌림.
 *
 *  2026-08-20 (banded 2차) — **컬럼 구조 재검토 결과: 중앙 720px 단일 컬럼**.
 *  왼쪽 4/12 컬럼은 원래 3D 압출 "FAQ" 글자가 놓이던 자리인데, banded 에서 그 글자를 끄고 나니
 *  헤딩 아래로 500px 넘는 빈 공간만 남았다. 대안이던 "잉크 8% 큰 FAQ 글자"는
 *  ① 방금 전 섹션에서 전부 걷어낸 **장식을 다시 들이는 것**이고
 *  ② eyebrow "FAQ" + 헤딩 "자주 묻는 질문" 과 합쳐 같은 말이 세 번 나온다.
 *  그래서 컬럼을 없애고 헤더를 문항 위 가운데로 올렸다. 앞뒤 섹션(Q&A·Work 중앙 / Trust·Process
 *  좌측 2단)과도 리듬이 번갈아 맞는다.
 *
 *  🚨 2026-08-21 정리 패스: 셸의 4/8 2단 분기와 3D 압출 "FAQ" 파티클은 걷어냈다(아카이브 참고). */
export function FaqSection() {
  return (
    <Section tone="surface" band="paper" className="relative" aria-labelledby="faq-heading">
      <Container className="relative">
        <div className="mx-auto max-w-[720px]">
          <Reveal>
            <SectionHeader
              eyebrow={faqSection.eyebrow}
              heading={faqSection.heading}
              headingId="faq-heading"
              align="center"
              /* 🆕 거대 영문 타이포 + 도형 순환 index 5 → 도넛 (2026-08-31).
                 ⚠️ 이 섹션은 eyebrow 도 "FAQ" 라 거대 타이포와 **같은 말**이다 —
                    스위치가 켜지면 eyebrow 가 자동으로 숨어 중복이 생기지 않는다 */
              giant={giantSectionLabels.faq}
              glyph={glyphForIndex(5)}
              className="mx-auto mb-12 text-center md:mb-14"
            />
          </Reveal>
          <Reveal delay={100}>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
