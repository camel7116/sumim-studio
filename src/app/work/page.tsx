import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { projects, workPage } from "@/content/projects";
import { revealDelay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Work",
  description:
    "스밈 스튜디오가 진행한 프로젝트를 문제, 핵심 결정, 구축 범위 중심으로 정리합니다.",
  alternates: { canonical: "/work" },
};

/**
 * /work — 프로젝트 목록 (문서 §8.8, Phase 2)
 * 첫 프로젝트는 전체 폭, 나머지는 2열 (메인 Selected Work와 동일한 패턴).
 * 페이지 헤더는 CSS 전용 reveal-load를 써서 h1이 JS 하이드레이션을 기다리지 않게 한다.
 */
export default function WorkPage() {
  const [first, ...rest] = projects;

  return (
    <>
      <Navigation />
      <main id="main" className="page-enter bg-surface pt-[68px] lg:pt-20">
        <Container>
          <header className="border-b border-line py-16 md:py-24">
            <p className="eyebrow reveal-load text-indigo">{workPage.eyebrow}</p>
            <h1
              className="text-h1 reveal-load mt-4 max-w-[820px] whitespace-pre-line"
              style={revealDelay("0.08s")}
            >
              {workPage.heading}
            </h1>
            <p
              className="text-body-l reveal-load mt-6 max-w-[620px] whitespace-pre-line text-ink-secondary"
              style={revealDelay("0.16s")}
            >
              {workPage.description}
            </p>
          </header>

          <div className="space-y-16 py-16 md:space-y-20 md:py-24">
            {first ? (
              <Reveal>
                <ProjectCard project={first} featured />
              </Reveal>
            ) : null}
            {rest.length > 0 ? (
              <div className="grid gap-14 md:grid-cols-2 md:gap-10">
                {rest.map((project, index) => (
                  <Reveal key={project.slug} delay={index * 120}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>

          <div className="border-t border-line py-14 md:py-20">
            {/* TODO(미확정): 프로젝트 공개 범위 확정 후 안내 문구 갱신 (content/projects.ts) */}
            <p className="text-body-m max-w-[620px] text-ink-secondary">{workPage.note}</p>
            <div className="mt-8">
              <TrackedLink
                event="service_interest"
                href={workPage.cta.href}
                className={buttonClasses("primary")}
              >
                {workPage.cta.label}
              </TrackedLink>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
