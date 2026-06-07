import { getOdsayApiKey, getOdsayBaseUrl } from "@/lib/odsay/config";

export class OdsayApiError extends Error {
  constructor(
    message: string,
    public readonly code?: number | string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "OdsayApiError";
  }
}

type OdsayFetchParams = Record<string, string | number | undefined>;

function buildOdsayUrl(endpoint: string, params: OdsayFetchParams): string {
  const base = getOdsayBaseUrl().replace(/\/$/, "");
  const parts = [`apiKey=${encodeURIComponent(getOdsayApiKey())}`, "lang=0"];

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
    }
  }

  return `${base}/${endpoint}?${parts.join("&")}`;
}

export async function odsayGet<T>(
  endpoint: string,
  params: OdsayFetchParams,
): Promise<T> {
  const url = buildOdsayUrl(endpoint, params);

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const data = (await response.json()) as T & {
    error?: Array<{ code?: number | string; message?: string }>;
  };

  if (!response.ok) {
    throw new OdsayApiError(
      data.error?.[0]?.message ?? `ODsay HTTP ${response.status}`,
      data.error?.[0]?.code,
      response.status,
    );
  }

  const apiError = data.error?.[0];
  if (apiError) {
    throw new OdsayApiError(
      apiError.message ?? "ODsay API error",
      apiError.code,
      response.status,
    );
  }

  return data;
}
