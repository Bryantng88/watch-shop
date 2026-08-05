import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { getPublicWatchBySlug } from "@/domains/storefront/server";
import AddToRequestButton from "@/domains/storefront/ui/AddToRequestButton";

export const dynamic = "force-dynamic";

const getWatch = cache((slug: string) => getPublicWatchBySlug(slug));

function money(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const watch = await getWatch(slug);
  if (!watch) return { title: "Không tìm thấy đồng hồ" };
  return {
    title: watch.seo.title,
    description: watch.seo.description,
    robots: { index: false, follow: false },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const watch = await getWatch(slug);
  if (!watch) notFound();

  return (
    <article className="mx-auto max-w-[1440px] px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:pt-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#89857e]">
        <Link href="/products" className="storefront-focus inline-flex min-h-11 items-center gap-2"><ArrowLeft className="h-3.5 w-3.5" /> Bộ sưu tập</Link>
        <span>/</span><span className="truncate text-[#4d4a46]">{watch.title}</span>
      </nav>

      <div className="mt-5 grid gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-14 xl:gap-20">
        <section aria-label="Hình ảnh đồng hồ">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#efede8]">
            <Image src={watch.gallery[0]?.url ?? watch.image.url} alt={watch.gallery[0]?.alt ?? watch.image.alt} fill priority sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover" />
          </div>
          {watch.gallery.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {watch.gallery.slice(1, 6).map((image) => (
                <div key={image.url} className="relative aspect-square overflow-hidden bg-[#efede8]">
                  <Image src={image.url} alt={image.alt} fill sizes="(max-width: 640px) 25vw, 12vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="lg:sticky lg:top-6 lg:self-start">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#817d76]">{watch.brand ?? "Đồng hồ tuyển chọn"}</p>
          <h1 className="storefront-display mt-3 text-4xl leading-[1.08] sm:text-5xl">{watch.title}</h1>
          <p className="mt-6 text-xl font-semibold tabular-nums">
            {watch.price.mode === "SHOW" ? money(watch.price.amount) : "Liên hệ để biết giá"}
          </p>

          <div className="mt-7 flex items-start gap-3 border-y border-[#dedbd4] py-5 text-sm leading-6 text-[#66635e]">
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Tình trạng và giá được kiểm tra lại khi đội ngũ tiếp nhận yêu cầu.
          </div>

          {watch.summary ? <p className="mt-7 text-sm leading-7 text-[#66635e] sm:text-base">{watch.summary}</p> : null}

          <AddToRequestButton orderable={watch.price.mode === "SHOW"} item={{ productId: watch.productId, slug: watch.slug, title: watch.title, imageUrl: watch.image.url }} />

          {watch.specs.length ? (
            <div className="mt-10 border-t border-[#dedbd4]">
              <h2 className="storefront-display py-5 text-2xl">Thông số</h2>
              <dl>
                {watch.specs.map((spec) => (
                  <div key={spec.key} className="grid grid-cols-[minmax(110px,0.8fr)_1.2fr] gap-4 border-t border-[#e5e1da] py-3 text-sm">
                    <dt className="text-[#858079]">{spec.label}</dt>
                    <dd className="text-right text-[#44413d]">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      </div>
    </article>
  );
}
