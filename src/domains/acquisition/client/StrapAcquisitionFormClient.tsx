"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Link2, Plus, Save, Trash2, X } from "lucide-react";

import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { createQuickVendor } from "@/domains/vendor/client/vendor.actions";
import type { AcquisitionFormVendor } from "./form/acquisition-form.types";

type Material =
  | "LEATHER"
  | "BRACELET"
  | "RUBBER"
  | "NATO"
  | "CANVASS"
  | "SPECIAL";
type Line = {
  id: string;
  material: Material;
  originType: "OEM" | "AFTERMARKET";
  brandName: string;
  leatherType: string;
  surface: "SMOOTH" | "GRAINED";
  lugWidthMM: number;
  buckleWidthMM: number;
  color: string;
  quantity: number;
  unitCost: number;
  sellPrice: number;
  quickRelease: boolean;
};

const MATERIALS: Array<[Material, string]> = [
  ["LEATHER", "Da"],
  ["BRACELET", "Dây thép"],
  ["RUBBER", "Cao su"],
  ["NATO", "NATO"],
  ["CANVASS", "Vải / Canvas"],
  ["SPECIAL", "Khác"],
];
const LEATHERS = [
  ["COW", "Da bò"],
  ["CROCODILE", "Da cá sấu"],
  ["OSTRICH", "Da đà điểu"],
  ["LIZARD", "Da kỳ đà"],
  ["GOAT", "Da dê"],
  ["OTHER", "Da khác"],
] as const;
const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100";

function newLine(): Line {
  return {
    id: crypto.randomUUID(),
    material: "LEATHER",
    originType: "AFTERMARKET",
    brandName: "",
    leatherType: "COW",
    surface: "SMOOTH",
    lugWidthMM: 20,
    buckleWidthMM: 18,
    color: "",
    quantity: 1,
    unitCost: 0,
    sellPrice: 0,
    quickRelease: false,
  };
}
function leatherLabel(code: string) {
  return LEATHERS.find(([value]) => value === code)?.[1].toLowerCase() ?? "da";
}
function titleOf(line: Line) {
  const origin =
    line.originType === "OEM"
      ? `chính hãng ${line.brandName.trim()}`.trim()
      : "";
  const material =
    line.material === "LEATHER"
      ? leatherLabel(line.leatherType)
      : (MATERIALS.find(([value]) => value === line.material)?.[1]
          .toLowerCase()
          .replace(/^dây\s+/, "") ?? "");
  const surface =
    line.material === "LEATHER"
      ? line.surface === "GRAINED"
        ? "vân"
        : "trơn"
      : "";
  return [
    "Dây",
    origin,
    material,
    line.color.trim().toLowerCase(),
    surface,
    `${line.lugWidthMM}–${line.buckleWidthMM}`,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");
}

export default function StrapAcquisitionFormClient({
  vendors: initialVendors,
  embedded = false,
  onCreated,
}: {
  vendors: AcquisitionFormVendor[];
  embedded?: boolean;
  onCreated?: () => void;
}) {
  const router = useRouter();
  const notify = useNotify();
  const [vendors, setVendors] = useState(initialVendors);
  const [vendorId, setVendorId] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([newLine()]);
  const [saving, setSaving] = useState(false);
  const [addingVendor, setAddingVendor] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorPending, startVendorTransition] = useTransition();
  const patchLine = (id: string, patch: Partial<Line>) =>
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
  const total = lines.reduce(
    (sum, line) => sum + line.quantity * line.unitCost,
    0,
  );

  function addVendor() {
    const name = vendorName.trim();
    if (!name) return;
    startVendorTransition(async () => {
      try {
        const vendor = await createQuickVendor({
          name,
          phone: vendorPhone.trim() || null,
        });
        setVendors((current) =>
          [...current.filter((item) => item.id !== vendor.id), vendor].sort(
            (a, b) => a.name.localeCompare(b.name),
          ),
        );
        setVendorId(vendor.id);
        setVendorName("");
        setVendorPhone("");
        setAddingVendor(false);
        notify.success({
          title: "Đã tạo nhà cung cấp",
          message: `${vendor.name} đã được chọn.`,
        });
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
      return notify.error({ title: "Dây chính hãng cần có brand" });
    if (lines.some((line) => !line.color.trim()))
      return notify.error({ title: "Vui lòng nhập màu dây" });
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
            productType: "WATCH_STRAP",
            strapSpec: {
              material: line.material,
              originType: line.originType,
              brandName:
                line.originType === "OEM" ? line.brandName.trim() : null,
              leatherType:
                line.material === "LEATHER" ? line.leatherType : null,
              surface: line.material === "LEATHER" ? line.surface : null,
              lugWidthMM: line.lugWidthMM,
              buckleWidthMM: line.buckleWidthMM,
              color: line.color.trim(),
              quickRelease: line.quickRelease,
              sellPrice: line.sellPrice,
            },
          })),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.error ?? "Không thể tạo phiếu nhập dây");
      notify.success({
        title: "Đã tạo phiếu nhập dây",
        message: "Phiếu đang ở trạng thái nháp.",
      });
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

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-[1500px] space-y-4 p-6 pb-28"
    >
      {!embedded ? (
        <header className="rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-violet-50 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600 text-white">
              <Link2 className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold">Tạo phiếu nhập dây</h1>
              <p className="text-sm text-slate-500">
                Tên sản phẩm được sinh tự động từ thuộc tính dây.
              </p>
            </div>
          </div>
        </header>
      ) : null}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Nhà cung cấp</label>
              <button
                type="button"
                onClick={() => setAddingVendor(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700"
              >
                <Plus className="h-3.5 w-3.5" /> Thêm nhà cung cấp
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
            {addingVendor ? (
              <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/50 p-3">
                <div className="flex gap-2">
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
                    placeholder="Số điện thoại"
                  />
                  <button
                    type="button"
                    disabled={vendorPending}
                    onClick={addVendor}
                    className="rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white"
                  >
                    Thêm
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingVendor(false)}
                    className="px-2 text-slate-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <label className="text-sm font-medium">
            Ghi chú
            <input
              className={`${inputClass} mt-2`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú cho cả phiếu"
            />
          </label>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-semibold">Danh sách dây</h2>
            <p className="text-sm text-slate-500">
              Chính hãng cần brand; loại da và bề mặt chỉ áp dụng cho dây da.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLines((current) => [...current, newLine()])}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> Thêm dòng
          </button>
        </div>
        <div className="space-y-4 p-5">
          {lines.map((line) => (
            <div
              key={line.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center justify-between border-b border-violet-100 bg-violet-50/60 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-sm font-semibold text-violet-700 ring-1 ring-violet-100">
                    {lines.indexOf(line) + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-500">
                      Tên sản phẩm dự kiến
                    </div>
                    <div className="mt-0.5 truncate font-semibold text-slate-950">
                      {titleOf(line)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={lines.length === 1}
                  onClick={() =>
                    setLines((current) =>
                      current.filter((item) => item.id !== line.id),
                    )
                  }
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-rose-600 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid divide-y divide-slate-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Phân loại
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Loại dây và nguồn gốc
                    </p>
                  </div>
                  <label className="block text-xs font-medium text-slate-600">
                    Chất liệu
                    <select
                      className={`${inputClass} mt-1.5`}
                      value={line.material}
                      onChange={(e) =>
                        patchLine(line.id, {
                          material: e.target.value as Material,
                        })
                      }
                    >
                      {MATERIALS.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-medium text-slate-600">
                    Nguồn gốc
                    <select
                      className={`${inputClass} mt-1.5`}
                      value={line.originType}
                      onChange={(e) =>
                        patchLine(line.id, {
                          originType: e.target.value as Line["originType"],
                        })
                      }
                    >
                      <option value="AFTERMARKET">Linh kiện</option>
                      <option value="OEM">Chính hãng</option>
                    </select>
                  </label>
                  {line.originType === "OEM" ? (
                    <label className="block text-xs font-medium text-slate-600">
                      Brand <span className="text-rose-500">*</span>
                      <input
                        className={`${inputClass} mt-1.5`}
                        value={line.brandName}
                        onChange={(e) =>
                          patchLine(line.id, { brandName: e.target.value })
                        }
                        placeholder="VD: Rolex, Hermès"
                      />
                    </label>
                  ) : null}
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Ngoại hình
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Chất da, bề mặt và màu sắc
                    </p>
                  </div>
                  {line.material === "LEATHER" ? (
                    <>
                      <label className="block text-xs font-medium text-slate-600">
                        Loại da
                        <select
                          className={`${inputClass} mt-1.5`}
                          value={line.leatherType}
                          onChange={(e) =>
                            patchLine(line.id, { leatherType: e.target.value })
                          }
                        >
                          {LEATHERS.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-xs font-medium text-slate-600">
                        Bề mặt
                        <select
                          className={`${inputClass} mt-1.5`}
                          value={line.surface}
                          onChange={(e) =>
                            patchLine(line.id, {
                              surface: e.target.value as Line["surface"],
                            })
                          }
                        >
                          <option value="SMOOTH">Trơn</option>
                          <option value="GRAINED">Vân</option>
                        </select>
                      </label>
                    </>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                      Loại da và bề mặt không áp dụng cho chất liệu này.
                    </div>
                  )}
                  <label className="block text-xs font-medium text-slate-600">
                    Màu sắc <span className="text-rose-500">*</span>
                    <input
                      className={`${inputClass} mt-1.5`}
                      value={line.color}
                      onChange={(e) =>
                        patchLine(line.id, { color: e.target.value })
                      }
                      placeholder="VD: Nâu, đen, xanh navy"
                    />
                  </label>
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Kích thước & giá
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Quy cách nhập kho và bán hàng
                    </p>
                  </div>
                  <label className="block text-xs font-medium text-slate-600">
                    Kích thước dây
                    <div className="mt-1.5 flex h-11 items-center overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
                      <input
                        className="min-w-0 flex-1 px-3 text-center text-sm outline-none"
                        type="number"
                        value={line.lugWidthMM}
                        onChange={(e) =>
                          patchLine(line.id, {
                            lugWidthMM: Number(e.target.value),
                          })
                        }
                      />
                      <span className="text-slate-300">→</span>
                      <input
                        className="min-w-0 flex-1 px-3 text-center text-sm outline-none"
                        type="number"
                        value={line.buckleWidthMM}
                        onChange={(e) =>
                          patchLine(line.id, {
                            buckleWidthMM: Number(e.target.value),
                          })
                        }
                      />
                      <span className="pr-3 text-xs text-slate-400">mm</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-medium text-slate-600">
                      Số lượng
                      <input
                        className={`${inputClass} mt-1.5 text-right`}
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) =>
                          patchLine(line.id, {
                            quantity: Math.max(1, Number(e.target.value)),
                          })
                        }
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-600">
                      Giá nhập
                      <input
                        className={`${inputClass} mt-1.5 text-right`}
                        type="number"
                        min={0}
                        value={line.unitCost}
                        onChange={(e) =>
                          patchLine(line.id, {
                            unitCost: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-medium text-slate-600">
                    Giá bán đề xuất
                    <input
                      className={`${inputClass} mt-1.5 text-right`}
                      type="number"
                      min={0}
                      value={line.sellPrice}
                      onChange={(e) =>
                        patchLine(line.id, {
                          sellPrice: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Tổng giá trị</span>
            <div className="font-semibold">
              {new Intl.NumberFormat("vi-VN").format(total)} VND
            </div>
          </div>
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Đang lưu..." : "Lưu phiếu nháp"}
          </button>
        </div>
      </footer>
    </form>
  );
}
