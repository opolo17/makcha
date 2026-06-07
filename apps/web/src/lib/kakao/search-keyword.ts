import type { LocationData } from "@/types/location";

const KAKAO_KEYWORD_URL =
  "https://dapi.kakao.com/v2/local/search/keyword.json";
const RESULT_SIZE = 5;

type KakaoKeywordDocument = {
  place_name: string;
  address_name: string;
  road_address_name?: string;
  x: string;
  y: string;
};

type KakaoKeywordResponse = {
  documents: KakaoKeywordDocument[];
};

export type KakaoPlaceResult = LocationData & {
  address: string;
};

function mapDocuments(documents: KakaoKeywordDocument[]): KakaoPlaceResult[] {
  return documents.slice(0, RESULT_SIZE).map((doc) => ({
    name: doc.place_name,
    lat: Number.parseFloat(doc.y),
    lng: Number.parseFloat(doc.x),
    address: doc.road_address_name || doc.address_name,
  }));
}

async function searchViaKakaoDirect(
  keyword: string,
): Promise<KakaoPlaceResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_KAKAO_REST_API_KEY가 설정되지 않았습니다.");
  }

  const url = new URL(KAKAO_KEYWORD_URL);
  url.searchParams.set("query", keyword);
  url.searchParams.set("size", String(RESULT_SIZE));

  const response = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(`카카오 장소 검색 실패 (${response.status})`);
  }

  const data = (await response.json()) as KakaoKeywordResponse;
  return mapDocuments(data.documents ?? []);
}

/** 브라우저 CORS 등으로 직접 호출이 막힐 때 서버 프록시 사용 */
async function searchViaProxy(keyword: string): Promise<KakaoPlaceResult[]> {
  const response = await fetch(
    `/api/places/search?query=${encodeURIComponent(keyword)}`,
  );
  const data = (await response.json()) as LocationData[] & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "장소 검색에 실패했습니다.");
  }

  return data.map((place) => ({
    ...place,
    address: place.name,
  }));
}

export async function searchKakaoKeyword(
  keyword: string,
): Promise<KakaoPlaceResult[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  try {
    return await searchViaKakaoDirect(trimmed);
  } catch (error) {
    if (error instanceof TypeError) {
      return searchViaProxy(trimmed);
    }
    throw error;
  }
}
