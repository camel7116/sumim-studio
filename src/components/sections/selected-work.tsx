import { projects, selectedWork } from "@/content/projects";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "@/components/ui/project-card";
import { ProjectQuadCard, WorkQuadPlaceholder } from "@/components/ui/project-quad-card";
import { ProjectModal } from "@/components/ui/project-modal";
import { Reveal } from "@/components/ui/reveal";

/**
 * 🔀 **레이아웃 스위치 (2026-08-25)**
 *
 * | 값 | 화면 |
 * |---|---|
 * | **`"quad"`** | **현재** — 화면 전폭 **4분할 네모 박스**(모바일 2×2). 3D 기울기·폰 돌출 없음, 설명글은 박스 안쪽 아래에 항상 표시 |
 * | `"cards3"` | 2026-08-19~ 3열 **기울기 목업 카드**(모니터 + 박스 밖으로 돌출된 폰, 설명글은 카드 아래) |
 *
 * 🚨 `"cards3"` 쪽 부품(`project-card.tsx` · `device-mockup.tsx` · 아래 `TILTS`·`compact`)은
 *    **한 줄도 지우지 않았습니다.** 값만 바꾸면 예전 화면이 그대로 돌아옵니다.
 */
const WORK_LAYOUT: "quad" | "cards3" = "quad";

/** `cards3` 전용 — 3열에서 카드가 놓인 자리. 좌·우가 서로를 향하고 가운데는 거의 정면 (§4-B) */
const TILTS = ["left", "center", "right"] as const;

/**
 * Selected Work (문서 §8.8)
 * 2026-08-08 사용자 확정(레퍼런스 차용): 헤더 중앙정렬 + 그리드.
 * 2026-08-19: 실제 프로젝트가 3건이라 2열에서 2+1로 마지막 카드가 홀로 남았다.
 *   → lg 이상 3열(md는 2열 유지) + 3건만 노출. 목업 기울기도 3열 배치에 맞춰
 *     좌/중/우가 서로 마주 보게 배정한다.
 *
 * 🚨 2026-08-21 정리 패스: 배경 장식(회색 격자 · 인디고 물감 번짐 · drift 파티클)과
 *    "모든 프로젝트 보기"(→ /work) 버튼 분기를 걷어냈다. 장식은 이미 화면에 안 나가던 코드이고,
 *    버튼은 원페이지 전환(2026-08-21)으로 꺼져 있었다 — 카드가 모달로 상세를 연다.
 *    스냅샷은 `_archive/particle-shell-2026-08-21/components/sections/selected-work.tsx`.
 *
 * 🚨 2026-08-25: 기본이 **4분할 박스**(`WORK_LAYOUT`)가 됐다.
 *    - **섹션 헤더는 그대로 `Container` 안 중앙**이고, 격자만 `Container` **밖**에 두어
 *      뷰포트 전폭으로 흐른다(섹션이 좌우 패딩을 갖지 않으므로 `w-full` 이 곧 전폭이다).
 *    - 칸 사이 경계선은 **`gap-px` + 그리드 배경 `bg-line`** 이다. 칸마다 보더를 주면
 *      인접 변이 겹쳐 2px 로 보이는데, 이 방식은 틈 자체가 정확히 1px 이라 구조적으로 겹칠 수 없다.
 *      바깥 좌우 변은 뷰포트 끝이라 선을 두지 않고, 위아래만 `border-y` 로 닫는다.
 */
export function SelectedWork() {
  const items = projects.slice(0, 3);

  return (
    <Section
      id="work"
      tone="surface"
      /* 밴드 배정: Hero 검정 → **Work 흰** → 브릿지 검정 … */
      band="paper"
      className="relative"
      aria-labelledby="work-heading"
    >
      <Container className="relative">
        <Reveal>
          <SectionHeader
            eyebrow={selectedWork.eyebrow}
            heading={selectedWork.heading}
            headingId="work-heading"
            align="center"
            className="mx-auto text-center"
          />
        </Reveal>
      </Container>

      {WORK_LAYOUT === "quad" ? (
        <>
          <Reveal className="mt-14 lg:mt-16">
            {/*
              전폭 4분할. `gap-px` 의 틈으로 그리드 배경(연한 회색 헤어라인 토큰)이 비쳐
              칸 사이 경계선이 된다 — 색은 밴드 토큰 `--color-line` 이라 팔레트를 따라간다.
            */}
            <div className="work-quad grid w-full grid-cols-2 gap-px border-y border-line bg-line lg:grid-cols-4">
              {items.map((project) => (
                <ProjectQuadCard key={project.slug} project={project} />
              ))}
              <WorkQuadPlaceholder
                title={selectedWork.placeholderCell.title}
                note={selectedWork.placeholderCell.note}
              />
            </div>
          </Reveal>
          {/* 프로젝트 모달 — 카드 클릭·해시 딥링크를 받아 이 안에서 상세를 연다 (원페이지 동선) */}
          <ProjectModal />
        </>
      ) : (
        <Container className="relative">
          <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3 lg:gap-x-9">
            {/* 좌 카드는 왼쪽에서, 우 카드는 오른쪽에서, 가운데는 기본(위로). 0/120/240ms 계단식 */}
            {items.map((project, index) => {
              const tilt = TILTS[index % 3];
              return (
                <Reveal
                  key={project.slug}
                  delay={(index % 3) * 120}
                  className={
                    tilt === "left" ? "reveal-left" : tilt === "right" ? "reveal-right" : undefined
                  }
                >
                  <ProjectCard project={project} tilt={tilt} compact />
                </Reveal>
              );
            })}
          </div>

          <ProjectModal />
        </Container>
      )}
    </Section>
  );
}
