"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 실제 화면 미리보기 (2026-08-12 사용자 요청)
 * - 프로젝트 시안(단일 파일 HTML, /embeds/*)을 iframe으로 그대로 불러온다.
 * - 기기 버튼으로 iframe 폭을 바꿔 반응형 화면을 확인할 수 있다.
 * - iframe 뷰포트 = 프레임 폭이므로 사이트 자체의 미디어쿼리가 그대로 동작한다.
 */

const MODES = [
  { key: "desktop", label: "데스크톱", width: "100%" },
  { key: "tablet", label: "태블릿", width: "768px" },
  { key: "mobile", label: "모바일", width: "390px" },
] as const;

type Mode = (typeof MODES)[number];

type SitePreviewProps = {
  src: string;
  /** iframe title (접근성) */
  title: string;
  className?: string;
};

export function SitePreview({ src, title, className }: SitePreviewProps) {
  const [mode, setMode] = useState<Mode>(MODES[0]);

  return (
    <div className={className}>
      <div role="group" aria-label="미리보기 기기 크기" className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode.key === m.key}
            className={cn(
              "text-label rounded-full border px-4 py-2 transition-colors duration-200",
              mode.key === m.key
                ? "border-ink bg-ink text-white"
                : "border-line text-ink-secondary hover:border-line-strong hover:text-ink",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto rounded-l border border-line bg-surface-subtle p-3 shadow-soft md:p-5">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          style={{ width: mode.width, maxWidth: "100%" }}
          className="mx-auto block h-[600px] rounded-[8px] border border-line bg-white transition-[width] duration-300 motion-reduce:transition-none md:h-[720px]"
        />
      </div>
    </div>
  );
}
