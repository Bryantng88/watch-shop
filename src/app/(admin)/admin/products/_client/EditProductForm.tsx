'use client';

import Link from 'next/link';
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
    BadgeDollarSign,
    ChevronDown,
    FileText,
    Image as ImageIcon,
    Layers3,
    RefreshCcw,
    Save,
    ShieldAlert,
    Sparkles,
    Tag,
    Wrench,
} from 'lucide-react';

import { useNotify } from '@/components/feedback/AppToastProvider';
import ImagePicker from '@/app/(admin)/admin/products/_components/ImagePicker';

// 1) Import near top of EditProductForm.tsx
import ProductAiPanel from '@/app/(admin)/admin/products/_client/ProductAiPanel';
import type { GeneratedPayload } from '@/app/(admin)/admin/products/_server/product-ai.types';

// 2) Add state inside component

// 4) Render ProductAiPanel where bạn muốn block AI xuất hiện


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

type GeneratedContentState = {
    specBullets: string[];
    promoteShort: string;
    promoteLong: string;
    facebookCaption: string;
    instagramCaption: string;
    titleOptions: string[];
    hashtags: string[];
    missingData: string[];
    safetyNotes: string[];
};

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
    categoryOptions?: CategoryOption[];
    strapInventoryOptions?: StrapInventoryItem[];
    canEditPricing?: boolean;
};

const PRODUCT_KEYS = [
    'title',
    'brandId',
    'description',
    'categoryId',
    'primaryImageUrl',
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
    'strap',
    'glass',
    'dialColor',
    'dialCondition',
    'boxIncluded',
    'bookletIncluded',
    'cardIncluded',
] as const;

const VARIANT_KEYS = ['variantPrice'] as const;
const STRAP_ATTACHMENT_PREFIX = '__STRAP_LINK__:';

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

function toNullableNumber(value: any) {
    if (value === '' || value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function parseStoredStrapAttachment(raw: any) {
    if (typeof raw !== 'string' || !raw.startsWith(STRAP_ATTACHMENT_PREFIX)) return null;
    try {
        const parsed = JSON.parse(raw.slice(STRAP_ATTACHMENT_PREFIX.length));
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

function normalizeInitial(initial: any) {
    const firstVariant = initial?.variants?.[0] ?? null;
    const storedStrapAttachment = parseStoredStrapAttachment(firstVariant?.name);
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

    const currentVariantCost = toNullableNumber(firstVariant?.costPrice);
    const attachedStrapCost = toNullableNumber(storedStrapAttachment?.costPrice) ?? 0;
    const baseVariantCostPrice =
        currentVariantCost != null ? Math.max(currentVariantCost - attachedStrapCost, 0) : null;

    return {
        ...initial,
        ...ws,
        complicationIds,
        images,
        categoryId: initial?.categoryId ?? initial?.ProductCategory?.id ?? '',
        brandName: initial?.brand?.name ?? '',
        categoryName: initial?.ProductCategory?.name ?? '',
        variantId: firstVariant?.id ?? undefined,
        variantPrice: firstVariant?.price != null ? Number(firstVariant.price) : '',
        variantCostPrice: currentVariantCost ?? '',
        baseVariantCostPrice: baseVariantCostPrice ?? '',
        primaryImageUrl: initial?.primaryImageUrl ?? '',
        tag: initial?.tag ?? '',
        strapMode: storedStrapAttachment?.variantId ? 'INVENTORY' : 'INCLUDED',
        linkedStrapProductId: storedStrapAttachment?.productId ?? '',
        linkedStrapVariantId: storedStrapAttachment?.variantId ?? '',
        linkedStrapTitle: storedStrapAttachment?.title ?? '',
        linkedStrapCostPrice: toNullableNumber(storedStrapAttachment?.costPrice) ?? '',
        generatedContent: {
            specBullets: initial?.content?.specBullets ?? [],
            promoteShort: initial?.content?.promoteShort ?? '',
            promoteLong: initial?.content?.promoteLong ?? initial?.content?.generatedContent ?? '',
            facebookCaption: initial?.content?.facebookCaption ?? '',
            instagramCaption: initial?.content?.instagramCaption ?? '',
            titleOptions: initial?.content?.titleOptions ?? [],
            hashtags: initial?.content?.hashtags ?? [],
            missingData: initial?.content?.missingData ?? [],
            safetyNotes: initial?.content?.safetyNotes ?? [],
        } satisfies GeneratedContentState,
    };
}

function formatMoney(value: number | null | undefined) {
    if (value == null || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('vi-VN').format(Number(value));
}

function hasFilledValue(value: any) {
    if (typeof value === 'number') return Number.isFinite(value);
    if (typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && String(value).trim() !== '';
}

function SectionHeading({
    title,
    subtitle,
    extra,
}: {
    title: string;
    subtitle?: string;
    extra?: ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
                {subtitle ? <p className="text-sm leading-6 text-slate-500">{subtitle}</p> : null}
            </div>
            {extra}
        </div>
    );
}

function FieldShell({
    children,
    withHint = false,
}: {
    children: ReactNode;
    withHint?: boolean;
}) {
    return <div className={withHint ? 'min-h-[92px]' : 'min-h-[74px]'}>{children}</div>;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
    return (
        <label className="mb-2 block text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-slate-500">
            {label}
            {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </label>
    );
}

function inputClassName() {
    return 'block h-[42px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm leading-tight text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100';
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
        <FieldShell>
            <FieldLabel label={label} required={required} />
            <input
                name={name}
                type={type}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClassName()}
            />
        </FieldShell>
    );
}

function ReadonlyField({
    label,
    value,
    hint,
}: {
    label: string;
    value?: ReactNode;
    hint?: string;
}) {
    return (
        <FieldShell withHint={!!hint}>
            <FieldLabel label={label} />
            <div className="flex h-[42px] w-full items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                {value || '—'}
            </div>
            {hint ? <p className="mt-1.5 text-xs leading-5 text-slate-400">{hint}</p> : null}
        </FieldShell>
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
        <FieldShell>
            <FieldLabel label={label} required={required} />
            <select
                name={name}
                value={value ?? ''}
                onChange={onChange}
                className={inputClassName()}
            >
                <option value="">{placeholder ?? '-- Chọn --'}</option>
                {(options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </FieldShell>
    );
}

function CollapsibleSection({
    title,
    subtitle,
    children,
    icon,
    defaultOpen = true,
    compact = false,
    extra,
}: {
    title: string;
    subtitle?: string;
    children: ReactNode;
    icon?: ReactNode;
    defaultOpen?: boolean;
    compact?: boolean;
    extra?: ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
            >
                <div className="flex min-w-0 items-start gap-3">
                    {icon ? <div className="mt-0.5 text-slate-500">{icon}</div> : null}
                    <SectionHeading title={title} subtitle={subtitle} extra={extra} />
                </div>
                <ChevronDown
                    className={[
                        'mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform',
                        open ? 'rotate-180' : 'rotate-0',
                    ].join(' ')}
                />
            </button>
            {open ? <div className={compact ? 'px-5 pb-5 pt-1' : 'px-5 pb-5 pt-2'}>{children}</div> : null}
        </section>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
        </div>
    );
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
    canEditPricing = true,
}: Props) {
    const router = useRouter();
    const notify = useNotify();
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
    const [generating, setGenerating] = useState(false);
    const [savingContent, setSavingContent] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [softWarnings, setSoftWarnings] = useState<string[]>([]);
    const [contentTab, setContentTab] = useState<'spec' | 'promote' | 'social'>('spec');

    const [aiMeta, setAiMeta] = useState<{ mode: 'openai' | 'rule'; model?: string | null; message?: string | null }>({
        mode: 'rule',
        model: null,
        message: null,
    });
    const [generatedContent, setGeneratedContent] = useState<GeneratedPayload>({
        specBullets: [],
        promoteShort: '',
        promoteLong: '',
        facebookCaption: '',
        instagramCaption: '',
        titleOptions: [],
        hashtags: [],
        missingData: [],
        safetyNotes: [],
    });

    // 3) Add helper inside component

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

    const baseVariantCostPrice = useMemo(
        () => toNullableNumber(formData.baseVariantCostPrice),
        [formData.baseVariantCostPrice]
    );

    const strapAddedCost = useMemo(() => {
        if (formData.strapMode !== 'INVENTORY') return 0;
        return (
            toNullableNumber(selectedInventoryStrap?.costPrice) ??
            toNullableNumber(formData.linkedStrapCostPrice) ??
            0
        );
    }, [formData.strapMode, formData.linkedStrapCostPrice, selectedInventoryStrap?.costPrice]);

    const effectiveVariantCostPrice = useMemo(() => {
        if (baseVariantCostPrice == null) {
            return formData.strapMode === 'INVENTORY' && strapAddedCost > 0
                ? Number(strapAddedCost)
                : null;
        }
        return Number(baseVariantCostPrice) + Number(strapAddedCost ?? 0);
    }, [baseVariantCostPrice, formData.strapMode, strapAddedCost]);

    const priceGapVsCost = useMemo(() => {
        const sellPrice = toNullableNumber(formData.variantPrice);
        if (sellPrice == null || effectiveVariantCostPrice == null) return null;
        return sellPrice - effectiveVariantCostPrice;
    }, [effectiveVariantCostPrice, formData.variantPrice]);

    const selectedBrand = useMemo(
        () => brands.find((item) => item.id === formData.brandId) ?? null,
        [brands, formData.brandId]
    );

    const selectedCategory = useMemo(
        () => categoryOptions.find((item) => item.id === formData.categoryId) ?? null,
        [categoryOptions, formData.categoryId]
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

        setErr(null);

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
        setErr(null);
        setFormData((prev) => {
            const arr: string[] = prev.complicationIds ?? [];
            return arr.includes(cid)
                ? { ...prev, complicationIds: arr.filter((x) => x !== cid) }
                : { ...prev, complicationIds: [...arr, cid] };
        });
    };

    const onImagesChange = (next: Picked[]) => {
        setErr(null);
        const limited = next.slice(0, 4);
        setImages(limited);
        setFormData((prev) => ({
            ...prev,
            images: limited.map((p, i) => ({
                fileKey: p.key,
                alt: null,
                sortOrder: i,
            })),
        }));
    };

    const handleStrapModeChange = (mode: 'INCLUDED' | 'INVENTORY') => {
        setErr(null);
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
        setErr(null);
        const nextVariantId = e.target.value;
        const picked = strapInventoryOptions.find((item) => item.variantId === nextVariantId) ?? null;
        const inferredStrapType = picked?.strapSpec?.material
            ? strapOptions.find(
                (opt) =>
                    String(opt.value).toUpperCase() ===
                    String(picked.strapSpec?.material).toUpperCase()
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

    const collectSoftWarnings = () => {
        const warnings: string[] = [];
        if (!hasFilledValue(formData.categoryId)) warnings.push('Category');
        if (!hasFilledValue(formData.ref)) warnings.push('Reference');
        if (!hasFilledValue(formData.model)) warnings.push('Model');
        if (!hasFilledValue(formData.year)) warnings.push('Năm sản xuất');
        if (!hasFilledValue(formData.thickness)) warnings.push('Độ dày');
        if (formData.strapMode === 'INCLUDED' && !hasFilledValue(formData.strap)) {
            warnings.push('Loại dây đi kèm');
        }
        if (canEditPricing && !hasFilledValue(formData.variantPrice)) warnings.push('Giá bán');
        if (!Array.isArray(images) || images.length === 0) warnings.push('Ảnh sản phẩm');
        return warnings;
    };

    const buildGeneratePayload = () => ({
        id,
        title: formData.title ?? '',
        description: formData.description ?? '',
        type: formData.type ?? null,
        status: formData.status ?? null,
        brandId: formData.brandId ?? null,
        brandName: selectedBrand?.name ?? null,
        categoryId: formData.categoryId ?? null,
        categoryName: selectedCategory?.name ?? null,
        image: Array.isArray(formData.images) ? formData.images : [],
        variants: [
            {
                id: formData.variantId ?? null,
                price: toNullableNumber(formData.variantPrice),
                costPrice: effectiveVariantCostPrice,
            },
        ],
        watchSpec: {
            ref: formData.ref ?? null,
            model: formData.model ?? null,
            year: formData.year ?? null,
            caseType: formData.caseType ?? null,
            gender: formData.gender ?? null,
            movement: formData.movement ?? null,
            caliber: formData.caliber ?? null,
            caseMaterial: formData.caseMaterial ?? null,
            goldKarat: formData.goldKarat ?? null,
            goldColor: formData.goldColor ?? null,
            length: formData.length ?? null,
            width: formData.width ?? null,
            thickness: formData.thickness ?? null,
            strap: formData.strap ?? null,
            glass: formData.glass ?? null,
            dialColor: formData.dialColor ?? null,
            dialCondition: formData.dialCondition ?? null,
            boxIncluded: !!formData.boxIncluded,
            bookletIncluded: !!formData.bookletIncluded,
            cardIncluded: !!formData.cardIncluded,
            complicationIds: formData.complicationIds ?? [],
        },
    });

    const handleGenerateContent = async () => {
        setErr(null);
        setGenerating(true);
        try {
            const res = await fetch(`/api/admin/products/${id}/content/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildGeneratePayload()),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || 'Generate nội dung thất bại');
            }

            const generated = data?.generated ?? {};
            setGeneratedContent({
                specBullets: generated.specBullets ?? [],
                promoteShort: generated.promoteShort ?? '',
                promoteLong: generated.promoteLong ?? '',
                facebookCaption: generated.facebookCaption ?? '',
                instagramCaption: generated.instagramCaption ?? '',
                titleOptions: generated.titleOptions ?? [],
                hashtags: generated.hashtags ?? [],
                missingData: generated.missingData ?? [],
                safetyNotes: generated.safetyNotes ?? [],
            });
            setAiMeta({
                mode: data?.meta?.mode === 'openai' ? 'openai' : 'rule',
                model: data?.meta?.model ?? null,
                message: data?.meta?.message ?? null,
            });

            notify.success({
                title: data?.meta?.mode === 'openai' ? 'Đã generate bằng OpenAI' : 'Đã generate',
                message:
                    data?.meta?.mode === 'openai'
                        ? `Model: ${data?.meta?.model ?? 'OpenAI'}`
                        : data?.meta?.message || 'Nội dung được tạo từ dữ liệu hiện tại trên form.',
            });
        } catch (e: any) {
            const message = e?.message || 'Generate nội dung thất bại';
            setErr(message);
            notify.error({ title: 'Generate thất bại', message });
        } finally {
            setGenerating(false);
        }
    };


    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setErr(null);

        if (!String(formData.title ?? '').trim()) {
            const message = 'Tên sản phẩm không được để trống.';
            setErr(message);
            notify.error({ title: 'Lưu thất bại', message });
            return;
        }

        setSoftWarnings(collectSoftWarnings());
        setSaving(true);

        try {
            const changed = diffFlat(snapshotRef.current, formData);
            const productPart = pickKeys(changed, PRODUCT_KEYS);
            const watchSpecRaw = pickKeys(changed, WATCHSPEC_KEYS);
            const variantRaw = pickKeys(changed, VARIANT_KEYS);

            const watchSpecPart =
                sanitizeDeep(watchSpecRaw) ||
                    !isEqualShallow(snapshotRef.current.complicationIds, formData.complicationIds)
                    ? {
                        ref: watchSpecRaw.ref ?? formData.ref,
                        model: watchSpecRaw.model ?? formData.model,
                        year: watchSpecRaw.year ?? formData.year,
                        caseType: watchSpecRaw.caseType ?? formData.caseType,
                        gender: watchSpecRaw.gender ?? formData.gender,
                        movement: watchSpecRaw.movement ?? formData.movement,
                        caliber: watchSpecRaw.caliber ?? formData.caliber,
                        caseMaterial: watchSpecRaw.caseMaterial ?? formData.caseMaterial,
                        goldKarat: watchSpecRaw.goldKarat ?? formData.goldKarat,
                        goldColor: watchSpecRaw.goldColor ?? formData.goldColor,
                        length: watchSpecRaw.length ?? formData.length,
                        width: watchSpecRaw.width ?? formData.width,
                        thickness: watchSpecRaw.thickness ?? formData.thickness,
                        strap: watchSpecRaw.strap ?? formData.strap,
                        glass: watchSpecRaw.glass ?? formData.glass,
                        dialColor: watchSpecRaw.dialColor ?? formData.dialColor,
                        dialCondition: watchSpecRaw.dialCondition ?? formData.dialCondition,
                        boxIncluded:
                            watchSpecRaw.boxIncluded !== undefined
                                ? watchSpecRaw.boxIncluded
                                : formData.boxIncluded,
                        bookletIncluded:
                            watchSpecRaw.bookletIncluded !== undefined
                                ? watchSpecRaw.bookletIncluded
                                : formData.bookletIncluded,
                        cardIncluded:
                            watchSpecRaw.cardIncluded !== undefined
                                ? watchSpecRaw.cardIncluded
                                : formData.cardIncluded,
                        complicationIds: formData.complicationIds ?? [],
                    }
                    : undefined;

            const variantPart = canEditPricing
                ? sanitizeDeep(variantRaw)
                    ? {
                        id: formData.variantId,
                        price: variantRaw.variantPrice,
                    }
                    : undefined
                : undefined;

            const strapAttachment =
                formData.strapMode === 'INVENTORY' && (selectedInventoryStrap || formData.linkedStrapVariantId)
                    ? {
                        productId: selectedInventoryStrap?.productId ?? formData.linkedStrapProductId,
                        variantId: selectedInventoryStrap?.variantId ?? formData.linkedStrapVariantId,
                        title: selectedInventoryStrap?.title ?? formData.linkedStrapTitle ?? null,
                        vendorName: selectedInventoryStrap?.vendorName ?? null,
                        costPrice:
                            toNullableNumber(selectedInventoryStrap?.costPrice) ??
                            toNullableNumber(formData.linkedStrapCostPrice),
                        price: toNullableNumber(selectedInventoryStrap?.price),
                        strapSpec: selectedInventoryStrap?.strapSpec
                            ? {
                                lugWidthMM: toNullableNumber(selectedInventoryStrap.strapSpec.lugWidthMM),
                                buckleWidthMM: toNullableNumber(selectedInventoryStrap.strapSpec.buckleWidthMM),
                                color: selectedInventoryStrap.strapSpec.color ?? null,
                                material: selectedInventoryStrap.strapSpec.material ?? null,
                                quickRelease: selectedInventoryStrap.strapSpec.quickRelease ?? null,
                            }
                            : null,
                    }
                    : formData.strapMode === 'INVENTORY'
                        ? null
                        : undefined;

            const body: Record<string, any> = {
                product: sanitizeDeep(productPart),
                watchSpec: sanitizeDeep(watchSpecPart),
                images: changed.images !== undefined ? formData.images ?? [] : undefined,
                strapAttachment,
            };

            if (canEditPricing) {
                body.variant = sanitizeDeep(variantPart);
                body.baseVariantCostPrice = baseVariantCostPrice ?? undefined;
            }

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
            notify.success({
                title: 'Đã lưu',
                message: softWarnings.length
                    ? `Đã lưu. Còn thiếu: ${softWarnings.join(', ')}`
                    : 'Cập nhật sản phẩm thành công',
            });
            router.refresh();
        } catch (e: any) {
            const message = e?.message || 'Cập nhật sản phẩm thất bại';
            setErr(message);
            notify.error({ title: 'Lưu thất bại', message });
        } finally {
            setSaving(false);
        }
    };
    async function handleSaveProductContent(nextContent: GeneratedPayload, promptMeta: { hint: string; sample: string; tonePreset: string; focusPoints: string[] }) {
        const generatedContentText = [
            nextContent.promoteLong,
            nextContent.specBullets.join('\n'),
            nextContent.facebookCaption,
            nextContent.instagramCaption,
            nextContent.hashtags.join(' '),
        ]
            .filter(Boolean)
            .join('\n\n');

        const promptNote = JSON.stringify(promptMeta);

        const res = await fetch(`/api/admin/products/${id}/content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                generatedContent: generatedContentText,
                promptNote,
                syncSnapshot: true,
            }),
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || 'Lưu ProductContent thất bại.');
    }

    useEffect(() => {
        setGeneratedContent(normalizedInitial.generatedContent);
    }, [normalizedInitial]);

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard label="Brand" value={selectedBrand?.name || '—'} />
                    <StatCard label="Category" value={selectedCategory?.name || '—'} />
                    <StatCard label="Ảnh" value={`${images.length}/4`} />
                    <StatCard label="Giá bán" value={formatMoney(toNullableNumber(formData.variantPrice))} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <CollapsibleSection
                        title="Chỉnh sửa sản phẩm"
                        subtitle="Cập nhật các thông tin nền tảng của sản phẩm."
                        icon={<Layers3 className="h-5 w-5" />}
                        defaultOpen
                    >
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                            <InputField
                                label="Tên sản phẩm"
                                name="title"
                                value={formData.title}
                                onChange={handleChange as any}
                                required
                            />

                            <div>
                                <FieldLabel label="Thương hiệu" />
                                <select
                                    name="brandId"
                                    value={formData.brandId ?? ''}
                                    onChange={handleChange}
                                    className={inputClassName()}
                                >
                                    <option value="">-- Chọn thương hiệu --</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <ReadonlyField
                                label="Vendor"
                                value={vendors.find((v) => v.id === formData.vendorId)?.name || '—'}
                                hint="Vendor được lấy từ Acquisition và không chỉnh tại đây."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                            <ReadonlyField label="Loại sản phẩm" value={formData.type || '—'} />
                            <ReadonlyField label="Trạng thái" value={formData.status || '—'} />
                            <SelectField
                                label="Category"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange as any}
                                options={safeCategoryOptions}
                                placeholder="-- Chọn category --"
                            />
                        </div>

                        <div>
                            <FieldLabel label="Mô tả sản phẩm" />
                            <textarea
                                name="description"
                                value={formData.description ?? ''}
                                onChange={handleChange}
                                className="block min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Watch spec"
                        subtitle="Thông số kỹ thuật chính của sản phẩm. Đây cũng là nguồn dữ liệu cho phần promote content."
                        icon={<Wrench className="h-5 w-5" />}
                        defaultOpen
                    >
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
                            <InputField label="Reference" name="ref" value={formData.ref} onChange={handleChange as any} />
                            <InputField label="Model / Dòng" name="model" value={formData.model} onChange={handleChange as any} />
                            <InputField label="Năm sản xuất" name="year" value={formData.year} onChange={handleChange as any} />
                        </div>

                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
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
                                options={safeCaseMaterialOptions}
                                placeholder="-- Chọn chất liệu --"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
                            <SelectField
                                label="Bộ máy"
                                name="movement"
                                value={formData.movement}
                                onChange={handleChange as any}
                                options={movementOptions}
                                placeholder="-- Chọn bộ máy --"
                            />
                            <InputField label="Caliber" name="caliber" value={formData.caliber} onChange={handleChange as any} />
                        </div>

                        <div className={`grid grid-cols-1 gap-5 ${isRoundCase ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                            {!isRoundCase ? (
                                <InputField
                                    label="Dài (mm)"
                                    name="length"
                                    value={formData.length}
                                    onChange={handleChange as any}
                                    type="number"
                                />
                            ) : null}
                            <InputField
                                label={isRoundCase ? 'Đường kính / Rộng (mm)' : 'Rộng (mm)'}
                                name="width"
                                value={formData.width}
                                onChange={handleChange as any}
                                type="number"
                            />
                            <InputField
                                label="Độ dày (mm)"
                                name="thickness"
                                value={formData.thickness}
                                onChange={handleChange as any}
                                type="number"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
                            <SelectField
                                label="Kính"
                                name="glass"
                                value={formData.glass}
                                onChange={handleChange as any}
                                options={safeGlassOptions}
                                placeholder="-- Chọn kính --"
                            />
                            <InputField
                                label="Dial color"
                                name="dialColor"
                                value={formData.dialColor}
                                onChange={handleChange as any}
                                placeholder="Ví dụ: đen, champagne, xanh..."
                            />
                            <InputField
                                label="Dial condition"
                                name="dialCondition"
                                value={formData.dialCondition}
                                onChange={handleChange as any}
                                placeholder="Ví dụ: đẹp, gần NOS..."
                            />
                        </div>

                        {isGoldCase ? (
                            <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
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
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                                    Khi chọn chất liệu vỏ là vàng, nên khai báo thêm K vàng và màu vàng để phần content chuẩn hơn.
                                </div>
                            </div>
                        ) : null}

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            {[
                                ['boxIncluded', 'Kèm hộp'],
                                ['bookletIncluded', 'Kèm sổ'],
                                ['cardIncluded', 'Kèm thẻ'],
                            ].map(([name, label]) => (
                                <label
                                    key={name}
                                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
                                >
                                    <input
                                        type="checkbox"
                                        name={name}
                                        checked={!!formData[name]}
                                        onChange={handleChange as any}
                                        className="h-4 w-4 rounded border-slate-300"
                                    />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Ảnh & dây gắn kèm"
                        subtitle="Giữ logic image picker cũ và cho phép gắn dây từ inventory."
                        icon={<ImageIcon className="h-5 w-5" />}
                        defaultOpen
                    >
                        <div className="space-y-6">
                            <div className="max-w-full">
                                <ImagePicker value={images} onChange={onImagesChange} />
                            </div>
                            <div className="text-sm text-slate-500">Hiện có {images.length}/4 ảnh.</div>

                            <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
                                <div className="text-sm font-medium text-slate-900">Strap setup</div>
                                <div className="space-y-3">
                                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
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
                                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
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
                                    />
                                ) : null}

                                {formData.strapMode === 'INVENTORY' ? (
                                    <>
                                        <div>
                                            <FieldLabel label="Chọn dây trong kho" />
                                            <select
                                                name="linkedStrapVariantId"
                                                value={formData.linkedStrapVariantId ?? ''}
                                                onChange={handleInventoryStrapChange}
                                                className={inputClassName()}
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
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                                <div className="font-medium text-slate-800">{selectedInventoryStrap.title}</div>
                                                <div className="mt-2 space-y-1">
                                                    <div>
                                                        Size: {selectedInventoryStrap.strapSpec?.lugWidthMM ?? '—'}-
                                                        {selectedInventoryStrap.strapSpec?.buckleWidthMM ?? '—'} · Màu:{' '}
                                                        {selectedInventoryStrap.strapSpec?.color ?? '—'}
                                                    </div>
                                                    <div>Vendor: {selectedInventoryStrap.vendorName ?? '—'}</div>
                                                    <div>Tồn hiện tại: {selectedInventoryStrap.stockQty}</div>
                                                    <div>
                                                        Dự kiến tồn sau khi gắn:{' '}
                                                        {Math.max(Number(selectedInventoryStrap.stockQty || 0) - 1, 0)}
                                                    </div>
                                                    <div>Giá bán dây: {formatMoney(selectedInventoryStrap.price ?? null)}</div>
                                                    <div>
                                                        Chi phí dây cộng thêm: {formatMoney(selectedInventoryStrap.costPrice ?? null)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Product complications"
                        subtitle="Chọn các complication quan trọng của sản phẩm."
                        icon={<Sparkles className="h-5 w-5" />}
                        defaultOpen={false}
                    >
                        <div className="grid max-h-80 grid-cols-1 gap-2 overflow-auto pr-1 sm:grid-cols-2">
                            {complicationOptions.map((c) => (
                                <label
                                    key={c.id}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
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
                    </CollapsibleSection>
                </div>

                <aside className="space-y-6 self-start xl:sticky xl:top-6 xl:col-span-4">
                    <CollapsibleSection
                        title="Nội dung promote"
                        subtitle="Generate spec và nội dung social từ dữ liệu hiện tại trên form, không cần lưu trước."
                        icon={<FileText className="h-5 w-5" />}
                        defaultOpen
                        compact
                    >
                        <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleGenerateContent}
                                    disabled={generating}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    {generating ? 'Đang generate...' : 'Generate từ spec + AI'}
                                </button>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            setSavingContent(true);
                                            await handleSaveProductContent(generatedContent, {
                                                hint: '',
                                                sample: '',
                                                tonePreset: 'balanced',
                                                focusPoints: [],
                                            });
                                            notify.success({
                                                title: 'Đã lưu ProductContent',
                                                message: 'Nội dung promote đã được lưu.',
                                            });
                                        } catch (e: any) {
                                            const message = e?.message || 'Lưu ProductContent thất bại.';
                                            setErr(message);
                                            notify.error({ title: 'Lưu thất bại', message });
                                        } finally {
                                            setSavingContent(false);
                                        }
                                    }}
                                    disabled={savingContent}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" />
                                    {savingContent ? 'Đang lưu...' : 'Lưu ProductContent'}
                                </button>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                <span className="font-medium text-slate-800">AI status:</span>{' '}
                                {aiMeta.mode === 'openai' ? (
                                    <>OpenAI đang hoạt động{aiMeta.model ? ` · ${aiMeta.model}` : ''}.</>
                                ) : (
                                    <>Đang dùng rule-based fallback{aiMeta.message ? ` · ${aiMeta.message}` : ''}.</>
                                )}
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <div className="mb-2 text-sm font-semibold text-slate-900">Thiếu dữ liệu</div>
                                    <div className="text-sm text-slate-600">
                                        {generatedContent.missingData?.length
                                            ? generatedContent.missingData.join(', ')
                                            : 'Hiện đủ dữ liệu nền tảng để generate khá ổn.'}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-amber-50 p-4">
                                    <div className="mb-2 text-sm font-semibold text-amber-900">Safety notes</div>
                                    <div className="text-sm text-amber-800">
                                        {generatedContent.safetyNotes?.length
                                            ? generatedContent.safetyNotes.join(' ')
                                            : 'Không có cảnh báo thêm.'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                                {[
                                    ['spec', 'Spec'],
                                    ['promote', 'Promote'],
                                    ['social', 'Social'],
                                ].map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setContentTab(key as any)}
                                        className={[
                                            'rounded-full px-4 py-2 text-sm transition',
                                            contentTab === key
                                                ? 'bg-slate-950 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                                        ].join(' ')}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {contentTab === 'spec' ? (
                                <div className="space-y-4">
                                    <div>
                                        <FieldLabel label="Spec bullets" />
                                        <textarea
                                            value={(generatedContent.specBullets ?? []).join('\n')}
                                            onChange={(e) =>
                                                setGeneratedContent((prev) => ({
                                                    ...prev,
                                                    specBullets: e.target.value
                                                        .split('\n')
                                                        .map((x) => x.trim())
                                                        .filter(Boolean),
                                                }))
                                            }
                                            rows={8}
                                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <FieldLabel label="Tiêu đề gợi ý" />
                                        <div className="flex flex-wrap gap-2">
                                            {(generatedContent.titleOptions ?? []).length ? (
                                                generatedContent.titleOptions.map((title, idx) => (
                                                    <button
                                                        key={`${title}-${idx}`}
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData((prev: any) => ({ ...prev, title }))
                                                        }
                                                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    >
                                                        {title}
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-400">Chưa có tiêu đề gợi ý.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {contentTab === 'promote' ? (
                                <div className="space-y-4">
                                    <div>
                                        <FieldLabel label="Promote short" />
                                        <textarea
                                            value={generatedContent.promoteShort ?? ''}
                                            onChange={(e) =>
                                                setGeneratedContent((prev) => ({
                                                    ...prev,
                                                    promoteShort: e.target.value,
                                                }))
                                            }
                                            rows={5}
                                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel label="Promote long" />
                                        <textarea
                                            value={generatedContent.promoteLong ?? ''}
                                            onChange={(e) =>
                                                setGeneratedContent((prev) => ({
                                                    ...prev,
                                                    promoteLong: e.target.value,
                                                }))
                                            }
                                            rows={10}
                                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                        />
                                    </div>
                                </div>
                            ) : null}

                            {contentTab === 'social' ? (
                                <div className="space-y-4">
                                    <div>
                                        <FieldLabel label="Facebook caption" />
                                        <textarea
                                            value={generatedContent.facebookCaption ?? ''}
                                            onChange={(e) =>
                                                setGeneratedContent((prev) => ({
                                                    ...prev,
                                                    facebookCaption: e.target.value,
                                                }))
                                            }
                                            rows={7}
                                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel label="Instagram caption" />
                                        <textarea
                                            value={generatedContent.instagramCaption ?? ''}
                                            onChange={(e) =>
                                                setGeneratedContent((prev) => ({
                                                    ...prev,
                                                    instagramCaption: e.target.value,
                                                }))
                                            }
                                            rows={7}
                                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel label="Hashtags" />
                                        <textarea
                                            value={(generatedContent.hashtags ?? []).join(' ')}
                                            onChange={(e) =>
                                                setGeneratedContent((prev) => ({
                                                    ...prev,
                                                    hashtags: e.target.value
                                                        .split(/\s+/)
                                                        .map((x) => x.trim())
                                                        .filter(Boolean),
                                                }))
                                            }
                                            rows={3}
                                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Pricing"
                        subtitle={canEditPricing ? 'Khối này chỉ hiện cho Admin / người có quyền giá.' : 'Bạn không có quyền chỉnh giá.'}
                        icon={<BadgeDollarSign className="h-5 w-5" />}
                        defaultOpen
                        compact
                    >
                        {canEditPricing ? (
                            <div className="space-y-4">
                                <InputField
                                    label="Giá bán"
                                    name="variantPrice"
                                    value={formData.variantPrice}
                                    onChange={handleChange as any}
                                    type="number"
                                />

                                <div className="grid gap-3 text-sm">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="text-slate-500">Giá vốn gốc</div>
                                        <div className="mt-1 font-medium text-slate-900">{formatMoney(baseVariantCostPrice)}</div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="text-slate-500">Chi phí dây cộng thêm</div>
                                        <div className="mt-1 font-medium text-slate-900">{formatMoney(strapAddedCost)}</div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="text-slate-500">Giá vốn sau khi ghép dây</div>
                                        <div className="mt-1 font-medium text-slate-900">{formatMoney(effectiveVariantCostPrice)}</div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="text-slate-500">Chênh lệch giá bán so với giá vốn</div>
                                        <div className={`mt-1 font-medium ${priceGapVsCost != null && priceGapVsCost < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                                            {priceGapVsCost == null
                                                ? '—'
                                                : `${priceGapVsCost >= 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN').format(priceGapVsCost)}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                Pricing đang được ẩn ở UI cho tài khoản không có quyền giá.
                            </div>
                        )}
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Tag"
                        subtitle="Nhập tag ngắn gọn để dễ nhóm và lọc sản phẩm."
                        icon={<Tag className="h-5 w-5" />}
                        defaultOpen={false}
                        compact
                    >
                        <InputField
                            label="Tag"
                            name="tag"
                            value={formData.tag}
                            onChange={handleChange as any}
                            placeholder="Ví dụ: dress, diver, vintage..."
                        />
                    </CollapsibleSection>
                    <ProductAiPanel
                        productId={id}
                        title={formData.title ?? ''}
                        description={formData.description ?? ''}
                        brandId={formData.brandId ?? ''}
                        categoryId={formData.categoryId ?? ''}
                        images={images}
                        brands={brands}
                        categories={categoryOptions}
                        watchSpec={{
                            ref: formData.ref,
                            model: formData.model,
                            year: formData.year,
                            caseType: formData.caseType,
                            gender: formData.gender,
                            movement: formData.movement,
                            caliber: formData.caliber,
                            caseMaterial: formData.caseMaterial,
                            goldKarat: formData.goldKarat,
                            goldColor: formData.goldColor,
                            width: formData.width,
                            length: formData.length,
                            thickness: formData.thickness,
                            strap: formData.strap,
                            glass: formData.glass,
                            dialColor: formData.dialColor,
                            dialCondition: formData.dialCondition,
                            boxIncluded: formData.boxIncluded,
                            bookletIncluded: formData.bookletIncluded,
                            cardIncluded: formData.cardIncluded,
                        }}
                        initialContent={generatedContent}
                        onContentChange={setGeneratedContent}
                        onSaveContent={handleSaveProductContent}
                        onApplyExtractedSpecs={(patch) => {
                            setFormData((prev: any) => ({
                                ...prev,
                                brandId: patch.brandName
                                    ? (brands.find(
                                        (b: any) =>
                                            b.name?.toLowerCase() === String(patch.brandName).toLowerCase()
                                    )?.id ?? prev.brandId)
                                    : prev.brandId,
                                ref: patch.ref ?? prev.ref,
                                model: patch.model ?? prev.model,
                                year: patch.year ?? prev.year,
                                caseType: patch.caseType ?? prev.caseType,
                                gender: patch.gender ?? prev.gender,
                                movement: patch.movement ?? prev.movement,
                                caliber: patch.caliber ?? prev.caliber,
                                caseMaterial: patch.caseMaterial ?? prev.caseMaterial,
                                goldKarat: patch.goldKarat ?? prev.goldKarat,
                                goldColor: patch.goldColor ?? prev.goldColor,
                                width: patch.width ?? prev.width,
                                length: patch.length ?? prev.length,
                                thickness: patch.thickness ?? prev.thickness,
                                strap: patch.strap ?? prev.strap,
                                glass: patch.glass ?? prev.glass,
                                dialColor: patch.dialColor ?? prev.dialColor,
                                dialCondition: patch.dialCondition ?? prev.dialCondition,
                                boxIncluded:
                                    typeof patch.boxIncluded === 'boolean'
                                        ? patch.boxIncluded
                                        : prev.boxIncluded,
                                bookletIncluded:
                                    typeof patch.bookletIncluded === 'boolean'
                                        ? patch.bookletIncluded
                                        : prev.bookletIncluded,
                                cardIncluded:
                                    typeof patch.cardIncluded === 'boolean'
                                        ? patch.cardIncluded
                                        : prev.cardIncluded,
                            }));
                        }}
                    />
                    <CollapsibleSection
                        title="Hành động"
                        subtitle="Lưu sản phẩm và nội dung đã chỉnh."
                        icon={<RefreshCcw className="h-5 w-5" />}
                        defaultOpen
                        compact
                    >
                        <div className="space-y-4">
                            {softWarnings.length > 0 ? (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    Thiếu một số thông tin để dữ liệu đẹp hơn: {softWarnings.join(', ')}. Bạn vẫn có thể lưu trước.
                                </div>
                            ) : null}

                            {err ? (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {err}
                                </div>
                            ) : null}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                <div className="flex items-start gap-2">
                                    <ShieldAlert className="mt-0.5 h-4 w-4 text-slate-400" />
                                    <span>Form hiện dùng soft validate. Chỉ bắt buộc tên sản phẩm, còn lại có thể lưu trước rồi bổ sung sau.</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={saving}
                            >
                                <Save className="h-4 w-4" />
                                {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href={`/admin/products/${id}`}
                                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Xem detail
                                </Link>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    onClick={() => router.back()}
                                    disabled={saving}
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>
                    </CollapsibleSection>
                </aside>
            </div>
        </form>
    );
}
