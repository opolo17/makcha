"use client";

import { useEffect, useState } from "react";
import {
  computeLateArrival,
  type LateArrivalEstimate,
} from "@/lib/late-arrival";

export function useLateArrival(
  isLate: boolean,
  isTracking: boolean,
  totalDurationMinutes: number | undefined,
  appointmentAt: unknown,
): LateArrivalEstimate | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isLate || !isTracking) return;

    setNow(Date.now());

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, [isLate, isTracking, totalDurationMinutes, appointmentAt]);

  if (!isLate) return null;

  return computeLateArrival(now, totalDurationMinutes ?? NaN, appointmentAt);
}
