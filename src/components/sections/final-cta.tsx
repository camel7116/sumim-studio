import { contactPage, finalCta, giantSectionLabels, site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/ui/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { GiantHeading, MaskLines } from "@/components/ui/section-header";
import { BrandGlyph, glyphForIndex } from "@/components/ui/brand-glyphs";

/**
 * Final CTA + 상담 폼 (문서 §8.13, §7.8)
 * 어두운 배경(전체 페이지에서 유일한 다크 섹션) + White 텍스트.
 *
 * 🚨 2026-08-21 정리 패스: 배경 장식(막대그래프 파티클 → 점 스카이라인 → 정적 와이어프레임
 *    `city-skyline.tsx`)과 가독성 스크림(`.cta-scrim`)을 걷어냈다 — 장식을 끈 뒤로는
 *    스크림도 덮을 것이 없었다. 스냅샷은 `_archive/particle-shell-2026-08-21/`.
 */
/**
 * "예약 없이 바로" 빠른 상담 2버튼 (2026-08-20 — 수능선배 레퍼런스 패턴).
 * 폼을 채우기 전에 **지금 바로 연결되는 길**을 먼저 보여준다.
 * - 전화: site.phone 이 있을 때만 tel: 링크. 없으면 이 버튼을 렌더하지 않는다.
 * - 카톡: **카카오톡 채널**(`site.chatbotUrl` — 2026-08-21 확정) 을 새 탭으로 연다.
 *   하단 고정 상담 바의 "카카오톡 상담" 버튼과 **같은 목적지**다.
 *   그 값이 null 로 되돌아가면 이 버튼은 이 섹션 자기 자신(#contact)을 가리킨다.
 */
function QuickContact() {
  const { label, phone, kakao } = finalCta.quickContact;
  const telHref = site.phone ? `tel:${site.phone.replace(/\D/g, "")}` : null;
  const kakaoHref = site.chatbotUrl ?? "#contact";

  const cardClass =
    "flex flex-1 items-center gap-3.5 rounded-l border px-5 py-4 transition duration-[220ms] ease-out";

  return (
    <div className="mt-10">
      {/* .eyebrow 는 자간 0.14em + uppercase 라 한글에서 글자가 흩어진다 → 한글용 라벨로 */}
      <p className="text-label font-bold tracking-[0.01em] text-cta">{label}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {telHref ? (
          <a
            href={telHref}
            className={`${cardClass} border-cta bg-cta text-white hover:-translate-y-0.5 hover:bg-[#F0650F]`}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.12.37 2.33.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.26.2 2.47.57 3.6a1 1 0 0 1-.25 1z" />
            </svg>
            <span>
              <span className="block text-[15px] leading-tight font-semibold">{phone.title}</span>
              <span className="block text-[13px] leading-tight text-white/80">{phone.note}</span>
            </span>
          </a>
        ) : null}
        <a
          href={kakaoHref}
          target={site.chatbotUrl ? "_blank" : undefined}
          rel={site.chatbotUrl ? "noopener noreferrer" : undefined}
          /* 카카오 브랜드색 고정 (2026-08-21 사용자 확정) — globals `.btn-kakao`, 액센트 토큰 미사용 */
          className={`${cardClass} btn-kakao hover:-translate-y-0.5`}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M12 3c5.5 0 10 3.4 10 7.7 0 4.2-4.5 7.6-10 7.6-.8 0-1.6-.1-2.4-.2-1.9 1.3-4.1 1.8-5.9 1.9.9-1.1 1.5-2.3 1.7-3.5C3.3 15.1 2 13 2 10.7 2 6.4 6.5 3 12 3z" />
          </svg>
          <span>
            <span className="block text-[15px] leading-tight font-semibold">{kakao.title}</span>
            <span className="kakao-note block text-[13px] leading-tight">{kakao.note}</span>
          </span>
        </a>
      </div>
    </div>
  );
}

export function FinalCta() {
  return (
    <Section
      id="contact"
      tone="dark"
      band="void"
      className="relative"
      aria-labelledby="contact-heading"
    >
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="relative isolate lg:col-span-5">
            <Reveal>
              {/* 🆕 거대 영문 타이포 (2026-08-31). 이 섹션에는 원래 eyebrow 가 없어
                  숨길 것이 없고, 검정 밴드라 글자색은 밴드 토큰이 흰색으로 뒤집는다 */}
              <GiantHeading className="mb-5">{giantSectionLabels.contact}</GiantHeading>
              {/* 줄 단위 마스크 리빌 — 다크 섹션 진입을 또렷하게 (문서 §11.3) */}
              {/* 2026-08-19: 뒤에 건물 스카이라인이 서면서 두 번째 줄이 겹친다 → 후광 */}
              {/* 🆕 헤딩 옆 브랜드 도형 — 섹션 순환 index 6 → 파도.
                  `items-start` 라 여러 줄 헤딩의 **첫 줄 옆**에 선다 */}
              <div className="flex items-start gap-4">
                <h2 id="contact-heading" className="text-h1 mask-reveal">
                  <MaskLines text={finalCta.heading} />
                </h2>
                <BrandGlyph
                  name={glyphForIndex(6)}
                  size={34}
                  className="mt-2 text-cta"
                />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-body-l mt-8 max-w-[480px] whitespace-pre-line text-white/70">
                {finalCta.description}
              </p>
            </Reveal>
            {/*
              안내 리스트보다 **먼저** "예약 없이 바로" 2버튼.
              폼을 채우기 전에 지금 연결되는 길이 보여야 한다 (수능선배 패턴).
            */}
            <Reveal delay={140}>
              <QuickContact />
            </Reveal>
            {/* 상담 부담을 낮추는 안내 3줄 — /contact와 동일 문구 (2026-08-03 사용자 요청) */}
            <Reveal delay={160}>
              <ul className="mt-10 border-t border-white/20">
                {contactPage.guide.map((item) => (
                  <li
                    key={item}
                    className="text-body-m border-b border-white/15 py-4 text-white/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            {/* 2026-08-23: 중복(푸터에도 있음)이라 한 번 뺐다가 **사용자 지시로 복구** — CTA 섹션은 원래대로 */}
            <Reveal delay={200}>
              <div className="mt-10">
                {site.email ? (
                  // 2026-08-08 사용자 확정: 위 안내 문구와 동일 크기(body-m), 밑줄 없음
                  <a
                    href={`mailto:${site.email}`}
                    className="text-body-m text-white/70 hover:text-white"
                  >
                    {site.email}
                  </a>
                ) : (
                  // TODO(미확정): 공식 이메일 확정 후 content/site.ts에 입력
                  <p className="text-body-m text-white/60">
                    이메일 주소는 준비 중입니다. 아래 폼으로 문의해 주세요.
                  </p>
                )}
                {/* TODO(미확정): 응답 예상 시간은 실제 운영 기준 확정 시에만 표기 (문서 §8.13) */}
              </div>
            </Reveal>
          </div>
          {/* 폼 패널은 스케일 인으로 진입 (문서 §11.2 ease 토큰, scale 0.97 → 1) */}
          <Reveal delay={120} className="reveal-scale lg:col-span-7">
            {/*
              폼 안내 문구.
              🚨 시간 약속("24시간 내" 등)은 넣지 않는다 — 팀 확정 전까지는 표시광고 리스크다.
              문구는 site.ts 의 finalCta.formNote (TODO 주석 포함).
            */}
            <p className="text-body-m mb-4 text-ink-secondary">{finalCta.formNote}</p>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
