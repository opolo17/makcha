import type { TransitCoordinate } from "@/types/transit-route";

export type TripRoute = {
  originLabel: string;
  destinationLabel: string;
  origin: TransitCoordinate | null;
  destination: TransitCoordinate | null;
};

export function hasMapCoordinates(trip: TripRoute): boolean {
  return Boolean(trip.origin && trip.destination);
}

export type CalculatePayload = {
  bufferMinutes: number;
  trip: TripRoute;
};
