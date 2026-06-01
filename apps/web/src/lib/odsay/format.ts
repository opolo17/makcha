export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours}시간 ${rest}분` : `${hours}시간`;
}

export function formatArrivalFromSeconds(seconds: number): {
  secondsUntilArrival: number;
  label: string;
} {
  const clamped = Math.max(0, Math.round(seconds));
  if (clamped === 0) {
    return { secondsUntilArrival: 0, label: "곧 도착" };
  }
  if (clamped < 60) {
    return {
      secondsUntilArrival: clamped,
      label: `${clamped}초 후 도착`,
    };
  }
  const minutes = Math.ceil(clamped / 60);
  return {
    secondsUntilArrival: clamped,
    label: `${minutes}분 후 도착`,
  };
}

export function parseArrivalTextToSeconds(text: string): number | null {
  const normalized = text.replace(/\s/g, "");
  if (/곧|도착|진입/.test(normalized) && !/\d/.test(normalized)) {
    return 0;
  }

  let seconds = 0;
  const hourMatch = normalized.match(/(\d+)시간/);
  const minMatch = normalized.match(/(\d+)분/);
  const secMatch = normalized.match(/(\d+)초/);

  if (hourMatch) seconds += Number(hourMatch[1]) * 3600;
  if (minMatch) seconds += Number(minMatch[1]) * 60;
  if (secMatch) seconds += Number(secMatch[1]);

  if (seconds > 0) return seconds;

  const onlyMin = normalized.match(/^(\d+)분/);
  if (onlyMin) return Number(onlyMin[1]) * 60;

  return null;
}
