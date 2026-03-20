'use client';

import {
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/app/(admin)/admin/products/_components/ImagePicker';

type Picked = { key: string; url: string };
type Option = { label: string; value: string };
type Brand = { id: string; name: string };
type Vendor = { id: string; name: string };
type Complication = { id: string; name: string };
type CategoryOption = { id: string; name: string; scope: string };
type StrapInventoryItem = {
    productId: string;
    variantId: string;
    title: string;
    vendorName?: string | null;
    stockQty: number;
    availabilityStatus?: string | null;
    price?: number | null;
    costPrice?: number | null;
    strapSpec?: {
        lugWidthMM?: number | null;
        buckleWidthMM?: number | null;
        color?: string | null;
        material?: string | null;
        quickRelease?: boolean | null;
    } | null;
};

type Props = {
    initial: any;
    brands?: Brand[];
    vendors?: Vendor[];
    productStatusOptions?: Option[];
    typeOptions?: Option[];
    caseOptions?: Option[];
    movementOptions?: Option[];
    caseMaterialOptions?: Option[];
    genderOptions?: Option[];
    strapOptions?: Option[];
    glassOptions?: Option[];
    goldColorOptions?: Option[];
    complicationOptions?: Complication[];
    categoryOptions?: CategoryOption[];
    strapInventoryOptions?: StrapInventoryItem[];
};

const PRODUCT_KEYS = [
    'title',
    'brandId',
    'description',
    'vendorId',
    'status',
    'type',
    'categoryId',
    'primaryImageUrl',
    'seoTitle',
    'seoDescription',
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

const VARIANT_KEYS = ['variantPrice'] as const;

const REQUIRED_PRODUCT_FIELDS = new Set(['title', 'brandId', 'type', 'categoryId']);
const BASE_REQUIRED_WATCH_FIELDS = new Set([
    'ref',
    'model',
    'year',
    'caseType',
    'movement',
    'width',
    'thickness',
    'dialColor',
    'glass',
]);

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

function hasValue(value: any) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return Number.isFinite(value);
    if (typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length > 0;
    return true;
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
        categoryId: initial?.categoryId ?? initial?.ProductCategory?.id ?? '',
        caseMaterial: ws?.caseMaterial ?? 'STAINLESS_STEEL',
        variantId: firstVariant?.id ?? undefined,
        variantPrice: firstVariant?.price != null ? Number(firstVariant.price) : '',
        primaryImageUrl: initial?.primaryImageUrl ?? images?.[0]?.fileKey ?? '',
        tag: initial?.tag ?? '',
        strapMode: 'INCLUDED',
        linkedStrapProductId: '',
        linkedStrapVariantId: '',
        linkedStrapTitle: '',
        linkedStrapCostPrice: '',
    };
}

function SectionHeading({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="space-y-1.5">
            <h2 className="text-[19px] font-semibold tracking-tight text-slate-900">{title}</h2>
            {subtitle ? <p className="text-sm leading-6 text-slate-500">{subtitle}</p> : null}
        </div>
    );
}

function SectionBlock({
    children,
    compact = false,
}: {
    children: ReactNode;
    compact?: boolean;
}) {
    return (
        <div
            className={[
                'rounded-none border border-slate-200 bg-white shadow-sm',
                compact ? 'space-y-5 p-4' : 'space-y-6 p-5',
            ].join(' ')}
        >
            {children}
        </div>
    );
}

function Section({
    title,
    subtitle,
    children,
    compact = false,
}: {
    title: string;
    subtitle?: string;
    children: ReactNode;
    compact?: boolean;
}) {
    return (
        <section className="space-y-3">
            <SectionHeading title={title} subtitle={subtitle} />
            <SectionBlock compact={compact}>{children}</SectionBlock>
        </section>
    );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
    return (
        <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
            {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </label>
    );
}

function InputField({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    required,
}: {
    label: string;
    name: string;
    value: any;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div>
            <FieldLabel label={label} required={required} />
            <input
                name={name}
                type={type}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                className="block w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
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
    required,
}: {
    label: string;
    name: string;
    value: any;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options?: Option[];
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div>
            <FieldLabel label={label} required={required} />
            <select
                name={name}
                value={value ?? ''}
                onChange={onChange}
                className="block w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
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

function formatMoney(value: number | null | undefined) {
    if (value == null || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('vi-VN').format(Number(value));
}

export default function EditProductForm({
    initial,
    brands = [],
    vendors = [],
    productStatusOptions = [],
    typeOptions = [],
    caseOptions = [],
    movementOptions = [],
    caseMaterialOptions = [],
    genderOptions = [],
    strapOptions = [],
    glassOptions = [],
    goldColorOptions = [],
    complicationOptions = [],
    categoryOptions = [],
    strapInventoryOptions = [],
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

    const safeTypeOptions = useMemo(
        () => mergeCurrentValueOption(typeOptions, formData.type),
        [typeOptions, formData.type]
    );

    const safeCategoryOptions = useMemo(() => {
        const selectedType = String(formData.type ?? '').toUpperCase();
        const shouldFilter = selectedType === 'WATCH' || selectedType === 'WATCH_STRAP';

        const filtered = shouldFilter
            ? categoryOptions.filter((item) => item.scope === 'ALL' || item.scope === selectedType)
            : categoryOptions;

        const mapped = filtered.map((item) => ({
            label: item.name,
            value: item.id,
        }));

        if (!formData.categoryId) return mapped;

        const existed = mapped.some((item) => item.value === formData.categoryId);
        if (existed) return mapped;

        const current = categoryOptions.find((item) => item.id === formData.categoryId);
        return [
            {
                label: current?.name ?? String(formData.categoryId),
                value: String(formData.categoryId),
            },
            ...mapped,
        ];
    }, [categoryOptions, formData.categoryId, formData.type]);

    const safeCaseMaterialOptions = useMemo(
        () => mergeCurrentValueOption(caseMaterialOptions, formData.caseMaterial),
        [caseMaterialOptions, formData.caseMaterial]
    );

    const safeGlassOptions = useMemo(
        () => mergeCurrentValueOption(glassOptions, formData.glass),
        [glassOptions, formData.glass]
    );

    const isRoundCase = String(formData.caseType ?? '').toUpperCase() === 'ROUND';
    const isGoldCase = String(formData.caseMaterial ?? '').toUpperCase() === 'GOLD';

    const requiredWatchFields = useMemo(() => {
        const fields = new Set(BASE_REQUIRED_WATCH_FIELDS);
        if (!isRoundCase) fields.add('length');
        if (formData.strapMode === 'INCLUDED') fields.add('strap');
        if (isGoldCase) {
            fields.add('goldKarat');
            fields.add('goldColor');
        }
        return fields;
    }, [formData.strapMode, isGoldCase, isRoundCase]);

    const selectedInventoryStrap = useMemo(
        () =>
            strapInventoryOptions.find(
                (item) => String(item.variantId) === String(formData.linkedStrapVariantId ?? '')
            ) ?? null,
        [strapInventoryOptions, formData.linkedStrapVariantId]
    );

    const inventoryStrapSelectOptions = useMemo(
        () =>
            strapInventoryOptions.map((item) => ({
                label: `${item.title} · ${item.strapSpec?.lugWidthMM ?? '—'}-${item.strapSpec?.buckleWidthMM ?? '—'} · ${item.strapSpec?.color ?? '—'} · tồn ${item.stockQty}`,
                value: item.variantId,
            })),
        [strapInventoryOptions]
    );

    const bulkPostMissing = useMemo(() => {
        const missing: string[] = [];

        if (!hasValue(formData.title)) missing.push('Tên sản phẩm');
        if (!hasValue(formData.brandId)) missing.push('Thương hiệu');
        if (!hasValue(formData.type)) missing.push('Loại sản phẩm');
        if (!hasValue(formData.categoryId)) missing.push('Category');
        if (!hasValue(formData.variantPrice) || Number(formData.variantPrice) <= 0) missing.push('Giá bán');
        if (images.length < 4) missing.push(`Tối thiểu 4 ảnh (${images.length}/4)`);

        if (!hasValue(formData.ref)) missing.push('Reference');
        if (!hasValue(formData.model)) missing.push('Model');
        if (!hasValue(formData.year)) missing.push('Năm sản xuất');
        if (!hasValue(formData.caseType)) missing.push('Dạng vỏ');
        if (!hasValue(formData.movement)) missing.push('Bộ máy');
        if (!isRoundCase && !hasValue(formData.length)) missing.push('Dài');
        if (!hasValue(formData.width)) missing.push(isRoundCase ? 'Đường kính / Rộng' : 'Rộng');
        if (!hasValue(formData.thickness)) missing.push('Độ dày');
        if (!hasValue(formData.dialColor)) missing.push('Màu mặt số');
        if (!hasValue(formData.glass)) missing.push('Kính');

        if (isGoldCase) {
            if (!hasValue(formData.goldKarat)) missing.push('K vàng');
            if (!hasValue(formData.goldColor)) missing.push('Màu vàng');
        }

        if (formData.strapMode === 'INVENTORY' && !hasValue(formData.linkedStrapVariantId)) {
            missing.push('Chọn dây trong kho');
        }
        if (formData.strapMode === 'INCLUDED' && !hasValue(formData.strap)) {
            missing.push('Loại dây đi kèm');
        }

        return missing;
    }, [formData, images.length, isGoldCase, isRoundCase]);

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

        setFormData((prev) => {
            const next = {
                ...prev,
                [name]: nextValue,
            } as Record<string, any>;

            if (name === 'caseMaterial' && String(nextValue).toUpperCase() !== 'GOLD') {
                next.goldKarat = '';
                next.goldColor = '';
            }

            return next;
        });
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

    const handleStrapModeChange = (mode: 'INCLUDED' | 'INVENTORY') => {
        setFormData((prev) => ({
            ...prev,
            strapMode: mode,
            ...(mode !== 'INVENTORY'
                ? {
                    linkedStrapProductId: '',
                    linkedStrapVariantId: '',
                    linkedStrapTitle: '',
                    linkedStrapCostPrice: '',
                }
                : {}),
        }));
    };

    const handleInventoryStrapChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextVariantId = e.target.value;
        const picked = strapInventoryOptions.find((item) => item.variantId === nextVariantId) ?? null;
        const inferredStrapType = picked?.strapSpec?.material
            ? strapOptions.find(
                (opt) => String(opt.value).toUpperCase() === String(picked.strapSpec?.material).toUpperCase()
            )?.value ?? String(picked.strapSpec.material).toUpperCase()
            : '';

        setFormData((prev) => ({
            ...prev,
            linkedStrapVariantId: nextVariantId,
            linkedStrapProductId: picked?.productId ?? '',
            linkedStrapTitle: picked?.title ?? '',
            linkedStrapCostPrice: picked?.costPrice ?? '',
            strap: inferredStrapType || prev.strap || '',
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
                    price: variantRaw.variantPrice,
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
        <form onSubmit={submit} className="space-y-8">
            <div className="rounded-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Quy ước:</span>{' '}
                <span className="text-rose-500">*</span> là các trường đang được dùng để kiểm tra readiness trước khi bulk post.
            </div>

            <div className="grid grid-cols-1 gap-7 xl:grid-cols-12">
                <div className="space-y-8 xl:col-span-8">
                    <Section
                        title="Chỉnh sửa sản phẩm"
                        subtitle="Rà soát kỹ thông tin nền tảng của sản phẩm trước khi đưa vào workflow bulk post."
                    >
                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
                            <InputField
                                label="Tên sản phẩm"
                                name="title"
                                value={formData.title}
                                onChange={handleChange as any}
                                required={REQUIRED_PRODUCT_FIELDS.has('title')}
                            />

                            <div>
                                <FieldLabel label="Thương hiệu" required={REQUIRED_PRODUCT_FIELDS.has('brandId')} />
                                <select
                                    name="brandId"
                                    value={formData.brandId ?? ''}
                                    onChange={handleChange}
                                    className="block w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
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
                                <FieldLabel label="Vendor" />
                                <select
                                    name="vendorId"
                                    value={formData.vendorId ?? ''}
                                    onChange={handleChange}
                                    className="block w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                                >
                                    <option value="">-- Chọn vendor --</option>
                                    {vendors.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
                            <SelectField
                                label="Loại sản phẩm"
                                name="type"
                                value={formData.type}
                                onChange={handleChange as any}
                                options={safeTypeOptions}
                                placeholder="-- Chọn loại --"
                                required={REQUIRED_PRODUCT_FIELDS.has('type')}
                            />
                            <SelectField
                                label="Category"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange as any}
                                options={safeCategoryOptions}
                                placeholder="-- Chọn category --"
                                required={REQUIRED_PRODUCT_FIELDS.has('categoryId')}
                            />
                            <SelectField
                                label="Trạng thái"
                                name="status"
                                value={formData.status}
                                onChange={handleChange as any}
                                options={safeProductStatusOptions}
                                placeholder="-- Chọn trạng thái --"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
                            <InputField
                                label="SEO title"
                                name="seoTitle"
                                value={formData.seoTitle}
                                onChange={handleChange as any}
                            />
                        </div>

                        <div>
                            <FieldLabel label="Mô tả sản phẩm" />
                            <textarea
                                name="description"
                                value={formData.description ?? ''}
                                onChange={handleChange}
                                className="block min-h-[140px] w-full rounded-none border border-slate-200 bg-white px-3 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </Section>

                    <Section
                        title="Watch spec"
                        subtitle='Các trường có dấu * trong block này sẽ được dùng để kiểm tra đủ thông tin trước khi bulk post.'
                    >
                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
                            <InputField
                                label="Reference"
                                name="ref"
                                value={formData.ref}
                                onChange={handleChange as any}
                                required={requiredWatchFields.has('ref')}
                            />
                            <InputField
                                label="Model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange as any}
                                required={requiredWatchFields.has('model')}
                            />
                            <InputField
                                label="Năm sản xuất"
                                name="year"
                                value={formData.year}
                                onChange={handleChange as any}
                                required={requiredWatchFields.has('year')}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
                            <SelectField
                                label="Dạng vỏ"
                                name="caseType"
                                value={formData.caseType}
                                onChange={handleChange as any}
                                options={caseOptions}
                                placeholder="-- Chọn dạng vỏ --"
                                required={requiredWatchFields.has('caseType')}
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
                                options={safeCaseMaterialOptions}
                                placeholder="-- Chọn chất liệu --"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                            <SelectField
                                label="Bộ máy"
                                name="movement"
                                value={formData.movement}
                                onChange={handleChange as any}
                                options={movementOptions}
                                placeholder="-- Chọn bộ máy --"
                                required={requiredWatchFields.has('movement')}
                            />
                            <InputField
                                label="Caliber"
                                name="caliber"
                                value={formData.caliber}
                                onChange={handleChange as any}
                            />
                        </div>

                        <div className={`grid grid-cols-1 gap-x-5 gap-y-5 ${isRoundCase ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                            {!isRoundCase ? (
                                <InputField
                                    label="Dài"
                                    name="length"
                                    value={formData.length}
                                    onChange={handleChange as any}
                                    type="number"
                                    required={requiredWatchFields.has('length')}
                                />
                            ) : null}
                            <InputField
                                label={isRoundCase ? 'Đường kính / Rộng' : 'Rộng'}
                                name="width"
                                value={formData.width}
                                onChange={handleChange as any}
                                type="number"
                                required={requiredWatchFields.has('width')}
                            />
                            <InputField
                                label="Độ dày"
                                name="thickness"
                                value={formData.thickness}
                                onChange={handleChange as any}
                                type="number"
                                required={requiredWatchFields.has('thickness')}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                            <InputField
                                label="Màu mặt số"
                                name="dialColor"
                                value={formData.dialColor}
                                onChange={handleChange as any}
                                required={requiredWatchFields.has('dialColor')}
                            />
                            <SelectField
                                label="Kính"
                                name="glass"
                                value={formData.glass}
                                onChange={handleChange as any}
                                options={safeGlassOptions}
                                placeholder="-- Chọn kính --"
                                required={requiredWatchFields.has('glass')}
                            />
                        </div>

                        {isGoldCase ? (
                            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
                                <InputField
                                    label="K vàng"
                                    name="goldKarat"
                                    value={formData.goldKarat}
                                    onChange={handleChange as any}
                                    type="number"
                                    required={requiredWatchFields.has('goldKarat')}
                                />
                                <SelectField
                                    label="Màu vàng"
                                    name="goldColor"
                                    value={formData.goldColor}
                                    onChange={handleChange as any}
                                    options={goldColorOptions}
                                    placeholder="-- Chọn màu vàng --"
                                    required={requiredWatchFields.has('goldColor')}
                                />
                                <div className="border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-800">
                                    Khi chọn chất liệu vỏ là vàng, cần khai báo thêm K vàng và màu vàng.
                                </div>
                            </div>
                        ) : null}

                        <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
                            <label className="flex items-center gap-3 border border-slate-200 px-3 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    name="boxIncluded"
                                    checked={!!formData.boxIncluded}
                                    onChange={handleChange as any}
                                />
                                Kèm hộp
                            </label>
                            <label className="flex items-center gap-3 border border-slate-200 px-3 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    name="bookletIncluded"
                                    checked={!!formData.bookletIncluded}
                                    onChange={handleChange as any}
                                />
                                Kèm sổ
                            </label>
                            <label className="flex items-center gap-3 border border-slate-200 px-3 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    name="cardIncluded"
                                    checked={!!formData.cardIncluded}
                                    onChange={handleChange as any}
                                />
                                Kèm thẻ
                            </label>
                        </div>
                    </Section>
                </div>

                <aside className="space-y-8 self-start xl:col-span-4">
                    <Section
                        title={`Bulk post readiness${bulkPostMissing.length ? '' : ' · Ready'}`}
                        subtitle={
                            bulkPostMissing.length
                                ? 'Các mục dưới đây đang thiếu và sẽ chặn bulk post.'
                                : 'Sản phẩm đã đủ các trường cốt lõi để đi tiếp workflow bulk post.'
                        }
                        compact
                    >
                        {bulkPostMissing.length ? (
                            <div className="space-y-2">
                                {bulkPostMissing.map((item) => (
                                    <div
                                        key={item}
                                        className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
                                Không còn trường bắt buộc nào bị thiếu.
                            </div>
                        )}
                    </Section>

                    <Section
                        title="Product image *"
                        subtitle="Ảnh đầu tiên sẽ được dùng làm ảnh đại diện. Khuyến nghị tối thiểu 4 ảnh để đủ điều kiện bulk post."
                        compact
                    >
                        <div className="w-[170px] max-w-full">
                            <div className="aspect-square overflow-hidden border border-dashed border-slate-200 bg-slate-50">
                                <ImagePicker value={images} onChange={onImagesChange} />
                            </div>
                        </div>
                        <div className="text-sm text-slate-500">Hiện có {images.length}/4 ảnh.</div>
                    </Section>

                    <Section
                        title="Pricing"
                        subtitle="Chỉ giữ ô giá bán chính để đồng bộ với workflow edit nhanh."
                        compact
                    >
                        <InputField
                            label="Giá bán"
                            name="variantPrice"
                            value={formData.variantPrice}
                            onChange={handleChange as any}
                            type="number"
                            required
                        />
                    </Section>

                    <Section
                        title="Strap setup"
                        subtitle="Xác định dây đi kèm sẵn theo đồng hồ hoặc chọn trực tiếp từ kho. Phần này ảnh hưởng trực tiếp đến readiness và workflow tồn/cost."
                        compact
                    >
                        <div className="space-y-3">
                            <label className="flex items-start gap-3 border border-slate-200 px-3 py-3 text-sm text-slate-700">
                                <input
                                    type="radio"
                                    name="strapModeRadio"
                                    checked={formData.strapMode === 'INCLUDED'}
                                    onChange={() => handleStrapModeChange('INCLUDED')}
                                />
                                <span>
                                    <span className="block font-medium text-slate-800">Dây đã đi kèm sẵn</span>
                                    <span className="text-slate-500">Không lấy thêm dây từ kho, chỉ khai báo loại dây hiện có.</span>
                                </span>
                            </label>

                            <label className="flex items-start gap-3 border border-slate-200 px-3 py-3 text-sm text-slate-700">
                                <input
                                    type="radio"
                                    name="strapModeRadio"
                                    checked={formData.strapMode === 'INVENTORY'}
                                    onChange={() => handleStrapModeChange('INVENTORY')}
                                />
                                <span>
                                    <span className="block font-medium text-slate-800">Lấy dây từ kho</span>
                                    <span className="text-slate-500">Chọn trực tiếp một dây đang có tồn để ghép với sản phẩm.</span>
                                </span>
                            </label>

                        </div>

                        {formData.strapMode === 'INCLUDED' ? (
                            <SelectField
                                label="Loại dây đi kèm"
                                name="strap"
                                value={formData.strap}
                                onChange={handleChange as any}
                                options={strapOptions}
                                placeholder="-- Chọn loại dây --"
                                required
                            />
                        ) : null}

                        {formData.strapMode === 'INVENTORY' ? (
                            <>
                                <div>
                                    <FieldLabel label="Chọn dây trong kho" required />
                                    <select
                                        name="linkedStrapVariantId"
                                        value={formData.linkedStrapVariantId ?? ''}
                                        onChange={handleInventoryStrapChange}
                                        className="block w-full rounded-none border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                                    >
                                        <option value="">-- Chọn dây trong kho --</option>
                                        {inventoryStrapSelectOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedInventoryStrap ? (
                                    <div className="space-y-2 border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                                        <div className="font-medium text-slate-800">{selectedInventoryStrap.title}</div>
                                        <div>
                                            Size: {selectedInventoryStrap.strapSpec?.lugWidthMM ?? '—'}-
                                            {selectedInventoryStrap.strapSpec?.buckleWidthMM ?? '—'} · Màu:{' '}
                                            {selectedInventoryStrap.strapSpec?.color ?? '—'}
                                        </div>
                                        <div>Vendor: {selectedInventoryStrap.vendorName ?? '—'}</div>
                                        <div>Tồn hiện tại: {selectedInventoryStrap.stockQty}</div>
                                        <div>Dự kiến tồn sau khi gắn: {Math.max(Number(selectedInventoryStrap.stockQty || 0) - 1, 0)}</div>
                                        <div>Giá bán dây: {formatMoney(selectedInventoryStrap.price ?? null)}</div>
                                        <div>Chi phí dây cộng thêm: {formatMoney(selectedInventoryStrap.costPrice ?? null)}</div>
                                        <div className="text-xs leading-5 text-slate-500">
                                            Lưu ý: UI đã tách workflow chọn dây trong kho. Để tự động lưu ràng buộc, cộng giá vốn và trừ tồn khi save/bulk post, backend cần thêm relation strap variant cho product/watch.
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        ) : null}
                    </Section>

                    <Section
                        title="Tag"
                        subtitle="Nhập tag ngắn gọn để dễ nhóm và lọc sản phẩm."
                        compact
                    >
                        <InputField
                            label="Tag"
                            name="tag"
                            value={formData.tag}
                            onChange={handleChange as any}
                            placeholder="Ví dụ: dress, diver, vintage..."
                        />
                    </Section>

                    <Section
                        title="Product complications"
                        subtitle="Chọn các complication quan trọng của sản phẩm."
                        compact
                    >
                        <div className="grid max-h-80 grid-cols-1 gap-2 overflow-auto pr-1 sm:grid-cols-2">
                            {complicationOptions.map((c) => (
                                <label
                                    key={c.id}
                                    className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
                                >
                                    <input
                                        type="checkbox"
                                        checked={(formData.complicationIds ?? []).includes(c.id)}
                                        onChange={() => toggleComp(c.id)}
                                    />
                                    <span>{c.name}</span>
                                </label>
                            ))}
                        </div>
                    </Section>
                </aside>
            </div>

            {err ? (
                <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {err}
                </div>
            ) : null}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    onClick={() => router.push('/admin/products')}
                    disabled={saving}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="border border-slate-800 bg-[#11191f] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-95 disabled:opacity-60"
                    disabled={saving}
                >
                    {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
                </button>
            </div>
        </form>
    );
}
