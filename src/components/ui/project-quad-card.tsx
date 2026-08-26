import Image from "next/image";
import type { Project } from "@/content/projects";
import { deviceFrame } from "@/content/site";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { ProjectCardTrigger } from "@/components/ui/project-modal";
import { cn } from "@/lib/utils";

/**
 * Work **4분할 박스 칸** (2026-08-25 사용자 지시)
 *
 * 사용자: "한 줄에 4칸 · 화면 전폭 · 칸 사이 여백 최소 + 연한 회색 경계선 ·
 *          박스 안에 모니터 화면 + 작은 모바일 화면이 **둘 다 네모 박스**로 ·
 *          박스 밖 돌출 없음 · 3D 기울기 제거 · 설명글은 박스 안쪽 아래에 **항상** 표시"
 *
 * 기존 3열 기울기 목업 카드(`project-card.tsx` + `device-mockup.tsx`)는 **한 줄도 지우지
 * 않았습니다** — `selected-work.tsx` 의 `WORK_LAYOUT` 을 `"cards3"` 로 되돌리면 그대로 복귀합니다.
 *
 * 이 파일이 `device-mockup.tsx` 를 재사용하지 않는 이유:
 *   `DeviceMockup` 은 **3D 기울기(rotateX/Y/Z) + 폰 돌출(-left-2 / bottom 밖)** 이 구조에
 *   박혀 있습니다(그게 그 컴포넌트의 존재 이유입니다). 이번 지시는 그 둘을 **없애는** 것이라
 *   분기 플래그를 더하면 한 컴포넌트가 상반된 두 형태를 들게 됩니다. 대신 **정면 배치 전용**
 *   칸을 따로 두고 호버 규칙(50% 오버레이 · 로고 · 모니터 9s / 폰 11s 자동 스크롤 ·
 *   해제 1.2s 복귀)은 **같은 값**을 그대로 옮겼습니다.
 */

/** 폰이 놓이는 쪽 — 후보 비교(`work-quad-phone-right/left.png`) 후 오른쪽 채택 */
export const QUAD_PHONE_SIDE: "right" | "left" = "right";

/**
 * 칸 안 설명글에 요약(`summary`)까지 넣을지.
 * `false`(채택) — 관점 한 줄 + 프로젝트명 + 업종 세 줄이면 칸이 384×약 400px 로 서고,
 * 요약 2줄을 더하면 칸이 405.13 → 454.72px(+49.6)로 길어지고 4번째 "준비 중" 칸의
 * 아랫부분이 그만큼 비어 그리드가 "글 상자"로 읽힙니다(비교 캡처 `work-quad-summary-on.png`).
 * 요약 전문은 클릭 후 모달에 그대로 있습니다.
 */
export const QUAD_SHOW_SUMMARY = false;

/** 화면(모니터·폰) 위에 얹는 호버 레이어 — 어두워짐 + 로고. 값은 `device-mockup.tsx` 와 동일 */
function ScreenOverlay({ logoSrc, name }: { logoSrc?: string; name?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-[background-color,opacity] duration-300 ease-out group-hover/link:bg-black/50 group-hover/link:opacity-100 group-focus-visible/link:bg-black/50 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt=""
          width={240}
          height={80}
          className="h-[22%] w-auto max-w-[78%] translate-y-1.5 object-contain opacity-0 transition-[transform,opacity] delay-75 duration-300 ease-out group-hover/link:translate-y-0 group-hover/link:opacity-100 group-focus-visible/link:translate-y-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
        />
      ) : (
        <span className="text-label translate-y-1.5 font-semibold text-white opacity-0 transition-[transform,opacity] delay-75 duration-300 ease-out group-hover/link:translate-y-0 group-hover/link:opacity-100 group-focus-visible/link:translate-y-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none">
          {name}
        </span>
      )}
    </div>
  );
}

/** 호버 중 화면이 훑고 내려가는 규칙 — 모니터 9s / 폰 11s, 해제 1.2s 복귀 (기존 값 그대로) */
const scrollClass = (ms: 9000 | 11000) =>
  cn(
    "mockup-scroll object-cover [object-position:50%_0%]",
    "transition-[object-position] duration-[1200ms] ease-out",
    ms === 9000
      ? "group-hover/link:[object-position:50%_100%] group-hover/link:duration-[9000ms] group-hover/link:ease-linear group-focus-visible/link:[object-position:50%_100%] group-focus-visible/link:duration-[9000ms] group-focus-visible/link:ease-linear"
      : "group-hover/link:[object-position:50%_100%] group-hover/link:duration-[11000ms] group-hover/link:ease-linear group-focus-visible/link:[object-position:50%_100%] group-focus-visible/link:duration-[11000ms] group-focus-visible/link:ease-linear",
  );

/** 칸 공통 껍데기 — 격자 안의 한 칸(면은 흰색, 경계선은 그리드의 `gap-px` 가 만든다) */
const CELL =
  "flex h-full flex-col bg-canvas p-4 sm:p-5 lg:p-6";

/** 칸 하나가 화면에서 차지하는 폭 — 1536 에서 칸 383.25px, 그 안 화면 약 335px */
const SIZES = "(max-width: 1023px) 46vw, 24vw";

export function ProjectQuadCard({ project }: { project: Project }) {
  /** 호버 중 훑고 내려갈 풀페이지. 없으면(placeholder) 커버만 놓인다 */
  const monitorSrc = project.fullImage?.src;
  const phoneSrc = project.mobileImage?.src ?? project.fullImage?.src ?? project.coverImage;

  return (
    <article className="group h-full">
      <ProjectCardTrigger
        slug={project.slug}
        name={project.name}
        className="group/link h-full focus-visible:outline-offset-[-4px]"
      >
        <div className={CELL}>
          {/* ── 화면 영역: 모니터(정면) + 그 위 작은 모바일. 둘 다 칸 안에 머문다 ── */}
          <div className="relative pb-[7%]">
            {/* 모니터 — 브라우저 크롬 + 화면. 기울기 없음 */}
            <div className="relative rounded-[10px] border border-line bg-surface-subtle p-2 shadow-[0_10px_22px_-14px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-1 px-0.5 pb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
                <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
                <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
                <span className="ml-1.5 h-2 flex-1 rounded-full bg-line" />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-canvas">
                {/*
                  🚨 **쉬는 모습은 `coverImage` 그대로**다 — 커버는 사용자가 확정한 정지 화면이라
                  바뀌면 안 된다(`device-mockup.tsx` 와 같은 규칙). 아래에 풀페이지를 깔고
                  위의 커버만 페이드아웃시키면 둘 다 미리 받혀 있어 전환이 끊기지 않는다.
                */}
                {monitorSrc ? (
                  <Image
                    src={monitorSrc}
                    alt=""
                    fill
                    sizes={SIZES}
                    quality={50}
                    className={scrollClass(9000)}
                  />
                ) : null}
                <Image
                  src={project.coverImage}
                  alt={`${project.name} 프로젝트 커버`}
                  fill
                  sizes={SIZES}
                  quality={50}
                  className={cn(
                    "object-cover object-top",
                    monitorSrc &&
                      "transition-opacity duration-500 ease-out group-hover/link:opacity-0 group-focus-visible/link:opacity-0 motion-reduce:transition-none",
                  )}
                />
                <ScreenOverlay logoSrc={project.logo} name={project.name} />
              </div>
            </div>

            {/* 모바일 — 모니터 위에 겹치되 **칸 밖으로 나가지 않는다** */}
            <div
              className={cn(
                "absolute bottom-0 w-[21%] [filter:drop-shadow(0_8px_14px_rgba(0,0,0,0.35))]",
                QUAD_PHONE_SIDE === "right" ? "right-[5%]" : "left-[5%]",
              )}
            >
              {deviceFrame === "png" ? (
                <PhoneFrame
                  src={phoneSrc}
                  alt=""
                  sizes="120px"
                  className="w-full"
                  imageClassName={scrollClass(11000)}
                >
                  <ScreenOverlay logoSrc={project.logo} name={project.name} />
                </PhoneFrame>
              ) : (
                <div className="rounded-[8px] border border-line bg-surface-subtle p-[3px]">
                  <div className="relative aspect-[9/17] overflow-hidden rounded-[6px] bg-canvas">
                    <Image
                      src={phoneSrc}
                      alt=""
                      fill
                      sizes="120px"
                      quality={55}
                      className={scrollClass(11000)}
                    />
                    <ScreenOverlay logoSrc={project.logo} name={project.name} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 설명글: 칸 안쪽 아래에 **항상** 보인다(호버 오버레이는 화면 영역만 덮는다) ── */}
          <div className="mt-auto pt-5">
            {project.perspective ? (
              <p className="text-[12.5px] leading-[1.5] font-medium text-cta lg:text-[13px]">
                {project.perspective}
              </p>
            ) : null}
            <h3 className="text-h3 mt-1.5 font-bold! break-keep transition-colors duration-200 group-hover:text-indigo">
              {project.name}
            </h3>
            <p className="text-caption mt-1 text-ink-secondary">{project.industry}</p>
            {QUAD_SHOW_SUMMARY ? (
              <p className="text-caption mt-2 line-clamp-2 leading-[1.6] break-keep text-ink-muted">
                {project.summary}
              </p>
            ) : null}
          </div>
        </div>
      </ProjectCardTrigger>
    </article>
  );
}

/**
 * 4번째 칸 — **준비 중 자리표시**.
 * 사용자 지시대로 **호버 오버레이도 모달도 없고**, 화면 이미지도 넣지 않습니다
 * (`projects.ts` 에 4번째 프로젝트가 없습니다 — 없는 실적을 그림으로 만들지 않습니다).
 */
export function WorkQuadPlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <div className={CELL}>
      <div className="relative pb-[7%]">
        {/*
          🚨 상자 골격(테두리 · p-2 · 크롬 줄 높이 · 화면 16:10)을 **프로젝트 칸과 똑같이** 둔다.
             화면 16:10 만 두면 크롬 줄(약 14px)만큼 짧아져 네 칸의 상자 밑변이 어긋난다(실측).
             안쪽은 비워 두고 점선으로만 표시한다 — 없는 실적을 그림으로 만들지 않는다.
        */}
        <div className="rounded-[10px] border border-dashed border-line bg-surface-subtle p-2">
          <div className="flex items-center pb-1.5">
            <span className="h-2 flex-1 rounded-full bg-line/70" />
          </div>
          <div className="flex aspect-[16/10] items-center justify-center rounded-[5px] bg-canvas">
            <span aria-hidden="true" className="text-[26px] leading-none text-line-strong">
              +
            </span>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-5">
        <h3 className="text-h3 font-bold! text-ink-muted">{title}</h3>
        <p className="text-caption mt-1 text-ink-muted">{note}</p>
      </div>
    </div>
  );
}
