import { WifiOff } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Đang offline", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-5 py-16 text-center"><div><WifiOff className="mx-auto h-9 w-9 text-[#77746f]" /><p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#817d76]">Chế độ chỉ đọc</p><h1 className="storefront-display mt-4 text-4xl">Bạn đang offline</h1><p className="mt-4 text-sm leading-7 text-[#706d67]">Giá và tình trạng đồng hồ cần được kiểm tra trực tuyến. Không có yêu cầu nào được gửi khi đang offline.</p><Link href="/products" className="storefront-focus mt-7 inline-grid min-h-11 place-items-center border border-[#d7d3cb] px-6 text-xs uppercase tracking-[0.14em]">Thử tải lại</Link></div></div>;
}
