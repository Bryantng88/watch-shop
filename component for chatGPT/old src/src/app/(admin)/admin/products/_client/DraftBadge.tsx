"use client";

import { useState } from "react";
import QuickPublishModal from "./QuickPublishDemo";
export default function ProductStatusBadge({
    product,
}: {
    product: { id: string; status: string };
}) {
    const [open, setOpen] = useState(false);

    const color =
        product.status === "PUBLISHED"
            ? "bg-green-100 text-green-700"
            : product.status === "DRAFT"
                ? "bg-gray-100 text-gray-600"
                : "bg-gray-100 text-gray-600";

    return (
        <>
            <span
                onClick={() =>
                    product.status === "DRAFT" && setOpen(true)
                }
                className={`
          inline-block px-2 py-1 rounded text-xs font-medium
          ${color}
          ${product.status === "DRAFT" ? "cursor-pointer hover:bg-gray-200" : ""}
        `}
                title={
                    product.status === "DRAFT"
                        ? "Click để xuất bản sản phẩm"
                        : undefined
                }
            >
                {product.status}
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
