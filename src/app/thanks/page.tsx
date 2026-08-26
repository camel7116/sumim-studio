import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "문의가 접수되었습니다",
  description: "상담 문의가 정상적으로 접수되었습니다.",
  robots: { index: false, follow: false },
};

/** 문의 완료 페이지 (문서 §4.1, §7.8) */
export default function ThanksPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="page-enter flex min-h-[70svh] items-center bg-canvas pt-[68px] lg:pt-20">
        <Container className="py-24">
          <div className="max-w-[560px]">
            <div className="h-px w-16 bg-indigo" aria-hidden="true" />
            <h1 className="text-h1 mt-10">
              문의가
              <br />
              잘 도착했습니다.
            </h1>
            <p className="text-body-l mt-6 text-ink-secondary">
              보내주신 내용을 차분히 읽고 연락드리겠습니다.
              <br />
              브랜드의 다음 장면을 함께 정리해 보겠습니다.
            </p>
            <div className="mt-10">
              <Button href="/" variant="secondary">
                홈으로 돌아가기
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
