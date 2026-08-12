import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Watch Shop — Đồng hồ tuyển chọn",
    short_name: "Watch Shop",
    description: "Bộ sưu tập đồng hồ tuyển chọn và yêu cầu tư vấn.",
    start_url: "/products",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#252525",
    orientation: "portrait-primary",
    icons: [
      { src: "/storefront-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/storefront-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
