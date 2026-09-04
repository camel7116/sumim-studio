import { brandGlyphs } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * 브랜드 도형 3종 (2026-08-31 · 미디어팔레트 방향 ①)
 *
 * 레퍼런스가 같은 팔레트로도 단조롭지 않은 첫 번째 이유는 **브랜드 도형이 섹션마다
 * 반복**되기 때문이다. 색을 배경으로 깔지 않고 도형으로 찍는다.
 *
 * | 이름 | 모양 | 어디서 왔나 |
 * |---|---|---|
 * | `wave`     | 물결 라인 2겹 | 히어로 워드마크 **글자 안 파도**(`.wordmark-wavefill`)를 한 줄로 단순화 |
 * | `asterisk` | 8갈래 별표 ✳ | 레퍼런스의 라임 ✳ 와 같은 결. 획 끝을 둥글려 스밈 톤으로 |
 * | `donut`    | 굵은 링 ○ | 카드 안 체크 아이콘·pill 배지가 이미 쓰는 "속 빈 원" 언어 |
 *
 * 🚨 **인라인 SVG 다 — 아이콘 라이브러리를 쓰지 않는다**(번들·라이선스).
 *    `service-system.tsx` 의 `AxisIcon` 과 같은 규칙이다.
 * 🚨 색은 **`currentColor`** 뿐이라 밴드 토큰을 그대로 따라간다
 *    (검정 밴드 위 흰색 / 밝은 밴드 위 잉크, `text-cta` 를 얹으면 액센트).
 * 🚨 **배경 장식으로 쓰지 않는다** — §7 반려 목록의 "배경 장식 전면 off" 원칙 그대로,
 *    도형은 헤더 옆·행 끝·헤딩 옆 같은 **콘텐츠 자리에만** 붙는다.
 * 🚨 전부 `aria-hidden` — 뜻을 나르지 않는 장식이다.
 *
 * 스위치는 `site.ts` 의 `brandGlyphs` 하나다. `false` 면 아래 컴포넌트들이
 * **전부 null 을 반환**하므로 도형이 한 개도 렌더되지 않는다.
 */
export type BrandGlyphName = "wave" | "asterisk" | "donut";

/**
 * 섹션 순환 순서 — 헤더에 붙는 도형이 섹션마다 달라지도록 이 배열을 돌려 쓴다.
 * (호출부가 `glyphForIndex(n)` 으로 고르거나, 이름을 직접 지정해도 된다)
 */
export const BRAND_GLYPH_CYCLE: readonly BrandGlyphName[] = [
  "wave",
  "asterisk",
  "donut",
] as const;

/** 섹션 순서 index → 도형 이름 (3종을 순환) */
export function glyphForIndex(index: number): BrandGlyphName {
  return BRAND_GLYPH_CYCLE[index % BRAND_GLYPH_CYCLE.length];
}

/**
 * 도형 하나. `size` 는 px(정사각형)이고 획 굵기는 viewBox 안에서 고정이라
 * 크기를 키워도 굵기 비율이 유지된다.
 */
export function BrandGlyph({
  name,
  size = 22,
  className,
}: {
  name: BrandGlyphName;
  /** 한 변 px (기본 22 — EyebrowLabel 의 12.5px 라벨 옆에 어울리는 크기) */
  size?: number;
  className?: string;
}) {
  if (!brandGlyphs) return null;

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    "aria-hidden": true,
    focusable: false as const,
    className: cn("shrink-0", className),
  };

  if (name === "wave") {
    /*
      파도 — 히어로 워드마크 안에서 흐르는 물결의 축약형이다.
      두 겹(앞·뒤)이라 한 줄짜리 사인 곡선보다 "물"로 읽힌다. 뒤 겹은 반투명.
      획 끝을 둥글려(round) 다른 아이콘(체크·나침반)과 같은 손맛을 유지한다.
    */
    return (
      <svg {...common}>
        <path
          d="M2 14.4c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 9.2c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.42"
        />
      </svg>
    );
  }

  if (name === "asterisk") {
    /*
      애스터리스크 ✳ — **8갈래**(수직·수평 + 대각 4). 45° 획은 중심에서 같은
      길이가 되도록 √2 로 나눈 좌표(12 ± 6.36)를 쓴다 — 그래야 여덟 갈래가
      같은 반지름의 별로 보인다(6/√2 ≈ 4.24 → 12±4.24 = 7.76 / 16.24).
    */
    return (
      <svg {...common}>
        <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <path d="M12 4.5v15" />
          <path d="M4.5 12h15" />
          <path d="M6.7 6.7l10.6 10.6" />
          <path d="M17.3 6.7L6.7 17.3" />
        </g>
      </svg>
    );
  }

  /*
    도넛 — 굵은 링. 면을 채우지 않아 밴드 위에서 "구멍"으로 읽힌다.
    획을 3.2 로 둬(다른 두 도형의 1.9보다 굵게) 세 도형이 같은 시각 무게를 갖는다
    — 원은 획 길이가 짧아 같은 굵기면 가늘어 보인다.
  */
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="6.4" stroke="currentColor" strokeWidth="3.2" />
    </svg>
  );
}
