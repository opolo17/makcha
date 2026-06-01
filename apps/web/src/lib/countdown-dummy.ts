export type RouteStep = {
  id: string;
  modeLabel: string;
  segments: string[];
  /** 지하철 열차 도착 등 강조 줄 */
  highlightLine?: string;
};

export const DUMMY_COUNTDOWN = {
  /** 막차 출발까지 남은 시간 (초) — 05:14 */
  remainingSeconds: 5 * 60 + 14,
  pressureCopy: "지금 현관문 나서서 뛰어야 딱 맞습니다!",
  arrivalNotice: "예상 도착 시각: 오후 06:57 (약속 3분 전 세이프)",
  route: [
    {
      id: "walk-1",
      modeLabel: "도보",
      segments: [
        "현관문 출문 🏃‍♂️ (지금 바로 출발!)",
        "도보 5분",
      ],
    },
    {
      id: "subway-1",
      modeLabel: "지하철",
      segments: ["강남역 (2호선)", "이동 12분"],
      highlightLine: "★ [성수행] 열차 3분 뒤 전역 도착 예정!",
    },
    {
      id: "transfer",
      modeLabel: "환승",
      segments: [
        "신논현역 (신분당선 환승)",
        "환승 대기 약 4분 예상",
        "이동 8분",
      ],
    },
    {
      id: "walk-2",
      modeLabel: "도보",
      segments: ["양재역 3번 출구 → 목적지", "도보 3분"],
    },
  ] satisfies RouteStep[],
} as const;
