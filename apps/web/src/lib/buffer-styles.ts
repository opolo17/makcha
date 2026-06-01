export type BufferStyleId = "relaxed" | "normal" | "speed";

export type BufferStyleOption = {
  id: BufferStyleId;
  label: string;
  bufferMinutes: number;
};

export const BUFFER_STYLE_OPTIONS: BufferStyleOption[] = [
  { id: "relaxed", label: "느긋하게", bufferMinutes: 25 },
  { id: "normal", label: "보통", bufferMinutes: 15 },
  { id: "speed", label: "초스피드", bufferMinutes: 5 },
];

export function getBufferMinutesById(id: BufferStyleId): number {
  return (
    BUFFER_STYLE_OPTIONS.find((option) => option.id === id)?.bufferMinutes ?? 15
  );
}
