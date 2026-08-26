import { processSection, processSteps } from "@/content/process";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ProcessFlow } from "@/components/sections/process-flow";

/**
 * Process (문서 §7.5, §8.7)
 * 숫자와 선으로 구성. Desktop 스티키 스크롤, Mobile 수직 타임라인.
 * 레이아웃과 현재 단계 강조는 ProcessFlow(클라이언트)가 담당하고,
 * 헤더는 서버 컴포넌트로 렌더해 프롭으로 전달한다.
 *
 * 2026-08-08: 단계 "내용"만 고객 여정 8단계로 교체하고 레이아웃은 유지한다.
 * (원형 플로우 시안은 사용자 반려 — 기존 스티키 스크롤이 스밈의 형태)
 */
export function Process() {
  return (
    <Section
      id="process"
      tone="canvas"
      /*
        밴드 배정 (2026-08-21 사용자 "Process 섹션을 '말로 설명하지 않습니다'(브릿지) 부분과
        배경색 통일") — 라임 → **검정(void)**. 앞뒤가 Q&A(흰)·FAQ(흰)라 교차는 그대로다.
        검정 위 색은 전부 밴드 토큰이 알아서 뒤집는다(숫자·비활성 회색·헤어라인·버튼 글자).
      */
      band="void"
      className="relative"
      aria-labelledby="process-heading"
    >
      {/* ⚠️ 섹션에 overflow-hidden 을 주지 않는다 — ProcessFlow 의 lg:sticky 가 죽는다.
          (배경 장식 SectionBlobs·DnaHelix 는 2026-08-21 정리 패스에서 아카이브로 갔다) */}
      <Container className="relative">
        <ProcessFlow
          steps={processSteps}
          header={
            <Reveal>
              <SectionHeader
                eyebrow={processSection.eyebrow}
                heading={processSection.heading}
                /* 2026-08-23 중복 제거: description 이 null 이면 설명 줄을 아예 렌더하지 않는다 */
                description={processSection.description ?? undefined}
                headingId="process-heading"
              />
            </Reveal>
          }
        />
      </Container>
    </Section>
  );
}
