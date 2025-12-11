"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ProductType } from "@prisma/client";
import ProductSearchInput from "../../components/ProductSearchInput";
// ==============================
// Types
// ==============================
type Customer = {
    id: string;
    name: string;
    phone: string;
    address?: string | null;
};

type Line = {
    id: string;
    title: string;
    quantity: number;
    unitPrice: number;
    productType: ProductType;
};

type Props = {
    customers: Customer[];
};

const PAYMENT_METHODS = ["COD", "BANK_TRANSFER", "CARD"] as const;

export default function NewOrderForm({ customers }: Props) {
    // ==========================
    // FORM STATE
    // ==========================
    const [formData, setFormData] = useState({
        phone: "",
        customerId: "",
        customerName: "",
        shippingAddress: "",
        paymentMethod: "COD",
        notes: "",
        orderDate: new Date().toISOString().slice(0, 16),
    });

    const [lines, setLines] = useState<Line[]>([
        {
            id: crypto.randomUUID(),
            title: "",
            quantity: 1,
            unitPrice: 0,
            productType: "WATCH",
        },
    ]);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    // ==========================
    // TOTAL MONEY
    // ==========================
    const total = useMemo(
        () =>
            lines.reduce(
                (s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0),
                0
            ),
        [lines]
    );

    // ==========================
    // CUSTOMER AUTO FILL
    // ==========================
    useEffect(() => {
        if (formData.phone.trim().length < 8) return;

        const found = customers.find((c) => c.phone === formData.phone);

        if (found) {
            setFormData((prev) => ({
                ...prev,
                customerId: found.id,
                customerName: found.name,
                shippingAddress: found.address ?? "",
            }));
        } else {
            // KH mới – reset
            setFormData((prev) => ({
                ...prev,
                customerId: "",
                customerName: "",
                shippingAddress: "",
            }));
        }
    }, [formData.phone]);

    // ==========================
    // HANDLE INPUT CHANGE
    // ==========================
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function setLine<K extends keyof Line>(id: string, key: K, value: Line[K]) {
        setLines((prev) =>
            prev.map((l) => (l.id === id ? { ...l, [key]: value } : l))
        );
    }

    function addLine() {
        setLines((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                title: "",
                quantity: 1,
                unitPrice: 0,
                productType: "WATCH",
            },
        ]);
    }

    function removeLine(id: string) {
        setLines((prev) => (prev.length === 1 ? prev : prev.filter((l) => l.id !== id)));
    }

    // ==========================
    // SUBMIT
    // ==========================
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setOkMsg(null);

        try {
            const res = await fetch("/api/admin/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    orderDate: new Date(formData.orderDate),
                    items: lines,
                }),
            });

            if (!res.ok) throw new Error(await res.text());
            setOkMsg("Đã tạo đơn hàng thành công!");
        } catch (err: any) {
            setError(err?.message || "Lỗi không xác định");
        } finally {
            setSaving(false);
        }
    }

    // ==========================
    // UI
    // ==========================
    return (
        <form onSubmit={onSubmit} className="space-y-6 pb-24">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Tạo đơn hàng</h1>
                <Link href="/admin/orders" className="rounded-md border px-3 py-2 hover:bg-gray-50">
                    ← Danh sách
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CUSTOMER INFO */}
                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <h3 className="font-semibold mb-3">Khách hàng</h3>

                    <label className="block text-sm">Số điện thoại</label>
                    <input
                        name="phone"
                        className="w-full rounded border px-3 py-2 mb-3"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <label className="block text-sm">Tên khách hàng</label>
                    <input
                        name="customerName"
                        className="w-full rounded border px-3 py-2 mb-3"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Nhập tên (nếu khách mới)"
                    />

                    <label className="block text-sm">Địa chỉ giao hàng</label>
                    <textarea
                        name="shippingAddress"
                        className="w-full rounded border px-3 py-2 min-h-[60px]"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                    />
                </div>

                {/* ORDER INFO */}
                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <h3 className="font-semibold mb-3">Thông tin đơn hàng</h3>

                    <label className="block text-sm">Ngày tạo</label>
                    <input
                        name="orderDate"
                        type="datetime-local"
                        className="w-full rounded border px-3 py-2 mb-3"
                        value={formData.orderDate}
                        onChange={handleChange}
                    />

                    <label className="block text-sm">Phương thức thanh toán</label>
                    <select
                        name="paymentMethod"
                        className="w-full rounded border px-3 py-2 mb-3"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                    >
                        {PAYMENT_METHODS.map((pm) => (
                            <option key={pm}>{pm}</option>
                        ))}
                    </select>

                    <label className="block text-sm">Ghi chú</label>
                    <textarea
                        name="notes"
                        className="w-full rounded border px-3 py-2 min-h-[60px]"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* PRODUCTS TABLE */}
            <div className="rounded-md border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Sản phẩm</h3>
                    <button
                        type="button"
                        onClick={addLine}
                        className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        + Thêm dòng
                    </button>
                </div>

                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2 text-left">Tên SP</th>
                            <th className="px-3 py-2 text-left w-[12%]">Loại</th>
                            <th className="px-3 py-2 text-right w-[10%]">SL</th>
                            <th className="px-3 py-2 text-right w-[15%]">Đơn giá</th>
                            <th className="px-3 py-2 text-right w-[15%]">Thành tiền</th>
                            <th className="px-3 py-2 w-[5%]"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {lines.map((l) => {
                            const money = l.quantity * l.unitPrice;
                            return (
                                <tr key={l.id} className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <ProductSearchInput
                                            value={l.title}
                                            onSelect={(p) => {
                                                setLine(l.id, "title", p.title);
                                                setLine(l.id, "unitPrice", p.sellPrice ?? 0);
                                                setLine(l.id, "productType", p.productType);
                                            }}
                                        />

                                    </td>

                                    <td className="px-3 py-2">
                                        <select
                                            className="w-[110px] rounded border px-2 py-2"
                                            value={l.productType}
                                            onChange={(e) =>
                                                setLine(l.id, "productType", e.target.value as ProductType)
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
                                            className="w-20 rounded border px-2 py-2 text-right"
                                            value={l.quantity}
                                            onChange={(e) =>
                                                setLine(l.id, "quantity", Number(e.target.value))
                                            }
                                        />
                                    </td>

                                    <td className="px-3 py-2 text-right">
                                        <input
                                            type="number"
                                            className="w-28 rounded border px-2 py-2 text-right"
                                            value={l.unitPrice}
                                            onChange={(e) =>
                                                setLine(l.id, "unitPrice", Number(e.target.value))
                                            }
                                        />
                                    </td>

                                    <td className="px-3 py-2 text-right font-medium">
                                        {money.toLocaleString("vi-VN")}
                                    </td>

                                    <td className="px-3 py-2 text-right">
                                        <button
                                            type="button"
                                            onClick={() => removeLine(l.id)}
                                            className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colSpan={3}></td>
                            <td className="px-3 py-3 text-right font-semibold">Tổng cộng</td>
                            <td className="px-3 py-3 text-right font-semibold">
                                {total.toLocaleString("vi-VN")}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* FOOTER BAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3 px-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => history.back()}
                    className="rounded-md border px-4 py-2"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-neutral-800"
                >
                    {saving ? "Đang lưu…" : "Tạo đơn hàng"}
                </button>
            </div>

            {error && <div className="text-red-600">{error}</div>}
            {okMsg && <div className="text-green-600">{okMsg}</div>}
        </form>
    );
}
