"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { openMapRoute } from "@/lib/map/open-map-route";
import type { TripRoute } from "@/types/trip-route";
import { hasMapCoordinates } from "@/types/trip-route";

type MapOpenButtonProps = {
  trip: TripRoute;
  disabled?: boolean;
};

export function MapOpenButton({ trip, disabled }: MapOpenButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const canOpen = hasMapCoordinates(trip) && !disabled;

  const endpoints = canOpen
    ? {
        origin: trip.origin!,
        destination: trip.destination!,
        originLabel: trip.originLabel,
        destinationLabel: trip.destinationLabel,
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
        onClick={() => setMenuOpen((open) => !open)}
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

      {!canOpen && !disabled ? (
        <p className="mt-2 text-center text-xs text-white/50">
          출발·도착 좌표가 있어야 지도 앱을 열 수 있습니다.
        </p>
      ) : null}
    </div>
  );
}
