import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { ClientProblems } from "@/components/sections/client-problems";
import { TestimonialMarquee } from "@/components/sections/testimonial-marquee";
import { ServiceSystem } from "@/components/sections/service-system";
import { Process } from "@/components/sections/process";
import { SelectedWork } from "@/components/sections/selected-work";
import { StatementBand } from "@/components/sections/statement-band";
import { PartnerStrip } from "@/components/sections/partner-strip";
import { FaqSection } from "@/components/sections/faq-section";
import { Founder } from "@/components/sections/founder";
import { FinalCta } from "@/components/sections/final-cta";
import { organizationJsonLd } from "@/lib/metadata";

/**
 * 메인 페이지 — **원페이지**(2026-08-21 사용자 확정 "자사 홈피는 임팩트 있게 원페이지로").
 *
 * 섹션 순서는 2026-08-20 6차의 메이커리 구조 + 2026-08-21 포지션·후기 병합이다.
 *
 * 🚨 2026-08-21 정리 패스: 예전 셸 퍼널(`ShellSections`)과 모드 분기는 **삭제**했다.
 *    스냅샷은 `_archive/particle-shell-2026-08-21/app/page.tsx`, 복원 절차는 같은 폴더 RESTORE.md.
 *    메인에서 빠져 있던 섹션(Proof Strip · Brand Statement · SUMIM Difference · Evidence · Team)
 *    도 같은 아카이브의 `components/sections/` 에 원본 그대로 들어 있다.
 *
 * | # | 섹션 | 밴드 |
 * |---|---|---|
 * | 1 | Hero (초대형 워드마크) | 검정 |
 * | 2 | Selected Work | 흰 |
 * | 3 | 브릿지 (폰 2대) | 검정 |
 * | 4 | **약속 + Services (2026-08-21 병합)** | 흰 |
 * | 5 | **포지션 선언 + 스탯 + 후기 마키 (병합)** | 라임(한 단계 진하게) |
 * | 6 | Q&A(문제) | 흰 |
 * | 7 | Process | 검정 |
 * | 8 | FAQ | 흰 |
 * | 9 | **대표 소개 (2026-08-23 신설 · `#about`)** | 라임 |
 * | 10 | Final CTA · 푸터 | 검정 |
 *
 * ⚠️ 인접 동일색이 없어야 한다(CTA→푸터만 예외). 5(리뷰 라임)는 앞뒤가 4·6 흰 밴드라
 *    **라임이 그 사이를 끊는 자리**다 — `reviewBand.enabled = false` 로 끄면 흰이 연달아 붙는다.
 * 🚨 `PromiseCards`(components/sections/promise-cards.tsx)는 2026-08-21 병합으로 배열에서
 *    빠졌지만 **파일은 보존**돼 있다 — 다시 두 섹션으로 나누려면 그 컴포넌트를 여기 꽂고
 *    `service-system.tsx` 에서 약속 컬럼을 걷어내면 된다.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <Navigation />
      <main id="main" className="page-enter">
        <Hero />
        {/* 작품 먼저 (메이커리 구조) — 말보다 결과물이 앞에 선다 */}
        <SelectedWork />
        {/* 협력 로고: content/site.ts의 partners가 null이면 **아무것도 렌더되지 않는다**.
            자리는 Work 바로 뒤 — 로고가 생겨도 Work(흰) → 로고(라임) → 브릿지(검정)로
            밴드 교차가 유지된다(Process 뒤에 두면 라임이 연달아 붙는다). */}
        <PartnerStrip />
        {/* 브릿지: "말로 설명하지 않습니다 / 만든 것으로 보여드립니다" + 폰 2대 */}
        <StatementBand />
        {/* 약속 + Services — 2026-08-21 한 섹션으로 병합(좌 약속 / 우 서비스 4종) */}
        <ServiceSystem />
        {/* 포지션 선언 + 검증 스탯 + 후기 마키 — 2026-08-21 한 섹션으로 병합(좌 선언 / 우 마키) */}
        <TestimonialMarquee />
        {/* 문제 공감 → 프로세스로 이어지는 다리 */}
        <ClientProblems />
        <Process />
        <FaqSection />
        {/* 대표 소개 (2026-08-23 신설) — FAQ(흰)와 CTA(검정) 사이의 라임 밴드.
            `founder.enabled = false` 면 렌더되지 않고 흰 → 검정으로 바로 이어진다. */}
        <Founder />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
