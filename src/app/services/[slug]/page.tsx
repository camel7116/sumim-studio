import type { Metadata } from "next";
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
import { serviceAxes, serviceDetail } from "@/content/services";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { revealDelay } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** 4축 모두 빌드 타임에 정적 생성. 목록에 없는 slug는 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceAxes.map((axis) => ({ slug: axis.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const axis = serviceAxes.find((item) => item.slug === slug);
  if (!axis) return {};

  return {
    title: `${axis.title} — ${axis.titleKo}`,
    description: axis.tagline,
    alternates: { canonical: `/services/${axis.slug}` },
  };
}

/**
 * /services/[slug] — 서비스 축 상세 (문서 §7.6, Phase 2)
 * 기능 나열이 아니라 고객이 얻는 변화를 함께 보여준다.
 * 가격·기간은 확정 전이므로 언급하지 않는다.
 */
export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const axis = serviceAxes.find((item) => item.slug === slug);

  if (!axis) {
    notFound();
  }

  const others = serviceAxes.filter((item) => item.slug !== axis.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: serviceDetail.breadcrumbRoot.label, path: "/services" },
              { name: axis.title, path: `/services/${axis.slug}` },
            ]),
          ),
        }}
      />
      <Navigation />
      <main id="main" className="page-enter bg-canvas pt-[68px] lg:pt-20">
        <Container>
          {/* 헤더/본문 패딩이 위아래로 중복되지 않도록 구분선 기준 상·하 여백을 따로 지정한다. */}
          <header className="border-b border-line pt-12 pb-10 md:pt-16 md:pb-12">
            <Breadcrumb
              items={[
                {
                  label: serviceDetail.breadcrumbRoot.label,
                  href: serviceDetail.breadcrumbRoot.href,
                },
                { label: axis.title },
              ]}
              className="reveal-load"
            />
            <p
              className="text-label reveal-load mt-10 tracking-[0.06em] text-indigo"
              style={revealDelay("0.04s")}
            >
              {axis.number} · {axis.titleKo}
            </p>
            <h1
              className="text-h1 reveal-load mt-3 max-w-[820px]"
              style={revealDelay("0.08s")}
            >
              {axis.title}
            </h1>
            <p
              className="text-body-l reveal-load mt-6 max-w-[680px] text-ink"
              style={revealDelay("0.14s")}
            >
              {axis.tagline}
            </p>
          </header>

          <div className="pt-14 pb-16 md:pt-16 md:pb-24">
            <Reveal>
              <p className="text-body-l max-w-[680px] text-ink-secondary">
                {axis.description}
              </p>
            </Reveal>

            <Reveal>
              <section aria-labelledby="includes-heading" className="mt-16 md:mt-20">
                <h2 id="includes-heading" className="text-h2">
                  {serviceDetail.includesHeading}
                </h2>
                <ul className="mt-8 max-w-[760px] border-t border-line">
                  {axis.includes.map((item) => (
                    <li
                      key={item}
                      className="text-body-m border-b border-line py-4 text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section
                aria-labelledby="outcome-heading"
                className="mt-16 border-l-2 border-indigo pl-6 md:mt-20 md:pl-8"
              >
                <p className="eyebrow text-indigo">{serviceDetail.outcomeEyebrow}</p>
                <h2 id="outcome-heading" className="text-h3 mt-3">
                  {serviceDetail.outcomeHeading}
                </h2>
                <p className="text-body-l mt-4 max-w-[680px] text-ink">{axis.outcome}</p>
              </section>
            </Reveal>

            <Reveal>
              <section aria-labelledby="others-heading" className="mt-16 md:mt-24">
                <h2 id="others-heading" className="text-h2">
                  {serviceDetail.othersHeading}
                </h2>
                <ul className="mt-8 border-t border-line">
                  {others.map((other) => (
                    <li key={other.slug} className="border-b border-line">
                      <TrackedLink
                        event="service_interest"
                        href={`/services/${other.slug}`}
                        className="group text-link-group flex flex-wrap items-baseline gap-x-6 gap-y-1 py-6"
                      >
                        <span className="text-label text-indigo">{other.number}</span>
                        <span className="text-h3 flex items-center gap-2 transition-colors duration-200 group-hover:text-indigo">
                          {/* 텍스트 링크 (문서 §7.2): 밑줄 + 화살표 이동 */}
                          <span className="text-link-label">{other.title}</span>
                          <TextLinkArrow />
                        </span>
                        <span className="text-body-m text-ink-secondary">
                          {other.tagline}
                        </span>
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <div className="mt-16 border-t border-line pt-10 md:mt-20">
                {/* TODO(미확정): 가격·기간 정책 확정 전까지 단정하지 않는다. (문서 §15.2-12) */}
                <p className="text-body-m max-w-[620px] text-ink-secondary">
                  {serviceDetail.note}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <TrackedLink
                    event="service_interest"
                    href={serviceDetail.cta.href}
                    className={buttonClasses("primary")}
                  >
                    {serviceDetail.cta.label}
                  </TrackedLink>
                  <Link href="/services" className={buttonClasses("secondary")}>
                    전체 서비스 보기
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
