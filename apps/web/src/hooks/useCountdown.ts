"use client";

import { useEffect, useState } from "react";
import {
  getSecondsUntilDeadline,
  isPastDeadline,
} from "@/lib/deadline";

export function useCountdown(deadlineAt: Date | null, isTracking: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isTracking || !deadlineAt) return;

    setNow(Date.now());

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, [isTracking, deadlineAt]);

  if (!deadlineAt) {
    return {
      secondsLeft: 0,
      minutesRemaining: 0,
      isLate: false,
    };
  }

  const isLate = isPastDeadline(deadlineAt, now);
  const secondsLeft = getSecondsUntilDeadline(deadlineAt, now);
  const minutesRemaining = isLate ? 0 : Math.ceil(secondsLeft / 60);

  return {
    secondsLeft,
    minutesRemaining,
    isLate,
  };
}
