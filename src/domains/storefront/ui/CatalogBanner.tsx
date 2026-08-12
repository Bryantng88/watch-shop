"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStorefrontLocale } from "./StorefrontLocale";

const slides = [
  {
    eyebrow: "Vintage & pre-owned",
    title: "Đồng hồ tuyển chọn",
    copy: "Mỗi thiết kế mang một dấu ấn riêng, được trình bày bằng hình ảnh thực tế và thông tin minh bạch.",
    enTitle: "Curated watches", enCopy: "Distinctive watches presented with real imagery and transparent information.",
  },
  {
    eyebrow: "Curated with care",
    title: "Vẻ đẹp vượt thời gian",
    copy: "Khám phá những chiếc đồng hồ cổ điển được chọn lọc cho người trân trọng câu chuyện phía sau từng thiết kế.",
    enTitle: "Timeless character", enCopy: "Discover vintage watches selected for those who value the story behind every design.",
  },
  {
    eyebrow: "Personal consultation",
    title: "Chọn chiếc đồng hồ dành cho bạn",
    copy: "Đội ngũ Vintic sẵn sàng tư vấn trực tiếp về tình trạng, kích thước và phong cách phù hợp.",
    enTitle: "Find your watch", enCopy: "Vintic offers personal guidance on condition, sizing and the style that suits you.",
  },
];

export default function CatalogBanner() {
  const [active, setActive] = useState(0);
  const { locale } = useStorefrontLocale();

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative mt-6 min-h-[142px] overflow-hidden rounded-[5px] border border-[#d9dcdd] bg-[#f0f2f3] px-7 py-6 sm:px-8 lg:min-h-[148px] lg:px-9" aria-label="Giới thiệu bộ sưu tập">
      <div aria-hidden="true" className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/55 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 right-[24%] h-px w-56 bg-gradient-to-r from-transparent via-[#a9afb2]/50 to-transparent" />
      <div className="relative min-h-[94px] max-w-4xl pr-0 sm:pr-40">
        <div key={slides[active].title} className="storefront-banner-slide absolute inset-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#71777a]">{slides[active].eyebrow}</p>
          <h1 className="storefront-display mt-1.5 text-2xl leading-tight sm:text-3xl">{locale === "en" ? slides[active].enTitle : slides[active].title}</h1>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#666967] sm:text-sm">{locale === "en" ? slides[active].enCopy : slides[active].copy}</p>
        </div>
      </div>
      <Link href="/request" className="storefront-focus relative mt-4 inline-grid min-h-10 place-items-center rounded-[3px] bg-[#d84b0b] px-5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#bd4209] hover:shadow-md sm:absolute sm:right-8 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:hover:-translate-y-[54%] lg:right-9">{locale === "en" ? "Send request" : "Gửi yêu cầu"}</Link>
      <div className="absolute bottom-3 left-7 flex gap-2 sm:left-8 lg:left-9" aria-label="Chọn nội dung banner">
        {slides.map((slide, index) => <button key={slide.title} type="button" onClick={() => setActive(index)} aria-label={`Xem ${slide.title}`} aria-current={active === index ? "true" : undefined} className={`storefront-focus h-1 rounded-full transition-all duration-500 ${active === index ? "w-7 bg-[#46545e]" : "w-2 bg-[#b9bdbe] hover:bg-[#8f9597]"}`} />)}
      </div>
    </section>
  );
}
