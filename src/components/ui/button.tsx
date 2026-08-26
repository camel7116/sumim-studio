import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outlineCta" | "ctaInvert" | "ghost";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type ButtonAsButton = CommonProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * 버튼 (문서 §7.2): Primary=테라코타 pill, Secondary=1px 라인
 * Primary 배경은 WCAG AA(4.5:1) 충족을 위해 terracotta-dark(#9E5542, 5.4:1) 사용.
 */
/* 2026-08-03 사용자 요청: pill → 각진 버튼(12px, 문서 §5.4 허용) + → 화살표 */
const base =
  "btn-arrow inline-flex h-13 items-center justify-center rounded-[6px] px-6 text-[15px] font-semibold transition duration-[220ms] ease-out";

const variantClass: Record<ButtonVariant, string> = {
  /* 호버: 살짝 밝아지며 떠오름 (#CB440C, 흰 글자 대비 4.8:1 AA — 미드나이트 반전안은 시험 후 반려) */
  primary:
    "bg-cta text-white hover:bg-[#F0650F] hover:-translate-y-0.5 active:translate-y-0",
  // btn-fill: ink 배경이 왼쪽→오른쪽으로 차오르고 글자가 반전된다 (globals.css)
  secondary:
    "btn-fill border border-line-strong text-ink hover:border-indigo hover:text-white focus-visible:border-indigo focus-visible:text-white active:translate-y-px",
  /* 투명 버튼 → 호버 시 딥네이비가 왼쪽부터 차오르며 글자 반전 (2026-08-03) */
  outlineCta:
    "btn-fill border border-line-strong text-ink hover:border-indigo hover:text-white focus-visible:border-indigo focus-visible:text-white active:translate-y-px",
  /* 엠버 CTA — 2026-08-08 사용자 확정: 호버 시 흰색 반전 대신
     네비게이션 "프로젝트 문의" 버튼과 동일하게 살짝 밝아지며 떠오른다 */
  ctaInvert:
    "border border-cta bg-cta text-white hover:border-[#F0650F] hover:bg-[#F0650F] hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "border border-white/30 text-white hover:bg-white/10",
};

/** 버튼과 동일한 스타일을 링크 등 다른 요소에 적용할 때 사용 */
export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cn(base, variantClass[variant], className);
}

export function Button(props: ButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = cn(base, variantClass[variant], className);

  if ("href" in props && typeof props.href === "string") {
    const { href, ...anchorRest } = rest as Omit<ButtonAsLink, keyof CommonProps>;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as Omit<ButtonAsButton, keyof CommonProps>)}>
      {children}
    </button>
  );
}
