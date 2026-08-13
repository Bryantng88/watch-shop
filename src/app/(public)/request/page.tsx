import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

import { listRelatedPublicWatches } from "@/domains/storefront/server";
import { loadStorefrontCartItems } from "@/domains/storefront/server/request-cart.service";
import PublicOrderForm from "@/domains/storefront/ui/PublicOrderForm";
import RelatedWatchSuggestions from "@/domains/storefront/ui/RelatedWatchSuggestions";

export const metadata = { title: "Yêu cầu tư vấn" };

type RequestSearchParams = { product?: string; reference?: string; disposition?: string; added?: string; error?: string };

export default async function RequestPage({ searchParams }: { searchParams?: Promise<RequestSearchParams> }) {
  const query = await searchParams;
  const slug = query?.product?.trim() ?? "";
  const locale = (await cookies()).get("vintic-locale")?.value === "en" ? "en" : "vi";
  const initialItems = await loadStorefrontCartItems(slug);
  const selectedProductIds = initialItems.map((item) => item.productId);
  const relatedWatches = await listRelatedPublicWatches(selectedProductIds);

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#807a72]">{locale === "en" ? "Watch consultation" : "Tư vấn mua đồng hồ"}</p>
      <h1 className="storefront-display mt-4 text-4xl leading-[1.08] sm:text-5xl lg:text-[56px]">{locale === "en" ? "A personal watch consultation" : "Tư vấn dành riêng cho bạn"}</h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#706b64]">{locale === "en" ? "Share your selection and contact details. Our team will personally reconfirm price, condition and availability." : "Gửi lựa chọn và thông tin liên hệ. Đội ngũ sẽ trực tiếp kiểm tra lại giá, tình trạng và khả năng cung cấp."}</p>
    </div>
    <div className="mt-12 lg:mt-16"><PublicOrderForm initialItems={initialItems} initialRequestKey={randomUUID()} submittedReference={query?.reference?.trim()} submittedDisposition={query?.disposition === "MERGED" ? "MERGED" : "CREATED"} submittedAddedItemCount={Math.max(0, Number(query?.added) || 0)} initialError={query?.error?.trim()} /></div>
    <RelatedWatchSuggestions watches={relatedWatches} selectedProductIds={selectedProductIds} />
  </div>;
}
