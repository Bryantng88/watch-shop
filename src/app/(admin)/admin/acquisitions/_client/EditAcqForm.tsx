import { useState } from "react";

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
            <table>
                <thead>
                    <tr>
                        <th>Tên SP</th><th>SL</th><th>Đơn giá</th><th>Loại</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {lines.map((ln, idx) => (
                        <tr key={ln.id || idx}>
                            <td>
                                <input value={ln.title} onChange={e => setLine(ln.id, "title", e.target.value)} />
                            </td>
                            <td>
                                <input type="number" value={ln.quantity}
                                    onChange={e => setLine(ln.id, "quantity", Number(e.target.value))} />
                            </td>
                            <td>
                                <input type="number" value={ln.unitCost}
                                    onChange={e => setLine(ln.id, "unitCost", Number(e.target.value))} />
                            </td>
                            <td>
                                <select value={ln.productType}
                                    onChange={e => setLine(ln.id, "productType", e.target.value)}>
                                    {productTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </td>
                            <td>
                                <button type="button" onClick={() => removeLine(ln.id)}>Xoá</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="button" onClick={addLine}>+ Thêm dòng</button>

            {err && <div className="text-red-600">{err}</div>}
            {okMsg && <div className="text-green-600">{okMsg}</div>}
            <button type="submit" disabled={saving}>Lưu</button>
        </form>
    );
}
