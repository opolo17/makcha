import { buildTransitRouteResponse } from "@/lib/odsay/build-transit-route";
import { OdsayApiError } from "@/lib/odsay/client";
import { getOdsayAuthErrorHint } from "@/lib/odsay/auth-hint";
import { getOdsayWebApiKey } from "@/lib/odsay/config";
import type {
  TransitRouteRequest,
  TransitRouteResponse,
} from "@/types/transit-route";

async function fetchTransitRouteViaServer(
  payload: TransitRouteRequest,
): Promise<TransitRouteResponse> {
  const response = await fetch("/api/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as TransitRouteResponse & {
    error?: string;
    code?: string | number;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "경로 조회에 실패했습니다.");
  }

  return data;
}

async function fetchTransitRouteViaWebKey(
  payload: TransitRouteRequest,
  webApiKey: string,
): Promise<TransitRouteResponse> {
  try {
    return await buildTransitRouteResponse(
      payload.origin,
      payload.destination,
      { apiKey: webApiKey },
    );
  } catch (error) {
    if (error instanceof OdsayApiError) {
      throw new Error(getOdsayAuthErrorHint(error.message));
    }
    throw error;
  }
}

/**
 * 브라우저 + Web API 키: ODsay 직접 호출 (Vercel 등 IP 미등록 환경)
 * 그 외: /api/route 서버 프록시 (로컬 Server 키 + IP 등록)
 */
export async function fetchTransitRoute(
  payload: TransitRouteRequest,
): Promise<TransitRouteResponse> {
  const webApiKey =
    typeof window !== "undefined" ? getOdsayWebApiKey() : undefined;

  if (webApiKey) {
    return fetchTransitRouteViaWebKey(payload, webApiKey);
  }

  return fetchTransitRouteViaServer(payload);
}
