/** 막차 시각 = 약속 시각 − 대중교통 이동 시간 */
export function computeLeaveDeadlineAt(
  appointmentAt: Date,
  travelMinutes: number,
): Date {
  return new Date(appointmentAt.getTime() - travelMinutes * 60 * 1000);
}

export function getSecondsUntilDeadline(
  deadlineAt: Date,
  now: number = Date.now(),
): number {
  return Math.max(0, Math.floor((deadlineAt.getTime() - now) / 1000));
}

export function isPastDeadline(
  deadlineAt: Date,
  now: number = Date.now(),
): boolean {
  return deadlineAt.getTime() <= now;
}
