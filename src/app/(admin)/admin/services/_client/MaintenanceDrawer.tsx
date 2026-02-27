"use client";

import { useEffect, useMemo, useState } from "react";

type VendorOpt = { id: string; name: string };

type MaintRow = {
  id: string;
  vendorId: string | null;
  vendorName: string | null;

  notes: string | null;
  servicedAt: string | null;

  totalCost: number | null;
  createdAt: string;
};

type SrMeta = {
  vendorId: string | null;
  vendorName: string | null;
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
  const [srMeta, setSrMeta] = useState<SrMeta>({ vendorId: null, vendorName: null });

  // maintenance NOTE / COST
  const [notes, setNotes] = useState("");
  const [servicedAt, setServicedAt] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");

  // vendors dropdown
  const [vendors, setVendors] = useState<VendorOpt[]>([]);
  const [vendorId, setVendorId] = useState<string>("");

  // pending vendor change (Assign chỉ đánh dấu)
  const [pendingVendorId, setPendingVendorId] = useState<string>("");

  // NEW: lý do đổi vendor (đính vào log CHANGE_VENDOR/ASSIGN_VENDOR => 1 log)
  const [vendorReason, setVendorReason] = useState<string>("");

  const canFetch = open && !!serviceRequestId;

  const currentVendorLabel = useMemo(() => {
    return srMeta.vendorName ?? "Chưa gán vendor";
  }, [srMeta.vendorName]);

  const fetchAll = async () => {
    if (!serviceRequestId) return;

    setLoading(true);
    try {
      const [mRes, vRes] = await Promise.all([
        fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, { cache: "no-store" }),
        fetch(`/api/admin/vendors/dropdown`, { cache: "no-store" }),
      ]);

      const m = await mRes.json();
      const items = m.items ?? [];
      setRows(items);

      // 1) ưu tiên sr meta nếu có
      const srVendorId = m?.sr?.vendorId ?? null;
      const srVendorName = m?.sr?.vendorName ?? null;

      // 2) fallback: lấy vendor từ log mới nhất (items[0] nếu API order desc)
      const latest = items?.[0];
      const fallbackVendorId = latest?.vendorId ?? null;
      const fallbackVendorName = latest?.vendorName ?? null;

      const effectiveVendorId = srVendorId ?? fallbackVendorId ?? null;
      const effectiveVendorName = srVendorName ?? fallbackVendorName ?? null;

      setSrMeta({ vendorId: effectiveVendorId, vendorName: effectiveVendorName });

      const v = await vRes.json();
      const vItems: VendorOpt[] = v.items ?? v ?? [];
      setVendors(vItems);

      const preferred = effectiveVendorId || vItems?.[0]?.id || "";
      setVendorId(preferred);

      // mỗi lần reload: reset pending để đồng bộ
      setPendingVendorId("");
      setVendorReason("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canFetch) return;
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch, serviceRequestId]);

  useEffect(() => {
    if (!open) return;
    setNotes("");
    setServicedAt("");
    setTotalCost("");
    setPendingVendorId("");
    setVendorReason("");
  }, [open, serviceRequestId]);

  // Assign: chỉ mark pending
  const markPendingVendor = () => {
    if (!vendorId) return;
    if (srMeta.vendorId && vendorId === srMeta.vendorId) return;
    setPendingVendorId(vendorId);
  };

  const cancelPendingVendor = () => {
    setPendingVendorId("");
    setVendorReason("");
  };

  /**
   * Save:
   * - Nếu có pendingVendorId => gọi /assign-vendor, gửi reason => backend tạo 1 log CHANGE_VENDOR/ASSIGN_VENDOR (notes gộp)
   * - Nếu có notes/servicedAt/totalCost => gọi /maintenance => nếu totalCost có thì tạo Payment + log
   */
  const submitSaveAll = async () => {
    if (!serviceRequestId) return;

    const wantAssign =
      !!pendingVendorId && (!srMeta.vendorId || pendingVendorId !== srMeta.vendorId);

    const wantMaintenanceLog = !!(notes.trim() || servicedAt || totalCost);

    if (!wantAssign && !wantMaintenanceLog) return;

    setLoading(true);
    try {
      // 1) commit vendor change first (1 log, tường minh)
      if (wantAssign) {
        const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/assign-vendor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId: pendingVendorId,
            reason: vendorReason.trim() || null,
          }),
        });
        if (!res.ok) throw new Error(await res.text());

        // sau khi đổi vendor xong, clear vendorReason
        setVendorReason("");
        setPendingVendorId("");
      }

      // 2) commit maintenance note/cost (nếu có)
      if (wantMaintenanceLog) {
        const effectiveVendorId = (wantAssign ? pendingVendorId : "") || vendorId || null;

        const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId: effectiveVendorId,
            notes: notes.trim() || null,
            servicedAt: servicedAt ? new Date(servicedAt).toISOString() : null,
            totalCost: totalCost ? Number(totalCost) : null,

            // (optional) bạn có thể truyền method/status/... nếu muốn
            // paymentMethod: "CASH",
          }),
        });
        if (!res.ok) throw new Error(await res.text());

        setNotes("");
        setServicedAt("");
        setTotalCost("");
      }

      await fetchAll();
      onChanged?.();
    } finally {
      setLoading(false);
    }
  };

  const saveDisabled =
    loading ||
    (!pendingVendorId && !notes.trim() && !servicedAt && !totalCost && !vendorReason.trim());

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* click outside -> close */}
      <div className="absolute inset-0" onClick={onClose}>
        <div className="absolute inset-0 bg-black/30" />

        <div
          className="absolute right-0 top-0 h-full w-[520px] bg-white shadow-xl border-l flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">Maintenance</div>
              <div className="text-xs text-gray-500 font-mono">{serviceRequestId}</div>
            </div>
            <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={onClose} type="button">
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-auto">
            {/* Vendor block */}
            <div className="border rounded p-3 space-y-3">
              <div className="text-sm font-medium">Vendor</div>

              <div className="rounded border bg-gray-50 px-3 py-2">
                <div className="text-xs text-gray-500">Vendor hiện tại</div>
                <div className="text-sm font-medium">{currentVendorLabel}</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-500">Đổi vendor</div>

                <div className="flex gap-2">
                  <select
                    className="h-9 flex-1 rounded border px-2"
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    disabled={loading}
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="h-9 px-3 rounded bg-black text-white disabled:opacity-50"
                    disabled={!vendorId || loading || (srMeta.vendorId ? vendorId === srMeta.vendorId : false)}
                    onClick={markPendingVendor}
                    type="button"
                  >
                    Assign
                  </button>
                </div>

                {pendingVendorId ? (
                  <div className="space-y-2 rounded border border-amber-200 bg-amber-50 px-3 py-2">
                    <div className="text-xs text-amber-700">
                      Đã chọn đổi vendor. Nhấn <b>Lưu</b> để áp dụng (sẽ tạo log CHANGE_VENDOR/ASSIGN_VENDOR).
                    </div>

                    <textarea
                      className="w-full rounded border p-2 min-h-[70px]"
                      placeholder="Lý do đổi vendor (đính vào log đổi vendor — 1 log)"
                      value={vendorReason}
                      onChange={(e) => setVendorReason(e.target.value)}
                      disabled={loading}
                    />

                    <div className="flex justify-end">
                      <button
                        className="text-xs px-2 py-1 rounded bg-white border hover:bg-gray-50"
                        onClick={cancelPendingVendor}
                        type="button"
                        disabled={loading}
                      >
                        Bỏ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    Assign chỉ đánh dấu. Mọi thao tác kết thúc ở nút <b>Lưu</b>.
                  </div>
                )}
              </div>
            </div>

            {/* Add log */}
            <div className="border rounded p-3 space-y-2">
              <div className="text-sm font-medium">Thêm log</div>

              <textarea
                className="w-full rounded border p-2 min-h-[90px]"
                placeholder="Ghi chú bảo trì..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
              />

              <div className="flex gap-2">
                <input
                  className="h-9 rounded border px-2 flex-1"
                  type="datetime-local"
                  value={servicedAt}
                  onChange={(e) => setServicedAt(e.target.value)}
                  disabled={loading}
                />
                <input
                  className="h-9 rounded border px-2 w-36"
                  type="number"
                  placeholder="Cost"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  disabled={loading}
                />

                <button
                  className="h-9 px-3 rounded bg-black text-white disabled:opacity-50"
                  disabled={saveDisabled}
                  onClick={submitSaveAll}
                  type="button"
                >
                  Lưu
                </button>
              </div>

              <div className="text-xs text-gray-500">
                Nếu nhập <b>Cost</b> → hệ thống tạo <b>Payment</b> và gắn vào maintenance log.
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <div className="text-sm font-semibold">Timeline</div>

              {rows.length === 0 ? (
                <div className="text-sm text-gray-500">Chưa có maintenance log</div>
              ) : (
                <div className="space-y-2">
                  {rows.map((r) => (
                    <div key={r.id} className="border rounded p-3">
                      <div className="flex justify-between gap-2">
                        <div className="text-sm font-medium">{r.vendorName ?? "—"}</div>
                        <div className="text-xs text-gray-500">{fmt(r.servicedAt ?? r.createdAt)}</div>
                      </div>

                      {r.totalCost != null ? (
                        <div className="text-xs text-gray-500 mt-1">
                          Cost: {Number(r.totalCost).toLocaleString("vi-VN")}
                        </div>
                      ) : null}

                      {r.notes ? <div className="text-sm mt-2 whitespace-pre-wrap">{r.notes}</div> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t text-xs text-gray-500">
            Tip: Đổi vendor có lý do → nằm trong cùng 1 log CHANGE_VENDOR/ASSIGN_VENDOR.
          </div>
        </div>
      </div>
    </div>
  );
}