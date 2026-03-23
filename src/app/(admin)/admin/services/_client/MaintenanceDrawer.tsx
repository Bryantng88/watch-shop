"use client";

import { useEffect, useMemo, useState } from "react";

type VendorOpt = { id: string; name: string };
type TechnicianOpt = { id: string; name: string; email?: string };

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
  technicianId: string | null;
  technicianName: string | null;
  vendorId: string | null;
  vendorName: string | null;
  status: string | null;
};

function fmt(d?: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleString("vi-VN");
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
    technicianId: null,
    technicianName: null,
    vendorId: null,
    vendorName: null,
    status: null,
  });

  const [notes, setNotes] = useState("");
  const [servicedAt, setServicedAt] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");

  const [vendors, setVendors] = useState<VendorOpt[]>([]);
  const [vendorId, setVendorId] = useState<string>("");
  const [pendingVendorId, setPendingVendorId] = useState<string>("");
  const [vendorReason, setVendorReason] = useState<string>("");

  const [technicians, setTechnicians] = useState<TechnicianOpt[]>([]);
  const [technicianId, setTechnicianId] = useState<string>("");
  const [techNote, setTechNote] = useState<string>("");

  const canFetch = open && !!serviceRequestId;

  const fetchAll = async () => {
    if (!serviceRequestId) return;
    setLoading(true);
    try {
      const [mRes, vRes, tRes] = await Promise.all([
        fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, { cache: "no-store" }),
        fetch(`/api/admin/vendors/dropdown`, { cache: "no-store" }),
        fetch(`/api/admin/users/technicians`, { cache: "no-store" }),
      ]);

      const m = await mRes.json();
      const items = Array.isArray(m.items) ? m.items : [];
      setRows(items);

      const sr = m?.sr ?? null;
      setSrMeta({
        technicianId: sr?.technicianId ?? null,
        technicianName: sr?.technicianNameSnap ?? sr?.technician?.name ?? null,
        vendorId: sr?.vendorId ?? null,
        vendorName: sr?.vendorNameSnap ?? sr?.Vendor?.name ?? null,
        status: sr?.status ?? null,
      });

      const vJson = await vRes.json();
      const vItems: VendorOpt[] = Array.isArray(vJson?.items) ? vJson.items : Array.isArray(vJson) ? vJson : [];
      setVendors(vItems);
      setVendorId(sr?.vendorId ?? vItems?.[0]?.id ?? "");
      setPendingVendorId("");
      setVendorReason("");

      const tJson = await tRes.json();
      const tItems: TechnicianOpt[] = Array.isArray(tJson?.items) ? tJson.items : [];
      setTechnicians(tItems);
      setTechnicianId(sr?.technicianId ?? tItems?.[0]?.id ?? "");
      setTechNote("");
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
    setNotes("");
    setServicedAt("");
    setTotalCost("");
    setPendingVendorId("");
    setVendorReason("");
    setTechNote("");
  }, [open, serviceRequestId]);

  const currentTechnicianLabel = useMemo(() => srMeta.technicianName ?? "Chưa gán", [srMeta.technicianName]);
  const currentVendorLabel = useMemo(() => srMeta.vendorName ?? "Chưa chuyển vendor", [srMeta.vendorName]);

  const saveDisabled = loading || (!notes.trim() && !servicedAt && !totalCost);
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
            <div className="mt-1 text-xs text-gray-500">Trạng thái: <span className="font-medium text-gray-700">{srMeta.status ?? "-"}</span></div>
          </div>
          <button className="rounded px-2 py-1 hover:bg-gray-100" onClick={onClose} type="button">✕</button>
        </div>

        <div className="flex-1 space-y-4 overflow-auto p-4">
          <section className="space-y-3 rounded border p-3">
            <div className="text-sm font-semibold">Thợ tiếp nhận</div>
            <div className="text-sm text-gray-600">Hiện tại: <span className="font-medium text-gray-900">{currentTechnicianLabel}</span></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <label className="text-xs text-gray-500">Gán / đổi thợ</label>
                <select className="mt-1 h-10 w-full rounded border px-3 text-sm" value={technicianId} onChange={(e) => setTechnicianId(e.target.value)}>
                  <option value="">-- Chọn thợ --</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}{t.email ? ` • ${t.email}` : ""}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={!technicianId || technicianId === (srMeta.technicianId ?? "") || loading}
                className="h-10 rounded bg-black px-4 text-sm text-white disabled:opacity-50"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/assign-technician`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ technicianId, note: techNote.trim() || null }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Assign technician failed");
                    await fetchAll();
                    onChanged?.();
                  } catch (err: any) {
                    alert(err?.message || "Assign technician failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Gán thợ
              </button>
            </div>
            <textarea
              className="min-h-[72px] w-full rounded border px-3 py-2 text-sm"
              placeholder="Ghi chú giao việc cho thợ (tuỳ chọn)"
              value={techNote}
              onChange={(e) => setTechNote(e.target.value)}
            />
          </section>

          <section className="space-y-3 rounded border p-3">
            <div className="text-sm font-semibold">Vendor ngoài</div>
            <div className="text-sm text-gray-600">Hiện tại: <span className="font-medium text-gray-900">{currentVendorLabel}</span></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <label className="text-xs text-gray-500">Chuyển vendor</label>
                <select className="mt-1 h-10 w-full rounded border px-3 text-sm" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                  <option value="">-- Chọn vendor --</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={!vendorId || vendorId === (srMeta.vendorId ?? "") || loading}
                className="h-10 rounded bg-black px-4 text-sm text-white disabled:opacity-50"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/assign-vendor`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ vendorId, reason: vendorReason.trim() || null }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Assign vendor failed");
                    await fetchAll();
                    onChanged?.();
                  } catch (err: any) {
                    alert(err?.message || "Assign vendor failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Chuyển vendor
              </button>
            </div>
            <textarea
              className="min-h-[72px] w-full rounded border px-3 py-2 text-sm"
              placeholder="Lý do cần outsource / ghi chú cho vendor"
              value={vendorReason}
              onChange={(e) => setVendorReason(e.target.value)}
            />
          </section>

          <section className="space-y-3 rounded border p-3">
            <div className="text-sm font-semibold">Cập nhật maintenance log</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs text-gray-500">Serviced at</label>
                <input type="datetime-local" className="mt-1 h-10 w-full rounded border px-3 text-sm" value={servicedAt} onChange={(e) => setServicedAt(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Chi phí</label>
                <input type="number" className="mt-1 h-10 w-full rounded border px-3 text-sm" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="0" />
              </div>
            </div>
            <textarea className="min-h-[96px] w-full rounded border px-3 py-2 text-sm" placeholder="Note / cập nhật xử lý nội bộ" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={saveDisabled}
                className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        vendorId: srMeta.vendorId,
                        notes: notes.trim() || null,
                        servicedAt: servicedAt ? new Date(servicedAt).toISOString() : null,
                        totalCost: totalCost ? Number(totalCost) : null,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Create maintenance log failed");
                    setNotes("");
                    setServicedAt("");
                    setTotalCost("");
                    await fetchAll();
                    onChanged?.();
                  } catch (err: any) {
                    alert(err?.message || "Create maintenance log failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Lưu log
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
                      body: JSON.stringify({ note: notes.trim() || null }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Complete service failed");
                    setNotes("");
                    setServicedAt("");
                    setTotalCost("");
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
                    <div className="mt-2 text-xs text-gray-500">Serviced at: {fmt(row.servicedAt)} • Chi phí: {row.totalCost != null ? new Intl.NumberFormat("vi-VN").format(Number(row.totalCost)) + " VND" : "-"}</div>
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
