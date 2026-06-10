import { getSeoulBusApiKey, getSeoulSubwayApiKey } from "@/lib/odsay/config";
import { odsayGet } from "@/lib/odsay/client";
import {
  formatArrivalFromSeconds,
  parseArrivalTextToSeconds,
} from "@/lib/odsay/format";
import type { ParsedTransitLeg } from "@/lib/odsay/parse-route";
import {
  formatSubwayLineName,
  getNextSubwayDepartures,
  type OdsaySubwayTimeTableResult,
} from "@/lib/odsay/subway-timetable";
import type { OdsayBusStationInfoResult } from "@/lib/odsay/types";

export type FormattedArrival = {
  secondsUntilArrival: number;
  label: string;
  rawMessage?: string;
  lineName?: string;
  direction?: string;
  source: "odsay" | "seoul-openapi" | "unavailable";
};

export type TransitArrivalPair = {
  first: FormattedArrival;
  second: FormattedArrival | null;
};

function toArrivalFromDate(
  departure: Date,
  now: Date,
  meta: Pick<FormattedArrival, "lineName" | "direction" | "source" | "rawMessage">,
): FormattedArrival {
  const seconds = Math.max(
    0,
    Math.round((departure.getTime() - now.getTime()) / 1000),
  );

  return {
    ...formatArrivalFromSeconds(seconds),
    ...meta,
  };
}

async function fetchBusStationArsId(
  stationId: number,
  apiKey?: string,
): Promise<string | undefined> {
  const data = await odsayGet<OdsayBusStationInfoResult>(
    "busStationInfo",
    { stationID: stationId },
    apiKey,
  );
  return data.result?.arsID?.replace(/-/g, "");
}

async function fetchSubwayTimetableArrivalPair(
  leg: ParsedTransitLeg,
  apiKey?: string,
): Promise<TransitArrivalPair | null> {
  const data = await odsayGet<{ result?: OdsaySubwayTimeTableResult }>(
    "subwayTimeTable",
    {
      stationID: leg.stationId,
      stationBase: 0,
    },
    apiKey,
  );

  const timetable = data.result;
  if (!timetable) return null;

  const now = new Date();
  const departures = getNextSubwayDepartures(timetable, leg, now);
  if (!departures.length) return null;

  const lineName = formatSubwayLineName(timetable.laneName, leg.lineName);
  const direction =
    leg.direction ??
    leg.way ??
    (leg.wayCode === 2
      ? timetable.downWay
      : timetable.upWay) ??
    undefined;

  const first = toArrivalFromDate(departures[0], now, {
    lineName,
    direction,
    source: "odsay",
    rawMessage: "시간표 기준 다음 열차",
  });

  const second = departures[1]
    ? toArrivalFromDate(departures[1], now, {
        lineName,
        direction,
        source: "odsay",
        rawMessage: "시간표 기준 다음 열차",
      })
    : null;

  return { first, second };
}

async function fetchSeoulBusArrivalPair(
  leg: ParsedTransitLeg,
  arsId: string,
): Promise<TransitArrivalPair | null> {
  const key = getSeoulBusApiKey();
  if (!key) return null;

  const url = new URL(
    "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid",
  );
  url.searchParams.set("serviceKey", key);
  url.searchParams.set("resultType", "json");
  url.searchParams.set("arsId", arsId);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    msgBody?: {
      itemList?: Array<Record<string, string>> | Record<string, string>;
    };
  };

  const rawList = data.msgBody?.itemList;
  const list = Array.isArray(rawList)
    ? rawList
    : rawList
      ? [rawList]
      : [];

  const matched =
    list.find((item) => item.rtNm === leg.busNo) ?? list[0] ?? null;
  if (!matched) return null;

  const firstText = matched.arrmsg1 ?? matched.arrmsgSec1 ?? "";
  const secondText = matched.arrmsg2 ?? "";
  const firstSeconds = parseArrivalTextToSeconds(firstText);
  if (firstSeconds === null) return null;

  const first = {
    ...formatArrivalFromSeconds(firstSeconds),
    rawMessage: firstText,
    lineName: matched.rtNm ?? leg.lineName,
    direction: matched.adirection,
    source: "seoul-openapi" as const,
  };

  const secondSeconds = parseArrivalTextToSeconds(secondText);
  const second =
    secondSeconds !== null && secondSeconds > firstSeconds
      ? {
          ...formatArrivalFromSeconds(secondSeconds),
          rawMessage: secondText,
          lineName: matched.rtNm ?? leg.lineName,
          direction: matched.adirection,
          source: "seoul-openapi" as const,
        }
      : null;

  return { first, second };
}

async function fetchSeoulSubwayArrivalPair(
  leg: ParsedTransitLeg,
): Promise<TransitArrivalPair | null> {
  const key = getSeoulSubwayApiKey();
  if (!key || !leg.stationName) return null;

  const station = encodeURIComponent(leg.stationName.replace(/역$/, ""));
  const url = `http://swopenAPI.seoul.go.kr/api/subway/${encodeURIComponent(key)}/json/realtimeStationArrival/0/10/${station}`;

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    realtimeArrivalList?: Array<Record<string, string>>;
  };

  const list = (data.realtimeArrivalList ?? []).filter((item) =>
    leg.direction ? item.trainLineNm?.includes(leg.direction) : true,
  );

  if (!list.length) return null;

  const parsed = list
    .map((item) => {
      const text = item.arvlMsg2 ?? item.arvlMsg3 ?? "";
      const seconds = parseArrivalTextToSeconds(text);
      if (seconds === null) return null;
      return { seconds, item, text };
    })
    .filter(
      (
        entry,
      ): entry is {
        seconds: number;
        item: Record<string, string>;
        text: string;
      } => entry !== null,
    )
    .sort((a, b) => a.seconds - b.seconds);

  if (!parsed.length) return null;

  const first = {
    ...formatArrivalFromSeconds(parsed[0].seconds),
    rawMessage: parsed[0].text,
    lineName: parsed[0].item.subwayId
      ? `${parsed[0].item.subwayId}호선`
      : leg.lineName,
    direction: parsed[0].item.trainLineNm ?? leg.direction,
    source: "seoul-openapi" as const,
  };

  const secondEntry = parsed.find(
    (entry) => entry.seconds > parsed[0].seconds,
  );
  const second = secondEntry
    ? {
        ...formatArrivalFromSeconds(secondEntry.seconds),
        rawMessage: secondEntry.text,
        lineName: secondEntry.item.subwayId
          ? `${secondEntry.item.subwayId}호선`
          : leg.lineName,
        direction: secondEntry.item.trainLineNm ?? leg.direction,
        source: "seoul-openapi" as const,
      }
    : null;

  return { first, second };
}

export async function fetchFirstTransitArrival(
  leg: ParsedTransitLeg,
  apiKey?: string,
): Promise<FormattedArrival> {
  const schedule = await fetchFirstTransitSchedule(leg, apiKey);
  return schedule.first;
}

export async function fetchFirstTransitSchedule(
  leg: ParsedTransitLeg,
  apiKey?: string,
): Promise<TransitArrivalPair> {
  try {
    if (leg.mode === "subway") {
      const seoul = await fetchSeoulSubwayArrivalPair(leg);
      if (seoul && seoul.first.secondsUntilArrival >= 0) return seoul;

      const timetable = await fetchSubwayTimetableArrivalPair(leg, apiKey);
      if (timetable) return timetable;
    } else {
      const arsId = await fetchBusStationArsId(leg.stationId, apiKey);
      if (arsId) {
        const seoulBus = await fetchSeoulBusArrivalPair(leg, arsId);
        if (seoulBus && seoulBus.first.secondsUntilArrival >= 0) return seoulBus;
      }
    }
  } catch {
    /* 다음 소스로 폴백 */
  }

  return {
    first: {
      secondsUntilArrival: -1,
      label: "실시간 도착 정보 없음",
      source: "unavailable",
    },
    second: null,
  };
}
