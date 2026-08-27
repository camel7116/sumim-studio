import type { Metadata } from "next";
import Script from "next/script";
import { clarityId, gaId } from "@/lib/analytics";
import { defaultDescription, defaultTitle, siteUrl } from "@/lib/metadata";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MobileStickyCta } from "@/components/ui/mobile-sticky-cta";
import { StickyConsultBar } from "@/components/ui/sticky-consult-bar";
import { ColorLab } from "@/components/ui/color-lab";
import { bandedPalette, typeScale } from "@/content/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | SUMIM Studio",
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "SUMIM Studio",
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    images: [
      {
        url: "/images/brand/sumim-logo.jpeg",
        width: 1612,
        height: 907,
        alt: "SUMIM Studio 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/brand/sumim-logo.jpeg"],
  },
  // 2026-08-27 검색 노출 세팅 — 네이버 서치어드바이저 소유권 확인 메타태그.
  // (구글은 HTML 파일 방식: public/google407f34f497d4dbcd.html — 지우면 인증 풀림)
  verification: {
    other: {
      "naver-site-verification": "2defde7cdb3980cd830c90a83588abd40ab1b3c8",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: 하이드레이션 전에 인라인 스크립트가 html에 'js' 클래스를
    // 추가하므로(no-JS 폴백 게이트) 속성 불일치 경고를 의도적으로 억제한다.
    // data-visual="banded": globals.css 의 html[data-visual="banded"] 블록이 밴드 규칙을 맡는다.
    //   🚨 2026-08-21 정리 패스로 **값은 항상 "banded"** 다(shell 모드 삭제 — 아카이브 참고).
    //   선택자를 그대로 둔 것은 CSS 를 건드리지 않기 위해서다.
    // data-palette: 팔레트 (2026-08-21). "team" 이면 검정·라임·바이올렛 블록이
    //   기본 블록(네이비·주황) 값을 덮어쓴다. "navy" 면 덮어쓰기가 없어 예전 화면 그대로.
    // data-type: 본문 글자 단계 (2026-08-23 시안 ③-d). "large" 면 globals 의
    //   html[data-type="large"] 블록이 본문·라벨·작은 글씨 토큰을 고정값으로 덮는다.
    //   "default" 면 아무 규칙도 안 걸려 2026-08-23 오전 유동 clamp 그대로다.
    <html
      lang="ko"
      data-visual="banded"
      data-palette={bandedPalette}
      data-type={typeScale}
      suppressHydrationWarning
    >
      <body>
        {/* no-JS 환경에서 reveal 콘텐츠가 숨겨지지 않도록 하는 CSS 게이트용 클래스 */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        {children}
        {/* 스크롤 진행 바 + 맨 위로 버튼 (전 페이지) */}
        <ScrollProgress />
        {/* 모바일 하단 고정 CTA (문서 §12.2). /contact, /thanks에서는 렌더하지 않는다. */}
        <MobileStickyCta />
        {/* 하단 고정 상담 바 (2026-08-20 3차) — 1024px 이상에서만 나온다.
            우하단 플로팅 버튼 대신 이 바가 전화·문의를 맡는다. */}
        <StickyConsultBar />
        {/* 색상 조합 실험 도구 (2026-08-21).
            사용자 결정으로 **배포 후에도 유지**한다. 끄려면 `site.ts` 의 colorLab 만 false. */}
        <ColorLab />
        {/* 분석 도구: 환경변수 설정 시에만 로드 (문서 §14.2) */}
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        {clarityId ? (
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
