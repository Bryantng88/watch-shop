"use client";

import { useEffect, useState } from "react";
import SlideOverPanel from "./SlideOverPanel";
import ServiceHistoryTable, { type ServiceHistoryRow } from "./ServiceHistoryTable";

type ProductLite = { id: string; title?: string | null; openServiceStatus?: string | null } | null;

type ApiResponse = {
    product?: { id: string; title?: string | null } | null;
    items?: ServiceHistoryRow[];
};

export default function ServiceHistoryModal({
    product,
    open,
    onClose,
}: {
    product: ProductLite;
    open: boolean;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<ServiceHistoryRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !product?.id) return;

        let ignore = false;
        setLoading(true);
        setError(null);

        fetch(`/api/admin/products/${product.id}/service-history`, { cache: "no-store" })
            .then(async (res) => {
                const data = (await res.json().catch(() => null)) as ApiResponse | null;
                if (!res.ok) throw new Error((data as any)?.error || "Không tải được lịch sử service");
                if (!ignore) setRows(Array.isArray(data?.items) ? data!.items! : []);
            })
            .catch((e: any) => {
                if (!ignore) setError(e?.message || "Không tải được lịch sử service");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [open, product?.id]);

    return (
        <SlideOverPanel
            open={open}
            onClose={onClose}
            title="Lịch sử service"
            subtitle={product?.title || null}
        >
            {product?.openServiceStatus ? (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                    Sản phẩm hiện đang có service mở với trạng thái <b>{product.openServiceStatus}</b>.
                </div>
            ) : null}

            {loading ? <div className="text-sm text-gray-500">Đang tải lịch sử service…</div> : null}
            {error ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
            {!loading && !error ? <ServiceHistoryTable rows={rows} /> : null}
        </SlideOverPanel>
    );
}
