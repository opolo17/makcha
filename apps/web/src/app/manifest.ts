import type { MetadataRoute } from "next";
import { PRODUCT } from "@/lib/product";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PRODUCT.name} (${PRODUCT.nameKo})`,
    short_name: PRODUCT.name,
    description: PRODUCT.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "ko",
    // PWA 설치용 아이콘 — public/icons/ 에 192·512 PNG 추가 후 활성화
    icons: [],
  };
}
