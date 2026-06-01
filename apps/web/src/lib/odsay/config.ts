const DEFAULT_BASE = "https://api.odsay.com/v1/api";

export function getOdsayApiKey(): string {
  const key = process.env.ODSAY_API_KEY?.trim();
  if (!key) {
    throw new Error("ODSAY_API_KEY is not configured");
  }
  return key;
}

export function getOdsayBaseUrl(): string {
  return process.env.ODSAY_API_BASE_URL?.trim() || DEFAULT_BASE;
}

export function getSeoulBusApiKey(): string | undefined {
  return process.env.SEOUL_BUS_API_KEY?.trim() || undefined;
}

export function getSeoulSubwayApiKey(): string | undefined {
  return process.env.SEOUL_SUBWAY_API_KEY?.trim() || undefined;
}
