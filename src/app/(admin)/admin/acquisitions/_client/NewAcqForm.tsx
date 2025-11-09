"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

type Vendor = { id: string; name: string };
type Props = { vendors: Vendor[] };
type Line = { id: string; title: string; quantity: number; unitCost: number };

const CURRENCIES = ["VND", "USD", "EUR"] as const;
const TYPES = ["PURCHASE", "BUY_BACK", "TRADE_IN", "CONSIGNMENT"] as const;

export default function NewAcqForm({ vendors }: Props) {
    // Gộp các trường đơn vào formData
    const [formData, setFormData] = useState<Record<string, any>>({
        currency: "VND",
        type: "PURCHASE",
        acquiredAt: (() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        })(),
        notes: "",
        vendorId: "",
        quickVendorName: "",
        quickVendorPhone: "",
        quickVendorEmail: "",
    });

    // Thêm nhanh vendor
    const [showQuickVendor, setShowQuickVendor] = useState(false);
    const [quickVendor, setQuickVendor] = useState({ name: "", phone: "", email: "" });
    const set = (name: string) => (e: any) =>
        setFormData(prev => ({ ...prev, [name]: e?.target ? e.target.value : e }));

    // Dòng sản phẩm mới
    const [lines, setLines] = useState<Line[]>([
        { id: crypto.randomUUID(), title: "", quantity: 1, unitCost: 0 },
    ]);

    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    useEffect(() => {
        if (showQuickVendor) setFormData(f => ({ ...f, vendorId: "" }));
    }, [showQuickVendor]);

    // Tổng tiền
    const total = useMemo(
        () => lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0), 0),
        [lines]
    );

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function setLine<K extends keyof Line>(id: string, key: K, val: Line[K]) {
        setLines(prev => prev.map(l => l.id === id ? { ...l, [key]: val } : l));
    }
    const addLine = () =>
        setLines(p => [...p, { id: crypto.randomUUID(), title: "", quantity: 1, unitCost: 0 }]);
    const removeLine = (id: string) =>
        setLines(p => p.length === 1 ? p : p.filter(l => l.id !== id));

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null); setOkMsg(null); setSaving(true);

        // Nếu thêm vendor nhanh thì không cần vendorId
        if (!formData.vendorId && !quickVendor.name) {
            setErr("Hãy chọn hoặc nhập vendor."); setSaving(false); return;
        }
        const items = lines
            .map(l => ({
                title: l.title.trim(),
                quantity: Number(l.quantity) || 0,
                unitCost: Number(l.unitCost) || 0,
            }))
            .filter(l => l.title && l.quantity > 0);

        if (!items.length) { setErr("Cần ít nhất 1 dòng hợp lệ."); setSaving(false); return; }

        try {
            const res = await fetch("/api/admin/acquisitions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    notes: formData.notes || null,
                    acquiredAt: new Date(formData.acquiredAt),
                    quickVendor: showQuickVendor ? quickVendor : undefined,
                    items,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            setOkMsg("Đã tạo phiếu DRAFT thành công.");
            // Có thể router.push(`/admin/acquisitions/${data.id}`)
        } catch (e: any) {
            setErr(e?.message || "Tạo phiếu thất bại");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Tạo phiếu nhập (DRAFT)</h1>
                <Link href="/admin/acquisitions" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">← Danh sách</Link>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Phần Vendor */}
                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <h3 className="font-semibold mb-3">Vendor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        {!showQuickVendor ? (
                            <>
                                <select
                                    name="vendorId"
                                    className="w-full rounded border px-3 py-2 mb-2"
                                    value={formData.vendorId}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Chọn vendor --</option>
                                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                                <button
                                    type="button"
                                    className="w-full rounded bg-black text-white px-3 py-2 text-sm font-medium"
                                    onClick={() => {
                                        setShowQuickVendor(true);
                                        setFormData(f => ({ ...f, vendorId: "" }));
                                    }}
                                >
                                    Thêm nhanh vendor mới
                                </button>
                            </>
                        ) : (
                            <div className="rounded bg-gray-50 p-3 mb-2 ">
                                <div className="mb-2">
                                    <label className="block text-xs font-medium mb-1">Tên vendor (quick add)</label>
                                    <input
                                        className="w-full rounded border px-3 py-2"
                                        value={formData.quickVendorName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-xs font-medium mb-1">Điện thoại</label>
                                    <input
                                        className="w-full rounded border px-3 py-2"
                                        value={formData.quickVendorPhone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-xs font-medium mb-1">Email</label>
                                    <input
                                        className="w-full rounded border px-3 py-2"
                                        value={quickVendor.email}
                                        onChange={e => setQuickVendor(v => ({ ...v, email: e.target.value }))}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="w-full rounded border px-3 py-2 text-sm font-medium mt-2"
                                    onClick={() => setShowQuickVendor(false)}
                                >
                                    Huỷ thêm mới
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Các trường còn lại */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5">
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
                            <select name="currency" value={formData.currency} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2">
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Loại phiếu</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full rounded border px-3 py-2">
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium">Ghi chú</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 min-h-[80px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Dòng sản phẩm */}
                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold">Dòng sản phẩm mới</h3>
                        <button type="button" onClick={addLine} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">+ Thêm dòng</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left w-[40%]">Tên sản phẩm</th>
                                    <th className="px-3 py-2 text-right">Số lượng</th>
                                    <th className="px-3 py-2 text-right">Đơn giá</th>
                                    <th className="px-3 py-2 text-right">Thành tiền</th>
                                    <th className="px-3 py-2" />
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map(ln => {
                                    const money = (Number(ln.quantity) || 0) * (Number(ln.unitCost) || 0);
                                    return (
                                        <tr key={ln.id} className="border-b">
                                            <td className="px-3 py-2">
                                                <input
                                                    type="text"
                                                    placeholder="Tên sản phẩm"
                                                    value={ln.title}
                                                    onChange={e => setLine(ln.id, "title", e.target.value)}
                                                    className="w-full rounded border px-2 py-2"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <input
                                                    type="number" min={1}
                                                    value={ln.quantity}
                                                    onChange={e => setLine(ln.id, "quantity", Number(e.target.value))}
                                                    className="w-24 rounded border px-2 py-2 text-right"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <input
                                                    type="number" min={0} step="0.01"
                                                    value={ln.unitCost}
                                                    onChange={e => setLine(ln.id, "unitCost", Number(e.target.value))}
                                                    className="w-32 rounded border px-2 py-2 text-right"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-right">{money.toLocaleString("vi-VN")} {formData.currency}</td>
                                            <td className="px-3 py-2 text-right">
                                                <button type="button" onClick={() => removeLine(ln.id)} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Xoá</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="px-3 py-3 text-right font-semibold" colSpan={3}>Tổng cộng</td>
                                    <td className="px-3 py-3 text-right font-semibold">{total.toLocaleString("vi-VN")} {formData.currency}</td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {err && <div className="text-sm text-red-600">{err}</div>}
                {okMsg && <div className="text-sm text-green-600">{okMsg}</div>}

                <div className="flex justify-end gap-2">
                    <Link href="/admin/acquisitions" className="rounded-md border px-3 py-2">Huỷ</Link>
                    <button type="submit" disabled={saving} className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60">
                        {saving ? "Đang lưu…" : "Lưu phiếu (DRAFT)"}
                    </button>
                </div>
            </form>
        </div>
    );
}
