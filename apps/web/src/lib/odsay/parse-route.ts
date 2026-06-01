import type { OdsayPath, OdsaySubPath } from "@/lib/odsay/types";

export type ParsedTransitLeg = {
  mode: "subway" | "bus";
  trafficType: number;
  stationName: string;
  stationId: number;
  lineName: string;
  direction?: string;
  wayCode?: number;
  busId?: number;
  busNo?: string;
  sectionTimeMinutes: number;
};

export function pickFastestPath(paths: OdsayPath[]): OdsayPath | null {
  if (!paths.length) return null;

  return [...paths].sort((a, b) => {
    const timeA = a.info?.totalTime ?? Number.MAX_SAFE_INTEGER;
    const timeB = b.info?.totalTime ?? Number.MAX_SAFE_INTEGER;
    return timeA - timeB;
  })[0];
}

export function findFirstTransitLeg(
  subPaths: OdsaySubPath[] = [],
): ParsedTransitLeg | null {
  for (const subPath of subPaths) {
    if (subPath.trafficType === 3) continue;

    if (subPath.trafficType === 1) {
      return {
        mode: "subway",
        trafficType: 1,
        stationName: subPath.startName ?? "승차역",
        stationId: subPath.startID ?? 0,
        lineName: subPath.lane?.name ?? "지하철",
        direction: subPath.way,
        wayCode: subPath.wayCode,
        sectionTimeMinutes: subPath.sectionTime ?? 0,
      };
    }

    if (subPath.trafficType === 2) {
      return {
        mode: "bus",
        trafficType: 2,
        stationName: subPath.startName ?? "정류장",
        stationId: subPath.startID ?? 0,
        lineName: subPath.lane?.busNo ?? subPath.lane?.name ?? "버스",
        busId: subPath.lane?.busID,
        busNo: subPath.lane?.busNo,
        sectionTimeMinutes: subPath.sectionTime ?? 0,
      };
    }
  }

  return null;
}

export function buildTimelineFromSubPaths(
  subPaths: OdsaySubPath[] = [],
): Array<{
  modeLabel: string;
  segments: string[];
  highlightLine?: string;
}> {
  const timeline: Array<{
    modeLabel: string;
    segments: string[];
    highlightLine?: string;
  }> = [];

  for (const subPath of subPaths) {
    if (subPath.trafficType === 3) {
      timeline.push({
        modeLabel: "도보",
        segments: [
          `${subPath.startName ?? "출발"} → ${subPath.endName ?? "도착"}`,
          `도보 ${subPath.sectionTime ?? 0}분`,
        ],
      });
      continue;
    }

    if (subPath.trafficType === 1) {
      timeline.push({
        modeLabel: "지하철",
        segments: [
          `${subPath.startName ?? "승차역"} (${subPath.lane?.name ?? "지하철"})`,
          `이동 ${subPath.sectionTime ?? 0}분`,
        ],
        highlightLine: subPath.way
          ? `★ [${subPath.way}] 열차 실시간 도착 확인`
          : undefined,
      });
      continue;
    }

    if (subPath.trafficType === 2) {
      timeline.push({
        modeLabel: "버스",
        segments: [
          `${subPath.startName ?? "정류장"} (${subPath.lane?.busNo ?? "버스"})`,
          `이동 ${subPath.sectionTime ?? 0}분`,
        ],
      });
    }
  }

  return timeline;
}
