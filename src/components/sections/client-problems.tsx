import { Fragment } from "react";
import { clientProblems, copyMode, inlineCta } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { EyebrowLabel, MaskLines } from "@/components/ui/section-header";
import { ProblemChecklist, SelfCheck } from "@/components/sections/client-problems-check";
import { cn } from "@/lib/utils";


/**
 * Client Problems (문서 §8.5 / 2026-08-03 사용자 시안)
 * 상단 워드마크 → 중앙 헤딩·설명 → 인용 카드 4개(해결책 톤 부연) → 하단 배너 박스.
 *
 * 배너 박스(2026-08-03 사용자 확정): 좌측 메시지 2줄(왼쪽 정렬, 잉크색 +
 * highlight 구절만 주황) / 우측 100% 환불 보증 스탯(세로 구분선).
 * 문장 전체 주황 나열은 가독성 문제로 반려 → 잉크 + 주황 포인트 구조.
 *
 * 카피는 content/site.ts의 clientProblems가 전부 소유한다.
 *
 * 카드 그림자(shadow-soft)는 "문서 그림자 최소" 원칙의 예외로,
 * 시안의 떠 있는 카드 느낌을 우선해 사용자 확인 하에 적용한다.
 *
 * 2026-08-03: 플립 카드는 문서 §11.5(3D 회전 카드 금지) 확인 후 사용자 결정으로 취소.
 * 이전 배너의 손그림 밑줄·동그라미·인용부호 장식은 카피 개편과 함께 제거됨.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 🔀 **2026-08-23 시안 스위치 `clientProblems.style`** (site.ts)
 *
 * 사용자 "카카오톡처럼 오는 부분은 눈에 들어오지가 않아서" → **더 눈에 띄고 훑기 쉬운**
 * 대안 3종을 같은 파일에 나란히 두고 값 하나로 갈아 끼운다.
 *
 * | 값 | 형태 |
 * |---|---|
 * | `"chat"`(현재 기본) | 기존 카톡 대화창 패널 — **마크업 한 줄도 바꾸지 않았다** (`ChatPanel`) |
 * | `"sheet"` | **진단표** — 전폭 2열 표. 좌 45% 검정 셀(증상) / 우 55% 라임 셀(처방) |
 * | `"cards"` | **2×2 검정 카드** — 큰 바이올렛 번호 + 흰 제목 + 40px 바이올렛 룰 + 회색 답변 |
 * | `"list"` | **큰 타이포 리스트** — 1px 검정 룰 4행, 32~40px 검정 헤드라인 + 우측 답변 |
 *
 * 🚨 **2026-08-23 밤 — 위 4종 전부 반려**("여전히 별로"). 넷 다 *박스 안 Q/A 4쌍* 이라
 *    형태만 바뀌고 읽는 방식이 같았다. 그래서 **개념이 다른 3종**을 같은 스위치에 더한다.
 *
 * | 값 | 형태 |
 * |---|---|
 * | `"check"` | **셀프 체크리스트** — 눌러서 체크하는 4행 + 개수에 반응하는 검정 요약 바.
 *              유일한 인터랙티브 안이라 `client-problems-check.tsx`(클라이언트)로 분리 |
 * | `"ticker"` | **대형 티커** — 전폭 마키 2줄(위 ←, 아래 → 윤곽선 글자) + 아래 4열 답변 그리드 |
 * | `"root"` | **원인 한 문장** — 증상 칩 4개 → 큰 선언 1문장 → 증상·처방 4행 |
 * | `"combo"` | 🆕 **체크 + 티커를 한 화면에**(사용자 선택) — 압축 헤딩 → 전폭 티커 2줄
 *              → 셀프 체크 2×2 → 검정 요약 바. 섹션 패딩까지 줄여 1440×900 한 화면에 담는다 |
 *
 * 공통 규칙:
 * - 밴드는 **흰색 고정**(위 라임 · 아래 검정 Process 와 교차 유지).
 * - 헤딩 "혹시, 이런 상황이신가요?" + 설명 한 줄, Q/A 4쌍, `copyMode` 전환은 4종 모두 동일.
 * - 검정 셀·검정 카드는 **중첩 `data-band="void"`**, 라임 셀은 **중첩 `data-band="mist"`** 로
 *   만든다. 색을 hex 로 박지 않으므로 `bandedPalette`("navy") 와 colorLab 실험 조합을
 *   그대로 따라간다(액센트 글자도 globals 의 `[data-band="void"] .text-cta` 파생을 탄다).
 * - 라운드 0(직각) · 새 색 없음 · 모션은 기존 `Reveal` 뿐이다.
 * ─────────────────────────────────────────────────────────────────────────
 */

/* ─────────────────────────────────────────────────────────────────────────
   🧪 **티커 띠 후보 스위치 (2026-08-25 · 사용자 선택 대기)**

   팀 피드백: **"티커 띠가 너무 혼자 넓은 느낌"** — 표현이 모호해 두 갈래로 읽혀
   양쪽을 실제 스위치로 만들어 두고 캡처를 비교합니다. **기본값은 현재 화면 그대로**입니다.

   | 스위치 | 값 | 무엇 |
   |---|---|---|
   | `TICKER_WIDTH` | **`"bleed"`(현재)** | 티커 2줄이 뷰포트 **전폭**(헤딩·체크만 Container 안) |
   | | `"contained"` | 티커도 **Container(최대 1280px) 안**으로 — 후보 A |
   | `TICKER_SIZE` | **`"base"`(현재)** | 행 `h-11 md:h-[60px]` · 글자 28/44px · 위아래 `my-7` |
   | | `"small"` | 행 `h-9 md:h-[44px]` · 글자 22/34px · 위아래 `my-5` — 후보 B |

   후보 C = 두 값을 `"contained"` + `"small"` 로 함께 두는 것입니다.
   ⚠️ `"ticker"` 안(전폭 대형 티커)은 이 스위치를 타지 않습니다 — combo 전용입니다.
   ───────────────────────────────────────────────────────────────────────── */
const TICKER_WIDTH: "bleed" | "contained" = "bleed";
const TICKER_SIZE: "base" | "small" = "base";

/* ─────────────────────────────────────────────────────────────────────────
   🆕 **티커 순서 뒤집기 (2026-08-25 · 사용자 선택)**

   팀: **"셀프 체크 띠 부분이 생뚱맞다."** 진단해 보니 두 가지가 겹쳐 있었습니다.
   ① 티커가 **헤딩과 체크 사이**를 가로막아, 헤딩이 무엇을 소개하는지 알기 전에
      12문장이 먼저 흐릅니다. ② `tickerPhrases` 12문장 중 **앞 4개가 `cards[].title`
      4문항과 글자 그대로 같습니다**(문자열 비교로 확인 — 4/12 완전 일치).

   그래서 순서를 **헤딩 → 안내 → 체크 2×2 → 요약 바 → 티커**로 내립니다.

   | 스위치 | 값 | 무엇 |
   |---|---|---|
   | `TICKER_ORDER` | **`"after-summary"`(기본)** | 헤딩 → 안내 → 체크 → **요약 바 → 티커** |
   | | `"before-summary"` | 헤딩 → 안내 → 체크 → **티커 → 요약 바** — 후보 B |
   | | `"top"` | **2026-08-25 이전 그대로** (헤딩 → 티커 → 체크 → 요약 바). 복귀용 |
   | `TICKER_DEDUPE` | **`false`(기본)** | 12문장 전부 흐른다 |
   | | `true` | `cards[].title` 과 **같은 문장을 런타임에 걸러** 8문장만 — 🧪 사용자 선택 대기 |

   🚨 **`site.ts` 의 `tickerPhrases` 12줄은 한 줄도 지우지 않았습니다** — 필터는 전부
      렌더 시점에만 걸립니다(비교·복귀용으로 원본 배열을 남겨 둡니다).
   ⚠️ 문장이 12 → 8 로 줄면 트랙이 짧아져 **같은 duration 이어도 초당 픽셀이 느려집니다**
      (px/s = 트랙폭 ÷ 2 ÷ duration). 그래서 dedupe 판은 duration 을 트랙 길이에
      비례해 줄여 **08-23 에 확정한 속도를 그대로 유지**합니다(그 값보다 빠르게 하지 않음).
   ───────────────────────────────────────────────────────────────────────── */
const TICKER_ORDER: "after-summary" | "before-summary" | "top" = "after-summary";
const TICKER_DEDUPE = false;

/**
 * dedupe 판 전용 `--ticker-duration` — **줄마다 다릅니다.**
 *
 * 걸러 내는 4문장이 두 줄에 3:1 로 갈려(원본 인덱스 0·2 는 윗줄 · 1·3 은 아랫줄인데
 * 필터 뒤 파리티를 다시 계산하므로) 줄별 트랙 축소율이 다릅니다. 한 값으로 맞추면
 * 한 줄이 08-23 확정 속도보다 빨라집니다.
 *
 * 실측 트랙폭(1536): 윗줄 **8,833 → 5,610px**(0.635) · 아랫줄 **8,877 → 5,185px**(0.584).
 * 140s × 그 비율 = 윗줄 **89s** · 아랫줄 **82s** → 초당 픽셀이 원판(31.5 / 31.7)과 같아집니다.
 */
const TICKER_DURATION_DEDUPE = { top: "89s", bottom: "82s" } as const;

/** 01 · 02 … — 표·카드·리스트가 같은 번호 표기를 쓴다 */
function orderNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** 답변 문구 — `copyMode` 가 고른다 (질문 4개는 두 모드가 같다) */
function answerOf(card: (typeof clientProblems.cards)[number]) {
  return copyMode === "plain" ? card.descriptionPlain : card.description;
}

/**
 * 새 시안 3종의 공통 헤딩 블록 — 다른 섹션과 같은 언어로 맞춘다
 * (액센트 틱 eyebrow + `text-h1` 마스크 리빌 헤딩 + 설명, **좌측 정렬**).
 * 카피는 기존 필드 그대로다 — eyebrow 는 `wordmark` 를 대문자로 쓴다(새 문구 0줄).
 */
function ProblemsHeader() {
  const { wordmark, heading, description } = clientProblems;

  return (
    <div className="max-w-[720px]">
      <Reveal>
        <EyebrowLabel>{`${wordmark.bold}${wordmark.regular}`}</EyebrowLabel>
      </Reveal>
      <Reveal delay={80}>
        <h2 id="client-problems-heading" className="text-h1 mask-reveal mt-6">
          <MaskLines text={heading} />
        </h2>
      </Reveal>
      <Reveal delay={160}>
        <p className="text-body-l mt-5 max-w-[620px] whitespace-pre-line text-ink-secondary">
          {description}
        </p>
      </Reveal>
    </div>
  );
}

/* =========================================================================
   ① "chat" — 기존 카톡 대화창 (2026-08-18~19 확정). 스위치 도입 시 **원본 그대로** 이관했다.
   ========================================================================= */
function ChatPanel() {
  const { wordmark, heading, description, cards } = clientProblems;

  return (
    <>
      <div className="mx-auto max-w-[820px] text-center">
        <Reveal>
          <p className="text-[22px] font-bold tracking-[0.02em] text-ink md:text-[24px]">
            {wordmark.bold}
            <span className="font-medium text-ink-secondary">{wordmark.regular}</span>
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id="client-problems-heading" className="text-h1 mask-reveal mt-6">
            <MaskLines text={heading} />
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-body-l mt-5 whitespace-pre-line text-ink-secondary">
            {description}
          </p>
        </Reveal>
      </div>

      {/*
        2026-08-18 사용자 요청: 2×2 카드 → 카톡 대화창. 한 항목이 **말풍선 두 개**로 나뉜다 —
        고민(질문)과 스밈의 답변. 색과 방향이 화자를 구분한다.

        2026-08-19 "카톡 오는 것처럼 했던 섹션 눈에 잘 들어오지가 않네" → 말풍선 8개를
        **하나의 불투명 대화창 패널**로 묶고, 질문은 흰 면 + 그림자, 답변은 진한 액센트 틴트.

        2026-08-19 "질문, 답변 서로 정렬하고 답변 후 공간을 좀 줘서 확실히 읽히게"
        → 전 세트를 질문=왼쪽 가장자리 / 답변=오른쪽 가장자리로 통일했다(좌우 번갈이 폐지).

        🚨 2026-08-21 정리 패스: 패널 이전의 **헤어라인 말풍선 모드**(qnaChatPanel=false)와
           배경 장식(ember 물감 번짐 · dotqna 파티클)을 걷어냈다 — 아카이브 스냅샷 참고.
        ⚠️ 패널에 transform/filter/opacity 를 걸면 밴드 ::before 층계가 깨진다 (globals 주석).
      */}
      <div className="chat-panel mx-auto mt-12 max-w-[880px] overflow-hidden rounded-[24px] md:mt-14">
        {/* 대화창 상단 바 — 장식이므로 스크린리더에서 제외 */}
        <div
          aria-hidden="true"
          className="chat-panel-bar flex h-11 items-center gap-1.5 px-5 md:px-7"
        >
          <span className="chat-panel-dot h-2 w-2 rounded-full" />
          <span className="chat-panel-dot h-2 w-2 rounded-full" />
          <span className="chat-panel-dot h-2 w-2 rounded-full" />
          <span className="chat-panel-title ml-2.5 text-[13px] font-medium">
            SUMIM Studio 상담
          </span>
        </div>
        {/*
          간격 위계 — 쌍 안은 붙이고(mt-2.5/3), 쌍 사이는 그 4~5배(space-y-12/16).
          "답변 후 공간을 좀 줘서 확실히 읽히게" (2026-08-19 사용자 요청)
        */}
        <ul className="space-y-12 px-6 py-8 md:space-y-16 md:px-10 md:py-12">
          {cards.map((card, index) => (
              <li key={card.title}>
                {/* 고민 — 고객이 보낸 말 (흰 면, 패널 왼쪽 가장자리) */}
                <Reveal delay={index * 60} className="reveal-pop ml-0 w-[92%] md:w-[72%]">
                  <article className="chat-q relative rounded-l px-5 py-4 md:px-7 md:py-5">
                    <div className="flex items-start gap-3.5">
                      <span className="chat-badge-q mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-bold">
                        Q
                      </span>
                      <h3 className="text-h3 break-keep [text-wrap:balance]">{card.title}</h3>
                    </div>
                    <span
                      aria-hidden="true"
                      className="chat-q-tail absolute top-6 -left-2 h-4 w-4 rotate-45"
                    />
                  </article>
                </Reveal>

                {/* 답변 — 스밈이 보낸 말 (진한 주황 틴트, 패널 오른쪽 가장자리) */}
                <Reveal
                  delay={index * 60 + 120}
                  className="reveal-pop mt-2.5 ml-auto w-[92%] md:mt-3 md:w-[72%]"
                >
                  <article className="chat-a relative rounded-l px-5 py-4 text-right md:px-7 md:py-5">
                    {/* row-reverse — DOM 순서는 A가 먼저(읽는 순서), 화면에서는 오른쪽 */}
                    <div className="flex flex-row-reverse items-start gap-3.5">
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cta text-[15px] font-bold text-white">
                        A
                      </span>
                      {/* 🔀 답변 문구 — `copyMode: "plain"`(현재)이면 쉬운 말 판,
                          `"original"` 이면 2026-08-23 오전 문구(`description`)로 복귀.
                          🚨 질문(Q) 4개는 두 모드가 같다 */}
                      <p className="text-body-l break-keep leading-[1.7] whitespace-pre-line text-ink">
                        {copyMode === "plain" ? card.descriptionPlain : card.description}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="chat-a-tail absolute top-5 -right-2 h-4 w-4 rotate-45"
                    />
                  </article>
                </Reveal>
              </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* =========================================================================
   ② "sheet" — 진단표 (전폭 2열 표)

   한 행 = [증상: 검정 45%] [처방: 라임 55%]. 행 사이는 1px 검정 룰 하나뿐이고
   면 색이 두 화자를 구분한다(말풍선·꼬리·그림자 없음 → 훑는 속도가 빨라진다).
   🚨 lg 미만은 **세로 스택**이다 — 45/55 를 390px 에 쑤셔 넣으면 좌측 제목이
      두 글자씩 접힌다. 스택 순서는 검정(증상) → 라임(처방) 그대로다.
   ========================================================================= */
function DiagnosisSheet() {
  const { cards, sheetLabels } = clientProblems;

  return (
    <div className="mt-12 md:mt-14">
      {/* 위·아래 마감 룰까지 포함해 "표"로 읽히게 한다 */}
      <ul className="divide-y divide-ink border-y border-ink">
        {cards.map((card, index) => (
          <li key={card.title}>
            <Reveal delay={index * 70}>
              {/* 45:55 — fr 로 잡아야 gap 없이 정확히 나뉜다(퍼센트는 반올림이 남는다) */}
              <div className="grid lg:grid-cols-[45fr_55fr]">
                {/* 좌 — 증상(검정 셀). 중첩 밴드라 팔레트를 그대로 따라간다 */}
                <div data-band="void" className="px-5 py-7 md:px-8 md:py-9">
                  <p className="text-[13px] leading-none font-bold tracking-[0.14em] text-cta uppercase">
                    {sheetLabels.symptom} {orderNumber(index)}
                  </p>
                  <h3 className="mt-4 text-[22px] leading-[1.4] font-bold break-keep text-ink md:text-[24px]">
                    {card.title}
                  </h3>
                </div>

                {/* 우 — 처방(라임 셀) */}
                <div data-band="mist" className="px-5 py-7 md:px-8 md:py-9">
                  <p className="text-[13px] leading-none font-bold tracking-[0.14em] text-ink-secondary uppercase">
                    {sheetLabels.prescription}
                  </p>
                  {/* whitespace-pre-line — `copyMode: "original"` 의 하드 줄바꿈을 살린다 */}
                  <p className="mt-4 text-[18px] leading-[1.6] break-keep whitespace-pre-line text-ink md:text-[19px]">
                    {answerOf(card)}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================================
   ③ "cards" — 흰 밴드 위 2×2 검정 카드

   흰 밴드 한복판에 검정 덩어리 4개가 놓여 **밴드 대비 자체가 시선**이 된다.
   번호(48~56px 바이올렛) → 제목(흰 22px) → 40px 바이올렛 룰 → 답변(회색) 순서라
   위에서 아래로 한 카드가 한 호흡에 읽힌다. 라운드 0 · 그림자 없음.
   ========================================================================= */
function ProblemCards() {
  const { cards } = clientProblems;

  return (
    // auto-rows-fr — 4장 높이를 행 단위로 맞춘다(제목 줄 수가 달라도 아래 룰이 흔들리지 않게)
    <ul className="mt-12 grid auto-rows-fr gap-4 md:mt-14 md:grid-cols-2">
      {cards.map((card, index) => (
        <li key={card.title} className="h-full">
          <Reveal delay={index * 70} className="h-full">
            <article
              data-band="void"
              className="flex h-full flex-col p-8 md:p-10"
            >
              {/* 큰 번호 — 검정 위 액센트는 globals 파생(#9b7dff)이 자동으로 걸린다 */}
              <p
                aria-hidden="true"
                className="text-[48px] leading-none font-bold tracking-[-0.02em] text-cta md:text-[56px]"
              >
                {orderNumber(index)}
              </p>
              <h3 className="mt-6 text-[22px] leading-[1.4] font-bold break-keep text-ink">
                {card.title}
              </h3>
              <span aria-hidden="true" className="mt-6 block h-px w-10 bg-cta" />
              <p className="mt-6 text-[16px] leading-[1.7] break-keep whitespace-pre-line text-ink-secondary md:text-[17px]">
                {answerOf(card)}
              </p>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/* =========================================================================
   ④ "list" — 큰 타이포 리스트 (typographic ledger)

   면을 하나도 깔지 않고 **글자 크기만으로** 위계를 만든다. 헤드라인이 32~40px 라
   스크롤 중에도 문장이 먼저 잡히고, 답변은 우측 38% 컬럼에서 조용히 받친다.
   행 hover 는 **헤드라인 색만** 바이올렛으로 바뀐다(이동·확대 없음 — 문서 §11.5).
   ========================================================================= */
function ProblemLedger() {
  const { cards } = clientProblems;

  return (
    <div className="mt-12 md:mt-14">
      <ul className="divide-y divide-ink border-y border-ink">
        {cards.map((card, index) => (
          <li key={card.title} className="group">
            <Reveal delay={index * 70}>
              {/* 데스크톱 3단(번호 / 헤드라인 / 답변) · 그 미만은 세로 스택 */}
              <div className="grid items-start gap-x-8 gap-y-4 py-9 lg:grid-cols-[52px_minmax(0,1fr)_38%]">
                <p className="text-[14px] leading-none font-bold tracking-[0.12em] text-cta">
                  {orderNumber(index)}
                </p>
                <h3 className="text-[24px] leading-[1.25] font-bold tracking-[-0.02em] break-keep text-ink transition-colors duration-200 group-hover:text-cta group-focus-within:text-cta lg:text-[36px] xl:text-[40px]">
                  {card.title}
                </h3>
                <p className="text-[16px] leading-[1.7] break-keep whitespace-pre-line text-ink-secondary md:text-[17px]">
                  {answerOf(card)}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================================
   ⑥ "ticker" — 대형 티커 (2026-08-23 밤)

   네 문장을 **읽히는 자리**가 아니라 **지나가는 자리**에 둔다. 전폭 2줄이 서로
   반대 방향으로 흐르고(위 채운 글자 ← / 아래 윤곽선 글자 →), 문장 사이는 액센트
   `✕` 가 끊는다. 답변은 티커 아래에서 **작게** 받는다 — 문제는 크게 스치고
   해결은 조용히 정리되는 위계다.

   기계는 후기 마키 그대로다(같은 목록 2벌 + `@keyframes marquee-left`, globals 참고).
   반대 방향 키프레임과 호버 정지만 새로 넣었고 **JS 는 한 줄도 없다**.
   🚨 두 줄은 `Container` **밖**이라 뷰포트 끝까지 간다 — 섹션에 `overflow-x-hidden`.
   ========================================================================= */
function TickerRow({
  reverse,
  soft,
  compact,
  dedupe,
}: {
  /** 🧪 `cards[].title` 과 겹치는 문장을 빼고 흘린다 (combo 전용, 2026-08-25) */
  dedupe?: boolean;
  /** 오른쪽으로 흐르는 줄(아래 줄) */
  reverse?: boolean;
  /** 연한 회색 글자 — 아래 줄 전용 */
  soft?: boolean;
  /**
   * `combo` 용 축소판: 행 60/44px · 글자 44/28px.
   * 🧪 2026-08-25 — `TICKER_SIZE: "small"` 이면 한 단계 더 줄인다(행 44/36 · 글자 34/22).
   */
  compact?: boolean;
}) {
  const { cards, tickerPhrases, tickerSeparator } = clientProblems;

  /**
   * 🧪 **중복 제거 (2026-08-25, `TICKER_DEDUPE`)** — 체크에서 방금 읽은 4문항이
   * 바로 아래 띠에서 또 흐르지 않게 `cards[].title` 과 **같은 문장만** 뺀다.
   * 🚨 `site.ts` 배열은 그대로 두고 여기서만 거른다(원본 12줄 보존).
   * 🚨 **파리티 분배는 필터 뒤에 계산해야** 한다 — 원본 인덱스로 가르면
   *    앞 4개가 빠진 뒤 6+2 로 기울어진다. 걸러낸 배열에서 다시 갈라야 4+4 가 된다.
   */
  const source = dedupe
    ? tickerPhrases.filter((phrase) => !cards.some((card) => card.title === phrase))
    : tickerPhrases;

  /**
   * 🚨 **두 줄이 서로 다른 문장을 흘린다** (2026-08-23 밤, 사용자 "더 다양하게").
   * 윗줄 = 짝수 번째 / 아랫줄 = 홀수 번째 → 12문장이 6+6(dedupe 면 8문장이 4+4)으로 갈린다.
   * 카피는 `site.ts` 의 `tickerPhrases` 한 곳에만 있다.
   */
  const phrases = source.filter(
    (_, index) => index % 2 === 0 !== Boolean(reverse),
  );

  /**
   * 한 벌 = 그 줄의 문장 전부 + 각 문장 뒤 구분자(이음매에서도 구분자가 보이게 끝에도 붙인다).
   * 순환하려면 같은 벌이 두 번 필요한데, **두 번째 벌은 보조기술에서 제외**한다.
   */
  const renderGroup = (duplicate: boolean) => (
    <div aria-hidden={duplicate || undefined} className="flex shrink-0 items-center">
      {phrases.map((phrase) => (
        <Fragment key={phrase}>
          <span className="whitespace-nowrap">{phrase}</span>
          {/* 색은 globals 의 `.ticker-sep` 이 쥔다 — `text-cta` 유틸리티를 쓰면
              아래 줄 연회색 규칙을 레이어 순서로 이겨 버린다(그 블록 주석 참고) */}
          <span className="ticker-sep px-6 md:px-10">{tickerSeparator}</span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "ticker-row flex items-center",
        compact
          ? TICKER_SIZE === "small"
            ? "h-9 md:h-[44px]"
            : "h-11 md:h-[60px]"
          : "h-12 md:h-[72px]",
        reverse ? "border-b border-ink" : "border-t border-ink",
      )}
    >
      <div
        className={cn(
          /* 글자색은 밴드에서 상속받는다(= 잉크) — `text-ink` 유틸리티를 붙이면
             아래 줄의 연회색 규칙이 레이어 순서에서 밀린다 */
          "ticker-track leading-none font-extrabold tracking-[-0.02em]",
          compact
            ? TICKER_SIZE === "small"
              ? "text-[22px] md:text-[34px]"
              : "text-[28px] md:text-[44px]"
            : "text-[34px] md:text-[56px]",
          reverse && "ticker-track--reverse",
          soft && "ticker-soft",
        )}
        /* 🧪 문장이 8개로 줄면 트랙이 짧아져 같은 duration 이 더 느려진다 —
              길이에 비례해 duration 을 줄여 초당 픽셀을 원판과 맞춘다 */
        style={
          dedupe
            ? ({
                "--ticker-duration": reverse
                  ? TICKER_DURATION_DEDUPE.bottom
                  : TICKER_DURATION_DEDUPE.top,
              } as React.CSSProperties)
            : undefined
        }
      >
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </div>
  );
}

/** 전폭 2줄 한 벌 — 위는 왼쪽으로(잉크), 아래는 오른쪽으로(연회색) */
function TickerRows({ compact, dedupe }: { compact?: boolean; dedupe?: boolean }) {
  return (
    <>
      <TickerRow compact={compact} dedupe={dedupe} />
      <TickerRow reverse soft compact={compact} dedupe={dedupe} />
    </>
  );
}

function ProblemTicker() {
  const { cards, tickerStatement } = clientProblems;

  return (
    <>
      <Container className="relative">
        <ProblemsHeader />
      </Container>

      <div className="mt-12 md:mt-16">
        <TickerRows />
      </div>

      <Container className="relative">
        <div className="mx-auto mt-12 max-w-[880px] text-center md:mt-16">
          <Reveal>
            <p className="text-[22px] leading-[1.5] font-medium break-keep text-ink">
              {tickerStatement}
            </p>
          </Reveal>

          {/* 답변 4개 — 티커가 크게 지나간 문제를 작은 4열로 정리한다 */}
          <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 text-left md:grid-cols-4">
            {cards.map((card, index) => (
              <li key={card.title}>
                <Reveal delay={index * 70}>
                  <p className="text-[14px] leading-none font-bold tracking-[0.12em] text-cta">
                    {orderNumber(index)}
                  </p>
                  <p className="mt-3 text-[16px] leading-[1.6] break-keep whitespace-pre-line text-ink-secondary">
                    {answerOf(card)}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={120}>
            <div className="mt-12">
              <Button href={inlineCta.bridge.href}>{inlineCta.bridge.label}</Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  );
}

/* =========================================================================
   ⑦ "root" — 원인 한 문장 (2026-08-23 밤)

   네 문제를 **나열하지 않는다.** 작은 "증상 칩" 네 개로 눌러 두고, 화면의 주인공은
   그 아래 큰 글씨 한 문장 — "증상은 네 가지지만, 원인은 대개 하나입니다."
   그래서 이 안만 헤딩 자리를 `heading`("혹시, 이런 상황이신가요?")이 아니라
   `rootHeadline` 이 차지한다(섹션 aria 헤딩도 이 문장이다).
   ========================================================================= */
function ProblemRoot() {
  const { cards, rootEyebrow, rootHeadline, rootHighlight, rootBody } = clientProblems;

  /** 큰 선언 안에서 `rootHighlight` 낱말만 액센트로 찍는다 (배너 highlight 와 같은 방식) */
  const renderHeadline = () =>
    rootHeadline.split("\n").map((line, lineIndex) => {
      const at = rootHighlight ? line.indexOf(rootHighlight) : -1;
      return (
        <span key={`${lineIndex}-${line}`} className="block">
          {at < 0 ? (
            line
          ) : (
            <>
              {line.slice(0, at)}
              <span className="text-cta">{rootHighlight}</span>
              {line.slice(at + rootHighlight.length)}
            </>
          )}
        </span>
      );
    });

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
      {/* 좌 7/12 — 증상 칩 → 큰 선언 → 설명 */}
      <div className="lg:col-span-7">
        <Reveal>
          <EyebrowLabel>{rootEyebrow}</EyebrowLabel>
        </Reveal>

        <Reveal delay={80}>
          <ul className="mt-6 flex flex-wrap gap-2">
            {cards.map((card) => (
              <li
                key={card.title}
                className="border border-ink px-3 py-2 text-[14px] leading-none break-keep text-ink"
              >
                {card.title}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={160}>
          <h2
            id="client-problems-heading"
            className="mt-10 max-w-[18ch] text-[clamp(1.75rem,1.1rem+2.6vw,3rem)] leading-[1.25] font-bold tracking-[-0.02em] break-keep text-ink"
          >
            {renderHeadline()}
          </h2>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-7 max-w-[52ch] text-[18px] leading-[1.7] break-keep text-ink-secondary md:text-[19px]">
            {rootBody}
          </p>
        </Reveal>
      </div>

      {/* 우 5/12 — 증상 → 처방 4행 (박스 없음, 1px 옅은 룰) + CTA */}
      <div className="lg:col-span-5">
        <ul className="border-t border-line">
          {cards.map((card, index) => (
            <li key={card.title} className="border-b border-line">
              <Reveal delay={index * 70}>
                <div className="py-5">
                  <p className="text-[16px] leading-[1.5] font-semibold break-keep text-ink">
                    {card.title}
                  </p>
                  <p className="mt-2 flex gap-2 text-[16px] leading-[1.6] break-keep whitespace-pre-line text-ink-secondary">
                    <span aria-hidden="true" className="shrink-0 text-cta">
                      →
                    </span>
                    {answerOf(card)}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="mt-8">
            <Button href={inlineCta.bridge.href}>{inlineCta.bridge.label}</Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* =========================================================================
   ⑧ "combo" — 체크 + 티커를 **한 화면에** (2026-08-23 밤, 사용자 선택)

   "체크와 티커 이 두개를 위아래로 같이 해보자! 한 화면에 다 담기게끔."
   위에서부터 압축 헤딩 → 전폭 티커 2줄 → 셀프 체크 2×2 → 검정 요약 바.
   🚨 **세로 예산이 이 안의 설계 제약**이다 — 섹션 패딩(56/40px)까지 줄여
      1440×900 한 화면(고정 네비 80px 제외)에 들어가게 잡았다.
   부품은 새로 만들지 않았다: 티커는 `TickerRows compact`(서버 렌더 그대로),
   체크는 `SelfCheck layout="grid" compact`(유일한 클라이언트 조각).
   ========================================================================= */
function ComboHeader() {
  const { checkEyebrow, heading, checkHint } = clientProblems;

  return (
    <div className="max-w-[720px]">
      <Reveal>
        <EyebrowLabel>{checkEyebrow}</EyebrowLabel>
      </Reveal>
      <Reveal delay={80}>
        {/* 안내 한 줄(`checkHint`)은 넣지 않는다 — 세로를 벌면 한 화면을 넘긴다 */}
        {/*
          🚨 2026-08-25 팀 피드백 "헤딩 폰트 크기가 다른 섹션과 다르다" → `text-h2` → **`text-h1`**,
             여백도 다른 섹션과 같은 `mt-6` 으로 통일했다(원래 `text-h2 mt-4` 는 한 화면 예산 때문).
             세로가 1440×900 에서 +19.6px 늘지만 섹션이 623.5 → 643.1px 이라
             **예산 820px(900 − 고정 네비 80) 안에 여전히 176.9px 여유**가 있어
             다른 요소를 줄여 흡수할 필요가 없었다(실측).
        */}
        <h2 id="client-problems-heading" className="text-h1 mask-reveal mt-6">
          <MaskLines text={heading} />
        </h2>
      </Reveal>

      {/*
        🆕 2026-08-25 — 티커가 아래로 내려가면서 **헤딩 바로 밑이 체크**가 됐다.
        그래서 `check` 안이 원래 쓰던 안내 한 줄(`checkHint`)을 여기서도 되살린다.
        새 카피는 한 줄도 짓지 않았다(`site.ts` 의 기존 문장 그대로).
        티커가 위에 있던 예전 배치(`"top"`)에서는 세로 예산 때문에 넣지 않았으므로
        그때와 똑같이 보이도록 그 값에서는 계속 감춘다.
      */}
      {TICKER_ORDER === "top" ? null : (
        <Reveal delay={160}>
          <p className="text-body-l mt-4 text-ink-secondary">{checkHint}</p>
        </Reveal>
      )}
    </div>
  );
}

/**
 * 전폭 티커 한 덩어리 — 라벨 한 줄 + 2줄 마키.
 *
 * 🧪 **라벨은 초안이다(2026-08-25, 사용자 확정 대기)** — 티커가 아래로 내려가면
 * "이 띠가 왜 여기 있는지" 를 받아 줄 줄이 필요한데, **새 문장을 짓지 않고**
 * `site.ts` 에 이미 있는 `tickerStatement`(= `style:"ticker"` 안이 티커 아래에
 * 쓰던 문장)를 그대로 옮겨 왔다. 사실을 더하지도 빼지도 않았다.
 */
function ComboTicker() {
  const { tickerStatement } = clientProblems;

  return (
    <div className={TICKER_SIZE === "small" ? "my-5" : "my-7"}>
      {TICKER_ORDER === "top" ? null : (
        <Container className="relative">
          <Reveal>
            <p className="text-body-m mb-4 text-ink-secondary">{tickerStatement}</p>
          </Reveal>
        </Container>
      )}

      {/*
        🧪 2026-08-25 후보: `TICKER_WIDTH: "contained"` 면 같은 티커를 `Container` 안에 넣고
           (`.ticker-row` 가 이미 `overflow:hidden` 이라 마키는 그대로 흐른다),
           `TICKER_SIZE: "small"` 이면 위아래 여백도 28 → 20px 로 함께 줄인다.
      */}
      {TICKER_WIDTH === "contained" ? (
        <Container className="relative">
          <TickerRows compact dedupe={TICKER_DEDUPE} />
        </Container>
      ) : (
        <TickerRows compact dedupe={TICKER_DEDUPE} />
      )}
    </div>
  );
}

function ProblemCombo() {
  const ticker = <ComboTicker />;

  return (
    <>
      <Container className="relative">
        <ComboHeader />
      </Container>

      {/* 🆕 순서 뒤집기 — `"top"` 만 2026-08-25 이전 배치(헤딩 → 티커 → 체크) */}
      {TICKER_ORDER === "top" ? ticker : null}

      <Container className="relative">
        <SelfCheck
          layout="grid"
          compact
          withHeader={false}
          /* 후보 B — 체크 4행과 요약 바 **사이**에 티커를 끼운다.
             전폭 티커가 Container 안으로 들어가므로 `bleed` 여도 좌우 여백만큼 좁아진다 */
          beforeSummary={TICKER_ORDER === "before-summary" ? ticker : undefined}
        />
      </Container>

      {/* 기본 — 요약 바까지 끝난 다음에 전폭 티커 */}
      {TICKER_ORDER === "after-summary" ? ticker : null}
    </>
  );
}

export function ClientProblems() {
  const { style } = clientProblems;
  /** 전폭 티커 조각이 들어가는 두 안 */
  const fullBleed = style === "ticker" || style === "combo";

  return (
    <Section
      tone="canvas"
      /* 🚨 밴드는 7종 모두 **흰색 고정** — 위 라임(리뷰) · 아래 검정(Process) 과 교차 유지 */
      band="paper"
      /* 🚨 `overflow-x-hidden` 은 **전폭 티커가 있는 안에서만** 건다 — 이 속성은
         overflow-y 를 auto 로 만들어 섹션을 스크롤 컨테이너로 바꾸므로
         나머지 안들은 예전 그대로 둔다 */
      className={cn("relative", fullBleed && "overflow-x-hidden")}
      /* 🚨 combo 만 세로 패딩을 직접 잡는다(56/40px) — 한 화면 예산 때문 */
      paddingY={style === "combo" ? "none" : "default"}
      aria-labelledby="client-problems-heading"
    >
      {style === "combo" ? (
        <div className="py-10 md:py-14">
          <ProblemCombo />
        </div>
      ) : null}

      {/* 전폭 조각이 있는 안은 Container 밖으로 나가야 해서 자기 Container 를 직접 든다 */}
      {style === "ticker" ? (
        <ProblemTicker />
      ) : style === "combo" ? null : (
        <Container className="relative">
          {style === "chat" ? <ChatPanel /> : null}
          {style === "check" ? <ProblemChecklist /> : null}
          {style === "root" ? <ProblemRoot /> : null}

          {style === "sheet" || style === "cards" || style === "list" ? (
            <>
              <ProblemsHeader />
              {style === "sheet" ? <DiagnosisSheet /> : null}
              {style === "cards" ? <ProblemCards /> : null}
              {style === "list" ? <ProblemLedger /> : null}
            </>
          ) : null}

          {/* 2026-08-08: 하단 배너 박스(브랜드 기획 문장 + 100% 환불)는
              TrustProof 섹션의 헤딩·스탯으로 승격되어 여기서 제거됨 (사용자 요청) */}
        </Container>
      )}
    </Section>
  );
}
