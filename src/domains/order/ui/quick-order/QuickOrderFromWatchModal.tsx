"use client";

import { useEffect, useState } from "react";
import { Loader2, ShoppingCart, X } from "lucide-react";

import OrderFormClient from "@/domains/order/client/OrderFormClient";
import type {
    QuickOrderProduct,
    ServiceOption,
} from "@/domains/order/ui/form";

type Props = {
    productId: string | null;
    title?: string | null;
    onClose: () => void;
    onCompleted: (
        orderId: string,
        inventoryOutcomes: Array<{
            productId: string;
            fromSaleStage: string | null;
            toSaleStage: "HOLD";
        }>,
    ) => void;
};

export default function QuickOrderFromWatchModal({
    productId,
    title,
    onClose,
    onCompleted,
}: Props) {
    const [quickProduct, setQuickProduct] = useState<QuickOrderProduct | null>(null);
    const [services, setServices] = useState<ServiceOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) return;
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        setQuickProduct(null);
        void fetch(
            `/api/admin/orders/quick-form?productId=${encodeURIComponent(productId)}`,
            { signal: controller.signal, headers: { Accept: "application/json" } },
        )
            .then(async (response) => {
                const result = await response.json().catch(() => null);
                if (!response.ok) {
                    throw new Error(result?.error || "Không thể tải form tạo đơn hàng.");
                }
                setQuickProduct(result.quickProduct ?? null);
                setServices(Array.isArray(result.services) ? result.services : []);
            })
            .catch((loadError) => {
                if (loadError instanceof DOMException && loadError.name === "AbortError") return;
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Không thể tải form tạo đơn hàng.",
                );
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [productId]);

    if (!productId) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4">
            <section className="flex max-h-[94vh] w-full max-w-[1450px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-900/10">
                <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
                            <ShoppingCart className="h-4 w-4" />
                            Order domain
                        </div>
                        <h2 className="mt-1 text-xl font-semibold text-slate-950">
                            Tạo đơn hàng từ Watch
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">{title || "Watch đang chọn"}</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    {loading ? (
                        <div className="flex min-h-[360px] items-center justify-center gap-3 text-sm font-medium text-slate-500">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Đang tải dữ liệu Watch và Order...
                        </div>
                    ) : error ? (
                        <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : quickProduct ? (
                        <OrderFormClient
                            mode="create"
                            surface="modal"
                            initialData={null}
                            services={services}
                            quickProduct={quickProduct}
                            onCancel={onClose}
                            onCompleted={onCompleted}
                        />
                    ) : null}
                </div>
            </section>
        </div>
    );
}
