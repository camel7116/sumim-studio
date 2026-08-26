import Image from "next/image";
import { deviceFrame } from "@/content/site";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { cn } from "@/lib/utils";

/**
 * 3열 그리드에서 카드가 놓인 자리 (2026-08-19).
 * 서로 마주 보게: 왼쪽 카드는 오른쪽을 향하고, 오른쪽 카드는 왼쪽을 향하며,
 * 가운데는 거의 정면. 폰은 언제나 모니터와 반대 방향(§4-B 마주 보기 규칙).
 */
export type MockupTilt = "left" | "center" | "right";

type DeviceMockupProps = {
  /** 데스크톱 화면에 넣을 이미지 (프로젝트 커버 캡처) */
  desktopSrc: string;
  /**
   * 휴대폰 화면에 넣을 이미지.
   * 2026-08-20 5차: 호출부(`project-card.tsx`)가 **`mobileImage`(진짜 모바일 뷰) 우선**,
   * 없으면 `fullImage`(데스크톱 풀페이지)를 넘긴다. 어느 쪽이든 세로로 긴 캡처라
   * 아래 호버 스크롤(object-position 0%→100%)은 그대로 동작한다.
   */
  phoneSrc?: string;
  /**
   * 호버 중 아래로 흐를 **풀페이지 캡처** (2026-08-19 사용자 요청 "호버 했을 때 목업 부분의
   * 페이지가 자동으로 조금씩 이동"). 없으면(placeholder) 이동하지 않는다.
   */
  scrollSrc?: string;
  alt: string;
  /** 그리드에서의 자리에 따른 기울기 방향. 기본 "left"(= 이전 flip=false 방향) */
  tilt?: MockupTilt;
  sizes?: string;
  className?: string;
  /**
   * 호버 시 어두운 오버레이 위에 뜨는 로고 (2026-08-19 사용자 요청).
   * 없으면 name 텍스트를 대신 띄운다.
   */
  logoSrc?: string;
  /** 로고가 없을 때 대신 쓰는 이름 */
  name?: string;
  /**
   * /work 첫 카드처럼 **폭이 1000px 이상**인 목업. 큰 목업은 모니터의 3D 회전으로 bbox 가
   * 레이아웃 상자보다 훨씬 아래까지 내려와, 작은 카드용 20px 여백으로는 폰이 제목을 덮는다.
   * (376·580px 카드는 오차 2px, 1200px 카드는 −11px 로 부호까지 뒤집힌다 — 2026-08-19 실측)
   */
  wide?: boolean;
};

/**
 * 디바이스 목업 (2026-08-18 사용자 요청)
 * "휴대폰과 컴퓨터 화면에 약간 기울어진 3D 느낌"으로 포트폴리오 캡처를 보여준다.
 *
 * - 기울기는 **정적**이다. 호버로 회전시키지 않는다 — 디자인 문서 §11.5의 3D 회전 카드
 *   금지 취지에 걸리지 않게, 카드가 도는 게 아니라 처음부터 비스듬히 놓인 사물처럼 둔다.
 * - 2026-08-19: 휴대폰은 **모니터와 반대 방향**으로 기울인다 (사용자 요청). 모니터가
 *   왼쪽으로 돌아 있으면 휴대폰은 오른쪽으로 — 두 기기가 서로 마주 보는 느낌.
 * - 2026-08-19(3열 전환): 메인 Selected Work가 lg에서 3열이 되며 카드 폭이 580 → 376px로
 *   줄었다. 각도를 13° → 9.5°로 낮추고, 폰 폭(23% → 21%)과 옆으로 삐져나오는 양
 *   (-left-4/-right-4 → -left-2/-right-2)을 줄여 gap-x-9(36px) 안에 머물게 했다.
 *   카드 자리에 따라 tilt="left|center|right" — 좌우가 서로를 향하고 가운데는 거의 정면.
 * - 2026-08-19: 호버 시 두 화면이 **50% 어두워지고 업체 로고**가 떠오른다 (사용자 요청).
 *   카드 전체가 링크라 클릭하면 상세로 간다. 로고는 group-hover 로 페이드인.
 * - 휴대폰이 데스크톱 밖으로 삐져나오므로, 이 컴포넌트를 감싸는 쪽에 overflow-hidden을
 *   두면 안 된다.
 * - preserve-3d 는 쓰지 않는다 (2026-08-18 렉 대응). 실측 결과 3D 컨텍스트가 겹치면
 *   섹션 프레임이 45fps 로 떨어졌다. 평탄한 회전 + 크기 차이로 같은 입체감을 낸다.
 */
export function DeviceMockup({
  desktopSrc,
  phoneSrc,
  scrollSrc,
  alt,
  tilt = "left",
  sizes = "(max-width: 1023px) 100vw, 420px",
  className,
  logoSrc,
  name,
  wide = false,
}: DeviceMockupProps) {
  // 모니터 / 폰(모니터와 반대 방향, 바깥쪽으로 돌출)
  const desktopTilt = {
    left: "[transform:rotateX(7deg)_rotateY(-9.5deg)_rotateZ(1deg)]",
    center: "[transform:rotateX(6deg)_rotateY(-2.5deg)_rotateZ(0.3deg)]",
    right: "[transform:rotateX(7deg)_rotateY(9.5deg)_rotateZ(-1deg)]",
  }[tilt];

  const phoneTilt = {
    left: "-left-2 [transform:scale(1.05)_rotateX(6deg)_rotateY(10deg)_rotateZ(-1.5deg)]",
    // 가운데 카드의 폰은 왼쪽으로 고정하고, 모니터(-2.5°)와 반대인 오른쪽으로 약하게
    center: "-left-2 [transform:scale(1.05)_rotateX(6deg)_rotateY(4deg)_rotateZ(-0.8deg)]",
    right: "-right-2 [transform:scale(1.05)_rotateX(6deg)_rotateY(-10deg)_rotateZ(1.5deg)]",
  }[tilt];

  // 호버 오버레이 — 두 화면에 같은 것을 얹는다
  const overlay = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-[background-color,opacity] duration-300 ease-out group-hover/link:bg-black/50 group-hover/link:opacity-100 group-focus-visible/link:bg-black/50 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt=""
          width={240}
          height={80}
          // 폭이 아니라 **높이** 기준으로 맞춘다 (2026-08-19). 지안영어처럼 가로로 긴 로고를
          // 폭으로 맞추면 글자가 낮아져 잘 안 보인다. 로고 파일은 전부 투명 여백을 잘라내
          // 잉크 영역만 남긴 상태라 높이 = 글자 높이다. 폭은 화면의 78% 까지만.
          className="h-[24%] w-auto max-w-[80%] translate-y-1.5 object-contain opacity-0 transition-[transform,opacity] delay-75 duration-300 ease-out group-hover/link:translate-y-0 group-hover/link:opacity-100 group-focus-visible/link:translate-y-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
        />
      ) : (
        <span className="text-h3 translate-y-1.5 font-semibold text-white opacity-0 transition-[transform,opacity] delay-75 duration-300 ease-out group-hover/link:translate-y-0 group-hover/link:opacity-100 group-focus-visible/link:translate-y-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none">
          {name}
        </span>
      )}
    </div>
  );

  return (
    // 폰이 아래로 삐져나오는 만큼(20px)만 여백을 둔다 — 2026-08-19 사용자 요청
    // "모바일 목업은 웹 목업에서 20px 정도만 밑으로, 밑에 내용과 여백도 재설정"
    <div className={cn("relative [perspective:1500px]", wide ? "pb-10" : "pb-5", className)}>
      {/* 데스크톱 — 브라우저 크롬 + 화면 */}
      <div
        className={cn(
          "relative rounded-[14px] border border-line bg-surface-subtle p-2.5 shadow-[0_18px_34px_-14px_rgba(0,0,0,0.6)]",
          desktopTilt,
        )}
      >
        <div className="flex items-center gap-1.5 px-1 pb-2.5">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="ml-2 h-2.5 flex-1 rounded-full bg-line" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[7px] bg-canvas">
          {/*
            2026-08-19 "호버 시 페이지가 자동으로 조금씩 이동".
            **커버를 풀페이지로 갈아 끼우지 않고 두 장을 겹쳐** 둔다 — 커버는 사용자가 확정한
            정지 상태의 그림이라 쉬는 모습이 바뀌면 안 되고, 호버 시점에 src 를 바꾸면
            그때 받느라 깜빡인다. 아래에 풀페이지를 깔고 위의 커버만 페이드아웃시키면
            둘 다 카드와 함께 미리 받혀 있어 전환이 끊기지 않는다.
          */}
          {scrollSrc ? (
            <Image
              src={scrollSrc}
              alt=""
              fill
              sizes={sizes}
              // 세로로 아주 긴 캡처(1440×7908)라 이 크기에서는 품질을 낮춰 받는다
              quality={50}
              className={cn(
                "mockup-scroll object-cover [object-position:50%_0%]",
                // 기본(=호버 해제) 1.2s ease 복귀 / 호버 중 9s 선형 하강
                "transition-[object-position] duration-[1200ms] ease-out",
                "group-hover/link:[object-position:50%_100%] group-hover/link:duration-[9000ms] group-hover/link:ease-linear",
                "group-focus-visible/link:[object-position:50%_100%] group-focus-visible/link:duration-[9000ms] group-focus-visible/link:ease-linear",
              )}
            />
          ) : null}
          <Image
            src={desktopSrc}
            alt={alt}
            fill
            sizes={sizes}
            quality={72}
            className={cn(
              "object-cover object-top",
              scrollSrc &&
                "transition-opacity duration-500 ease-out group-hover/link:opacity-0 group-focus-visible/link:opacity-0 motion-reduce:transition-none",
            )}
          />
          {overlay}
        </div>
      </div>

      {/* 휴대폰 — 모니터와 **반대** 방향으로 기울여 서로 마주 보게 (2026-08-19) */}
      {deviceFrame === "png" ? (
        /*
          실사 프레임 PNG (2026-08-23 · 스위치 `deviceFrame`).
          **폭 `w-[21%]` 과 `bottom-0` · 기울기는 그대로**다 — 밑변이 모니터 밑변보다 20px
          아래라는 규칙도, 좌우로 삐져나오는 양(-left-2/-right-2)도 폭이 정하므로 안 바뀐다.
          ⚠️ 프레임 비율(389/800)이 CSS 폰보다 세로로 길어 **높이만 145 → 162px**(376px 카드
             기준)로 늘어난다. 아래가 고정이라 위로 12px 더 올라온다.
          접지 그림자는 투명 PNG 실루엣을 따라가야 하므로 `drop-shadow` 다.
        */
        <div
          className={cn(
            // 🚨 위치·기울기는 **바깥 래퍼**가 맡는다. `PhoneFrame` 자신에 `absolute` 를 주면
            //    컴포넌트 기본 클래스 `relative` 와 같은 속성을 두고 부딪히는데, Tailwind 는
            //    클래스를 쓴 순서가 아니라 **CSS 출력 순서**로 이기고 `.relative` 가 뒤에 나온다
            //    → 폰이 문서 흐름에 남아 카드가 162px 씩 길어졌다(실측 후 구조 변경).
            "absolute bottom-0 w-[21%] [filter:drop-shadow(0_12px_18px_rgba(0,0,0,0.45))]",
            phoneTilt,
          )}
        >
          <PhoneFrame
            src={phoneSrc ?? desktopSrc}
            alt=""
            sizes="200px"
            className="w-full"
            imageClassName={cn(
              "object-cover [object-position:50%_0%]",
              // 폰은 모니터보다 조금 느리게 (11s) — 두 화면이 같은 속도로 움직이면 기계적이다
              phoneSrc
                ? "mockup-scroll transition-[object-position] duration-[1200ms] ease-out group-hover/link:[object-position:50%_100%] group-hover/link:duration-[11000ms] group-hover/link:ease-linear group-focus-visible/link:[object-position:50%_100%] group-focus-visible/link:duration-[11000ms] group-focus-visible/link:ease-linear"
                : "object-top",
            )}
          >
            {overlay}
          </PhoneFrame>
        </div>
      ) : (
        <div
          className={cn(
            // bottom-0 + 래퍼 pb-5 → 폰 밑변이 모니터 밑변보다 **20px** 아래.
            // (2026-08-19 이전에는 pb-10 + -bottom-2 로 48px 이나 내려가 붕 떠 보였다)
            "absolute bottom-0 w-[21%] rounded-[16px] border border-line bg-surface-subtle p-1.5 shadow-[0_14px_24px_-10px_rgba(0,0,0,0.65)]",
            phoneTilt,
          )}
        >
          {/* 스피커 슬릿 */}
          <div className="mx-auto mb-1 h-[3px] w-6 rounded-full bg-line-strong" />
          <div className="relative aspect-[9/17] overflow-hidden rounded-[11px] bg-canvas">
            <Image
              src={phoneSrc ?? desktopSrc}
              alt=""
              fill
              sizes="200px"
              // 풀페이지 캡처는 1440×5953처럼 아주 커서, 이 작은 화면용으로는 품질을 낮춰 받는다
              quality={55}
              className={cn(
                "object-cover [object-position:50%_0%]",
                // 폰은 모니터보다 조금 느리게 (11s) — 두 화면이 같은 속도로 움직이면 기계적이다
                phoneSrc
                  ? "mockup-scroll transition-[object-position] duration-[1200ms] ease-out group-hover/link:[object-position:50%_100%] group-hover/link:duration-[11000ms] group-hover/link:ease-linear group-focus-visible/link:[object-position:50%_100%] group-focus-visible/link:duration-[11000ms] group-focus-visible/link:ease-linear"
                  : "object-top",
              )}
            />
            {overlay}
          </div>
        </div>
      )}
    </div>
  );
}
