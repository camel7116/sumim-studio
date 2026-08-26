import Image from "next/image";
import { partnerStrip, partners } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * 협력·클라이언트 로고 바 (게이트)
 * content/site.ts의 partners가 null이면 아무것도 렌더하지 않는다.
 * 실제 로고 사용 동의를 받은 경우에만 값을 채운다. (문서 §15.2-1)
 *
 * 무한 스크롤 마키는 문서 §11.5(의미 없는 marquee 반복 금지)에 따라 사용하지 않고
 * 정적 그리드로 구성한다. 기본은 grayscale, 호버 시 원래 컬러.
 */
export function PartnerStrip() {
  if (!partners || partners.length === 0) return null;

  return (
    <Section tone="canvas" band="mist" aria-labelledby="partners-heading">
      <Container>
        <Reveal>
          <p className="eyebrow text-indigo">{partnerStrip.eyebrow}</p>
          <h2 id="partners-heading" className="text-h2 mt-4">
            {partnerStrip.heading}
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <li
                key={partner.name}
                className="flex items-center justify-center bg-surface px-6 py-8"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className="h-8 w-auto opacity-70 grayscale transition duration-300 ease-out hover:opacity-100 hover:grayscale-0 motion-reduce:transition-none"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
