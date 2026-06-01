import type { TransitCoordinate } from "@/types/transit-route";

/**
 * 위치 검색 API 연동 전 임시 좌표 매핑 (역·지명 키워드).
 * 실제 서비스에서는 카카오/네이버 지오코딩 결과로 대체합니다.
 */
const PLACE_HINTS: Array<{ keywords: string[]; coord: TransitCoordinate }> = [
  { keywords: ["당산"], coord: { lat: 37.534863, lng: 126.902682 } },
  { keywords: ["합정"], coord: { lat: 37.549942, lng: 126.914543 } },
  { keywords: ["강남"], coord: { lat: 37.497942, lng: 127.027621 } },
  { keywords: ["홍대", "홍익"], coord: { lat: 37.556324, lng: 126.923696 } },
  { keywords: ["신촌"], coord: { lat: 37.555134, lng: 126.936893 } },
  { keywords: ["잠실"], coord: { lat: 37.51395, lng: 127.102234 } },
  { keywords: ["여의도"], coord: { lat: 37.521624, lng: 126.924191 } },
  { keywords: ["판교"], coord: { lat: 37.394774, lng: 127.111062 } },
];

export function resolvePlaceFromLabel(label: string): TransitCoordinate | null {
  const normalized = label.trim().toLowerCase().replace(/\s+/g, "");
  if (!normalized) return null;

  for (const place of PLACE_HINTS) {
    if (place.keywords.some((keyword) => normalized.includes(keyword))) {
      return place.coord;
    }
  }

  return null;
}

export function resolveTripCoordinates(
  originLabel: string,
  destinationLabel: string,
): {
  origin: TransitCoordinate | null;
  destination: TransitCoordinate | null;
} {
  return {
    origin: resolvePlaceFromLabel(originLabel),
    destination: resolvePlaceFromLabel(destinationLabel),
  };
}
