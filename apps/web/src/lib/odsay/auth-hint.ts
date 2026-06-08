/** ODsay ApiKeyAuthFailed 시 사용자 안내 문구 */
export function getOdsayAuthErrorHint(rawMessage: string): string {
  if (!rawMessage.includes("ApiKeyAuthFailed")) {
    return rawMessage;
  }

  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    return [
      "ODsay Web API 키 인증에 실패했습니다.",
      "",
      "Vercel 등 배포 환경은 고정 IP가 없어 **Web API 키 + 도메인 등록**이 필요합니다.",
      "1. lab.odsay.com → 내 애플리케이션 → **Web API 키**를 Vercel 환경변수 NEXT_PUBLIC_ODSAY_WEB_API_KEY에 설정",
      "2. 같은 화면 **설정** 탭에서 배포 URL 등록 (예: https://makcha-web.vercel.app)",
      "3. 로컬 테스트 시 http://localhost:3000 도 Web 플랫폼 URI에 추가",
      "",
      `원본: ${rawMessage}`,
    ].join("\n");
  }

  return [
    "ODsay Server API 키 인증에 실패했습니다.",
    "",
    "서버(/api/route) 호출에는 **Server API 키 + 공인 IP 등록**이 필요합니다.",
    "1. lab.odsay.com → 내 애플리케이션 → **서버 API 키**를 ODSAY_API_KEY에 설정",
    "2. **설정** 탭에서 서버 공인 IP 등록",
    "3. Vercel 배포는 IP가 고정되지 않으므로 NEXT_PUBLIC_ODSAY_WEB_API_KEY(Web 키)를 추가하세요",
    "",
    `원본: ${rawMessage}`,
  ].join("\n");
}
