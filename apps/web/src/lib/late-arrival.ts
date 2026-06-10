import { formatKoreanTime } from "@/lib/appointment-time";

export type LateArrivalEstimate = {
  dynamicArrivalTime: Date;
  minutesLate: number;
};

export function normalizeAppointmentAt(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

/** 지각 상태 — 지금 출발 시 예상 도착 시각·지각 분 계산 */
export function computeLateArrival(
  nowMs: number,
  totalDurationMinutes: number,
  appointmentAt: unknown,
): LateArrivalEstimate | null {
  const appointment = normalizeAppointmentAt(appointmentAt);
  const travelMinutes = Number(totalDurationMinutes);

  if (
    !appointment ||
    !Number.isFinite(travelMinutes) ||
    travelMinutes < 0
  ) {
    return null;
  }

  const dynamicArrivalTime = new Date(
    nowMs + travelMinutes * 60 * 1000,
  );
  const minutesLate = Math.round(
    (dynamicArrivalTime.getTime() - appointment.getTime()) / (1000 * 60),
  );

  return { dynamicArrivalTime, minutesLate };
}

export function formatLateArrivalNotice(estimate: LateArrivalEstimate): string {
  const timeLabel = formatKoreanTime(estimate.dynamicArrivalTime);
  return `지금 바로 출발 시 예상 도착: ${timeLabel} (${estimate.minutesLate}분 지각 예정)`;
}
