import PublicOrderForm from "@/domains/storefront/ui/PublicOrderForm";
import { getPublicWatchBySlug } from "@/domains/storefront/server";

export const metadata = { title: "Yêu cầu tư vấn" };

export default async function RequestPage({ searchParams }: { searchParams?: Promise<{ product?: string }> }) {
  const slug = (await searchParams)?.product?.trim() ?? "";
  const watch = slug ? await getPublicWatchBySlug(slug).catch(() => null) : null;
  const initialItem = watch ? {
    productId: watch.productId,
    slug: watch.slug,
    title: watch.title,
    imageUrl: watch.image.url,
  } : null;
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16"><h1 className="storefront-display text-4xl sm:text-5xl">Yêu cầu tư vấn</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[#66635e]">Chọn sản phẩm và để lại thông tin. Đội ngũ sẽ kiểm tra lại giá, tình trạng và liên hệ xác nhận.</p><div className="mt-10"><PublicOrderForm initialItem={initialItem} /></div></div>;
}
