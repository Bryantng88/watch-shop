'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/app/admin/products/components/ImagePicker';

type Picked = { key: string; url: string };
interface Option { label: string; value: string }
interface Brand { id: string; name: string }
interface Vendor { id: string; name: string }
interface Complication { id: string; name: string }

export default function EditProductForm({
    initial,
    brands, vendors,
    statusOptions, typeOptions, caseOptions, movementOptions, complicationOptions,
}: {
    initial: any;
    brands: Brand[]; vendors: Vendor[];
    statusOptions: Option[]; typeOptions: Option[];
    caseOptions: Option[]; movementOptions: Option[];
    complicationOptions: Complication[];
}) {
    const router = useRouter();

    // Lấy id từ initial (hoặc truyền qua prop riêng nếu bạn muốn)
    const id: string = initial?.id;

    // Khởi tạo formData từ initial + mảng complicationIds
    const [formData, setFormData] = useState<Record<string, any>>({
        ...initial,
        complicationIds:
            initial?.complications?.map((c: any) => c.id) ?? initial?.complicationIds ?? [],
    });

    // Khởi tạo ảnh đã có
    const [images, setImages] = useState<Picked[]>(
        (initial?.images ?? initial?.image ?? []).map((img: any) => ({
            key: img.fileKey ?? img.key,
            url: img.url,
        }))
    );

    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
        }));
    };

    // helper set(name) cho các input “không tiêu chuẩn”
    const set = (name: string) => (e: any) =>
        setFormData(prev => ({
            ...prev,
            [name]: e?.target ? (e.target.type === 'number' ? Number(e.target.value) : e.target.value) : e,
        }));

    const toggleComp = (cid: string) => {
        setFormData(prev => {
            const arr: string[] = prev.complicationIds ?? [];
            return arr.includes(cid)
                ? { ...prev, complicationIds: arr.filter(x => x !== cid) }
                : { ...prev, complicationIds: [...arr, cid] };
        });
    };

    const onImagesChange = (next: Picked[]) => {
        setImages(next);
        setFormData(prev => ({
            ...prev,
            images: next.map((p, i) => ({
                fileKey: p.key,
                alt: null,
                sortOrder: i,
            })),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErr(null);

        try {
            // Có thể “sanitize” body nếu cần
            const body = {
                ...formData,
                price: formData.price === '' ? null : formData.price,
                purchasePrice: formData.purchasePrice === '' ? null : formData.purchasePrice,
            };

            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            router.push('/admin/products');
        } catch (e: any) {
            setErr('Cập nhật sản phẩm thất bại');
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="rounded-md border border-gray-200 bg-white shadow p-5 space-y-4">
                        <h3 className="font-semibold">Chỉnh sửa sản phẩm</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Tên sản phẩm</label>
                                <input
                                    name="title"
                                    value={formData.title ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Thương hiệu</label>
                                <select
                                    name="brandId"
                                    value={formData.brandId ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                >
                                    <option value="">-- Chọn thương hiệu --</option>
                                    {brands.map(b => (
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
                                    name="price"
                                    value={formData.price ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Mô tả sản phẩm</label>
                            <textarea
                                name="description"
                                value={formData.description ?? ''}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 min-h-[120px]"
                            />
                        </div>
                    </div>

                    {/* Ảnh + Complications */}
                    <div className="rounded-md border border-gray-200 bg-white shadow p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div>
                                <ImagePicker value={images} onChange={onImagesChange} />
                            </div>

                            <div className="rounded-md border border-gray-200 bg-white shadow p-5">
                                <h3 className="font-semibold mb-3">Complications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-auto">
                                    {complicationOptions.map(c => (
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                    <div className="rounded-md border border-gray-200 bg-white shadow p-5 space-y-4">
                        <h3 className="font-semibold">Phiếu nhập hàng</h3>

                        <div>
                            <label className="block text-sm font-medium">Vendor</label>
                            <div className="flex gap-2">
                                <select
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    onChange={set('vendorId')}
                                    value={formData.vendorId ?? ''}
                                >
                                    <option value="">-- Chọn Vendor --</option>
                                    {vendors.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Giá nhập</label>
                                <input
                                    type="number"
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    value={formData.purchasePrice ?? ''}
                                    onChange={set('purchasePrice')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Tiền tệ</label>
                                <input
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    value={formData.currency ?? 'VND'}
                                    onChange={set('currency')}
                                />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="mt-1 rounded-md border px-3 py-2"
                    onClick={() => router.push('/admin/products')}
                    disabled={saving}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="mt-1 rounded-md border border-gray-300 bg-[#11191f] text-gray-200 text-sm px-3 py-2 font-medium shadow-sm"
                    disabled={saving}
                >
                    {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
                </button>
            </div>
        </form>
    );
}
