import type { LocationData } from "@/types/location";

const RESULT_SIZE = 5;

export type KakaoPlaceResult = LocationData & {
  address: string;
};

type ProxyPlaceResult = LocationData & {
  address?: string;
};

export async function searchKakaoKeyword(
  keyword: string,
): Promise<KakaoPlaceResult[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  // 카카오 REST API는 브라우저 직접 호출 시 403 — 서버 프록시만 사용
  const response = await fetch(
    `/api/places/search?query=${encodeURIComponent(trimmed)}`,
  );
  const data = (await response.json()) as ProxyPlaceResult[] & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "장소 검색에 실패했습니다.");
  }

  return data.slice(0, RESULT_SIZE).map((place) => ({
    name: place.name,
    lat: place.lat,
    lng: place.lng,
    address: place.address ?? place.name,
  }));
}
