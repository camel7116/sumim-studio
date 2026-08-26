"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * 프로젝트 모달 (2026-08-21 — 원페이지 전환)
 *
 * 사용자: **"프로젝트 보기를 원페이지에서 확인할 방법?"**
 * banded 는 `/work/[slug]` 상세 페이지로 나가지 않으므로, 카드를 누르면 **같은 페이지 위에
 * 라이트박스**가 열려 풀페이지 캡처를 위→아래로 훑어볼 수 있게 했다. 서브 페이지 라우트는
 * **지우지 않고 보존**돼 있고 shell 은 지금도 그쪽으로 간다.
 *
 * 구조상의 선택 — **커스텀 DOM 이벤트로 느슨하게 연결한다.**
 * `SelectedWork`·`ProjectCard` 는 서버 컴포넌트라 상태를 들고 있을 수 없다. 카드는 아래
 * `ProjectCardTrigger`(작은 클라이언트 버튼)로 감싸 `sumim:open-project` 를 쏘고, 페이지에
 * 하나만 마운트된 `ProjectModal` 이 그걸 듣고 `projects` 에서 slug 로 찾아 연다.
 * (Context 를 쓰려면 서버 컴포넌트 트리를 통째로 클라이언트로 내려야 한다)
 */

const OPEN_EVENT = "sumim:open-project";
/** 해시 딥링크 접두사 — `#work-moongyul-pilates` 로 새로고침해도 그 모달이 열린다 */
const HASH_PREFIX = "#work-";

/** 카드를 감싸는 트리거. 서버 컴포넌트인 `ProjectCard` 가 banded 에서 링크 대신 이걸 쓴다 */
export function ProjectCardTrigger({
  slug,
  name,
  className,
  children,
}: {
  slug: string;
  name: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      // 카드 전체가 버튼이라 안쪽 텍스트를 스크린리더가 두 번 읽지 않게 이름을 못 박는다
      aria-label={`${name} 프로젝트 자세히 보기`}
      // 트리거 요소를 함께 실어 보낸다 — 닫을 때 포커스를 정확히 이 버튼으로 되돌리기 위해서다
      // (`document.activeElement` 는 프로그램 클릭이나 브라우저 차이로 body 일 수 있다)
      onClick={(event) =>
        window.dispatchEvent(
          new CustomEvent(OPEN_EVENT, {
            detail: { slug, trigger: event.currentTarget },
          }),
        )
      }
      className={cn("block w-full cursor-pointer text-left", className)}
    >
      {children}
    </button>
  );
}

type Tab = "desktop" | "mobile";

/** 현재 URL 해시가 가리키는 프로젝트 — 서버·해시 없음·placeholder 는 전부 null */
function slugFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const found = decodeURIComponent(hash.slice(HASH_PREFIX.length));
  return projects.some((p) => p.slug === found && !p.isPlaceholder) ? found : null;
}

/**
 * 하이드레이션 완료 판정 — 저장/해시 복원을 **effect 안 setState 없이** 처리하기 위한 장치.
 * (그 패턴은 cascading render 라 eslint `react-hooks/set-state-in-effect` 가 막는다.
 *  `ColorLab` 과 같은 방식이다.) 하이드레이션 전에는 렌더하지 않아 서버 HTML 과 어긋나지 않는다.
 */
const subscribeNoop = () => () => {};

export function ProjectModal() {
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  // 첫 진입에 `#work-<slug>` 가 있으면 그 모달을 열고 시작한다(새로고침 복원)
  const [slug, setSlug] = useState<string | null>(slugFromHash);
  const [tab, setTab] = useState<Tab>("desktop");
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  /** 닫을 때 포커스를 돌려줄 카드 버튼 */
  const triggerRef = useRef<HTMLElement | null>(null);

  const project = slug ? (projects.find((p) => p.slug === slug) ?? null) : null;

  const open = useCallback((next: string, trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    /*
     * 🚨 **모바일에서는 모바일 캡처로 열린다** (2026-08-22 모바일 1차).
     * 390px 폭에 1440px 데스크톱 풀페이지를 넣으면 글자가 3px 대라 아무것도 안 읽힌다.
     * 보는 기기와 같은 화면을 먼저 보여 주고, 토글로 데스크톱을 볼 수 있게 둔다.
     * (`lg` = 1024px, Tailwind 기준과 같은 값)
     */
    setTab(
      typeof window !== "undefined" && window.innerWidth < 1024
        ? "mobile"
        : "desktop",
    );
    setSlug(next);
  }, []);

  const close = useCallback(() => {
    setSlug(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  // 카드 클릭 수신
  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ slug: string; trigger: HTMLElement }>).detail;
      if (detail && typeof detail.slug === "string") open(detail.slug, detail.trigger ?? null);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [open]);

  /**
   * 해시 딥링크 — 열 때 `pushState`, 닫을 때 해시 제거. 뒤로 가기(popstate)도 따라간다.
   * 첫 진입 시 해시가 있으면 그 모달을 연다(새로고침 복원).
   * ⚠️ `pushState` 라 스크롤이 튀지 않는다 — `location.hash = …` 는 없는 id 를 찾아 상단으로 간다.
   */
  useEffect(() => {
    const onPop = () => setSlug(slugFromHash());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const base = window.location.pathname + window.location.search;
    const target = slug ? base + HASH_PREFIX + slug : base;
    if (window.location.pathname + window.location.search + window.location.hash !== target) {
      window.history.pushState(null, "", target);
    }
  }, [slug]);

  // 스크롤 잠금 · ESC · 포커스 트랩 (모바일 메뉴와 같은 패턴)
  useEffect(() => {
    if (!slug) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [slug, close]);

  // 시안이 바뀌면 스크롤을 맨 위로 (다른 프로젝트를 이어서 열 때)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [slug, tab]);

  if (!hydrated || !project) return null;

  const shot = tab === "mobile" ? project.mobileImage : project.fullImage;
  const hasMobile = Boolean(project.mobileImage && project.fullImage);

  return (
    <div
      className="project-modal fixed inset-0 z-[80] flex items-center justify-center p-4 lg:p-8"
      role="presentation"
      // 바깥(딤) 클릭으로 닫기 — 패널 안쪽 클릭은 아래에서 멈춘다
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} 프로젝트`}
        tabIndex={-1}
        className="project-modal-panel relative flex h-[86vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[16px] bg-canvas shadow-[0_40px_120px_-24px_rgba(0,0,0,0.7)] outline-none lg:flex-row"
      >
        {/* 좌측 — 풀페이지 캡처를 자체 세로 스크롤로 훑는다 */}
        <div
          ref={scrollRef}
          /*
            모바일은 **위 이미지 55vh 고정 / 아래 정보**로 나눈다 (2026-08-22).
            둘 다 flex-1(50:50)이면 정보 쪽이 화면 절반을 먹어 캡처가 손바닥만 해진다.
            이미지 영역은 자체 세로 스크롤이라 55vh 안에서 사이트 전체를 훑을 수 있다.
          */
          className="relative h-[55vh] shrink-0 overflow-y-auto bg-surface-subtle lg:h-auto lg:w-[55%] lg:flex-none"
        >
          {shot ? (
            <Image
              src={shot.src}
              alt={`${project.name} 사이트 전체 화면`}
              width={shot.width}
              height={shot.height}
              // 사용자가 눌러서 연 화면이라 지연 로딩을 걸지 않는다(빈 칸이 보이면 안 된다).
              // sizes 를 주지 않으면 Next 가 1440px 원본 폭으로 최적화해 dev 에서 몇 초씩 걸린다.
              loading="eager"
              sizes="(max-width: 1023px) 100vw, 640px"
              // 세로로 아주 긴 캡처라 폭만 맞추고 높이는 자연 비율로 흐르게 둔다
              className={cn(
                "h-auto w-full",
                tab === "mobile" && "mx-auto max-w-[390px]",
              )}
              quality={70}
            />
          ) : (
            <p className="text-body-m p-8 text-ink-secondary">
              화면 캡처가 아직 없습니다.
            </p>
          )}
        </div>

        {/* 우측 — projects.ts 에 이미 있는 정보만. 새 카피를 만들지 않는다 */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 lg:w-[45%] lg:flex-none lg:p-8">
          {project.perspective ? (
            <p className="text-[13px] leading-[1.5] font-medium text-cta">
              {project.perspective}
            </p>
          ) : null}
          <h2 className="text-h2 mt-1.5 font-bold! text-ink">{project.name}</h2>
          <p className="text-label mt-1 text-ink-secondary">
            {project.industry} · {project.category}
          </p>

          {hasMobile ? (
            <div className="mt-5 inline-flex rounded-full border border-line p-0.5">
              {(["desktop", "mobile"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-pressed={tab === key}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                    tab === key
                      ? "bg-ink text-canvas"
                      : "text-ink-secondary hover:text-ink",
                  )}
                >
                  {key === "desktop" ? "데스크톱" : "모바일"}
                </button>
              ))}
            </div>
          ) : null}

          {/* 카드에서는 2줄로 잘리던 요약을 여기서는 전문으로 */}
          <p className="text-body-m mt-5 leading-[1.85] break-keep text-ink-secondary">
            {project.summary}
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.services.map((service) => (
              <li
                key={service}
                className="text-caption rounded-full border border-line px-2.5 py-1 text-ink-secondary"
              >
                {service}
              </li>
            ))}
          </ul>

          {/* 결과 수치는 검증된 경우에만 (문서 §7.4) */}
          {project.resultVerified && project.result ? (
            <p className="text-body-m mt-5 text-cta">{project.result}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="닫기"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-canvas transition-colors hover:bg-ink"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
