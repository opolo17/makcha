/** 남은 분(이상) 기준 압박 카피 — threshold 내림차순으로 조회 */
export const PRESSURE_COPY_BY_MINUTES = [
  {
    minMinutesRemaining: 10,
    copy: "아직 여유 있어 보여도, 지금 준비 안 하면 막차 놓칩니다.",
  },
  {
    minMinutesRemaining: 3,
    copy: "지금 현관문 나서서 뛰어야 딱 맞습니다!",
  },
  {
    minMinutesRemaining: 1,
    copy: "신발 신고 나가세요. 엘리베이터 기다리면 끝입니다.",
  },
  {
    minMinutesRemaining: 0,
    copy: "문 열고 나가세요. 지금이 막차입니다.",
  },
] as const;

export const LATE_PRESSURE_COPY = "이미 늦었습니다. 다음엔 버퍼를 늘리세요.";

export function getPressureCopy(
  minutesRemaining: number,
  isLate: boolean,
): string {
  if (isLate || minutesRemaining <= 0) {
    return LATE_PRESSURE_COPY;
  }

  for (const entry of PRESSURE_COPY_BY_MINUTES) {
    if (minutesRemaining >= entry.minMinutesRemaining) {
      return entry.copy;
    }
  }

  return PRESSURE_COPY_BY_MINUTES[PRESSURE_COPY_BY_MINUTES.length - 1].copy;
}
