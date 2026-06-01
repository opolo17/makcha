import type {
  TransitRouteRequest,
  TransitRouteResponse,
} from "@/types/transit-route";

export async function fetchTransitRoute(
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
