'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ImagePicker from '@/app/(admin)/admin/products/_components/ImagePicker';


type Picked = { key: string; url: string };

interface Option {
    label: string;
    value: string;
}

interface Brand {
    id: string;
    name: string;
}
interface Vendor {
    id: string;
    name: string;
}
interface Complications {
    id: string;
    name: string;
}
interface Props {
    vendors: Vendor[]
    brands: Brand[];
    statusOptions: Option[];
    typeOptions: Option[];
    caseOptions: Option[];
    movementOptions: Option[];
    complicationOptions: Complications[];
    selectedType: string;
}

export default function NewProductForm2({ vendors, brands, statusOptions, complicationOptions, movementOptions, typeOptions, caseOptions, selectedType,
}: Props) {
    const [images, setImages] = useState<Picked[]>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const toggleComp = (id: string) => {
        setFormData(prev => {
            const arr: string[] = prev.complicationIds ?? [];
            return arr.includes(id)
                ? { ...prev, complicationIds: arr.filter(x => x !== id) }
                : { ...prev, complicationIds: [...arr, id] };
        });
    };
    const watchFields = [
        { name: "length", label: "Chiều dài (mm)", type: "number" },
        { name: "width", label: "Chiều rộng (mm)", type: "number" },
        { name: "thickness", label: "Dày (mm)", type: "number" },
        { name: "gender", label: "Cho nam/nữ", type: "text" },
        { name: "box", label: "Box", type: "text" },
        { name: "Card", label: "Card", type: "text" },
        { name: "", label: "Glass", type: "text" },

        {
            name: "caseType",
            label: "Loại vỏ",
            type: "select",
            options: caseOptions,
        },
        {
            name: "movement",
            label: "Movement",
            type: "select",
            options: movementOptions,
        },
    ];


    const [showQuickVendor, setShowQuickVendor] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const set = (name: string) => (e: any) =>
        setFormData(prev => ({ ...prev, [name]: e?.target ? e.target.value : e }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            alert('Tạo sản phẩm thất bại');
            return;
        }

        alert('Tạo sản phẩm thành công');
    };
    const onImagesChange = (next: Picked[]) => {
        setImages(next);
        setFormData(prev => ({
            ...prev,
            image: next.map((p, i) => ({ fileKey: p.key, alt: null, sortOrder: i })),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID 2 CỘT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: PRODUCT FORM */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="rounded-md border border-gray-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] overflow-hidden p-5 space-y-4">
                        <h3 className="font-semibold">Thông tin sản phẩm</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

                            <div>
                                <label className="block text-sm font-medium">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    name="title"
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Thương hiệu</label>
                                <select
                                    name="brandId"
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                >
                                    <option value="">-- Chọn thương hiệu --</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Giá bán</label>
                                <input
                                    type="number"
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    onChange={set("price")}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Mô tả sản phẩm</label>
                            <textarea
                                name="description"
                                //onChange={handleChange /* hoặc set('description') */}
                                placeholder="Mô tả ngắn gọn về sản phẩm, điểm nổi bật, tình trạng..."
                                className="mt-1 w-full rounded border px-3 py-2 min-h-[120px]"
                            />
                            {/* Nếu muốn: ghi chú nhỏ dưới ô mô tả */}
                            {/* <p className="mt-1 text-xs text-gray-500">Gợi ý: 3–6 câu, nêu rõ tình trạng & phụ kiện đi kèm.</p> */}
                        </div>


                    </div>

                    {/* WATCH ONLY */}
                    {selectedType === "WATCH" && (
                        <div className="rounded-md border border-gray-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] overflow-hidden p-5 space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                                {/* LEFT SIDE (2/3) */}
                                <div className="lg:col-span-2 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {watchFields.slice(0, 3).map((f) => (
                                            <div key={f.name}>
                                                <label className="block text-sm text-gray-600">
                                                    {f.label}
                                                </label>
                                                <input
                                                    type={f.type}
                                                    name={f.name}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border rounded px-3 py-2"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {watchFields.slice(3).map((f) =>
                                            f.type === "select" ? (
                                                <div key={f.name}>
                                                    <label className="block text-sm text-gray-600">
                                                        {f.label}
                                                    </label>
                                                    <select
                                                        name={f.name}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full border rounded px-3 py-2"
                                                    >
                                                        {f.options?.map((o) => (
                                                            <option key={o.value} value={o.value}>
                                                                {o.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div key={f.name}>
                                                    <label className="block text-sm text-gray-600">
                                                        {f.label}
                                                    </label>
                                                    <input
                                                        type={f.type}
                                                        name={f.name}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full border rounded px-3 py-2"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* IMAGE PICKER */}

                                </div>

                                {/* RIGHT SIDE (1/3) - COMPLICATIONS */}
                                <div className="rounded-md border border-gray-200 bg-white shadow-sm p-5 space-y-3">
                                    <h3 className="font-semibold mb-2">Complications</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[330px] overflow-auto">
                                        {complicationOptions.map((c) => (
                                            <label key={c.id} className="inline-flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={(formData.complicationIds ?? []).includes(c.id)}
                                                    onChange={() => toggleComp(c.id)}
                                                />
                                                <span className="text-sm">{c.name}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {(formData.complicationIds ?? []).length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {complicationOptions
                                                .filter((o) =>
                                                    (formData.complicationIds ?? []).includes(o.id)
                                                )
                                                .map((o) => (
                                                    <span
                                                        key={o.id}
                                                        className="px-2 py-1 text-xs rounded bg-gray-100 border"
                                                    >
                                                        {o.name}
                                                    </span>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6">
                                <ImagePicker value={images} onChange={onImagesChange} />
                            </div>
                        </div>
                    )}
                    {/* WATCH_STRAP */}
                    {selectedType === "WATCH_STRAP" && (
                        <div className="rounded-md border p-4 space-y-4">
                            <h3 className="font-semibold">Thông tin dây</h3>
                            <div>
                                <label>Chất liệu</label>
                                <input
                                    name="material"
                                    onChange={handleChange}
                                    className="block w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>
                            <div>
                                <label>Kích thước</label>
                                <input
                                    name="size"
                                    onChange={handleChange}
                                    className="block w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* PARTS */}
                    {selectedType === "PARTS" && (
                        <div className="rounded-md border p-4 space-y-4">
                            <h3 className="font-semibold">Thông tin linh kiện</h3>
                            <div>
                                <label>Mã linh kiện</label>
                                <input
                                    name="partCode"
                                    onChange={handleChange}
                                    className="block w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>
                            <div>
                                <label>Tương thích với</label>
                                <input
                                    name="compatibleModels"
                                    onChange={handleChange}
                                    className="block w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* ẢNH */}

                </div>


                {/* RIGHT: SIDEBAR */}
                <aside className="lg:col-span-4 b space-y-6 lg:sticky lg:top-6">
                    {/* COMPLICATIONS */}

                    {/* PURCHASE / ACQUISITION */}
                    <div className="rounded-md border border-gray-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] overflow-hidden p-5 space-y-4">
                        <h3 className="font-semibold ">Phiếu nhập hàng</h3>

                        <div>
                            <label className="block text-sm font-medium">Vendor</label>
                            <div className="flex gap-2">
                                <select
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    onChange={set("vendorId")}
                                    value={formData.vendorId ?? ""}
                                >
                                    <option value="">-- Chọn Vendor có sẵn --</option>
                                    {vendors.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="mt-1 rounded-md border border-gray-300 bg-[#11191f]  text-gray-200 text-sm px-3 py-2 font-medium shadow-sm"
                                    onClick={() => setShowQuickVendor(v => !v)}
                                >
                                    {showQuickVendor ? "Ẩn" : "Thêm nhanh"}
                                </button>
                            </div>
                        </div>

                        {showQuickVendor && (
                            <div className="mt-2 grid grid-cols-1 gap-3 bg-gray-50 p-3 rounded">
                                <div>
                                    <label className="block text-sm font-medium">Tên vendor (quick add)</label>
                                    <input className="mt-1 w-full rounded border px-3 py-2" onChange={set("vendorName")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Điện thoại</label>
                                    <input className="mt-1 w-full rounded border px-3 py-2" onChange={set("vendorPhone")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <input className="mt-1 w-full rounded border px-3 py-2" onChange={set("vendorEmail")} />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Giá nhập</label>
                                <input
                                    type="number"
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    onChange={set("purchasePrice")}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Tiền tệ</label>
                                <input
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    defaultValue="VND"
                                    onChange={set("currency")}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Ngày mua</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    defaultValue={formData.acquiredAt}
                                    onChange={set("acquiredAt")}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Ghi chú</label>
                                <textarea
                                    className="mt-1 w-full rounded border px-3 py-2 min-h-[80px]"
                                    placeholder="Ghi chú thêm về đợt nhập hàng (nếu có)..."
                                    onChange={set("notes")}
                                />
                            </div>
                        </div>

                    </div>


                </aside>
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="mt-1 rounded-md   border px-3 py-2"
                    onClick={() => history.back()}
                    disabled={submitting}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="mt-1 rounded-md border border-gray-300 bg-[#11191f]  text-gray-200 text-sm px-3 py-2 font-medium shadow-sm"
                    disabled={submitting}
                >
                    {submitting ? "Đang lưu…" : "Lưu & quay lại"}
                </button>
            </div>
        </form >
    );
}
