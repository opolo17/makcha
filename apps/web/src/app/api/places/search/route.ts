import { NextResponse } from "next/server";
import type { LocationData } from "@/types/location";

type KakaoKeywordDocument = {
  place_name: string;
  x: string;
  y: string;
};

type KakaoKeywordResponse = {
  documents: KakaoKeywordDocument[];
};

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ error: "query 파라미터가 필요합니다." }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_KAKAO_REST_API_KEY가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);
  url.searchParams.set("size", "5");

  try {
    const response = await fetch(url.toString(), {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `카카오 장소 검색 실패 (${response.status})` },
        { status: response.status },
      );
    }

    const data = (await response.json()) as KakaoKeywordResponse;
    const places: LocationData[] = data.documents.map((doc) => ({
      name: doc.place_name,
      lat: Number.parseFloat(doc.y),
      lng: Number.parseFloat(doc.x),
    }));

    return NextResponse.json(places);
  } catch {
    return NextResponse.json(
      { error: "카카오 장소 검색 중 오류가 발생했습니다." },
      { status: 502 },
    );
  }
}
