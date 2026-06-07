/** 막차 시각 = 약속 시각 − (이동 시간 + 준비 버퍼) */
export function computeLeaveDeadlineAt(
  appointmentAt: Date,
  travelMinutes: number,
  bufferMinutes: number,
): Date {
  const totalMinutes = travelMinutes + bufferMinutes;
  return new Date(appointmentAt.getTime() - totalMinutes * 60 * 1000);
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
