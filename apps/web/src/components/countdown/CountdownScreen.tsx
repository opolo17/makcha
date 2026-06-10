"use client";

import { MapOpenButton } from "@/components/countdown/MapOpenButton";
import { MakchaLogo } from "@/components/brand/MakchaLogo";
import type { CountdownRouteData } from "@/types/route-timeline";
import type { TripRoute } from "@/types/trip-route";
import { useCountdown } from "@/hooks/useCountdown";
import { useLateArrival } from "@/hooks/useLateArrival";
import { useLiveVehicleSchedule } from "@/hooks/useLiveVehicleSchedule";
import { formatKoreanTime } from "@/lib/appointment-time";
import { getPressureCopy } from "@/lib/pressure-copy";
import {
  formatCountdownMmSs,
  getUrgencyBodyTextClass,
  getUrgencyFadeClass,
  getUrgencyMutedTextClass,
  getUrgencyShellClass,
  getUrgencyTimerClass,
} from "@/lib/urgency";

type CountdownScreenProps = {
  deadlineAt: Date;
  appointmentAt: Date;
  totalDurationMinutes: number;
  isTracking: boolean;
  routeData: CountdownRouteData;
  trip: TripRoute;
  onReset?: () => void;
};

function getActiveTimelineIndex(
  timeline: CountdownRouteData["timeline"],
): number {
  const highlightIdx = timeline.findIndex((step) => step.highlightLine);
  if (highlightIdx >= 0) return highlightIdx;

  const transitIdx = timeline.findIndex(
    (step) => step.modeLabel === "지하철" || step.modeLabel === "버스",
  );
  return transitIdx >= 0 ? transitIdx : 0;
}

function getFirstTransitIndex(timeline: CountdownRouteData["timeline"]): number {
  return timeline.findIndex(
    (step) => step.modeLabel === "지하철" || step.modeLabel === "버스",
  );
}

export function CountdownScreen({
  deadlineAt,
  appointmentAt,
  totalDurationMinutes,
  isTracking,
  routeData,
  trip,
  onReset,
}: CountdownScreenProps) {
  const { secondsLeft, minutesRemaining, isLate } = useCountdown(
    deadlineAt,
    isTracking,
  );
  const lateArrival = useLateArrival(
    isLate,
    isTracking,
    totalDurationMinutes,
    appointmentAt,
  );
  const liveVehicle = useLiveVehicleSchedule(
    routeData.firstVehicleSchedule,
    isTracking,
  );

  const shellClass = getUrgencyShellClass(secondsLeft, isLate);
  const fadeClass = getUrgencyFadeClass(secondsLeft, isLate);
  const timerClass = getUrgencyTimerClass(secondsLeft, isLate);
  const pressureCopy = getPressureCopy(minutesRemaining, isLate);
  const activeNodeIndex = getActiveTimelineIndex(routeData.timeline);
  const firstTransitIndex = getFirstTransitIndex(routeData.timeline);
  const glassCardClass = [
    "makcha-glass-card-light",
    isLate ? "makcha-glass-card-light-muted" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`relative mx-auto flex min-h-full max-w-md flex-col transition-colors duration-1000 ${shellClass} ${isLate ? "text-zinc-400/80" : "text-zinc-900"}`}
    >
      <main className="relative z-10 flex flex-1 flex-col px-5 pb-44 pt-8">
        <header className="mb-8 flex flex-col items-center text-center">
          <MakchaLogo
            className={[
              "h-8 w-auto",
              isLate ? "opacity-50 saturate-0" : "",
            ].join(" ")}
          />
          <p
            className={`mt-4 text-xs font-medium uppercase tracking-tight ${getUrgencyMutedTextClass(isLate)}`}
          >
            {isLate ? "막차 출발 시한" : "막차 출발까지 남은 시간"}
          </p>
        </header>

        <section className="text-center">
          <p
            className={timerClass}
            aria-live="polite"
            aria-atomic="true"
          >
            {isLate ? "이미 늦었습니다" : formatCountdownMmSs(secondsLeft)}
          </p>
          {!isLate ? (
            <p
              className={`mt-3 text-xs font-medium tracking-tight ${getUrgencyMutedTextClass(isLate)}`}
            >
              {formatCountdownMmSs(secondsLeft)} 후 문 안 나가면 지각 확정
            </p>
          ) : null}
        </section>

        <section className={`${glassCardClass} mt-8`}>
          <p
            className={`text-center text-[15px] font-medium leading-relaxed tracking-tight ${getUrgencyBodyTextClass(isLate, "text-zinc-800")}`}
          >
            {pressureCopy}
          </p>
        </section>

        <section className={`${glassCardClass} mt-6`}>
          <h2
            className={`mb-5 text-[11px] font-semibold uppercase tracking-tight ${getUrgencyMutedTextClass(isLate)}`}
          >
            실시간 최적 경로
          </h2>
          {routeData.timeline.length > 0 ? (
            <ol className="space-y-0">
              {routeData.timeline.map((step, index) => {
                const isActive = index === activeNodeIndex;
                const isTransit =
                  step.modeLabel === "지하철" || step.modeLabel === "버스";
                const isLast = index === routeData.timeline.length - 1;
                const highlightLine =
                  index === firstTransitIndex && liveVehicle.highlightLine
                    ? liveVehicle.highlightLine
                    : step.highlightLine;

                return (
                  <li key={step.id} className="relative flex items-stretch gap-4">
                    <div className="flex w-6 shrink-0 flex-col items-center self-stretch">
                      <div className="relative z-10 flex size-3 items-center justify-center">
                        {isActive ? (
                          <>
                            <span
                              className={[
                                "absolute inline-flex size-4 rounded-full opacity-50",
                                isTransit
                                  ? isLate
                                    ? "bg-zinc-400"
                                    : "animate-ping bg-rose-500"
                                  : "bg-zinc-400",
                              ].join(" ")}
                              aria-hidden
                            />
                            <span
                              className={[
                                "relative size-3 rounded-full",
                                isTransit
                                  ? isLate
                                    ? "bg-zinc-400"
                                    : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.25)]"
                                  : "bg-zinc-400",
                              ].join(" ")}
                              aria-hidden
                            />
                          </>
                        ) : (
                          <span
                            className="size-2 rounded-full bg-zinc-300"
                            aria-hidden
                          />
                        )}
                      </div>
                      {!isLast ? (
                        <div
                          className="w-[1.5px] flex-1 bg-zinc-200/80"
                          aria-hidden
                        />
                      ) : null}
                    </div>

                    <div className="flex-1 pb-6">
                      {step.modeLabel ? (
                        <p
                          className={`text-[10px] font-semibold uppercase tracking-tight ${getUrgencyMutedTextClass(isLate)}`}
                        >
                          {step.modeLabel}
                        </p>
                      ) : null}

                      <div className="mt-1.5 space-y-1">
                        {step.segments.map((line) => (
                          <p
                            key={line}
                            className={`text-sm font-normal leading-relaxed tracking-tight ${getUrgencyBodyTextClass(isLate, "text-zinc-700")}`}
                          >
                            {line}
                          </p>
                        ))}
                        {highlightLine ? (
                          <p
                            className={[
                              "mt-2.5 inline-flex w-fit items-center rounded-2xl px-4 py-2 text-sm font-medium leading-snug tracking-tight",
                              isLate
                                ? "border border-zinc-300/40 bg-zinc-200/40 text-zinc-400/80"
                                : "border border-rose-200/50 bg-rose-50/70 text-rose-600",
                            ].join(" ")}
                          >
                            {highlightLine}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className={`text-sm tracking-tight ${getUrgencyMutedTextClass(isLate)}`}>
              경로 정보를 불러오지 못했습니다.
            </p>
          )}
        </section>

        <section className="makcha-glass-card-light mt-4 px-6 py-4 text-center">
          {isLate && liveVehicle.lateVehicleNotice ? (
            <p
              className="text-sm font-medium leading-relaxed tracking-tight text-zinc-700"
              aria-live="polite"
            >
              {liveVehicle.lateVehicleNotice}
            </p>
          ) : isLate && lateArrival ? (
            <p
              className="text-sm font-medium leading-relaxed tracking-tight text-zinc-700"
              aria-live="polite"
            >
              지금 바로 출발 시 예상 도착:{" "}
              {formatKoreanTime(lateArrival.dynamicArrivalTime)} (
              <span className="font-semibold text-red-500">
                {lateArrival.minutesLate}
              </span>
              분 지각 예정)
            </p>
          ) : (
            <p
              className={`text-sm font-medium leading-relaxed tracking-tight ${isLate ? "text-zinc-700" : getUrgencyBodyTextClass(isLate, "text-zinc-600")}`}
            >
              {routeData.arrivalNotice}
            </p>
          )}
        </section>

        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className={`mt-8 text-center text-xs font-medium tracking-tight underline-offset-4 transition-all duration-300 active:scale-[0.98] ${isLate ? "text-zinc-400/80" : "text-zinc-500 hover:text-zinc-700 hover:underline"}`}
          >
            처음으로 돌아가기
          </button>
        ) : null}
      </main>

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[5] mx-auto h-40 max-w-md bg-gradient-to-t to-transparent ${fadeClass}`}
      />

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md space-y-2 px-5 pb-8 pt-6">
        <MapOpenButton
          originName={trip.originLabel}
          destinationName={trip.destinationLabel}
          origin={trip.origin}
          destination={trip.destination}
        />
        <button
          type="button"
          disabled={isLate}
          className={[
            "w-full rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 py-3.5",
            "font-bold tracking-tight text-white",
            "shadow-md shadow-red-500/10",
            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]",
            "transition-all duration-300 hover:brightness-105",
            "active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:active:scale-100",
          ].join(" ")}
        >
          현관문 나섰음 (출발 인증)
        </button>
      </div>
    </div>
  );
}
