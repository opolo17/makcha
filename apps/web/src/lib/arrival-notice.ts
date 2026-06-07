import { formatKoreanTime } from "@/lib/appointment-time";

/** 막차 시각 기준 예상 도착 안내 문구 */
export function buildArrivalNotice(
  appointmentAt: Date,
  deadlineAt: Date,
  travelMinutes: number,
): string {
  const estimatedArrival = new Date(
    deadlineAt.getTime() + travelMinutes * 60 * 1000,
  );
  const minutesBefore = Math.max(
    0,
    Math.round(
      (appointmentAt.getTime() - estimatedArrival.getTime()) / (60 * 1000),
    ),
  );

  return `예상 도착 시각: ${formatKoreanTime(estimatedArrival)} (약속 ${minutesBefore}분 전 세이프)`;
}
