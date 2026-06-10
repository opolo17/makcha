import { OdsayApiError } from "@/lib/odsay/client";
import { formatDurationMinutes } from "@/lib/odsay/format";
import {
  buildTimelineFromSubPaths,
  findFirstTransitLeg,
  pickFastestPath,
} from "@/lib/odsay/parse-route";
import { fetchFirstTransitSchedule } from "@/lib/odsay/realtime";
import { searchPubTransPathT } from "@/lib/odsay/search-path";
import { buildFirstVehicleSchedule, buildVehicleHighlightLine } from "@/lib/vehicle-schedule";
import type {
  TransitCoordinate,
  TransitRouteResponse,
} from "@/types/transit-route";

export type BuildTransitRouteOptions = {
  /** Web API 키(브라우저) 또는 Server API 키(서버) */
  apiKey?: string;
};

export async function buildTransitRouteResponse(
  origin: TransitCoordinate,
  destination: TransitCoordinate,
  options?: BuildTransitRouteOptions,
): Promise<TransitRouteResponse> {
  const pathResult = await searchPubTransPathT(
    origin,
    destination,
    options?.apiKey,
  );
  const paths = pathResult.result?.path ?? [];

  if (!paths.length) {
    const code = pathResult.result?.error?.code ?? pathResult.error?.[0]?.code;
    throw new OdsayApiError("경로를 찾지 못했습니다.", code, 404);
  }

  const bestPath = pickFastestPath(paths);
  if (!bestPath?.info) {
    throw new OdsayApiError("유효한 경로 정보가 없습니다.", undefined, 404);
  }

  const totalDurationMinutes = bestPath.info.totalTime ?? 0;
  const firstLeg = findFirstTransitLeg(bestPath.subPath ?? []);
  const capturedAt = new Date();

  let firstTransit: TransitRouteResponse["firstTransit"] = null;
  let firstVehicleSchedule: TransitRouteResponse["firstVehicleSchedule"] = null;
  let firstVehicleDepartureTime: string | null = null;

  if (firstLeg && firstLeg.stationId > 0) {
    const schedulePair = await fetchFirstTransitSchedule(firstLeg, options?.apiKey);
    const arrival = schedulePair.first;

    firstTransit = {
      mode: firstLeg.mode,
      stationName: firstLeg.stationName,
      lineName: arrival.lineName ?? firstLeg.lineName,
      direction: arrival.direction ?? firstLeg.direction,
      arrival,
    };

    if (arrival.source !== "unavailable" && arrival.secondsUntilArrival >= 0) {
      const secondSeconds =
        schedulePair.second?.secondsUntilArrival ?? null;

      firstVehicleSchedule = buildFirstVehicleSchedule(
        {
          mode: firstLeg.mode,
          stationName: firstLeg.stationName,
          lineName: arrival.lineName ?? firstLeg.lineName,
          direction: arrival.direction ?? firstLeg.direction,
        },
        arrival.secondsUntilArrival,
        secondSeconds,
        capturedAt,
      );
      firstVehicleDepartureTime =
        firstVehicleSchedule?.firstVehicleDepartureTime ?? null;
    }
  }

  const timeline = buildTimelineFromSubPaths(bestPath.subPath ?? []);

  if (firstVehicleSchedule) {
    const transitIdx = timeline.findIndex(
      (step) => step.modeLabel === "지하철" || step.modeLabel === "버스",
    );
    if (transitIdx >= 0) {
      const departure = new Date(firstVehicleSchedule.firstVehicleDepartureTime);
      timeline[transitIdx] = {
        ...timeline[transitIdx],
        highlightLine: buildVehicleHighlightLine(firstVehicleSchedule, departure),
      };
    }
  }

  return {
    totalDurationMinutes,
    totalDurationLabel: formatDurationMinutes(totalDurationMinutes),
    firstVehicleDepartureTime,
    firstVehicleSchedule,
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
}
