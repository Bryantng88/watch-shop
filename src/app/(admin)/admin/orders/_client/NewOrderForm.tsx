"use client";

import { useEffect, useMemo, useState } from "react";
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

type OrderLine = {
    id: string;
    productId: string;
    title: string;
    primaryImageUrl?: string | null;
    productType: ProductType;
    quantity: number;
    unitPrice: number;
};

type Props = {
    customers: Customer[];
};

const PAYMENT_METHODS = ["COD", "BANK_TRANSFER", "CARD"] as const;

// ==============================
// COMPONENT
// ==============================
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

    const [lines, setLines] = useState<OrderLine[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    // ==========================
    // TOTAL
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
    // AUTO FILL CUSTOMER BY PHONE
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
            setFormData((prev) => ({
                ...prev,
                customerId: "",
                customerName: "",
                shippingAddress: "",
            }));
        }
    }, [formData.phone, customers]);

    // ==========================
    // HANDLERS
    // ==========================
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function updateLine(
        id: string,
        patch: Partial<OrderLine>
    ) {
        setLines((prev) =>
            prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
        );
    }

    function removeLine(id: string) {
        setLines((prev) => prev.filter((l) => l.id !== id));
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
                    items: lines.map((l) => ({
                        productId: l.productId,
                        title: l.title,
                        productType: l.productType,
                        quantity: l.quantity,
                        unitPrice: l.unitPrice,
                    })),
                }),
            });

            if (!res.ok) throw new Error(await res.text());
            setOkMsg("Đã tạo đơn hàng thành công!");
            setLines([]);
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
                <Link
                    href="/admin/orders"
                    className="rounded-md border px-3 py-2 hover:bg-gray-50"
                >
                    ← Danh sách
                </Link>
            </div>

            {/* CUSTOMER + ORDER INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CUSTOMER */}
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
                        placeholder="Nhập tên nếu khách mới"
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

                    <label className="block text-sm">Thanh toán</label>
                    <select
                        name="paymentMethod"
                        className="w-full rounded border px-3 py-2 mb-3"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                    >
                        {PAYMENT_METHODS.map((m) => (
                            <option key={m}>{m}</option>
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

            {/* PRODUCT SEARCH */}
            <div className="rounded-md border bg-white p-5 shadow-sm">
                <h3 className="font-semibold mb-3">Thêm sản phẩm</h3>

                <ProductSearchInput
                    value=""
                    onSelect={(p) => {
                        setLines((prev) => [
                            ...prev,
                            {
                                id: crypto.randomUUID(),
                                productId: p.id,
                                title: p.title,
                                primaryImageUrl: p.primaryImageUrl,
                                productType: p.productType,
                                quantity: p.productType === "WATCH" ? 1 : 1,
                                unitPrice: p.sellPrice ?? 0,
                            },
                        ]);
                    }}
                />
            </div>

            {/* PRODUCT TABLE */}
            {lines.length > 0 && (
                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <h3 className="font-semibold mb-3">Sản phẩm đã chọn</h3>

                    <table className="min-w-full text-sm border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-3 py-2">Ảnh</th>
                                <th className="px-3 py-2 text-left">Tên</th>
                                <th className="px-3 py-2">Loại</th>
                                <th className="px-3 py-2 text-right">SL</th>
                                <th className="px-3 py-2 text-right">Đơn giá</th>
                                <th className="px-3 py-2 text-right">Thành tiền</th>
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {lines.map((l) => {
                                const money = l.quantity * l.unitPrice;
                                const isWatch = l.productType === "WATCH";

                                return (
                                    <tr key={l.id} className="border-b">
                                        <td className="px-3 py-2">
                                            {l.primaryImageUrl ? (
                                                <img
                                                    src={`/api/media/sign?key=${encodeURIComponent(l.primaryImageUrl)}`}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded" />
                                            )}
                                        </td>

                                        <td className="px-3 py-2">{l.title}</td>
                                        <td className="px-3 py-2">{l.productType}</td>

                                        <td className="px-3 py-2 text-right">
                                            <input
                                                type="number"
                                                min={1}
                                                disabled={isWatch}
                                                className={`w-16 rounded border px-2 py-1 text-right ${isWatch ? "bg-gray-100 cursor-not-allowed" : ""
                                                    }`}
                                                value={l.quantity}
                                                onChange={(e) =>
                                                    updateLine(l.id, {
                                                        quantity: Number(e.target.value),
                                                    })
                                                }
                                            />
                                        </td>

                                        <td className="px-3 py-2 text-right">
                                            <input
                                                type="number"
                                                className="w-24 rounded border px-2 py-1 text-right"
                                                value={l.unitPrice}
                                                onChange={(e) =>
                                                    updateLine(l.id, {
                                                        unitPrice: Number(e.target.value),
                                                    })
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
                                                className="text-red-600 hover:underline text-xs"
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
                                <td colSpan={5}></td>
                                <td className="px-3 py-3 text-right font-semibold">
                                    {total.toLocaleString("vi-VN")}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* FOOTER */}
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
