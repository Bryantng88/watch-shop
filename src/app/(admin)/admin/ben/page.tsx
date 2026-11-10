import type { Metadata, Viewport } from "next";
export const metadata: Metadata = {
  title: "Ben",
  appleWebApp: { capable: true, title: "Ben", statusBarStyle: "default" },
  icons: { icon: "/ben/icon-192.png", apple: "/ben/apple-touch-icon.png" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", interactiveWidget: "resizes-content", themeColor: "#4338ca" };
export default function BenPage() { return <link rel="manifest" href="/ben.webmanifest" crossOrigin="use-credentials" />; }
