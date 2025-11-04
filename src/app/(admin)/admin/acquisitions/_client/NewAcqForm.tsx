"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Vendor = { id: string; name: string };
type Props = { vendors: Vendor[] };

type Line = {
    id: string;
    title: string;     // tên sản phẩm mới
    quantity: number;
    unitCost: number;
};

const CURRENCIES = ["VND", "USD", "EUR"] as const;
const TYPES = ["PURCHASE", "BUY_BACK", "TRADE_IN", "CONSIGNMENT"] as const;

export default function NewAcqForm({ vendors }: Props) {
    const [vendorId, setVendorId] = useState("");
    const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("VND");
    const [type, setType] = useState<(typeof TYPES)[number]>("PURCHASE");
    const [acquiredAt, setAcquiredAt] = useState<string>(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    });
    const [notes, setNotes] = useState("");
    const [lines, setLines] = useState<Line[]>([
        { id: crypto.randomUUID(), title: "", quantity: 1, unitCost: 0 },
    ]);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    const total = useMemo(
        () => lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0), 0),
        [lines]
    );

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

        if (!vendorId) { setErr("Hãy chọn vendor."); setSaving(false); return; }
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
                    vendorId, currency, type, notes: notes || null,
                    acquiredAt: new Date(acquiredAt), items,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setOkMsg("Đã tạo phiếu DRAFT thành công.");
            // có thể router.push(`/admin/acquisitions/${data.id}`)
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
                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Vendor *</label>
                            <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="mt-1 w-full rounded border px-3 py-2">
                                <option value="">-- Chọn vendor --</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Ngày nhập</label>
                            <input type="datetime-local" value={acquiredAt} onChange={(e) => setAcquiredAt(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Tiền tệ</label>
                            <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="mt-1 w-full rounded border px-3 py-2">
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Loại phiếu</label>
                            <select value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 w-full rounded border px-3 py-2">
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium">Ghi chú</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 min-h-[80px]" />
                        </div>
                    </div>
                </div>

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
                                            <td className="px-3 py-2 text-right">{money.toLocaleString("vi-VN")} {currency}</td>
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
                                    <td className="px-3 py-3 text-right font-semibold">{total.toLocaleString("vi-VN")} {currency}</td>
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
