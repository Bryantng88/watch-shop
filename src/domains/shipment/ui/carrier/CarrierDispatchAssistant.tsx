"use client";

import { useEffect, useState } from "react";

type Detail = {
  carrierCode?: string | null;
  externalOrderCode?: string | null;
  trackingCode?: string | null;
  carrierStatus?: string | null;
  carrierStatusText?: string | null;
  carrierCharges?: Array<{
    id: string;
    kind: string;
    estimatedAmount?: string | number | null;
    chargedAmount?: string | number | null;
    settlementStatus: string;
  }>;
};

type Action = "quote" | "create" | "sync";
const carrierCode = "VIETTEL_POST";
const formatMoney = (value: unknown) => new Intl.NumberFormat("vi-VN").format(Number(value ?? 0));

export default function CarrierDispatchAssistant({
  shipmentId,
  onApply,
}: {
  shipmentId: string;
  onApply: (fields: { amount?: string; carrier?: string; trackingCode?: string }) => void;
}) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [busy, setBusy] = useState<Action | "load" | null>("load");
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const response = await fetch(`/api/admin/shipments/${shipmentId}/carrier`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Không tải được thông tin vận chuyển");
    setDetail(payload);
    return payload as Detail;
  }

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/shipments/${shipmentId}/carrier`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Không tải được thông tin vận chuyển");
        if (active) setDetail(payload);
      })
      .catch((error) => active && setMessage(error instanceof Error ? error.message : "Không tải được thông tin vận chuyển"))
      .finally(() => active && setBusy(null));
    return () => { active = false; };
  }, [shipmentId]);

  function applyFromDetail(next: Detail) {
    const shipping = next.carrierCharges?.find((charge) => charge.kind === "SHIPPING");
    onApply({
      carrier: carrierCode,
      ...(shipping ? { amount: String(shipping.chargedAmount ?? shipping.estimatedAmount ?? 0) } : {}),
      ...(next.trackingCode || next.externalOrderCode ? { trackingCode: next.trackingCode ?? next.externalOrderCode ?? "" } : {}),
    });
  }

  async function run(action: Action) {
    setBusy(action);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/shipments/${shipmentId}/carrier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, carrierCode }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Không thể xử lý vận chuyển");
      if (action === "quote") {
        onApply({ amount: String(payload.shippingFee ?? 0), carrier: carrierCode });
        setMessage(`Cước ${formatMoney(payload.shippingFee)}đ · bảo hiểm ${formatMoney(payload.insuranceFee)}đ`);
        setDetail(await load());
      } else {
        setDetail(payload);
        applyFromDetail(payload);
        setMessage(action === "create" ? "Đã tạo vận đơn Viettel Post test và điền mã vận đơn." : "Đã đồng bộ tracking.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể xử lý vận chuyển");
    } finally {
      setBusy(null);
    }
  }

  return <section className="rounded-xl border border-violet-200 bg-violet-50/60 p-3">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-sm font-bold text-slate-900">Viettel Post API · Development</p><p className="mt-0.5 text-xs text-slate-500">Báo giá và tạo vận đơn test ngay trong bước bàn giao.</p></div>
      <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-violet-700">{detail?.carrierStatus ?? "CHƯA TẠO"}</span>
    </div>
    {detail?.externalOrderCode ? <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs"><span className="text-slate-400">Mã test: </span><strong className="break-all text-slate-800">{detail.externalOrderCode}</strong>{detail.carrierStatusText ? <p className="mt-1 text-slate-500">{detail.carrierStatusText}</p> : null}</div> : null}
    <div className="mt-3 grid grid-cols-3 gap-2">
      <button type="button" disabled={Boolean(busy)} onClick={() => run("quote")} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 disabled:opacity-50">{busy === "quote" ? "Đang báo giá…" : "Lấy báo giá"}</button>
      <button type="button" disabled={Boolean(busy) || Boolean(detail?.externalOrderCode)} onClick={() => run("create")} className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{busy === "create" ? "Đang tạo…" : "Tạo vận đơn test"}</button>
      <button type="button" disabled={Boolean(busy) || !detail?.externalOrderCode} onClick={() => run("sync")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50">Đồng bộ tracking</button>
    </div>
    {message ? <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-slate-600">{message}</p> : null}
  </section>;
}
