export type TransitCoordinate = {
  lat: number;
  lng: number;
};

export type TransitRouteRequest = {
  origin: TransitCoordinate;
  destination: TransitCoordinate;
};

export type TransitArrivalInfo = {
  secondsUntilArrival: number;
  label: string;
  rawMessage?: string;
  lineName?: string;
  direction?: string;
  source: "odsay" | "seoul-openapi" | "unavailable";
};

export type FirstVehicleSchedule = {
  mode: "subway" | "bus";
  stationName: string;
  lineName: string;
  direction?: string;
  /** API 조회 시점 기준 첫 차량 승차까지 남은 초 */
  secondsUntilFirst: number;
  /** API 조회 시점 기준 다음 차량 승차까지 남은 초 */
  secondsUntilNext?: number;
  /** 실시간 정보 조회 시각 (ISO) */
  capturedAt: string;
  /** 첫 차량 승차 시각 (ISO) */
  firstVehicleDepartureTime: string;
  /** 다음 차량 승차 시각 (ISO) */
  nextVehicleDepartureTime?: string;
};

export type TransitRouteResponse = {
  totalDurationMinutes: number;
  totalDurationLabel: string;
  /** 첫 대중교통 승차 시각 (ISO) — 프론트 계산용 */
  firstVehicleDepartureTime: string | null;
  firstVehicleSchedule: FirstVehicleSchedule | null;
  firstTransit: {
    mode: "subway" | "bus";
    stationName: string;
    lineName: string;
    direction?: string;
    arrival: TransitArrivalInfo;
  } | null;
  route: {
    pathType?: number;
    firstStartStation?: string;
    lastEndStation?: string;
    payment?: number;
    totalWalkMinutes?: number;
    timeline: Array<{
      modeLabel: string;
      segments: string[];
      highlightLine?: string;
    }>;
  };
};
