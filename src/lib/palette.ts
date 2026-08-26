/**
 * 팔레트 엔진 (2026-08-21)
 *
 * 「스밈 컬러 시뮬레이터」 v2(`홈페이지 제작/스밈 스튜디오/스밈 컬러 시뮬레이터.html`)의
 * `<script>` 로직을 **그대로** TS 로 옮긴 것이다. 색 **6종**(2026-08-23 라벤더 추가) · 톤 4종 · 명도 5~97 clamp ·
 * 버튼 전용색 자동 파생까지 값이 같아야 팀이 시뮬레이터에서 본 조합과 사이트가 일치한다.
 *
 * 화면 적용은 `components/ui/color-lab.tsx` 가 맡는다(이 파일은 순수 계산만).
 */

export type SlotKey = "dark" | "light" | "mist" | "accent";
export type Palette = Record<SlotKey, string>;

export const SLOTS: SlotKey[] = ["dark", "light", "mist", "accent"];

/** 유채(1) = 톤의 cS/cL 을 적용 / 무채(0) = nS/nL 을 적용 */
const CHROMA: Record<SlotKey, 0 | 1> = { dark: 1, accent: 1, light: 0, mist: 0 };

/**
 * 🚨 **재큐레이션 (2026-08-21, 사용자 "색상 조합이 전보다 이상해졌다" → 페이블 확정)**
 * 색 8종 → **5종**. 고른 기준은 "서로 확실히 다른 인상 + 대비가 무난한 것"이다.
 * (2026-08-23 사이트 기본이 라벤더로 바뀌면서 **라벤더 1종을 맨 앞에 추가해 6종**이 됐다.)
 *
 * | 남김 | 뺌 | 뺀 이유 |
 * |---|---|---|
 * | team · navy · forest · terrared · berry | `violet` | team 의 액센트(#6338ee)와 같은 보라 계열이라 인상이 겹쳤다 |
 * |  | `ink` | navy 와 거의 같은 남색 계열(다크 #0f1115 vs #141d33) — 선택지 구실을 못 했다 |
 * |  | `terra` | 신규 `terrared` 와 같은 테라코타 축이고 채도가 낮아 밀렸다 |
 * |  | `mono` | 무채 + 주황 액센트라 `미스트 위 포인트` 대비가 전체 최하(2.8)였다 |
 * |  | `limeinv` | 미라 피드백 "팀 예시와 같은 색의 재배치일 뿐, 배치가 이상함" — team 과 색 4개가 같고 light/mist 만 맞바꾼 조합 |
 *
 * `terrared`·`berry` 는 **미라 제공 팔레트**다. 원본은 "색 4개" 목록이라 어느 색이
 * dark/light/mist/accent 인지 정해져 있지 않았고, **4슬롯 매핑은 페이블 확정**이다 —
 * 가장 어두운 색 → dark, 흰색 → light, 남은 연한 색 → mist, 가장 채도 높은 색 → accent.
 *
 * ⚠️ 제거된 키가 localStorage 에 남아 있어도 `color-lab` 의 `readStored()` 가 **team/base 로
 *    씻어 내므로** 오류 없이 첫 조합으로 열린다.
 */
export const HUES: { key: string; name: string; v: Palette }[] = [
  /*
   * 🆕 **라벤더 (2026-08-23 사용자 결정 — 현재 사이트 기본 팔레트)**
   * team 에서 미스트만 라임 `#eaf6ad` → **라벤더 `#ece8fb`** 로 바꾼 조합이다.
   * 미스트가 액센트 바이올렛의 옅은 틴트라 화면의 유채색 축이 하나로 모인다.
   * 🚨 **목록 첫 줄에 둔다** — `readStored()` 의 폴백이 `HUES[0]` 이라 저장값이
   *    깨졌을 때도 사이트 기본값과 같은 조합으로 열려야 한다.
   * 톤 4종은 다른 색과 **똑같은 규칙**으로 자동 파생된다(미스트는 무채 슬롯이라 nS/nL 적용):
   *   기준 `#ece8fb` · 따뜻·친근 `#f3f0fd` · 고급·프리미엄 `#e5e0f9` · 깔끔·미니멀 `#f4f2fc`.
   * 대비 검수 7항목 × 톤 4종 = 28칸 전부 4.5 이상(최저 4.5 — 따뜻·친근의 다크 위 포인트).
   * ⚠️ 패널의 `진한 미스트` 줄은 **엔진 파생값**(라벤더 기준 `#cecbdc`)을 잰다. 반면
   *    globals 는 2026-08-23 결정으로 라벤더에서 `.band-deep` 을 **평평한 미스트로 무효화**
   *    했으므로(리뷰 밴드가 `#ece8fb` 그대로) 실제 배경은 파생값보다 **밝다** —
   *    즉 화면 대비가 패널 수치보다 높고, 패널 쪽이 보수적이다.
   */
  { key: "team", name: "블랙 × 라임 × 바이올렛", v: { dark: "#000000", light: "#ffffff", mist: "#eaf6ad", accent: "#6338ee" } },
  { key: "lavender", name: "블랙 × 라벤더 × 바이올렛", v: { dark: "#000000", light: "#ffffff", mist: "#ece8fb", accent: "#6338ee" } },
  { key: "navy", name: "네이비 × 주황", v: { dark: "#141d33", light: "#ffffff", mist: "#f0f3f8", accent: "#ea580c" } },
  { key: "forest", name: "딥그린 × 크림", v: { dark: "#12291f", light: "#fdfbf4", mist: "#eef0e4", accent: "#e8632b" } },
  { key: "terrared", name: "테라레드 × 크림", v: { dark: "#242222", light: "#ffffff", mist: "#F9ECE5", accent: "#D73220" } },
  { key: "berry", name: "차콜 × 베리", v: { dark: "#424242", light: "#ffffff", mist: "#CCCCCC", accent: "#BA1650" } },
];

/**
 * 채도=활기 / 명도=호감 축만 조절한다 (유채 cS·cL / 무채 nS·nL).
 *
 * 🚨 **재큐레이션 (2026-08-21)** — 톤 6종 → **4종**. 뺀 둘은 이동 폭이 커서 어색한 조합을
 * 만들던 주범이다: `lively`(cS **+20** / cL +12 — 액센트가 형광으로 튀었다) ·
 * `calm`(cL +9 인데 cS −13 이라 다크 밴드가 뿌옇게 떴다).
 * 남은 넷은 채도 이동이 −16~+5 로 좁아 어느 색을 골라도 원래 인상이 유지된다.
 */
export const TONES: { key: string; name: string; cS: number; cL: number; nS: number; nL: number }[] = [
  { key: "base", name: "기준", cS: 0, cL: 0, nS: 0, nL: 0 },
  { key: "warm", name: "따뜻·친근", cS: 5, cL: 12, nS: 4, nL: 2 },
  { key: "premium", name: "고급·프리미엄", cS: -12, cL: -9, nS: -3, nL: -2 },
  { key: "clean", name: "깔끔·미니멀", cS: -16, cL: 7, nS: -6, nL: 4 },
];

/* ---------- 색 변환 ---------- */

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l * 100];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h /= 6;
  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = l * 255;
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

/** 채도·명도를 더한다. **명도는 5~97 로 clamp** — 순백·순흑에서 뭉개지지 않게 */
export function shift(hex: string, ds: number, dl: number): string {
  const [h, s0, l0] = rgbToHsl(...hexToRgb(hex));
  const s = Math.max(0, Math.min(100, s0 + ds));
  const l = Math.max(5, Math.min(97, l0 + dl));
  return rgbToHex(...hslToRgb(h, s, l));
}

export function luminance(hex: string): number {
  return hexToRgb(hex)
    .map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    })
    .reduce((a, c, i) => a + [0.2126, 0.7152, 0.0722][i] * c, 0);
}

export function contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** 배경 위에 알파로 얹은 색을 **불투명 hex** 로 합성한다 (대비 계산은 불투명 색이어야 정확) */
export function mix(fg: string, bg: string, alpha: number): string {
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  return rgbToHex(
    f[0] * alpha + b[0] * (1 - alpha),
    f[1] * alpha + b[1] * (1 - alpha),
    f[2] * alpha + b[2] * (1 - alpha),
  );
}

const INK_DARK = "#171921";

/** 배경에 얹을 글자색 — 흰/먹 중 대비가 나은 쪽 */
export function bestInk(bg: string): string {
  return contrast("#ffffff", bg) >= contrast(INK_DARK, bg) ? "#ffffff" : INK_DARK;
}

export type ComposedPalette = Palette & {
  /** 버튼 면 전용 — 글자 대비 4.5 를 확보할 때까지 어둡게 내린 값 */
  accentBtn: string;
  /** 그 버튼 위 글자색 */
  accentInk: string;
  /** 다크 밴드 위 **액센트 글자** 전용 — 4.5 미달이면 밝게 올린 파생 */
  accentOnDark: string;
  /**
   * 미스트 밴드 위 **액센트 글자** 전용 — 4.5 미달이면 **어둡게 눌러** 확보한 파생 (2026-08-22).
   *
   * 🚨 이 슬롯이 없던 동안 `미스트 위 포인트` 가 20조합 중 15개에서 미달이었다
   * (2.2~4.2). 다크 밴드는 배경이 어두워 **밝히는** 방향이 정답이지만, 미스트는
   * 밝은 면이라 **누르는** 방향이라야 한다 — 그래서 `accentOnDark` 와 부호가 반대다.
   * 실제 쓰임: 라임(mist) 밴드의 스탯 라벨·별점 아이콘 같은 `.text-cta`.
   */
  accentOnMist: string;
  /**
   * 🚨 **한 단계 진해진 미스트(`.band-deep`) 위** 액센트 글자 (2026-08-22).
   *
   * 지금 사이트에서 미스트 밴드 위 `.text-cta` 는 **전부 `.band-deep` 안에 있습니다**
   * (병합된 리뷰 섹션이 유일한 미스트 밴드이고 그게 `.band-deep` 이다 — 실측).
   * 그래서 위 `accentOnMist` 만으로는 **검수 패널만 통과하고 화면은 그대로** 미달입니다.
   * 배경이 `color-mix(mist 86%, ink)` 로 한 단계 어두워지므로 **그 배경 기준으로 다시** 뺍니다.
   */
  accentOnMistDeep: string;
};

/** 시뮬레이터의 compose() — 톤 적용 + 버튼 전용색 파생 (+ 다크/미스트 위 액센트 글자 파생) */
export function compose(base: Palette, toneKey: string, isCustom: boolean): ComposedPalette {
  const t = TONES.find((x) => x.key === toneKey) ?? TONES[0];
  const out = {} as Palette;
  for (const k of SLOTS) {
    out[k] = isCustom ? base[k] : shift(base[k], CHROMA[k] ? t.cS : t.nS, CHROMA[k] ? t.cL : t.nL);
  }

  // 버튼 전용 포인트색 — 흰/먹 중 나은 글자색으로 4.5 확보, 안 되면 어둡게
  let btn = out.accent;
  let drop = 0;
  while (contrast(bestInk(btn), btn) < 4.5 && drop < 45) {
    btn = shift(btn, 0, -1.5);
    drop += 1.5;
  }

  // 다크 밴드 위 액센트 **글자** — 4.5 미달이면 밝게 올린다 (버튼 면과 달리 글자라 밝혀야 한다)
  let onDark = out.accent;
  let rise = 0;
  while (contrast(onDark, out.dark) < 4.5 && rise < 60) {
    onDark = shift(onDark, 0, 2);
    rise += 2;
  }

  /*
   * 미스트 밴드 위 액센트 **글자** — 4.5 미달이면 **어둡게 눌러** 확보한다 (2026-08-22).
   * 방향은 밴드 밝기로 정한다: 밝은 미스트(전 프리셋이 그렇다)면 내리고, 혹시 커스텀
   * 4슬롯으로 어두운 미스트를 넣으면 `accentOnDark` 처럼 올린다. 스텝 1.5 는 `accentBtn`
   * 파생과 같은 값이라 눌린 정도가 버튼 면과 같은 결로 보인다.
   */
  const mistIsLight = luminance(out.mist) > 0.45;
  const pressToward = (bg: string) => {
    let c = out.accent;
    let step = 0;
    while (contrast(c, bg) < 4.5 && step < 60) {
      c = shift(c, 0, mistIsLight ? -1.5 : 1.5);
      step += 1.5;
    }
    return c;
  };

  /*
   * `.band-deep` 배경 = globals 의 `color-mix(in srgb, var(--color-canvas) 86%, var(--color-ink))`
   * 와 **같은 계산**이다(미스트 86% + 그 밴드의 잉크 14%). 여기서 어긋나면 화면과 검수가 갈린다.
   */
  const mistDeep = mix(bandTokens(out.mist).ink, out.mist, 0.14);

  return {
    ...out,
    accentBtn: btn,
    accentInk: bestInk(btn),
    accentOnDark: onDark,
    accentOnMist: pressToward(out.mist),
    accentOnMistDeep: pressToward(mistDeep),
  };
}

/** 한 밴드에서 파생되는 토큰 묶음 */
export type BandTokens = {
  bg: string;
  ink: string;
  secondary: string;
  muted: string;
  line: string;
  lineStrong: string;
  surface: string;
  surfaceSubtle: string;
  isLight: boolean;
};

export function bandTokens(bg: string): BandTokens {
  const isLight = luminance(bg) > 0.45;
  const ink = isLight ? INK_DARK : "#ffffff";
  return {
    bg,
    ink,
    // 알파를 그대로 쓰지 않고 **합성한 불투명 hex** 로 둔다 — 카드 위에 얹혀도 색이 흔들리지 않는다
    secondary: mix(ink, bg, 0.72),
    muted: mix(ink, bg, 0.55),
    line: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.16)",
    lineStrong: isLight ? "rgba(0,0,0,0.24)" : "rgba(255,255,255,0.28)",
    surface: isLight ? "#ffffff" : shift(bg, 0, 6),
    surfaceSubtle: isLight ? shift(bg, 0, -3) : shift(bg, 0, 10),
    isLight,
  };
}
