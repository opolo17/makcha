import { getSeoulBusApiKey, getSeoulSubwayApiKey } from "@/lib/odsay/config";
import { odsayGet } from "@/lib/odsay/client";
import {
  formatArrivalFromSeconds,
  parseArrivalTextToSeconds,
} from "@/lib/odsay/format";
import type { ParsedTransitLeg } from "@/lib/odsay/parse-route";
import type {
  OdsayBusStationInfoResult,
  OdsayRealtimeBusResult,
  OdsayRealtimeSubwayResult,
} from "@/lib/odsay/types";

export type FormattedArrival = {
  secondsUntilArrival: number;
  label: string;
  rawMessage?: string;
  lineName?: string;
  direction?: string;
  source: "odsay" | "seoul-openapi" | "unavailable";
};

function pickRemainSeconds(entry: Record<string, unknown>): number | null {
  const numericKeys = [
    "remainSec",
    "remainTime",
    "predictTimeSec",
    "arrivalTime",
    "leftTime",
  ] as const;

  for (const key of numericKeys) {
    const value = entry[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && /^\d+$/.test(value)) {
      return Number(value);
    }
  }

  const textKeys = ["arrivalMsg", "arrivalMessage", "msg", "arvlMsg2"] as const;
  for (const key of textKeys) {
    const value = entry[key];
    if (typeof value === "string") {
      const parsed = parseArrivalTextToSeconds(value);
      if (parsed !== null) return parsed;
    }
  }

  return null;
}

function matchRouteEntry(
  entries: Array<Record<string, unknown>>,
  leg: ParsedTransitLeg,
): Record<string, unknown> | undefined {
  if (!entries.length) return undefined;

  if (leg.mode === "bus" && leg.busId) {
    const byBusId = entries.find(
      (e) =>
        e.busID === leg.busId ||
        e.routeID === String(leg.busId) ||
        e.routeID === leg.busId,
    );
    if (byBusId) return byBusId;
  }

  if (leg.busNo) {
    const byBusNo = entries.find(
      (e) =>
        e.routeNm === leg.busNo ||
        e.busNo === leg.busNo ||
        e.routeName === leg.busNo,
    );
    if (byBusNo) return byBusNo;
  }

  if (leg.direction) {
    const byDirection = entries.find((e) => {
      const dir =
        (e.way as string | undefined) ??
        (e.trainLineNm as string | undefined) ??
        (e.direction as string | undefined);
      return typeof dir === "string" && dir.includes(leg.direction!);
    });
    if (byDirection) return byDirection;
  }

  return entries[0];
}

async function fetchBusStationArsId(
  stationId: number,
): Promise<string | undefined> {
  const data = await odsayGet<OdsayBusStationInfoResult>("busStationInfo", {
    stationID: stationId,
  });
  return data.result?.arsID?.replace(/-/g, "");
}

async function fetchOdsayBusArrival(
  leg: ParsedTransitLeg,
): Promise<FormattedArrival | null> {
  const data = await odsayGet<OdsayRealtimeBusResult>("realtimeBusArrival", {
    stationID: leg.stationId,
    stationBase: 0,
  });

  const entries = data.result?.real ?? [];
  const matched = matchRouteEntry(entries, leg);
  if (!matched) return null;

  const seconds = pickRemainSeconds(matched);
  if (seconds === null) return null;

  const formatted = formatArrivalFromSeconds(seconds);
  return {
    ...formatted,
    rawMessage:
      (matched.arrivalMsg as string | undefined) ??
      (matched.msg as string | undefined),
    lineName:
      (matched.routeNm as string | undefined) ??
      (matched.busNo as string | undefined) ??
      leg.lineName,
    direction: (matched.direction as string | undefined) ?? leg.direction,
    source: "odsay",
  };
}

async function fetchOdsaySubwayArrival(
  leg: ParsedTransitLeg,
): Promise<FormattedArrival | null> {
  const params: Record<string, string | number> = {
    stationID: leg.stationId,
    stationBase: 0,
  };
  if (leg.wayCode) params.wayCode = leg.wayCode;

  const data = await odsayGet<OdsayRealtimeSubwayResult>(
    "realtimeSubwayArrival",
    params,
  );

  const entries = data.result?.real ?? [];
  const matched = matchRouteEntry(entries, leg);
  if (!matched) return null;

  const seconds = pickRemainSeconds(matched);
  if (seconds === null) return null;

  const formatted = formatArrivalFromSeconds(seconds);
  return {
    ...formatted,
    rawMessage:
      (matched.arrivalMsg as string | undefined) ??
      (matched.trainLineNm as string | undefined),
    lineName: leg.lineName,
    direction:
      (matched.way as string | undefined) ??
      (matched.trainLineNm as string | undefined) ??
      leg.direction,
    source: "odsay",
  };
}

async function fetchSeoulBusArrival(
  leg: ParsedTransitLeg,
  arsId: string,
): Promise<FormattedArrival | null> {
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

  const text =
    matched.arrmsg1 ?? matched.arrmsg2 ?? matched.arrmsgSec1 ?? "";
  const seconds = parseArrivalTextToSeconds(text);
  if (seconds === null) return null;

  const formatted = formatArrivalFromSeconds(seconds);
  return {
    ...formatted,
    rawMessage: text,
    lineName: matched.rtNm ?? leg.lineName,
    direction: matched.adirection,
    source: "seoul-openapi",
  };
}

async function fetchSeoulSubwayArrival(
  leg: ParsedTransitLeg,
): Promise<FormattedArrival | null> {
  const key = getSeoulSubwayApiKey();
  if (!key || !leg.stationName) return null;

  const station = encodeURIComponent(leg.stationName.replace(/역$/, ""));
  const url = `http://swopenAPI.seoul.go.kr/api/subway/${encodeURIComponent(key)}/json/realtimeStationArrival/0/10/${station}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    realtimeArrivalList?: Array<Record<string, string>>;
  };

  const list = data.realtimeArrivalList ?? [];
  const matched =
    list.find((item) =>
      leg.direction
        ? item.trainLineNm?.includes(leg.direction)
        : true,
    ) ?? list[0];

  if (!matched) return null;

  const text = matched.arvlMsg2 ?? matched.arvlMsg3 ?? "";
  const seconds = parseArrivalTextToSeconds(text);
  if (seconds === null) return null;

  const formatted = formatArrivalFromSeconds(seconds);
  return {
    ...formatted,
    rawMessage: text,
    lineName: matched.subwayId ? `${matched.subwayId}호선` : leg.lineName,
    direction: matched.trainLineNm ?? leg.direction,
    source: "seoul-openapi",
  };
}

export async function fetchFirstTransitArrival(
  leg: ParsedTransitLeg,
): Promise<FormattedArrival> {
  try {
    if (leg.mode === "bus") {
      const odsay = await fetchOdsayBusArrival(leg);
      if (odsay) return odsay;
    } else {
      const odsay = await fetchOdsaySubwayArrival(leg);
      if (odsay) return odsay;
    }
  } catch {
    /* ODsay 실시간 미제공·플랜 제한 시 서울 API로 폴백 */
  }

  try {
    if (leg.mode === "bus") {
      const arsId = await fetchBusStationArsId(leg.stationId);
      if (arsId) {
        const seoul = await fetchSeoulBusArrival(leg, arsId);
        if (seoul) return seoul;
      }
    } else {
      const seoul = await fetchSeoulSubwayArrival(leg);
      if (seoul) return seoul;
    }
  } catch {
    /* 폴백 실패 */
  }

  return {
    secondsUntilArrival: -1,
    label: "실시간 도착 정보 없음",
    source: "unavailable",
  };
}
