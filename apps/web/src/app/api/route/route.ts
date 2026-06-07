import { NextResponse } from "next/server";
import { OdsayApiError } from "@/lib/odsay/client";
import { getOdsayAuthErrorHint } from "@/lib/odsay/auth-hint";
import { formatDurationMinutes } from "@/lib/odsay/format";
import {
  buildTimelineFromSubPaths,
  findFirstTransitLeg,
  pickFastestPath,
} from "@/lib/odsay/parse-route";
import { fetchFirstTransitArrival } from "@/lib/odsay/realtime";
import { searchPubTransPathT } from "@/lib/odsay/search-path";
import type {
  TransitCoordinate,
  TransitRouteRequest,
  TransitRouteResponse,
} from "@/types/transit-route";

function parseCoordinate(
  value: unknown,
  field: "origin" | "destination",
): TransitCoordinate {
  if (!value || typeof value !== "object") {
    throw new Error(`${field} 좌표가 필요합니다.`);
  }

  const { lat, lng } = value as Record<string, unknown>;
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);

  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
    throw new Error(`${field}.lat / ${field}.lng 는 숫자여야 합니다.`);
  }

  if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
    throw new Error(`${field} 좌표 범위가 올바르지 않습니다.`);
  }

  return { lat: parsedLat, lng: parsedLng };
}

function parseRequestBody(body: unknown): TransitRouteRequest {
  if (!body || typeof body !== "object") {
    throw new Error("JSON body가 필요합니다.");
  }

  const record = body as Record<string, unknown>;
  return {
    origin: parseCoordinate(record.origin, "origin"),
    destination: parseCoordinate(record.destination, "destination"),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origin, destination } = parseRequestBody(body);

    const pathResult = await searchPubTransPathT(origin, destination);
    const paths = pathResult.result?.path ?? [];

    if (!paths.length) {
      const code = pathResult.result?.error?.code ?? pathResult.error?.[0]?.code;
      return NextResponse.json(
        {
          error: "경로를 찾지 못했습니다.",
          code,
        },
        { status: 404 },
      );
    }

    const bestPath = pickFastestPath(paths);
    if (!bestPath?.info) {
      return NextResponse.json(
        { error: "유효한 경로 정보가 없습니다." },
        { status: 404 },
      );
    }

    const totalDurationMinutes = bestPath.info.totalTime ?? 0;
    const firstLeg = findFirstTransitLeg(bestPath.subPath ?? []);

    let firstTransit: TransitRouteResponse["firstTransit"] = null;

    if (firstLeg && firstLeg.stationId > 0) {
      const arrival = await fetchFirstTransitArrival(firstLeg);
      firstTransit = {
        mode: firstLeg.mode,
        stationName: firstLeg.stationName,
        lineName: firstLeg.lineName,
        direction: firstLeg.direction,
        arrival,
      };
    }

    const timeline = buildTimelineFromSubPaths(bestPath.subPath ?? []);

    if (firstTransit?.arrival && firstTransit.arrival.source !== "unavailable") {
      const transitIdx = timeline.findIndex(
        (step) => step.modeLabel === "지하철" || step.modeLabel === "버스",
      );
      if (transitIdx >= 0) {
        const direction = firstTransit.direction ?? firstTransit.lineName;
        timeline[transitIdx] = {
          ...timeline[transitIdx],
          highlightLine: `★ [${direction}] ${firstTransit.arrival.label}`,
        };
      }
    }

    const response: TransitRouteResponse = {
      totalDurationMinutes,
      totalDurationLabel: formatDurationMinutes(totalDurationMinutes),
      firstTransit,
      route: {
        pathType: bestPath.pathType,
        firstStartStation: bestPath.info.firstStartStation,
        lastEndStation: bestPath.info.lastEndStation,
        payment: bestPath.info.payment,
        totalWalkMinutes: bestPath.info.totalWalk,
        timeline,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof OdsayApiError) {
      return NextResponse.json(
        {
          error: getOdsayAuthErrorHint(error.message),
          code: error.code,
        },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }

    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    if (message.includes("ODSAY_API_KEY")) {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
