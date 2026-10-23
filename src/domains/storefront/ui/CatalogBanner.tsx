"use client";

import { useStorefrontLocale } from "./StorefrontLocale";

export default function CatalogBanner({ title }: { title?: string }) {
  const { locale } = useStorefrontLocale();
  return (
    <header className="vgc-intro">
      <h1>{title || (locale === "en" ? "Watches" : "Đồng hồ")}</h1>
      <p className="vgc-intro-description">
        {locale === "en"
          ? "Vintage & pre-owned watches, selected by Vintic."
          : "Đồng hồ vintage & pre-owned, được Vintic tuyển chọn."}
      </p>
    </header>
  );
}
