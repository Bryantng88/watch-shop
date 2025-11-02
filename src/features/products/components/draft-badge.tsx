"use client";
import { useState } from "react";
import QuickPublishModal from "./quick-publish-demo";
import { Plus } from "lucide-react";

export default function ProductStatusBadge({
    product,
}: { product: { id: string; contentStatus: string } }) {
    const [open, setOpen] = useState(false);

    // Nếu KHÔNG phải DRAFT → badge bình thường
    if (product.contentStatus !== "DRAFT") {
        const color =
            product.contentStatus === "PUBLISHED"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600";
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
                {product.contentStatus}
            </span>
        );
    }

    // Nếu là DRAFT → hiển thị nhắc “Bổ sung thông tin”
    return (
        <>
            <span
                onClick={() => setOpen(true)}
                title="Bổ sung thông tin để xuất bản sản phẩm"
                className="
          inline-flex items-center gap-1.5
          px-2 py-1 text-[11px] font-medium text-black-700
          cursor-pointer hover:bg-red-100 transition
        "
            >

                <span className="flex items-center gap-1 text-red-700 font-normal">
                    Cần bổ sung thông tin
                </span>
            </span>

            {open && (
                <QuickPublishModal
                    productId={product.id}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
