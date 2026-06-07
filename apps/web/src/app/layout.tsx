import type { Metadata, Viewport } from "next";
import { fontClassNames } from "@/lib/fonts";
import { PRODUCT } from "@/lib/product";
import "./globals.css";

export const metadata: Metadata = {
  title: `${PRODUCT.name} · ${PRODUCT.nameKo}`,
  description: PRODUCT.description,
  applicationName: PRODUCT.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: PRODUCT.nameKo,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full ${fontClassNames}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
