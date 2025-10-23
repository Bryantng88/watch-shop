'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

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

interface Props {
    vendors: Vendor[]
    brands: Brand[];
    statusOptions: Option[];
    typeOptions: Option[];
    caseOptions: Option[];
    selectedType: string;
}

export default function NewProductForm2({ vendors, brands, statusOptions, typeOptions, caseOptions, selectedType,
}: Props) {

    const [formData, setFormData] = useState<Record<string, any>>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* COMMON FIELDS */}
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
                <select name="brandId" onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
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
                <input type="number" className="mt-1 w-full rounded border px-3 py-2" onChange={set('price')} />

            </div>
            {/* DYNAMIC FORM SECTION */}
            {selectedType === 'WATCH' && (
                <>
                    <h3 className="font-semibold text-sm mt-4">Thông số đồng hồ</h3>
                    <div>
                        <label>Chiều dài (mm)</label>
                        <input name="length" onChange={handleChange} className="block w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label>Loại vỏ</label>
                        <select name="caseType" onChange={handleChange} className="block w-full border rounded px-3 py-2">
                            {caseOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-gray-600">Trạng thái</label>
                        <select
                            className="h-10 w-full rounded border px-2 text-sm"

                            onChange={handleChange}
                        >
                            {statusOptions.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {selectedType === 'WATCH_STRAP' && (
                <>
                    <h3 className="font-semibold text-sm mt-4">Thông tin dây</h3>
                    <div>
                        <label>Chất liệu</label>
                        <input name="material" onChange={handleChange} className="block w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label>Kích thước</label>
                        <input name="size" onChange={handleChange} className="block w-full border rounded px-3 py-2" />
                    </div>
                </>
            )}

            {selectedType === 'PARTS' && (
                <>
                    <h3 className="font-semibold text-sm mt-4">Thông tin linh kiện</h3>
                    <div>
                        <label>Mã linh kiện</label>
                        <input name="partCode" onChange={handleChange} className="block w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label>Tương thích với</label>
                        <input name="compatibleModels" onChange={handleChange} className="block w-full border rounded px-3 py-2" />
                    </div>
                </>
            )}

            <div className="rounded-md border p-4">
                <div className="font-medium mb-2">Ghi nhận mua vào</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Vendor</label>
                        <div className="flex gap-2">
                            <select className="mt-1 w-full rounded border px-3 py-2"
                                onChange={set('vendorId')}
                                value={formData.vendorId ?? ''}>
                                <option value="">-- Chọn Vendor có sẵn --</option>
                                {vendors.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            <button type="button" className="mt-1 rounded border px-3"
                                onClick={() => setShowQuickVendor(v => !v)}>
                                {showQuickVendor ? 'Ẩn' : 'Thêm nhanh'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Giá mua</label>
                        <input type="number" className="mt-1 w-full rounded border px-3 py-2" onChange={set('purchasePrice')} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tiền tệ</label>
                        <input className="mt-1 w-full rounded border px-3 py-2" defaultValue="VND" onChange={set('currency')} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Ngày mua</label>
                        <input type="date" className="mt-1 w-full rounded border px-3 py-2"
                            defaultValue={formData.acquiredAt} onChange={set('acquiredAt')} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Ref/Invoice No</label>
                        <input className="mt-1 w-full rounded border px-3 py-2" onChange={set('refNo')} />
                    </div>
                </div>

                {showQuickVendor && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded">
                        <div>
                            <label className="block text-sm font-medium">Tên vendor (quick add)</label>
                            <input className="mt-1 w-full rounded border px-3 py-2" onChange={set('vendorName')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Điện thoại</label>
                            <input className="mt-1 w-full rounded border px-3 py-2" onChange={set('vendorPhone')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input className="mt-1 w-full rounded border px-3 py-2" onChange={set('vendorEmail')} />
                        </div>
                    </div>
                )}
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <div className="flex justify-end gap-3">
                <button type="button" className="h-10 rounded border px-4" onClick={() => history.back()} disabled={submitting}>
                    Hủy
                </button>
                <button type="submit" className="h-10 rounded bg-black px-5 text-white disabled:opacity-60" disabled={submitting}>
                    {submitting ? 'Đang lưu…' : 'Lưu & quay lại'}
                </button>
            </div>
        </form>
    );
}
