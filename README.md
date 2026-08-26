# SUMIM Studio 공식 홈페이지 (Phase 1 + Phase 2)

브랜드 전략·웹 경험·콘텐츠 성장을 연결하는 SUMIM Studio의 공식 홈페이지입니다.
설계 기준 문서: `../SUMIM_DESIGN_BIBLE_PHASE1.md` (Single Source of Truth)

## 페이지 구조

Phase 1은 단일 랜딩(`/`), Phase 2에서 상세 페이지를 추가했습니다. 모든 페이지는 빌드 타임 정적 생성입니다.

| 경로 | 내용 |
|---|---|
| `/` | 메인 랜딩 (14개 섹션, 문서 §4.2 순서) |
| `/work` | 프로젝트 목록 — 첫 프로젝트 전체 폭 + 나머지 2열 |
| `/work/[slug]` | 프로젝트 상세 3건 — 개요 행, 문제 / 핵심 결정 / 구축 범위, 이전·다음 이동. 결과 수치는 `resultVerified === true`일 때만 렌더 |
| `/services` | 서비스 개요 — 4축 목록(1px 선) + 패키지 구성 예시 |
| `/services/[slug]` | 서비스 축 상세 4건 (`strategy` / `experience` / `search` / `content`) — 포함 작업, 고객이 얻는 변화 |
| `/about` | 철학 · 일하는 태도 · 프로세스 8단계 · 팀 |
| `/contact` | 문의 전용 페이지 (밝은 배경 + 흰 폼 패널). 메인의 Final CTA(다크)는 그대로 유지 |
| `/privacy`, `/thanks` | 개인정보처리방침 / 문의 완료 |

- 네비게이션은 `Work`·`Services`·`About`·`Contact`가 실제 페이지로, `Process`는 메인 앵커(`/#process`)로 연결됩니다. Hero CTA는 메인 내 스크롤 UX를 위해 앵커(`#work` / `#contact`)를 유지합니다.
- `/work/[slug]`, `/services/[slug]`에는 `BreadcrumbList` JSON-LD가 포함됩니다.
- 상세 페이지 상단(h1 포함)은 JS 기반 `Reveal` 대신 CSS 전용 `.reveal-load`를 사용해 LCP가 하이드레이션을 기다리지 않습니다.

## 실행 방법

Node.js 20 이상이 필요합니다. (이 프로젝트는 v22.14.0 기준으로 개발되었으며, `~/.local/node`에 설치되어 있다면 `export PATH="$HOME/.local/node/bin:$PATH"`로 활성화)

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 (http://localhost:3000)
```

## 빌드 방법

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript 검사
npm run build      # 프로덕션 빌드 (전 페이지 정적 생성)
npm run start      # 프로덕션 서버
```

배포는 Vercel 호환입니다. 저장소 연결 후 기본 설정으로 배포됩니다.

## 환경변수

`.env.example` 참고. 모두 선택 사항이며, 미설정 시 해당 기능이 비활성화되거나 플레이스홀더가 사용됩니다.

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | 최종 도메인 (미설정 시 플레이스홀더 도메인 — 배포 전 필수 설정) |
| `NEXT_PUBLIC_GA_ID` | GA4 측정 ID (설정 시에만 스크립트 로드) |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity (설정 시에만 로드) |
| `CONTACT_WEBHOOK_URL` | 상담 폼 전송용 (전송 서비스 확정 후 구현) |

## 콘텐츠 수정 위치

모든 카피는 `src/content/`에서만 수정합니다. 컴포넌트 코드를 건드릴 필요가 없습니다.

- `src/content/site.ts` — 브랜드 정보, 네비게이션, Hero, Proof Strip, Brand Statement, 문제 제기, 차별점, 팀, Final CTA, Evidence, `/about`(`aboutPage`), `/contact`(`contactPage`), 이메일/SNS/사업자 정보
- `src/content/projects.ts` — 포트폴리오 3개 (현재 전체 플레이스홀더) + `/work` 목록(`workPage`)·상세 라벨(`projectDetail`)
- `src/content/services.ts` — 서비스 패키지 3종 + 서비스 4축 상세(`serviceAxes`) + `/services` 라벨(`servicesPage`, `serviceDetail`)
- `src/content/process.ts` — 프로세스 8단계
- `src/content/faq.ts` — FAQ 8문항

## 이미지 교체 위치

- `public/images/brand/sumim-logo.jpeg` — 공식 로고 원본 (타이포 워드마크, 1612×907). 배경이 투명하지 않아 페이지 내에서는 사용하지 않고 **OG/소셜 공유 이미지 전용**입니다. 페이지 내 로고(네비게이션·푸터·Brand Statement 서명)는 동일한 디자인의 HTML 텍스트 워드마크로 렌더링됩니다.
- `public/images/brand/sumim-logo-watercolor-legacy.jpeg` — 구 수채화 캘리그래피 로고 (2026-08-02 폐기, 보관용)
- `public/images/projects/placeholder-0*.svg` — 프로젝트 커버 (실제 이미지로 교체 후 `src/content/projects.ts`의 `coverImage` 경로 변경, `isPlaceholder: false`)
- `public/images/team/placeholder-work-scene.svg` — 팀 작업 장면 사진

이미지 톤 가이드: 차가운 자연광, 낮은 채도, 노란 베이지 필터 금지 (문서 §10)

## 미확정 TODO

코드 내 `TODO(미확정)` 주석으로 표시되어 있습니다. 확정 시 업데이트할 항목:

- [ ] 최종 도메인 (`NEXT_PUBLIC_SITE_URL`)
- [x] 공식 이메일 주소 (`src/content/site.ts` → `email`) — 2026-08-07 sumimstudio@naver.com 확정
- [ ] 사업자등록 정보 (`site.business`) — 확정 전까지 푸터에 "준비 중" 표기
- [ ] 공식 SNS 채널 (`site.social`)
- [ ] 챗봇 채널 URL (`site.chatbotUrl` — 카카오톡 채널·채널톡 등. 확정 전까지 플로팅 "챗봇문의" 버튼은 문의 섹션으로 연결)
- [ ] 상담 폼 전송 서비스 (`src/app/actions/contact.ts`) — 현재 검증 후 /thanks 이동만 수행
- [ ] 실제 프로젝트 3건 정보·이미지 (`src/content/projects.ts` — `overview`/`problem`/`solution`/`scope`도 함께 교체하고 `isPlaceholder: false`로 변경하면 상세 페이지의 플레이스홀더 안내가 사라짐)
- [ ] 팀원 소개 문구·추가 팀원 (`site.team`)
- [ ] 개인정보처리방침 확정 (보유 기간, 보호책임자 — `src/app/privacy/page.tsx`)
- [ ] 로고 SVG 원본 (공식 로고는 타이포 워드마크로 확정 — 현재 페이지 내에서는 HTML 텍스트로 렌더링. SVG/투명 배경 원본 확보 시 이미지 렌더링으로 교체 검토)
- [ ] 검증된 실적 수치 축적 시 Proof Strip 교체 (`site.proofStrip`) — 숫자 카운팅 버전은 `proofStripStats`에 값을 넣으면 자동 전환
- [ ] 협력·클라이언트 로고 사용 동의 확보 시 `site.partners` 입력 (비어 있으면 로고 바 미노출)
- [x] `/work`, `/services` 등 상세 페이지 (Phase 2) — 2026-08-02 완료 (위 「페이지 구조」 참고)
- [ ] GA4 / Clarity 계정
- [ ] `/insights` (블로그·아티클) — Phase 3 검토 대상

## 코드 모음집 반영 내역

`../📁 고퀄리티 코드 모음집`의 참고 코드를 **SUMIM 디자인 토큰으로 재해석**해 흡수했습니다.
원본 코드를 그대로 옮긴 것은 없으며, 외부 라이브러리(odometer / GSAP / jQuery)는 추가하지 않고 전부 vanilla JS + CSS로 구현했습니다.
모든 항목은 `prefers-reduced-motion`에서 비활성 또는 즉시 표시되며, 키보드·ARIA 동작을 유지합니다.

### 적용 (10건)

| 원본 | 적용 위치 | 재해석 내용 |
|---|---|---|
| 버튼 코드 / 마우스 오버 시 화살표 이동 | `src/components/ui/text-link.tsx`, `globals.css` `.text-link` | 문서 §7.2 Text Link. 15px semibold + 16px 화살표. 호버 시 화살표 4px 이동 + 밑줄 0→100%(0.32s). 적용처: `/work/[slug]` 이전·다음, `/services` 4축, `/services/[slug]` 다른 축, `/about` 프로세스 링크, FAQ 검색 결과 없음 안내 |
| 버튼 코드 / 호버시 색상이 차오르는 버튼 | `globals.css` `.btn-fill` → `button.tsx` secondary | 그라데이션 제거. ink 단색이 왼쪽→오른쪽 `scaleX(0→1)`로 차오르고 글자 반전. primary는 미변경 |
| 상품·신뢰도 도구 / 형광펜 밑줄 긋기 | `globals.css` `.highlight-pen` → `sections/brand-statement.tsx` | 형광 노랑 → terracotta 22%. 글자 하단 45% 높이, 0→100%(0.8s, 0.3s 지연). 기존 `Reveal`의 `is-visible`이 트리거 |
| 유틸리티 / 스크롤 진행바 + 스크롤 진행률 표시 및 탑 버튼 | `src/components/ui/scroll-progress.tsx` (layout.tsx 전역) | jQuery 제거 → rAF + passive listener. 그라데이션 바 → 인디고 2px 단색. 탑 버튼은 44px 원형 + 진행률 SVG 링 |
| 아코디언 탭 (검색기능) | `src/components/ui/accordion.tsx`, `src/content/faq.ts` | 질문·답변·`keywords` 부분일치 필터. 기존 `aria-expanded`·`aria-controls`·패널 애니메이션 유지, 항목 재정렬 없이 숨김만 |
| 입력폼 플로팅 | `src/components/ui/mobile-sticky-cta.tsx` | 아임웹 종속 제거. lg 미만 + 600px 이상 스크롤에서만 등장, `#contact` 노출·폼 입력 중·`/contact`·`/thanks`에서는 숨김. `env(safe-area-inset-bottom)` 대응 (문서 §12.2) |
| 갤러리 / 텍스트 설명 위로 올라오기 | `src/components/ui/project-card.tsx` | ink 82% 캡션이 `translateY(100%→0)`. 모바일에서는 렌더하지 않고(호버 불가), 같은 정보가 카드 아래 텍스트에 이미 있어 hover 전용 정보가 되지 않음 (문서 §12.4). `group-focus-visible/link`도 지원 |
| 추가 코드 / 브랜드 누적 카운팅 · 숫자 카운팅 애니메이션 | `src/components/ui/stat-counter.tsx` | odometer 미사용, rAF 1.2s ease-out + `toLocaleString`. 중간값 낭독을 막기 위해 애니메이션 숫자는 `aria-hidden`, 최종값만 `sr-only`로 1회 노출 |
| 메인화면코드 / 마우스 무빙 메인섹션 | `src/components/sections/hero-visual-parallax.tsx` | 강도 1/5로 절제(최대 ±6px). lg 이상 + `hover:hover`·`pointer:fine` + reduced-motion 아님일 때만. 장식 비주얼만 감싸므로 Hero 본문은 서버 컴포넌트 유지 → LCP 영향 없음 |
| 메인화면코드 / 풀스크린 인터랙티브 스크롤 마우스 | `globals.css` `.scroll-cue` → `sections/hero.tsx` | 마우스 도형 제거, 기존 1px 선 위를 4px 인디고 점이 2s 주기로 흘러내리는 CSS 전용 애니메이션 |

### 게이트 (2건 — 실제 자료 확보 시 활성화)

문서 §15.2-1(가짜 실적·수치·로고 생성 금지)에 따라, 코드는 완성해 두고 **데이터가 비어 있으면 렌더하지 않습니다.**

| 기능 | 활성화 방법 | 활성화 시 동작 |
|---|---|---|
| Proof Strip 숫자 카운팅 | `src/content/site.ts` → `proofStripStats`에 `{ value, suffix, label }` 4건 입력 | `sections/proof-strip.tsx`가 텍스트 스트립 대신 `StatCounter` 4개를 렌더 |
| 협력사 로고 바 | `src/content/site.ts` → `partners`에 `{ name, logo, width, height }` 입력 (+ `public/images/partners/`에 파일 배치) | `sections/partner-strip.tsx`가 Evidence 아래에 "함께한 브랜드" 정적 그리드(grayscale → 호버 컬러)를 렌더. 무한 마키는 문서 §11.5에 따라 사용하지 않음 |

### 제외 항목과 사유

| 원본 | 제외 사유 |
|---|---|
| 네온 글로우 버튼 / 네온 사인 글로우 / 그라디언트 버튼 / 그라데이션 필 버튼 / 오로라 그라데이션 | 문서 §5.1·§15.2-7 — 네온·무지개형 그라데이션 금지, Cold Precision 위배 |
| 심장박동 버튼 / 젤리 바운스 버튼 | 문서 §11.1·§15.2-10 — 반복 최소화, 과도한 애니메이션 금지 |
| 마그네틱 커서 / 마우스 팔로워 커서 / 이미지·텍스트 커서 | 문서 §11.5 — 커서 추적 장식 금지, 포인터 접근성 저하 |
| 흐르는 텍스트 배너 (Marquee) / 슬라이드 배너 마키 방식 | 문서 §11.5 — 의미 없는 marquee 반복 금지 (협력사 로고는 정적 그리드로 대체) |
| 풀 타이핑 / 풀스크린 타이핑 비주얼 / 텍스트 애니메이션 | 문서 §11.5 — 글자가 한 글자씩 등장 금지. Hero 텍스트를 JS 대기 상태로 만들어 LCP 악화 |
| 실시간 구매 알림 팝업 / 가상 실시간 카운터 / 마감 임박 카운트다운 | 문서 §15.2-1 — 가짜 수치·긴박감 조성. 실제와 다른 표시는 표시광고법상 기만적 표시 소지 (법적 리스크) |
| 수동 구글 리뷰 | 문서 §15.2-1 — 검증되지 않은 후기 생성 금지 |
| 3D 홀로그램 카드 / 뒤집히는 카드 / 사이버펑크 보더 / 글래스모피즘 / 폴라로이드 | 문서 §11.5(3D 회전 카드 금지), §15.2-2(템플릿 마켓 느낌), §15.2-4(카드 남발) |
| 패럴랙스 스크롤링 배경 고정 | 문서 §11.5 — 과도한 parallax. Hero 미세 패럴랙스(±6px)만 채택 |
| 호버 시 설명 나오는 카드 1·2 | 캡션 슬라이드업과 기능 중복 |
| 이미지 배경 어두운 오버레이 | 현재 Hero가 이미지 기반이 아니므로 불필요 |
| SNS 플로팅 배너 / 상담톡 플로팅 버튼 | 확정된 SNS·상담 채널이 없음(§15.2-1). 하단 고정 CTA와 역할 중복 |
| 브랜드 서비스 가격 카드 | 문서 §15.2-12 — 확인되지 않은 가격·기간 단정 금지 |
| 블랙 3카드 / 포인트 소개 카드형 / 프로필 소개 / 커리큘럼 선언 / 브랜드 배너 | 문서 §15.2-4 — 카드 남발 금지. 기존 Difference·Evidence·Team 섹션과 중복 |
| 비포 & 애프터 슬라이더 | 실제 비교 자료 미확보. 플레이스홀더로 성과를 암시하면 §15.2-1 위반 |
| 마케팅업체 1~10번 | 마케팅 대행사 랜딩 템플릿으로 브랜드 포지셔닝(§1.4)과 불일치 |

## 디자인 시스템 요약

`src/styles/globals.css`의 `@theme` 블록에서 중앙 관리 (문서 §5).

- **공식**: Cold Precision 90% + Human Trace 10%
- **컬러**: Canvas `#F7F8FA` / Ink `#111318` / Indigo `#414965`(전문성·선) / Terracotta `#B96852`(CTA 전용) / Sage `#829487`(보조 표식)
- **타이포**: Pretendard Variable 셀프 호스팅, Display XL(44→80px)부터 Caption까지 fluid clamp 스케일
- **간격**: 4px 기반, 섹션 패딩 80/112/160px, 컨테이너 max 1280px
- **선·라운드**: 구분은 그림자보다 1px 선, 버튼 pill, 이미지 20px
- **모션**: fast 0.18s / normal 0.32s / slow 0.6s, ease `cubic-bezier(0.22, 1, 0.36, 1)` (문서 §11.2). IntersectionObserver 기반 reveal(0.6s), `prefers-reduced-motion` 지원. 외부 애니메이션 라이브러리 미사용(번들 절감·서버 컴포넌트 유지)

### 참고: npm audit

`npm audit`의 high 3건은 Next.js가 번들한 빌드타임 의존성(postcss/sharp)의 상위 보고로, 현재 Next 최신 안정판에서 해소 불가하며 런타임에 노출되지 않습니다. Next 업데이트 시 재확인하세요.
