import type { FirstVehicleSchedule } from "@/types/transit-route";
import { formatKoreanTimeVerbose } from "@/lib/appointment-time";

export type ResolvedVehicleDepartures = {
  firstDeparture: Date;
  nextDeparture: Date | null;
  firstRemainingSeconds: number;
  nextRemainingSeconds: number | null;
  missedFirst: boolean;
};

export function resolveVehicleDepartures(
  schedule: FirstVehicleSchedule,
  nowMs: number = Date.now(),
): ResolvedVehicleDepartures {
  const capturedAt = new Date(schedule.capturedAt).getTime();
  const elapsed = Math.max(0, (nowMs - capturedAt) / 1000);

  const firstRemaining = schedule.secondsUntilFirst - elapsed;
  const firstDeparture = new Date(nowMs + firstRemaining * 1000);

  let nextRemaining: number | null = null;
  let nextDeparture: Date | null = null;

  if (schedule.secondsUntilNext != null) {
    nextRemaining = schedule.secondsUntilNext - elapsed;
    nextDeparture = new Date(nowMs + nextRemaining * 1000);
  } else if (schedule.nextVehicleDepartureTime) {
    nextDeparture = new Date(schedule.nextVehicleDepartureTime);
    nextRemaining = (nextDeparture.getTime() - nowMs) / 1000;
  }

  return {
    firstDeparture,
    nextDeparture,
    firstRemainingSeconds: firstRemaining,
    nextRemainingSeconds: nextRemaining,
    missedFirst: firstRemaining <= 0,
  };
}

export function buildVehicleHighlightLine(
  schedule: FirstVehicleSchedule,
  departure: Date,
): string {
  const icon = schedule.mode === "subway" ? "🚇" : "🚌";
  const vehicleLabel = schedule.mode === "subway" ? "열차" : "버스";
  const timeLabel = formatKoreanTimeVerbose(departure);

  return `${icon} [${schedule.stationName}] (${schedule.lineName}) -> ★ [${timeLabel}] 출발 ${vehicleLabel} 탑승 필수!`;
}

export function buildLateVehicleNotice(
  schedule: FirstVehicleSchedule,
  nowMs: number = Date.now(),
): string | null {
  const resolved = resolveVehicleDepartures(schedule, nowMs);

  if (
    resolved.missedFirst &&
    resolved.nextDeparture &&
    resolved.nextRemainingSeconds != null &&
    resolved.nextRemainingSeconds > 0
  ) {
    return `다음 ${schedule.mode === "subway" ? "열차" : "버스"}는 ${formatKoreanTimeVerbose(resolved.nextDeparture)}에 옵니다. 지금 뛰면 이걸 탈 수 있습니다.`;
  }

  if (!resolved.missedFirst && resolved.firstRemainingSeconds > 0) {
    return `${formatKoreanTimeVerbose(resolved.firstDeparture)} 출발 ${schedule.mode === "subway" ? "열차" : "버스"}를 아직 탈 수 있습니다. 지금 뛰세요!`;
  }

  return null;
}

export function buildFirstVehicleSchedule(
  leg: {
    mode: "subway" | "bus";
    stationName: string;
    lineName: string;
    direction?: string;
  },
  firstSeconds: number,
  secondSeconds: number | null,
  capturedAt: Date = new Date(),
): FirstVehicleSchedule | null {
  if (firstSeconds < 0) return null;

  const capturedAtIso = capturedAt.toISOString();
  const firstVehicleDepartureTime = new Date(
    capturedAt.getTime() + firstSeconds * 1000,
  ).toISOString();

  let nextVehicleDepartureTime: string | undefined;
  let secondsUntilNext: number | undefined;

  if (secondSeconds != null && secondSeconds > firstSeconds) {
    secondsUntilNext = secondSeconds;
    nextVehicleDepartureTime = new Date(
      capturedAt.getTime() + secondSeconds * 1000,
    ).toISOString();
  }

  return {
    mode: leg.mode,
    stationName: leg.stationName,
    lineName: leg.lineName,
    direction: leg.direction,
    secondsUntilFirst: firstSeconds,
    secondsUntilNext,
    capturedAt: capturedAtIso,
    firstVehicleDepartureTime,
    nextVehicleDepartureTime,
  };
}
