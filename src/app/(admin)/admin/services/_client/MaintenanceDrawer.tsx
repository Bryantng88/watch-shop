"use client";

import { useEffect, useMemo, useState } from "react";

type VendorOpt = { id: string; name: string };
type ServiceCatalogOpt = { id: string; code?: string | null; name: string; vendorPrice?: number | null; customerPrice?: number | null; internalCost?: number | null; defaultPrice?: number | null };

type MaintRow = {
  id: string;
  eventType?: string | null;
  technicianId?: string | null;
  technicianName?: string | null;
  vendorId?: string | null;
  vendorName?: string | null;
  notes: string | null;
  servicedAt: string | null;
  totalCost: number | null;
  createdAt: string;
};

type SrMeta = {
  vendorId: string | null;
  vendorName: string | null;
  status: string | null;
};

function fmt(d?: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleString("vi-VN");
}

function fmtMoney(value?: number | null) {
  if (value == null) return "-";
  return `${new Intl.NumberFormat("vi-VN").format(Number(value))} VND`;
}

export default function MaintenanceDrawer({
  open,
  onClose,
  serviceRequestId,
  onChanged,
}: {
  open: boolean;
  onClose: () => void;
  serviceRequestId: string;
  onChanged?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<MaintRow[]>([]);
  const [srMeta, setSrMeta] = useState<SrMeta>({
    vendorId: null,
    vendorName: null,
    status: null,
  });

  const [vendors, setVendors] = useState<VendorOpt[]>([]);
  const [catalogs, setCatalogs] = useState<ServiceCatalogOpt[]>([]);
  const [source, setSource] = useState<"INTERNAL"|"EXTERNAL">("INTERNAL");
  const [serviceCatalogId, setServiceCatalogId] = useState<string>("");
  const [vendorId, setVendorId] = useState<string>("");
  const [vendorNotes, setVendorNotes] = useState<string>("");
  const [vendorServicedAt, setVendorServicedAt] = useState<string>("");
  const [vendorTotalCost, setVendorTotalCost] = useState<string>("");

  const canFetch = open && !!serviceRequestId;

  const fetchAll = async () => {
    if (!serviceRequestId) return;
    setLoading(true);
    try {
      const [mRes, vRes, cRes] = await Promise.all([
        fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, { cache: "no-store" }),
        fetch(`/api/admin/vendors/dropdown`, { cache: "no-store" }),
        fetch(`/api/admin/service-catalog`, { cache: "no-store" }),
      ]);

      const m = await mRes.json();
      const items = Array.isArray(m.items) ? m.items : [];
      setRows(items);

      const sr = m?.sr ?? null;
      setSrMeta({
        vendorId: sr?.vendorId ?? null,
        vendorName: sr?.vendorNameSnap ?? sr?.Vendor?.name ?? null,
        status: sr?.status ?? null,
      });

      const vJson = await vRes.json();
      const vItems: VendorOpt[] = Array.isArray(vJson?.items) ? vJson.items : Array.isArray(vJson) ? vJson : [];
      setVendors(vItems);
      setVendorId(sr?.vendorId ?? vItems?.[0]?.id ?? "");
      const cJson = await cRes.json();
      const cItems: ServiceCatalogOpt[] = Array.isArray(cJson?.items) ? cJson.items : [];
      setCatalogs(cItems);
      setServiceCatalogId(sr?.servicecatalogid ?? cItems?.[0]?.id ?? "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canFetch) return;
    fetchAll();
  }, [canFetch, serviceRequestId]);

  useEffect(() => {
    if (!open) return;
    setVendorNotes("");
    setVendorServicedAt(new Date().toISOString().slice(0,16));
    setVendorTotalCost("");
  }, [open, serviceRequestId]);

  const currentVendorLabel = useMemo(() => srMeta.vendorName ?? "Chưa chuyển vendor", [srMeta.vendorName]);
  const vendorChanged = !!vendorId && vendorId !== (srMeta.vendorId ?? "");
  const hasVendorPayload = !!vendorNotes.trim() || !!vendorServicedAt || !!vendorTotalCost;
  const saveVendorDisabled = loading || (source === "EXTERNAL" && !vendorId) || (!vendorChanged && !hasVendorPayload && !serviceCatalogId);
  const canComplete = !loading && srMeta.status !== "COMPLETED" && srMeta.status !== "DELIVERED" && srMeta.status !== "CANCELED";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-[560px] flex-col border-l bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <div className="text-lg font-semibold">Maintenance</div>
            <div className="font-mono text-xs text-gray-500">{serviceRequestId}</div>
            <div className="mt-1 text-xs text-gray-500">
              Trạng thái: <span className="font-medium text-gray-700">{srMeta.status ?? "-"}</span>
            </div>
          </div>
          <button className="rounded px-2 py-1 hover:bg-gray-100" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-auto p-4">
          <section className="space-y-3 rounded border p-3">
            <div className="text-sm font-semibold">Phương án xử lý</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                <input type="radio" checked={source === "INTERNAL"} onChange={() => setSource("INTERNAL")} /> Nội bộ
              </label>
              <label className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                <input type="radio" checked={source === "EXTERNAL"} onChange={() => setSource("EXTERNAL")} /> Vendor ngoài
              </label>
            </div>
            <div>
              <label className="text-xs text-gray-500">Hạng mục service</label>
              <select className="mt-1 h-10 w-full rounded border px-3 text-sm" value={serviceCatalogId} onChange={(e) => {
                const nextId = e.target.value;
                setServiceCatalogId(nextId);
                const picked = catalogs.find((x) => x.id === nextId);
                if (picked && !vendorTotalCost) {
                  const preset = source === "EXTERNAL" ? (picked.vendorPrice ?? picked.defaultPrice ?? null) : (picked.internalCost ?? 0);
                  if (preset != null) setVendorTotalCost(String(preset));
                }
              }}>
                <option value="">-- Chọn hạng mục --</option>
                {catalogs.map((c) => <option key={c.id} value={c.id}>{c.code ? `${c.code} · ` : ""}{c.name}</option>)}
              </select>
            </div>
          </section>

          <section className="space-y-3 rounded border p-3">
            <div className="text-sm font-semibold">Vendor ngoài</div>
            <div className="text-sm text-gray-600">
              Hiện tại: <span className="font-medium text-gray-900">{currentVendorLabel}</span>
            </div>

            <div>
              <label className="text-xs text-gray-500">Chuyển / cập nhật vendor</label>
              <select
                className="mt-1 h-10 w-full rounded border px-3 text-sm disabled:bg-gray-100"
                value={vendorId}
                disabled={source !== "EXTERNAL"}
                onChange={(e) => setVendorId(e.target.value)}
              >
                <option value="">-- Chọn vendor --</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs text-gray-500">Ngày xử lý</label>
                <input
                  type="datetime-local"
                  className="mt-1 h-10 w-full rounded border px-3 text-sm"
                  value={vendorServicedAt}
                  onChange={(e) => setVendorServicedAt(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Chi phí vendor</label>
                <input
                  type="number"
                  className="mt-1 h-10 w-full rounded border px-3 text-sm"
                  value={vendorTotalCost}
                  onChange={(e) => setVendorTotalCost(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Nội dung / ghi chú vendor</label>
              <textarea
                className="mt-1 min-h-[96px] w-full rounded border px-3 py-2 text-sm"
                placeholder="Mô tả công việc, phát sinh, ghi chú từ vendor..."
                value={vendorNotes}
                onChange={(e) => setVendorNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={saveVendorDisabled}
                className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/assign-vendor`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        source,
                        serviceCatalogId: serviceCatalogId || null,
                        vendorId: source === "EXTERNAL" ? vendorId : null,
                        notes: vendorNotes.trim() || null,
                        servicedAt: vendorServicedAt ? new Date(vendorServicedAt).toISOString() : null,
                        totalCost: vendorTotalCost ? Number(vendorTotalCost) : null,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Update vendor failed");
                    setVendorNotes("");
                    setVendorServicedAt("");
                    setVendorTotalCost("");
                    await fetchAll();
                    onChanged?.();
                  } catch (err: any) {
                    alert(err?.message || "Update vendor failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Lưu cập nhật vendor
              </button>
              <button
                type="button"
                disabled={!canComplete}
                className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/complete`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ note: vendorNotes.trim() || null }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Complete service failed");
                    setVendorNotes("");
                    setVendorServicedAt("");
                    setVendorTotalCost("");
                    await fetchAll();
                    onChanged?.();
                  } catch (err: any) {
                    alert(err?.message || "Complete service failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Kết thúc service
              </button>
            </div>
          </section>

          <section className="space-y-3 rounded border p-3">
            <div className="text-sm font-semibold">Lịch sử maintenance</div>
            {rows.length === 0 ? (
              <div className="text-sm text-gray-500">Chưa có log nào</div>
            ) : (
              <div className="space-y-3">
                {rows.map((row) => (
                  <div key={row.id} className="rounded border p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{row.eventType || "NOTE"}</div>
                      <div className="text-xs text-gray-500">{fmt(row.createdAt)}</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Thợ: {row.technicianName || "-"} • Vendor: {row.vendorName || "-"}
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-gray-700">{row.notes || "-"}</div>
                    <div className="mt-2 text-xs text-gray-500">
                      Ngày xử lý: {fmt(row.servicedAt)} • Chi phí: {fmtMoney(row.totalCost)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
