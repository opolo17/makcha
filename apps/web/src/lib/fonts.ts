import { Black_Han_Sans, Roboto_Mono } from "next/font/google";

/** 오직 실시간 타이머 숫자용 */
export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

/** impact 폰트 스택 fallback */
export const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-han-sans",
  display: "swap",
});

export const fontClassNames = `${robotoMono.variable} ${blackHanSans.variable}`;
