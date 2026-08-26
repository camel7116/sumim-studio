/**
 * 사이트 전역 콘텐츠.
 * 카피 수정은 이 파일에서만 한다. (컴포넌트 코드 수정 불필요)
 * 기준: SUMIM_DESIGN_BIBLE_PHASE1.md §1, §8
 */

export const site = {
  nameKo: "스밈 스튜디오",
  nameEn: "SUMIM Studio",
  slogan: "브랜드를 만드는 사람들입니다.",
  subSlogan:
    "홈페이지를 만드는 데서 끝나지 않습니다.\n고객이 발견하고, 이해하고, 선택하는 흐름을 설계합니다.",
  positioning: "Brand Strategy · Web Experience · Marketing System",
  description:
    "브랜드 전략, 홈페이지 제작, SEO, 네이버 플레이스와 블로그 콘텐츠를 연결해 고객이 발견하고 선택하는 흐름을 설계합니다.",
  location: "Busan, Korea",

  // 2026-08-07 사용자 확정: 공식 이메일
  email: "sumimstudio@naver.com" as string | null,

  // 2026-08-08 사용자 확정: 상담 전화 — 플로팅 "상담문의" 버튼이 바로 전화 연결된다.
  phone: "010-4006-1002" as string | null,

  // TODO(미확정): 공식 SNS 채널 확정 후 URL 입력. null이면 노출하지 않는다.
  social: {
    instagram: null as string | null,
    threads: null as string | null,
  },

  // ✅ 2026-08-21 사용자 확정: 카카오톡 채널 (구 TODO 해소).
  // 이 값을 읽는 곳 — ① 하단 고정 상담 바의 "카카오톡 상담" 버튼
  //                  ② Final CTA "예약 없이 바로" 2버튼 중 카톡 쪽
  // 둘 다 새 탭(target="_blank" rel="noopener noreferrer")으로 연다.
  // null 로 되돌리면 두 자리 모두 문의 섹션(#contact / /contact)으로 폴백한다.
  chatbotUrl: "https://pf.kakao.com/_nkKSX/friend" as string | null,

  /**
   * ✅ **사업자등록번호 확정 (2026-08-26 사용자 제공)** — 상호 "스밈 스튜디오".
   * 푸터가 이 값이 있으면 "사업자등록번호 …", 없으면 "사업자 정보 준비 중"을 찍는다.
   *
   * ⚠️ `representative`(대표자명)·`address`(사업장 주소)는 **아직 미확정**이라 null 그대로다.
   *    `/privacy` 의 개인정보 보호책임자 항목도 이 둘이 정해져야 채울 수 있다.
   */
  business: {
    registrationNumber: "799-09-03319" as string | null,
    representative: null as string | null,
    address: null as string | null,
  },
} as const;

/**
 * ===== 남은 스위치 (2026-08-21 정리 패스) =====
 *
 * 파티클 셸(shell 모드)과 그 시절 실험 스위치는 전부 걷어냈다 —
 * `visualMode` · `particleShell` · `sectionAccentBlobs` · `serviceChannelIcons` ·
 * `finalCtaParticles` · `workDeviceMockup` · `qnaChatPanel` 은 **삭제**했고,
 * 각 컴포넌트는 지금 화면에 나가는 한 가지 모습만 그린다.
 * 되살리려면 `_archive/particle-shell-2026-08-21/` 의 스냅샷과 RESTORE.md 를 보면 된다.
 *
 * 지금 남아 있는 스위치는 아래 넷뿐이다:
 * | 스위치 | 값 | 무엇을 바꾸나 |
 * |---|---|---|
 * | `bandedPalette` | "lavender" | 라벤더 밴드(현재) ↔ "team"(라임) ↔ "navy"(수능선배 세트) |
 * | `colorLab` | true | 좌하단 "색상 조합" 실험 버튼·패널 |
 * | `bridgePhoneScreens` | 데모 2종 | 브릿지 폰 화면(null 이면 실제 포트폴리오로 복귀) |
 * | `deviceFrame` | "png" | 폰 목업을 실사 프레임 PNG 로 ↔ "css"(자작 CSS 폰) |
 * | `availability` | 8월·2건 | 티오 수치 단일 소스(스탯 + 하단 상담 바) |
 */

/**
 * 컬러 팔레트.
 *
 * - `"lavender"`(**현재 · 2026-08-23 사용자 결정** "라임 밴드가 겉돈다 → 라벤더로")
 *   검정 `#000000` / **라벤더 `#ECE8FB`** / 흰 `#ffffff` 밴드 + 액센트 바이올렛 `#6338EE`.
 *   미스트는 **액센트 바이올렛의 옅은 틴트**라 유채색이 하나로 모인다.
 *   한 단계 진한 밴드(`.band-deep`)는 `#D9D2F7`.
 * - `"team"` — **라임 복귀 스위치**. 2026-08-21 팀(김미라) 확정안인
 *   검정 `#000000` / 라임 `#EAF6AD` / 흰 `#ffffff` + 바이올렛 `#6338EE`.
 *   CSS 블록을 한 줄도 지우지 않았으므로 이 값만 넣으면 라임이 그대로 돌아온다.
 * - `"navy"` — 3차(수능선배)의 딥 네이비 `#141d33` / 연회청 `#f0f3f8` + 주황 `#EA580C`
 *   (globals 의 기본 banded 블록 그 자체 — 덮어쓰기가 아무것도 안 걸리는 상태).
 *
 * 구현: `layout.tsx` 가 `<html data-palette="…">` 로 내려보내고, `globals.css` 의
 * `html[data-visual="banded"][data-palette="lavender"]`(또는 `"team"`) 블록이
 * 기본 블록(= navy 값)을 덮어쓴다.
 */
export type BandedPalette = "team" | "navy" | "lavender";
export const bandedPalette: BandedPalette = "team"; // "lavender" 면 라벤더로 복귀

/**
 * 색상 조합 실험 도구 (좌하단 플로팅 "색상 조합" 버튼).
 *
 * 2026-08-21 사용자 요청: "색상 조합 실험을 파일이 아니라 **실제 홈페이지에서** 해보고 싶다."
 * 「스밈 컬러 시뮬레이터」 v2 의 엔진(색 8종 × 톤 6종 · 버튼 전용색 자동 파생 · 대비 검수)을
 * 그대로 옮겨 실제 화면에 실시간 적용한다. 구현: `components/ui/color-lab.tsx`.
 *
 * ✅ **사용자 결정으로 배포 후에도 유지한다 (2026-08-21)** — "색 조합은 도메인 개설 후에도 유지".
 *    끄고 싶어지면 이 값만 `false` 로 바꾸면 버튼·패널이 통째로 사라진다.
 *
 * - 적용은 `<style id="color-lab-override">` 주입 방식이라 **`globals.css` 원본은 불변**이다.
 *   "초기화"를 누르면 스타일 태그를 지워 **기본 팔레트(현재 라벤더)로 즉시 복귀**한다.
 * - 선택값은 **보는 사람의 localStorage(`sumim-color-lab`)에만** 저장된다 — 다른 방문자 화면이나
 *   실제 팔레트에는 영향이 없다.
 * - **팀이 조합을 고르면**: 패널의 "CSS 복사" 결과를 `globals.css` 의
 *   `html[data-visual="banded"][data-palette="lavender"]` 블록(= 지금 활성 팔레트)에
 *   반영하면 기본값이 바뀐다.
 */
export const colorLab: boolean = true;

/* =========================================================================
   시안 ③ — 하나의 오퍼 · 쉬운 말 · 큰 글씨 (2026-08-23 오후)
   -------------------------------------------------------------------------
   아래 네 스위치는 전부 **되돌릴 값이 주석에 적혀 있다**. 값 하나만 바꾸면
   2026-08-23 오전 모습으로 즉시 복귀한다.
   ========================================================================= */

/**
 * 🔀 **스위치 ③-a `offer.unified`** — 사이트의 CTA 문구를 **하나의 오퍼**로 통일한다.
 *
 * - **`true`(현재 · 기본)** : 네비·브릿지·Process·폼 제출이 전부 "무료 진단" 한 가지를 말한다.
 * - `false` : **2026-08-23 오전 라벨**(자리마다 다른 문구)로 그대로 복귀한다.
 *   되돌릴 값은 각 필드의 `…Original` 에 그대로 남겨 뒀다.
 *
 * 🚨 Final CTA **헤딩은 바꾸지 않는다**(사용자 확정 문구). 버튼 라벨만 통일한다.
 */
export const offer = {
  unified: true,

  /** 네비 우측 액센트 버튼 */
  navCta: "무료 진단",
  navCtaOriginal: "프로젝트 문의",

  /** 브릿지 밴드 안쪽 인라인 CTA */
  bridgeCta: "홈페이지 무료 진단 받기",
  bridgeCtaOriginal: "우리 홈페이지 문제 진단받기",

  /** Process 스티키 패널 CTA */
  processCta: "홈페이지 무료 진단 받기",
  processCtaOriginal: "상담 예약하기",

  /** 상담 폼 제출 버튼 */
  formSubmit: "무료 진단 신청하기",
  formSubmitOriginal: "프로젝트 문의하기",
} as const;

/** `offer.unified` 를 반영한 라벨 하나를 고른다 (컴포넌트가 분기를 알 필요가 없게) */
const pickOffer = (unifiedLabel: string, originalLabel: string) =>
  offer.unified ? unifiedLabel : originalLabel;

/**
 * 🔀 **스위치 ③-b `contactForm.mode`** — 상담 폼 항목 수.
 *
 * - **`"compact"`(현재 · 기본)** : 이름 · 연락처 · 업체명/홈페이지 주소 · 고민 한 가지 · 동의 **5칸**.
 *   40대 이상 사장님 타깃에서 8칸짜리 폼이 첫 장벽이 된다는 판단(§1 타깃).
 * - `"full"` : **2026-08-23 오전 폼**(이름·회사·연락처·이메일·서비스·예산·일정·설명) 그대로 복귀.
 *
 * 🚨 전송 페이로드 모양은 **두 모드가 같다** — compact 에서 빠진 칸은 **빈 문자열**로 보낸다
 *    (`<input type="hidden" value="">`). 그래서 `app/actions/contact.ts` 와 Web3Forms 본문
 *    조립이 손댈 것 없이 그대로 동작한다.
 * 🚨 compact 에서는 **이메일이 선택**이라 검증 스키마도 갈라진다
 *    (`lib/validation.ts` 의 `contactSchemaCompact` — 대신 **연락처가 필수**다).
 */
export const contactForm = {
  // 2026-08-24 사용자 지시 "문의쪽 줄어든 입력항목들 다시 원래대로 늘려주고" → `"full"` 로 복귀.
  // (compact 5칸 구성은 코드·라벨 그대로 보존 — 값만 "compact" 로 되돌리면 다시 나온다)
  mode: "full" as "compact" | "full",

  /** compact 전용 라벨·플레이스홀더 (full 모드에서는 쓰이지 않는다) */
  compact: {
    nameLabel: "이름",
    phoneLabel: "연락처",
    siteLabel: "업체명 또는 홈페이지 주소",
    sitePlaceholder: "예: 스밈 필라테스 / sumim.co.kr",
    concernLabel: "지금 가장 큰 고민 한 가지",
    concernPlaceholder: "예: 네이버에서 검색해도 우리 가게가 안 나와요",
  },
} as const;

/**
 * 🔀 **스위치 ③-c `copyMode`** — 서비스 태그라인과 Q&A 답변의 화법.
 *
 * - **`"plain"`(현재 · 기본)** : 사장님이 바로 알아듣는 말로 다시 씀.
 * - `"original"` : **2026-08-23 오전 문구**로 복귀. 원문은 지우지 않고
 *   `services.ts` 의 `tagline`, `site.ts` 의 `clientProblems.cards[].description` 에
 *   **그대로 남아 있다**(새 문구는 `taglinePlain` · `descriptionPlain` 이라는 별도 필드).
 */
export const copyMode: "plain" | "original" = "plain";

/**
 * 🔀 **스위치 ③-d `typeScale`** — 본문 글자 크기 단계.
 *
 * - **`"large"`(현재 · 기본)** : 본문 17px 고정 · 작은 글씨(caption) 13px 고정 ·
 *   라벨 14px 고정 · 서비스 카드 체크 항목 15px. 구현은 `globals.css` 의
 *   `html[data-type="large"]` 블록(토큰만 덮어쓴다 — 워드마크·섹션 헤딩은 건드리지 않는다).
 * - `"default"` : **2026-08-23 오전 값**(유동 clamp 16→17 / 12→13 / 13→14, 카드 항목 13.5px)으로 복귀.
 *
 * `layout.tsx` 가 `<html data-type="…">` 로 내려보낸다.
 */
export const typeScale: "large" | "default" = "large";

/**
 * 네비게이션 (문서 §7.1, §8.1)
 *
 * 🚨 **원페이지 메뉴** (2026-08-21) — 사용자 지시 "자사 홈피는 임팩트 있게 원페이지로.
 * 서비스 부분 넘어가는 건 없애고 싶어" 로 항목이 전부 **메인 섹션 앵커**다.
 * - ✅ **About 항목 추가 (2026-08-23)** — 메인에 대표 소개 섹션(`founder`, `#about`)이 생겨
 *   예고했던 대로 `{ label: "About", href: "#about" }` 를 Process 와 Contact 사이에 넣었다.
 *   되돌리려면 이 한 줄을 지우고 `founder.enabled` 를 `false` 로 내리면 된다.
 * - 메인이 아닌 경로(`/privacy` 등)에서는 `navigation.tsx` 가 `/#work` 형태로 바꿔 준다.
 * - 서브 페이지 라우트(`/work`·`/services`·`/about` …)는 **살아 있고** 네비에서만 빠졌다.
 *   (정리 패스 전에는 셸용 `menu`/`cta` 가 그쪽을 가리켰다 — 아카이브 site.ts 참고)
 */
export const navigation = {
  // 2026-08-07: 한글 메뉴 시험 후 영어 유지로 확정
  menu: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    // { label: "About", href: "#about" }, // 2026-08-23 대표 섹션 삭제와 함께 제거
    { label: "Contact", href: "#contact" },
  ],
  /** 🔀 라벨은 `offer.unified` 가 고른다 — false 면 "프로젝트 문의" 로 복귀 */
  cta: { label: pickOffer(offer.navCta, offer.navCtaOriginal), href: "#contact" },
} as const;

/**
 * 히어로 (2026-08-21 확정 — 초대형 워드마크 구성).
 *
 * 🚨 정리 패스에서 **지금 화면에 나가는 것만** 남겼다. 예전 구성의 카피
 * (셸 히어로 heading/description, 사옥 사진 캡션, manifesto 4줄, declaration lead/accentWord,
 * 회전 단어 목록, CTA 2개)는 `_archive/particle-shell-2026-08-21/content/site.ts` 에 그대로 있다.
 */
export const hero = {
  /**
   * 🔀 **스위치 ①(2026-08-23 오후) — `statementPlacement`**
   *
   * 2026-08-22 에 히어로에서 빼 뒀던 **선언문 3줄의 새 자리**(START_HERE §6-7 대기 항목)를
   * 워드마크 **바로 아래**로 정했다.
   *
   * - **`"below"`(현재 · 기본)** : 2줄 워드마크 아래에 [선언문 3줄 + 사실 한 줄]과
   *   [무료 진단 CTA + 작업 보기] 블록이 붙는다(≥1024px 2단, 그 미만 세로 스택).
   * - `"none"` : **2026-08-23 오전 모습**(워드마크만 있는 히어로)으로 그대로 복귀.
   *
   * 🚨 워드마크 **글자 골격(3칸 박스·자간·scaleX·weight)은 한 픽셀도 건드리지 않았다.**
   *    블록이 첫 화면에 같이 들어가도록 `globals.css` 의 `--hero-reserve`(세로 예산)만
   *    `[data-hero-statement="below"]` 에서 키운다 — 150px → **280px**(lg 이상) / 340px(그 미만).
   */
  statementPlacement: "below" as "below" | "none",
  /**
   * 선언문 아래 **사실 한 줄** (2026-08-23 신설).
   * 🚨 새 수치·실적이 아니다 — 지역(부산)·진행 방식(대표 직접)·예약제는 이미 사이트 곳곳에
   *    나가 있는 사실이다(`trustProof.note`, `availability`, `founder`).
   */
  // 2026-08-23 중복 제거: "부산 · 대표가 처음부터 끝까지 직접 진행 · 예약제 운영"
  //   → "대표가 처음부터 끝까지"는 대표 소개 섹션(`founder`) 한 곳에만,
  //     "예약제"는 라임 밴드(`trustProof.note`/`promises`) 한 곳에만 남긴다.
  // 2026-08-23 사용자 지시 "이전 카피라이팅으로" — 중복 제거 때 줄였던 문구를 복구(대표 섹션이 삭제돼 "대표 직접" 사실은 이제 여기만)
  factsLine: "부산 · 대표가 처음부터 끝까지 직접 진행 · 예약제 운영",
  /** 선언문 블록 오른쪽 CTA — 액센트 채움 버튼 / 그 옆 텍스트 링크 */
  statementCta: { label: "홈페이지 무료 진단 받기", href: "#contact" },
  statementLink: { label: "작업 보기 ↓", href: "#work" },

  /**
   * ✅ **선언문 3줄 — 2026-08-21 사용자 확정** (초안이 아니다. 임의로 바꾸지 말 것).
   *
   * **숨(breath) / SUM(더하다) 워드플레이** — 워드마크 `SUM!M` 의 이중 의미를 선언문이 받는다:
   * 1줄차 "숨을 불어넣습니다"(스밈 = 숨) · 2줄차 "가치를 **더합니다**"(SUM) ·
   * 3줄차가 둘을 매출로 묶는다(**마지막 줄만 굵게**).
   *
   * - 메이커리 문장을 번역·복제하지 않았다. **새 사실·수치가 없다** — 태도 선언이라
   *   표시광고 리스크가 없다.
   */
  wordmark: {
    /**
     * 🔁 **`layout: "single"` 용 보존값** — 2026-08-21 한 줄 구성(`SUM!M`)이 쓰던 필드다.
     * 값은 아래 `lines[0]` 과 **같다**. 지우지 말 것: `layout` 을 `"single"` 로 되돌리면
     * 컴포넌트가 이 세 필드(`text`/`accentIndex`/`accentGlyph`)만 읽어 예전 히어로가 그대로 나온다.
     */
    text: "SUMIM",
    /**
     * 위트 한 방 (메이커리의 `@` 자리) — **네 번째 글자 "I"(인덱스 3) 를 "!" 로** 바꿔 `SUM!M`.
     * 이 글자만 액센트색이고 나머지는 흰색이다. `accentGlyph: null` 이면 원래 글자를
     * 액센트색으로만 찍는다(치환 없이). 인덱스는 0부터 — S(0) U(1) M(2) **I(3)** M(4).
     * ⚠️ 인덱스를 잘못 잡으면 브랜드명이 깨진다(2 로 두면 M 이 사라져 "SU!IM" 이 된다).
     */
    accentIndex: 3,
    accentGlyph: "!" as string | null,

    /**
     * 🆕 **2줄 워드마크 (2026-08-22 팀 결정)** — `SUM!M` 한 줄이 레퍼런스(메이커리 `m@kery`)와
     * 너무 닮았다는 피드백에 따라 **STUDIO 를 아래 한 줄 더** 넣고 두 줄의 **잉크 폭을 같게** 맞춘다.
     *
     * - 위 줄: "I"(인덱스 3) → **"!"**  — 점이 **아래**
     * - 아래 줄: "I"(인덱스 4) → 소문자 **"i"** — 점이 **위**  ← 두 줄의 대비가 이 구성의 핵심이다.
     *   ⚠️ 소문자 "i" 는 **의도된 것**이다(대문자 사이에 높이 낮은 글자 하나). 대문자로 되돌리지 말 것.
     * - 인덱스는 0부터 — 아래 줄은 S(0) T(1) U(2) D(3) **I(4)** O(5).
     *
     * ⚠️ 글자·자간·폰트를 바꾸면 `hero.tsx` 의 `WM_LINES`(잉크폭/LSB/RSB/advance 표)를
     *    **픽셀 스캔으로 다시 실측**해야 한다.
     */
    lines: [
      { text: "SUMIM", accentIndex: 3, accentGlyph: "!" as string | null },
      {
        text: "STUDIO",
        accentIndex: 4,
        /**
         * 🔁 **되돌릴 값** — `accentFlipOf` 를 `null` 로 내리면 이 글자("i")가 그대로 찍힌다
         *    (2026-08-22~23 오전 구성). 지우지 말 것.
         */
        accentGlyph: "i" as string | null,
        /**
         * 🔀 **스위치 ⑤ — 아래 줄 액센트를 "위 줄 `!` 를 세로로 뒤집은 것"으로**
         *    (2026-08-23 사용자 **"히어로의 i부분은 !를 뒤집어서 만들어줘"**)
         *
         * - **`"!"`(현재 · 기본)** : 아래 줄 액센트 칸에 `accentGlyph` 대신 **위 줄과 똑같은 `!` 글리프**를
         *   찍고 **세로로 뒤집는다**(점이 **위**, 기둥이 **아래**로 내려가며 아래로 넓어짐).
         *   두 글자가 **획 굵기·폭이 완전히 같은 정확한 거울상**이 된다.
         *   🚨 뒤집기 축은 **줄 상자가 아니라 `!` 잉크의 세로 중심**이라, 뒤집은 뒤에도
         *      점 위끝 = 캡 높이 / 기둥 아래끝 = 베이스라인 으로 **위 줄 `!` 와 같은 세로 범위**를 차지한다
         *      (계산은 `hero.tsx` 의 `ACCENT_FLIP_ORIGIN_Y_EM` 주석 참고).
         * - `null` : 2026-08-22 구성으로 복귀 — 소문자 `accentGlyph`("i")를 뒤집지 않고 그대로 찍는다.
         *   액센트 칸의 폭·잉크 상수도 자동으로 "i" 값으로 되돌아간다.
         */
        accentFlipOf: "!" as "!" | null,
      },
    ],
    /**
     * 🆕 **한 줄 `SUMIM` 구성** (2026-08-24). `layout: "one-line"` 일 때 이 값만 읽는다.
     *
     * 사용자 지시가 같은 날 두 번 왔다 —
     *   ① "스튜디오는 없애고 SUMIM 만 남기는데, 느낌표도 그냥 i 로 설정"
     *   ② **"소문자 i 말고 원래 글자 I 그대로, 색만"** ← 최종. 그래서 `accentGlyph: null`.
     *
     * - 3칸 박스 골격은 그대로다 — **[SUM][I][M]**.
     * - `accentGlyph: null`(현재) : 치환 없이 **원래 `I`** 가 액센트색으로만 찍힌다.
     * - `"i"` 로 두면 소문자 `SUMiM`, `"!"` 로 두면 **예전 `SUM!M`** 이 그대로 돌아온다.
     *   기둥 폭·잉크 상수는 `hero.tsx` 의 `ACCENT_METRICS` 가 **글리프에 맞춰 자동으로** 고른다
     *   (세 글자 다 픽셀 스캔 실측값이 들어 있다).
     */
    oneLine: {
      text: "SUMIM",
      accentIndex: 3,
      accentGlyph: null as string | null,
    },
    /**
     * 🔀 **스위치 ⑤ — 글자 파도** (2026-08-24). 액센트를 뺀 좌·우 칸(`S·U·M` / `M`)에만
     * 건다. 액센트 칸은 **언제나 정지** — 기둥이 기준축이라 여기가 움직이면 워드마크가
     * 통째로 떠 보인다.
     *
     * | 값 | 화면 | 언제 |
     * |---|---|---|
     * | **`"fill"`** | **글자 윤곽은 고정·선명하고 글자 _안쪽 면_ 에 물결 띠 3겹이 흐른다** | **현재 · 2026-08-24 오후** |
     * | `"displace"` | 글자 **외곽선 자체**가 세로로 출렁인다(`feTurbulence` + `feDisplacementMap`) | 2026-08-24 오전 |
     * | `false` | 파도 없음 | — |
     *
     * 🚨 **마이그레이션** — 예전에는 `true`/`false` 불리언이었다. 예전 `true` = 지금의
     *    **`"displace"`** 다. 사용자 피드백 **"파도가 안 보여. 글자 안에서 파도치게"** 로
     *    기본값이 `"fill"` 로 바뀌었다(외곽 왜곡은 인지가 안 됐다). `"displace"` 구현은
     *    `hero.tsx` 의 `WaveDefs` 와 `globals.css` 의 `.wordmark-wave` 에 **그대로 살아 있다**.
     * ⚠️ `prefers-reduced-motion` 이면 두 모드 다 무늬가 **정지**한다(`"fill"` 은 물결이 선
     *    채로 남고, `"displace"` 는 필터가 통째로 꺼진다).
     */
    letterWave: "fill" as "fill" | "displace" | false,
    /**
     * 🔀 **스위치 ①** — 워드마크 구성. **되돌리는 법은 아래 표 그대로**.
     *
     * | 값 | 화면 | 언제 |
     * |---|---|---|
     * | **`"one-line"`** | **`SUMiM` 한 줄 · 3칸 박스 [SUM][i][M]** | **현재 · 2026-08-24** |
     * | `"two-line"` | `SUM!M` / `STUDiO` 두 줄 · 3칸 박스 | 2026-08-22~23 |
     * | `"single"` | `SUM!M` 한 줄 · 글자별 진입 + `markersSingle` 개 "+" 마커 | 2026-08-21 |
     *
     * ⚠️ `"one-line"` ↔ `"two-line"` 은 **같은 3칸 골격**이라 값만 바꾸면 되고,
     *    `"single"` 은 골격 자체가 다른 옛 구성이다(글자 하나하나가 칸).
     */
    layout: "one-line" as "one-line" | "two-line" | "single",
    /**
     * 🔀 **스위치 ②** — 진입 애니메이션. `"intro"` 를 뺀 나머지는 **글자는 처음부터 최종 위치에
     * 그대로** 있고 변형·필터가 없다(2026-08-22 사용자 지시 "글자가 움직이거나 일렁이면 안 됩니다").
     *
     * - **`"intro"`(현재 · 기본, 2026-08-24 사용자 확정)** : 검은 화면에서 **선언문 한 줄이
     *   화면 정중앙에 물결로 차오르며** 나타나고(A) → **제자리로 내려간 뒤**(B) →
     *   **SUMIM 다섯 글자가 한꺼번에** 같은 물결로 드러난다(C). 총 ≈3.85s.
     *   ← 사용자: **"홈페이지 입장할 때 검은 화면에서 '매출이 나는 홈페이지를 만듭니다.' 이 멘트가
     *      저 파도 치는 물결이 점점 상승하는 느낌으로 화면 정중앙에 글씨가 나타났다가
     *      지금 히어로 섹션 위치로 내려가고, 스밈의 I 도 다른 알파벳들이랑 같이 나타났으면 좋겠어."**
     *   🚨 **`I` 가 특별 취급되지 않는다** — `"split"` 의 Phase 1(액센트만 벽에서 먼저 슬라이드)은
     *      이 모드에서 **쓰지 않는다**. 타이밍·세부는 `hero.tsx` 의 "인트로 시퀀스" 상수 절.
     * - `"split"`(2026-08-23) : 덮개를 **3분할** — 좌측 박스 덮개와
     *   우측 박스 덮개 두 장만 두고 **액센트 기둥은 덮지 않는다**(그래서 "!"·"i" 는 t=0 부터 보인다).
     *   좌측은 기둥 왼쪽 경계에서 **왼쪽으로**, 우측은 기둥 오른쪽 경계에서 **오른쪽으로**
     *   동시에 걷힌다. 걷히는 앞단은 **그라데이션(부드러운 페더)** 이면서 등고선이
     *   **불규칙 지그재그**이고, 걷히는 동안 그 지그재그가 **천천히 꿈틀**거린다.
     *   ← 사용자: **"그라데이션을 3분할 해서 i랑 ! 에서 양쪽으로 퍼져나가게 해줘.
     *      그라데이션은 지그재그 모양으로 일렁거렸으면 좋겠어."**
     * - `"wipe"`(2026-08-23) : 워드마크 2줄 블록 전체를 덮은
     *   **배경색 덮개 한 장**이 **왼쪽 → 오른쪽으로 빠져나가며** 글자가 드러난다.
     *   덮개의 **왼쪽 앞단이 그라데이션**이라 경계가 딱딱하지 않다.
     *   ← 사용자: **"퍼져 나가는 모양이 너무 어색하네. 그라데이션을 주고 배경을 덮은 채로
     *      배경이 왼→오로 사라지게 하는 건 어때?"**
     * - `"spread"`(2026-08-22) : "!"·"i" 만 t=0 에 보이고, 덮개가 액센트 기둥 양옆에서
     *   **불규칙 지그재그**로 바깥쪽으로 걷힌다(+ 씨앗 구멍). 코드 보존 — 값만 바꾸면 복귀.
     * - `"wall"`(2026-08-21) : 벽 애니메이션. two-line 에서는 **칸 단위(3칸)** 로 동작한다.
     *
     * 🚫 중간안이던 `"burst"`(글자가 좌우로 미끄러져 나오고 물감 필터로 일렁임)는
     *    사용자 지시로 **폐기**했습니다.
     */
    enter: "intro" as "intro" | "split" | "wipe" | "spread" | "wall",
    /**
     * 🔀 **스위치 ②-B** — `enter: "wipe"` 에서 **"!"·"i" 를 덮개 위에 둘지**.
     * - **`false`(현재 · 기본)** : 액센트도 다른 글자처럼 와이프에 덮여 있다가 함께 드러난다.
     * - `true` : "!"·"i" 만 처음부터 보이고 나머지만 와이프된다(`spread` 의 결을 유지하고 싶을 때).
     * 두 값의 캡처는 `hero-wipe-b-keep0.png` / `hero-wipe-b-keep1.png` 참고.
     */
    wipeKeepAccent: false,
    /**
     * 🔀 **스위치 ③** — `enter: "spread"` 의 **씨앗점 개수**(줄마다).
     * **2**(현재) : 액센트 글자 말고도 글자 2개 한가운데에 **덮개 구멍**이 생겨
     *   **아주 천천히** 자라며 먼저 드러난다("전선이 오기 전 먼저 드러난 느린 섬").
     *   자리는 액센트 양옆 중 후보가 많은 쪽부터 번갈아 가운데 글자 — 위 줄 U·마지막 M /
     *   아래 줄 U·O (하드코딩 규칙, 난수 없음).
     * **0** : 액센트 한 곳에서만 퍼진다.
     * ⚠️ 씨앗은 주 퍼짐보다 0.2s 늦게 시작하고 **4.2s 짜리 성장 곡선**을 탄다
     *    (주 전선이 1.9s 안에 지나가며 흡수하므로 화면에서는 작은 섬으로만 보인다).
     */
    spreadSeeds: 2,
    /**
     * 🔀 ~~**스위치 ④** — 아래 줄 `STUDiO` 를 어느 변에 맞출지 (2026-08-22)~~
     *
     * 🚨 **2026-08-23 3칸 박스 구조가 되면서 이 스위치는 무시됩니다.** 두 줄이 같은 칸 골격
     *    (좌 박스 · 액센트 기둥 · 우 박스)을 쓰기 때문에 **왼끝·오른끝이 자동으로 함께** 맞습니다.
     *    필드는 되돌릴 때를 위해 지우지 않고 남겨 둡니다(아래는 2026-08-22 당시 설명).
     *
     * 🚨 **"!"와 "i" 의 잉크 중심 x 를 같게 하는 것이 최우선**(사용자 필수 지시)이라
     *    "두 줄 잉크 폭 동일"은 **포기**했다 — 둘은 양립하지 않는다(자세한 계산은 `hero.tsx`).
     * - `"left"`(현재) : 두 줄의 **왼쪽 잉크 끝**을 맞춘다. 아래 줄이 위 줄의 **0.8477배**라
     *   STUDiO 가 오른쪽에서 8.4% 짧게 끝난다.
     * - `"right"` : **오른쪽 잉크 끝**을 맞춘다. 이 경우 아래 줄이 위 줄의 **1.1792배**로
     *   **커져서** 왼쪽으로 27.5% 더 뻗는다(들여쓰기가 아니다 — `hero.tsx` 주석 참고).
     */
    studioAlign: "left" as "left" | "right",
    /**
     * ✅ 카피는 2026-08-21 사용자 확정본이다(초안 아님).
     *
     * 🔁 2026-08-22 에 "따로 넣을 거니까 일단 빼놔" 로 히어로에서 빠져 있었고,
     *    **2026-08-23 오후 `hero.statementPlacement: "below"` 로 워드마크 아래에 복귀**했다.
     *    `"none"` 으로 내리면 다시 화면에서 빠지고 문구만 여기 남는다(문자열은 손대지 말 것).
     *
     * 🚨 **2026-08-24 저녁 — 앞 두 줄은 히어로에서 제외**했다. 사용자: "밑에 선언문은
     *    '매출이 나는 홈페이지를 만듭니다'를 제외하고 다 지워주고, 매출이 나는 홈페이지를
     *    만듭니다 자체를 SUMIM 밑에 크게 놔둬줘." → **마지막 줄만** 워드마크 폭에 맞춘
     *    큰 `h1` 으로 나간다(`hero.tsx` 의 `HeroHeadline`). **문자열 3줄은 한 글자도 안 고쳤다** —
     *    3줄로 되돌리려면 `hero.tsx` 의 `HeroHeadline` 이 `statement[STATEMENT_LINE_INDEX]`
     *    하나만 읽는 부분을 예전처럼 `map` 으로 되돌리면 된다(마지막 줄만 굵게가 옛 규칙).
     */
    statement: [
      "브랜드에 숨을 불어넣습니다.",
      "보이지 않던 가치를 더합니다.",
      "매출이 나는 홈페이지를 만듭니다.",
    ],
    /** 🚫 위와 같이 **히어로에서 제외**(2026-08-22). 보존 — 배치는 추후 결정 */
    meta: "© 2026 SUMIM Studio · Busan",
    /**
     * 워드마크와 선언문 사이 "+" 마커 개수.
     * 🚨 **0 = 렌더 안 함**. 2026-08-22 팀 지적("메이커리와 똑같다")으로 **two-line 에서는 삭제**했다.
     * 필드는 보존한다(§7 반려 목록 참고 — 다시 켜자고 제안하지 말 것).
     */
    markers: 0,
    /** `layout: "single"` 로 되돌렸을 때 쓰는 마커 개수 — 2026-08-21 당시 값 **4** 를 보존 */
    markersSingle: 4,
  },
} as const;

/**
 * Proof Strip — 초기 실적이 부족하므로 과장 수치 없이 사실 기반 구성 (문서 §8.3)
 * TODO(미확정): 검증된 수치(완료 프로젝트, 검색 유입 증가 등)가 축적되면 교체.
 */
export const proofStrip = [
  "3 Selected Projects",
  "Strategy to Launch",
  "Web + Search + Content",
  "Busan, Korea",
] as const;

/**
 * Proof Strip 숫자 버전 (게이트)
 * TODO(미확정): 검증된 실적 수치가 확정되면 아래 배열에 4개 항목을 입력한다.
 * 값을 넣는 순간 Proof Strip이 텍스트 스트립에서 카운팅 버전으로 자동 전환된다.
 * 값이 null인 동안에는 기존 텍스트 스트립이 그대로 유지된다.
 * 예: [{ value: 12, suffix: "+", label: "Completed Projects" }, ...]
 * 주의: 검증되지 않은 수치를 임의로 만들지 않는다. (문서 §9.4, §15.2-1)
 */
export const proofStripStats:
  | { value: number; suffix: string; label: string }[]
  | null = null;

/**
 * 협력·클라이언트 로고 (게이트)
 * TODO(미확정): 실제 협력사/클라이언트 로고 사용 동의를 받은 뒤 아래 배열에 입력한다.
 * logo는 /public/images/partners/ 아래 실제 파일 경로여야 한다.
 * 값이 null인 동안에는 "함께한 브랜드" 섹션이 렌더되지 않는다.
 * 주의: 존재하지 않는 로고나 동의 없는 로고를 넣지 않는다. (문서 §15.2-1)
 */
export const partners:
  | { name: string; logo: string; width: number; height: number }[]
  | null = null;

export const brandStatement = {
  heading: "예쁜 화면보다 먼저,\n선택받는 이유를 정리합니다.",
  /**
   * heading 안에서 형광펜 하이라이트를 그을 구절.
   * heading 문자열에 마크업을 넣지 않기 위해 분리해 둔다.
   * heading에 없는 문자열이면 하이라이트 없이 그대로 렌더된다.
   */
  highlightTarget: "선택받는 이유",
  body: "브랜드가 무엇을 말해야 하는지,\n누구에게 어떻게 보여야 하는지,\n홈페이지 이후의 검색과 콘텐츠는 어떻게 이어질지 함께 설계합니다.",
} as const;

/** 협력 로고 바 라벨 (partners에 값이 있을 때만 노출) */
export const partnerStrip = {
  eyebrow: "PARTNERS",
  heading: "함께한 브랜드",
} as const;

/**
 * Client Problems (문서 §8.5)
 * 2026-08-03 사용자 시안 확정: 워드마크 + 중앙 헤딩 + 인용 카드 4개 + 하단 배너.
 * 카피는 전부 이 객체에서만 관리한다. (컴포넌트에 하드코딩 금지)
 */
export const clientProblems = {
  /**
   * 🔀 **스위치 (2026-08-23 오후) — `style`** : Q&A 섹션의 **형태**.
   *
   * 사용자 "카카오톡처럼 오는 부분은 눈에 들어오지가 않아서" → 더 눈에 띄고 훑기 쉬운
   * 대안 3종을 만들어 뒀다. 값 하나만 바꾸면 즉시 갈아 끼워진다(캡처 비교용).
   *
   * - **`"chat"`(현재 · 기본)** : 기존 카톡 대화창 패널 — **마크업 한 줄도 안 바꿨다.**
   * - `"sheet"` : **진단표** — 전폭 2열 표. 좌 45% 검정 셀(증상 0N + 제목) /
   *   우 55% 라임 셀(처방 + 답변). 행 사이 1px 검정 룰. `lg` 미만은 세로 스택.
   * - `"cards"` : **2×2 검정 카드** — 큰 바이올렛 번호 + 흰 제목 + 40px 바이올렛 룰 +
   *   회색 답변. 흰 밴드 위 검정 덩어리라 밴드 대비 자체가 시선이 된다.
   * - `"list"` : **큰 타이포 리스트** — 1px 검정 룰 4행, 좌 번호 / 32~40px 검정 헤드라인 /
   *   우 38% 답변. 행 hover 는 헤드라인 색만 바이올렛으로 바뀐다.
   *
   * 🚨 **2026-08-23 밤 추가 3종** — 위 4종이 전부 "박스 안 Q/A 4쌍"이라 사용자가
   *    "여전히 별로"로 반려했다. 아래 셋은 **형태가 아니라 개념이 다른** 안이다.
   * - `"check"` : **셀프 체크리스트** — 4행을 직접 눌러 체크하고(28px 정사각 체크박스),
   *   체크한 개수에 따라 하단 검정 요약 바 문구가 바뀐다. 유일하게 **인터랙티브**한 안이라
   *   구현이 `client-problems-check.tsx`(클라이언트 컴포넌트)로 갈라져 있다.
   * - `"ticker"` : **대형 티커** — 4개 문장을 전폭 마키 2줄(위 왼쪽·아래 오른쪽, 아래 줄은
   *   윤곽선 글자)로 흘려보내고, 그 아래에 답변 4개를 작은 4열 그리드로 받는다.
   * - `"root"` : **원인 한 문장** — 4개 문제를 작은 "증상 칩"으로 눌러 두고, 큰 글씨로
   *   원인 한 문장을 세운 뒤 우측에 "증상 → 처방" 4행을 붙인다.
   *
   * 🚨 **`"combo"`(2026-08-23 밤 · 사용자 선택)** — "체크와 티커 이 두개를 위아래로 같이
   *    해보자! 한 화면에 다 담기게끔". 위에서부터 **압축 헤딩 → 전폭 티커 2줄 →
   *    셀프 체크 2×2 → 검정 요약 바** 순서다. **세로 예산이 설계 제약**이라
   *    섹션 패딩까지 56/40px 로 줄여 1440×900 한 화면에 들어간다.
   *    부품은 새로 만들지 않았다 — 체크는 `layout:"grid" compact`, 티커는 `compact`.
   *
   * 🚨 7종 모두 **밴드는 흰색 고정**(위 라임 · 아래 검정 Process 와 교차 유지)이고,
   *    헤딩·Q/A 4쌍·`copyMode` 전환·직각 박스 규칙이 동일하다.
   *    구현은 `components/sections/client-problems.tsx` 의 서브 컴포넌트들.
   */
  style: "combo" as
    | "chat"
    | "sheet"
    | "cards"
    | "list"
    | "check"
    | "ticker"
    | "root"
    | "combo",
  /** 상단 워드마크 (기존 eyebrow 대체) — 네비게이션과 동일한 타이포 워드마크 */
  wordmark: { bold: "SUMIM", regular: " Studio" },
  heading: "혹시, 이런 상황이신가요?",
  description: "지역 사업자 상담에서 가장 많이 듣는 네 가지 문제입니다.",
  /**
   * `style: "sheet"`(진단표) 전용 셀 머리말 — 좌 검정 셀 / 우 라임 셀.
   * 다른 3종은 쓰지 않는다(번호만 쓴다).
   */
  sheetLabels: { symptom: "증상", prescription: "처방" },

  /* ---- `style: "check"`(셀프 체크리스트) 전용 카피 (2026-08-23 밤) ---- */
  /** eyebrow — 다른 섹션과 같은 액센트 틱 라벨에 들어간다 */
  checkEyebrow: "SELF CHECK",
  /** 헤딩 아래 안내 한 줄 (`description` 대신 이 안에서만 쓴다) */
  checkHint: "해당되는 항목을 눌러 보세요.",
  /** 하단 검정 요약 바 — 체크 0개일 때 */
  checkSummaryZero: "하나라도 해당되면 홈페이지가 아니라 '구조'의 문제일 수 있습니다.",
  /** 하단 검정 요약 바 — 1개 이상일 때. `{n}` 자리에 개수가 들어간다 */
  checkSummarySome: "{n}가지가 해당되시네요. 원인은 무료 진단에서 먼저 확인해 드립니다.",

  /* ---- `style: "ticker"`(대형 티커) 전용 카피 (2026-08-23 밤) ---- */
  /** 티커에서 문장 사이를 끊는 글자 — 액센트색으로 찍힌다 */
  tickerSeparator: "✕",
  /**
   * 티커에 흐르는 **사장님 고민 문장들** (2026-08-23 밤 · 사용자 "더 다양하게").
   *
   * 앞의 4개는 위 `cards` 의 질문과 같은 문장이고, 뒤의 8개는 티커 전용으로 더한 것이다.
   * 🚨 **짝수 번째는 윗줄 · 홀수 번째는 아랫줄**로 갈라져 각 줄이 **6문장씩 다르게** 흐른다
   *    (예전엔 두 줄이 같은 4문장을 반복했다). 순서를 바꾸면 어느 줄에 실릴지도 바뀐다.
   * ℹ️ 개수를 늘리면 한 바퀴가 길어져 **체감 속도가 느려진다** — 속도는 globals 의
   *    `--ticker-duration` 이 잡는다(현재 140s = 1440 기준 약 46px/s).
   */
  tickerPhrases: [
    "네이버에서 우리 업체가 잘 안 보여요",
    "플레이스 방문자는 있는데 상담⁠·⁠예약으로 이어지지 않아요",
    "홈페이지가 오래됐고 모바일에서 보기 불편해요",
    "경쟁업체와 다른 강점이 표현되지 않아요",
    "블로그를 올려도 문의가 안 와요",
    "홈페이지는 있는데 아무도 안 들어와요",
    "예쁘긴 한데 매출이랑 상관이 없어요",
    "검색하면 경쟁 업체만 먼저 나와요",
    "플레이스 리뷰는 많은데 전화가 없어요",
    "직접 고치려니 시간이 없어요",
    "사진만 있고 무슨 가게인지 안 보여요",
    "견적이 업체마다 너무 달라요",
  ],
  /** 티커 아래 가운데 한 문장 */
  tickerStatement: '전부 "홈페이지가 말을 안 해서" 생기는 일입니다.',

  /* ---- `style: "root"`(원인 한 문장) 전용 카피 (2026-08-23 밤) ---- */
  rootEyebrow: "DIAGNOSIS",
  /** 큰 선언 — 줄바꿈(\n)은 그대로 줄로 떨어진다 */
  rootHeadline: "증상은 네 가지지만,\n원인은 대개 하나입니다.",
  /** rootHeadline 안에서 액센트(바이올렛)로 찍을 낱말 — 없으면 강조 없이 렌더 */
  rootHighlight: "하나",
  rootBody:
    '홈페이지가 "무엇을 하는 곳인지"를 3초 안에 말해 주지 않기 때문입니다. 검색에서 안 보이고, 들어와도 예약으로 이어지지 않는 건 그 다음 문제입니다.',

  /**
   * 카드 제목에는 하드 줄바꿈(\n)을 넣지 않는다.
   * FlipCard가 text-balance + break-keep(keep-all)로 균형 잡힌 줄바꿈을 만든다.
   * description은 뒷면(플립)에서 노출된다.
   *
   * 🔀 **`copyMode` (2026-08-23)** — 답변(A 말풍선) 문구가 두 벌이다.
   *    - `"plain"`(현재) → `descriptionPlain` : 사장님이 바로 알아듣는 말.
   *    - `"original"` → `description` : **2026-08-23 오전 문구 그대로**.
   *    🚨 **질문(Q) 4개는 두 모드가 같다** — 문구를 손대지 않았다.
   */
  cards: [
    {
      title: "네이버에서 우리 업체가 잘 안 보여요",
      description: "검색과 네이버 채널이 연결될 기반을 만듭니다.",
      descriptionPlain:
        "플레이스 정보·키워드·홈페이지 검색 기본을 같이 손봐서 검색 결과에 나오게 만듭니다.",
    },
    {
      // "상담·예약"이 가운뎃점에서 줄바꿈되지 않도록 워드 조이너(U+2060) 삽입
      title: "플레이스 방문자는 있는데 상담⁠·⁠예약으로 이어지지 않아요",
      description: "방문자가 이해하고 행동하는 화면을 설계합니다.",
      descriptionPlain:
        "첫 화면에서 뭘 하는 곳인지 3초 안에 읽히게 고치고, 전화·예약 버튼을 손닿는 곳에 둡니다.",
    },
    {
      title: "홈페이지가 오래됐고 모바일에서 보기 불편해요",
      // 2026-08-19 사용자 지정 줄바꿈 — 답변 <p> 가 whitespace-pre-line 이라 \n 이 그대로 줄로 떨어진다
      description: "모든 기기에서 자연스럽게 보이는\n반응형 홈페이지를 제작합니다.",
      descriptionPlain: "휴대폰 화면 기준으로 다시 만듭니다. 글자 크기·버튼·속도까지요.",
    },
    {
      title: "경쟁업체와 다른 강점이 표현되지 않아요",
      description: "제작 후에도 브랜드가 계속 발견되도록 운영합니다.",
      descriptionPlain:
        "사장님 이야기에서 “여기여야 하는 이유”를 찾아 첫 문장으로 세웁니다.",
    },
  ],
  /**
   * 하단 배너 박스 — 2026-08-03 사용자 확정:
   * 좌측 메시지 2줄(왼쪽 정렬, 잉크색 + highlight 구절만 주황) / 우측 100% 환불 보증 스탯.
   */
  banner: {
    description: "브랜드를 기획하고, 매출이 성장하는 구조를 만듭니다.",
    /** description 안에서 주황(CTA)으로 강조할 구절 — 없으면 강조 없이 렌더 */
    highlight: "매출이 성장하는 구조",
    secondary: "높은 퀄리티를 위해 예약제로 진행됩니다.",
    /** 환불 보증 — 정책 약속이라 실적 수치 검증 이슈 없음 */
    stat: { value: "100%", caption: "불만족 시 100% 환불해드립니다." },
  },
} as const;

/**
 * 예약 티오 — **수치 단일 소스** (2026-08-20 3차).
 *
 * WHY SUMIM 스탯("N월 남은 티오")과 하단 고정 상담 바가 같은 값을 읽는다.
 * 한쪽에만 숫자를 적으면 두 곳이 어긋나므로 **반드시 여기서만** 바꾼다.
 * 🚨 검증된 값만 넣는다. 지어낸 수치 금지 (START_HERE §6).
 */
export const availability = {
  /** 남은 티오를 세는 기준 월 */
  month: 8,
  /** 남은 신규 프로젝트 티오 (검증된 값) */
  remainingSlots: 2,
} as const;

/**
 * 하단 고정 상담 바 (2026-08-20 3차 — banded 전용, 수능선배 레퍼런스 패턴)
 *
 * 화면 하단에 흰 바가 붙어 "지금 남은 티오 + 바로 연결되는 두 버튼"을 계속 들고 다닌다.
 * 구현: components/ui/sticky-consult-bar.tsx (1024px 이상에서만 노출)
 *
 * 🚨 문구의 수치는 위 `availability` 에서 파생한다 — 여기에 숫자를 직접 적지 않는다.
 * ⚠️ "얼마 남지 않았어요" 같은 **긴박·과장 문구 금지**. 사실만 적는다 (사용자 지시, 2026-08-20).
 */
export const stickyConsultBar = {
  badge: `${availability.month}월 예약`,
  message: `${availability.month}월 신규 프로젝트 티오가 ${availability.remainingSlots}건 남았습니다`,
  /** message 안에서 주황으로 찍을 구절 (없거나 못 찾으면 강조 없이 렌더) */
  highlight: `${availability.remainingSlots}건`,
  /** 보더 버튼 — href 는 컴포넌트가 site.phone 으로 만든다 */
  phoneCta: { label: "빠른 상담" },
  /**
   * 채움 버튼 — **카카오톡 채널** (2026-08-21 사용자 지시).
   *
   * 원래는 "프로젝트 문의하기"(→ `#contact`)였는데 **네비의 "프로젝트 문의"와 글자·목적지가
   * 똑같아 중복**이었습니다("헤더·아래쪽 둘 다 프로젝트 문의하기라 중복이니 아래쪽은 카톡으로").
   * 이제 이 바는 **다른 채널**(카톡)을 열고, 폼으로 가는 길은 네비 버튼이 맡습니다.
   *
   * href 는 컴포넌트가 `site.chatbotUrl` 에서 만듭니다 — 그 값이 null 이면 버튼이
   * 예전처럼 문의 섹션(`#contact` / `/contact`)을 가리키도록 폴백합니다.
   */
  kakaoCta: { label: "카카오톡 상담", fallbackHref: "#contact" },
} as const;

/**
 * 브릿지 밴드 문구 (2026-08-20 3차) — Work(흰)와 Process(회청) 사이에 끼우는
 * 텍스트만 있는 짧은 네이비 밴드. 구현: components/sections/statement-band.tsx
 *
 * 🚨 **초안 — 팀 검토 필요.** 새 사실·수치가 없는 태도 선언이라 표시광고 리스크는 없지만
 * 브랜드 화법이라 팀 확정 전이다. enabled 를 false 로 하면 밴드가 통째로 빠진다
 * (그 경우 Work(흰) → Process(회청)로 이어져 밴드 교차 규칙은 그대로 유지된다).
 */
export const bridgeStatement = {
  enabled: true,
  text: "말로 설명하지 않습니다.\n만든 것으로 보여드립니다.",
} as const;

/**
 * 브릿지 밴드 폰 2대의 화면 소스 (2026-08-21).
 *
 * 임시 데모 시안(가상 브랜드, 2026-08-21) — null 이면 실제 포트폴리오 모바일 캡처로 복귀.
 *
 * - `front` = 앞 폰(아이폰형·크고 밝게) / `back` = 뒤 폰(갤럭시형·작고 어둡게)
 * - 값이 있으면 `statement-band.tsx` 가 `projects.ts` 의 `mobileImage ?? fullImage` 대신
 *   이 두 장을 씁니다. **null 로 바꾸면 5차 규칙(실제 포트폴리오 모바일 캡처)이 그대로 복귀**합니다.
 * - 두 장 다 **가상 브랜드 데모**라 실적·후기가 아니고 표시광고 리스크가 없습니다
 *   (MOSS ATELIER 플랜테리어·라이트 / LUMEN PT 스튜디오·다크).
 * - 원본 HTML 은 `public/images/placeholder/src/demo-{a,b}.html` 에 보존 — 재캡처 조건은
 *   **390×844 · deviceScaleFactor 2**(= 780×1688 실픽셀), 모바일 캡처 3종과 같은 절차입니다.
 */
/*
 * ✅ **2026-08-23 오후 — `null` 로 되돌렸다**(시안 ②-b).
 *    가상 브랜드 데모 2종 대신 **실제 포트폴리오 모바일 캡처**가 다시 폰에 들어간다:
 *    `projects.ts` 의 `mobileImage ?? fullImage` 앞 2건
 *    = `/images/projects/moongyul-mobile.jpg` · `/images/projects/onseol-v2-mobile.jpg`.
 *
 * 🔁 **되돌리는 값** — 아래 두 줄을 그대로 살려 객체로 다시 넣으면 데모 시안으로 복귀한다:
 *      front: "/images/placeholder/bridge-demo-a2.jpg",
 *      back:  "/images/placeholder/bridge-demo-b.jpg",
 *    ⚠️ 파일명이 `bridge-demo-a2` 인 이유 (2026-08-21): 같은 경로로 시안을 교체했더니
 *       `/_next/image` 최적화 캐시가 **옛 그림을 계속 서빙**했다. URL 을 바꾸는 것이 가장
 *       확실한 무효화라 이름을 바꿨다 — 시안을 갈아 끼울 때는 **새 파일명**을 쓸 것.
 */
export const bridgePhoneScreens: { front: string; back: string } | null = null;

/**
 * 폰 목업을 **무엇으로 그릴지** (2026-08-23).
 *
 * 사용자: "CSS 로 그린 폰이 납작하고 애매하다 — **진짜 기기 프레임 PNG** 로 바꿔줘."
 *
 * - `"png"`(**현재**) — `components/ui/phone-frame.tsx` 가 실사 아이폰 17 Pro Max 프레임
 *   PNG(`public/images/devices/iphone-17-pro-max.png`, 389×800, 화면 구멍까지 투명)를 씌운다.
 *   라이선스는 `public/images/devices/LICENSE.txt` (Mobile FIRST — 상업적 사용 허용,
 *   출처 표기 불필요, 파일 단독 재판매만 금지).
 * - `"css"` — **되돌리는 값**. 2026-08-20 4차의 **자작 CSS 폰**(둥근 사각 + 다이내믹
 *   아일랜드/펀치홀 + 유리 반사)이 그대로 돌아온다. 코드는 한 줄도 지우지 않았다
 *   (`statement-band.tsx` 의 `CssPhoneFrame`, `device-mockup.tsx` 의 CSS 폰 분기).
 *
 * 적용되는 곳은 두 군데다 — 브릿지 밴드의 폰 2대(`statement-band.tsx`), Work 카드에서
 * 브라우저 목업 앞에 서는 작은 폰(`device-mockup.tsx`). **브라우저(데스크톱) 목업은
 * 어느 값에서도 CSS 그대로**다.
 *
 * ⚠️ PNG 프레임은 비율이 **389/800 = 0.4863** 이라 CSS 폰(9/19.5 = 0.4615)보다 5.35% 넓다.
 *    브릿지는 **폭(= 두 폰의 겹침 7%)을 지키는 쪽**을 택해 높이를 88%→83.53% ·
 *    80%→75.93% 로 줄였다(값은 `statement-band.tsx` 주석 참고). `"css"` 로 되돌리면
 *    높이도 원래 값으로 같이 돌아간다.
 */
export type DeviceFrameMode = "png" | "css";
export const deviceFrame: DeviceFrameMode = "png"; // "css" 면 자작 CSS 폰으로 복귀

/**
 * 약속 섹션 라벨 (2026-08-20 6차 — 메이커리 "Special Point" 자리).
 *
 * 약속 카드가 TrustProof 안에 있던 것을 **독립 섹션으로 승격**하면서 필요해진 라벨이다.
 * 헤딩은 새로 쓰지 않고 기존 `trustProof.heading`(+highlight)을 그대로 가져온다 —
 * 새 카피를 만들지 않기 위해서다. 카드는 여전히 `trustProof.promises` 의 enabled 만 나간다.
 */
/**
 * 2026-08-23 중복 제거: 약속 2건(환불 100% · 예약제 소수정예)은 **라임 밴드 한 곳**
 * (`testimonial-marquee.tsx`)에만 남기기로 해서 병합 섹션(`service-system.tsx`)의
 * OUR PROMISE 컬럼이 통째로 빠졌다. 그래서 이 라벨은 **현재 아무 곳에서도 쓰이지 않는다**
 * (라임 밴드는 `reviewBand.eyebrowWhilePlaceholder` 를 쓴다).
 * 되돌릴 때를 위해 필드는 남겨 둔다.
 * (아직 참조하는 곳은 `promise-cards.tsx` 뿐인데 그 파일도 페이지 배열에서 빠진 보존본이다)
 */
export const promiseSection = {
  /** ⚠️ 화면에 나가지 않음 (2026-08-23~) — 복구하려면 service-system.tsx 의 약속 컬럼을 되살릴 것 */
  eyebrow: "OUR PROMISE",
} as const;

/**
 * 포지션 선언 + 후기 **병합 섹션** (2026-08-21 병합·연화, 페이블).
 *
 * 6차에서 따로 서 있던 **포지션 밴드(네이비)** 와 **후기 마키(라임)** 를 사용자 지시로
 * **한 섹션(라임)** 으로 합쳤습니다 — 좌측 컬럼에 선언 + 검증 스탯, 우측 컬럼에 후기 마키.
 * 렌더는 `components/sections/testimonial-marquee.tsx` 한 곳이고
 * `position-band.tsx` 는 되살릴 수 있게 **파일만 보존**(페이지 배열에서 빠짐)합니다.
 *
 * - `heading` 은 **기존 포지션 문구 그대로**입니다(2026-08-21 사용자 "이 멘트는 유지").
 *   그 사이 잠깐 있었던 후기 전용 헤딩·서브("포장 없는 후기…" / "이 자리는…")는 **삭제**했습니다.
 * - 🚨 평점·건수(메이커리의 "4.9 / 1000+")도, 가격·비교 수치도 **쓰지 않습니다**
 *   (검증된 값이 없고 표시광고 리스크 — START_HERE §6 🚨). 후기 5건은 전부 자리표시 그대로.
 * - 스탯은 `trustProof.stats` 중 **검증된 값만** 가져옵니다(지어내지 않음).
 * - `enabled: false` 면 섹션이 통째로 빠지고 Services(흰) → Q&A(흰)가 붙으므로,
 *   끌 때는 **밴드 교차를 다시 확인**해야 합니다(예전 포지션 밴드와 달라진 점).
 */
export const reviewBand = {
  enabled: true,
  eyebrow: "REVIEWS",
  /**
   * 2026-08-23 중복 제거 — 약속 2건이 이 밴드 **한 곳**으로 모이면서(병합 섹션의
   * OUR PROMISE 컬럼 제거), 마키가 감춰진 동안 이 밴드의 내용은 사실상 "약속"이다.
   * 그래서 `trustProof.testimonialsArePlaceholder && hideMarqueeWhilePlaceholder`
   * 인 동안에는 eyebrow 를 `REVIEWS` 대신 이 값으로 바꿔 단다.
   * 실후기가 들어오면(=플래그가 false) 자동으로 `eyebrow`("REVIEWS")로 돌아간다.
   */
  eyebrowWhilePlaceholder: "OUR PROMISE",
  heading: "거품 없는 견적,\n타협 없는 퀄리티.",
  /**
   * 마키 카드 **바로 위** 작은 라벨 (2026-08-21 사용자 요청 "리뷰 카드 위에 멘트").
   *
   * 🚨 **"실제 업체 대표님들의 후기입니다" 로 쓸 수 없습니다** — 후기 5건이 전부 자리표시라
   *    지금 그 문장은 사실이 아닙니다(지어내기 금지 원칙 · 표시광고법).
   *    그래서 `trustProof.testimonialsArePlaceholder` 로 두 문장을 **자동 전환**합니다:
   *    - `true`(현재)  → `placeholder` : 자리라는 것을 그대로 말합니다.
   *    - `false`(실후기 입력 시) → `real` : 그때 비로소 "실제" 가 사실이 됩니다.
   *    실후기를 넣으면서 플래그만 내리면 문구가 알아서 바뀌므로 **여기서 고칠 것이 없습니다.**
   *
   * ✅ **`real` 문구는 사용자 확정 2026-08-22** — "실제 업체 대표님들의 소중한 후기입니다."
   *    (이전 초안 "함께한 대표님들이 직접 남긴 이야기입니다." 대체)
   * 🚨 `placeholder` 는 그대로입니다. 후기 5건이 전부 자리표시인 **지금** 이 문장을 쓰면
   *    허위 주장이 되므로, `testimonialsArePlaceholder` 가 false 가 되기 전에는
   *    확정 문구가 화면에 나가지 않습니다.
   */
  marqueeNote: {
    placeholder: "함께한 대표님들의 이야기가 담길 자리입니다.",
    real: "실제 업체 대표님들의 소중한 후기입니다.",
  },
  /**
   * 🔀 **스위치 ②-a (2026-08-23)** — 후기가 **자리표시인 동안** 마키를 아예 감춘다.
   *
   * - **`true`(현재 · 기본)** : `trustProof.testimonialsArePlaceholder` 가 `true` 인 동안
   *   ① 후기 마키 ② 그 위 캡션("…담길 자리입니다.")이 **렌더되지 않는다.**
   *   헤딩과 검증 스탯 2개는 그대로 남고, 빈 라임 덩어리가 되지 않도록
   *   **섹션 패딩을 한 단계 줄이고** 스탯 아래에 `trustProof.promises` 중 `enabled: true`
   *   두 건을 **짧은 2칸 줄**로 세워 내용을 채운다.
   * - `false` : **2026-08-23 오전 모습**(자리표시 후기 5장이 마키로 흐르고 캡션도 나감)으로 복귀.
   *
   * 🚨 실제 후기가 들어와 `testimonialsArePlaceholder` 가 `false` 가 되면 이 스위치와
   *    **무관하게** 마키·캡션이 자동으로 돌아온다(조건이 둘 다 참일 때만 감춘다).
   */
  hideMarqueeWhilePlaceholder: true,
} as const;

/**
 * Trust Proof 섹션 (2026-08-08 사용자 요청 — 레퍼런스 구조 차용)
 * 문제 섹션 하단 배너를 이 섹션의 헤딩으로 승격시키고,
 * 스탯 카운트업 + 후기 무한 마키를 붙인다.
 */
export const trustProof = {
  eyebrow: "WHY SUMIM",
  heading: "스밈 스튜디오는 브랜드를 기획하고\n매출이 성장하는 구조를 만듭니다.",
  /** heading 안에서 주황(CTA)으로 강조할 구절 */
  highlight: "매출이 성장하는 구조",
  note: "높은 퀄리티를 위해 예약제로 진행됩니다.",
  /**
   * 스탯: value가 null이면 렌더에서 제외된다.
   * TODO(미확정): 고객만족도는 검증된 설문·후기 평균이 확보되면 숫자를 넣는다.
   * (근거 없는 수치는 표시광고법 리스크가 있어 비워 둔다 — 2026-08-03 원칙)
   */
  stats: [
    // 2026-08-20 3차: 수치·월을 availability 한 곳에서만 관리한다 (하단 상담 바와 같은 소스)
    {
      label: `${availability.month}월 남은 티오`,
      value: availability.remainingSlots as number | null,
      decimals: 0,
      suffix: "건",
      note: "예약제 운영",
    },
    { label: "고객만족도", value: null as number | null, decimals: 1, suffix: "%", note: "설문 기준" },
    { label: "불만족 시 환불", value: 100, decimals: 0, suffix: "%", note: "전액 환불 보증" },
  ],
  /**
   * 약속 카드 (2026-08-20 banded 리디자인 — 메이커리 스튜디오 "약속 카드" 패턴).
   *
   * 🚨 **enabled: true 는 이미 검증·확정된 약속만.** 화면에는 enabled 인 항목만 렌더된다.
   * 미확정 약속을 화면에 내보내면 표시광고법 리스크가 있다 (START_HERE §6 🚨).
   * 팀에서 확정되면 해당 항목의 enabled 만 true 로 바꾸면 바로 노출된다.
   */
  promises: [
    {
      // 근거: clientProblems.banner.stat / stats "불만족 시 환불 100%" — 기존 확정 정책
      title: "불만족 시 100% 전액 환불",
      desc: "결과물이 만족스럽지 않으면 전액 돌려드립니다.",
      enabled: true,
    },
    {
      // 근거: trustProof.note "높은 퀄리티를 위해 예약제로 진행됩니다" + stats "8월 남은 티오 2건"
      title: "예약제 소수 정예 운영",
      desc: "동시에 맡는 프로젝트 수를 제한하고 예약 순서대로 진행합니다.",
      enabled: true,
    },
    {
      // TODO: 팀 확정 필요 — 수정 횟수 정책이 process.ts 06 에도 note: null 로 비어 있다.
      // 무제한이 실제 운영 가능한지 확인 전까지 화면에 내보내지 않는다.
      title: "무제한 수정",
      desc: "확정 전까지 수정 횟수를 세지 않습니다.",
      enabled: false,
    },
    {
      // TODO: 팀 확정 필요 — 월 몇 건으로 한정하는지 수치가 없다. 숫자를 지어내지 않는다.
      title: "월 작업량 한정",
      desc: "한 달에 진행하는 프로젝트 수를 정해 두고 받습니다.",
      enabled: false,
    },
  ] as { title: string; desc: string; enabled: boolean }[],
  /**
   * TODO(미확정): 실제 고객 후기로 교체할 자리.
   * 실제 후기를 받기 전까지 지어낸 후기를 쓰지 않는다 (허위 후기 = 표시광고법 위반).
   */
  testimonialsArePlaceholder: true,
  testimonials: [
    {
      quote: "실제 고객 후기가 들어갈 자리입니다. 프로젝트 완료 후 받은 후기를 이곳에 넣습니다.",
      author: "○○○ 대표님",
      company: "업종 공개 예정",
    },
    {
      quote: "후기 자리 2. 어떤 문제로 찾아왔고 무엇이 달라졌는지가 담기면 가장 좋습니다.",
      author: "○○○ 대표님",
      company: "업종 공개 예정",
    },
    {
      quote: "후기 자리 3. 진행 과정에서 인상 깊었던 점을 그대로 옮겨 적습니다.",
      author: "○○○ 대표님",
      company: "업종 공개 예정",
    },
    {
      quote: "후기 자리 4. 오픈 이후 문의·예약이 어떻게 바뀌었는지 적어 두면 설득력이 높습니다.",
      author: "○○○ 대표님",
      company: "업종 공개 예정",
    },
    {
      quote: "후기 자리 5. 짧아도 좋습니다. 사장님의 표현을 다듬지 않고 그대로 싣습니다.",
      author: "○○○ 대표님",
      company: "업종 공개 예정",
    },
  ],
} as const;

export const difference = {
  eyebrow: "SUMIM DIFFERENCE",
  heading: "하나의 결과물이 아니라,\n하나의 성장 구조를 만듭니다.",
  axes: [
    { number: "01", title: "Strategy", description: "선택받아야 할 이유를 정리합니다." },
    {
      number: "02",
      title: "Experience",
      description: "방문자가 이해하고 행동하는 화면을 설계합니다.",
    },
    {
      number: "03",
      title: "Search",
      description: "검색과 네이버 채널이 연결될 기반을 만듭니다.",
    },
    {
      number: "04",
      title: "Content",
      description: "제작 후에도 브랜드가 계속 발견되도록 운영합니다.",
    },
  ],
} as const;

export const team = {
  eyebrow: "ABOUT THE TEAM",
  heading: "우리는 각자의 경험을\n하나의 방향으로 모읍니다.",
  members: [
    {
      name: "한병선",
      role: "Brand Direction · Web Planning",
      // TODO(미확정): 짧은 소개 문구 확정 후 입력. null이면 노출하지 않는다.
      intro: null as string | null,
    },
  ],
  // TODO(미확정): 팀원 확정 후 추가. 실명을 임의 생성하지 않는다. (문서 §8.11)
  note: "팀 소개는 준비 중입니다. 확정되는 대로 업데이트됩니다.",
} as const;

/**
 * 본문 흐름 중간 CTA 2개 (2026-08-21 — 팀원 클로드의 CTA 평가 수용).
 *
 * 지적: **세로 2,071~9,384px 구간에 CTA 가 하나도 없고**, Work~FAQ 6개 섹션이
 * 다음 행동을 제시하지 않는다. → 큰 밴드를 새로 만들지 않고 **섹션 안쪽 마무리 블록**으로
 * 두 군데만 넣는다(밴드 리듬 불변, 버튼은 액센트 채움 1개씩).
 *
 * - `bridge`  : 결과물을 본 직후(브릿지 밴드) — "이런 게 필요한가?" 를 묻는 자리
 * - `process` : 과정을 다 읽은 직후(Process 끝) — 예약으로 넘어가는 자리
 *
 * 🚨 **새 주장·수치를 넣지 않는다.** 두 문구 다 이미 화면에 있는 사실만 말한다
 *    (브릿지 = 위 폰 목업이 보여주는 결과물 / Process = 방금 읽은 8단계 그대로).
 *    하단 고정 상담 바가 이미 전 구간을 덮으므로 **인라인 톤**으로 눌러 둔다.
 */
export const inlineCta = {
  bridge: {
    note: "이런 결과물이 필요하신가요?",
    /** 🔀 `offer.unified` 가 고른다 — false 면 "우리 홈페이지 문제 진단받기" 로 복귀 */
    label: pickOffer(offer.bridgeCta, offer.bridgeCtaOriginal),
    href: "#contact",
  },
  /**
   * Process — **버튼만** 있습니다 (2026-08-21 사용자 지시 "문구 삭제, 버튼만 라인 아래쪽").
   * 자리도 섹션 끝 → **좌측 스티키 패널의 진행 라인 아래**로 옮겨 01~08 내내 따라옵니다.
   * (지워진 문구: "이 과정 그대로 진행합니다.")
   */
  process: {
    /** 🔀 `offer.unified` 가 고른다 — false 면 "상담 예약하기" 로 복귀 */
    label: pickOffer(offer.processCta, offer.processCtaOriginal),
    href: "#contact",
  },
} as const;

/**
 * 대표 소개 섹션 (2026-08-23 시안 ② — 신설, `components/sections/founder.tsx`).
 *
 * 자리: **FAQ(흰) 다음 · Final CTA(검정) 앞 → 라임 밴드**. 앞뒤가 흰·검정이라
 * 밴드 교차 규칙이 그대로 유지된다(START_HERE §3).
 * 네비 `About` 항목이 이 섹션(`#about`)을 가리킨다.
 *
 * 🚨 **새 사실·수치를 만들지 않았다** — 이름·역할은 기존 `team.members[0]` 과 같다.
 * 2026-08-23 중복 제거: 사실 4줄(`facts`)은 히어로 사실 한 줄·라임 밴드 약속과 겹쳐서
 *    **뺐다**(아래 주석에 보존). 이제 이 섹션은 "대표가 처음부터 끝까지"를 말하는
 *    **유일한 자리**다 — `process.ts` 인트로와 FAQ "담당자가 바뀌지 않나요"도 같은 날 뺐다.
 * 🔀 `enabled: false` 로 내리면 섹션이 통째로 빠진다(그 경우 FAQ 흰 → CTA 검정으로
 *    이어져 밴드 교차는 그대로다). 네비 `About` 항목도 같이 지울 것.
 */
export const founder = {
  enabled: false, // 2026-08-23 사용자 지시 "한 대표 부분 삭제" — 되살리려면 true + 네비 About 항목 복구
  eyebrow: "WHO WE ARE",
  heading: "대표가 처음부터 끝까지\n직접 만듭니다.",
  name: "한병선",
  role: "Brand Direction · Web Planning",
  intro: [
    "브랜드 기획부터 홈페이지, 네이버 채널까지 한 사람이 끝까지 책임집니다.",
    "중간에 담당자가 바뀌지 않고, 사장님이 직접 대표와 이야기합니다.",
  ],
  // 2026-08-23 중복 제거: 4줄 전부 다른 섹션과 겹쳐서 뺐다.
  //   "부산 기반" · "홈페이지 제작 + 블로그 마케팅" → `hero.factsLine`
  //   "예약제 · 소수 정예" · "불만족 시 100% 전액 환불" → 라임 밴드(`trustProof.promises`)
  // 되살리려면 아래 줄의 주석을 풀고 `founder.tsx` 의 체크 리스트 블록도 함께 복구할 것.
  // facts: ["부산 기반", "홈페이지 제작 + 블로그 마케팅", "예약제 · 소수 정예", "불만족 시 100% 전액 환불"],
  /**
   * 대표 사진. **확정 전까지 `null`** — null 이면 이니셜 모노그램
   * (SUM!M 워드마크와 같은 결의 **검정 정사각 박스에 "H"**)이 대신 선다.
   * 사진이 확정되면 `/images/brand/…` 경로 문자열을 넣으면 그대로 교체된다.
   */
  photo: null as string | null,
} as const;

export const finalCta = {
  heading: "브랜드의 다음 장면을\n함께 설계해 볼까요?",
  description:
    "현재 상황과 목표를 들려주세요.\n필요한 것과 하지 않아도 될 것을 함께 정리하겠습니다.",
  ctaLabel: "프로젝트 문의하기",
  /**
   * banded 모드 전용 — "예약 없이 바로" 빠른 상담 2버튼 (2026-08-20, 수능선배 패턴).
   * 폼을 채우기 전에 지금 바로 연결되는 길을 먼저 보여준다.
   * href 는 컴포넌트가 site.phone / site.chatbotUrl 에서 만든다 (여기엔 문구만 둔다).
   */
  quickContact: {
    label: "예약 없이 바로",
    phone: { title: "전화하기", note: "지금 바로 연결" },
    kakao: { title: "카카오톡 상담", note: "편한 시간에 답장" },
  },
  /**
   * 폼 안내 문구.
   * TODO: "24시간 내 연락" 같은 **시간 약속은 팀 확정 후**에만 넣는다.
   * 지킬 수 없는 응답 시간을 적으면 표시광고 리스크가 된다 (START_HERE §6 🚨).
   */
  formNote: "문의를 남기시면 담당자가 확인 후 직접 연락드립니다.",
} as const;

export const evidence = {
  eyebrow: "HOW WE WORK",
  heading: "숫자를 만들기 전에,\n일하는 방식부터 보여드립니다.",
  description:
    "검증되지 않은 성과 수치는 쓰지 않습니다.\n대신 전략이 결과물로 이어지는 과정을 그대로 공개합니다.",
  items: [
    {
      title: "브랜드 전략 문서",
      description: "포지셔닝과 메시지가 정리되는 실제 문서입니다.",
    },
    {
      title: "와이어프레임",
      description: "화면 설계가 결정되는 과정을 보여줍니다.",
    },
    {
      title: "디자인 시스템",
      description: "일관된 화면을 만드는 규칙의 집합입니다.",
    },
    {
      title: "검색 구조 설계",
      description: "발견되는 구조가 어떻게 만들어지는지 공개합니다.",
    },
  ],
  // TODO(미확정): 실제 전략 문서/와이어프레임 등 자료 확보 후 이미지 교체.
} as const;

/**
 * /about 페이지 (Phase 2)
 * 철학은 §2.1 브랜드 성격과 §20 최종 선언, brandStatement를 기반으로 한다.
 * 새로운 실적·수치·연혁을 만들지 않는다. (§15.2-1, §15.2-20)
 */
export const aboutPage = {
  eyebrow: "ABOUT SUMIM",
  // 2026-08-07 사용자 요청: "고객 매출 성장"이 최우선 목표임이 바로 읽히도록 재작성
  heading: "우리의 목표는 하나,\n고객의 매출 성장입니다.",
  body: "스밈은 예쁜 홈페이지를 만들고 끝내지 않습니다.\n브랜드 전략부터 홈페이지, 검색 노출, 콘텐츠 운영까지 하나로 연결해\n고객이 찾아오고 매출로 이어지는 구조를 만듭니다.",
  motto: "화면은 명확하게. 검색은 발견되게. 매출은 성장하게.",
  principlesEyebrow: "HOW WE WORK",
  principlesHeading: "일하는 태도",
  principles: [
    {
      title: "감각보다 근거를 먼저 둡니다.",
      description: "느낌으로 결정하지 않고, 왜 그렇게 만들었는지 설명할 수 있게 만듭니다.",
    },
    {
      title: "조용하지만 자신감 있게 말합니다.",
      description: "과장하지 않습니다. 확인된 것만 이야기하고, 모르는 것은 모른다고 말합니다.",
    },
    {
      title: "보이는 디자인과 작동하는 구조를 함께 봅니다.",
      description: "화면의 완성도와 사업의 결과를 분리해서 생각하지 않습니다.",
    },
    {
      title: "친절하지만 가볍지 않게 일합니다.",
      description: "필요한 것과 하지 않아도 될 것을 솔직하게 구분해 드립니다.",
    },
  ],
  processEyebrow: "PROCESS",
  processHeading: "감각에 맡기지 않고,\n과정으로 완성합니다.",
  processLink: { label: "메인에서 프로세스 보기", href: "/#process" },
  cta: { label: "프로젝트 문의하기", href: "/contact" },
} as const;

/**
 * /contact 페이지 (Phase 2)
 * 메인의 Final CTA(다크)는 그대로 두고, 이 페이지는 밝은 배경으로 구성한다.
 */
export const contactPage = {
  eyebrow: "CONTACT",
  heading: "브랜드의 다음 장면을\n함께 설계해 볼까요?",
  description:
    "현재 상황과 목표를 들려주세요.\n필요한 것과 하지 않아도 될 것을 함께 정리하겠습니다.",
  guide: [
    // 2026-08-23: 중복 제거 대상으로 한 번 뺐다가 **사용자 지시로 복구**했다("CTA 섹션은
    // 원래대로"). `description` 과 겹쳐 보이지만 안내 리스트 3줄은 그대로 둔다.
    "지금 어떤 상황인지 편하게 적어주셔도 됩니다.",
    "자료가 준비되지 않아도 상담을 시작할 수 있습니다.",
    "상담이 곧 계약은 아닙니다. 충분히 검토하신 뒤 결정하시면 됩니다.",
  ],
  // TODO(미확정): 공식 이메일 확정 시 site.email에 입력하면 이 안내 대신 주소가 노출된다.
  emailPendingNote: "이메일 주소는 준비 중입니다. 아래 폼으로 문의해 주세요.",
} as const;

/**
 * 상담 폼 **예상 예산 범위** 선택지 (2026-08-22 사용자 지시 — 자유 입력 → 셀렉트).
 *
 * 자유 입력은 "미정"·"잘 모르겠어요"·빈칸이 대부분이라 상담 전 분류에 쓰이지 않았고,
 * 40대 이상 사장님 타깃에서는 **고르는 편이 적는 것보다 빠릅니다**(§1 타깃).
 *
 * 🚨 **가격표가 아닙니다.** 여기 적힌 금액은 *고객이 생각하는 예산을 고르는 구간*이고
 *    스밈의 견적·단가가 아닙니다 — 서비스 가격은 여전히 미확정이라 어디에도 표시하지 않습니다
 *    (`services.ts` 의 "가격은 확정되지 않았으므로 노출하지 않는다" 원칙 유지).
 * 🚨 **첫 항목은 "아직 미정"** 입니다 — 예산을 정하지 못한 상태가 문의를 막지 않아야 합니다
 *    (`contactPage.guide` "자료가 준비되지 않아도 상담을 시작할 수 있습니다"와 같은 태도).
 * 🚨 폼 전송 필드 키는 **`budget` 그대로**라 Web3Forms 메일 본문("예상 예산: …")도
 *    검증 스키마(`lib/validation.ts` 의 `budget`)도 손대지 않았습니다. 선택 안 하면
 *    빈 문자열이라 **예전처럼 그 줄이 아예 빠집니다.**
 * 구간을 바꾸려면 이 배열만 고치면 됩니다(문구가 그대로 메일에 실립니다).
 */
export const contactBudgetOptions = [
  "아직 미정",
  "300만원 이하",
  "300~500만원",
  "500~1,000만원",
  "1,000만원 이상",
] as const;
