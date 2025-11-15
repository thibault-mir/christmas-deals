// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Christmas Deals by Servier",
  description: "Exclusive Christmas Deals by Chuck Norris",
  manifest: "/manifest.json",
  themeColor: "#07403a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Christmas Deals",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#07403a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
