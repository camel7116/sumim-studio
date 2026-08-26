import { cn } from "@/lib/utils";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

/** 공통 컨테이너: max 1280px, 좌우 패딩 20/32/40 (문서 §5.3) */
export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}
