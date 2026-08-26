import type { Project } from "@/content/projects";
import { DeviceMockup, type MockupTilt } from "@/components/ui/device-mockup";
import { ProjectCardTrigger } from "@/components/ui/project-modal";
import { cn } from "@/lib/utils";

/**
 * 카드 껍데기 — 서브 페이지로 나가지 않고 **같은 페이지 모달**을 연다 (2026-08-21 원페이지 전환).
 * 구현은 `project-modal.tsx` 의 `ProjectCardTrigger` — 커스텀 DOM 이벤트를 쏘고
 * 페이지에 하나만 마운트된 `ProjectModal` 이 받는다.
 *
 * ⚠️ placeholder 카드는 보여줄 내용이 없어 **모달도 링크도 없이** 그냥 감싸기만 한다.
 * ⚠️ `/work` 서브 페이지에도 이 카드가 쓰이는데 그 페이지에는 `ProjectModal` 이 없어
 *    클릭이 아무 일도 하지 않는다 — 원페이지 전환 이후의 상태 그대로다(네비에서 빠진 라우트).
 *    (2026-08-21 정리 패스 전에는 셸용 `/work/[slug]` 링크 분기가 있었다 — 아카이브 참고)
 */
function CardShell({
  project,
  className,
  children,
}: {
  project: Project;
  className?: string;
  children: React.ReactNode;
}) {
  if (project.isPlaceholder) {
    return <div className={className}>{children}</div>;
  }
  return (
    <ProjectCardTrigger slug={project.slug} name={project.name} className={className}>
      {children}
    </ProjectCardTrigger>
  );
}

type ProjectCardProps = {
  project: Project;
  /** 이미지 로딩 우선순위 (첫 카드에만 부여하지 않음 — Hero가 우선) */
  featured?: boolean;
  /** 목업 기울기 방향 — 3열 그리드에서 좌·중·우가 서로 마주 보게 배정한다 (기본 "left") */
  tilt?: MockupTilt;
  /** 메인 Selected Work 3열 전용 — 아래 텍스트 블록을 촘촘하게 (2026-08-19) */
  compact?: boolean;
  className?: string;
};

/**
 * 포트폴리오 아이템 (문서 §7.4) — **디바이스 목업 카드**.
 *
 * 2026-08-18 사용자 요청으로 커버가 "휴대폰 + 컴퓨터 화면에 약간 기울어진 3D" 가 됐다.
 * 목업은 휴대폰이 데스크톱 밖으로 삐져나오므로 클립(overflow-hidden) 컨테이너를 쓸 수 없다
 * → clip-reveal 대신 목업 자체가 이미지 자리를 대신하고 호버 상승만 유지한다.
 * 호버 캡션 대신 로고 오버레이(DeviceMockup)가 뜬다.
 *
 * 🚨 2026-08-21 정리 패스: 목업 이전의 **평면 커버 모드**(clip-reveal + 1.06 확대 + 호버 캡션,
 *    스위치 `workDeviceMockup=false`)는 걷어냈다. 스냅샷은
 *    `_archive/particle-shell-2026-08-21/components/ui/project-card.tsx`.
 */
export function ProjectCard({
  project,
  featured = false,
  tilt = "left",
  compact = false,
  className,
}: ProjectCardProps) {
  return (
    <article className={cn("group", className)}>
      <CardShell project={project} className="group/link block focus-visible:outline-offset-4">
        <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          <DeviceMockup
            desktopSrc={project.coverImage}
            // 2026-08-20 5차: 폰 화면은 **진짜 모바일 뷰**(mobileImage) 우선, 없으면 풀페이지
            phoneSrc={project.mobileImage?.src ?? project.fullImage?.src}
            // 호버 중 모니터 화면이 훑고 내려갈 풀페이지 (없으면 이동 없음 — placeholder)
            scrollSrc={project.fullImage?.src}
            logoSrc={project.logo}
            name={project.name}
            alt={
              project.isPlaceholder
                ? "프로젝트 커버 이미지 자리 (실제 이미지로 교체 예정)"
                : `${project.name} 프로젝트 커버`
            }
            tilt={tilt}
            wide={featured}
            // 비-featured는 DeviceMockup 기본값(420px — 3열 카드 기준)을 그대로 쓴다
            sizes={featured ? "(max-width: 1023px) 100vw, 1200px" : undefined}
          />
        </div>
        <ProjectMeta project={project} compact={compact} />
      </CardShell>
    </article>
  );
}

/**
 * 커버 아래 텍스트 블록.
 *
 * compact (2026-08-19 사용자 요청 "밑에 내용과 여백도 재설정"): 메인 Selected Work 3열 전용.
 * 카드 폭이 376px 라 이름 옆에 업종을 붙이면 줄바꿈이 나므로 **업종을 이름 아래**로 내리고,
 * 설명은 **2줄로 clamp** 한다(전체 문장은 상세 페이지에 있다). 여기에 `min-h-[2lh]` 를 함께
 * 줘서 요약이 1줄인 카드도 2줄 자리를 차지하게 만들어야 **세 카드의 "프로젝트 보기" 줄이
 * 같은 높이에 정렬**된다 — clamp 만으로는 최대치만 맞고 최소치가 안 맞는다.
 * /work 2열 페이지는 지금 그대로(clamp 없음, max-w 유지).
 */
function ProjectMeta({ project, compact = false }: { project: Project; compact?: boolean }) {
  /*
    한 줄 관점 (2026-08-20 2차) — 메타 블록 **최상단**, 프로젝트명 위.
    "작업물이 아니라 생각을 판다"(스러운스튜디오)를 카드 한 줄로 옮긴 자리다.
    perspective 가 없는 프로젝트(placeholder 등)는 줄 자체를 렌더하지 않는다.
  */
  const perspective = project.perspective;

  return (
    <>
      {perspective ? (
        <p
          className={cn(
            "text-[13px] leading-[1.5] font-medium text-cta",
            compact ? "mt-6" : "mt-5",
          )}
        >
          {perspective}
        </p>
      ) : null}
      <div
        className={cn(
          compact
            ? perspective
              ? "mt-1.5"
              : "mt-6"
            : cn(
                "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1",
                perspective ? "mt-1.5" : "mt-5",
              ),
        )}
      >
        {/* 2026-08-19 사용자 "프로젝트 제목 굵기 좀만 더 굵게" — text-h3 기본 600 → 700.
            text-h3(폰트 크기 유틸)가 weight 도 함께 잡으므로 ! 로 확정한다. 섹션 헤딩은 그대로 */}
        <h3 className="text-h3 font-bold! transition-colors duration-200 group-hover:text-indigo">
          {project.name}
        </h3>
        <p className={cn("text-label text-ink-secondary", compact && "mt-1")}>
          {project.industry}
        </p>
      </div>
      <p
        className={cn(
          "text-body-m text-ink-secondary",
          compact ? "mt-2 line-clamp-2 min-h-[2lh]" : "mt-2 max-w-[620px]",
        )}
      >
        {project.summary}
      </p>
      <p className="text-caption mt-3 text-ink-secondary">
        {project.services.join(" · ")}
        {project.isPlaceholder ? " — Placeholder" : null}
      </p>
      {/* 결과 수치는 검증된 경우에만 노출 (문서 §7.4) */}
      {project.resultVerified && project.result ? (
        <p className="text-body-m mt-2 text-indigo">{project.result}</p>
      ) : null}
      <span
        className={cn(
          "text-label inline-flex items-center gap-2 text-ink",
          compact ? "mt-4" : "mt-5",
        )}
      >
        프로젝트 보기
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="origin-center transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </svg>
      </span>
    </>
  );
}
