/** Premium Tint System — 전체 셸 배경 (Linear/Claude 스타일 라이트 테마) */
export function getUrgencyShellClass(
  secondsRemaining: number,
  isLate: boolean,
): string {
  if (isLate) {
    return "bg-[#E4E4E7] transition-all duration-[750ms]";
  }

  if (secondsRemaining < 60 * 3) {
    return "bg-[#FFF0F1] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-colors duration-1000";
  }

  if (secondsRemaining < 60 * 10) {
    return "bg-[#FAF5EE] transition-colors duration-1000";
  }

  return "bg-zinc-50 bg-[radial-gradient(circle_at_top,rgba(244,244,245,0.5),transparent)] transition-colors duration-1000";
}

/** 하단 페이드 그라데이션이 셸 배경과 자연스럽게 이어지도록 매칭 */
export function getUrgencyFadeClass(
  secondsRemaining: number,
  isLate: boolean,
): string {
  if (isLate) {
    return "from-[#E4E4E7] via-[#E4E4E7]/90";
  }

  if (secondsRemaining < 60 * 3) {
    return "from-[#FFF0F1] via-[#FFF0F1]/90";
  }

  if (secondsRemaining < 60 * 10) {
    return "from-[#FAF5EE] via-[#FAF5EE]/90";
  }

  return "from-zinc-50 via-zinc-50/90";
}

/** 타이머 숫자 긴급도 컬러 */
export function getUrgencyTimerClass(
  secondsRemaining: number,
  isLate: boolean,
): string {
  const timerBase =
    "font-timer text-8xl font-black tabular-nums tracking-tighter text-center md:text-9xl";

  if (isLate) {
    return "text-center text-3xl font-semibold tracking-tight text-zinc-400/80";
  }

  if (secondsRemaining < 60 * 3) {
    return `${timerBase} text-rose-600`;
  }

  if (secondsRemaining < 60 * 10) {
    return `${timerBase} text-amber-700`;
  }

  return `${timerBase} text-zinc-900`;
}

/** Over 상태 UI 톤다운 — 본문/라벨 텍스트 */
export function getUrgencyBodyTextClass(isLate: boolean, normalClass: string): string {
  return isLate ? "text-zinc-400/80" : normalClass;
}

/** Over 상태 UI 톤다운 — 보조 텍스트 */
export function getUrgencyMutedTextClass(isLate: boolean): string {
  return isLate ? "text-zinc-400/80" : "text-zinc-500";
}

export function formatCountdownMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
