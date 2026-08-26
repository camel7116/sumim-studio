import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * 실사 폰 프레임 (2026-08-23) — 사용자: "CSS 로 그린 폰이 납작하고 애매하다, **진짜 기기
 * 프레임 PNG** 로 바꿔달라".
 *
 * 에셋: `public/images/devices/iphone-17-pro-max.png` (389×800, PNG-32).
 * 출처·라이선스는 같은 폴더의 `LICENSE.txt` — Mobile FIRST(webmobilefirst.com),
 * "개인·상업적 사용 허용 / 출처 표기 불필요 / 수정·크롭 허용 / **파일 단독 재판매 금지**".
 *
 * 🚨 이 PNG 는 **바깥도 화면 구멍도 투명**하고 다이내믹 아일랜드만 불투명하다.
 *    그래서 구조가 [화면 캡처] → 그 위에 [프레임 PNG] 두 겹이면 끝이다.
 *    아일랜드가 캡처 위에 자동으로 얹히고, 베젤이 캡처의 네 변을 덮는다.
 *
 * 🚨 화면 구멍 좌표는 **알파 채널 실측값**이다(플러드필 + 서브픽셀). 눈대중 값을 쓰면
 *    캡처가 구멍보다 작아 모서리에 배경색이 비친다.
 *      x 16.93 / y 13.73 / w 355.91 / h 772.94  (오른끝 372.84 · 밑끝 786.68)
 *    모서리는 **원호가 아니라 스퀘어클(연속 곡률)** 이라 딱 맞는 원 반지름이 없다.
 *    대각선이 일치하는 원 반지름 = **52.4px**, 구멍 밖으로 안 삐져나오는 최대 원 반지름 = 53px
 *    → **52px** 을 쓴다(실측 최대 이탈 −0.63px = 항상 구멍 안쪽).
 *
 * ⚠️ 이 컴포넌트 안에는 **그림자를 넣지 않는다.** 접지 그림자는 호출부가
 *    `filter: drop-shadow(...)` 로 붙인다(투명 PNG 라 실루엣을 정확히 따라간다).
 * ⚠️ `preserve-3d` 금지 규칙(§4-B)은 그대로다 — 회전은 호출부가 평탄하게 건다.
 */

/** 프레임 PNG 원본 크기 — 화면 구멍 퍼센트의 분모 */
export const PHONE_FRAME_WIDTH = 389;
export const PHONE_FRAME_HEIGHT = 800;
/** 호출부가 상자를 잡을 때 쓰는 비율 문자열 (`[aspect-ratio:389/800]`) */
export const PHONE_FRAME_ASPECT = `${PHONE_FRAME_WIDTH}/${PHONE_FRAME_HEIGHT}`;

const FRAME_SRC = "/images/devices/iphone-17-pro-max.png";

/** 실측 화면 구멍 (389×800 원본 픽셀) */
const SCREEN = { x: 16.93, y: 13.73, width: 355.91, height: 772.94, radius: 52 };
/**
 * 사방 0.75px 씩 **더 크게** 깐다. 구멍 경계가 안티에일리어싱된 1px 이라, 딱 맞추면
 * 브라우저 반올림에 따라 실오라기 같은 배경색 틈이 보일 수 있다. 넘친 부분은 불투명한
 * 베젤이 덮으므로 손해가 없다(대신 캡처 상단이 0.75/773 = 0.1% 만큼 위로 밀린다 — 무시 가능).
 */
const BLEED = 0.75;

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(4)}%`;

const SCREEN_BOX = {
  left: pct(SCREEN.x - BLEED, PHONE_FRAME_WIDTH),
  top: pct(SCREEN.y - BLEED, PHONE_FRAME_HEIGHT),
  width: pct(SCREEN.width + BLEED * 2, PHONE_FRAME_WIDTH),
  height: pct(SCREEN.height + BLEED * 2, PHONE_FRAME_HEIGHT),
  /*
    가로 %는 상자의 **폭**, 세로 %는 **높이** 기준이라 `X% / Y%` 두 값으로 줘야
    어느 크기에서도 **원형** 모서리가 된다(한 값만 주면 납작한 타원이 된다).
  */
  borderRadius: `${pct(SCREEN.radius + BLEED, SCREEN.width + BLEED * 2)} / ${pct(
    SCREEN.radius + BLEED,
    SCREEN.height + BLEED * 2,
  )}`,
} as const;

type PhoneFrameProps = {
  /** 화면에 넣을 캡처 (세로로 긴 모바일 뷰) */
  src: string;
  /** 캡처의 대체 텍스트. 장식이면 `""` — 그때는 상자 전체를 aria-hidden 처리한다 */
  alt: string;
  /**
   * 크기·회전·그림자는 전부 호출부가 이 클래스로 준다.
   * 🚨 **`absolute`/`fixed` 같은 position 유틸리티는 여기에 넣지 말 것** — 이 상자는
   *    화면 층을 절대배치로 얹기 때문에 `relative` 를 기본으로 달고 있고, Tailwind 는
   *    className 에 쓴 순서가 아니라 **CSS 출력 순서**로 이긴다(`.relative` 가 뒤).
   *    위치가 필요하면 **바깥에 래퍼 div** 를 두고 거기에 주면 된다(`device-mockup.tsx` 참고).
   */
  className?: string;
  priority?: boolean;
  /** 화면 캡처의 `sizes` (기본값은 브릿지 폰 실측 폭 기준) */
  sizes?: string;
  /**
   * 화면 캡처 `<Image>` 에 얹을 클래스. 기본은 `object-cover object-top`.
   * Work 카드가 호버 시 캡처를 아래로 흘리는 `mockup-scroll` 규칙을 여기로 넘긴다.
   */
  imageClassName?: string;
  /**
   * **화면 안**(캡처 위 · 프레임 PNG 아래)에 얹을 레이어. 화면 구멍 모양으로 잘린다.
   * Work 카드의 호버 로고 오버레이가 이 자리로 들어간다 — 프레임 위로 덮으면
   * 베젤까지 어두워지고 그림자가 폰 실루엣을 벗어난다.
   */
  children?: React.ReactNode;
  /** 마우스 틸트가 이 요소의 transform 을 직접 쓴다 (React 19 — ref 는 일반 prop) */
  ref?: React.Ref<HTMLDivElement>;
};

export function PhoneFrame({
  src,
  alt,
  className,
  priority = false,
  sizes = "240px",
  imageClassName,
  children,
  ref,
}: PhoneFrameProps) {
  return (
    <div
      ref={ref}
      aria-hidden={alt === "" ? "true" : undefined}
      className={cn("relative", className)}
      style={{ aspectRatio: PHONE_FRAME_ASPECT }}
    >
      {/* 화면 — 프레임 **아래** 층. 캡처 위쪽(상태바 포함)이 화면 위쪽에 붙는다 */}
      <div className="absolute overflow-hidden bg-black" style={SCREEN_BOX}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          // 세로로 아주 긴 풀페이지 캡처(1440×5850~7908)라 이 크기에는 품질을 낮춘다.
          // 값 55 는 device-mockup 이 이미 쓰던 것이라 새 images.qualities 경고가 안 생긴다.
          quality={55}
          priority={priority}
          className={imageClassName ?? "object-cover object-top"}
        />
        {children}
      </div>
      {/* 프레임 — 맨 위. 아일랜드가 캡처를 덮고, 베젤이 캡처의 네 변을 잘라낸다 */}
      <Image
        src={FRAME_SRC}
        alt=""
        fill
        // 49KB 짜리 389px 원본이라 최적화가 이득이 없다. 게다가 unoptimized 는
        // quality 를 타지 않아 images.qualities 경고와도 무관하다.
        unoptimized
        priority={priority}
        draggable={false}
        className="pointer-events-none absolute inset-0 select-none object-contain"
      />
    </div>
  );
}
