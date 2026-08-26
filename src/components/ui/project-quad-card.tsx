import Image from "next/image";
import type { Project } from "@/content/projects";
import { deviceFrame } from "@/content/site";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { ProjectCardTrigger } from "@/components/ui/project-modal";
import { cn } from "@/lib/utils";

/**
 * Work **4분할 박스 칸**
 *
 * ── 2026-08-25 (1차 · `QUAD_FRAME = "device"`) ──────────────────────────────
 * 사용자: "한 줄에 4칸 · 화면 전폭 · 칸 사이 여백 최소 + 연한 회색 경계선 ·
 *          박스 안에 모니터 화면 + 작은 모바일 화면이 **둘 다 네모 박스**로 ·
 *          박스 밖 돌출 없음 · 3D 기울기 제거 · 설명글은 박스 안쪽 아래에 **항상** 표시"
 *
 * ── 2026-08-26 (2차 · `QUAD_FRAME = "none"` = 현재 기본) ────────────────────
 * 사용자: "셀렉트 워크 부분의 목업들 **휴대폰 PNG·모니터 그림 다 지우고 네모 박스에 차도록**
 *          만들어 줬으면 좋겠어. **호버했을 때 로고와, 홈페이지명, 설명문이 나오면** 좋을 것 같아."
 *          → 칸 = 이미지 한 장(가장자리까지 `object-cover`), 평상시 텍스트 0,
 *            호버에 로고 · 프로젝트명 · 설명문.
 *
 * 🚨 1차 구성은 **한 줄도 지우지 않았습니다** — 아래 `QUAD_FRAME` 을 `"device"` 로 되돌리면
 *    모니터 크롬 + 우측 하단 폰 + 칸 아래 설명글이 그대로 복귀합니다.
 * 🚨 `phone-frame.tsx` · `device-mockup.tsx` · `deviceFrame` 스위치도 그대로입니다 —
 *    브릿지 밴드 폰 2대가 계속 씁니다. 이 칸이 `"none"` 에서 안 쓸 뿐입니다.
 *
 * 이 파일이 `device-mockup.tsx` 를 재사용하지 않는 이유:
 *   `DeviceMockup` 은 **3D 기울기(rotateX/Y/Z) + 폰 돌출(-left-2 / bottom 밖)** 이 구조에
 *   박혀 있습니다(그게 그 컴포넌트의 존재 이유입니다). 2026-08-25 지시는 그 둘을 **없애는**
 *   것이라 분기 플래그를 더하면 한 컴포넌트가 상반된 두 형태를 들게 됩니다. 대신 **정면 배치
 *   전용** 칸을 따로 두고 호버 규칙(50% 오버레이 · 로고 · 모니터 9s / 폰 11s 자동 스크롤 ·
 *   해제 1.2s 복귀)은 **같은 값**을 그대로 옮겼습니다.
 */

/* ─────────────────────────── 스위치 (되돌리기용) ─────────────────────────── */

/**
 * 🔀 **칸 안 구성** (2026-08-26)
 * | 값 | 화면 |
 * |---|---|
 * | **`"none"`** | **현재** — 목업 프레임 없음. 이미지가 칸을 가장자리까지 채우고, 설명은 **호버**로 |
 * | `"device"` | 2026-08-25 구성 — 모니터 크롬 + 우측 하단 폰 + 칸 안쪽 아래 상시 설명글 |
 */
// 2026-08-26 저녁 사용자 지시 "목업은 이전으로 되돌리자" → "device"(모니터+폰 목업) 복귀
export const QUAD_FRAME: "none" | "device" = "device";

/**
 * `"none"` 칸의 **가로세로 비율**. 프레임과 설명글이 빠지면 높이를 정하는 게 없어져
 * 이 값이 4칸 높이를 결정합니다(모바일 2×2 도 같은 값).
 * 후보 캡처 비교(`work-flat-ratio-{43,11,1610}.png`) 후 **4/3** 채택 — 근거는 START_HERE 참조.
 */
export const QUAD_ASPECT = "4 / 3";

/**
 * 호버 오버레이의 **설명문 출처**. 기본 `"perspective"`(한 줄 관점).
 * `"summary"` 로 바꾸면 요약 2줄(clamp)이 대신 뜹니다. **새 카피는 만들지 않습니다** —
 * 둘 다 `projects.ts` 에 이미 있는 값입니다.
 */
export const QUAD_HOVER_TEXT: "perspective" | "summary" = "perspective";

/** 호버 오버레이 **정렬** — 후보 비교(`work-flat-hover-center/bottomleft.png`) 후 채택 */
export const QUAD_HOVER_ALIGN: "center" | "bottom-left" = "center";

/** 호버 오버레이 **농도** — 흐르는 캡처 위에서 흰 글자가 읽혀야 한다(캡처로 확인) */
export const QUAD_HOVER_SHADE: "50" | "60" | "70" = "60";

/** 호버 오버레이에 업종(`industry`) 한 줄을 더할지 */
export const QUAD_HOVER_TRADE = true;

/**
 * `"none"` 의 4번째(준비 중) 칸 모양.
 * `"plain"`(채택) — 빈 면 + 문구만. `"dashed"` 면 안쪽에 점선 상자를 하나 둡니다.
 */
export const QUAD_PLACEHOLDER: "plain" | "dashed" = "plain";

/* ── 아래 두 개는 2026-08-25 `"device"` 구성 전용 (그대로 보존) ── */

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

/* ──────────────────────────────── 공통 부품 ──────────────────────────────── */

/** 화면(모니터·폰) 위에 얹는 호버 레이어 — 어두워짐 + 로고. 값은 `device-mockup.tsx` 와 동일.
 *  `nameClassName` — 로고 없는 폴백 텍스트의 크기 조정용(모니터는 크게, 폰은 기본 유지. 2026-08-26). */
function ScreenOverlay({
  logoSrc,
  name,
  nameClassName,
}: {
  logoSrc?: string;
  name?: string;
  nameClassName?: string;
}) {
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
        // 🚨 `text-white` 금지 — globals 가 밝은 밴드에서 `.text-white` 를 잉크로 되돌려
        //    검은 오버레이 위 검은 글자가 된다(2026-08-26 경희정원 폴백에서 실제 발생). 값 직접 지정.
        <span
          className={cn(
            nameClassName ?? "text-label font-semibold",
            "translate-y-1.5 text-[#ffffff] opacity-0 transition-[transform,opacity] delay-75 duration-300 ease-out group-hover/link:translate-y-0 group-hover/link:opacity-100 group-focus-visible/link:translate-y-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none",
          )}
        >
          {name}
        </span>
      )}
    </div>
  );
}

/**
 * `"none"` 전용 호버 레이어 — 어두워짐 + **로고 · 프로젝트명 · 설명문(· 업종)**.
 *
 * 🚨 `aria-hidden` 을 **걸지 않습니다.** 칸 전체가 `aria-label` 을 못 박은 버튼이라
 *    안쪽 텍스트가 접근성 이름을 오염시키지 않고, 대신 문서에는 실제 글자로 남습니다
 *    (평상시 화면에서 사라지는 것은 **시각적 표시**뿐입니다).
 * 🚨 배경이 **흐르는 캡처**라 대비가 배경에 따라 흔들립니다 — 면 오버레이(`QUAD_HOVER_SHADE`)
 *    위에 아래쪽 그라디언트를 한 겹 더 얹어 어떤 프레임에서도 글자가 뜹니다.
 */
const SHADE: Record<"50" | "60" | "70", string> = {
  50: "group-hover/link:bg-black/50 group-focus-visible/link:bg-black/50",
  60: "group-hover/link:bg-black/60 group-focus-visible/link:bg-black/60",
  70: "group-hover/link:bg-black/70 group-focus-visible/link:bg-black/70",
};

/**
 * 호버에서 함께 떠오르는 요소 공통 — 살짝 올라오며 나타난다.
 * 🚨 `cn` 은 **단순 join**(tailwind-merge 아님)이라 같은 속성의 유틸을 겹쳐 쓰면 안 된다 —
 *    `delay-*` 를 인자로 받아 **한 번만** 붙인다.
 */
const RISE = (delay: "delay-75" | "delay-100" | "delay-150" | "delay-200") =>
  cn(
    "translate-y-1.5 opacity-0 transition-[transform,opacity] duration-300 ease-out",
    delay,
    "group-hover/link:translate-y-0 group-hover/link:opacity-100 group-focus-visible/link:translate-y-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none",
  );

function FlatHoverInfo({ project }: { project: Project }) {
  const centered = QUAD_HOVER_ALIGN === "center";
  const blurb = QUAD_HOVER_TEXT === "summary" ? project.summary : project.perspective;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex flex-col bg-black/0 opacity-0 transition-[background-color,opacity] duration-300 ease-out group-hover/link:opacity-100 group-focus-visible/link:opacity-100 motion-reduce:transition-none",
        SHADE[QUAD_HOVER_SHADE],
        centered
          ? "items-center justify-center px-6 text-center"
          : "items-start justify-end p-5 text-left lg:p-6",
      )}
    >
      {project.logo ? (
        <Image
          src={project.logo}
          alt=""
          width={240}
          height={80}
          className={cn(
            "w-auto object-contain",
            centered ? "h-[13%] max-w-[62%]" : "h-[11%] max-w-[54%]",
            RISE("delay-75"),
          )}
        />
      ) : null}
      <h3
        className={cn(
          // 🚨 `text-white` 를 쓸 수 없다 — globals.css 가 **밝은 밴드(paper·mist)에서 `.text-white`
          //    를 잉크로 되돌린다**(다크 전용으로 박아둔 흰 글자를 보호하는 규칙, 1366~1369행).
          //    Work 는 흰 밴드라 글자가 검게 나온다(실측 `rgb(16,16,16)`). 이 글자는 **어두운
          //    스크림 위 전용**이므로 값을 직접 준다 — 밴드 팔레트를 따라갈 자리가 아니다.
          "text-h3 font-bold! break-keep text-[#ffffff]",
          project.logo ? "mt-4" : undefined,
          RISE("delay-100"),
        )}
      >
        {project.name}
      </h3>
      {blurb ? (
        <p
          className={cn(
            "mt-2 text-[12.5px] leading-[1.55] break-keep text-[#ffffff]/85 lg:text-[13px]",
            QUAD_HOVER_TEXT === "summary" ? "line-clamp-2" : undefined,
            centered ? "max-w-[30ch]" : undefined,
            RISE("delay-150"),
          )}
        >
          {blurb}
        </p>
      ) : null}
      {QUAD_HOVER_TRADE ? (
        <p className={cn("text-caption mt-2 text-[#ffffff]/65", RISE("delay-200"))}>
          {project.industry}
        </p>
      ) : null}
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
const CELL = "flex h-full flex-col bg-canvas p-4 sm:p-5 lg:p-6";
/** `"none"` 칸 — **패딩 0**. 이미지가 칸을 가장자리까지 채운다 */
const CELL_FLAT = "relative h-full w-full overflow-hidden bg-canvas";

/** 칸 하나가 화면에서 차지하는 폭 — 1536 에서 칸 383.25px, 그 안 화면 약 335px */
const SIZES = "(max-width: 1023px) 46vw, 24vw";

export function ProjectQuadCard({ project }: { project: Project }) {
  return (
    <article className="group h-full" style={QUAD_FRAME === "none" ? { aspectRatio: QUAD_ASPECT } : undefined}>
      <ProjectCardTrigger
        slug={project.slug}
        name={project.name}
        className="group/link h-full focus-visible:outline-offset-[-4px]"
      >
        {QUAD_FRAME === "none" ? <FlatCell project={project} /> : <DeviceCell project={project} />}
      </ProjectCardTrigger>
    </article>
  );
}

/* ───────────────────────── "none" — 이미지가 칸을 채운다 ───────────────────────── */

/**
 * 🚨 **쉬는 모습은 `coverImage` 그대로**다 — 커버는 사용자가 확정한 정지 화면이라 바뀌면 안 된다
 *    (`device-mockup.tsx` 와 같은 규칙). 아래에 풀페이지를 깔고 위의 커버만 페이드아웃시키면
 *    둘 다 미리 받혀 있어 호버 스크롤 전환이 끊기지 않는다. 프레임만 사라졌을 뿐 이 규칙은 같다.
 */
function FlatCell({ project }: { project: Project }) {
  const scrollSrc = project.fullImage?.src;

  return (
    <div className={CELL_FLAT}>
      {scrollSrc ? (
        <Image src={scrollSrc} alt="" fill sizes={SIZES} quality={50} className={scrollClass(9000)} />
      ) : null}
      <Image
        src={project.coverImage}
        alt={`${project.name} 프로젝트 커버`}
        fill
        sizes={SIZES}
        quality={50}
        className={cn(
          "object-cover object-top",
          scrollSrc &&
            "transition-opacity duration-500 ease-out group-hover/link:opacity-0 group-focus-visible/link:opacity-0 motion-reduce:transition-none",
        )}
      />
      <FlatHoverInfo project={project} />
    </div>
  );
}

/* ─────────── "device" — 2026-08-25 구성 (모니터 + 우측 하단 폰 + 상시 설명글) ─────────── */

function DeviceCell({ project }: { project: Project }) {
  /** 호버 중 훑고 내려갈 풀페이지. 없으면(placeholder) 커버만 놓인다 */
  const monitorSrc = project.fullImage?.src;
  const phoneSrc = project.mobileImage?.src ?? project.fullImage?.src ?? project.coverImage;

  return (
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
            {/* 모니터는 화면이 넓어 폴백 이름을 크게(2026-08-26 사용자 지시) — 폰 쪽은 기본 크기 유지 */}
            <ScreenOverlay
              logoSrc={project.logo}
              name={project.name}
              nameClassName="text-h3 font-bold"
            />
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
  );
}

/**
 * 4번째 칸 — **준비 중 자리표시**.
 * 사용자 지시대로 **호버 오버레이도 모달도 없고**, 화면 이미지도 넣지 않습니다
 * (`projects.ts` 에 4번째 프로젝트가 없습니다 — 없는 실적을 그림으로 만들지 않습니다).
 */
export function WorkQuadPlaceholder({ title, note }: { title: string; note: string }) {
  if (QUAD_FRAME === "none") {
    /*
      프레임이 없어졌으니 점선 "상자"를 흉내 낼 대상도 없습니다. 세 칸이 **가장자리까지 찬 면**이라
      네 번째도 **면 하나**로 두고 문구만 가운데 놓습니다(`"dashed"` 면 안쪽 점선 테두리 추가).
      🚨 실적·수치·업체명을 만들지 않습니다(§6 원칙).
    */
    return (
      <div
        className="relative flex h-full w-full items-stretch overflow-hidden bg-surface-subtle"
        style={{ aspectRatio: QUAD_ASPECT }}
      >
        <div
          className={
            QUAD_PLACEHOLDER === "dashed"
              ? "m-4 flex flex-1 flex-col items-center justify-center border border-dashed border-line px-4 text-center lg:m-6"
              : "flex flex-1 flex-col items-center justify-center px-4 text-center"
          }
        >
          <span aria-hidden="true" className="text-[26px] leading-none text-line-strong">
            +
          </span>
          <h3 className="text-h3 mt-3 font-bold! text-ink-muted">{title}</h3>
          <p className="text-caption mt-1 text-ink-muted">{note}</p>
        </div>
      </div>
    );
  }

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
