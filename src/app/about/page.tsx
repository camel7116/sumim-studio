import type { Metadata } from "next";
import Image from "next/image";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { TextLink } from "@/components/ui/text-link";
import { aboutPage, team } from "@/content/site";
import { processSteps } from "@/content/process";
import { revealDelay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "스밈 스튜디오가 브랜드를 대하는 태도와 일하는 과정을 소개합니다.",
  alternates: { canonical: "/about" },
};

/**
 * /about — 철학 · 일하는 태도 · 프로세스 · 팀 (문서 §2.1, §8.7, §8.11, Phase 2)
 * 새로운 실적·연혁·수치를 만들지 않는다. 팀 정보는 확정된 것만 노출한다.
 */
export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="page-enter bg-surface pt-[68px] lg:pt-20">
        <Container>
          <header className="py-16 md:py-24">
            <p className="eyebrow reveal-load text-indigo">{aboutPage.eyebrow}</p>
            <div className="reveal-load mt-8 h-px w-16 bg-indigo" style={revealDelay("0.06s")} />
            <h1
              className="text-display-l reveal-load mt-8 max-w-[820px] whitespace-pre-line"
              style={revealDelay("0.1s")}
            >
              {aboutPage.heading}
            </h1>
            <p
              className="text-body-l reveal-load mt-8 max-w-[680px] whitespace-pre-line text-ink-secondary"
              style={revealDelay("0.18s")}
            >
              {aboutPage.body}
            </p>
            <p
              className="text-label reveal-load mt-10 tracking-[0.06em] text-indigo"
              style={revealDelay("0.24s")}
            >
              {aboutPage.motto}
            </p>
          </header>

          <section
            aria-labelledby="principles-heading"
            className="border-t border-line py-16 md:py-24"
          >
            <Reveal>
              <p className="eyebrow text-indigo">{aboutPage.principlesEyebrow}</p>
              <h2 id="principles-heading" className="text-h1 mt-4">
                {aboutPage.principlesHeading}
              </h2>
            </Reveal>
            <ul className="mt-12 border-t border-line">
              {aboutPage.principles.map((principle, index) => (
                <li key={principle.title} className="border-b border-line">
                  <Reveal delay={index * 90}>
                    <div className="py-8 md:grid md:grid-cols-12 md:gap-10 md:py-10">
                      <h3 className="text-h3 md:col-span-5">{principle.title}</h3>
                      <p className="text-body-m mt-3 max-w-[620px] text-ink-secondary md:col-span-7 md:mt-0">
                        {principle.description}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="about-process-heading"
            className="border-t border-line py-16 md:py-24"
          >
            <Reveal>
              <p className="eyebrow text-indigo">{aboutPage.processEyebrow}</p>
              <h2
                id="about-process-heading"
                className="text-h1 mt-4 max-w-[720px] whitespace-pre-line"
              >
                {aboutPage.processHeading}
              </h2>
            </Reveal>
            <ol className="mt-12 grid md:grid-cols-2 md:gap-x-10 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <li key={step.number}>
                  <Reveal delay={(index % 4) * 80}>
                    <div className="border-t border-line py-6 md:py-8">
                      <span className="text-label text-indigo">{step.number}</span>
                      <h3 className="text-h3 mt-2">{step.title}</h3>
                      <p className="text-body-m mt-2 text-ink-secondary">
                        {step.description}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal>
              <p className="mt-10">
                {/* 텍스트 링크 (문서 §7.2) */}
                <TextLink href={aboutPage.processLink.href}>
                  {aboutPage.processLink.label}
                </TextLink>
              </p>
            </Reveal>
          </section>

          <section
            aria-labelledby="about-team-heading"
            className="border-t border-line py-16 md:py-24"
          >
            <Reveal>
              <p className="eyebrow text-indigo">{team.eyebrow}</p>
              <h2
                id="about-team-heading"
                className="text-h1 mt-4 max-w-[720px] whitespace-pre-line"
              >
                {team.heading}
              </h2>
            </Reveal>

            <div className="mt-12 grid items-start gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                {/* TODO(미확정): 실제 작업 장면 사진(차가운 색온도, 낮은 채도)으로 교체 */}
                <div className="overflow-hidden rounded-l border border-line">
                  <Image
                    src="/images/team/placeholder-work-scene.svg"
                    alt="작업 장면 사진 자리 (실제 촬영 이미지로 교체 예정)"
                    width={1200}
                    height={800}
                    sizes="(max-width: 1023px) 100vw, 720px"
                    className="h-auto w-full"
                  />
                </div>
              </Reveal>

              <div className="lg:col-span-5">
                {team.members.map((member, index) => (
                  <Reveal key={member.name} delay={index * 100}>
                    <div className="border-t border-line-strong py-8">
                      <h3 className="text-h3">{member.name}</h3>
                      <p className="text-label mt-2 tracking-[0.06em] text-indigo">
                        {member.role}
                      </p>
                      {member.intro ? (
                        <p className="text-body-m mt-3 text-ink-secondary">{member.intro}</p>
                      ) : null}
                    </div>
                  </Reveal>
                ))}
                <Reveal delay={150}>
                  {/* TODO(미확정): 팀원 확정 후 content/site.ts의 team.members에 추가 */}
                  <p className="text-caption border-t border-line pt-6 text-ink-secondary">
                    {team.note}
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <div className="border-t border-line py-14 md:py-20">
            <Reveal>
              <TrackedLink
                event="service_interest"
                href={aboutPage.cta.href}
                className={buttonClasses("primary")}
              >
                {aboutPage.cta.label}
              </TrackedLink>
            </Reveal>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
