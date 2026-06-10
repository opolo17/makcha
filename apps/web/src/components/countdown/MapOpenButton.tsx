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
        className={[
          "w-full rounded-2xl border border-zinc-200 bg-white/80 py-3.5",
          "text-sm font-medium text-zinc-700 backdrop-blur-md",
          "transition-all duration-300 hover:border-zinc-300 hover:bg-white",
          "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
        ].join(" ")}
      >
        지도 앱으로 열기 (네이버/카카오)
      </button>

      {menuOpen && canOpen ? (
        <div
          className={[
            "absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden",
            "rounded-2xl border border-zinc-200/60 bg-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl",
          ].join(" ")}
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-zinc-800 transition-all duration-300 hover:bg-zinc-50 active:scale-[0.99]"
            onClick={() => handleSelect("naver")}
          >
            <span>네이버 지도</span>
            <span className="text-xs text-zinc-400">nmap://</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center justify-between border-t border-zinc-100 px-4 py-3.5 text-left text-sm font-medium text-zinc-800 transition-all duration-300 hover:bg-zinc-50 active:scale-[0.99]"
            onClick={() => handleSelect("kakao")}
          >
            <span>카카오맵</span>
            <span className="text-xs text-zinc-400">kakaomap://</span>
          </button>
        </div>
      ) : null}

      {!hasCoordinates ? (
        <p className="mt-2 text-center text-xs text-zinc-500" role="note">
          위치 정보가 없습니다
        </p>
      ) : null}
    </div>
  );
}
