'use client';

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/app/(admin)/admin/products/_components/ImagePicker';

type Picked = { key: string; url: string };
type Option = { label: string; value: string };
type Brand = { id: string; name: string };
type Vendor = { id: string; name: string };
type Complication = { id: string; name: string };

type Props = {
    initial: any;
    brands?: Brand[];
    vendors?: Vendor[];
    productStatusOptions?: Option[];
    availabilityStatusOptions?: Option[];
    typeOptions?: Option[];
    caseOptions?: Option[];
    movementOptions?: Option[];
    caseMaterialOptions?: Option[];
    genderOptions?: Option[];
    strapOptions?: Option[];
    glassOptions?: Option[];
    goldColorOptions?: Option[];
    complicationOptions?: Complication[];
};

const PRODUCT_KEYS = [
    'title',
    'brandId',
    'description',
    'vendorId',
    'status',
    'type',
    'primaryImageUrl',
    'seoTitle',
    'seoDescription',
    'isStockManaged',
    'maxQtyPerOrder',
    'tag',
] as const;

const WATCHSPEC_KEYS = [
    'ref',
    'model',
    'year',
    'caseType',
    'gender',
    'movement',
    'caliber',
    'caseMaterial',
    'goldKarat',
    'goldColor',
    'caseSize',
    'length',
    'width',
    'thickness',
    'dialColor',
    'strap',
    'glass',
    'boxIncluded',
    'bookletIncluded',
    'cardIncluded',
] as const;

const VARIANT_KEYS = [
    'variantStockQty',
    'variantAvailabilityStatus',
    'variantPrice',
    'variantSalePrice',
] as const;

const pickKeys = (obj: Record<string, any>, keys: readonly string[]) =>
    Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => keys.includes(k)));

const isPrimitive = (v: any) => v === null || (typeof v !== 'object' && typeof v !== 'function');

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
            out[k] = isPrimitive(b) || Array.isArray(b) ? b : b;
        }
    }

    return out;
}

function sanitizeDeep<T extends Record<string, any>>(obj: T | undefined) {
    if (!obj) return undefined;

    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v === '' || v === null || v === undefined) continue;
        out[k] = v;
    }

    return Object.keys(out).length ? out : undefined;
}

function mergeCurrentValueOption(options: Option[] | undefined, value: any) {
    const base = Array.isArray(options) ? options : [];
    if (value === null || value === undefined || value === '') return base;

    const strValue = String(value);
    const existed = base.some((opt) => String(opt.value) === strValue);
    if (existed) return base;

    return [{ label: strValue, value: strValue }, ...base];
}

function normalizeInitial(initial: any) {
    const firstVariant = initial?.variants?.[0] ?? null;
    const ws = initial?.watchSpec ?? {};
    const complicationIds =
        ws?.complication?.map((c: any) => c.id) ??
        initial?.complications?.map((c: any) => c.id) ??
        [];

    const images = (initial?.images ?? initial?.image ?? []).map((img: any, i: number) => ({
        fileKey: img.fileKey ?? img.key,
        alt: img.alt ?? null,
        sortOrder: img.sortOrder ?? i,
        url: img.url,
    }));

    return {
        ...initial,
        ...ws,
        complicationIds,
        images,
        variantId: firstVariant?.id ?? undefined,
        variantStockQty: firstVariant?.stockQty ?? 0,
        variantAvailabilityStatus: firstVariant?.availabilityStatus ?? '',
        variantPrice: firstVariant?.price != null ? Number(firstVariant.price) : '',
        variantSalePrice: firstVariant?.salePrice != null ? Number(firstVariant.salePrice) : '',
        primaryImageUrl: initial?.primaryImageUrl ?? images?.[0]?.fileKey ?? '',
    };
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div>
            <div className="text-base font-semibold text-gray-900">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-gray-500">{subtitle}</div> : null}
        </div>
    );
}

function InputField({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
}: {
    label: string;
    name: string;
    value: any;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                name={name}
                type={type}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                className="mt-1 block w-full rounded border px-3 py-2"
            />
        </div>
    );
}

function SelectField({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder,
}: {
    label: string;
    name: string;
    value: any;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options?: Option[];
    placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                name={name}
                value={value ?? ''}
                onChange={onChange}
                className="mt-1 block w-full rounded border px-3 py-2"
            >
                <option value="">{placeholder ?? '-- Chọn --'}</option>
                {(options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default function EditProductForm({
    initial,
    brands = [],
    vendors = [],
    productStatusOptions = [],
    availabilityStatusOptions = [],
    typeOptions = [],
    caseOptions = [],
    movementOptions = [],
    caseMaterialOptions = [],
    genderOptions = [],
    strapOptions = [],
    glassOptions = [],
    goldColorOptions = [],
    complicationOptions = [],
}: Props) {
    const router = useRouter();
    const id: string = initial?.id;
    const normalizedInitial = useMemo(() => normalizeInitial(initial), [initial]);
    const snapshotRef = useRef<any>(normalizedInitial);

    const [formData, setFormData] = useState<Record<string, any>>(normalizedInitial);
    const [images, setImages] = useState<Picked[]>(
        (normalizedInitial.images ?? []).map((img: any) => ({
            key: img.fileKey,
            url: img.url,
        }))
    );
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const safeProductStatusOptions = useMemo(
        () => mergeCurrentValueOption(productStatusOptions, formData.status),
        [productStatusOptions, formData.status]
    );

    const safeAvailabilityOptions = useMemo(
        () => mergeCurrentValueOption(availabilityStatusOptions, formData.variantAvailabilityStatus),
        [availabilityStatusOptions, formData.variantAvailabilityStatus]
    );

    const safeTypeOptions = useMemo(
        () => mergeCurrentValueOption(typeOptions, formData.type),
        [typeOptions, formData.type]
    );

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        const nextValue =
            type === 'number'
                ? value === ''
                    ? ''
                    : Number(value)
                : type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : value;

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
        }));
    };

    const toggleComp = (cid: string) => {
        setFormData((prev) => {
            const arr: string[] = prev.complicationIds ?? [];
            return arr.includes(cid)
                ? { ...prev, complicationIds: arr.filter((x) => x !== cid) }
                : { ...prev, complicationIds: [...arr, cid] };
        });
    };

    const onImagesChange = (next: Picked[]) => {
        setImages(next);
        setFormData((prev) => ({
            ...prev,
            images: next.map((p, i) => ({
                fileKey: p.key,
                alt: null,
                sortOrder: i,
            })),
            primaryImageUrl: next[0]?.key ?? '',
        }));
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErr(null);

        try {
            const changed = diffFlat(snapshotRef.current, formData);
            const productPart = pickKeys(changed, PRODUCT_KEYS);
            const watchSpecRaw = pickKeys(changed, WATCHSPEC_KEYS);
            const variantRaw = pickKeys(changed, VARIANT_KEYS);

            const watchSpecPart = sanitizeDeep(watchSpecRaw)
                ? {
                    ref: watchSpecRaw.ref,
                    model: watchSpecRaw.model,
                    year: watchSpecRaw.year,
                    caseType: watchSpecRaw.caseType,
                    gender: watchSpecRaw.gender,
                    movement: watchSpecRaw.movement,
                    caliber: watchSpecRaw.caliber,
                    caseMaterial: watchSpecRaw.caseMaterial,
                    goldKarat: watchSpecRaw.goldKarat,
                    goldColor: watchSpecRaw.goldColor,
                    caseSize: watchSpecRaw.caseSize,
                    length: watchSpecRaw.length,
                    width: watchSpecRaw.width,
                    thickness: watchSpecRaw.thickness,
                    dialColor: watchSpecRaw.dialColor,
                    strap: watchSpecRaw.strap,
                    glass: watchSpecRaw.glass,
                    boxIncluded: watchSpecRaw.boxIncluded,
                    bookletIncluded: watchSpecRaw.bookletIncluded,
                    cardIncluded: watchSpecRaw.cardIncluded,
                    complicationIds: formData.complicationIds ?? [],
                }
                : !isEqualShallow(snapshotRef.current.complicationIds, formData.complicationIds)
                    ? { complicationIds: formData.complicationIds ?? [] }
                    : undefined;

            const variantPart = sanitizeDeep(variantRaw)
                ? {
                    id: formData.variantId,
                    stockQty: variantRaw.variantStockQty,
                    availabilityStatus: variantRaw.variantAvailabilityStatus,
                    price: variantRaw.variantPrice,
                    salePrice: variantRaw.variantSalePrice,
                }
                : undefined;

            const body = {
                product: sanitizeDeep(productPart),
                watchSpec: sanitizeDeep(watchSpecPart),
                variant: sanitizeDeep(variantPart),
                images: changed.images !== undefined ? formData.images ?? [] : undefined,
            };

            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || 'Cập nhật sản phẩm thất bại');
            }

            snapshotRef.current = formData;
            router.push('/admin/products');
        } catch (e: any) {
            setErr(e?.message || 'Cập nhật sản phẩm thất bại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-6">
                <div className="space-y-5 rounded-md border border-gray-200 bg-white p-5 shadow">
                    <SectionTitle
                        title="Chỉnh sửa sản phẩm"
                        subtitle="Bổ sung đầy đủ thông tin cơ bản, variant và watch spec để sản phẩm sẵn sàng đăng."
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InputField
                            label="Tên sản phẩm"
                            name="title"
                            value={formData.title}
                            onChange={handleChange as any}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Thương hiệu
                            </label>
                            <select
                                name="brandId"
                                value={formData.brandId ?? ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded border px-3 py-2"
                            >
                                <option value="">-- Chọn thương hiệu --</option>
                                {(brands ?? []).map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Vendor
                            </label>
                            <select
                                name="vendorId"
                                value={formData.vendorId ?? ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded border px-3 py-2"
                            >
                                <option value="">-- Chọn vendor --</option>
                                {(vendors ?? []).map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <SelectField
                            label="Loại sản phẩm"
                            name="type"
                            value={formData.type}
                            onChange={handleChange as any}
                            options={safeTypeOptions}
                            placeholder="-- Chọn loại --"
                        />
                        <SelectField
                            label="Trạng thái"
                            name="status"
                            value={formData.status}
                            onChange={handleChange as any}
                            options={safeProductStatusOptions}
                            placeholder="-- Chọn trạng thái --"
                        />
                        <InputField
                            label="SEO title"
                            name="seoTitle"
                            value={formData.seoTitle}
                            onChange={handleChange as any}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả sản phẩm
                        </label>
                        <textarea
                            name="description"
                            value={formData.description ?? ''}
                            onChange={handleChange}
                            className="mt-1 min-h-[120px] w-full rounded border px-3 py-2"
                        />
                    </div>
                </div>

                <div className="space-y-5 rounded-md border border-gray-200 bg-white p-5 shadow">
                    <SectionTitle
                        title="Product variant"
                        subtitle="Các trường này đang được dùng để kiểm tra đủ điều kiện đăng."
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                            label="Giá bán"
                            name="variantPrice"
                            value={formData.variantPrice}
                            onChange={handleChange as any}
                            type="number"
                        />
                        <InputField
                            label="Giá sale"
                            name="variantSalePrice"
                            value={formData.variantSalePrice}
                            onChange={handleChange as any}
                            type="number"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                            label="Tồn kho"
                            name="variantStockQty"
                            value={formData.variantStockQty}
                            onChange={handleChange as any}
                            type="number"
                        />
                        <SelectField
                            label="Trạng thái kho"
                            name="variantAvailabilityStatus"
                            value={formData.variantAvailabilityStatus}
                            onChange={handleChange as any}
                            options={safeAvailabilityOptions}
                            placeholder="-- Chọn trạng thái kho --"
                        />
                    </div>
                </div>

                <div className="space-y-5 rounded-md border border-gray-200 bg-white p-5 shadow">
                    <SectionTitle
                        title="Watch spec"
                        subtitle={'Bổ sung các thông số đang được dùng cho nhãn "Chưa đủ thông tin" và publish readiness.'}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InputField
                            label="Reference"
                            name="ref"
                            value={formData.ref}
                            onChange={handleChange as any}
                        />
                        <InputField
                            label="Model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange as any}
                        />
                        <InputField
                            label="Năm sản xuất"
                            name="year"
                            value={formData.year}
                            onChange={handleChange as any}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <SelectField
                            label="Dạng vỏ"
                            name="caseType"
                            value={formData.caseType}
                            onChange={handleChange as any}
                            options={caseOptions}
                            placeholder="-- Chọn dạng vỏ --"
                        />
                        <SelectField
                            label="Giới tính"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange as any}
                            options={genderOptions}
                            placeholder="-- Chọn giới tính --"
                        />
                        <SelectField
                            label="Chất liệu vỏ"
                            name="caseMaterial"
                            value={formData.caseMaterial}
                            onChange={handleChange as any}
                            options={caseMaterialOptions}
                            placeholder="-- Chọn chất liệu --"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <SelectField
                            label="Bộ máy"
                            name="movement"
                            value={formData.movement}
                            onChange={handleChange as any}
                            options={movementOptions}
                            placeholder="-- Chọn bộ máy --"
                        />
                        <InputField
                            label="Caliber"
                            name="caliber"
                            value={formData.caliber}
                            onChange={handleChange as any}
                        />
                        <InputField
                            label="Case size"
                            name="caseSize"
                            value={formData.caseSize}
                            onChange={handleChange as any}
                            placeholder="Ví dụ 39mm"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InputField
                            label="Dài"
                            name="length"
                            value={formData.length}
                            onChange={handleChange as any}
                            type="number"
                        />
                        <InputField
                            label="Rộng"
                            name="width"
                            value={formData.width}
                            onChange={handleChange as any}
                            type="number"
                        />
                        <InputField
                            label="Độ dày"
                            name="thickness"
                            value={formData.thickness}
                            onChange={handleChange as any}
                            type="number"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InputField
                            label="Màu mặt số"
                            name="dialColor"
                            value={formData.dialColor}
                            onChange={handleChange as any}
                        />
                        <SelectField
                            label="Dây / Strap"
                            name="strap"
                            value={formData.strap}
                            onChange={handleChange as any}
                            options={strapOptions}
                            placeholder="-- Chọn strap --"
                        />
                        <SelectField
                            label="Kính"
                            name="glass"
                            value={formData.glass}
                            onChange={handleChange as any}
                            options={glassOptions}
                            placeholder="-- Chọn kính --"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InputField
                            label="K vàng"
                            name="goldKarat"
                            value={formData.goldKarat}
                            onChange={handleChange as any}
                            type="number"
                        />
                        <SelectField
                            label="Màu vàng"
                            name="goldColor"
                            value={formData.goldColor}
                            onChange={handleChange as any}
                            options={goldColorOptions}
                            placeholder="-- Chọn màu vàng --"
                        />
                        <div className="rounded border bg-gray-50 px-3 py-3 text-sm text-gray-600">
                            Có thể để trống nhóm vàng nếu đồng hồ không dùng chất liệu vàng.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <label className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                name="boxIncluded"
                                checked={!!formData.boxIncluded}
                                onChange={handleChange as any}
                            />
                            Kèm hộp
                        </label>
                        <label className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                name="bookletIncluded"
                                checked={!!formData.bookletIncluded}
                                onChange={handleChange as any}
                            />
                            Kèm sổ
                        </label>
                        <label className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                name="cardIncluded"
                                checked={!!formData.cardIncluded}
                                onChange={handleChange as any}
                            />
                            Kèm thẻ
                        </label>
                    </div>
                </div>

                <div className="rounded-md border border-gray-200 bg-white p-5 shadow">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div>
                            <SectionTitle
                                title="Hình ảnh"
                                subtitle="Ảnh đầu tiên sẽ được dùng làm ảnh đại diện nếu bạn chưa chọn riêng."
                            />
                            <div className="mt-4">
                                <ImagePicker value={images} onChange={onImagesChange} />
                            </div>
                        </div>

                        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
                            <SectionTitle title="Complications" />
                            <div className="mt-4 grid max-h-72 grid-cols-1 gap-2 overflow-auto sm:grid-cols-2">
                                {(complicationOptions ?? []).map((c) => (
                                    <label
                                        key={c.id}
                                        className="inline-flex items-center gap-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={(formData.complicationIds ?? []).includes(
                                                c.id
                                            )}
                                            onChange={() => toggleComp(c.id)}
                                        />
                                        <span>{c.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {err ? <div className="text-sm text-red-600">{err}</div> : null}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="rounded-md border px-3 py-2"
                    onClick={() => router.push('/admin/products')}
                    disabled={saving}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="rounded-md border border-gray-300 bg-[#11191f] px-3 py-2 text-sm font-medium text-gray-200 shadow-sm"
                    disabled={saving}
                >
                    {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
                </button>
            </div>
        </form>
    );
}