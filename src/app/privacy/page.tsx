import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "SUMIM Studio 개인정보처리방침입니다.",
  alternates: { canonical: "/privacy" },
};

/**
 * 개인정보처리방침 (문서 §4.1)
 * ✅ 2026-08-26 확정: 사업자 스밈 스튜디오(799-09-03319, 대표 김미라) · 보호책임자 김재훈 010-7116-7776.
 * ✅ 2026-08-26 §4 처리 위탁에 Web3Forms 공개(폼 전송 경유 서비스).
 */
export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="page-enter bg-surface pt-[68px] lg:pt-20">
        <Container className="max-w-[760px] py-20 md:py-28">
          <h1 className="text-h1">개인정보처리방침</h1>
          <p className="text-caption mt-4 text-ink-secondary">시행일: 2026년 8월 26일</p>

          <div className="text-body-m mt-12 space-y-10 text-ink-secondary [&_h2]:text-h3 [&_h2]:text-ink [&_h2]:mb-3">
            <section>
              <h2>1. 개인정보의 처리 목적</h2>
              <p>
                SUMIM Studio(이하 &ldquo;스밈 스튜디오&rdquo;)는 프로젝트 상담 문의에
                응답하기 위한 목적으로만 개인정보를 처리합니다. 처리한 개인정보는
                아래 목적 이외의 용도로 사용하지 않습니다.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>상담 문의 접수 및 회신</li>
                <li>프로젝트 범위·일정 협의를 위한 연락</li>
              </ul>
            </section>

            <section>
              <h2>2. 처리하는 개인정보 항목</h2>
              <p>상담 폼을 통해 아래 항목을 수집합니다.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>필수: 이름(담당자명), 이메일, 프로젝트 설명</li>
                <li>선택: 회사/브랜드명, 연락처, 필요한 서비스, 예상 예산 범위, 희망 일정</li>
              </ul>
            </section>

            <section>
              <h2>3. 개인정보의 보유 및 이용 기간</h2>
              <p>
                상담 문의 처리 완료 후 상담 이력 관리를 위해 일정 기간 보관하며, 보관
                기간이 지나면 지체 없이 파기합니다.
              </p>
              <p className="mt-2 text-ink-secondary">
                {/* TODO(미확정): 보유 기간 정책 확정 후 구체 기간 명시 */}
                구체적인 보유 기간은 운영 정책 확정 후 이 문서에 명시됩니다.
              </p>
            </section>

            <section>
              <h2>4. 개인정보의 제3자 제공 및 처리 위탁</h2>
              <p>
                스밈 스튜디오는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 상담
                폼으로 입력하신 내용은 폼 전송 서비스 Web3Forms(Web3Forms LLC)를 통해
                스밈 스튜디오 이메일로 전달되며, 해당 서비스는 전송 목적 외로 내용을
                이용하지 않습니다.
              </p>
            </section>

            <section>
              <h2>5. 정보주체의 권리</h2>
              <p>
                이용자는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리 정지를
                요청할 수 있습니다. 요청은 아래 연락처로 접수해 주세요.
              </p>
            </section>

            <section>
              <h2>6. 개인정보 보호책임자</h2>
              {/* ✅ 2026-08-26 사용자 확정 */}
              <p className="text-ink-secondary">
                개인정보 보호책임자: 김재훈
                <br />
                연락처: 010-7116-7776
              </p>
            </section>
          </div>

          <div className="mt-16 border-t border-line pt-8">
            <Link href="/" className="text-body-m font-semibold text-ink underline underline-offset-4">
              홈으로 돌아가기
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
