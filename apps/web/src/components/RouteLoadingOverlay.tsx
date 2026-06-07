"use client";

export function RouteLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="막차 계산 중"
    >
      <div className="mx-auto flex max-w-sm flex-col items-center gap-5 px-8 text-center">
        <div className="relative size-16" aria-hidden>
          <span className="absolute inset-0 animate-ping rounded-full bg-neon-yellow/20" />
          <span className="absolute inset-1 animate-spin rounded-full border-[3px] border-neon-yellow/25 border-t-neon-yellow motion-reduce:animate-none" />
          <span className="absolute inset-0 flex items-center justify-center text-xl">
            🚇
          </span>
        </div>
        <div>
          <p className="font-impact text-xl font-bold leading-snug text-foreground">
            가장 빠른 대중교통 막차를 계산 중입니다...
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            실시간 경로와 소요 시간을 반영하고 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
