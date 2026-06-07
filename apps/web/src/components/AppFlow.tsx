"use client";

import { useCallback, useState } from "react";
import { CountdownScreen } from "@/components/countdown/CountdownScreen";
import { HomeScreen } from "@/components/home/HomeScreen";
import { RouteLoadingOverlay } from "@/components/RouteLoadingOverlay";
import { fetchTransitRoute } from "@/lib/api/fetch-transit-route";
import { parseAppointmentToTodayDate } from "@/lib/appointment-time";
import { buildArrivalNotice } from "@/lib/arrival-notice";
import { computeLeaveDeadlineAt } from "@/lib/deadline";
import type { LocationData } from "@/types/location";
import type { CountdownRouteData } from "@/types/route-timeline";
import type { CalculatePayload, TripRoute } from "@/types/trip-route";

function buildTripRoute(
  departure: LocationData | null,
  destination: LocationData | null,
): TripRoute {
  return {
    originLabel: departure?.name ?? "출발지",
    destinationLabel: destination?.name ?? "목적지",
    origin: departure ? { lat: departure.lat, lng: departure.lng } : null,
    destination: destination
      ? { lat: destination.lat, lng: destination.lng }
      : null,
  };
}

export function AppFlow() {
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calculateError, setCalculateError] = useState<string | null>(null);
  const [deadlineAt, setDeadlineAt] = useState<Date | null>(null);
  const [routeData, setRouteData] = useState<CountdownRouteData | null>(null);
  const [trip, setTrip] = useState<TripRoute | null>(null);
  const [departure, setDeparture] = useState<LocationData | null>(null);
  const [destination, setDestination] = useState<LocationData | null>(null);

  const handleCalculate = useCallback(
    async (payload: CalculatePayload) => {
      if (!departure || !destination) {
        setCalculateError("출발지와 목적지를 모두 선택해주세요.");
        return;
      }

      setCalculateError(null);
      setIsLoading(true);

      try {
        const transitRoute = await fetchTransitRoute({
          origin: { lat: departure.lat, lng: departure.lng },
          destination: { lat: destination.lat, lng: destination.lng },
        });

        const appointmentAt = parseAppointmentToTodayDate(payload.appointment);
        const deadline = computeLeaveDeadlineAt(
          appointmentAt,
          transitRoute.totalDurationMinutes,
          payload.bufferMinutes,
        );

        const timeline = transitRoute.route.timeline.map((step, index) => ({
          id: `route-step-${index}`,
          modeLabel: step.modeLabel,
          segments: step.segments,
          highlightLine: step.highlightLine,
        }));

        setRouteData({
          timeline,
          arrivalNotice: buildArrivalNotice(
            appointmentAt,
            deadline,
            transitRoute.totalDurationMinutes,
          ),
        });
        setDeadlineAt(deadline);
        setTrip(buildTripRoute(departure, destination));
        setIsTracking(true);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "경로 조회 중 오류가 발생했습니다.";
        setCalculateError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [departure, destination],
  );

  const handleReset = useCallback(() => {
    setIsTracking(false);
    setDeadlineAt(null);
    setRouteData(null);
    setTrip(null);
    setCalculateError(null);
  }, []);

  if (isTracking && deadlineAt && trip && routeData) {
    return (
      <CountdownScreen
        deadlineAt={deadlineAt}
        isTracking={isTracking}
        routeData={routeData}
        trip={trip}
        onReset={handleReset}
      />
    );
  }

  return (
    <>
      {isLoading ? <RouteLoadingOverlay /> : null}
      <HomeScreen
        departure={departure}
        destination={destination}
        calculateError={calculateError}
        isCalculating={isLoading}
        onDepartureChange={setDeparture}
        onDestinationChange={setDestination}
        onCalculate={handleCalculate}
      />
    </>
  );
}
