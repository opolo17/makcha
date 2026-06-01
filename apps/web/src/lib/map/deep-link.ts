import type { TransitCoordinate } from "@/types/transit-route";

export type MapRouteEndpoints = {
  origin: TransitCoordinate;
  destination: TransitCoordinate;
  originLabel?: string;
  destinationLabel?: string;
};

export type MapProvider = "naver" | "kakao";

const MAKCHA_APP_NAME =
  typeof window !== "undefined" ? window.location.hostname || "makcha" : "makcha";

function encodeLabel(label?: string): string | undefined {
  if (!label?.trim()) return undefined;
  return encodeURIComponent(label.trim());
}

function formatKakaoLocation(point: TransitCoordinate, label?: string): string {
  const base = `${point.lat},${point.lng}`;
  const name = label?.trim();
  return name ? `${encodeURIComponent(name)},${base}` : base;
}

/** 네이버 지도 앱 — 대중교통 길찾기 (nmap://) */
export function buildNaverMapAppUrl(endpoints: MapRouteEndpoints): string {
  const params = new URLSearchParams({
    slat: String(endpoints.origin.lat),
    slng: String(endpoints.origin.lng),
    dlat: String(endpoints.destination.lat),
    dlng: String(endpoints.destination.lng),
    appname: MAKCHA_APP_NAME,
  });

  const sname = encodeLabel(endpoints.originLabel);
  const dname = encodeLabel(endpoints.destinationLabel);
  if (sname) params.set("sname", sname);
  if (dname) params.set("dname", dname);

  return `nmap://route/public?${params.toString()}`;
}

/** 네이버 지도 웹 — 대중교통 길찾기 */
export function buildNaverMapWebUrl(endpoints: MapRouteEndpoints): string {
  const sname = encodeLabel(endpoints.originLabel) ?? "출발";
  const dname = encodeLabel(endpoints.destinationLabel) ?? "도착";
  const { origin, destination } = endpoints;

  return [
    "https://map.naver.com/v5/directions",
    `${origin.lng},${origin.lat},${sname}`,
    `${destination.lng},${destination.lat},${dname}`,
    "-/transit",
  ].join("/");
}

/**
 * 카카오맵 앱 — 대중교통 길찾기 (kakaomap://)
 * 참고: 프롬프트의 kavamap:// 는 오타이며 공식 스킴은 kakaomap:// 입니다.
 */
export function buildKakaoMapAppUrl(endpoints: MapRouteEndpoints): string {
  const params = new URLSearchParams({
    sp: `${endpoints.origin.lat},${endpoints.origin.lng}`,
    ep: `${endpoints.destination.lat},${endpoints.destination.lng}`,
    by: "publictransit",
  });

  return `kakaomap://route?${params.toString()}`;
}

/** 카카오맵 모바일 웹 스킴 (앱 미설치 시) */
export function buildKakaoMapMobileWebUrl(endpoints: MapRouteEndpoints): string {
  const params = new URLSearchParams({
    sp: `${endpoints.origin.lat},${endpoints.origin.lng}`,
    ep: `${endpoints.destination.lat},${endpoints.destination.lng}`,
    by: "publictransit",
  });

  return `http://m.map.kakao.com/scheme/route?${params.toString()}`;
}

/** 카카오맵 PC/모바일 웹 */
export function buildKakaoMapWebUrl(endpoints: MapRouteEndpoints): string {
  const from = formatKakaoLocation(endpoints.origin, endpoints.originLabel ?? "출발");
  const to = formatKakaoLocation(
    endpoints.destination,
    endpoints.destinationLabel ?? "도착",
  );

  return `https://map.kakao.com/link/by/traffic/${from}/${to}`;
}

export function getMapUrls(
  provider: MapProvider,
  endpoints: MapRouteEndpoints,
): { appUrl: string; webUrl: string } {
  if (provider === "naver") {
    return {
      appUrl: buildNaverMapAppUrl(endpoints),
      webUrl: buildNaverMapWebUrl(endpoints),
    };
  }

  return {
    appUrl: buildKakaoMapAppUrl(endpoints),
    webUrl: buildKakaoMapWebUrl(endpoints),
  };
}

export function getKakaoMobileSchemeUrl(endpoints: MapRouteEndpoints): string {
  return buildKakaoMapMobileWebUrl(endpoints);
}
