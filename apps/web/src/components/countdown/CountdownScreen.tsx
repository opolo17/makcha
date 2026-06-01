"use client";

import { MapOpenButton } from "@/components/countdown/MapOpenButton";
import { MakchaLogo } from "@/components/brand/MakchaLogo";
import type { TripRoute } from "@/types/trip-route";
import { useCountdown } from "@/hooks/useCountdown";
import { DUMMY_COUNTDOWN } from "@/lib/countdown-dummy";
import { getPressureCopy } from "@/lib/pressure-copy";
import {
  formatCountdownMmSs,
  getUrgencyShellClass,
} from "@/lib/urgency";

type CountdownScreenProps = {
  deadlineAt: Date;
  isTracking: boolean;
  trip: TripRoute;
  onReset?: () => void;
};

export function CountdownScreen({
  deadlineAt,
  isTracking,
  trip,
  onReset,
}: CountdownScreenProps) {
  const { secondsLeft, minutesRemaining, isLate } = useCountdown(
    deadlineAt,
    isTracking,
  );

  const shellClass = isLate
    ? "bg-red-950"
    : getUrgencyShellClass(secondsLeft);
  const pressureCopy = getPressureCopy(minutesRemaining, isLate);

  return (
    <div
      className={`mx-auto flex min-h-full max-w-md flex-col transition-colors duration-500 ${shellClass} text-white`}
    >
      <main className="flex flex-1 flex-col px-5 pb-36 pt-8">
        <header className="mb-6 flex justify-center">
          <MakchaLogo className="h-8 w-auto brightness-0 invert" />
        </header>

        <section className="text-center">
          <p className="text-sm font-semibold tracking-wide text-white/70">
            {isLate ? "막차 출발 시한" : "막차 출발까지 남은 시간"}
          </p>
          <p
            className={`mt-3 font-mono font-black tabular-nums tracking-tighter ${
              isLate
                ? "text-4xl text-red-300"
                : "text-7xl sm:text-8xl"
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {isLate ? "이미 늦었습니다" : formatCountdownMmSs(secondsLeft)}
          </p>
          {!isLate ? (
            <p className="mt-2 text-xs text-white/50">
              {formatCountdownMmSs(secondsLeft)} 후 문 안 나가면 지각 확정
            </p>
          ) : null}
        </section>

        <section className="mt-8 rounded-2xl border border-white/15 bg-black/20 px-4 py-4 backdrop-blur-sm">
          <p className="text-center text-lg font-bold leading-snug text-white">
            {pressureCopy}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">
            실시간 최적 경로
          </h2>
          <ol className="relative space-y-0 border-l-2 border-white/25 pl-5">
            {DUMMY_COUNTDOWN.route.map((step) => (
              <li key={step.id} className="relative pb-6 last:pb-0">
                <span
                  className="absolute -left-[1.35rem] top-1.5 size-2.5 rounded-full bg-neon-yellow ring-4 ring-white/10"
                  aria-hidden
                />
                {step.modeLabel ? (
                  <p className="text-xs font-bold uppercase tracking-wide text-neon-yellow">
                    [{step.modeLabel}]
                  </p>
                ) : null}
                <div className="mt-1 space-y-1">
                  {step.segments.map((line) => (
                    <p
                      key={line}
                      className="text-sm leading-relaxed text-white/90"
                    >
                      {line}
                    </p>
                  ))}
                  {step.highlightLine ? (
                    <p className="mt-2 rounded-lg border border-neon-yellow/50 bg-neon-yellow/15 px-3 py-2 text-sm font-bold text-neon-yellow">
                      {step.highlightLine}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-xl bg-black/25 px-4 py-3 text-center">
          <p className="text-sm font-medium text-white/90">
            {DUMMY_COUNTDOWN.arrivalNotice}
          </p>
        </section>

        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="mt-6 text-center text-sm text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
          >
            처음으로 돌아가기
          </button>
        ) : null}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md space-y-2 px-5 pb-8">
        <MapOpenButton trip={trip} disabled={isLate} />
        <button
          type="button"
          disabled={isLate}
          className="w-full rounded-xl bg-neon-yellow py-3.5 text-sm font-black text-black transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          현관문 나섰음 (출발 인증)
        </button>
      </div>
    </div>
  );
}
