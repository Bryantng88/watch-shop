"use client";

import { useState, useMemo } from "react";

type Line = {
    id?: string;                // id có thì là item cũ, không có là mới
    title: string;
    quantity: number;
    unitCost: number;
    productType: string;        // thêm loại sản phẩm
};

type Props = {
    acquisition: {
        id: string;
        vendorId: string;
        acquiredAt: string;
        notes: string;
        currency: string;
        type: string;
        // ... các field khác
    };
    items: Line[];
    vendors: { id: string, name: string }[];
    productTypes: string[]; // ["WATCH", "BOX", ...]
};

export default function EditAcqForm({ acquisition, items: initialItems, vendors, productTypes }: Props) {
    const [formData, setFormData] = useState({ ...acquisition });
    const [lines, setLines] = useState<Line[]>(initialItems);
    const [removedIds, setRemovedIds] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    const setLine = (id: string | undefined, key: keyof Line, val: any) => {
        setLines(ls => ls.map(l => l.id === id ? { ...l, [key]: val } : l));
    };
    const total = useMemo(
        () => lines.reduce((s, l) => (Number(l.quantity) || 0) * (Number(l.unitCost) || 0) + s, 0),
        [lines]
    );
    const addLine = () => setLines(ls => [
        ...ls,
        { id: undefined, title: "", quantity: 1, unitCost: 0, productType: productTypes[0] }
    ]);

    const removeLine = (id?: string) => {
        if (id) setRemovedIds(ids => [...ids, id]);
        setLines(ls => ls.filter(l => l.id !== id));
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null); setOkMsg(null); setSaving(true);

        if (!formData.vendorId) {
            setErr("Phải chọn vendor."); setSaving(false); return;
        }

        const items = lines
            .map(l => ({
                ...l,
                quantity: Number(l.quantity) || 0,
                unitCost: Number(l.unitCost) || 0,
            }))
            .filter(l => l.title && l.quantity > 0);

        if (!items.length) {
            setErr("Phải có ít nhất 1 sản phẩm hợp lệ."); setSaving(false); return;
        }

        try {
            const res = await fetch(`/api/admin/acquisitions/${acquisition.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items,
                    removedIds
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            setOkMsg("Đã cập nhật phiếu nhập!");
        } catch (e: any) {
            setErr(e?.message || "Lỗi cập nhật");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* ... các trường thông tin chung phiếu nhập ... */}
            <select value={formData.vendorId} onChange={e => setFormData(f => ({ ...f, vendorId: e.target.value }))}>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            {/* ... các field khác ... */}

            <h3 className="font-bold mt-4">Dòng sản phẩm</h3>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow border mt-2">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-3 font-semibold text-left rounded-tl-lg">Tên SP</th>
                            <th className="px-3 py-3 font-semibold text-left">Loại SP</th>
                            <th className="px-2 py-3 font-semibold text-center">SL</th>
                            <th className="px-4 py-3 font-semibold text-right">Đơn giá</th>
                            <th className="px-4 py-3 font-semibold text-right">Thành tiền</th>
                            <th className="px-2 py-3 rounded-tr-lg"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.map((ln, idx) => {
                            const money = (Number(ln.quantity) || 0) * (Number(ln.unitCost) || 0);
                            return (
                                <tr
                                    key={ln.id}
                                    className="hover:bg-gray-50 border-b last:border-b-0 transition"
                                >
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            placeholder="Tên sản phẩm"
                                            value={ln.title}
                                            onChange={e => setLine(ln.id, "title", e.target.value)}
                                            className="w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            value={ln.productType}
                                            onChange={e => setLine(ln.id, "productType", e.target.value as any)}
                                            className="w-full border rounded-md px-2 py-1 bg-white"
                                        >
                                            {Object.values(productTypes).map(t => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <input
                                            type="number"
                                            min={1}
                                            value={ln.quantity}
                                            onChange={e => setLine(ln.id, "quantity", Number(e.target.value))}
                                            className="w-14 border rounded-md px-2 py-1 text-center focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={ln.unitCost}
                                            onChange={e => setLine(ln.id, "unitCost", Number(e.target.value))}
                                            className="w-24 border rounded-md px-2 py-1 text-right focus:outline-none"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {money.toLocaleString("vi-VN")} {formData.currency}
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <button
                                            type="button"
                                            className="text-red-600 font-semibold hover:underline hover:text-red-800"
                                            onClick={() => removeLine(ln.id)}
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
                            <td className="px-4 py-3 font-semibold text-right" colSpan={4}>
                                Tổng cộng
                            </td>
                            <td className="px-4 py-3 font-semibold text-right">
                                {total.toLocaleString("vi-VN")} {formData.currency}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                <div className="mt-3">
                    <button
                        type="button"
                        className="text-blue-600 hover:underline font-medium"
                        onClick={addLine}
                    >
                        + Thêm dòng
                    </button>
                </div>
            </div>



            {err && <div className="text-red-600">{err}</div>}
            {okMsg && <div className="text-green-600">{okMsg}</div>}
            <button type="submit" disabled={saving}>Lưu</button>
        </form>
    );
}
