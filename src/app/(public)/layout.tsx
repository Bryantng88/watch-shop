import type { Metadata, Viewport } from "next";

import PublicFooter from "@/domains/storefront/ui/PublicFooter";
import PublicHeader from "@/domains/storefront/ui/PublicHeader";
import { StorefrontCartProvider } from "@/domains/storefront/ui/StorefrontCart";
import PwaRuntime from "@/domains/storefront/ui/PwaRuntime";
import "./storefront.css";

export const metadata: Metadata = {
  applicationName: "Watch Shop",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/storefront-icon.svg", apple: "/storefront-icon.svg" },
  title: {
    default: "Watch Shop — Đồng hồ tuyển chọn",
    template: "%s | Watch Shop",
  },
  description: "Bộ sưu tập đồng hồ đã qua tuyển chọn và sẵn sàng tư vấn.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#252525", width: "device-width", initialScale: 1 };

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <StorefrontCartProvider>
      <div className="storefront-surface min-h-screen bg-[#fbfaf7] text-[#252525]">
        <PwaRuntime />
        <PublicHeader />
        <main>{children}</main>
        <PublicFooter />
      </div>
    </StorefrontCartProvider>
  );
}
