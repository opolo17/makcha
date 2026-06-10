import type { FirstVehicleSchedule } from "@/types/transit-route";

export type RouteTimelineStep = {
  id: string;
  modeLabel: string;
  segments: string[];
  highlightLine?: string;
};

export type CountdownRouteData = {
  timeline: RouteTimelineStep[];
  arrivalNotice: string;
  totalDurationMinutes: number;
  appointmentAt: Date;
  firstVehicleDepartureTime: string | null;
  firstVehicleSchedule: FirstVehicleSchedule | null;
};
