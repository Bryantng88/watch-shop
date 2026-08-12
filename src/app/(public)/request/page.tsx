import { randomUUID } from "node:crypto";
import PublicOrderForm from "@/domains/storefront/ui/PublicOrderForm";
import { loadStorefrontCartItems } from "@/domains/storefront/server/request-cart.service";
import { cookies } from "next/headers";

export const metadata = { title: "Yêu cầu tư vấn" };

export default async function RequestPage({ searchParams }: { searchParams?: Promise<{ product?: string; reference?: string; disposition?: string; added?: string; error?: string }> }) {
  const query = await searchParams;
  const slug = query?.product?.trim() ?? "";
  const locale = (await cookies()).get("vintic-locale")?.value === "en" ? "en" : "vi";
  const initialItems = await loadStorefrontCartItems(slug);
  return <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 lg:py-12"><div className="max-w-3xl"><p className="text-[10px] uppercase tracking-[0.24em] text-[#8b867f]">Vintic concierge</p><h1 className="storefront-display mt-3 text-4xl leading-tight sm:text-5xl">{locale === "en" ? "A personal watch consultation" : "Tư vấn dành riêng cho bạn"}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[#66635e]">{locale === "en" ? "Share your selection and contact details. Our team will personally reconfirm price, condition and availability." : "Gửi lựa chọn và thông tin liên hệ. Đội ngũ sẽ trực tiếp kiểm tra lại giá, tình trạng và khả năng cung cấp."}</p></div><div className="mt-9"><PublicOrderForm initialItems={initialItems} initialRequestKey={randomUUID()} submittedReference={query?.reference?.trim()} submittedDisposition={query?.disposition === "MERGED" ? "MERGED" : "CREATED"} submittedAddedItemCount={Math.max(0, Number(query?.added) || 0)} initialError={query?.error?.trim()} /></div></div>;
}
