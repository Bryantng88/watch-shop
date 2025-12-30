"use client";

import { useState } from "react";
import QuickPublishModal from "./QuickPublishDemo";
export default function ProductStatusBadge({
    product,
}: {
    product: { id: string; contentStatus: string };
}) {
    const [open, setOpen] = useState(false);

    const color =
        product.contentStatus === "PUBLISHED"
            ? "bg-green-100 text-green-700"
            : product.contentStatus === "DRAFT"
                ? "bg-gray-100 text-gray-600"
                : "bg-gray-100 text-gray-600";

    return (
        <>
            <span
                onClick={() =>
                    product.contentStatus === "DRAFT" && setOpen(true)
                }
                className={`
          inline-block px-2 py-1 rounded text-xs font-medium
          ${color}
          ${product.contentStatus === "DRAFT" ? "cursor-pointer hover:bg-gray-200" : ""}
        `}
                title={
                    product.contentStatus === "DRAFT"
                        ? "Click để xuất bản sản phẩm"
                        : undefined
                }
            >
                {product.contentStatus}
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
