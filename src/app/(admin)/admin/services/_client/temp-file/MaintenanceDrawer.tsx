"use client";

import { useEffect, useMemo, useState } from "react";

type VendorOpt = { id: string; name: string };
type ServiceCatalogOpt = { id: string; code: string | null; name: string; vendorPrice?: number | null; customerPrice?: number | null; internalCost?: number | null; note?: string | null; };
type ProductImage = { fileKey: string; role?: string | null };
type MaintRow = {
  id: string;
  eventType: string | null;
  technicianId?: string | null;
  technicianNameSnap?: string | null;
  vendorId?: string | null;
  vendorName?: string | null;
  notes: string | null;
  diagnosis?: string | null;
  workSummary?: string | null;
  processingMode?: string | null;
  imageFileKey?: string | null;
  serviceCatalogId?: string | null;
  servicedAt: string | null;
  totalCost: number | null;
  createdAt: string;
  ServiceCatalog?: { id: string; code: string | null; name: string } | null;
};

type SrMeta = {
  vendorId: string | null;
  vendorName: string | null;
  status: string | null;
  effectivePrimaryImage?: string | null;
  productImages?: ProductImage[];
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
  const [srMeta, setSrMeta] = useState<SrMeta>({ vendorId: null, vendorName: null, status: null, effectivePrimaryImage: null, productImages: [] });

  const [vendors, setVendors] = useState<VendorOpt[]>([]);
  const [serviceCatalogs, setServiceCatalogs] = useState<ServiceCatalogOpt[]>([]);
  const [vendorId, setVendorId] = useState<string>("");
  const [vendorServicedAt, setVendorServicedAt] = useState<string>("");
  const [vendorTotalCost, setVendorTotalCost] = useState<string>("");
  const [processingMode, setProcessingMode] = useState<"INTERNAL" | "EXTERNAL">("INTERNAL");
  const [diagnosis, setDiagnosis] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [serviceCatalogId, setServiceCatalogId] = useState("");
  const [imageFileKey, setImageFileKey] = useState("");

  const canFetch = open && !!serviceRequestId;

  const fetchAll = async () => {
    if (!serviceRequestId) return;
    setLoading(true);
    try {
      const [mRes, vRes] = await Promise.all([
        fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, { cache: "no-store" }),
        fetch(`/api/admin/vendors/dropdown`, { cache: "no-store" }),
      ]);

      const m = await mRes.json();
      const items = Array.isArray(m.items) ? m.items : [];
      setRows(items);

      const sr = m?.sr ?? null;
      setSrMeta({
        vendorId: sr?.vendorId ?? null,
        vendorName: sr?.vendorNameSnap ?? sr?.Vendor?.name ?? null,
        status: sr?.status ?? null,
        effectivePrimaryImage: sr?.effectivePrimaryImage ?? null,
        productImages: Array.isArray(sr?.productImages) ? sr.productImages : [],
      });

      setServiceCatalogs(Array.isArray(m?.serviceCatalogs) ? m.serviceCatalogs : []);
      setImageFileKey(sr?.effectivePrimaryImage ?? "");

      const vJson = await vRes.json();
      const vItems: VendorOpt[] = Array.isArray(vJson?.items) ? vJson.items : Array.isArray(vJson) ? vJson : [];
      setVendors(vItems);
      setVendorId(sr?.vendorId ?? vItems?.[0]?.id ?? "");
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
    setVendorServicedAt("");
    setVendorTotalCost("");
    setDiagnosis("");
    setWorkSummary("");
    setServiceCatalogId("");
    setProcessingMode("INTERNAL");
  }, [open, serviceRequestId]);

  const currentVendorLabel = useMemo(() => srMeta.vendorName ?? "Chưa chuyển vendor", [srMeta.vendorName]);
  const canComplete = !loading && srMeta.status !== "COMPLETED" && srMeta.status !== "DELIVERED" && srMeta.status !== "CANCELED";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-[640px] flex-col border-l bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <div className="text-lg font-semibold">Maintenance</div>
            <div className="font-mono text-xs text-gray-500">{serviceRequestId}</div>
            <div className="mt-1 text-xs text-gray-500">
              Trạng thái: <span className="font-medium text-gray-700">{srMeta.status ?? "-"}</span>
            </div>
          </div>
          <button className="rounded px-2 py-1 hover:bg-gray-100" onClick={onClose} type="button">✕</button>
        </div>

        <div className="flex-1 space-y-4 overflow-auto p-4">
          <section className="space-y-4 rounded border p-4">
            <div className="text-sm font-semibold">Xử lý kỹ thuật nội bộ</div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                <input type="radio" checked={processingMode === "INTERNAL"} onChange={() => setProcessingMode("INTERNAL")} />
                Nội bộ
              </label>

              <label className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                <input type="radio" checked={processingMode === "EXTERNAL"} onChange={() => setProcessingMode("EXTERNAL")} />
                Chuyển vendor ngoài
              </label>
            </div>

            <div>
              <label className="text-xs text-gray-500">Hạng mục kỹ thuật</label>
              <select className="mt-1 h-10 w-full rounded border px-3 text-sm" value={serviceCatalogId} onChange={(e) => setServiceCatalogId(e.target.value)}>
                <option value="">-- Chọn hạng mục --</option>
                {serviceCatalogs.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code ? `${item.code} - ${item.name}` : item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Chẩn đoán kỹ thuật</label>
              <textarea className="mt-1 min-h-[88px] w-full rounded border px-3 py-2 text-sm" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Mô tả tình trạng, nguyên nhân, nhận định kỹ thuật..." />
            </div>

            <div>
              <label className="text-xs text-gray-500">Hướng xử lý / ghi chú</label>
              <textarea className="mt-1 min-h-[88px] w-full rounded border px-3 py-2 text-sm" value={workSummary} onChange={(e) => setWorkSummary(e.target.value)} placeholder="Cách xử lý dự kiến, nội dung thực hiện..." />
            </div>

            <div>
              <label className="text-xs text-gray-500">Ảnh máy / movement</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(srMeta.productImages ?? []).map((img) => {
                  const active = imageFileKey === img.fileKey;
                  return (
                    <button key={img.fileKey} type="button" onClick={() => setImageFileKey(img.fileKey)} className={`rounded-lg border p-1 ${active ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`}>
                      <img src={`/api/media/sign?key=${encodeURIComponent(img.fileKey)}`} alt="movement" className="h-16 w-16 rounded object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            {processingMode === "EXTERNAL" ? (
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="text-sm font-medium text-amber-900">Vendor ngoài</div>
                <div className="text-sm text-gray-600">Hiện tại: <span className="font-medium text-gray-900">{currentVendorLabel}</span></div>
                <select className="h-10 w-full rounded border px-3 text-sm" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                  <option value="">-- Chọn vendor --</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input type="datetime-local" className="h-10 w-full rounded border px-3 text-sm" value={vendorServicedAt} onChange={(e) => setVendorServicedAt(e.target.value)} />
                  <input type="number" className="h-10 w-full rounded border px-3 text-sm" value={vendorTotalCost} onChange={(e) => setVendorTotalCost(e.target.value)} placeholder="Chi phí vendor" />
                </div>
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <button type="button" className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50" disabled={loading} onClick={async () => {
                try {
                  setLoading(true);
                  const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      processingMode,
                      vendorId: processingMode === 'EXTERNAL' ? vendorId : null,
                      diagnosis,
                      workSummary,
                      notes: workSummary,
                      serviceCatalogId: serviceCatalogId || null,
                      imageFileKey: imageFileKey || null,
                      servicedAt: processingMode === 'EXTERNAL' && vendorServicedAt ? new Date(vendorServicedAt).toISOString() : new Date().toISOString(),
                      totalCost: processingMode === 'EXTERNAL' && vendorTotalCost ? Number(vendorTotalCost) : 0,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error || 'Lưu maintenance failed');
                  setDiagnosis('');
                  setWorkSummary('');
                  await fetchAll();
                  onChanged?.();
                } catch (err: any) {
                  alert(err?.message || 'Lưu maintenance failed');
                } finally {
                  setLoading(false);
                }
              }}>Lưu log kỹ thuật</button>

              <button type="button" disabled={!canComplete} className="rounded border px-3 py-2 text-sm disabled:opacity-50" onClick={async () => {
                try {
                  setLoading(true);
                  const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ note: workSummary.trim() || null }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error || 'Complete service failed');
                  await fetchAll();
                  onChanged?.();
                } catch (err: any) {
                  alert(err?.message || 'Complete service failed');
                } finally {
                  setLoading(false);
                }
              }}>Kết thúc service</button>
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
                      <div className="font-medium">{row.ServiceCatalog?.name || row.eventType || 'NOTE'}</div>
                      <div className="text-xs text-gray-500">{fmt(row.createdAt)}</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Mode: {row.processingMode || '-'}{row.imageFileKey ? ' · Có ảnh máy' : ''}</div>
                    {row.diagnosis ? <div className="mt-2"><span className="font-medium">Chẩn đoán:</span> {row.diagnosis}</div> : null}
                    {row.workSummary ? <div className="mt-1"><span className="font-medium">Xử lý:</span> {row.workSummary}</div> : null}
                    {row.notes ? <div className="mt-1"><span className="font-medium">Ghi chú:</span> {row.notes}</div> : null}
                    <div className="mt-2 text-xs text-gray-500">Chi phí: {fmtMoney(row.totalCost)} · Ngày xử lý: {fmt(row.servicedAt)}</div>
                    {row.imageFileKey ? (
                      <div className="mt-3">
                        <img src={`/api/media/sign?key=${encodeURIComponent(row.imageFileKey)}`} alt="maintenance" className="h-20 w-20 rounded border object-cover" />
                      </div>
                    ) : null}
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
