/**
 * 프로세스 8단계 (문서 §8.7)
 *
 * 2026-08-08 사용자 요청으로 전면 재정비:
 * 내부 작업 용어(Discover·Research…) → 고객이 실제로 겪는 단계(상담→계약→…→사후 관리).
 * note는 각 단계에서 고객이 얻는 것·약속을 한 줄로 적고 주황으로 강조한다.
 * null이면 표시하지 않는다(확정 전 정책은 비워 둔다).
 *
 * TODO(팀 확정): 자체 방법론 네이밍.
 *   후보 — **"매출 구조 설계 프로세스"** (2026-08-20 리디자인 2차에서 제안).
 *   확정되면 아래 processSection.heading 위(또는 eyebrow 자리)에 반영한다.
 *   지금은 이름을 지어내 화면에 올리지 않는다.
 */

import { offer } from "@/content/site";

export type ProcessStep = {
  number: string;
  title: string;
  /** 제목 옆 작은 회색 부연 (예: "(옵션 선택 시)"). 없으면 생략 */
  titleNote?: string;
  description: string;
  /** 주황 포인트 한 줄 (정책·약속). 미확정이면 null */
  note: string | null;
};

export const processSection = {
  eyebrow: "PROCESS",
  heading: "감각에 맡기지 않고,\n과정으로 완성합니다.",
  /**
   * 2026-08-23 중복 제거: "스밈의 모든 프로젝트는 대표가 처음부터 끝까지 함께합니다."
   *   → "대표가 처음부터 끝까지"는 **대표 소개 섹션(`site.ts` 의 `founder`) 한 곳**에만 남긴다.
   *   되살리려면 위 문자열을 그대로 다시 넣으면 된다(`process.tsx` 는 null 이면 건너뛴다).
   */
  description: null as string | null,
} as const;

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "상담 및 진단",
    description: "현재 상황과 목표를 듣고 필요한 범위를 정리합니다.",
    /**
     * 🔀 2026-08-23 — 오퍼 이름 통일. `offer.unified` 가 true 면 사이트의 CTA 라벨
     * ("무료 진단")과 같은 말을 쓰고, false 면 2026-08-23 오전 문구 "무료 상담"으로 복귀한다.
     */
    note: offer.unified ? "무료 진단" : "무료 상담",
  },
  {
    number: "02",
    title: "계약 및 착수",
    description: "범위·일정·비용을 문서로 확정하고 시작합니다.",
    // TODO(미확정): 착수금 비율 등 결제 조건 확정 시 입력 (예: "착수금 50% 입금")
    note: null,
  },
  {
    number: "03",
    title: "브랜드 기획",
    description: "포지셔닝과 메시지, 사이트 구조를 설계합니다.",
    note: "브랜드 한 줄 정의 도출",
  },
  {
    number: "04",
    title: "1차 시안",
    description: "디자인 시안을 보여드리고 함께 방향을 정합니다.",
    note: "시안 확인 후 진행",
  },
  {
    number: "05",
    title: "개발 및 연결",
    description: "반응형으로 개발하고 검색·플레이스·블로그를 연결합니다.",
    note: "모든 기기 반응형 기본",
  },
  {
    number: "06",
    title: "수정 및 검수",
    description: "실제 화면에서 함께 확인하고 다듬습니다.",
    // TODO(미확정): 수정 횟수 정책 확정 시 입력 (예: "무제한 수정 제공")
    note: null,
  },
  {
    number: "07",
    title: "오픈 및 인수인계",
    description: "배포하고 직접 관리하실 수 있게 알려드립니다.",
    note: "운영 가이드 전달",
  },
  {
    number: "08",
    title: "사후 관리",
    titleNote: "(옵션 선택 시)",
    description: "오픈 이후에도 유지보수·관리 대행으로 운영을 이어갑니다.",
    note: null,
  },
];
