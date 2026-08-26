/**
 * 포트폴리오 데이터 (문서 §7.4, §8.8)
 * 규칙:
 * - 가짜 클라이언트 이름 금지.
 * - 결과 수치는 resultVerified가 true인 경우에만 노출.
 * - 미공개 작업은 "Private Project"로 표기.
 *
 * 2026-08-12: 실제 프로젝트 3건(문결 필라테스·온설·지안영어)으로 교체.
 * 커버는 각 시안의 실제 화면 캡처.
 * 2026-08-19 사용자 지시: 소개 문구를 진행형("…하고 있습니다") 대신 완료형("…했습니다")으로 통일.
 */

export type Project = {
  slug: string;
  name: string;
  category: string;
  industry: string;
  /**
   * **한 줄 관점** (2026-08-20 banded 2차 — 스러운스튜디오 방식: 작업물이 아니라 생각을 판다).
   * 카드 메타 최상단에 주황 한 줄로 뜬다. banded 모드에서만 렌더된다.
   *
   * 🚨 **아래 세 문장은 초안입니다 — 팀 검토 후 확정 필요.**
   * 각 문장은 이 파일의 summary / overview / problem 에 이미 기록된 내용에서만 뽑았고
   * 새 사실·성과를 만들지 않았습니다. 없으면(undefined) 그 줄은 렌더되지 않습니다.
   */
  perspective?: string;
  summary: string;
  services: string[];
  coverImage: string;
  /** 목업 호버 시 어두운 오버레이 위에 뜨는 로고 (흰색/아이보리 버전). 없으면 이름 텍스트 */
  logo?: string;
  /** 상세 페이지 "실제 화면" — 시안 단일 파일(/embeds/*)을 iframe으로 불러온다. 있으면 fullImage보다 우선 */
  embedSrc?: string;
  /** 사이트 전체를 세로로 담은 풀페이지 캡처 (embedSrc 없을 때의 대체 표시) */
  fullImage?: { src: string; width: number; height: number };
  /**
   * **실제 모바일 뷰 캡처** (2026-08-20 5차 — 사용자 승인).
   * 폰 목업 화면에 쓴다. 없으면 `fullImage`(데스크톱 풀페이지)로 폴백한다.
   *
   * 캡처 조건: 헤드리스 Chrome `Emulation.setDeviceMetricsOverride`
   * **390×844 · deviceScaleFactor 2 · mobile: true** + 모바일 UA, `/embeds/<slug>.html` 로컬 서빙.
   * IntersectionObserver 리빌을 300px 씩 끝까지 스크롤해 전부 발동시킨 뒤 상단 복귀 →
   * `captureBeyondViewport` 로 **상단 2100 CSS px**(= 780×4200 실픽셀, JPEG 80).
   * 폰 프레임 비율(9:19.5)보다 길게 찍어 `object-top` 크롭 여유를 둔다.
   * 재캡처 스크립트: scratchpad `mobile-shots.mjs`
   */
  mobileImage?: { src: string; width: number; height: number };
  year?: string;
  /** 상세 페이지 도입부 (한 문단) */
  overview?: string;
  problem?: string;
  solution?: string;
  /** 구축 범위 (상세 페이지 목록) */
  scope?: string[];
  result?: string;
  resultVerified: boolean;
  isPlaceholder: boolean;
};

export const projects: Project[] = [
  {
    slug: "moongyul-pilates",
    name: "문결 필라테스",
    category: "Brand + Web",
    industry: "필라테스 · 피트니스",
    // 초안(팀 검토) — 근거: 브랜드 메시지 "움직임의 결을 찾아드립니다" (아래 overview)
    perspective: "움직임의 결이 첫 화면에서 느껴지도록",
    summary:
      "필라테스의 섬세함과 웨이트의 강함을 하나로 다루는 부산 사상의 1:1 프라이빗 스튜디오. 시안 설계부터 아임웹 적용까지 진행했습니다.",
    services: ["Brand Strategy", "Web Experience", "Imweb Custom"],
    coverImage: "/images/projects/moongyul.jpg",
    logo: "/images/projects/logo-moongyul.png",
    embedSrc: "/embeds/moongyul.html",
    fullImage: { src: "/images/projects/moongyul-full.jpg", width: 1440, height: 5953 },
    mobileImage: { src: "/images/projects/moongyul-mobile.jpg", width: 1560, height: 8400 },
    year: "2026",
    overview:
      "문결 필라테스는 통증·재활에 특화된 원장 직강 스튜디오입니다. '움직임의 결을 찾아드립니다'라는 브랜드 메시지를 중심으로, 상담부터 체험 레슨 신청까지 이어지는 화면을 설계하고 아임웹 위에 그대로 옮겼습니다.",
    problem:
      "운영 중인 아임웹 사이트의 기본 기능만으로는 스튜디오가 원하는 차분하고 프리미엄한 무드를 내기 어려웠습니다. 플랫폼을 바꾸지 않고 화면 수준을 올리는 방법이 필요했습니다.",
    solution:
      "단일 시안을 먼저 확정한 뒤, 아임웹 코드 위젯으로 이식할 수 있게 적용 코드를 부분별로 제작했습니다. 헤더 색상 자동 전환, 약속 섹션 위젯, 모바일 화면 보정까지 아임웹 환경 제약 안에서 시안과 같은 화면을 재현했습니다.",
    scope: [
      "브랜드 메시지와 화면 구조 설계",
      "홈페이지 시안 제작",
      "아임웹 커스텀 코드 적용 (헤더 · 섹션 위젯 · 푸터)",
      "모바일 화면 보정",
      "지도 · 예약 · 카카오톡 채널 연결",
    ],
    resultVerified: false,
    isPlaceholder: false,
  },
  {
    slug: "onseol",
    name: "온설",
    category: "Brand + Web",
    industry: "전통주 · 증류소",
    // 초안(팀 검토) — 근거: 아래 problem "아버지와 딸이 함께 빚는 술이라는 브랜드 이야기가
    // 전달되지 않았다". 페이블 초안 "고요한 브랜드의 결을 그대로 화면에" 보다 기록된 문제에
    // 더 붙는 문장으로 다듬었다.
    perspective: "빚는 사람의 이야기가 먼저 읽히도록",
    // 🚨 "4페이지" → "7페이지" (2026-08-21) — 최신 시안에서 매거진 3면
    // (magazine-list / magazine-yeosu / magazine-cocktail)이 늘어 실제 라우트가 7개다.
    // 임베드를 최신본으로 갈면서 화면과 문장이 어긋나 같이 고쳤다.
    summary:
      "강화섬쌀과 속노랑고구마로 빚는 강화의 증류식 소주 브랜드. 브랜드 스토리를 담는 7페이지 사이트를 설계 · 제작했습니다.",
    services: ["Brand Strategy", "Web Experience", "Imweb Custom"],
    /*
     * 🚨 **`-v2` 접미사** (2026-08-21 온설 최신화). 임베드를 `온설\전달용\온설_시안.html`
     * (2026-08-16 판)로 교체하면서 캡처 3종을 다시 찍었다. **같은 경로로 덮어쓰지 않고
     * 파일명을 바꾼** 이유는 브릿지 데모(`bridge-demo-a2`) 때와 같다 — `/_next/image`
     * 최적화 캐시가 옛 그림을 계속 서빙한다. 구 파일 3종은 지우지 않고 남겨 뒀다.
     */
    coverImage: "/images/projects/onseol-v2.jpg",
    logo: "/images/projects/logo-onseol.png",
    embedSrc: "/embeds/onseol.html",
    fullImage: { src: "/images/projects/onseol-v2-full.jpg", width: 1440, height: 5771 },
    mobileImage: { src: "/images/projects/onseol-v3-mobile.jpg", width: 1560, height: 8400 },
    year: "2026",
    // 🚨 인용 슬로건 갱신 (2026-08-21) — 최신 시안에서 히어로 문구가
    // "따뜻한 이야기를 한 병에 담았습니다" → "온기가 쌓인 곳에, 온설이 깃듭니다" 로 바뀌었다.
    // 바로 옆 임베드에 새 문구가 떠 있어 옛 문구를 인용하면 화면과 어긋난다.
    overview:
      "온설(溫說)은 '온기가 쌓인 곳에, 온설이 깃듭니다'를 내세우는 강화의 증류식 소주 브랜드입니다. 판매는 스마트스토어에서 이뤄지지만, 만드는 사람과 철학을 보여줄 공간이 없어 브랜드 사이트를 함께 만들었습니다.",
    problem:
      "스토어 상세페이지만으로는 아버지와 딸이 함께 빚는 술이라는 브랜드 이야기, 강화 100% 원료라는 정체성이 전달되지 않았습니다.",
    solution:
      "라벨 일러스트에서 직접 추출한 색으로 컬러 시스템을 만들고, 한지 질감을 이미지 없이 SVG 필터로 구현해 전통주다운 화면을 세웠습니다. 최종 운영은 아임웹에서 하기로 하고, 처음부터 이관을 견디는 구조로 코드를 설계했습니다.",
    scope: [
      "브랜드 사이트 4페이지 설계 (홈 · 철학 · 제품 · 문의)",
      "라벨 기반 컬러 시스템과 한지 질감 구현",
      "제공 사진 정리 · 용량 최적화",
      "아임웹 이관 대응 코드 구조",
    ],
    resultVerified: false,
    isPlaceholder: false,
  },
  {
    slug: "jian-english",
    name: "지안영어",
    category: "Web + Content",
    industry: "영어 교습소 · 교육",
    // 초안(팀 검토) — 근거: 핵심 메시지 "내신과 정시는 전혀 다르게 공부해야 합니다" +
    // problem "수업 철학이 화면에서 한눈에 읽혀야 했다". 페이블 초안("고민하지 않게, 바로
    // 상담하도록")은 로고스 레퍼런스의 상담 유도 문장이라 지안의 기록된 과제와 어긋나 조정했다.
    perspective: "내신과 정시가 왜 다른지부터 읽히도록",
    summary:
      "해운대 좌동의 영어 교습소. '내신과 정시는 전혀 다르게 공부해야 합니다'라는 메시지를 중심으로 홈페이지를 설계했습니다.",
    services: ["Web Experience", "Content Structure"],
    coverImage: "/images/projects/jian.jpg",
    logo: "/images/projects/logo-jian.png",
    embedSrc: "/embeds/jian.html",
    fullImage: { src: "/images/projects/jian-full.jpg", width: 1440, height: 7908 }, // 2026-08-19 갱신 시안 재캡처
    mobileImage: { src: "/images/projects/jian-mobile.jpg", width: 1560, height: 8400 },
    year: "2026",
    overview:
      "지안영어는 중3 예비고부터 고등 내신 · 수능 정시까지 다루는 온라인 강의 중심의 교습소입니다. 원장님의 초안 자료를 바탕으로 콘텐츠를 다듬고, 성적 사례가 가장 먼저 보이는 구조로 화면을 세웠습니다.",
    problem:
      "참고하던 다른 학원 사이트와 비슷해 보이지 않으면서, 초안 문서에 담긴 수업 철학이 화면에서 한눈에 읽혀야 했습니다.",
    solution:
      "히어로 헤드라인이 타이핑되듯 나타나고 핵심 문구에 연필로 긋는 듯한 밑줄이 그어지는 모션으로 메시지를 강조했습니다. 정렬 · 배지 · 박스 스타일을 참고 사이트와 반대 방향으로 잡아 다른 인상을 만들었습니다.",
    scope: [
      "화면 구조 설계와 카피 다듬기",
      "히어로 타이핑 · 밑줄 모션 구현",
      "수강 후기 무한 슬라이드 (드래그 조작 지원)",
      "파일 하나로 전달 가능한 단일 파일 구성",
    ],
    resultVerified: false,
    isPlaceholder: false,
  },
];

export const selectedWork = {
  eyebrow: "SELECTED WORK",
  heading: "보이는 디자인과\n작동하는 구조를 함께 만듭니다.",
  cta: { label: "모든 프로젝트 보기", href: "/work" },
  /**
   * 4분할 레이아웃(2026-08-25)의 **4번째 칸** — 아직 공개할 프로젝트가 없는 자리.
   * 🚨 실적·수치·업체명을 만들지 않습니다(§6 원칙). 실제 4번째 프로젝트가 생기면
   *    위 `projects` 배열에 항목을 더하고 이 자리표시는 자동으로 밀려납니다.
   */
  placeholderCell: {
    title: "다음 프로젝트",
    note: "준비 중입니다.",
  },
} as const;

/** /work 목록 페이지 (Phase 2) */
export const workPage = {
  eyebrow: "SELECTED WORK",
  heading: "보이는 디자인과\n작동하는 구조를 함께 만듭니다.",
  description:
    "진행한 프로젝트를 순서대로 정리했습니다.\n각 프로젝트는 문제, 핵심 결정, 구축 범위를 중심으로 소개합니다.",
  note: null as string | null,
  cta: { label: "프로젝트 문의하기", href: "/contact" },
} as const;

/** /work/[slug] 상세 페이지 라벨 (Phase 2) */
export const projectDetail = {
  breadcrumbRoot: { label: "Work", href: "/work" },
  placeholderNotice:
    "이 페이지는 플레이스홀더입니다. 실제 프로젝트 정보와 이미지는 공개 범위 확정 후 교체됩니다.",
  overviewLabels: {
    industry: "업종",
    services: "수행 범위",
    category: "카테고리",
  },
  sections: {
    fullPage: "실제 화면",
    problem: "문제",
    solution: "핵심 결정",
    scope: "구축 범위",
    result: "결과",
  },
  fullPageHint: "홈페이지를 그대로 불러왔습니다. 안쪽을 스크롤하고, 버튼으로 기기별 화면을 확인해 보세요.",
  scopeNote: "위 범위는 예시이며, 공개 범위 확정 후 실제 수행 범위로 교체됩니다.",
  prevLabel: "이전 프로젝트",
  nextLabel: "다음 프로젝트",
  cta: { label: "프로젝트 문의하기", href: "/contact" },
} as const;
