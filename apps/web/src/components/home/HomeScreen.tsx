"use client";

import { useState } from "react";
import { MakchaLogo } from "@/components/brand/MakchaLogo";
import type { CalculatePayload } from "@/types/trip-route";
import {
  BUFFER_STYLE_OPTIONS,
  getBufferMinutesById,
  type BufferStyleId,
} from "@/lib/buffer-styles";
import { resolveTripCoordinates } from "@/lib/map/resolve-place";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted"
    >
      {children}
    </label>
  );
}

function inputClassName() {
  return [
    "w-full rounded-xl border border-border bg-surface-elevated px-4 py-3.5",
    "text-base text-foreground placeholder:text-zinc-400",
    "outline-none transition-[border-color,box-shadow]",
    "focus:border-neon-yellow focus:shadow-[0_0_0_3px_var(--neon-yellow-glow)]",
  ].join(" ");
}

type HomeScreenProps = {
  onCalculate?: (payload: CalculatePayload) => void;
};

export function HomeScreen({ onCalculate }: HomeScreenProps) {
  const [bufferStyle, setBufferStyle] = useState<BufferStyleId>("normal");
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("PM");
  const [hour, setHour] = useState("9");
  const [minute, setMinute] = useState("0");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = () => {
    const coords = resolveTripCoordinates(departure, destination);
    onCalculate?.({
      bufferMinutes: getBufferMinutesById(bufferStyle),
      trip: {
        originLabel: departure.trim() || "출발지",
        destinationLabel: destination.trim() || "목적지",
        origin: coords.origin,
        destination: coords.destination,
      },
    });
  };

  return (
    <div className="relative mx-auto min-h-full max-w-md bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-neon-yellow/15 via-transparent to-transparent"
        aria-hidden
      />

      <main className="relative flex min-h-full flex-col px-5 pb-32 pt-10">
        <header className="mb-8">
          <MakchaLogo className="h-10 w-auto" priority />
          <p className="mt-3 text-lg font-medium leading-snug text-zinc-700">
            오늘도{" "}
            <span className="font-bold text-neon-red">늦으실 건가요?</span>
          </p>
        </header>

        <form
          className="flex flex-1 flex-col gap-7"
          onSubmit={(e) => e.preventDefault()}
        >
          <section>
            <FieldLabel htmlFor="appointment-name">약속 이름</FieldLabel>
            <input
              id="appointment-name"
              name="appointmentName"
              type="text"
              placeholder="예: 팀 미팅, 점심 약속"
              className={inputClassName()}
              autoComplete="off"
            />
          </section>

          <section>
            <FieldLabel>약속 시간</FieldLabel>
            <div className="flex gap-2">
              <div className="flex flex-1 gap-2">
                <select
                  name="hour"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className={`${inputClassName()} flex-1 appearance-none text-center`}
                  aria-label="시"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={String(h)}>
                      {h}시
                    </option>
                  ))}
                </select>
                <select
                  name="minute"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className={`${inputClassName()} flex-1 appearance-none text-center`}
                  aria-label="분"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={String(m)}>
                      {String(m).padStart(2, "0")}분
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="flex shrink-0 overflow-hidden rounded-xl border border-border bg-surface-elevated p-1"
                role="group"
                aria-label="오전/오후"
              >
                {(["AM", "PM"] as const).map((value) => {
                  const selected = meridiem === value;
                  const label = value === "AM" ? "오전" : "오후";
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMeridiem(value)}
                      className={[
                        "rounded-lg px-4 py-3 text-sm font-bold transition-all",
                        selected
                          ? "bg-neon-yellow text-black shadow-[0_0_16px_var(--neon-yellow-glow)]"
                          : "text-zinc-500 hover:text-zinc-800",
                      ].join(" ")}
                      aria-pressed={selected}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <FieldLabel htmlFor="departure">출발지</FieldLabel>
            <input
              id="departure"
              name="departure"
              type="search"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              placeholder="집, 회사, 역 이름 검색"
              className={inputClassName()}
              autoComplete="off"
            />
          </section>

          <section>
            <FieldLabel htmlFor="destination">목적지</FieldLabel>
            <input
              id="destination"
              name="destination"
              type="search"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="약속 장소 검색"
              className={inputClassName()}
              autoComplete="off"
            />
          </section>

          <section>
            <FieldLabel>나의 준비 스타일</FieldLabel>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label="준비 스타일">
              {BUFFER_STYLE_OPTIONS.map((option) => {
                const selected = bufferStyle === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setBufferStyle(option.id)}
                    className={[
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all",
                      selected
                        ? "border-neon-yellow bg-neon-yellow/10 shadow-[0_0_20px_var(--neon-yellow-glow)]"
                        : "border-border bg-surface hover:border-zinc-400",
                    ].join(" ")}
                  >
                    <span
                      className={
                        selected
                          ? "font-bold text-neon-yellow"
                          : "font-medium text-zinc-700"
                      }
                    >
                      {option.label}
                    </span>
                    <span
                      className={
                        selected ? "text-sm text-neon-yellow/80" : "text-sm text-muted"
                      }
                    >
                      {option.bufferMinutes}분 버퍼
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </form>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md px-5 pb-8 pt-4">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/95 to-transparent"
          aria-hidden
        />
        <button
          type="button"
          onClick={handleSubmit}
          className={[
            "btn-primary-glow relative w-full rounded-2xl py-4 text-lg font-black tracking-tight",
            "bg-gradient-to-r from-neon-red via-red-500 to-neon-red text-white",
            "border border-red-400/30",
            "transition-transform active:scale-[0.98]",
          ].join(" ")}
        >
          🚨 막차 시간 계산하기
        </button>
      </div>
    </div>
  );
}
