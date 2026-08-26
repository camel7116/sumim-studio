import { z } from "zod";

/**
 * 상담 폼 검증 스키마 (문서 §7.8)
 * 필수 필드는 최소화한다: 이름, 이메일, 프로젝트 설명, 개인정보 동의.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름 또는 담당자명을 입력해 주세요.")
    .max(50, "50자 이내로 입력해 주세요."),
  company: z.string().trim().max(80, "80자 이내로 입력해 주세요.").optional(),
  phone: z
    .string()
    .trim()
    .max(20, "연락처 형식을 확인해 주세요.")
    .regex(/^$|^[0-9+\-() ]{8,20}$/, "연락처 형식을 확인해 주세요.")
    .optional(),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해 주세요.")
    .email("이메일 형식을 확인해 주세요."),
  service: z.string().trim().max(60).optional(),
  budget: z.string().trim().max(60, "60자 이내로 입력해 주세요.").optional(),
  timeline: z.string().trim().max(60, "60자 이내로 입력해 주세요.").optional(),
  message: z
    .string()
    .trim()
    .min(10, "프로젝트에 대해 10자 이상 설명해 주세요.")
    .max(2000, "2000자 이내로 입력해 주세요."),
  privacy: z.literal("on", {
    message: "개인정보 수집·이용에 동의해 주세요.",
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * **간소 폼용 스키마** (2026-08-23 시안 ③-b · `site.ts` 의 `contactForm.mode === "compact"`).
 *
 * 간소 폼은 칸이 다섯이라 **이메일 칸이 없다.** 대신 **연락처가 필수**다
 * (전화 한 통이 가능하면 상담이 시작된다 — §1 타깃).
 * 🚨 **전송 페이로드 모양은 그대로다** — 빠진 칸은 빈 문자열로 실려 오므로
 *    `app/actions/contact.ts` 와 Web3Forms 본문 조립은 손댈 것이 없다.
 * 🚨 `contactSchema`(전체 폼)는 **한 줄도 바꾸지 않았다** — `mode: "full"` 이면 이메일이
 *    다시 필수가 되고 2026-08-23 오전 검증 그대로다.
 */
export const contactSchemaCompact = contactSchema.extend({
  // 빈 문자열(칸 없음)이거나, 값이 있으면 이메일 형식이어야 한다
  email: z
    .union([z.literal(""), z.string().trim().email("이메일 형식을 확인해 주세요.")])
    .optional(),
  phone: z
    .string()
    .trim()
    .min(1, "연락처를 입력해 주세요.")
    .max(20, "연락처 형식을 확인해 주세요.")
    .regex(/^[0-9+\-() ]{8,20}$/, "연락처 형식을 확인해 주세요."),
});

// 2026-08-08 사용자 확정: 고객이 "구매 단위"로 인식하는 항목만 노출
// (브랜드 전략·SEO는 별도 상품이 아니라 모든 프로젝트에 녹이는 스밈의 방식이므로 제외)
export const serviceOptions = [
  "홈페이지 제작·리뉴얼",
  "네이버 플레이스",
  "블로그 콘텐츠",
  "여러 개를 함께 하고 싶어요",
  "아직 정하지 못했어요",
] as const;
