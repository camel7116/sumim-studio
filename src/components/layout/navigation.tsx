"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { navigation } from "@/content/site";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * 네비게이션 (문서 §7.1, §8.1)
 * - Desktop 80px / Mobile 68px, 스크롤 후 반투명 White + blur + 하단 선
 * - 모바일: 전체 화면 메뉴, 스크롤 잠금, ESC 닫기, 포커스 트랩
 *
 * 로고: 공식 로고가 타이포 워드마크(볼드 SUMIM + 미디엄 그레이 Studio)로 확정되어(2026-08-02)
 * 아래 텍스트 워드마크가 곧 공식 로고다. SVG 원본 확보 시 이미지 교체를 검토한다.
 */
export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /**
   * 🚨 **원페이지 메뉴** (2026-08-21 사용자: "자사 홈피는 임팩트 있게 원페이지로.
   * 서비스 부분 넘어가는 건 없애고 싶어").
   *
   * 메뉴는 서브 페이지가 아니라 **메인 섹션 앵커**로 간다.
   * - 메인(`/`)에서는 순수 해시(`#work`) — 라우팅 없이 그 자리에서 스크롤한다
   *   (globals 의 `scroll-behavior: smooth` + `Section` 의 `scroll-mt-20` 이 이미 깔려 있고,
   *    `prefers-reduced-motion` 이면 globals 가 `auto` 로 되돌린다).
   * - `/privacy` 같은 다른 경로에서는 `/#work` — 메인으로 돌아간 뒤 그 섹션으로 간다.
   */
  const { menu, cta } = useMemo(() => {
    const prefix = pathname === "/" ? "" : "/";
    const withPrefix = (href: string) => (href.startsWith("#") ? prefix + href : href);
    return {
      menu: navigation.menu.map((item) => ({ ...item, href: withPrefix(item.href) })),
      cta: { ...navigation.cta, href: withPrefix(navigation.cta.href) },
    };
  }, [pathname]);
  /**
   * 네비 아래에 깔린 밴드 (2026-08-19)
   * 밝은 밴드(paper·mist) 위에서는 바를 밝게, 검정 밴드 위에서는 어둡게 뒤집는다.
   * 밴드가 없는 서브 페이지는 "dark" — 지금 모습 그대로 둔다.
   */
  const [band, setBand] = useState<"light" | "dark">("dark");
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;

    /*
      스크롤 상태와 밴드 감지를 **리스너 하나**에서 rAF 로 묶어 처리한다.
      밴드 판정 기준점은 네비 세로 중앙(navH/2) — 바가 걸쳐 있는 밴드를 따른다.
      [data-band] 요소들은 sticky/transform 없는 일반 흐름이라 rect 비교로 충분하고,
      DOM 순서상 뒤에 오는 것이 우선하도록 끝까지 훑는다(경계에서 다음 섹션 채택).
    */
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);

      const navH = headerRef.current?.offsetHeight ?? 68;
      const probeY = navH / 2;
      let next: "light" | "dark" = "dark";
      for (const el of document.querySelectorAll<HTMLElement>("[data-band]")) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          const value = el.dataset.band;
          next = value === "paper" || value === "mist" ? "light" : "dark";
        }
      }
      setBand(next);
    };

    const schedule = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (raf !== 0) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    // 메뉴 열림 시 스크롤 잠금
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      // 포커스 트랩: 헤더(토글 버튼 + 패널) 내부에서만 순환
      if (event.key === "Tab" && headerRef.current) {
        const focusables = headerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const solid = scrolled || open;
  /**
   * 스크롤 전(바가 투명할 때)에는 메뉴 글자를 반 톤 밝게 둔다.
   *
   * 2026-08-21 정리 패스 전에는 `overPhoto` prop(사옥 사진 히어로용)이 이 역할을 했는데,
   * 히어로에서 사진이 빠진 뒤에도 값이 계속 true 로 넘어와 **사실상 "스크롤 전"과 같은 뜻**이었다.
   * prop 을 없애고 조건을 그대로 남겨 **화면은 그대로**(실측 동일) 두면서 축을 하나 줄였다.
   * 로고·부제는 밴드 반전 토큰(globals `.site-nav[data-nav-band="dark"]`)이 이미 같은 값을 준다.
   */
  const onTransparentBar = !solid;

  return (
    <header
      ref={headerRef}
      /*
        data-nav-band: 다크 셸에서 아래 밴드에 맞춰 바를 반전시키는 훅 (globals.css).
        **여기에 data-band 를 쓰면 안 된다** — globals의 [data-band] 규칙이
        position:relative + ::before 배경을 강제해서 fixed 네비가 깨진다.
        모바일 메뉴가 열려 있으면 패널이 어두운 bg-surface 라 강제로 dark 를 유지한다.
      */
      data-nav-band={open ? "dark" : band}
      // site-nav 클래스는 다크 셸에서 스크롤 후 배경(bg-white/85)을 뒤집기 위한 훅이다
      className={cn(
        "site-nav fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-300",
        solid
          ? "border-b border-line bg-white/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-[68px] items-center justify-between lg:h-20">
        <Link
          href="/"
          className={cn(
            "text-[17px] font-bold tracking-[0.02em] transition-colors duration-300",
            onTransparentBar ? "text-white" : "text-ink",
          )}
          onClick={() => setOpen(false)}
        >
          SUMIM
          <span
            className={cn(
              "font-medium transition-colors duration-300",
              onTransparentBar ? "text-white/75" : "text-ink-secondary",
            )}
          >
            {" "}
            Studio
          </span>
        </Link>

        {/* Desktop menu */}
        <nav aria-label="주요 메뉴" className="hidden items-center gap-8 lg:flex">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[15px] font-medium transition-colors duration-200",
                onTransparentBar
                  ? "text-white/85 hover:text-white"
                  : "text-ink-secondary hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            className="inline-flex h-11 items-center rounded-[6px] bg-cta px-5 text-[14px] font-semibold text-white transition duration-[220ms] hover:-translate-y-0.5 hover:bg-[#F0650F]"
          >
            {cta.label}
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full lg:hidden",
            onTransparentBar && "text-white",
          )}
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22">
            {open ? (
              <path
                d="M4 4l14 14M18 4L4 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6.5h16M3 11h16M3 15.5h16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </Container>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute top-full inset-x-0 h-[calc(100svh-68px)] overflow-y-auto bg-surface shadow-soft lg:hidden"
      >
        <nav aria-label="모바일 메뉴">
          <Container className="flex flex-col py-8">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-5 text-h3 font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="mt-8 btn-arrow inline-flex h-13 items-center justify-center rounded-[6px] bg-cta px-6 text-[15px] font-semibold text-white"
            >
              {cta.label}
            </Link>
          </Container>
        </nav>
      </div>
    </header>
  );
}
