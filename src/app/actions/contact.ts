"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { contactSchema, type ContactInput } from "@/lib/validation";

export type ContactFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
};

/**
 * 상담 폼 제출 서버 액션 (문서 §7.8)
 *
 * ⚠️ 2026-08-08부터 미사용: Web3Forms 무료 플랜이 서버(IP) 호출을 막아
 * 폼 전송을 contact-form.tsx의 클라이언트 fetch로 옮겼다.
 * 서버 전송이 가능한 서비스(Resend, SMTP 등)로 바꾸는 날 이 액션을 다시 살릴 것.
 */
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
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

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error);
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
      if (messages && messages.length > 0) {
        fieldErrors[key as keyof ContactInput] = messages[0];
      }
    }
    return {
      status: "error",
      message: "입력 내용을 확인해 주세요.",
      fieldErrors,
    };
  }

  // 문의 메일 전송 (2026-08-08): Web3Forms — WEB3FORMS_ACCESS_KEY(.env.local)가
  // 설정된 경우에만 전송하고, 없으면 기존처럼 완료 페이지로만 이동한다.
  // 키 발급: web3forms.com에서 수신 이메일(sumimstudio@naver.com) 입력 → 메일로 즉시 발급.
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (accessKey) {
    const d = parsed.data;
    const lines = [
      `이름/담당자: ${d.name}`,
      d.company ? `회사/브랜드: ${d.company}` : null,
      d.phone ? `연락처: ${d.phone}` : null,
      `이메일: ${d.email}`,
      d.service ? `필요한 서비스: ${d.service}` : null,
      d.budget ? `예상 예산: ${d.budget}` : null,
      d.timeline ? `희망 일정: ${d.timeline}` : null,
      "",
      "── 프로젝트 설명 ──",
      d.message,
    ].filter((line): line is string => line !== null);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[스밈 문의] ${d.name}${d.company ? ` — ${d.company}` : ""}`,
          from_name: "SUMIM Studio 홈페이지",
          replyto: d.email, // 회신 버튼이 바로 고객 주소로 향하게
          message: lines.join("\n"),
        }),
      });
      if (!res.ok) throw new Error(`web3forms ${res.status}`);
    } catch {
      // 개인정보는 로그에 남기지 않는다. 전송 실패 시 고객에게 대체 경로를 안내한다.
      return {
        status: "error",
        message:
          "일시적인 오류로 접수되지 않았습니다. 잠시 후 다시 시도하시거나 sumimstudio@naver.com 으로 보내주세요.",
      };
    }
  }

  redirect("/thanks");
}
