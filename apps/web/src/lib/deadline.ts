/** API 연동 전 가상 이동 시간(분) */
export const VIRTUAL_TRAVEL_MINUTES = 30;

export function computeLeaveDeadlineAt(
  bufferMinutes: number,
  from: Date = new Date(),
): Date {
  const totalMinutes = bufferMinutes + VIRTUAL_TRAVEL_MINUTES;
  return new Date(from.getTime() + totalMinutes * 60 * 1000);
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
