"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import {
  bridgePhoneScreens,
  bridgeStatement,
  bridgeTextHighlight,
  deviceFrame,
  inlineCta,
} from "@/content/site";
import { projects } from "@/content/projects";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { Reveal } from "@/components/ui/reveal";
import { MaskLines } from "@/components/ui/section-header";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { cn } from "@/lib/utils";

/**
 * 브릿지 밴드 (2026-08-20 3차 — 수능선배 "확신 화법" 밴드 / 4차 — 폰 목업 추가)
 *
 * Work(흰)와 Process(연회청) 사이에 끼우는 **네이비 밴드**.
 * 결과물을 보여준 직후 태도를 한 번 못 박고 과정 설명으로 넘어간다.
 *
 * - 4차(2026-08-20): 오른쪽에 **폰 두 대를 입체적으로 세운 비주얼**을 붙였다
 *   (사용자: "'말로 설명하지 않습니다' 오른쪽에 고정 백그라운드로 아이폰·갤럭시 두 대").
 *   왼쪽 헤딩 = 말, 오른쪽 폰 화면 = **실제 만든 것** — 문구의 증거가 화면에 같이 선다.
 * - 문구는 `site.ts` 의 `bridgeStatement` (🚨 초안 — 팀 검토 대기).
 *   `enabled: false` 로 하면 밴드가 통째로 빠지고 Work(흰) → Process(연회청)로 이어져
 *   밴드 교차 규칙은 그대로 유지된다.
 * - `<Section>` 을 쓰지 않고 직접 section 을 쓴다 — 공통 패딩(py-20/28/40)과 다른 리듬이다.
 */

/**
 * 폰 프레임 — **자작 CSS/SVG**다 (외부 PNG 에셋을 쓰지 않는다).
 *
 * 🚨 **2026-08-23: 기본값이 아니다.** `site.ts` 의 `deviceFrame` 이 `"png"` 인 동안은
 *    실사 프레임(`components/ui/phone-frame.tsx`)이 대신 그려진다 — 사용자 "CSS 로 그린
 *    폰이 납작하고 애매하다". `deviceFrame = "css"` 로 바꾸면 아래가 그대로 복귀한다.
 *    (그래서 이름만 `CssPhoneFrame` 으로 바꿨고 내용은 한 줄도 안 건드렸다)
 *
 * 라이선스 판단(2026-08-20, 4차): 무료 스마트폰 목업 PNG 는 "상업적 사용 가능"이라도
 * 출처마다 조건이 갈리고, 애플·삼성 공식 렌더는 저작권 대상이다. 자작 프레임은
 * **라이선스 리스크 0** 이고 사이트의 카드 언어(라운드·헤어라인·그림자)와도 그대로 맞물린다.
 * 기존 `device-mockup.tsx` 의 폰 프레임을 확장한 형태다.
 * (2026-08-23 채택한 PNG 는 Mobile FIRST 배포본이라 위 우려가 해소된 건이다 —
 *  라이선스 원문은 `public/images/devices/LICENSE.txt`)
 *
 * - `variant="island"` : 상단 가운데 **다이내믹 아일랜드**(아이폰형)
 * - `variant="hole"`   : 상단 가운데 **펀치홀**(갤럭시형) + 프레임 색을 한 톤 밝게
 *
 * ⚠️ `preserve-3d` 는 쓰지 않는다 (2026-08-18 렉 전례, §4-B). 부모의 perspective 아래에서
 *    각 폰을 **평탄하게 회전**시키고 크기·밝기 차이로 앞뒤를 만든다.
 */
function CssPhoneFrame({
  src,
  variant,
  className,
  ref,
}: {
  src: string;
  variant: "island" | "hole";
  className?: string;
  /** 마우스 패럴랙스가 이 요소의 transform 을 직접 쓴다 (React 19 — ref 는 일반 prop) */
  ref?: React.Ref<HTMLDivElement>;
}) {
  const island = variant === "island";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "rounded-[30px] p-[7px] shadow-[0_28px_60px_-18px_rgba(0,0,0,0.65)]",
        // 네이비 밴드 위에서 프레임이 묻히지 않게: 본체는 밴드보다 밝은 그래파이트 +
        // 얇은 림 라이트(흰 15%). 갤럭시형은 한 톤 더 밝아 두 대가 구분된다.
        island
          ? "border border-white/15 bg-[#232c44]"
          : "border border-white/20 bg-[#33405e]",
        className,
      )}
    >
      {/* 화면은 프레임 안쪽을 그대로 채운다 — 비율은 바깥 프레임(aspect-ratio)이 정한다 */}
      <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-[#0b1020]">
        <Image
          src={src}
          alt=""
          fill
          sizes="240px"
          // 세로로 아주 긴 풀페이지 캡처(1440×5850~7908)라 작은 화면용으로는 품질을 낮춘다
          quality={55}
          className="object-cover object-top"
        />
        {/* 유리 반사 — 얇은 대각 하이라이트 한 겹 (면이 평평해 보이지 않게) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 26%, rgba(255,255,255,0) 46%)",
          }}
        />
        {/* 상단 카메라 — 아이폰형 다이내믹 아일랜드 / 갤럭시형 펀치홀 */}
        {island ? (
          <div className="absolute top-[1.6%] left-1/2 h-[2.3%] w-[34%] -translate-x-1/2 rounded-full bg-black/90" />
        ) : (
          <div className="absolute top-[1.4%] left-1/2 aspect-square h-[1.5%] -translate-x-1/2 rounded-full bg-black/90" />
        )}
      </div>
    </div>
  );
}

/**
 * 두 폰의 **고정 회전**.
 * 마우스 틸트가 transform 을 통째로 다시 쓰므로 회전을 여기에 상수로 둔다 —
 * 클래스에도 **같은 값**이 있어야 JS 가 붙기 전(SSR·no-JS)에도 기울어진 채로 보인다.
 * (두 곳을 함께 고치지 않으면 하이드레이션 순간 폰이 튄다)
 *
 * 🚨 **V자 확정 (2026-08-21 밤 사용자 정정: "아래쪽이 서로를 향하는 모양 — 아래가 모이고
 *    위가 벌어지는 V, 가림은 5~10%, 각도 4 언저리")**
 * 직전 ∧(앞 +4.5° / 뒤 −4.5°)는 **윗변**이 모이는 모양이었다. 부호를 반전해 **아랫변이
 * 서로를 향하는 V** 로 되돌린다 — 왼쪽(앞) 폰은 반시계 `rotateZ(-4.5deg)`,
 * 오른쪽(뒤) 폰은 시계 `rotateZ(4.5deg)`. `rotateY`(서로 마주보기)·크기 차·brightness 는 그대로.
 * ⚠️ 4.5° 는 얕아 가로 점유폭이 거의 안 늘어나 두 폰이 **전혀 안 겹친다** — 그래서 아래
 *    그룹 폭을 `430 → 405px` 로 조여 **뒤 폰 폭의 7% 가림**을 만든다(값은 실측).
 */
const FRONT_ROTATE = "rotateY(-10deg) rotateZ(-4.5deg)";
const BACK_ROTATE = "rotateY(8deg) rotateZ(4.5deg)";

/**
 * 마우스 **틸트 각도(deg)** — 2026-08-21 사용자: "휴대폰은 위치 이동 말고 **상하좌우 회전**으로."
 *
 * 앞뒤가 **서로 반대 부호**라 커서를 움직이면 두 대가 반대로 기울며 깊이가 생긴다.
 * `y` 는 부호를 뒤집어 쓴다 — 커서가 위로 가면 폰 윗면이 뒤로 눕는(=화면을 올려다보는) 방향.
 */
const FRONT_TILT = { y: 6, x: -5 };
const BACK_TILT = { y: -8, x: 6 };

/**
 * 폰 **상자 비율·높이** — `deviceFrame`(site.ts) 에 따라 갈린다 (2026-08-23).
 *
 * 🚨 실사 프레임 PNG 는 **389/800 = 0.48625**, 자작 CSS 폰은 **9/19.5 = 0.46154** 라
 *    PNG 가 같은 높이에서 **5.35% 더 넓다**. 둘 다 지킬 수는 없어서 **폭을 지켰다** —
 *    두 폰의 겹침(뒤 폰 폭의 7%)이 사용자가 직접 맞춘 값이라 폭이 커지면 가림이 두 배가 된다.
 *    (높이를 그대로 두면 앞 203→214 · 뒤 185→195px 가 되어 겹침이 15 → 36px 로 뛴다 — 계산 실측)
 *    그래서 높이만 **0.949178 배**(= 0.46154/0.48625) 로 줄였다:
 *      앞 88% → **83.53%** (500px 기준 440 → 417.6px, 폭 203.1px 유지)
 *      뒤 80% → **75.93%** (400 → 379.7px, 폭 184.6px 유지)
 *    `deviceFrame = "css"` 로 되돌리면 88%/80% 도 같이 돌아온다.
 * ⚠️ 모바일(h-[432px])에서도 같은 비율이라 폭이 앞 175.5 / 뒤 159.5px 로 그대로다.
 */
const PHONE_BOX =
  deviceFrame === "png"
    ? { aspect: "[aspect-ratio:389/800]", front: "h-[83.53%]", back: "h-[75.93%]" }
    : { aspect: "[aspect-ratio:9/19.5]", front: "h-[88%]", back: "h-[80%]" };

/**
 * 접지 그림자 — 투명 PNG 라 `box-shadow` 가 아니라 **`drop-shadow`** 여야 실루엣을 따라간다
 * (사각형 상자가 아니라 폰 윤곽에 그림자가 붙는다). 검정 밴드 위라 눈에 거의 안 띄는 게 정상이고,
 * colorLab 으로 밴드를 밝게 바꿔 보면 그때 바닥 그림자가 드러난다. CSS 폰이 쓰던
 * `0 28px 60px -18px rgba(0,0,0,.65)` 과 같은 무게로 맞췄다.
 */
const PHONE_SHADOW = "[filter:drop-shadow(0_22px_30px_rgba(0,0,0,0.5))]";

export function StatementBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  /** 등장 애니메이션을 맡는 바깥 래퍼 (폰 자신의 transform 은 틸트가 쓴다) */
  const frontWrapRef = useRef<HTMLDivElement>(null);
  const backWrapRef = useRef<HTMLDivElement>(null);
  /** 🆕 스크롤 하이라이트가 `--bridge-fill` 을 쓰는 헤딩 (2026-08-31) */
  const headingRef = useRef<HTMLHeadingElement>(null);

  /**
   * 폰 **등장 애니메이션** (2026-08-21 사용자: "휴대폰 두 대도 처음 화면에 나타날 때
   * 양쪽에서 모여 들어오든, 아래에서 올라오든").
   *
   * **양쪽에서 모이기**로 갔다 — 두 대가 이미 서로 마주 보게 기울어 있어(4차 배치)
   * 좌·우에서 모여드는 편이 그 구성과 맞물린다.
   * 섹션이 처음 25% 보이는 순간 `.is-in` 을 붙이고 **관찰을 끊는다(1회, 재등장 없음)**.
   * `prefers-reduced-motion` 이면 globals 에서 애니메이션을 끄고 바로 보이게 한다.
   */
  useEffect(() => {
    const section = sectionRef.current;
    const targets = [frontWrapRef.current, backWrapRef.current].filter(Boolean) as HTMLElement[];
    if (!section || targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        for (const el of targets) el.classList.add("is-in");
        obs.disconnect();
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /**
   * "고정 백그라운드" 효과 — 폰 그룹이 스크롤을 **살짝 느리게** 따라온다.
   *
   * `background-attachment: fixed` 는 이 구조(이미지가 배경이 아니라 DOM 레이어)에서는
   * 쓸 수 없어 **transform 패럴랙스**로 대체했다. 섹션이 화면을 지나는 진행도(0~1)를
   * ±28px 로 매핑해 총 이동 **56px** — 배경이 뒤에 살짝 붙어 있는 느낌만 낸다.
   *
   * - rAF 스로틀 + passive 리스너, **섹션이 화면 밖이면 리스너를 떼고 정지**한다.
   * - `prefers-reduced-motion` 이면 아무것도 걸지 않는다(정적).
   */
  useEffect(() => {
    const section = sectionRef.current;
    const group = groupRef.current;
    /* 🆕 폰이 렌더되지 않는 상황(스크린 2장 미만)에서도 헤딩 하이라이트는 살아야 하므로
       group 은 여기서 막지 않고 아래 update() 안에서 null 을 확인한다 */
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let running = false;

    /**
     * 🚨 **틸트·패럴랙스는 `lg` 이상 전용** (2026-08-22 — 모바일도 폰 두 대가 되면서 필요해진 게이트).
     * 예전에는 "모바일은 폰을 렌더하지 않아 ref 가 비어 자동 무동작"이었는데, 이제 같은 요소를
     * 두 폭이 공유하므로 **매 프레임 `matchMedia` 로 걸러낸다**(리스너를 붙였다 뗐다 하지 않아
     * 창 크기를 바꿔도 즉시 따라온다 — 미디어쿼리 객체는 살아 있는 값이다).
     * 터치에는 포인터가 없고, 작은 화면에서 폰이 기울면 V 배치의 겹침이 흐트러진다.
     */
    const desktopMq = window.matchMedia("(min-width: 1024px)");

    /**
     * 마우스 **3D 틸트** (2026-08-21 사용자: "휴대폰들이 마우스 따라 조금씩, 두 개 각기 다른
     * 방향으로" → 정정 "**위치 이동 말고 상하좌우 회전**으로").
     *
     * 커서의 **섹션 중심 대비 오프셋**(nx, ny ∈ [-1,1])을 앞/뒤 폰의 `rotateY`·`rotateX` 에
     * **반대 부호**로 준다. 위치(translate)는 쓰지 않는다 — 폰이 제자리에서 기울기만 한다.
     * 목표값으로 곧장 뛰지 않고 lerp(0.1)로 따라가 손을 멈추면 스르르 멎는다.
     *
     * - 마우스 회전을 **정적 기울기 앞에 붙여** 기존 각도에 가산한다
     *   (`rotateX(..) rotateY(..) rotateY(-10deg) rotateZ(2deg)`).
     * - 원근은 **부모 그룹의 `perspective:1400px`** 을 그대로 쓴다. 폰은 그룹의 직계 자식이라
     *   래퍼를 끼우지 않았다 — 사이에 층을 하나 넣으면 perspective 가 끊겨 회전이 납작해진다.
     *   ⚠️ `preserve-3d` 는 여전히 금지(2026-08-18 렉 전례, §4-B).
     * - 스크롤 패럴랙스와 **레이어가 다르다** — 저쪽은 바깥 그룹(`groupRef`)의 Y 이동,
     *   이쪽은 각 폰 자신의 transform 이라 서로 덮어쓰지 않는다.
     * - rAF 한 루프, 값이 수렴하면 스스로 멈춘다. 리스너는 아래 start/stop 이 관리한다.
     * - 1024px 미만은 폰을 렌더하지 않아 ref 가 비어 자동으로 무동작.
     */
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let mouseFrame = 0;

    const paintMouse = () => {
      mouseFrame = 0;
      curX += (targetX - curX) * 0.1;
      curY += (targetY - curY) * 0.1;
      const front = frontRef.current;
      const back = backRef.current;
      if (front) {
        front.style.transform = `rotateX(${(curY * FRONT_TILT.x).toFixed(2)}deg) rotateY(${(curX * FRONT_TILT.y).toFixed(2)}deg) ${FRONT_ROTATE}`;
      }
      if (back) {
        back.style.transform = `rotateX(${(curY * BACK_TILT.x).toFixed(2)}deg) rotateY(${(curX * BACK_TILT.y).toFixed(2)}deg) ${BACK_ROTATE}`;
      }
      if (Math.abs(targetX - curX) > 0.002 || Math.abs(targetY - curY) > 0.002) {
        mouseFrame = requestAnimationFrame(paintMouse);
      }
    };
    const scheduleMouse = () => {
      if (!mouseFrame) mouseFrame = requestAnimationFrame(paintMouse);
    };
    const clamp = (v: number) => Math.min(1, Math.max(-1, v));
    const onPointerMove = (event: PointerEvent) => {
      if (!desktopMq.matches) return;
      const rect = section.getBoundingClientRect();
      targetX = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      targetY = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      scheduleMouse();
    };
    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      scheduleMouse();
    };

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const span = window.innerHeight + rect.height;
      // 0 = 섹션이 화면 아래에서 막 들어옴 / 1 = 위로 완전히 빠져나감
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span));

      /*
        🆕 **헤딩 스크롤 하이라이트** (2026-08-31) — `--bridge-fill`(0~100%)을 넘긴다.
        새 리스너·새 rAF 루프가 아니라 **이미 돌고 있던 패럴랙스 프레임에 얹은 몇 줄**이다.

        🚨 기준은 섹션이 아니라 **헤딩 자신의 위치**다. 섹션 진행도(위 `progress`)로 재면
           브릿지 섹션 높이(≈500px)가 뷰포트보다 작아 **섹션 상단이 화면 top 에 닿기도 전에
           이미 100%** 가 찬다(실측). 헤딩 rect 를 쓰면 섹션 높이와 무관하게 항상 같은
           "읽는 자리"에서 차오르기가 끝난다.
             시작 : 헤딩 윗변이 뷰포트 **95%** 지점에 올라올 때 (막 보이기 시작)
             완료 : 헤딩 윗변이 뷰포트 **35%** 지점에 닿을 때 (읽기 좋은 자리)
           둘 사이가 0.6vh(900px 화면에서 540px)라 스크롤 한두 번에 차오른다.
        🚨 폭 게이트(`desktopMq`)를 **타지 않는다** — 모바일에서도 같은 효과가 돈다
           (폰 패럴랙스만 lg 이상 전용이다).
      */
      const heading = headingRef.current;
      if (heading) {
        const vh = window.innerHeight;
        const top = heading.getBoundingClientRect().top;
        const fill = Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.6)));
        heading.style.setProperty("--bridge-fill", `${(fill * 100).toFixed(1)}%`);
      }

      if (!group) return;
      if (!desktopMq.matches) {
        // lg 미만은 정적 — 창을 줄여 들어온 경우 남아 있던 이동값을 지운다
        group.style.transform = "";
        return;
      }
      group.style.transform = `translate3d(0, ${((0.5 - progress) * 56).toFixed(1)}px, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const start = () => {
      if (running) return;
      running = true;
      update();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      section.addEventListener("pointermove", onPointerMove, { passive: true });
      section.addEventListener("pointerleave", onPointerLeave, { passive: true });
    };
    const stop = () => {
      if (!running) return;
      running = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      // 화면 밖으로 나가면 폰을 제자리로 되돌려 둔다 — 다시 들어올 때 기울어진 채로 나타나지 않게
      if (mouseFrame) cancelAnimationFrame(mouseFrame);
      mouseFrame = 0;
      targetX = targetY = curX = curY = 0;
      if (frontRef.current) frontRef.current.style.transform = FRONT_ROTATE;
      if (backRef.current) backRef.current.style.transform = BACK_ROTATE;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  if (!bridgeStatement.enabled) return null;

  /**
   * 폰 화면 소스 — 두 갈래다.
   *
   * 1. **`site.ts` 의 `bridgePhoneScreens`** 가 있으면 그걸 쓴다 (2026-08-21, 사용자 지시).
   *    지금 값은 **임시 데모 시안**(가상 브랜드 2종, 라이트/다크)이다.
   * 2. `null` 이면 **2026-08-20 5차 규칙으로 복귀** — `projects.ts` 의
   *    `mobileImage`(진짜 모바일 뷰) 우선, 없으면 `fullImage`(데스크톱 풀페이지) 폴백.
   *    포트폴리오가 바뀌면 폰 화면도 같이 바뀌는 그 동작이다.
   *
   * 앞/뒤 두 대만 필요하므로 두 건만 쓴다(2건을 못 채우면 폰 비주얼 자체를 렌더하지 않는다).
   */
  const screens = bridgePhoneScreens
    ? [bridgePhoneScreens.front, bridgePhoneScreens.back]
    : projects
        .map((project) => project.mobileImage?.src ?? project.fullImage?.src)
        .filter((src): src is string => Boolean(src))
        .slice(0, 2);

  return (
    <section
      ref={sectionRef}
      data-band="void"
      className="overflow-hidden py-24 md:py-28 lg:flex lg:min-h-[70vh] lg:items-center lg:py-24"
    >
      <Container className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
        <Reveal className="lg:col-span-7">
          {/*
            h2 굵기·자간은 globals 의 banded [data-band] h2 규칙(700 / -0.02em)을 따르고,
            크기만 여기서 한 단계 키운다(섹션 헤딩보다 크게 = 선언).
          */}
          {/*
            🆕 **스크롤 하이라이트** (2026-08-31 · 미디어팔레트 방향 ⑤) —
            `bridge-fill` 클래스가 붙으면 globals 의 규칙이 글자를 `background-clip: text`
            로 칠하고, 위 effect 가 넘기는 `--bridge-fill` 만큼 **흰 25% → 흰색**으로 찬다.
            🚨 스위치를 끄면 클래스 자체가 안 붙어 **예전 정적 흰 글자 그대로**다.
            🚨 히어로 워드마크에는 손대지 않는다(글자 변형은 §7 반려) — 이 헤딩 하나뿐이다.
          */}
          <h2
            ref={headingRef}
            className={cn(
              "mask-reveal max-w-[900px] text-[length:clamp(1.75rem,0.9rem+2.9vw,3rem)] leading-[1.35] break-keep whitespace-pre-line text-ink",
              bridgeTextHighlight && "bridge-fill",
            )}
          >
            <MaskLines text={bridgeStatement.text} step={110} />
          </h2>

          {/*
            흐름 중간 CTA ① (2026-08-21 — 팀원 클로드 평가 수용).
            Work 직후 이 자리가 "결과물을 본 직후"라 묻는 문장이 가장 자연스럽다.
            큰 밴드를 새로 만들지 않고 **이 밴드 안쪽 마무리 블록**으로 넣어 밴드 리듬을 유지한다.
            문구는 site.ts 의 inlineCta.bridge — 새 주장·수치 없음.
          */}
          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-10">
            <p className="text-body-m text-ink-secondary">{inlineCta.bridge.note}</p>
            <TrackedLink
              event="bridge_cta_click"
              href={inlineCta.bridge.href}
              className={buttonClasses("ctaInvert", "h-11! px-5! text-[14px]!")}
            >
              {inlineCta.bridge.label}
            </TrackedLink>
          </div>
        </Reveal>

        {/*
          폰 두 대 (4차) — **모바일·데스크톱 한 블록** (2026-08-22 정정).
          부모에 perspective 를 두고 각 폰을 평탄 회전시킨다(preserve-3d 금지).

          🚨 **모바일도 두 대다.** 모바일 1차의 "앞 폰 한 대만" 은 사용자 확인 결과 **오판**이었다
             ("휴대폰이 아직도 하나야 — 두 대 원함"). 되돌리면서 블록을 나누지 않고 **하나로 합쳤다** —
             따로 두면 ref 를 한 벌씩 더 만들어야 하고(등장 애니·틸트가 요소당 하나뿐), 두 트리의
             배치 규칙이 갈려 "축소판"이 아니게 된다.
          🚨 **비율을 통째로 축소**한다: 그룹 상자 `350×432`(모바일) ↔ `405×500`(lg).
             둘 다 w/h = **0.810** 이고 폰 높이는 상자 높이의 88%/80%(PNG 프레임이면 83.53%/75.93%
             — 위 `PHONE_BOX` 주석) 라, 길이가 전부 `350/405 =
             0.864` 배로 줄어든다 → **가림 15.1px(7.1%) → 13.0px, 비율은 7.1% 그대로**.
             ⚠️ `perspective` 도 같이 줄여야 원근이 커 보이지 않는다(1400 × 0.864 ≈ **1200**).
             폰 폭은 390px 기준 앞 **175px(45vw)** / 뒤 159px — 지시한 "~46vw · 상한 190px" 안.
          - 등장 애니(양쪽에서 모이기)는 래퍼가 맡으므로 **모바일에도 그대로** 걸린다.
          - **마우스 틸트·스크롤 패럴랙스는 `lg` 미만에서 동작하지 않는다** — 위 effect 안에서
            `matchMedia("(min-width:1024px)")` 로 매 프레임 걸러낸다(터치엔 포인터가 없다).
        */}
        {screens.length === 2 ? (
          <div className="mt-12 lg:col-span-5 lg:mt-0">
            {/*
              그룹 폭 **405px**(lg) — V(4.5°)에서 두 폰이 뒤 폰 폭의 **7%** 만 겹치게 잡은 실측값이다.
              430px 면 가림 0%(붙어만 있음), 400px 면 9.4%, 390px 면 14%(과함). 폭만 바꿔도
              폰 크기는 그대로다(높이는 컨테이너 높이 기준 %, 폭은 aspect-ratio 파생).
            */}
            <div
              ref={groupRef}
              className="relative mx-auto h-[432px] w-full max-w-[350px] [perspective:1200px] lg:h-[500px] lg:max-w-[405px] lg:[perspective:1400px]"
            >
              {/*
                🚨 **래퍼가 이동, 폰이 회전** — 등장 애니메이션(translate)과 마우스 틸트(rotate)가
                같은 요소의 transform 을 두고 싸우지 않게 층을 나눴다. 틸트는 `style.transform` 을
                직접 쓰므로 CSS 애니메이션과 같은 요소에 두면 서로 덮어쓴다.
                ⚠️ 래퍼가 생기면서 **그룹의 perspective 가 폰에 닿지 않게** 되므로
                   래퍼마다 같은 값을 다시 준다(폰은 각자 평탄 회전이라 결과가 같다).
              */}
              {/* 뒤 폰(갤럭시형) — 오른쪽 뒤, 조금 작고 어둡게. 오른쪽에서 모여 들어온다 */}
              <div
                ref={backWrapRef}
                className={cn(
                  "bridge-phone-in absolute top-0 right-0 w-auto [perspective:1200px] lg:[perspective:1400px]",
                  PHONE_BOX.back,
                  PHONE_BOX.aspect,
                )}
                style={
                  {
                    "--bridge-gather": "bridge-phone-gather-right",
                    "--bridge-delay": "0.12s",
                  } as CSSProperties
                }
              >
                {deviceFrame === "png" ? (
                  <PhoneFrame
                    ref={backRef}
                    src={screens[1]}
                    alt=""
                    sizes="200px"
                    className={cn(
                      "h-full w-full brightness-[0.85] will-change-transform [transform:rotateY(8deg)_rotateZ(4.5deg)]",
                      PHONE_SHADOW,
                    )}
                  />
                ) : (
                  <CssPhoneFrame
                    ref={backRef}
                    src={screens[1]}
                    variant="hole"
                    className="h-full w-full brightness-[0.85] will-change-transform [transform:rotateY(8deg)_rotateZ(4.5deg)]"
                  />
                )}
              </div>
              {/* 앞 폰(아이폰형) — 왼쪽 앞, 크고 밝게. 왼쪽에서 모여 들어온다 */}
              <div
                ref={frontWrapRef}
                className={cn(
                  "bridge-phone-in absolute bottom-0 left-0 z-10 w-auto [perspective:1200px] lg:[perspective:1400px]",
                  PHONE_BOX.front,
                  PHONE_BOX.aspect,
                )}
                style={{ "--bridge-gather": "bridge-phone-gather-left" } as CSSProperties}
              >
                {deviceFrame === "png" ? (
                  <PhoneFrame
                    ref={frontRef}
                    src={screens[0]}
                    alt=""
                    sizes="220px"
                    className={cn(
                      "h-full w-full will-change-transform [transform:rotateY(-10deg)_rotateZ(-4.5deg)]",
                      PHONE_SHADOW,
                    )}
                  />
                ) : (
                  <CssPhoneFrame
                    ref={frontRef}
                    src={screens[0]}
                    variant="island"
                    className="h-full w-full will-change-transform [transform:rotateY(-10deg)_rotateZ(-4.5deg)]"
                  />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
