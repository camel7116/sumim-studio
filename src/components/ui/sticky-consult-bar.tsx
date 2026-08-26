"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, stickyConsultBar } from "@/content/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

/**
 * 하단 고정 상담 바 (2026-08-20 3차 — 수능선배 레퍼런스 패턴)
 *
 * 화면 하단에 흰 바가 붙어 "남은 티오 한 줄 + 바로 연결되는 두 버튼"을 계속 들고 다닌다.
 * 문구·수치는 전부 `site.ts` 의 `stickyConsultBar`(= `availability` 파생)에서 온다 —
 * 🚨 이 파일에 숫자를 직접 적지 않는다. 과장·긴박 문구도 넣지 않는다(사용자 지시).
 *
 * 노출 규칙
 * - **1024px 이상에서만** 렌더한다. 그 미만은 기존 `MobileStickyCta` 가 맡는다
 *   (둘이 겹치지 않도록 이쪽은 `hidden lg:flex`).
 * - 뷰포트 **1개 높이**를 넘게 스크롤하면 등장 (히어로 첫 화면에서는 나오지 않는다).
 * - `#contact` 섹션이 화면에 들어오면 숨긴다 (같은 버튼이 두 벌 보이지 않게).
 * - 폼 입력 중에도 숨긴다 — 하단 입력칸을 가리지 않게.
 * - 슬라이드 300ms, `prefers-reduced-motion` 이면 전환 없음.
 * - `/contact`, `/thanks` 에서는 렌더하지 않는다.
 *
 * ⚠️ 우하단 플로팅 3단(옛 ScrollProgress)을 이 바가 대체한다 — 2026-08-21 정리 패스에서
 *    그 코드는 아카이브로 갔다.
 */

/** 바 높이 + 안전영역 — 보일 때만 본문 하단 여백을 만든다 */
const BAR_HEIGHT = "calc(72px + env(safe-area-inset-bottom))";

/** 문의 화면 자체에서는 노출하지 않는다 */
const EXCLUDED_PATHS = ["/contact", "/thanks"];

/** 이 바가 렌더되는 최소 폭 — Tailwind lg 와 같은 값 */
const MIN_WIDTH = 1024;

export function StickyConsultBar() {
  const pathname = usePathname();
  const excluded = EXCLUDED_PATHS.includes(pathname);
  const off = excluded;

  const [scrolled, setScrolled] = useState(false);
  const [wide, setWide] = useState(false);
  /** #contact 가 보이는 경로를 담아 두면 다른 페이지로 이동할 때 값이 자동 무효화된다 */
  const [contactInViewPath, setContactInViewPath] = useState<string | null>(null);
  const [formFocused, setFormFocused] = useState(false);

  const visible =
    !off && wide && scrolled && contactInViewPath !== pathname && !formFocused;

  // 스크롤 > 뷰포트 1개 + 폭 감시
  useEffect(() => {
    if (off) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > window.innerHeight);
      setWide(window.innerWidth >= MIN_WIDTH);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [off]);

  // #contact 섹션이 보이면 숨긴다
  useEffect(() => {
    if (off) return;
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
  }, [off, pathname]);

  // 폼 입력 중에는 입력 필드를 가리지 않도록 숨긴다 (MobileStickyCta 와 같은 규칙)
  useEffect(() => {
    if (off) return;

    const isFormField = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

    const onFocusIn = (event: FocusEvent) => {
      if (isFormField(event.target)) setFormFocused(true);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!isFormField(event.relatedTarget)) setFormFocused(false);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [off]);

  // 보일 때만 하단 여백 확보 (푸터가 바에 가리지 않게)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--consult-bar-h", visible ? BAR_HEIGHT : "0px");
    return () => {
      root.style.removeProperty("--consult-bar-h");
    };
  }, [visible]);

  if (off) return null;

  const { badge, message, highlight, phoneCta, kakaoCta } = stickyConsultBar;
  const telHref = site.phone ? `tel:${site.phone.replace(/\D/g, "")}` : null;
  /*
    채움 버튼 = **카카오톡 채널** (2026-08-21 사용자 지시 — 네비 "프로젝트 문의"와 중복 해소).
    `site.chatbotUrl` 이 비면 예전처럼 문의 폼으로 폴백한다(메인은 해시, 서브는 /contact).
  */
  const kakaoExternal = Boolean(site.chatbotUrl);
  const kakaoHref =
    site.chatbotUrl ?? (pathname === "/" ? kakaoCta.fallbackHref : "/contact");
  // highlight 구절만 주황으로 (없으면 원문 그대로)
  const [before, ...rest] = message.split(highlight);

  return (
    <div
      className={cn(
        "sticky-consult-bar fixed inset-x-0 bottom-0 z-45 hidden lg:flex",
        "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        visible ? "translate-y-0" : "invisible translate-y-full",
      )}
    >
      {/* 좌우 정렬은 Container(최대 1280px · lg 패딩 40px)와 같은 값으로 맞춘다 */}
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-10 py-3.5">
        <span className="trade-badge shrink-0">{badge}</span>
        <p className="text-[15px] leading-snug font-medium text-[#141a26]">
          {rest.length > 0 ? (
            <>
              {before}
              <strong className="font-bold text-cta">{highlight}</strong>
              {rest.join(highlight)}
            </>
          ) : (
            message
          )}
        </p>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {telHref ? (
            <a
              href={telHref}
              className="flex h-11 items-center gap-2 rounded-[10px] border border-[#c6ccd8] px-5 text-[15px] font-semibold text-[#141a26] transition-colors duration-[200ms] hover:border-cta hover:text-cta"
            >
              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.12.37 2.33.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.26.2 2.47.57 3.6a1 1 0 0 1-.25 1z" />
              </svg>
              {phoneCta.label}
            </a>
          ) : null}
          <a
            href={kakaoHref}
            target={kakaoExternal ? "_blank" : undefined}
            rel={kakaoExternal ? "noopener noreferrer" : undefined}
            onClick={() => trackEvent("contact_start")}
            /*
              🚨 **카카오 브랜드색 고정** (2026-08-21 사용자 확정 "카카오톡 상담 버튼은 항상
              카카오톡 색상으로 고정"). 색은 globals 의 `.btn-kakao` 한 곳에 있고
              **액센트 토큰을 쓰지 않으므로** 팔레트·colorLab 전환과 무관하게 불변이다.
              흰 바 위에서 옐로 면이 배경과 1.33:1 이라 경계가 흐려지는 건 그 클래스의
              **옅은 보더(검정 8%)** 한 겹이 잡는다(직전의 액센트 채움안은 이 지시로 뒤집혔다).
            */
            className="btn-kakao flex h-11 items-center gap-2 rounded-[10px] border px-6 text-[15px] font-semibold transition-colors duration-[200ms]"
          >
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c5.5 0 10 3.4 10 7.7 0 4.2-4.5 7.6-10 7.6-.8 0-1.6-.1-2.4-.2-1.9 1.3-4.1 1.8-5.9 1.9.9-1.1 1.5-2.3 1.7-3.5C3.3 15.1 2 13 2 10.7 2 6.4 6.5 3 12 3z" />
            </svg>
            {kakaoCta.label}
          </a>
        </div>
      </div>
    </div>
  );
}
