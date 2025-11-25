"use client";

import { ProductType } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

type Vendor = { id: string; name: string };
type Props = { vendors: Vendor[] };
type Line = {
    id: string;
    title: string;
    quantity: number;
    unitCost: number;
    productType: ProductType;
};

const CURRENCIES = ["VND", "USD", "EUR"] as const;
const TYPES = ["PURCHASE", "BUY_BACK", "TRADE_IN", "CONSIGNMENT"] as const;

export default function NewAcqForm({ vendors }: Props) {
    const [formData, setFormData] = useState({
        currency: "VND",
        type: "PURCHASE",
        acquiredAt: new Date().toISOString().slice(0, 16),
        notes: "",
        vendorId: "",
        quickVendorName: "",
    });

    const [showQuickVendor, setShowQuickVendor] = useState(false);
    const [lines, setLines] = useState<Line[]>([
        {
            id: crypto.randomUUID(),
            title: "",
            quantity: 1,
            unitCost: 0,
            productType: "WATCH",
        },
    ]);

    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    const total = useMemo(
        () =>
            lines.reduce(
                (s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0),
                0
            ),
        [lines]
    );

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function setLine<K extends keyof Line>(id: string, key: K, value: Line[K]) {
        setLines((prev) =>
            prev.map((l) => (l.id === id ? { ...l, [key]: value } : l))
        );
    }

    const addLine = () =>
        setLines((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                title: "",
                quantity: 1,
                unitCost: 0,
                productType: "WATCH",
            },
        ]);

    const removeLine = (id: string) =>
        setLines((prev) => (prev.length === 1 ? prev : prev.filter((l) => l.id !== id)));

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setOkMsg(null);
        setSaving(true);

        try {
            const res = await fetch("/api/admin/acquisitions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    acquiredAt: new Date(formData.acquiredAt),
                    items: lines.map((l) => ({
                        title: l.title,
                        quantity: l.quantity,
                        unitCost: l.unitCost,
                        productType: l.productType,
                    })),
                }),
            });

            if (!res.ok) throw new Error(await res.text());
            setOkMsg("Đã tạo phiếu thành công");
        } catch (e: any) {
            setErr(e?.message || "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6 pb-24">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Tạo phiếu nhập (DRAFT)</h1>
                <Link
                    href="/admin/acquisitions"
                    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    ← Danh sách
                </Link>
            </div>

            {/* THÔNG TIN CHUNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VENDOR CARD */}
                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <h3 className="font-semibold mb-3">Vendor</h3>

                    {!showQuickVendor ? (
                        <>
                            <select
                                name="vendorId"
                                className="w-full rounded border px-3 py-2 mb-3"
                                value={formData.vendorId}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn vendor --</option>
                                {vendors.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={() => setShowQuickVendor(true)}
                                className="w-full rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-neutral-800"
                            >
                                + Thêm nhanh vendor mới
                            </button>
                        </>
                    ) : (
                        <div className="bg-gray-50 p-3 rounded border">
                            <label className="block text-xs mb-1">Tên vendor mới</label>
                            <input
                                name="quickVendorName"
                                className="w-full rounded border px-3 py-2"
                                value={formData.quickVendorName}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                onClick={() => setShowQuickVendor(false)}
                                className="mt-2 w-full rounded border px-3 py-2"
                            >
                                Huỷ thêm mới
                            </button>
                        </div>
                    )}

                    <label className="block mt-4 text-sm font-medium">Ghi chú</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border px-3 py-2 min-h-[60px]"
                    />
                </div>

                {/* INFO CARD */}
                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <h3 className="font-semibold mb-3">Thông tin phiếu</h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Ngày nhập</label>
                            <input
                                name="acquiredAt"
                                type="datetime-local"
                                value={formData.acquiredAt}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Tiền tệ</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2"
                            >
                                {CURRENCIES.map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Loại phiếu</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2"
                            >
                                {TYPES.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* BẢNG SẢN PHẨM */}
            <div className="rounded-md border bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Danh sách sản phẩm</h3>
                    <button
                        type="button"
                        onClick={addLine}
                        className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        + Thêm dòng
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-3 py-2 text-left">Tên sản phẩm</th>
                                <th className="px-3 py-2 text-left w-[12%]">Loại SP</th>
                                <th className="px-3 py-2 text-right w-[8%]">SL</th>
                                <th className="px-3 py-2 text-right w-[15%]">Đơn giá</th>
                                <th className="px-3 py-2 text-right w-[15%]">Thành tiền</th>
                                <th className="px-3 py-2 w-[5%]"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {lines.map((ln) => {
                                const money = ln.quantity * ln.unitCost;

                                return (
                                    <tr key={ln.id} className="border-b hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                className="w-full rounded border px-2 py-2"
                                                placeholder="Tên sản phẩm"
                                                value={ln.title}
                                                onChange={(e) =>
                                                    setLine(ln.id, "title", e.target.value)
                                                }
                                            />
                                        </td>

                                        <td className="px-3 py-2">
                                            <select
                                                value={ln.productType}
                                                className="w-[110px] rounded border px-2 py-2"
                                                onChange={(e) =>
                                                    setLine(
                                                        ln.id,
                                                        "productType",
                                                        e.target.value as ProductType
                                                    )
                                                }
                                            >
                                                {Object.values(ProductType).map((t) => (
                                                    <option key={t}>{t}</option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="px-3 py-2 text-right">
                                            <input
                                                type="number"
                                                min={1}
                                                className="w-20 rounded border px-2 py-2 text-right"
                                                value={ln.quantity}
                                                onChange={(e) =>
                                                    setLine(
                                                        ln.id,
                                                        "quantity",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </td>

                                        <td className="px-3 py-2 text-right">
                                            <input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                className="w-28 rounded border px-2 py-2 text-right"
                                                value={ln.unitCost}
                                                onChange={(e) =>
                                                    setLine(
                                                        ln.id,
                                                        "unitCost",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </td>

                                        <td className="px-3 py-2 text-right font-medium">
                                            {money.toLocaleString("vi-VN")} {formData.currency}
                                        </td>

                                        <td className="px-3 py-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() => removeLine(ln.id)}
                                                className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colSpan={3}></td>
                                <td className="px-3 py-3 text-right font-semibold">
                                    Tổng cộng
                                </td>
                                <td className="px-3 py-3 text-right font-semibold">
                                    {total.toLocaleString("vi-VN")} {formData.currency}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* FOOTER BUTTONS (STICKY) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3 px-6 flex justify-end gap-3">
                <button
                    disabled={saving}
                    className="rounded-md border px-4 py-2"
                    onClick={() => history.back()}
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    form="acq-form"
                    disabled={saving}
                    className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800"
                >
                    {saving ? "Đang lưu…" : "Lưu phiếu (DRAFT)"}
                </button>
            </div>

            {err && <div className="text-red-600">{err}</div>}
            {okMsg && <div className="text-green-600">{okMsg}</div>}
        </div>
    );
}
