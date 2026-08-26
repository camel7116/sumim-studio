"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, stickyConsultBar } from "@/content/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

/** 바가 보일 때만 body 하단 여백을 만드는 CSS 변수 값 (바 높이 + 안전영역) */
const STICKY_HEIGHT = "calc(76px + env(safe-area-inset-bottom))";

/**
 * 바가 나타나는 스크롤 임계값.
 * 🚨 **뷰포트 1개 높이**로 바꿨다 (2026-08-22 모바일 1차) — 고정 600px 은 390×844 에서
 * 히어로가 아직 절반 남았을 때 바가 올라와 첫인상을 덮었다. 데스크톱 상담 바와 같은 규칙이다.
 */
const showAfter = () => (typeof window === "undefined" ? 600 : window.innerHeight);

/** 문의 화면 자체에서는 노출하지 않는다 */
const EXCLUDED_PATHS = ["/contact", "/thanks"];

/**
 * 모바일 하단 고정 CTA (문서 §12.2: 고정 CTA는 필요 시 하단에 제공하되 콘텐츠를 가리지 않는다)
 * - lg 미만에서만 렌더, 600px 이상 스크롤 시 slide-up(0.32s)으로 등장
 * - #contact 섹션이 보이거나 폼 입력 중일 때는 숨긴다
 * - /contact, /thanks에서는 렌더하지 않는다
 * - 보일 때만 --sticky-cta-h를 채워 body 하단 여백과 탑 버튼 위치를 보정한다
 */
export function MobileStickyCta() {
  const pathname = usePathname();
  const excluded = EXCLUDED_PATHS.includes(pathname);

  const [scrolled, setScrolled] = useState(false);
  /**
   * #contact가 화면에 보이는 경로를 저장한다.
   * 경로 자체를 담아 두면 #contact가 없는 페이지로 이동했을 때 값이 자동으로 무효화되어
   * effect 안에서 상태를 되돌릴 필요가 없다.
   */
  const [contactInViewPath, setContactInViewPath] = useState<string | null>(null);
  const [formFocused, setFormFocused] = useState(false);

  const contactInView = contactInViewPath === pathname;

  const visible = !excluded && scrolled && !contactInView && !formFocused;

  useEffect(() => {
    if (excluded) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > showAfter());
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, [excluded]);

  // 문의 영역(#contact)이 보이면 숨긴다
  useEffect(() => {
    if (excluded) return;
    const target = document.getElementById("contact");
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setContactInViewPath(entry.isIntersecting ? pathname : null);
        }
      },
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [excluded, pathname]);

  // 폼 입력 중에는 입력 필드를 가리지 않도록 숨긴다
  useEffect(() => {
    if (excluded) return;

    const isFormField = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

    const onFocusIn = (event: FocusEvent) => {
      if (isFormField(event.target)) setFormFocused(true);
    };
    // 필드 → 필드 이동에서는 바가 잠깐 나타났다 사라지지 않도록 relatedTarget을 확인한다.
    const onFocusOut = (event: FocusEvent) => {
      if (!isFormField(event.relatedTarget)) setFormFocused(false);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [excluded]);

  // 바가 보일 때만 하단 여백 확보 (globals.css의 max-width:1023px 규칙에서 사용)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sticky-cta-h", visible ? STICKY_HEIGHT : "0px");
    return () => {
      root.style.removeProperty("--sticky-cta-h");
    };
  }, [visible]);

  if (excluded) return null;

  /*
   * 🚨 **[전화] + [카카오톡] 2버튼** (2026-08-22 모바일 1차 — 팀원 클로드 권고).
   *
   * 이전에는 "프로젝트 문의하기" 한 개가 폼(`#contact`)으로 갔는데, **모바일에서는 폼보다
   * 전화·카톡이 먼저** 눌리고(사장님 타깃) 무엇보다 데스크톱 상담 바가 이미 그 두 채널을
   * 들고 다니는데 모바일만 다른 동선이라 어긋났다. 라벨·폴백은 데스크톱 바와 **같은
   * `stickyConsultBar` 를 읽는다** — 문구를 이 파일에 적지 않는다.
   *
   * 티오 문구(뱃지 + "8월 신규 프로젝트 티오가 2건")는 **넣지 않았다** — 390px 폭에서
   * 버튼 2개와 같이 두면 바 높이가 두 배가 되어 콘텐츠를 가린다(문서 §12.2). 그 수치는
   * 리뷰 섹션 스탯이 이미 전한다.
   */
  const { phoneCta, kakaoCta } = stickyConsultBar;
  const telHref = site.phone ? `tel:${site.phone.replace(/\D/g, "")}` : null;
  const kakaoExternal = Boolean(site.chatbotUrl);
  const kakaoHref =
    site.chatbotUrl ?? (pathname === "/" ? kakaoCta.fallbackHref : "/contact");

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-45 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden",
        "transition-transform duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        visible ? "translate-y-0" : "invisible translate-y-full",
      )}
    >
      <div className="flex gap-2.5 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        {telHref ? (
          <a
            href={telHref}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] border border-line-strong text-[15px] font-semibold text-ink"
          >
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.12.37 2.33.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.26.2 2.47.57 3.6a1 1 0 0 1-.25 1z" />
            </svg>
            {phoneCta.label}
          </a>
        ) : null}
        {/* 카카오 브랜드색 고정 — .btn-kakao 는 액센트 토큰을 쓰지 않아 팔레트와 무관하다 */}
        <a
          href={kakaoHref}
          target={kakaoExternal ? "_blank" : undefined}
          rel={kakaoExternal ? "noopener noreferrer" : undefined}
          onClick={() => trackEvent("contact_start")}
          className="btn-kakao flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] border text-[15px] font-semibold"
        >
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c5.5 0 10 3.4 10 7.7 0 4.2-4.5 7.6-10 7.6-.8 0-1.6-.1-2.4-.2-1.9 1.3-4.1 1.8-5.9 1.9.9-1.1 1.5-2.3 1.7-3.5C3.3 15.1 2 13 2 10.7 2 6.4 6.5 3 12 3z" />
          </svg>
          {kakaoCta.label}
        </a>
      </div>
    </div>
  );
}
