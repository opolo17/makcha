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

export type TransitRouteResponse = {
  totalDurationMinutes: number;
  totalDurationLabel: string;
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
