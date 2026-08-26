import { copyMode } from "@/content/site";

/**
 * 서비스 패키지 (문서 §8.9)
 * 가격은 확정되지 않았으므로 노출하지 않는다.
 */

export type ServicePackage = {
  name: string;
  tagline: string;
  includes: string[];
};

export const serviceSystem = {
  eyebrow: "SERVICE SYSTEM",
  heading: "필요한 만큼 만들고,\n성장에 맞춰 연결합니다.",
  description:
    "브랜드 상황에 따라 필요한 범위가 다릅니다.\n구성과 범위는 상담에서 함께 정리합니다.",
  cta: { label: "제작 범위 확인하기", href: "/services" },
  // TODO(미확정): 서비스 가격 확정 후 노출 여부 결정.
} as const;

export const servicePackages: ServicePackage[] = [
  {
    name: "Foundation",
    tagline: "브랜드와 웹의 기본기를 만듭니다.",
    includes: ["브랜드 방향 정리", "홈페이지 전략", "반응형 웹 구축", "기본 SEO"],
  },
  {
    name: "Growth",
    tagline: "발견되는 구조까지 연결합니다.",
    includes: [
      "Foundation 포함",
      "네이버 플레이스 구조",
      "블로그 콘텐츠 전략",
      "측정 환경",
    ],
  },
  {
    name: "Partnership",
    tagline: "제작 이후의 성장을 함께 운영합니다.",
    includes: ["지속 운영", "콘텐츠 제작", "개선 실험", "월간 리포트"],
  },
];

/**
 * 서비스 4축 상세 (문서 §7.6, §8.6) — Phase 2 /services, /services/[slug]
 * 기능이 아니라 고객이 얻는 변화로 설명한다. (§7.6)
 * 가격·기간은 확정되지 않았으므로 언급하지 않는다. (§15.2-12)
 */
export type ServiceAxis = {
  slug: string;
  number: string;
  title: string;
  titleKo: string;
  tagline: string;
  /**
   * 🔀 **쉬운 말 태그라인** (2026-08-23 시안 ③-c).
   * `copyMode: "plain"` 이면 메인 서비스 카드가 `tagline` 대신 이 문장을 쓴다(`axisTagline()`).
   * 🚨 원문 `tagline` 은 **지우지 않았다** — `copyMode: "original"` 이면 그대로 복귀하고,
   *    `/services`·`/services/[slug]` 서브 페이지는 계속 원문을 읽는다.
   */
  taglinePlain: string;
  description: string;
  includes: string[];
  /**
   * 메인 병합 섹션의 서비스 카드에 세로 리스트로 나가는 **압축 라벨 4개** (2026-08-21).
   *
   * 사용자: **"밑에 작은 버튼들(칩)이 난잡 — 아이콘 활용해 더 짧게/정돈되게."**
   * → pill 칩을 걷어내고 **체크 + 한 줄 라벨** 세로 리스트로 바꾸면서, 카드 폭(285px)에
   *   한 줄로 들어가도록 `includes` 문구를 줄인 판이다(뜻은 그대로, 수식어만 덜어냄).
   *
   * 🚨 `includes` 를 **덮어쓰지 않고 새 필드로 둔 이유**: `includes` 는 `/services` 목록·상세
   *    페이지가 **전체 목록(5~6개)** 으로 쓰고 있어서, 4개짜리 압축본으로 갈아 끼우면 그 페이지에서
   *    항목이 사라진다(예: "브랜드 톤 가이드"·"접근성과 성능 점검"). 원문은 `includes` 에 그대로 살아 있다.
   */
  cardItems: string[];
  outcome: string;
};

export const serviceAxes: ServiceAxis[] = [
  {
    slug: "strategy",
    number: "01",
    title: "Brand Strategy",
    titleKo: "브랜드 전략",
    tagline: "선택받아야 할 이유를 정리합니다.",
    taglinePlain: "우리 가게가 선택받을 이유를 한 줄로 정리합니다.",
    description:
      "예쁜 화면을 만들기 전에 무엇을 말할지부터 정합니다. 누구에게, 어떤 순서로, 어떤 문장으로 설명할지 함께 결정합니다. 이 단계에서 정리된 기준이 이후의 화면과 콘텐츠를 끌고 갑니다.",
    includes: [
      "현재 상황과 목표 진단",
      "고객·시장·경쟁사 조사",
      "브랜드 포지셔닝 방향 설정",
      "핵심 메시지와 문장 정리",
      "브랜드 톤 가이드",
    ],
    /** 카드용 압축 라벨 — 원문(카드에 쓰던 앞 4개): 현재 상황과 목표 진단 · 고객·시장·경쟁사 조사 · 브랜드 포지셔닝 방향 설정 · 핵심 메시지와 문장 정리 */
    cardItems: ["목표 진단", "시장·경쟁사 조사", "포지셔닝 설정", "핵심 메시지 정리"],
    outcome:
      "홈페이지를 만들기 전에 무엇을 말할지가 정해집니다. 이후 만드는 모든 화면과 글이 같은 방향을 향하게 됩니다.",
  },
  {
    slug: "experience",
    number: "02",
    title: "Web Experience",
    titleKo: "웹 경험 설계",
    tagline: "방문자가 이해하고 행동하는 화면을 설계합니다.",
    taglinePlain: "들어온 손님이 헤매지 않고 전화·예약까지 가게 만듭니다.",
    description:
      "정보 구조부터 화면까지 하나의 흐름으로 설계합니다. 무엇을 먼저 보여주고 무엇을 덜어낼지 정한 뒤 디자인과 개발로 옮깁니다. 반응형, 접근성, 성능은 선택 사항이 아니라 기본 조건으로 다룹니다.",
    includes: [
      "사이트맵과 사용자 흐름 설계",
      "화면별 콘텐츠 구조 정리",
      "UI 디자인과 디자인 시스템",
      "반응형 웹 개발",
      "접근성과 성능 점검",
      "문의 흐름 설계",
    ],
    /** 카드용 압축 라벨 — 원문(카드에 쓰던 앞 4개): 사이트맵과 사용자 흐름 설계 · 화면별 콘텐츠 구조 정리 · UI 디자인과 디자인 시스템 · 반응형 웹 개발 */
    cardItems: ["사용자 흐름 설계", "콘텐츠 구조 설계", "UI·디자인 시스템", "반응형 개발"],
    outcome:
      "방문자가 브랜드를 이해하는 데 걸리는 시간이 줄어듭니다. 다음 행동으로 가는 경로가 화면 안에서 분명해집니다.",
  },
  {
    slug: "search",
    number: "03",
    title: "Search Foundation",
    titleKo: "검색 기반",
    tagline: "검색과 네이버 채널이 연결될 기반을 만듭니다.",
    taglinePlain: "네이버·구글에서 우리 업체가 찾아지게 기본을 잡습니다.",
    description:
      "만드는 것에서 끝나지 않도록 발견되는 구조를 함께 설계합니다. 홈페이지, 네이버 플레이스, 블로그가 서로 다른 정보를 말하지 않도록 정리합니다. 검색 순위를 약속하는 대신 검증할 수 있는 기반을 만듭니다.",
    includes: [
      "검색 키워드 구조 설계",
      "페이지별 메타데이터 정리",
      "구조화 데이터와 사이트맵",
      "네이버 플레이스 정보 구조",
      "채널 간 정보 일치 점검",
      "측정 환경 설정",
    ],
    /** 카드용 압축 라벨 — 원문(카드에 쓰던 앞 4개): 검색 키워드 구조 설계 · 페이지별 메타데이터 정리 · 구조화 데이터와 사이트맵 · 네이버 플레이스 정보 구조 */
    cardItems: ["키워드 구조", "메타데이터 정리", "구조화 데이터", "플레이스 정비"],
    outcome:
      "광고 외의 유입 경로를 만들 기반이 생깁니다. 어떤 채널로 들어와도 같은 브랜드로 읽힙니다.",
  },
  {
    slug: "content",
    number: "04",
    title: "Content Growth",
    titleKo: "콘텐츠 운영",
    tagline: "제작 후에도 브랜드가 계속 발견되도록 운영합니다.",
    taglinePlain: "오픈 뒤에도 블로그·플레이스로 계속 손님이 오게 합니다.",
    description:
      "홈페이지는 시작점입니다. 어떤 이야기를 어떤 주기로 쌓을지 정하고, 운영이 멈추지 않도록 기준을 만듭니다. 필요하면 콘텐츠 제작까지 함께 맡습니다.",
    includes: [
      "콘텐츠 주제와 키워드 정리",
      "콘텐츠 캘린더 설계",
      "블로그 콘텐츠 제작",
      "채널별 발행 기준 정리",
      "확인과 개선 실험",
    ],
    /** 카드용 압축 라벨 — 원문(카드에 쓰던 앞 4개): 콘텐츠 주제와 키워드 정리 · 콘텐츠 캘린더 설계 · 블로그 콘텐츠 제작 · 채널별 발행 기준 정리 */
    cardItems: ["주제·키워드 설계", "캘린더 설계", "블로그 제작", "발행 기준 정리"],
    outcome:
      "제작 이후에도 브랜드가 쌓이는 자리가 생깁니다. 무엇을 써야 할지 매번 처음부터 고민하지 않아도 됩니다.",
  },
];

/**
 * 🔀 **`copyMode` 한 줄 스위치** (2026-08-23) — 메인 서비스 카드의 한 줄 설명을 고른다.
 * `"plain"`(현재) → `taglinePlain` / `"original"` → **2026-08-23 오전 문구** `tagline`.
 * 🚨 카드 구조(작은 영문 `title` = eyebrow / 한글 `titleKo` = 제목)는 원래대로다 — 안 건드렸다.
 */
export function axisTagline(axis: ServiceAxis): string {
  return copyMode === "plain" ? axis.taglinePlain : axis.tagline;
}

/** /services 목록 페이지 라벨 (Phase 2) */
export const servicesPage = {
  eyebrow: "SERVICES",
  axesHeading: "네 개의 축으로 나눠 설계합니다.",
  axesDescription:
    "필요한 축만 선택할 수도 있고, 순서대로 이어갈 수도 있습니다.\n각 축이 무엇을 다루는지 아래에서 확인해 주세요.",
  packagesHeading: "구성 예시",
  packagesDescription:
    "아래는 자주 요청되는 구성입니다.\n실제 범위는 상담에서 브랜드 상황에 맞춰 다시 정리합니다.",
  note: "가격과 일정은 범위에 따라 달라지므로 상담에서 안내합니다.",
  cta: { label: "프로젝트 문의하기", href: "/contact" },
} as const;

/** /services/[slug] 상세 페이지 라벨 (Phase 2) */
export const serviceDetail = {
  breadcrumbRoot: { label: "Services", href: "/services" },
  includesHeading: "포함하는 작업",
  outcomeEyebrow: "WHAT CHANGES",
  outcomeHeading: "고객이 얻는 변화",
  othersHeading: "다른 축 살펴보기",
  note: "범위와 순서는 브랜드 상황에 따라 달라집니다. 필요한 것과 하지 않아도 될 것을 상담에서 함께 정리합니다.",
  cta: { label: "프로젝트 문의하기", href: "/contact" },
} as const;
