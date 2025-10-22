'use client';

import { useState } from 'react';

interface Option {
    label: string;
    value: string;
}

interface Brand {
    id: string;
    name: string;
}

interface Props {
    brands: Brand[];
    statusOptions: Option[];
    typeOptions: Option[];
    caseOptions: Option[];
    selectedType: string;
}

export default function NewProductForm2({
    brands,
    statusOptions,
    typeOptions,
    caseOptions,
    selectedType,
}: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                </>
            )}

            {selectedType === 'STRAP' && (
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

            {selectedType === 'PART' && (
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

            <button type="submit" className="rounded bg-black text-white px-5 py-2 hover:bg-gray-800">
                Lưu sản phẩm
            </button>
        </form>
    );
}
