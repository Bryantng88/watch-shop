"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { createQuickVendor } from "@/domains/vendor/client/vendor.actions";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import type { AcquisitionFormVendor } from "./form/acquisition-form.types";

type ClaspType =
  | "PIN_BUCKLE"
  | "DEPLOYANT"
  | "FOLDING"
  | "BRACELET_CLASP"
  | "OTHER";
type Line = {
  id: string;
  claspType: ClaspType;
  widthMM: number;
  originType: "OEM" | "AFTERMARKET";
  brandName: string;
  color: string;
  finish: string;
  quantity: number;
  unitCost: number;
  sellPrice: number;
};
const CLASP_TYPES: Array<[ClaspType, string]> = [
  ["PIN_BUCKLE", "Khóa kim"],
  ["DEPLOYANT", "Khóa bướm"],
  ["FOLDING", "Khóa gập"],
  ["BRACELET_CLASP", "Khóa dây thép"],
  ["OTHER", "Khác"],
];
const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100";
const fresh = (): Line => ({
  id: crypto.randomUUID(),
  claspType: "PIN_BUCKLE",
  widthMM: 18,
  originType: "AFTERMARKET",
  brandName: "",
  color: "",
  finish: "",
  quantity: 1,
  unitCost: 0,
  sellPrice: 0,
});
function titleOf(line: Line) {
  const type =
    CLASP_TYPES.find(([value]) => value === line.claspType)?.[1] ?? "Khóa";
  return [
    type,
    line.originType === "OEM"
      ? `chính hãng ${line.brandName.trim()}`
      : "linh kiện",
    line.color.trim().toLowerCase(),
    `${line.widthMM}mm`,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function ClaspAcquisitionFormClient({
  vendors: initial,
  embedded = false,
  onCreated,
}: {
  vendors: AcquisitionFormVendor[];
  embedded?: boolean;
  onCreated?: () => void;
}) {
  const router = useRouter();
  const notify = useNotify();
  const [vendors, setVendors] = useState(initial);
  const [vendorId, setVendorId] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([fresh()]);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [pending, startTransition] = useTransition();
  const patch = (id: string, value: Partial<Line>) =>
    setLines((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...value } : row)),
    );
  function addVendor() {
    if (!vendorName.trim()) return;
    startTransition(async () => {
      try {
        const vendor = await createQuickVendor({
          name: vendorName.trim(),
          phone: vendorPhone.trim() || null,
        });
        setVendors((rows) => [
          ...rows.filter((row) => row.id !== vendor.id),
          vendor,
        ]);
        setVendorId(vendor.id);
        setAdding(false);
        setVendorName("");
        setVendorPhone("");
      } catch (error) {
        notify.error({
          title: "Không thể tạo nhà cung cấp",
          message: error instanceof Error ? error.message : "Có lỗi xảy ra",
        });
      }
    });
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!vendorId) return notify.error({ title: "Chưa chọn nhà cung cấp" });
    if (
      lines.some((line) => line.originType === "OEM" && !line.brandName.trim())
    )
      return notify.error({ title: "Khóa chính hãng cần có brand" });
    setSaving(true);
    try {
      const response = await fetch("/api/admin/acquisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          quickVendorName: "",
          currency: "VND",
          type: "PURCHASE",
          notes,
          items: lines.map((line) => ({
            title: titleOf(line),
            quantity: line.quantity,
            unitCost: line.unitCost,
            productType: "WATCH_CLASP",
            claspSpec: {
              claspType: line.claspType,
              widthMM: line.widthMM,
              originType: line.originType,
              brandName:
                line.originType === "OEM" ? line.brandName.trim() : null,
              color: line.color.trim(),
              finish: line.finish.trim(),
              sellPrice: line.sellPrice,
            },
          })),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.error ?? "Không thể tạo phiếu nhập khóa");
      notify.success({ title: "Đã tạo phiếu nhập khóa" });
      if (onCreated) {
        onCreated();
        return;
      }
      router.push("/admin/acquisitions");
      router.refresh();
    } catch (error) {
      notify.error({
        title: "Tạo phiếu thất bại",
        message: error instanceof Error ? error.message : "Có lỗi xảy ra",
      });
    } finally {
      setSaving(false);
    }
  }
  const total = lines.reduce(
    (sum, line) => sum + line.quantity * line.unitCost,
    0,
  );
  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-[1450px] space-y-4 p-6 pb-28"
    >
      {!embedded ? (
        <header className="rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-violet-50 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold">Tạo phiếu nhập khóa</h1>
              <p className="text-sm text-slate-500">
                Khóa là sản phẩm tồn kho độc lập, có vendor và giá vốn riêng.
              </p>
            </div>
          </div>
        </header>
      ) : null}
      <section className="rounded-2xl border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-medium">Nhà cung cấp</label>
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="text-xs font-semibold text-violet-700"
              >
                + Thêm nhà cung cấp
              </button>
            </div>
            <select
              className={inputClass}
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
            >
              <option value="">Chọn nhà cung cấp</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
            {adding ? (
              <div className="mt-3 flex gap-2 rounded-xl bg-violet-50 p-3">
                <input
                  className={inputClass}
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="Tên nhà cung cấp"
                />
                <input
                  className={inputClass}
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                  placeholder="Điện thoại"
                />
                <button
                  type="button"
                  disabled={pending}
                  onClick={addVendor}
                  className="rounded-xl bg-violet-600 px-4 text-white"
                >
                  Thêm
                </button>
                <button type="button" onClick={() => setAdding(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
          <label className="text-sm font-medium">
            Ghi chú
            <input
              className={`${inputClass} mt-2`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>
      </section>
      <section className="rounded-2xl border bg-white">
        <div className="flex justify-between border-b p-5">
          <div>
            <h2 className="font-semibold">Danh sách khóa</h2>
            <p className="text-sm text-slate-500">
              Mỗi dòng là một SKU khóa độc lập.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLines((rows) => [...rows, fresh()])}
            className="inline-flex items-center gap-2 rounded-xl border px-3 text-sm"
          >
            <Plus className="h-4 w-4" /> Thêm dòng
          </button>
        </div>
        <div className="space-y-4 p-5">
          {lines.map((line, index) => (
            <article
              key={line.id}
              className="overflow-hidden rounded-2xl border"
            >
              <div className="flex justify-between border-b border-violet-100 bg-violet-50/60 px-5 py-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-500">
                    Khóa #{index + 1}
                  </div>
                  <div className="mt-1 font-semibold">{titleOf(line)}</div>
                </div>
                <button
                  type="button"
                  disabled={lines.length === 1}
                  onClick={() =>
                    setLines((rows) => rows.filter((row) => row.id !== line.id))
                  }
                  className="text-rose-500 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
                <label className="text-xs font-medium text-slate-600">
                  Loại khóa
                  <select
                    className={`${inputClass} mt-1.5`}
                    value={line.claspType}
                    onChange={(e) =>
                      patch(line.id, { claspType: e.target.value as ClaspType })
                    }
                  >
                    {CLASP_TYPES.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-medium text-slate-600">
                  Nguồn gốc
                  <select
                    className={`${inputClass} mt-1.5`}
                    value={line.originType}
                    onChange={(e) =>
                      patch(line.id, {
                        originType: e.target.value as Line["originType"],
                      })
                    }
                  >
                    <option value="AFTERMARKET">Linh kiện</option>
                    <option value="OEM">Chính hãng</option>
                  </select>
                </label>
                {line.originType === "OEM" ? (
                  <label className="text-xs font-medium text-slate-600">
                    Brand
                    <input
                      className={`${inputClass} mt-1.5`}
                      value={line.brandName}
                      onChange={(e) =>
                        patch(line.id, { brandName: e.target.value })
                      }
                    />
                  </label>
                ) : null}
                <label className="text-xs font-medium text-slate-600">
                  Màu
                  <input
                    className={`${inputClass} mt-1.5`}
                    value={line.color}
                    onChange={(e) => patch(line.id, { color: e.target.value })}
                  />
                </label>
                <label className="text-xs font-medium text-slate-600">
                  Độ rộng
                  <input
                    className={`${inputClass} mt-1.5 text-right`}
                    type="number"
                    value={line.widthMM}
                    onChange={(e) =>
                      patch(line.id, { widthMM: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="text-xs font-medium text-slate-600">
                  Hoàn thiện
                  <input
                    className={`${inputClass} mt-1.5`}
                    value={line.finish}
                    onChange={(e) => patch(line.id, { finish: e.target.value })}
                    placeholder="Bóng, xước..."
                  />
                </label>
                <label className="text-xs font-medium text-slate-600">
                  Số lượng
                  <input
                    className={`${inputClass} mt-1.5 text-right`}
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) =>
                      patch(line.id, {
                        quantity: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                </label>
                <label className="text-xs font-medium text-slate-600">
                  Giá nhập
                  <input
                    className={`${inputClass} mt-1.5 text-right`}
                    type="number"
                    min={0}
                    value={line.unitCost}
                    onChange={(e) =>
                      patch(line.id, { unitCost: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="text-xs font-medium text-slate-600">
                  Giá bán
                  <input
                    className={`${inputClass} mt-1.5 text-right`}
                    type="number"
                    min={0}
                    value={line.sellPrice}
                    onChange={(e) =>
                      patch(line.id, { sellPrice: Number(e.target.value) })
                    }
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white/95 px-6 py-3">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Tổng giá trị</div>
            <b>{new Intl.NumberFormat("vi-VN").format(total)} VND</b>
          </div>
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            <Save className="h-4 w-4" />
            {saving ? "Đang lưu..." : "Lưu phiếu nháp"}
          </button>
        </div>
      </footer>
    </form>
  );
}
