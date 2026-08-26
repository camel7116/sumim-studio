"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";
import { contactBudgetOptions, contactForm, offer } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import {
  contactSchema,
  contactSchemaCompact,
  serviceOptions,
  type ContactInput,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type ContactFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
};

/**
 * Web3Forms 액세스 키 (2026-08-08).
 * 무료 플랜은 서버(IP) 호출을 막고 브라우저 제출만 허용하므로 클라이언트에서 전송한다.
 * 이 키는 "폼 수신 주소 지정용"으로 공개를 전제로 설계된 값이라 번들 노출이 안전하다.
 */
// 🚨 2026-08-26: 배포(sumimstudio.co.kr)에서 환경변수 미설정으로 키가 비어
// "전송 생략 → /thanks" 폴백을 타는 사고가 있었다(사용자 실제 문의 유실).
// 위 주석대로 공개 전제 키라 코드 폴백으로 박아 환경변수 없이도 항상 전송된다.
// (Vercel 에 NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY 를 넣으면 그 값이 우선한다)
const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "14da2a47-28fc-46af-90d5-c093caaae28d";

const inputClass =
  "w-full rounded-[12px] border border-line-strong bg-surface px-4 py-3 text-body-m text-ink placeholder:text-ink-secondary focus-visible:border-focus";

const labelClass = "text-label mb-2 block text-ink";

/**
 * 🔀 **시안 ③-b — 간소 폼** (`site.ts` 의 `contactForm.mode`).
 * `"compact"`(현재) = 5칸 / `"full"` = **2026-08-23 오전 8칸 폼** 그대로.
 */
const COMPACT = contactForm.mode === "compact";

/**
 * 🚨 **전송 페이로드 모양 고정** — 간소 폼에서 빠진 칸은 **빈 문자열**로 함께 보낸다.
 * 이 히든 인풋들이 있어야 `FormData` 의 키 구성이 전체 폼과 같아지고,
 * `app/actions/contact.ts` 와 Web3Forms 본문 조립이 손댈 것 없이 그대로 동작한다.
 * (빈 값이라 메일 본문에서는 해당 줄이 예전처럼 자동으로 빠진다)
 */
const OMITTED_IN_COMPACT = ["email", "service", "budget", "timeline"] as const;

/**
 * 지금 모드에 맞는 검증 스키마 — 간소 폼이면 이메일 선택 / 연락처 필수.
 * ⚠️ 두 스키마는 **키 구성이 같고 email/phone 의 필수 여부만 다르다.** 유니온으로 두면
 *    `z.flattenError` 오버로드가 갈리므로 타입은 전체 폼 쪽으로 맞춰 둔다
 *    (런타임 검증은 실제로 고른 스키마가 한다).
 */
const activeSchema: typeof contactSchema = COMPACT
  ? (contactSchemaCompact as unknown as typeof contactSchema)
  : contactSchema;

/** 간소 폼에서는 이메일이 없을 수 있다 */
type ContactPayload = Omit<ContactInput, "email"> & { email?: string };

/**
 * 연락처 자동 하이픈 (2026-08-08 사용자 요청)
 * 숫자만 남긴 뒤 유형별로 끼워 넣는다: 02 지역번호(2-3/4-4), 그 외(3-3/4-4).
 * 입력 중에도 자연스럽게 붙도록 길이 단계별로 처리한다.
 */
function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.startsWith("02")) {
    if (d.length <= 2) return d;
    if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`;
  }
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/** 이메일 @ 뒤 도메인 자동 제안 후보 (2026-08-08 사용자 요청) */
const EMAIL_DOMAINS = [
  "naver.com",
  "gmail.com",
  "daum.net",
  "hanmail.net",
  "kakao.com",
] as const;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-caption mt-1.5 text-error">
      {message}
    </p>
  );
}

/**
 * 상담 폼 (문서 §7.8)
 * - 필수: 이름, 이메일, 프로젝트 설명, 개인정보 동의
 * - 오류는 필드 바로 아래 표시, 제출 중 상태 명시
 * - 성공 시 서버 액션이 /thanks로 이동시킨다.
 */
export function ContactForm() {
  const router = useRouter();
  const [state, setState] = useState<ContactFormState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);
  const startedRef = useRef(false);

  /** 검증(서버 액션과 동일한 스키마) 후 브라우저에서 Web3Forms로 직접 전송한다 */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("contact_submit");

    const formData = new FormData(event.currentTarget);
    const raw = {
      name: formData.get("name") ?? "",
      company: formData.get("company") ?? undefined,
      phone: formData.get("phone") ?? undefined,
      email: formData.get("email") ?? "",
      service: formData.get("service") ?? undefined,
      budget: formData.get("budget") ?? undefined,
      timeline: formData.get("timeline") ?? undefined,
      message: formData.get("message") ?? "",
      privacy: formData.get("privacy") ?? "",
    };

    const parsed = activeSchema.safeParse(raw);
    if (!parsed.success) {
      const flattened = z.flattenError(parsed.error);
      const fieldErrors: ContactFormState["fieldErrors"] = {};
      for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
        if (messages && messages.length > 0) {
          fieldErrors[key as keyof ContactInput] = messages[0];
        }
      }
      setState({ status: "error", message: "입력 내용을 확인해 주세요.", fieldErrors });
      return;
    }

    // 키 미설정 환경(예: 로컬 초기 세팅)에서는 기존처럼 완료 페이지로만 이동한다.
    if (!WEB3FORMS_ACCESS_KEY) {
      router.push("/thanks");
      return;
    }

    const d = parsed.data as ContactPayload;
    const lines = [
      `이름/담당자: ${d.name}`,
      d.company ? `회사/브랜드: ${d.company}` : null,
      d.phone ? `연락처: ${d.phone}` : null,
      // 간소 폼에는 이메일 칸이 없다 — 값이 있을 때만 줄을 만든다
      d.email ? `이메일: ${d.email}` : null,
      d.service ? `필요한 서비스: ${d.service}` : null,
      d.budget ? `예상 예산: ${d.budget}` : null,
      d.timeline ? `희망 일정: ${d.timeline}` : null,
      "",
      "── 프로젝트 설명 ──",
      d.message,
    ].filter((line): line is string => line !== null);

    setIsPending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[스밈 문의] ${d.name}${d.company ? ` — ${d.company}` : ""}`,
          from_name: "SUMIM Studio 홈페이지",
          // 회신 버튼이 바로 고객 주소로 향하게. 간소 폼은 이메일이 없을 수 있어 그때는 생략한다
          ...(d.email ? { replyto: d.email } : null),
          message: lines.join("\n"),
        }),
      });
      const result = (await res.json()) as { success?: boolean };
      if (!res.ok || !result.success) throw new Error("send failed");
      router.push("/thanks");
    } catch {
      setState({
        status: "error",
        message:
          "일시적인 오류로 접수되지 않았습니다. 잠시 후 다시 시도하시거나 sumimstudio@naver.com 으로 보내주세요.",
      });
      setIsPending(false);
    }
  }

  // 이메일 도메인 자동 제안용 — @ 뒤를 입력 중일 때만 후보를 만든다.
  // datalist는 브라우저가 팝업 위치를 제어해 입력창에서 떨어져 뜨는 문제가 있어
  // (2026-08-08 사용자 피드백) 입력창 바로 아래 커스텀 목록으로 렌더한다.
  const [emailValue, setEmailValue] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailActive, setEmailActive] = useState(-1);
  const atIndex = emailValue.indexOf("@");
  const emailSuggestions =
    atIndex > 0
      ? EMAIL_DOMAINS.filter((domain) =>
          domain.startsWith(emailValue.slice(atIndex + 1)),
        )
          .map((domain) => `${emailValue.slice(0, atIndex)}@${domain}`)
          .filter((suggestion) => suggestion !== emailValue)
      : [];
  const emailListVisible = emailOpen && emailSuggestions.length > 0;

  function pickEmail(suggestion: string) {
    setEmailValue(suggestion);
    setEmailOpen(false);
    setEmailActive(-1);
  }

  function handleEmailKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!emailListVisible) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setEmailActive((i) => (i + 1) % emailSuggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setEmailActive((i) => (i <= 0 ? emailSuggestions.length - 1 : i - 1));
    } else if (event.key === "Enter" && emailActive >= 0) {
      event.preventDefault();
      pickEmail(emailSuggestions[emailActive]);
    } else if (event.key === "Escape") {
      setEmailOpen(false);
      setEmailActive(-1);
    }
  }

  function handleFirstInteraction() {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("contact_start");
    }
  }

  const errors = state.fieldErrors ?? {};

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFirstInteraction}
      noValidate
      // contact-panel 은 스타일 훅 — CTA 섹션에서만 패널을 더 불투명하게 (globals #contact)
      className="contact-panel rounded-l bg-surface p-6 text-ink md:p-10"
    >
      {/*
        ── 간소 폼 (2026-08-23 시안 ③-b) ────────────────────────────────────────
        이름 · 연락처 · 업체명/홈페이지 주소 · 고민 한 가지 · 동의 = **5칸**.
        빠진 칸(이메일·서비스·예산·일정)은 아래 히든 인풋이 **빈 문자열**로 함께 보낸다.
        `contactForm.mode` 를 `"full"` 로 되돌리면 이 블록이 빠지고 예전 8칸 폼이 나온다.
      */}
      {COMPACT ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              {contactForm.compact.nameLabel}{" "}
              <span aria-hidden="true" className="text-terracotta">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={cn(inputClass, errors.name && "border-error")}
            />
            <FieldError id="contact-name-error" message={errors.name} />
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              {contactForm.compact.phoneLabel}{" "}
              <span aria-hidden="true" className="text-terracotta">*</span>
            </label>
            {/* 입력과 동시에 하이픈 자동 삽입 (2026-08-08 사용자 요청) */}
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="010-0000-0000"
              required
              aria-required="true"
              onInput={(event) => {
                event.currentTarget.value = formatPhone(event.currentTarget.value);
              }}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "contact-phone-error" : undefined}
              className={cn(inputClass, errors.phone && "border-error")}
            />
            <FieldError id="contact-phone-error" message={errors.phone} />
          </div>

          {/* 업체명과 홈페이지 주소를 **한 칸**으로 받는다(둘 중 아무거나 적으면 된다) */}
          <div className="md:col-span-2">
            <label htmlFor="contact-company" className={labelClass}>
              {contactForm.compact.siteLabel}
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder={contactForm.compact.sitePlaceholder}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="contact-message" className={labelClass}>
              {contactForm.compact.concernLabel}{" "}
              <span aria-hidden="true" className="text-terracotta">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={2}
              required
              aria-required="true"
              placeholder={contactForm.compact.concernPlaceholder}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className={cn(inputClass, "resize-y", errors.message && "border-error")}
            />
            <FieldError id="contact-message-error" message={errors.message} />
          </div>

          {/* 🚨 페이로드 모양 유지용 — 화면에 보이지 않고 값도 빈 문자열이다 */}
          {OMITTED_IN_COMPACT.map((field) => (
            <input key={field} type="hidden" name={field} value="" readOnly />
          ))}
        </div>
      ) : null}

      {COMPACT ? null : (
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            이름 또는 담당자명 <span aria-hidden="true" className="text-terracotta">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={cn(inputClass, errors.name && "border-error")}
          />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>

        <div>
          <label htmlFor="contact-company" className={labelClass}>
            회사/브랜드명
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            연락처
          </label>
          {/* 입력과 동시에 하이픈 자동 삽입 (2026-08-08 사용자 요청) */}
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="010-0000-0000"
            onInput={(event) => {
              event.currentTarget.value = formatPhone(event.currentTarget.value);
            }}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className={cn(inputClass, errors.phone && "border-error")}
          />
          <FieldError id="contact-phone-error" message={errors.phone} />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            이메일 <span aria-hidden="true" className="text-terracotta">*</span>
          </label>
          {/* @ 뒤 도메인(네이버·지메일 등) 자동 제안 — 입력창 바로 아래 커스텀 목록 (2026-08-08) */}
          <div className="relative">
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="off"
              role="combobox"
              aria-expanded={emailListVisible}
              aria-controls="contact-email-suggestions"
              aria-autocomplete="list"
              value={emailValue}
              onChange={(event) => {
                setEmailValue(event.target.value);
                setEmailOpen(true);
                setEmailActive(-1);
              }}
              onKeyDown={handleEmailKeyDown}
              onBlur={() => {
                setEmailOpen(false);
                setEmailActive(-1);
              }}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={cn(inputClass, errors.email && "border-error")}
            />
            {emailListVisible && (
              <ul
                id="contact-email-suggestions"
                role="listbox"
                className="absolute inset-x-0 top-full z-10 mt-1.5 overflow-hidden rounded-[12px] border border-line bg-surface shadow-soft"
              >
                {emailSuggestions.map((suggestion, index) => (
                  <li key={suggestion} role="option" aria-selected={index === emailActive}>
                    <button
                      type="button"
                      tabIndex={-1}
                      // blur보다 먼저 실행되도록 mousedown에서 선택한다
                      onMouseDown={(event) => {
                        event.preventDefault();
                        pickEmail(suggestion);
                      }}
                      onMouseEnter={() => setEmailActive(index)}
                      className={cn(
                        "text-body-m w-full px-4 py-2.5 text-left text-ink",
                        index === emailActive && "bg-surface-subtle",
                      )}
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <FieldError id="contact-email-error" message={errors.email} />
        </div>

        <div>
          <label htmlFor="contact-service" className={labelClass}>
            필요한 서비스
          </label>
          {/* appearance-none: 브라우저 기본 셀렉트의 내부 들여쓰기를 제거해
              다른 입력창과 텍스트 시작 위치를 맞춘다 (2026-08-08 사용자 요청).
              기본 화살표가 사라지므로 커스텀 화살표를 우측에 얹는다. */}
          <div className="relative">
            <select
              id="contact-service"
              name="service"
              className={`${inputClass} appearance-none pr-10`}
              defaultValue=""
            >
              <option value="">선택해 주세요</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-secondary"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="contact-budget" className={labelClass}>
            예상 예산 범위
          </label>
          {/* 2026-08-22 자유 입력 → 셀렉트. 구간은 `site.ts` 의 contactBudgetOptions 하나뿐이고
              name="budget" 을 그대로 둬서 Web3Forms 전송 필드·검증 스키마는 손대지 않았다.
              화살표·appearance-none 처리는 위 "필요한 서비스" 셀렉트와 같은 형태. */}
          <div className="relative">
            <select
              id="contact-budget"
              name="budget"
              className={`${inputClass} appearance-none pr-10`}
              defaultValue=""
            >
              <option value="">선택해 주세요</option>
              {contactBudgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-secondary"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-timeline" className={labelClass}>
            희망 일정
          </label>
          <input
            id="contact-timeline"
            name="timeline"
            type="text"
            placeholder="예: 3개월 안에 오픈하고 싶어요"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-message" className={labelClass}>
            프로젝트 설명 <span aria-hidden="true" className="text-terracotta">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            aria-required="true"
            placeholder="현재 상황과 목표, 고민을 자유롭게 들려주세요."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={cn(inputClass, "resize-y", errors.message && "border-error")}
          />
          <FieldError id="contact-message-error" message={errors.message} />
        </div>
      </div>
      )}

      <div className="mt-6">
        <div className="flex items-start gap-3">
          <input
            id="contact-privacy"
            name="privacy"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.privacy)}
            aria-describedby={errors.privacy ? "contact-privacy-error" : undefined}
            className="mt-1 h-4.5 w-4.5 shrink-0 accent-[var(--color-indigo)]"
          />
          <label htmlFor="contact-privacy" className="text-body-m text-ink-secondary">
            <Link href="/privacy" className="text-ink underline underline-offset-4">
              개인정보처리방침
            </Link>
            에 따라 상담 목적의 개인정보 수집·이용에 동의합니다.{" "}
            <span aria-hidden="true" className="text-terracotta">*</span>
          </label>
        </div>
        <FieldError id="contact-privacy-error" message={errors.privacy} />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-body-m mt-6 text-error">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-8 btn-arrow inline-flex h-13 w-full items-center justify-center rounded-[6px] bg-cta px-6 text-[15px] font-semibold text-white transition duration-[220ms] ease-out hover:-translate-y-0.5 hover:bg-[#F0650F] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:w-auto"
      >
        {/* 🔀 `offer.unified` 가 고른다 — false 면 "프로젝트 문의하기" 로 복귀 */}
        {isPending
          ? "전송 중..."
          : offer.unified
            ? offer.formSubmit
            : offer.formSubmitOriginal}
      </button>
      <p aria-live="polite" className="sr-only">
        {isPending ? "문의를 전송하고 있습니다." : ""}
      </p>
    </form>
  );
}
