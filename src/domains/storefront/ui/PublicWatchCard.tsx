import Image from "next/image";
import Link from "next/link";

import type { PublicWatchCard } from "../contracts";

function money(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function tagLabel(tag: string | null) {
  if (tag === "PRE_OWNED") return "Pre-owned";
  if (tag === "VINTAGE") return "Vintage";
  if (tag === "NEW") return "New";
  return tag;
}

function availabilityLabel(availability: PublicWatchCard["availability"]) {
  if (availability === "HOLD") return "Đang giữ";
  if (availability === "SOLD") return "Đã bán";
  return null;
}

export default function PublicWatchCardView({ watch }: { watch: PublicWatchCard }) {
  return (
    <article className="storefront-card group min-w-0">
      <Link href={`/products/${watch.slug}`} className="storefront-focus block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#efede8]">
          <Image
            src={watch.image.url}
            alt={watch.image.alt}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="storefront-card-image object-cover"
          />
          {availabilityLabel(watch.availability) ? (
            <span className="absolute left-3 top-3 rounded-full bg-[#fbfaf7]/95 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#34322f] shadow-sm">
              {availabilityLabel(watch.availability)}
            </span>
          ) : null}
          {tagLabel(watch.tag) ? (
            <span className="absolute bottom-3 right-3 rounded-full bg-[#3f4d58] px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-white">
              {tagLabel(watch.tag)}
            </span>
          ) : null}
        </div>
        <div className="pt-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#858079]">{watch.brand ?? "Tuyển chọn"}</p>
          <h2 className="mt-2 line-clamp-2 min-h-10 text-sm font-normal leading-5 text-[#4f4c48] sm:text-[15px]">{watch.title}</h2>
          <p className="mt-2 text-sm font-semibold tabular-nums text-[#31302e]">
            {watch.price.mode === "SHOW" ? money(watch.price.amount) : "Liên hệ để biết giá"}
          </p>
        </div>
      </Link>
    </article>
  );
}
