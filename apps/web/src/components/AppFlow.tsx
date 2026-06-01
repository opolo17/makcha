"use client";

import { useCallback, useState } from "react";
import { CountdownScreen } from "@/components/countdown/CountdownScreen";
import { HomeScreen } from "@/components/home/HomeScreen";
import { computeLeaveDeadlineAt } from "@/lib/deadline";
import type { CalculatePayload, TripRoute } from "@/types/trip-route";

export function AppFlow() {
  const [isTracking, setIsTracking] = useState(false);
  const [deadlineAt, setDeadlineAt] = useState<Date | null>(null);
  const [trip, setTrip] = useState<TripRoute | null>(null);

  const handleCalculate = useCallback((payload: CalculatePayload) => {
    setDeadlineAt(computeLeaveDeadlineAt(payload.bufferMinutes));
    setTrip(payload.trip);
    setIsTracking(true);
  }, []);

  const handleReset = useCallback(() => {
    setIsTracking(false);
    setDeadlineAt(null);
    setTrip(null);
  }, []);

  if (isTracking && deadlineAt && trip) {
    return (
      <CountdownScreen
        deadlineAt={deadlineAt}
        isTracking={isTracking}
        trip={trip}
        onReset={handleReset}
      />
    );
  }

  return <HomeScreen onCalculate={handleCalculate} />;
}
