import {
  getMapUrls,
  type MapProvider,
  type MapRouteEndpoints,
} from "@/lib/map/deep-link";

const APP_OPEN_TIMEOUT_MS = 1600;

export function isMobileUserAgent(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

/**
 * 앱 스킴 실행 후 일정 시간 내 페이지 이탈이 없으면 웹 지도로 폴백합니다.
 */
export function openMapRoute(
  provider: MapProvider,
  endpoints: MapRouteEndpoints,
): void {
  const { appUrl, webUrl } = getMapUrls(provider, endpoints);

  if (typeof window === "undefined") return;

  if (!isMobileUserAgent()) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }

  let didHide = false;

  const clearFallback = () => {
    window.clearTimeout(fallbackTimer);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("blur", onBlur);
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      didHide = true;
      clearFallback();
    }
  };

  const onPageHide = () => {
    didHide = true;
    clearFallback();
  };

  const onBlur = () => {
    didHide = true;
    clearFallback();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("blur", onBlur);

  const fallbackTimer = window.setTimeout(() => {
    clearFallback();
    if (!didHide) {
      window.location.assign(webUrl);
    }
  }, APP_OPEN_TIMEOUT_MS);

  window.location.href = appUrl;
}

export type { MapRouteEndpoints, MapProvider };
