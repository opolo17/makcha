import { odsayGet } from "@/lib/odsay/client";
import type { OdsayPathSearchResult } from "@/lib/odsay/types";

export type LatLng = { lat: number; lng: number };

export async function searchPubTransPathT(
  origin: LatLng,
  destination: LatLng,
): Promise<OdsayPathSearchResult> {
  return odsayGet<OdsayPathSearchResult>("searchPubTransPathT", {
    SX: origin.lng,
    SY: origin.lat,
    EX: destination.lng,
    EY: destination.lat,
    OPT: 0,
    SearchType: 0,
    SearchPathType: 0,
  });
}
