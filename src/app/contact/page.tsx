import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/ui/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { contactPage, site } from "@/content/site";
import { revealDelay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "현재 상황과 목표를 들려주세요. 필요한 것과 하지 않아도 될 것을 함께 정리하겠습니다.",
  alternates: { canonical: "/contact" },
};

/**
 * /contact — 문의 전용 페이지 (문서 §7.8, §8.13, Phase 2)
 * 메인의 Final CTA는 다크 섹션이므로, 이 페이지는 밝은 배경(canvas) + 흰 폼 패널로 구성한다.
 * (문서 §6.4: 어두운 배경 섹션은 페이지당 1-2개로 제한)
 */
export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="page-enter bg-canvas pt-[68px] lg:pt-20">
        <Container>
          <div className="grid gap-14 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="eyebrow reveal-load text-indigo">{contactPage.eyebrow}</p>
              <h1
                className="text-h1 reveal-load mt-4 whitespace-pre-line"
                style={revealDelay("0.08s")}
              >
                {contactPage.heading}
              </h1>
              <p
                className="text-body-l reveal-load mt-6 max-w-[480px] whitespace-pre-line text-ink-secondary"
                style={revealDelay("0.16s")}
              >
                {contactPage.description}
              </p>

              <ul
                className="reveal-load mt-10 border-t border-line"
                style={revealDelay("0.22s")}
              >
                {contactPage.guide.map((item) => (
                  <li
                    key={item}
                    className="text-body-m border-b border-line py-4 text-ink-secondary"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              {/* 이메일: 2026-08-08 사용자 확정 — 아래 위치(Busan, Korea)와 동일한 caption 크기, 밑줄 없음 */}
              <div className="mt-10">
                {site.email ? (
                  <a
                    href={`mailto:${site.email}`}
                    className="text-caption text-ink-secondary hover:text-ink"
                  >
                    {site.email}
                  </a>
                ) : (
                  // TODO(미확정): 공식 이메일 확정 후 content/site.ts의 email에 입력
                  <p className="text-body-m text-ink-secondary">
                    {contactPage.emailPendingNote}
                  </p>
                )}
                <p className="text-caption mt-2 text-ink-secondary">{site.location}</p>
              </div>
            </div>

            <Reveal delay={120} className="lg:col-span-7">
              <div className="rounded-l border border-line">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
