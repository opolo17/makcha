"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { openMapRoute } from "@/lib/map/open-map-route";
import type { TransitCoordinate } from "@/types/transit-route";
import { isValidCoordinate } from "@/types/trip-route";

type MapOpenButtonProps = {
  originName: string;
  destinationName: string;
  origin: TransitCoordinate | null;
  destination: TransitCoordinate | null;
  disabled?: boolean;
};

export function MapOpenButton({
  originName,
  destinationName,
  origin,
  destination,
  disabled = false,
}: MapOpenButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const hasCoordinates =
    isValidCoordinate(origin) && isValidCoordinate(destination);
  const canOpen = hasCoordinates && !disabled;

  const endpoints = canOpen
    ? {
        origin: origin!,
        destination: destination!,
        originLabel: originName,
        destinationLabel: destinationName,
      }
    : null;

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  const handleSelect = useCallback(
    (provider: "naver" | "kakao") => {
      if (!endpoints) return;
      setMenuOpen(false);
      openMapRoute(provider, endpoints);
    },
    [endpoints],
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={!canOpen}
        title={!hasCoordinates ? "위치 정보가 없습니다" : undefined}
        onClick={() => {
          if (!canOpen) return;
          setMenuOpen((open) => !open);
        }}
        className="w-full rounded-xl border border-white/30 bg-white/10 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        지도 앱으로 열기 (네이버/카카오)
      </button>

      {menuOpen && canOpen ? (
        <div
          className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-xl border border-white/20 bg-zinc-900 shadow-xl"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-white hover:bg-white/10"
            onClick={() => handleSelect("naver")}
          >
            <span>네이버 지도</span>
            <span className="text-xs text-white/50">nmap://</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center justify-between border-t border-white/10 px-4 py-3.5 text-left text-sm font-semibold text-white hover:bg-white/10"
            onClick={() => handleSelect("kakao")}
          >
            <span>카카오맵</span>
            <span className="text-xs text-white/50">kakaomap://</span>
          </button>
        </div>
      ) : null}

      {!hasCoordinates ? (
        <p className="mt-2 text-center text-xs text-white/50" role="note">
          위치 정보가 없습니다
        </p>
      ) : null}
    </div>
  );
}
