import { OdsayApiError } from "@/lib/odsay/client";
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

  let firstTransit: TransitRouteResponse["firstTransit"] = null;

  if (firstLeg && firstLeg.stationId > 0) {
    const arrival = await fetchFirstTransitArrival(firstLeg, options?.apiKey);
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

  return {
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
}
