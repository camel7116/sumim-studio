import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";

/**
 * 푸터 (문서 §8.14)
 * 사업자 정보/이메일/SNS는 확정 전까지 "준비 중" 표기. 가짜 정보를 만들지 않는다.
 */
export function Footer() {
  return (
    <footer data-band="void" className="border-t border-line bg-surface">
      <Container className="py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[360px]">
            {/*
              공식 로고가 타이포 워드마크로 변경됨(2026-08-02).
              네비게이션과 동일한 텍스트 워드마크로 렌더링한다.
              (SVG 원본 확보 시 이미지로 교체 가능)
            */}
            <p className="text-[22px] font-bold tracking-[0.02em] text-ink">
              SUMIM<span className="font-medium text-ink-secondary"> Studio</span>
            </p>
            <p className="text-body-m mt-5 text-ink-secondary">{site.slogan}</p>
            <p className="text-caption mt-2 text-ink-secondary">{site.positioning}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="eyebrow text-ink-secondary">Contact</h2>
              <ul className="mt-4 space-y-2 text-body-m text-ink-secondary">
                <li>
                  {site.email ? (
                    <a href={`mailto:${site.email}`} className="hover:text-ink">
                      {site.email}
                    </a>
                  ) : (
                    // TODO(미확정): 공식 이메일 확정 후 content/site.ts에 입력
                    <span>이메일 주소 준비 중</span>
                  )}
                </li>
                <li>{site.location}</li>
              </ul>
              {/* TODO(미확정): Instagram / Threads 등 실제 채널 확정 후 노출 */}
              {(site.social.instagram || site.social.threads) && (
                <ul className="mt-4 flex gap-4 text-body-m">
                  {site.social.instagram && (
                    <li>
                      <a href={site.social.instagram} className="hover:text-ink">
                        Instagram
                      </a>
                    </li>
                  )}
                  {site.social.threads && (
                    <li>
                      <a href={site.social.threads} className="hover:text-ink">
                        Threads
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div>
              <h2 className="eyebrow text-ink-secondary">Legal</h2>
              <ul className="mt-4 space-y-2 text-body-m text-ink-secondary">
                <li>
                  <Link href="/privacy" className="hover:text-ink">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          {/* TODO(미확정): 사업자등록 정보 확정 후 content/site.ts에 입력 */}
          <p className="text-caption text-ink-secondary">
            {site.business.registrationNumber
              ? `사업자등록번호 ${site.business.registrationNumber}`
              : "사업자 정보 준비 중"}
          </p>
          <p className="text-caption mt-2 text-ink-secondary">
            © {new Date().getFullYear()} {site.nameEn}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
