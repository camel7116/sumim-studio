import { site } from "@/content/site";

/**
 * ✅ **도메인 확정 (2026-08-26)** — `sumimstudio.co.kr` (가비아 구매).
 *
 * 기본값이 곧 실제 도메인이라 환경변수를 안 넣어도 sitemap·robots·OG 태그가 맞습니다.
 * `NEXT_PUBLIC_SITE_URL` 을 주면 그 값이 이깁니다 — 미리보기 배포에서 그 배포 주소로
 * 덮어쓰고 싶을 때 씁니다(미설정이면 미리보기에서도 이 도메인으로 표기됩니다).
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sumimstudio.co.kr";

export const defaultTitle = "SUMIM Studio | 브랜드 전략과 홈페이지 제작";

export const defaultDescription = site.description;

/**
 * JSON-LD 구조화 데이터 (ProfessionalService)
 * 주소·전화번호·사업자 정보는 확정된 것만 넣는다. (문서 §14.1)
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.nameEn,
    alternateName: site.nameKo,
    description: defaultDescription,
    url: siteUrl,
    slogan: site.slogan,
    areaServed: {
      "@type": "City",
      name: "Busan",
      containedInPlace: { "@type": "Country", name: "KR" },
    },
    knowsAbout: [
      "브랜드 전략",
      "홈페이지 제작",
      "SEO",
      "네이버 플레이스",
      "블로그 콘텐츠",
    ],
    // TODO(미확정): email, telephone, address는 확정 후 추가.
  };
}

/**
 * BreadcrumbList 구조화 데이터 (문서 §14.1)
 * 화면에 표시되는 브레드크럼 항목과 동일한 순서·이름으로 전달한다.
 */
export function breadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
