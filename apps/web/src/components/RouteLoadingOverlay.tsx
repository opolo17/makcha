"use client";

export function RouteLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50/90 backdrop-blur-xl"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="막차 계산 중"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06),transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-sm flex-col items-center gap-6 px-8 text-center">
        <div className="relative size-16" aria-hidden>
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500/10" />
          <span className="absolute inset-1 animate-spin rounded-full border-2 border-red-500/20 border-t-red-500 motion-reduce:animate-none" />
        </div>
        <div className="rounded-2xl border border-zinc-200/60 bg-white/80 px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <p className="text-lg font-semibold tracking-tight text-zinc-900">
            가장 빠른 대중교통 막차를 계산 중입니다...
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            실시간 경로와 소요 시간을 반영하고 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
