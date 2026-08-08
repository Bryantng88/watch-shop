"use client";

import { Loader2, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

import OrderFormClient from "@/domains/order/client/OrderFormClient";
import type { OrderFormInitialData, ServiceOption } from "@/domains/order/ui/form";

type Props = {
  requestId: string | null;
  reference?: string | null;
  onClose: () => void;
  onCompleted: (orderId: string) => void;
};

export default function PurchaseRequestOrderModal({ requestId, reference, onClose, onCompleted }: Props) {
  const [initialData, setInitialData] = useState<OrderFormInitialData | null>(null);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setInitialData(null);
    void fetch(`/api/admin/purchase-requests/${encodeURIComponent(requestId)}/order-form`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    }).then(async (response) => {
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || "Không thể tải form lập đơn hàng.");
      setInitialData(result.initialData ?? null);
      setServices(Array.isArray(result.services) ? result.services : []);
    }).catch((loadError) => {
      if (loadError instanceof DOMException && loadError.name === "AbortError") return;
      setError(loadError instanceof Error ? loadError.message : "Không thể tải form lập đơn hàng.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [requestId]);

  if (!requestId) return null;

  return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
    <section className="flex max-h-[96vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-900/10">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600"><ShoppingCart className="h-4 w-4" /> Lập đơn từ yêu cầu</div>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Đầy đủ nghiệp vụ đơn hàng</h2>
          <p className="mt-1 text-sm text-slate-500">{reference} · Chỉnh giá thương lượng, giao nhận, dịch vụ và phụ kiện trước khi lưu.</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Đóng"><X className="h-5 w-5" /></button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {loading ? <div className="flex min-h-[360px] items-center justify-center gap-3 text-sm font-medium text-slate-500"><Loader2 className="h-5 w-5 animate-spin" />Đang nạp dữ liệu yêu cầu và danh mục...</div> : null}
        {error ? <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {!loading && !error && initialData ? <OrderFormClient mode="create" surface="modal" createSubmitAs="DRAFT" initialData={initialData} services={services} purchaseRequestId={requestId} onCancel={onClose} onCompleted={(orderId) => onCompleted(orderId)} /> : null}
      </div>
    </section>
  </div>;
}
