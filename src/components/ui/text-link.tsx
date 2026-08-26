import Link from "next/link";
import { cn } from "@/lib/utils";

type TextLinkDirection = "forward" | "back";

type TextLinkProps = {
  href: string;
  children: React.ReactNode;
  /** "back"이면 화살표가 좌우 반전된다 (이전 항목 이동) */
  direction?: TextLinkDirection;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

/**
 * 텍스트 링크 화살표 (16px, 문서 §7.2)
 * `.text-link` 또는 `.text-link-group` 안에 있을 때 hover/focus에서 4px 이동한다.
 */
export function TextLinkArrow({
  direction = "forward",
  className,
}: {
  direction?: TextLinkDirection;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={cn(
        "text-link-arrow",
        direction === "back" && "text-link-arrow-back",
        className,
      )}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * 이미 링크인 요소(카드형 링크 등) 내부에서 텍스트 링크 모양만 쓸 때 사용한다.
 * 링크 중첩을 피하기 위해 span으로 렌더링하며, 바깥 링크에 `.text-link-group`을
 * 붙이면 그 링크의 hover/focus가 밑줄·화살표 모션을 구동한다.
 */
export function TextLinkVisual({
  children,
  direction = "forward",
  className,
}: {
  children: React.ReactNode;
  direction?: TextLinkDirection;
  className?: string;
}) {
  return (
    <span className={cn("text-link", className)}>
      <span className="text-link-label">{children}</span>
      <TextLinkArrow direction={direction} />
    </span>
  );
}

/**
 * 인라인 텍스트 링크 (문서 §7.2 Text Link)
 * 15px semibold ink + 화살표. hover/focus 시 화살표가 4px 이동하고
 * 밑줄이 왼쪽에서 오른쪽으로 그어진다 (0.32s, 표준 ease).
 * 스타일은 `.text-link` 클래스에 있으므로 TrackedLink 등 다른 링크에도 재사용할 수 있다.
 */
export function TextLink({
  href,
  children,
  direction = "forward",
  className,
  ...rest
}: TextLinkProps) {
  return (
    <Link href={href} className={cn("text-link", className)} {...rest}>
      <span className="text-link-label">{children}</span>
      <TextLinkArrow direction={direction} />
    </Link>
  );
}
