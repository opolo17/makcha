import type { OdsayPath, OdsaySubPath } from "@/lib/odsay/types";
import { formatSubwayLineName } from "@/lib/odsay/subway-timetable";

export type ParsedTransitLeg = {
  mode: "subway" | "bus";
  trafficType: number;
  stationName: string;
  stationId: number;
  lineName: string;
  direction?: string;
  way?: string;
  wayCode?: number;
  busId?: number;
  busNo?: string;
  sectionTimeMinutes: number;
};

function formatLaneName(subPath: OdsaySubPath): string {
  if (subPath.trafficType === 1) {
    return formatSubwayLineName(subPath.lane?.name, subPath.lane?.subwayCode
      ? `${subPath.lane.subwayCode}호선`
      : "지하철");
  }

  return subPath.lane?.busNo ?? subPath.lane?.name ?? "버스";
}

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
        lineName: formatLaneName(subPath),
        direction: subPath.way,
        way: subPath.way,
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
        lineName: formatLaneName(subPath),
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
          `${subPath.startName ?? "승차역"} (${formatLaneName(subPath)})`,
          `이동 ${subPath.sectionTime ?? 0}분`,
        ],
      });
      continue;
    }

    if (subPath.trafficType === 2) {
      timeline.push({
        modeLabel: "버스",
        segments: [
          `${subPath.startName ?? "정류장"} (${formatLaneName(subPath)})`,
          `이동 ${subPath.sectionTime ?? 0}분`,
        ],
      });
    }
  }

  return timeline;
}
