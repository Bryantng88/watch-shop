import PublicOrderForm from "@/domains/storefront/ui/PublicOrderForm";

export const metadata = { title: "Yêu cầu tư vấn" };

export default function RequestPage() {
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16"><h1 className="storefront-display text-4xl sm:text-5xl">Yêu cầu tư vấn</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[#66635e]">Chọn sản phẩm và để lại thông tin. Đội ngũ sẽ kiểm tra lại giá, tình trạng và liên hệ xác nhận.</p><div className="mt-10"><PublicOrderForm /></div></div>;
}
