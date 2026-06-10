"use client";

import { useCallback, useEffect, useState } from "react";
import { CountdownScreen } from "@/components/countdown/CountdownScreen";
import { HomeScreen } from "@/components/home/HomeScreen";
import { RouteLoadingOverlay } from "@/components/RouteLoadingOverlay";
import { fetchTransitRoute } from "@/lib/api/fetch-transit-route";
import { parseAppointmentToTodayDate } from "@/lib/appointment-time";
import { buildArrivalNotice } from "@/lib/arrival-notice";
import { computeLeaveDeadlineAt } from "@/lib/deadline";
import { normalizeAppointmentAt } from "@/lib/late-arrival";
import type { LocationData } from "@/types/location";
import type { CountdownRouteData } from "@/types/route-timeline";
import { DEFAULT_HOME_FORM, type HomeFormState } from "@/types/home-form";
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
  const [appointmentAt, setAppointmentAt] = useState<Date | null>(null);
  const [totalDurationMinutes, setTotalDurationMinutes] = useState<number | null>(
    null,
  );
  const [routeData, setRouteData] = useState<CountdownRouteData | null>(null);
  const [trip, setTrip] = useState<TripRoute | null>(null);
  const [departure, setDeparture] = useState<LocationData | null>(null);
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [homeForm, setHomeForm] = useState<HomeFormState>(DEFAULT_HOME_FORM);

  const handleHomeFormChange = useCallback((patch: Partial<HomeFormState>) => {
    setHomeForm((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (!isTracking || !routeData) return;

    if (appointmentAt && totalDurationMinutes != null) return;

    const recoveredAppointment = normalizeAppointmentAt(routeData.appointmentAt);
    const recoveredDuration = routeData.totalDurationMinutes;

    if (recoveredAppointment && recoveredDuration != null) {
      setAppointmentAt(recoveredAppointment);
      setTotalDurationMinutes(recoveredDuration);
    }
  }, [
    isTracking,
    routeData,
    appointmentAt,
    totalDurationMinutes,
  ]);

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
          totalDurationMinutes: transitRoute.totalDurationMinutes,
          appointmentAt,
          firstVehicleDepartureTime: transitRoute.firstVehicleDepartureTime,
          firstVehicleSchedule: transitRoute.firstVehicleSchedule,
        });
        setDeadlineAt(deadline);
        setAppointmentAt(appointmentAt);
        setTotalDurationMinutes(transitRoute.totalDurationMinutes);
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
    setAppointmentAt(null);
    setTotalDurationMinutes(null);
    setRouteData(null);
    setTrip(null);
    setCalculateError(null);
  }, []);

  if (
    isTracking &&
    deadlineAt &&
    appointmentAt &&
    totalDurationMinutes != null &&
    trip &&
    routeData
  ) {
    return (
      <CountdownScreen
        deadlineAt={deadlineAt}
        appointmentAt={appointmentAt}
        totalDurationMinutes={totalDurationMinutes}
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
        homeForm={homeForm}
        onHomeFormChange={handleHomeFormChange}
        calculateError={calculateError}
        isCalculating={isLoading}
        onDepartureChange={setDeparture}
        onDestinationChange={setDestination}
        onCalculate={handleCalculate}
      />
    </>
  );
}
