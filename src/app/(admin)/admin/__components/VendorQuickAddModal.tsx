"use client";
import { useState } from "react";

export default function VendorQuickAddModal({
    onClose,
    onAdded,
}: {
    onClose: () => void;
    onAdded: (vendor: { id: string; name: string }) => void;
}) {
    const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/vendors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Lỗi tạo vendor");
            onAdded(json);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg w-[400px] p-5 space-y-4">
                <h3 className="font-semibold text-lg">Thêm Vendor mới</h3>

                <div className="space-y-2">
                    <input name="name" placeholder="Tên vendor" onChange={handleChange} className="border rounded px-3 py-2 w-full" />
                    <input name="phone" placeholder="Số điện thoại" onChange={handleChange} className="border rounded px-3 py-2 w-full" />
                    <input name="email" placeholder="Email (tuỳ chọn)" onChange={handleChange} className="border rounded px-3 py-2 w-full" />
                    <input name="note" placeholder="Ghi chú (tuỳ chọn)" onChange={handleChange} className="border rounded px-3 py-2 w-full" />
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="border px-3 py-2 rounded text-sm">
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-black text-white px-3 py-2 rounded text-sm"
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
}
