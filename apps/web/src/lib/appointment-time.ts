export type AppointmentTimeInput = {
  hour: number;
  minute: number;
  meridiem: "AM" | "PM";
};

/** 12시간제 + AM/PM → 24시간제 (0–23) */
export function to24Hour(hour12: number, meridiem: "AM" | "PM"): number {
  if (meridiem === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

/** 오늘 날짜 기준으로 약속 시각 Date 생성 */
export function parseAppointmentToTodayDate(
  input: AppointmentTimeInput,
  reference: Date = new Date(),
): Date {
  const hour24 = to24Hour(input.hour, input.meridiem);
  const result = new Date(reference);
  result.setHours(hour24, input.minute, 0, 0);
  return result;
}

export function formatKoreanTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPm = hours >= 12;
  const hour12 = hours % 12 || 12;
  const meridiem = isPm ? "오후" : "오전";
  return `${meridiem} ${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** 카운트다운·차량 시각 강조용 — "오후 11시 32분" */
export function formatKoreanTimeVerbose(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPm = hours >= 12;
  const hour12 = hours % 12 || 12;
  const meridiem = isPm ? "오후" : "오전";
  return `${meridiem} ${hour12}시 ${String(minutes).padStart(2, "0")}분`;
}
