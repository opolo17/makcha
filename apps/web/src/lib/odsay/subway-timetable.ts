import type { ParsedTransitLeg } from "@/lib/odsay/parse-route";

type TimetableDirection = {
  time?: Array<{ Idx?: number; list?: string }>;
};

export type OdsaySubwayTimeTableResult = {
  laneName?: string;
  upWay?: string;
  downWay?: string;
  OrdList?: {
    up?: TimetableDirection;
    down?: TimetableDirection;
  };
  SatList?: {
    up?: TimetableDirection;
    down?: TimetableDirection;
  };
  SunList?: {
    up?: TimetableDirection;
    down?: TimetableDirection;
  };
};

function pickDayList(
  timetable: OdsaySubwayTimeTableResult,
  now: Date,
): OdsaySubwayTimeTableResult["OrdList"] {
  const day = now.getDay();
  if (day === 0) return timetable.SunList ?? timetable.OrdList;
  if (day === 6) return timetable.SatList ?? timetable.OrdList;
  return timetable.OrdList;
}

function normalizeDirectionToken(value: string): string {
  return value.replace(/행$/u, "").replace(/\s+/g, "").trim();
}

function pickDirectionKey(
  timetable: OdsaySubwayTimeTableResult,
  leg: ParsedTransitLeg,
): "up" | "down" {
  const target = normalizeDirectionToken(leg.direction ?? leg.way ?? "");

  if (target) {
    if (normalizeDirectionToken(timetable.upWay ?? "").includes(target)) {
      return "up";
    }
    if (normalizeDirectionToken(timetable.downWay ?? "").includes(target)) {
      return "down";
    }
  }

  if (leg.wayCode === 2) return "down";
  return "up";
}

function parseTimetableMinutes(
  listStr: string,
  directionFilter?: string,
): number[] {
  const entries = [...listStr.matchAll(/(\d{1,2})\(([^)]+)\)/g)].map(
    (match) => ({
      minute: Number(match[1]),
      terminus: normalizeDirectionToken(match[2]),
    }),
  );

  if (directionFilter) {
    const filtered = entries.filter((entry) =>
      entry.terminus.includes(directionFilter),
    );
    if (filtered.length > 0) {
      return filtered.map((entry) => entry.minute);
    }
  }

  return entries.map((entry) => entry.minute);
}

/** ODsay subwayTimeTable 기준 다음 1~2회 출발 시각 */
export function getNextSubwayDepartures(
  timetable: OdsaySubwayTimeTableResult,
  leg: ParsedTransitLeg,
  now: Date = new Date(),
): Date[] {
  const dayList = pickDayList(timetable, now);
  if (!dayList) return [];

  const directionKey = pickDirectionKey(timetable, leg);
  const hourBlocks = dayList[directionKey]?.time ?? [];
  const directionFilter = normalizeDirectionToken(leg.direction ?? leg.way ?? "");
  const candidates: Date[] = [];

  for (const block of hourBlocks) {
    const hour = block.Idx;
    if (hour === undefined) continue;

    const minutes = parseTimetableMinutes(block.list ?? "", directionFilter);
    for (const minute of minutes) {
      const departure = new Date(now);
      departure.setHours(hour, minute, 0, 0);
      if (departure.getTime() > now.getTime()) {
        candidates.push(departure);
      }
    }
  }

  candidates.sort((a, b) => a.getTime() - b.getTime());
  return candidates.slice(0, 2);
}

export function formatSubwayLineName(
  laneName?: string,
  fallback?: string,
): string {
  if (laneName) {
    return laneName.replace(/^수도권\s*/u, "").trim();
  }
  return fallback ?? "지하철";
}
