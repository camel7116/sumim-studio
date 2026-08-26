"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { colorLab } from "@/content/site";
import {
  bandTokens,
  compose,
  contrast,
  mix,
  HUES,
  SLOTS,
  TONES,
  shift,
  type ComposedPalette,
  type Palette,
  type SlotKey,
} from "@/lib/palette";

/**
 * 색상 조합 실험 도구 (2026-08-21)
 *
 * 사용자: "색상 조합 실험을 파일이 아니라 **실제 홈페이지에서** 해보고 싶다."
 * 좌하단 플로팅 버튼 → 패널에서 색 6종 × 톤 4종(+ 커스텀 4슬롯)을 고르면 **지금 보고 있는
 * 화면에 바로 적용**된다. 엔진은 「스밈 컬러 시뮬레이터」 v2 와 같은 값을 쓴다(`lib/palette.ts`).
 *
 * 🚨 **적용 방식 — `globals.css` 는 건드리지 않는다.**
 * `<style id="color-lab-override">` 를 head 에 주입해 banded 팔레트 선택자들을 다시 선언한다.
 * "초기화"를 누르면 그 태그를 지워 **팀 팔레트로 즉시 복귀**한다(원본이 그대로라 되돌릴 게 없다).
 *
 * - 스위치는 `site.ts` 의 `colorLab` 하나뿐이다.
 *   ✅ 사용자 결정으로 **배포 후에도 유지**한다(2026-08-21). 선택은 보는 사람의 localStorage 에만
 *   남고 다른 방문자 화면이나 실제 팔레트에는 영향이 없다.
 * - 선택값은 localStorage 에 저장돼 새로고침해도 유지된다.
 */

const STORAGE_KEY = "sumim-color-lab";
const STYLE_ID = "color-lab-override";

type LabState = { hue: string; tone: string; custom: Palette | null };

/*
 * 🚨 **기본값 = 사이트의 실제 팔레트와 같아야 한다** (2026-08-23 라벤더 승격).
 * "초기화"는 주입 태그를 지워 `globals.css` 의 `[data-palette="lavender"]` 로 돌아가므로,
 * 패널의 선택 표시도 같은 조합(`lavender`/`base`)을 가리켜야 화면과 어긋나지 않는다.
 * `site.ts` 의 `bandedPalette` 를 `"team"` 으로 되돌린다면 여기도 `"team"` 으로.
 */
const DEFAULT_STATE: LabState = { hue: "team", tone: "base", custom: null };

/**
 * 주입 CSS 를 만든다.
 *
 * ⚠️ 선택자 접두사가 `html:root[data-visual="banded"][data-palette]` 인 이유:
 * `globals.css` 의 팀 블록이 `html[data-visual="banded"][data-palette="team"]`(0,3,0)이라
 * 같은 특이도로는 문서 순서에 기대야 하는데, dev 의 HMR 이 스타일 순서를 흔든다.
 * `:root` 를 하나 더 붙여 **(0,4,0) 으로 확실히 이긴다**. `[data-palette]` 는 존재만 보므로
 * team/navy 어느 쪽에서도 걸린다.
 */
function buildCss(v: ComposedPalette): string {
  const P = 'html:root[data-visual="banded"][data-palette]';
  const dark = bandTokens(v.dark);
  const light = bandTokens(v.light);
  const mist = bandTokens(v.mist);
  const hover = shift(v.accentBtn, 0, 6);
  const [ar, ag, ab] = [v.accent.slice(1, 3), v.accent.slice(3, 5), v.accent.slice(5, 7)].map((h) =>
    parseInt(h, 16),
  );
  const accentRgb = `${ar}, ${ag}, ${ab}`;
  const darkRgb = (() => {
    const h = v.dark.replace("#", "");
    return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`;
  })();

  const band = (sel: string, t: ReturnType<typeof bandTokens>) => `
${P} [data-band="${sel}"] {
  background-color: ${t.bg};
  --color-ink: ${t.ink};
  --color-ink-secondary: ${t.secondary};
  --color-ink-muted: ${t.muted};
  --color-line: ${t.line};
  --color-line-strong: ${t.lineStrong};
  --color-surface: ${t.surface};
  --color-surface-subtle: ${t.surfaceSubtle};
  --color-canvas: ${t.bg};
  color: var(--color-ink);
}`;

  return `/* color-lab 주입 — globals.css 원본은 그대로다. 초기화하면 이 태그가 사라진다 */
${P} {
  --color-cta: ${v.accentBtn};
  --color-cta-dark: ${shift(v.accentBtn, 0, -10)};
  --color-focus: ${v.accent};
}
${P} body { background-color: ${light.bg}; }
${band("paper", light)}
${band("mist", mist)}
${band("void", dark)}
${P} [data-band="void"] { color-scheme: dark; }

/* 액센트 버튼 — 면/글자/호버 (컴포넌트에 박힌 #F0650F 를 덮는다) */
${P} :is(a, button).bg-cta, ${P} :is(a, button).border-cta {
  color: ${v.accentInk};
}
${P} :is(a, button).bg-cta:hover, ${P} :is(a, button).border-cta:hover {
  background-color: ${hover};
  border-color: ${hover};
  color: ${v.accentInk};
}

/* 다크 밴드 위 액센트 **글자** — 4.5 확보용 밝은 파생 (워드마크 "!" 는 예외로 브랜드색 유지) */
${P} [data-band="void"] .text-cta { color: ${v.accentOnDark}; }
${P} [data-band="void"] .wordmark-glyph .text-cta { color: ${v.accent}; }

/* 미스트 밴드 위 액센트 **글자** — 4.5 확보용 어두운 파생 (2026-08-22).
   ⚠️ .band-deep 규칙(0,6,1)이 이보다 높아, 한 단계 진해진 밴드에서는 그쪽이 계속 이긴다 —
      진한 밴드는 자기 배경에 맞춰 --color-cta 를 20% 눌러 따로 계산하기 때문이다.
   (이 블록은 템플릿 리터럴 안이라 백틱을 쓰면 문자열이 끊긴다 — 코드명은 맨글자로 적는다) */
${P} [data-band="mist"] .text-cta { color: ${v.accentOnMist}; }

/* 한 단계 진해진 미스트(.band-deep) — 지금 사이트의 미스트 액센트 글자는 전부 여기 있다.
   globals 의 .band-deep 규칙(0,6,1)을 이기려고 같은 클래스를 두 번 쓴다(0,7,1). */
${P} [data-band="mist"].band-deep.band-deep .text-cta { color: ${v.accentOnMistDeep}; }

/* 네비 · 모바일 메뉴 */
${P} .site-nav[data-nav-band="dark"].bg-white\\/85 { background-color: rgba(${darkRgb}, 0.85); }
${P} #mobile-menu {
  --color-ink: ${light.ink};
  --color-ink-secondary: ${light.secondary};
  --color-line: ${light.line};
  --color-surface: ${light.surface};
  color: var(--color-ink);
}

/* Final CTA 폼 패널 */
${P} #contact .contact-panel {
  background-color: ${dark.surface};
  border: 1px solid ${dark.line};
}
${P} #contact .contact-panel :is(input, select, textarea)::placeholder { color: ${dark.muted}; }

/* Q&A 대화창 */
${P} .chat-panel { background-color: ${light.surfaceSubtle}; border-color: ${light.line}; box-shadow: 0 8px 32px rgba(0,0,0,0.07); }
${P} .chat-panel-title { color: ${light.muted}; }
${P} .chat-q { background-color: ${light.surface}; border-color: ${light.line}; }
${P} .chat-q-tail { background-color: ${light.surface}; border-bottom-color: ${light.line}; border-left-color: ${light.line}; }
${P} .chat-badge-q { border-color: ${light.lineStrong}; color: ${light.secondary}; }
${P} .chat-a { background-color: ${shift(v.accent, -35, 40)}; border-color: rgba(${accentRgb}, 0.45); }
${P} .chat-a-tail { background-color: ${shift(v.accent, -35, 40)}; border-top-color: rgba(${accentRgb}, 0.45); border-right-color: rgba(${accentRgb}, 0.45); }
${P} :is(.chat-q, .chat-a) { --color-ink: ${light.ink}; --color-ink-secondary: ${light.secondary}; color: var(--color-ink); }

/* 카드 · 배지 · 상담 바 */
${P} .card-surface { background-color: ${light.surface}; box-shadow: 0 6px 24px rgba(0,0,0,0.1); }
${P} .trade-badge { border-color: rgba(${accentRgb}, 0.45); color: ${v.accentBtn}; }
${P} .sticky-consult-bar { background-color: ${light.surface}; border-top-color: ${light.line}; box-shadow: 0 -8px 28px rgba(0,0,0,0.14); }
${P} .sticky-consult-bar .border-\\[\\#c6ccd8\\] { border-color: ${light.lineStrong}; }
${P} .sticky-consult-bar .text-\\[\\#141a26\\] { color: ${light.ink}; }
`;
}

function cssBlockForCopy(v: ComposedPalette, label: string): string {
  return `/* 스밈 banded 팔레트 — ${label} */
:root{
  --band-dark:${v.dark};
  --band-light:${v.light};
  --band-mist:${v.mist};
  --accent:${v.accent};
  --accent-btn:${v.accentBtn};
  --accent-ink:${v.accentInk};
  --accent-on-dark:${v.accentOnDark};
  --accent-on-mist:${v.accentOnMist};
  --accent-on-mist-deep:${v.accentOnMistDeep};
}
/* 적용: 이 블록을 클로드에게 주면 globals.css 의
   html[data-visual="banded"][data-palette="lavender"] 블록(= 지금 활성 팔레트)에 매핑합니다 */`;
}

/** localStorage 저장값 — 서버에서는 항상 null */
function readStored(): LabState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as LabState;
    if (!saved || typeof saved.hue !== "string") return null;
    /*
     * 🚨 **없어진 키를 여기서 씻어 낸다** (2026-08-21 재큐레이션 — 색 8→5 · 톤 6→4).
     * 렌더 쪽에도 `HUES.find(..) ?? HUES[0]` 폴백이 있어 오류는 안 나지만, 저장값이
     * `mono`/`lively` 로 남아 있으면 **패널에서 아무 항목도 선택 표시가 안 되는** 상태가 된다.
     * 읽는 순간 `HUES[0]`(= 2026-08-23 부터 `lavender`)/`base` 로 되돌려 저장값을 화면과 맞춘다.
     */
    const hue = HUES.some((h) => h.key === saved.hue) ? saved.hue : HUES[0].key;
    const tone = TONES.some((t) => t.key === saved.tone) ? saved.tone : TONES[0].key;
    return { hue, tone, custom: saved.custom ?? null };
  } catch {
    return null; // 저장값이 깨졌으면 기본값으로 간다
  }
}

/**
 * 하이드레이션이 끝났는지 — `useSyncExternalStore` 의 서버/클라이언트 스냅샷 차이로 판정한다.
 * 저장값 복원을 **effect 안의 setState 없이** 처리하기 위한 장치다(그 패턴은 cascading render 라
 * eslint `react-hooks/set-state-in-effect` 가 막는다). 하이드레이션 전에는 아무것도 렌더하지
 * 않으므로 서버 HTML 과 어긋날 일도 없다 — 플로팅 도구라 SSR 이 필요 없다.
 */
const subscribeNoop = () => () => {};

export function ColorLab() {
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<LabState>(() => readStored() ?? DEFAULT_STATE);
  const [active, setActive] = useState<boolean>(() => readStored() !== null);
  const [copied, setCopied] = useState(false);

  const hue = useMemo(() => HUES.find((h) => h.key === state.hue) ?? HUES[0], [state.hue]);
  const composed = useMemo(
    () => compose(state.custom ?? hue.v, state.tone, Boolean(state.custom)),
    [hue, state.tone, state.custom],
  );

  // 적용/해제 — style 태그 하나만 갈아 끼운다
  useEffect(() => {
    const existing = document.getElementById(STYLE_ID);
    if (!active) {
      existing?.remove();
      return;
    }
    const el = existing ?? Object.assign(document.createElement("style"), { id: STYLE_ID });
    el.textContent = buildCss(composed);
    if (!existing) document.head.appendChild(el);
  }, [active, composed]);

  // 저장
  useEffect(() => {
    if (!active) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* 저장 실패는 무시 — 화면 적용에는 영향이 없다 */
    }
  }, [active, state]);

  const pick = useCallback((next: Partial<LabState>) => {
    setState((s) => ({ ...s, ...next }));
    setActive(true);
  }, []);

  const setSlot = useCallback(
    (slot: SlotKey, value: string) => {
      setState((s) => {
        const base = s.custom ?? {
          dark: composed.dark,
          light: composed.light,
          mist: composed.mist,
          accent: composed.accent,
        };
        return { ...s, custom: { ...base, [slot]: value } };
      });
      setActive(true);
    },
    [composed],
  );

  const reset = useCallback(() => {
    setActive(false);
    setState(DEFAULT_STATE);
  }, []);

  const label = state.custom ? "커스텀" : `${hue.name} × ${TONES.find((t) => t.key === state.tone)?.name ?? ""}`;

  const copy = useCallback(() => {
    const text = cssBlockForCopy(composed, label);
    void navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => setCopied(false),
    );
    // 클립보드가 막힌 환경에서도 값을 볼 수 있게 콘솔에 남긴다
    console.info(text);
  }, [composed, label]);

  if (!colorLab || !hydrated) return null;

  const checks: { name: string; ratio: number; note?: string }[] = [
    { name: "다크 밴드 글자", ratio: contrast(bandTokens(composed.dark).ink, composed.dark) },
    { name: "라이트 밴드 글자", ratio: contrast(bandTokens(composed.light).ink, composed.light) },
    { name: "미스트 밴드 글자", ratio: contrast(bandTokens(composed.mist).ink, composed.mist) },
    {
      name: "포인트 버튼 글자",
      ratio: contrast(composed.accentInk, composed.accentBtn),
      note: composed.accentBtn !== composed.accent ? `버튼 전용 ${composed.accentBtn} 자동 생성` : undefined,
    },
    {
      name: "미스트 위 포인트",
      // 2026-08-22 — 파생 전 원색이 아니라 **실제로 칠해지는 accentOnMist** 를 잰다
      ratio: contrast(composed.accentOnMist, composed.mist),
      note:
        composed.accentOnMist !== composed.accent
          ? `어두운 파생 ${composed.accentOnMist}`
          : undefined,
    },
    {
      // 🚨 화면에 실제로 있는 자리 — 리뷰 섹션(유일한 미스트 밴드)이 `.band-deep` 이다
      name: "진한 미스트 위 포인트",
      ratio: contrast(
        composed.accentOnMistDeep,
        mix(bandTokens(composed.mist).ink, composed.mist, 0.14),
      ),
      note:
        composed.accentOnMistDeep !== composed.accent
          ? `진한 밴드 전용 ${composed.accentOnMistDeep}`
          : undefined,
    },
    {
      name: "다크 위 포인트 글자",
      ratio: contrast(composed.accentOnDark, composed.dark),
      note: composed.accentOnDark !== composed.accent ? `밝은 파생 ${composed.accentOnDark}` : undefined,
    },
  ];

  return (
    /*
      🚨 **모바일에서는 통째로 숨긴다** (2026-08-22 모바일 1차).
      패널이 320px 고정 폭 + 최대 70vh 라 390px 화면에서는 사실상 전체를 덮고, 버튼 자체도
      모든 섹션에서 본문 위에 겹쳐 앉았다(진단 캡처). 팀 실험용 **데스크톱 전용 도구**라
      모바일 방문자에게 필요하지도 않다 — `lg` 미만에서 `display:none`.
      (렌더 자체를 막지 않고 CSS 로 숨긴다: 창을 넓히면 그 자리에서 바로 살아난다)
    */
    <div className="fixed bottom-[92px] left-4 z-[70] hidden print:hidden lg:bottom-[104px] lg:left-5 lg:block">
      {open ? (
        <div
          role="dialog"
          aria-label="색상 조합 실험"
          className="mb-3 max-h-[70vh] w-[320px] overflow-y-auto rounded-[14px] border border-white/12 bg-[#14151a] p-4 text-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold tracking-[0.02em]">색상 조합</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-[12px] text-white/60 hover:bg-white/10 hover:text-white"
            >
              닫기
            </button>
          </div>
          <p className="mt-1 text-[11px] leading-[1.5] text-white/45">
            지금 화면에 바로 적용됩니다. 원본 CSS 는 그대로예요.
          </p>

          {/* 색 6종 (2026-08-23 라벤더 추가 — 첫 줄이 사이트 기본 팔레트) */}
          <div className="mt-3 space-y-1">
            {HUES.map((h) => {
              const on = !state.custom && h.key === state.hue;
              const tone = TONES.find((t) => t.key === state.tone) ?? TONES[0];
              return (
                <button
                  key={h.key}
                  type="button"
                  onClick={() => pick({ hue: h.key, custom: null })}
                  className={`flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-[12px] transition-colors ${
                    on ? "border-white/45 bg-white/10" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <span className="flex-1 truncate">{h.name}</span>
                  {SLOTS.map((k) => (
                    <span
                      key={k}
                      className="h-4 w-4 shrink-0 rounded-[3px] ring-1 ring-white/20"
                      style={{
                        background:
                          k === "dark" || k === "accent"
                            ? shift(h.v[k], tone.cS, tone.cL)
                            : shift(h.v[k], tone.nS, tone.nL),
                      }}
                    />
                  ))}
                </button>
              );
            })}
          </div>

          {/* 톤 4종 */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {TONES.map((t) => {
              const on = !state.custom && t.key === state.tone;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => pick({ tone: t.key, custom: null })}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
                    on ? "border-white/45 bg-white/10" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <i
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: shift(hue.v.accent, t.cS, t.cL) }}
                  />
                  {t.name}
                </button>
              );
            })}
          </div>

          {/* 커스텀 4슬롯 */}
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {SLOTS.map((k) => (
              <label key={k} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1.5">
                <input
                  type="color"
                  aria-label={`${k} 색`}
                  value={composed[k]}
                  onChange={(e) => setSlot(k, e.target.value)}
                  className="h-5 w-5 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <span className="font-mono text-[10.5px] tracking-tight text-white/70">
                  {composed[k].toUpperCase()}
                </span>
              </label>
            ))}
          </div>

          {/* 대비 검수 */}
          <div className="mt-3 rounded-lg border border-white/10 p-2">
            <p className="text-[11px] font-bold text-white/80">대비 검수 (4.5 이상 권장)</p>
            <ul className="mt-1 space-y-0.5">
              {checks.map((c) => (
                <li key={c.name} className="flex items-baseline gap-1 text-[11px] text-white/65">
                  <span className="flex-1 truncate">{c.name}</span>
                  <b className="text-white">{c.ratio.toFixed(1)}</b>
                  <span className={c.ratio >= 4.5 ? "text-[#7ee08a]" : "text-[#ffb4a2]"}>
                    {c.ratio >= 4.5 ? "✓" : "⚠"}
                  </span>
                </li>
              ))}
            </ul>
            {checks.some((c) => c.note) ? (
              <p className="mt-1 text-[10.5px] leading-[1.45] text-white/40">
                {checks.filter((c) => c.note).map((c) => c.note).join(" · ")}
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex gap-1.5">
            <button
              type="button"
              onClick={copy}
              className="flex-1 rounded-lg bg-white px-3 py-2 text-[12px] font-bold text-[#14151a] hover:bg-white/90"
            >
              {copied ? "복사했습니다" : "CSS 복사"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-white/20 px-3 py-2 text-[12px] text-white/75 hover:bg-white/10"
            >
              초기화
            </button>
          </div>
          <p className="mt-2 text-[10.5px] leading-[1.45] text-white/35">
            현재: {active ? label : "기본 팔레트(적용 안 함)"}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-[#14151a] px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] hover:bg-[#1e1f26]"
      >
        <span
          aria-hidden="true"
          className="h-3 w-3 rounded-full ring-1 ring-white/30"
          style={{ background: composed.accent }}
        />
        색상 조합
      </button>
    </div>
  );
}
