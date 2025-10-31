"use client";

import { useState } from "react";
import { QuickPublishModal } from "./quick-publish-demo";// component modal ở trên

export default function ProductStatusBadge({
    product,
}: {
    product: { id: string; contentStatus: string; missingCount?: number };
}) {
    const [open, setOpen] = useState(false);

    const isDraft = product.contentStatus === "DRAFT";
    const isPublished = product.contentStatus === "PUBLISHED";

    return (
        <>
            {isDraft ? (
                <>
                    <button
                        onClick={() => setOpen(true)}
                        className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                        title="Nhấn để hoàn tất và Publish"
                    >
                        DRAFT
                    </button>
                    {open && (
                        <QuickPublishModal
                            productId={product.id}
                            onClose={() => setOpen(false)}
                        />
                    )}
                </>
            ) : (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {product.contentStatus}
                </span>
            )}
        </>
    );
}
