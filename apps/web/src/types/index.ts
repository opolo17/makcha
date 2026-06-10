/** 계산된 막차(leave-by) 데드라인 */
export type MakchaDeadline = {
  /** 지금 문 열고 나가야 하는 시각 */
  leaveBy: Date;
  /** 목적지 도착 목표 시각 */
  arriveBy: Date;
};

/** 지하철·도보 등 이동 구간 (transit 연동 시 확장) */
export type TransitLeg = {
  mode: "subway" | "walk" | "bus";
  durationMinutes: number;
  label?: string;
};
