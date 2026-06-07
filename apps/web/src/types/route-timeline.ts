export type RouteTimelineStep = {
  id: string;
  modeLabel: string;
  segments: string[];
  highlightLine?: string;
};

export type CountdownRouteData = {
  timeline: RouteTimelineStep[];
  arrivalNotice: string;
};
