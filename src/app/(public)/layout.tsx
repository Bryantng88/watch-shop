import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";

import PublicFooter from "@/domains/storefront/ui/PublicFooter";
import PublicHeader from "@/domains/storefront/ui/PublicHeader";
import { StorefrontCartProvider } from "@/domains/storefront/ui/StorefrontCart";
import PwaRuntime from "@/domains/storefront/ui/PwaRuntime";
import "./storefront.css";
import { loadStorefrontCartItems } from "@/domains/storefront/server/request-cart.service";
import { getStorefrontUsdRate } from "@/domains/storefront/server/exchange-rate.service";
import { StorefrontLocaleProvider } from "@/domains/storefront/ui/StorefrontLocale";
import { StorefrontAnalyticsRuntime } from "@/domains/analytics/storefront/StorefrontAnalytics";

export const metadata: Metadata = {
  applicationName: "Vintic",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/vintic-v.svg", apple: "/vintic-v.svg" },
  title: {
    default: "Vintic — Đồng hồ tuyển chọn",
    template: "%s | Vintic",
  },
  description: "Bộ sưu tập đồng hồ đã qua tuyển chọn và sẵn sàng tư vấn.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#252525", width: "device-width", initialScale: 1 };

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [initialItems, rate, cookieStore] = await Promise.all([loadStorefrontCartItems(), getStorefrontUsdRate(), cookies()]);
  const locale = cookieStore.get("vintic-locale")?.value === "en" ? "en" : "vi";
  return (
    <StorefrontLocaleProvider value={{ locale, vndPerUsd: rate.vndPerUsd, rateSource: rate.source }}>
    <StorefrontCartProvider initialItems={initialItems}>
      <div className="storefront-surface min-h-screen bg-white text-[#252525]">
        <PwaRuntime />
        <StorefrontAnalyticsRuntime />
        <PublicHeader />
        <main>{children}</main>
        <PublicFooter />
      </div>
    </StorefrontCartProvider>
    </StorefrontLocaleProvider>
  );
}
