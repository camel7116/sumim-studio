import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { TextLinkVisual } from "@/components/ui/text-link";
import {
  serviceAxes,
  servicePackages,
  serviceSystem,
  servicesPage,
} from "@/content/services";
import { revealDelay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "브랜드 전략, 웹 경험, 검색 기반, 콘텐츠 운영 네 개의 축으로 제작 범위를 설계합니다.",
  alternates: { canonical: "/services" },
};

/**
 * /services — 서비스 개요 (문서 §7.6, §8.9, Phase 2)
 * 4축 목록(1px 선) + 패키지 구성 예시. 가격·기간은 표기하지 않는다.
 */
export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="page-enter bg-canvas pt-[68px] lg:pt-20">
        <Container>
          <header className="border-b border-line py-16 md:py-24">
            <p className="eyebrow reveal-load text-indigo">{servicesPage.eyebrow}</p>
            <h1
              className="text-h1 reveal-load mt-4 max-w-[820px] whitespace-pre-line"
              style={revealDelay("0.08s")}
            >
              {serviceSystem.heading}
            </h1>
            <p
              className="text-body-l reveal-load mt-6 max-w-[620px] whitespace-pre-line text-ink-secondary"
              style={revealDelay("0.16s")}
            >
              {serviceSystem.description}
            </p>
          </header>

          <section aria-labelledby="axes-heading" className="py-16 md:py-24">
            <Reveal>
              <h2 id="axes-heading" className="text-h2 max-w-[720px]">
                {servicesPage.axesHeading}
              </h2>
              <p className="text-body-m mt-4 max-w-[620px] whitespace-pre-line text-ink-secondary">
                {servicesPage.axesDescription}
              </p>
            </Reveal>

            <ul className="mt-12 border-t border-line">
              {serviceAxes.map((axis, index) => (
                <li key={axis.slug} className="border-b border-line">
                  <Reveal delay={index * 90}>
                    <TrackedLink
                      event="service_interest"
                      href={`/services/${axis.slug}`}
                      className="group text-link-group grid gap-2 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
                    >
                      <span className="text-label text-indigo md:col-span-1">
                        {axis.number}
                      </span>
                      <h3 className="md:col-span-4">
                        <span className="text-h3 block transition-colors duration-200 group-hover:text-indigo">
                          {axis.title}
                        </span>
                        <span className="text-caption mt-1 block font-normal text-ink-secondary">
                          {axis.titleKo}
                        </span>
                      </h3>
                      <span className="text-body-m text-ink-secondary md:col-span-5">
                        {axis.tagline}
                      </span>
                      {/* 텍스트 링크 (문서 §7.2): 화살표 이동 + 밑줄 애니메이션 */}
                      <TextLinkVisual className="mt-2 md:col-span-2 md:mt-0 md:justify-self-end">
                        자세히 보기
                      </TextLinkVisual>
                    </TrackedLink>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="packages-heading"
            className="border-t border-line py-16 md:py-24"
          >
            <Reveal>
              <h2 id="packages-heading" className="text-h2 max-w-[720px]">
                {servicesPage.packagesHeading}
              </h2>
              <p className="text-body-m mt-4 max-w-[620px] whitespace-pre-line text-ink-secondary">
                {servicesPage.packagesDescription}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-x-10 md:grid-cols-3">
              {servicePackages.map((pkg, index) => (
                <Reveal key={pkg.name} delay={index * 110}>
                  <div className="border-t-2 border-ink py-8 md:py-10">
                    <h3 className="text-h3">{pkg.name}</h3>
                    <p className="text-body-m mt-2 text-ink-secondary">{pkg.tagline}</p>
                    <ul className="mt-6">
                      {pkg.includes.map((item) => (
                        <li
                          key={item}
                          className="text-body-m border-t border-line py-3 text-ink-secondary first:border-t-0"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* TODO(미확정): 가격 정책 확정 후 노출 여부 결정 (content/services.ts) */}
            <p className="text-caption mt-10 max-w-[620px] text-ink-secondary">
              {servicesPage.note}
            </p>

            <div className="mt-10">
              <TrackedLink
                event="service_interest"
                href={servicesPage.cta.href}
                className={buttonClasses("primary")}
              >
                {servicesPage.cta.label}
              </TrackedLink>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
