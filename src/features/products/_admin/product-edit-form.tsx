'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/app/admin/products/components/ImagePicker';

type Picked = { key: string; url: string };
interface Option { label: string; value: string }
interface Brand { id: string; name: string }
interface Vendor { id: string; name: string }
interface Complication { id: string; name: string }
const isPrimitive = (v: any) => v === null || (typeof v !== "object" && typeof v !== "function");
// helpers
const PRODUCT_KEYS = [
    "title", "brandId", "description", "vendorId", "currency",
    "status", "type", "primaryImageUrl", "seoTitle", "seoDescription",
    "isStockManaged", "maxQtyPerOrder", "tag", "complicationIds", "images",
];

const WATCHSPEC_KEYS = [
    "model", "year", "caseType", "gender", "length", "width", "thickness",
    "movement", "caliber", "caseMaterial", "dialColor", "strap", "glass",
    "boxIncluded", "bookletIncluded",
];

const pickKeys = (obj: Record<string, any>, keys: string[]) =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));

const isEmpty = (o: any) => !o || Object.keys(o).length === 0;

function sanitizeDeep<T extends Record<string, any>>(obj: T | undefined) {
    if (!obj) return undefined;
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v === "" || v === null) continue;
        out[k] = v;
    }
    return isEmpty(out) ? undefined : out;
}


const isEqualShallow = (a: any, b: any) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => JSON.stringify(v) === JSON.stringify(b[i]));
    }
    return a === b;
};


function diffFlat(from: Record<string, any>, to: Record<string, any>) {
    const out: Record<string, any> = {};
    const keys = Array.from(new Set([...Object.keys(from ?? {}), ...Object.keys(to ?? {})]));
    for (const k of keys) {
        const a = from?.[k];
        const b = to?.[k];
        if (!isEqualShallow(a, b)) {
            if (isPrimitive(b) || Array.isArray(b)) out[k] = b;
            else out[k] = b; // if you later nest objects in state, keep as-is
        }
    }
    return out;
}


function sanitize(obj: Record<string, any>) {
    const o: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v === "" || v === null) continue; // drop null/empty
        o[k] = v;
    }
    return o;
}


function normalizeInitial(initial: any) {
    const firstVariant = initial?.variants?.[0] ?? null;
    return {
        ...initial,
        // flatten complications to complicationIds for checkboxes UI
        complicationIds:
            initial?.complications?.map((c: any) => c.id) ?? initial?.complicationIds ?? [],
        // normalize images for ImagePicker
        images: (initial?.images ?? initial?.image ?? []).map((img: any, i: number) => ({
            fileKey: img.fileKey ?? img.key,
            alt: img.alt ?? null,
            sortOrder: img.sortOrder ?? i,
            url: img.url,
        })),
        // flatten first variant's price for the sidebar input
        variantId: firstVariant?.id ?? undefined,
        variantPrice: firstVariant?.price ?? undefined,
    };
}
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
    const normalizedInitial = useMemo(() => normalizeInitial(initial), [initial]);
    const snapshotRef = useRef<any>(normalizedInitial);
    // Khởi tạo formData từ initial + mảng complicationIds
    const [formData, setFormData] = useState<Record<string, any>>(normalizedInitial);
    // Khởi tạo ảnh đã có
    const [images, setImages] = useState<Picked[]>(
        (normalizedInitial.images ?? []).map((img: any) => ({ key: img.fileKey, url: img.url }))
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
            const changed = diffFlat(snapshotRef.current, formData);
            const productPart = pickKeys(changed, PRODUCT_KEYS);
            const watchSpecPart = pickKeys(changed, WATCHSPEC_KEYS);


            // map to backend DTO shape (flat → nested) if needed
            const variantsPart =
                changed.variantPrice !== undefined
                    ? [{ id: formData.variantId, price: formData.variantPrice }]
                    : undefined;


            const body = {
                product: sanitizeDeep(productPart),
                watchSpec: sanitizeDeep(watchSpecPart),
                variants: variantsPart, // để undefined nếu không đổi giá
            };


            const res = await fetch(`/api/admin/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });


            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt);
            }


            // update snapshot so further edits only send newly changed fields
            snapshotRef.current = formData;
            router.push("/admin/products");
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
                                    name="purchasePrice"
                                    value={formData.purchasePrice ?? ''}
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
                                    value={formData.variants.price ?? ''}
                                    onChange={set('price')}
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
