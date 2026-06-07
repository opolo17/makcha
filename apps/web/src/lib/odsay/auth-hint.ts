/** ODsay ApiKeyAuthFailed 시 사용자 안내 문구 */
export function getOdsayAuthErrorHint(rawMessage: string): string {
  if (!rawMessage.includes("ApiKeyAuthFailed")) {
    return rawMessage;
  }

  return [
    "ODsay API 키 인증에 실패했습니다.",
    "",
    "우리 앱은 서버(/api/route)에서 ODsay를 호출하므로 아래를 확인해주세요.",
    "1. lab.odsay.com → 내 애플리케이션 → **서버 API 키**(Web 키 아님)를 .env의 ODSAY_API_KEY에 넣기",
    "2. 같은 화면 **설정** 탭에서 **현재 공인 IP** 등록 (로컬 npm run dev도 서버 호출이라 IP 검증됨)",
    "3. 키에 +, / 같은 특수문자가 있으면 .env에서 따옴표로 감싸기: ODSAY_API_KEY=\"...\"",
    "",
    `원본: ${rawMessage}`,
  ].join("\n");
}
