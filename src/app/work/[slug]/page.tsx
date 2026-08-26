import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Reveal } from "@/components/ui/reveal";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { TextLinkArrow } from "@/components/ui/text-link";
import { SitePreview } from "@/components/ui/site-preview";
import { projectDetail, projects } from "@/content/projects";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { revealDelay } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** 3건 모두 빌드 타임에 정적 생성. 목록에 없는 slug는 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: `${project.name} · ${project.category}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

/**
 * /work/[slug] — 프로젝트 상세 (문서 §7.4, §8.8, Phase 2)
 * - 결과 수치는 resultVerified === true인 경우에만 렌더한다.
 * - 플레이스홀더 프로젝트임을 화면 상단에서 명확히 알린다.
 * - 상단 헤더는 CSS 전용 reveal-load 사용 (h1이 JS를 기다리지 않도록).
 */
export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];

  if (!project) {
    notFound();
  }

  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  const breadcrumbItems = [
    { label: projectDetail.breadcrumbRoot.label, href: projectDetail.breadcrumbRoot.href },
    { label: `${project.name} (${project.category})` },
  ];

  const overviewRows = [
    { label: projectDetail.overviewLabels.industry, value: project.industry },
    { label: projectDetail.overviewLabels.services, value: project.services.join(" · ") },
    { label: projectDetail.overviewLabels.category, value: project.category },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: projectDetail.breadcrumbRoot.label, path: "/work" },
              {
                name: `${project.name} (${project.category})`,
                path: `/work/${project.slug}`,
              },
            ]),
          ),
        }}
      />
      <Navigation />
      <main id="main" className="page-enter bg-surface pt-[68px] lg:pt-20">
        <Container>
          <header className="py-12 md:py-16">
            <Breadcrumb items={breadcrumbItems} className="reveal-load" />
            <h1
              className="text-h1 reveal-load mt-8 max-w-[820px]"
              style={revealDelay("0.06s")}
            >
              {project.name}
            </h1>
            <p
              className="text-label reveal-load mt-4 tracking-[0.06em] text-indigo"
              style={revealDelay("0.1s")}
            >
              {project.category}
            </p>
            {project.overview ? (
              <p
                className="text-body-l reveal-load mt-8 max-w-[680px] text-ink-secondary"
                style={revealDelay("0.14s")}
              >
                {project.overview}
              </p>
            ) : null}

            {project.isPlaceholder ? (
              /* TODO(미확정): 실제 프로젝트 정보 확정 시 isPlaceholder를 false로 바꾸면 이 안내가 사라진다. */
              <p
                className="text-caption reveal-load mt-8 max-w-[620px] border-l-2 border-line-strong py-1 pl-4 text-ink-secondary"
                style={revealDelay("0.18s")}
              >
                {projectDetail.placeholderNotice}
              </p>
            ) : null}
          </header>

          {/*
            커버는 above-the-fold이자 LCP 후보이므로 IO(JS) 기반이 아니라
            CSS 전용 클립 리빌(.clip-reveal-load)을 쓴다. (문서 §11.3, 0.8s)
          */}
          <div
            className="clip-reveal-load overflow-hidden rounded-l border border-line bg-surface-subtle"
            style={revealDelay("0.22s")}
          >
            <div className="clip-zoom">
              <Image
                src={project.coverImage}
                alt={
                  project.isPlaceholder
                    ? "프로젝트 커버 이미지 자리 (실제 이미지로 교체 예정)"
                    : `${project.name} 프로젝트 커버`
                }
                width={1600}
                height={1200}
                sizes="(max-width: 1279px) 100vw, 1200px"
                priority
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* 개요 행: 1px 선으로만 구분 (카드 사용하지 않음) */}
          <dl className="mt-14 grid border-t border-line sm:grid-cols-3">
            {overviewRows.map((row) => (
              <div key={row.label} className="border-b border-line py-6 sm:pr-8">
                <dt className="eyebrow text-ink-secondary">{row.label}</dt>
                <dd className="text-body-m mt-2 text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 md:mt-24">
            {/* 실제 화면 — 시안을 iframe으로 그대로 불러와 기기별(반응형) 확인 (2026-08-12 사용자 요청) */}
            {project.embedSrc || project.fullImage ? (
              <Reveal>
                <section className="border-t border-line py-10 md:py-14">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="text-h3">{projectDetail.sections.fullPage}</h2>
                    <p className="text-caption text-ink-secondary">
                      {projectDetail.fullPageHint}
                    </p>
                  </div>
                  {project.embedSrc ? (
                    <SitePreview
                      src={project.embedSrc}
                      title={`${project.name} 홈페이지 미리보기`}
                      className="mt-6"
                    />
                  ) : project.fullImage ? (
                    <div className="mt-6 max-h-[560px] overflow-y-auto overscroll-contain rounded-l border border-line bg-surface-subtle shadow-soft md:max-h-[720px]">
                      <Image
                        src={project.fullImage.src}
                        alt={`${project.name} 홈페이지 전체 화면`}
                        width={project.fullImage.width}
                        height={project.fullImage.height}
                        sizes="(max-width: 1279px) 100vw, 1200px"
                        className="h-auto w-full"
                      />
                    </div>
                  ) : null}
                </section>
              </Reveal>
            ) : null}

            {project.problem ? (
              <Reveal>
                <section className="border-t border-line py-10 md:grid md:grid-cols-12 md:gap-10 md:py-14">
                  <h2 className="text-h3 md:col-span-4">{projectDetail.sections.problem}</h2>
                  <p className="text-body-l mt-4 max-w-[680px] text-ink-secondary md:col-span-8 md:mt-0">
                    {project.problem}
                  </p>
                </section>
              </Reveal>
            ) : null}

            {project.solution ? (
              <Reveal>
                <section className="border-t border-line py-10 md:grid md:grid-cols-12 md:gap-10 md:py-14">
                  <h2 className="text-h3 md:col-span-4">{projectDetail.sections.solution}</h2>
                  <p className="text-body-l mt-4 max-w-[680px] text-ink-secondary md:col-span-8 md:mt-0">
                    {project.solution}
                  </p>
                </section>
              </Reveal>
            ) : null}

            {project.scope && project.scope.length > 0 ? (
              <Reveal>
                <section className="border-t border-line py-10 md:grid md:grid-cols-12 md:gap-10 md:py-14">
                  <h2 className="text-h3 md:col-span-4">{projectDetail.sections.scope}</h2>
                  <div className="mt-4 md:col-span-8 md:mt-0">
                    <ul className="max-w-[680px]">
                      {project.scope.map((item) => (
                        <li
                          key={item}
                          className="text-body-m border-b border-line py-4 text-ink first:border-t"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    {project.isPlaceholder ? (
                      <p className="text-caption mt-4 text-ink-secondary">
                        {projectDetail.scopeNote}
                      </p>
                    ) : null}
                  </div>
                </section>
              </Reveal>
            ) : null}

            {/* 결과 수치는 검증된 경우에만 노출 (문서 §7.4, §9.4) */}
            {project.resultVerified && project.result ? (
              <Reveal>
                <section className="border-t border-line py-10 md:grid md:grid-cols-12 md:gap-10 md:py-14">
                  <h2 className="text-h3 md:col-span-4">{projectDetail.sections.result}</h2>
                  <p className="text-body-l mt-4 max-w-[680px] text-indigo md:col-span-8 md:mt-0">
                    {project.result}
                  </p>
                </section>
              </Reveal>
            ) : null}
          </div>

          {previous || next ? (
            <nav
              aria-label="프로젝트 이동"
              className="mt-16 grid border-t border-line sm:grid-cols-2"
            >
              {previous ? (
                <Link
                  href={`/work/${previous.slug}`}
                  className="group text-link-group border-b border-line py-8 sm:pr-8"
                >
                  <span className="eyebrow text-ink-secondary">
                    {projectDetail.prevLabel}
                  </span>
                  <span className="text-h3 mt-2 flex items-center gap-2 transition-colors duration-200 group-hover:text-indigo">
                    <TextLinkArrow direction="back" />
                    <span className="text-link-label">{previous.name}</span>
                  </span>
                  <span className="text-caption mt-1 block text-ink-secondary">
                    {previous.category}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" className="hidden border-b border-line sm:block" />
              )}
              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="group text-link-group border-b border-line py-8 sm:border-l sm:pl-8"
                >
                  <span className="eyebrow text-ink-secondary">{projectDetail.nextLabel}</span>
                  <span className="text-h3 mt-2 flex items-center gap-2 transition-colors duration-200 group-hover:text-indigo">
                    <span className="text-link-label">{next.name}</span>
                    <TextLinkArrow />
                  </span>
                  <span className="text-caption mt-1 block text-ink-secondary">
                    {next.category}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" className="hidden border-b border-line sm:block" />
              )}
            </nav>
          ) : null}

          <div className="py-14 md:py-20">
            <div className="flex flex-wrap gap-4">
              <TrackedLink
                event="service_interest"
                href={projectDetail.cta.href}
                className={buttonClasses("primary")}
              >
                {projectDetail.cta.label}
              </TrackedLink>
              <Link href="/work" className={buttonClasses("secondary")}>
                모든 프로젝트 보기
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
