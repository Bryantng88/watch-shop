"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useStorefrontLocale } from "./StorefrontLocale";

const slides = [
  {
    eyebrow: "Vintage & pre-owned",
    title: "Đồng hồ tuyển chọn",
    copy: "Mỗi thiết kế mang một dấu ấn riêng, được trình bày bằng hình ảnh thực tế và thông tin minh bạch.",
    enTitle: "Curated watches", enCopy: "Distinctive watches presented with real imagery and transparent information.",
    tone: { base: "#e6e4df", imageEdge: "#5b6162" },
  },
  {
    eyebrow: "Curated with care",
    title: "Vẻ đẹp vượt thời gian",
    copy: "Khám phá những chiếc đồng hồ cổ điển được chọn lọc cho người trân trọng câu chuyện phía sau từng thiết kế.",
    enTitle: "Timeless character", enCopy: "Discover vintage watches selected for those who value the story behind every design.",
    tone: { base: "#e8e2da", imageEdge: "#665f57" },
  },
  {
    eyebrow: "Personal consultation",
    title: "Chọn chiếc đồng hồ dành cho bạn",
    copy: "Đội ngũ Vintic sẵn sàng tư vấn trực tiếp về tình trạng, kích thước và phong cách phù hợp.",
    enTitle: "Find your watch", enCopy: "Vintic offers personal guidance on condition, sizing and the style that suits you.",
    tone: { base: "#dfe4e1", imageEdge: "#53605c" },
  },
];

export default function CatalogBanner({ galleryImageUrl }: { galleryImageUrl?: string | null }) {
  const [active, setActive] = useState(0);
  const { locale } = useStorefrontLocale();

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className="relative mt-6 min-h-[138px] overflow-hidden rounded-[5px] border border-[#d3d0ca] px-7 py-5 shadow-[0_14px_34px_-30px_rgba(44,42,38,0.45)] transition-colors duration-1000 ease-out sm:px-8 lg:min-h-[142px] lg:px-9"
      style={{ backgroundColor: slides[active].tone.base }}
      aria-label="Giới thiệu bộ sưu tập"
    >
      {galleryImageUrl ? (
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden sm:block">
          <Image src={galleryImageUrl} alt="" fill sizes="46vw" className="scale-[1.04] object-cover object-center opacity-[0.66] blur-[0.4px] saturate-[0.72] contrast-[1.02]" />
          <div
            className="absolute inset-0 transition-[background] duration-1000 ease-out"
            style={{ background: `linear-gradient(90deg, ${slides[active].tone.base} 0%, ${slides[active].tone.base}e6 34%, ${slides[active].tone.imageEdge}42 100%)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/14" />
        </div>
      ) : null}
      <div aria-hidden="true" className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 right-[24%] h-px w-56 bg-gradient-to-r from-transparent via-[#77736d]/20 to-transparent" />
      <div className="relative z-10 min-h-[92px] max-w-4xl pr-0 sm:max-w-[62%] sm:pr-8 lg:max-w-[58%]">
        <div key={slides[active].title} className="storefront-banner-slide absolute inset-0">
          <p className="text-[9px] uppercase tracking-[0.24em] text-[#77746f]">{slides[active].eyebrow}</p>
          <h1 className="storefront-display mt-1 text-[23px] leading-[1.12] text-[#292826] sm:text-[26px] lg:text-[27px]">{locale === "en" ? slides[active].enTitle : slides[active].title}</h1>
          <p className="mt-1.5 max-w-xl text-[11px] leading-[1.1rem] text-[#66635e] sm:text-xs sm:leading-[1.2rem]">{locale === "en" ? slides[active].enCopy : slides[active].copy}</p>
        </div>
      </div>
      <Link href="/request" className="storefront-focus relative z-20 mt-4 inline-grid min-h-10 place-items-center rounded-[3px] bg-[#d84b0b] px-5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#bd4209] hover:shadow-md sm:absolute sm:right-8 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:hover:-translate-y-[54%] lg:right-9">{locale === "en" ? "Send request" : "Gửi yêu cầu"}</Link>
      <div className="absolute bottom-3 left-7 flex gap-2 sm:left-8 lg:left-9" aria-label="Chọn nội dung banner">
        {slides.map((slide, index) => <button key={slide.title} type="button" onClick={() => setActive(index)} aria-label={`Xem ${slide.title}`} aria-current={active === index ? "true" : undefined} className={`storefront-focus h-1 rounded-full transition-all duration-500 ${active === index ? "w-7 bg-[#46545e]" : "w-2 bg-[#9da09e]/55 hover:bg-[#747a7b]"}`} />)}
      </div>
    </section>
  );
}
