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

export async function odsayGet<T>(
  endpoint: string,
  params: OdsayFetchParams,
): Promise<T> {
  const base = getOdsayBaseUrl().replace(/\/$/, "");
  const url = new URL(`${base}/${endpoint}`);
  url.searchParams.set("apiKey", getOdsayApiKey());
  url.searchParams.set("lang", "0");

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
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
