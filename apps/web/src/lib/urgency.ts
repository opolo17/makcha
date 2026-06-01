/** 남은 초에 따른 긴급도 배경 (카운트다운 화면) */
export function getUrgencyShellClass(secondsRemaining: number): string {
  if (secondsRemaining < 60 * 3) {
    return "bg-red-900 animate-pulse";
  }
  if (secondsRemaining < 60 * 10) {
    return "bg-yellow-900";
  }
  return "bg-zinc-900";
}

export function formatCountdownMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
