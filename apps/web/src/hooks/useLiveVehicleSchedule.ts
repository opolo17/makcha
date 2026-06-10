"use client";

import { useEffect, useState } from "react";
import type { FirstVehicleSchedule } from "@/types/transit-route";
import {
  buildLateVehicleNotice,
  buildVehicleHighlightLine,
  resolveVehicleDepartures,
} from "@/lib/vehicle-schedule";

export function useLiveVehicleSchedule(
  schedule: FirstVehicleSchedule | null | undefined,
  isActive: boolean,
) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isActive || !schedule) return;

    setNow(Date.now());

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, [isActive, schedule]);

  if (!schedule) {
    return {
      highlightLine: null as string | null,
      lateVehicleNotice: null as string | null,
      resolved: null,
    };
  }

  const resolved = resolveVehicleDepartures(schedule, now);
  const targetDeparture =
    resolved.missedFirst && resolved.nextDeparture
      ? resolved.nextDeparture
      : resolved.firstDeparture;

  return {
    highlightLine: buildVehicleHighlightLine(schedule, targetDeparture),
    lateVehicleNotice: buildLateVehicleNotice(schedule, now),
    resolved,
  };
}
