"use client";

import { LocationSearchField } from "@/components/home/LocationSearchField";
import { MakchaLogo } from "@/components/brand/MakchaLogo";
import type { HomeFormState } from "@/types/home-form";
import type { LocationData } from "@/types/location";
import type { CalculatePayload } from "@/types/trip-route";

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
      className="mb-2.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500"
    >
      {children}
    </label>
  );
}

type HomeScreenProps = {
  departure: LocationData | null;
  destination: LocationData | null;
  homeForm: HomeFormState;
  onHomeFormChange: (patch: Partial<HomeFormState>) => void;
  calculateError?: string | null;
  isCalculating?: boolean;
  onDepartureChange: (location: LocationData | null) => void;
  onDestinationChange: (location: LocationData | null) => void;
  onCalculate?: (payload: CalculatePayload) => void;
};

export function HomeScreen({
  departure,
  destination,
  homeForm,
  onHomeFormChange,
  calculateError,
  isCalculating = false,
  onDepartureChange,
  onDestinationChange,
  onCalculate,
}: HomeScreenProps) {
  const { appointmentName, hour, minute, meridiem } = homeForm;

  const handleSubmit = () => {
    onCalculate?.({
      appointment: {
        hour: Number(hour),
        minute: Number(minute),
        meridiem,
      },
    });
  };

  const canCalculate = Boolean(departure && destination) && !isCalculating;

  return (
    <div className="relative mx-auto min-h-full max-w-md bg-zinc-50">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.04),transparent_50%)]"
        aria-hidden
      />

      <main className="relative z-10 flex min-h-full flex-col px-5 pb-36 pt-10">
        <header className="mb-10">
          <MakchaLogo className="h-9 w-auto" priority />
          <p className="mt-4 text-lg font-medium tracking-tight text-zinc-900">
            오늘도{" "}
            <span className="text-red-500">늦으실 건가요?</span>
          </p>
        </header>

        <form
          className="flex flex-1 flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <section>
            <FieldLabel htmlFor="appointment-name">약속 이름</FieldLabel>
            <input
              id="appointment-name"
              name="appointmentName"
              type="text"
              value={appointmentName}
              onChange={(e) =>
                onHomeFormChange({ appointmentName: e.target.value })
              }
              placeholder="예: 팀 미팅, 점심 약속"
              className="makcha-input-light"
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
                  onChange={(e) => onHomeFormChange({ hour: e.target.value })}
                  className="makcha-input-light flex-1 cursor-pointer appearance-none text-center"
                  aria-label="시"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={String(h)} className="bg-white text-zinc-900">
                      {h}시
                    </option>
                  ))}
                </select>
                <select
                  name="minute"
                  value={minute}
                  onChange={(e) => onHomeFormChange({ minute: e.target.value })}
                  className="makcha-input-light flex-1 cursor-pointer appearance-none text-center"
                  aria-label="분"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={String(m)} className="bg-white text-zinc-900">
                      {String(m).padStart(2, "0")}분
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="makcha-segment-light flex shrink-0"
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
                      onClick={() => onHomeFormChange({ meridiem: value })}
                      className={[
                        "makcha-segment-item-light px-3.5",
                        selected
                          ? "makcha-segment-item-light-selected"
                          : "makcha-segment-item-light-default",
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

          <LocationSearchField
            id="departure"
            label="출발지"
            placeholder="집, 회사, 역 이름 검색"
            value={departure}
            onChange={onDepartureChange}
          />

          <LocationSearchField
            id="destination"
            label="목적지"
            placeholder="약속 장소 검색"
            value={destination}
            onChange={onDestinationChange}
          />
        </form>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-zinc-200/60 bg-white/80 px-5 pb-8 pt-4 backdrop-blur-xl">
        {calculateError ? (
          <p
            className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium leading-relaxed text-red-600"
            role="alert"
          >
            {calculateError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canCalculate}
          className={[
            "w-full rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 py-4",
            "font-bold tracking-tight text-white",
            "shadow-[0_8px_24px_rgba(239,68,68,0.28),inset_0_1px_1px_rgba(255,255,255,0.4)]",
            "transition-all duration-300 hover:brightness-105",
            "active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:active:scale-100",
          ].join(" ")}
        >
          막차 시간 계산하기
        </button>
      </div>
    </div>
  );
}
