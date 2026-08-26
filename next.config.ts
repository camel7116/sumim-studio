import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // NEXT_DIST_DIR=.next-prod 로 빌드/스타트하면 dev 서버(.next)와 산출물이 분리되어
  // dev를 켠 채 빌드해도 충돌하지 않는다 (팀 공유 스냅샷용 — 2026-08-03).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // 자체 제작 플레이스홀더 SVG 서빙용. 스크립트 실행이 차단된 안전한 설정.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        // Pretendard dynamic subset은 파일명이 콘텐츠 해시가 아니지만, lockfile로 pretendard 버전이 고정되므로 immutable 캐싱이 안전하다(업그레이드 시 배포 경로를 변경할 것).
        source: "/fonts/pretendard/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
