import { NextResponse } from "next/server";
import { getOdsayAuthErrorHint } from "@/lib/odsay/auth-hint";
import { buildTransitRouteResponse } from "@/lib/odsay/build-transit-route";
import { OdsayApiError } from "@/lib/odsay/client";
import type {
  TransitCoordinate,
  TransitRouteRequest,
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

    const response = await buildTransitRouteResponse(origin, destination);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof OdsayApiError) {
      const status =
        typeof error.status === "number" && error.status >= 400
          ? error.status
          : 502;

      return NextResponse.json(
        {
          error: getOdsayAuthErrorHint(error.message),
          code: error.code,
        },
        { status },
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
