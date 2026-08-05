"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[storefront] public surface failed", error);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-5 py-16 text-center">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#817d76]">Storefront tạm gián đoạn</p>
        <h1 className="storefront-display mt-4 text-4xl">Chưa thể tải bộ sưu tập</h1>
        <p className="mt-4 text-sm leading-7 text-[#706d67]">Vui lòng thử lại sau. Không có yêu cầu đặt hàng nào được gửi trong lúc này.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="storefront-focus min-h-11 bg-[#30302e] px-6 text-xs uppercase tracking-[0.14em] text-white">Thử lại</button>
          <Link href="/products" className="storefront-focus grid min-h-11 place-items-center border border-[#d7d3cb] px-6 text-xs uppercase tracking-[0.14em]">Về bộ sưu tập</Link>
        </div>
      </div>
    </div>
  );
}
