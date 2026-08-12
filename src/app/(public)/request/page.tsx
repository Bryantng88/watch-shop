import { randomUUID } from "node:crypto";
import PublicOrderForm from "@/domains/storefront/ui/PublicOrderForm";
import { loadStorefrontCartItems } from "@/domains/storefront/server/request-cart.service";

export const metadata = { title: "Yêu cầu tư vấn" };

export default async function RequestPage({ searchParams }: { searchParams?: Promise<{ product?: string; reference?: string; disposition?: string; added?: string; error?: string }> }) {
  const query = await searchParams;
  const slug = query?.product?.trim() ?? "";
  const initialItems = await loadStorefrontCartItems(slug);
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16"><h1 className="storefront-display text-4xl sm:text-5xl">Yêu cầu tư vấn</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[#66635e]">Chọn sản phẩm và để lại thông tin. Đội ngũ sẽ kiểm tra lại giá, tình trạng và liên hệ xác nhận.</p><div className="mt-10"><PublicOrderForm initialItems={initialItems} initialRequestKey={randomUUID()} submittedReference={query?.reference?.trim()} submittedDisposition={query?.disposition === "MERGED" ? "MERGED" : "CREATED"} submittedAddedItemCount={Math.max(0, Number(query?.added) || 0)} initialError={query?.error?.trim()} /></div></div>;
}
