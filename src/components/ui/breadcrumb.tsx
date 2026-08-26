import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  /** 마지막 항목(현재 페이지)에는 링크를 주지 않는다. */
  href?: string;
};

type BreadcrumbProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
};

/**
 * 브레드크럼 (문서 §14.1 내부 앵커 링크, §14.4 landmark)
 * 시각 표기와 BreadcrumbList JSON-LD의 항목을 동일하게 유지한다.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="현재 위치" className={cn(className)}>
      <ol className="text-label flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-secondary">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors duration-200 hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden="true" className="text-line-strong">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
