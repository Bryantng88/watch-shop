import type { Metadata, Viewport } from "next";
import BenPwaRuntime from "@/domains/ai-assistant/BenPwaRuntime";
export const metadata: Metadata = {
  title: "Ben", manifest: "/ben.webmanifest",
  appleWebApp: { capable: true, title: "Ben", statusBarStyle: "default" },
  icons: { icon: "/ben/icon-192.png", apple: "/ben/apple-touch-icon.png" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#4338ca" };
export default function BenPage() { return <BenPwaRuntime />; }
