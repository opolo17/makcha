import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PRODUCT } from "@/lib/product";

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
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
