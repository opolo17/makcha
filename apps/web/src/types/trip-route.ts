import type { AppointmentTimeInput } from "@/lib/appointment-time";
import type { TransitCoordinate } from "@/types/transit-route";

export type TripRoute = {
  originLabel: string;
  destinationLabel: string;
  origin: TransitCoordinate | null;
  destination: TransitCoordinate | null;
};

export function isValidCoordinate(
  coord: TransitCoordinate | null | undefined,
): coord is TransitCoordinate {
  if (!coord) return false;
  return (
    Number.isFinite(coord.lat) &&
    Number.isFinite(coord.lng) &&
    coord.lat >= -90 &&
    coord.lat <= 90 &&
    coord.lng >= -180 &&
    coord.lng <= 180
  );
}

export function hasMapCoordinates(trip: TripRoute): boolean {
  return isValidCoordinate(trip.origin) && isValidCoordinate(trip.destination);
}

export type CalculatePayload = {
  appointment: AppointmentTimeInput;
};
