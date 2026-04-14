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
    Image as ImageIcon,
    Layers3,
    RefreshCcw,
    Save,
    ShieldAlert,
    Tag,
    Wrench,
} from 'lucide-react';

import { useNotify } from '@/components/feedback/AppToastProvider';
import ImagePicker from '@/app/(admin)/admin/products/_components/ImagePicker';
import ProductAiPanel, {
    type GeneratedLongformPayload,
} from '@/app/(admin)/admin/products/_client/ProductAiPanel';
import {
    type Brand,
    type Complication,
    type Option,
    type StrapInventoryItem,
    type Vendor,
    type CategoryOption,
    PRODUCT_KEYS,
    WATCHSPEC_KEYS,
    VARIANT_KEYS,
    buildDisplayImageUrl,
    diffFlat,
    formatMoney,
    hasFilledValue,
    mergeCurrentValueOption,
    normalizeInitial,
    pickKeys,
    sanitizeDeep,
    toNullableNumber,
} from './ProductEditHelpers';
import MediaPickerMulti, {
    type PickedMediaItem,
} from '@/components/media/MediaPickerMulti';
import MediaPickerInline from '@/components/media/MediaPickerInline';
import ProductImageSection from "@/app/(admin)/admin/products/_client/edit/sections/ProductImageSection";
import ProductStrapSection from "@/app/(admin)/admin/products/_client/edit/sections/ProductStrapSection";

type Picked = PickedMediaItem;
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

function inputClassName() {
    return 'block h-[42px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm leading-tight text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100';
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
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                    {title}
                </h2>
                {subtitle ? (
                    <p className="text-sm leading-6 text-slate-500">{subtitle}</p>
                ) : null}
            </div>
            {extra}
        </div>
    );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
    return (
        <label className="mb-2 block text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-slate-500">
            {label}
            {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </label>
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
            {open ? (
                <div className={compact ? 'px-5 pb-5 pt-1' : 'px-5 pb-5 pt-2'}>
                    {children}
                </div>
            ) : null}
        </section>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
        </div>
    );
}

export default function EditProductForm({
    initial,
    brands = [],
    vendors = [],
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
    const [chosenImages, setChosenImages] = useState<Picked[]>(
        (normalizedInitial.images ?? []).map((img: any) => ({
            key: img.fileKey,
            url: img.url,
        }))
    );

    const [images, setImages] = useState<Picked[]>(
        (normalizedInitial.images ?? []).map((img: any) => ({
            key: img.fileKey,
            url: img.url,
        }))
    );
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [softWarnings, setSoftWarnings] = useState<string[]>([]);
    const [generatedContent, setGeneratedContent] = useState<GeneratedLongformPayload>(
        normalizedInitial.generatedContent ?? {
            promoteLong: '',
            missingData: [],
            safetyNotes: [],
            specBullets: [],
            hashtags: [],
        }
    );
    const [manualContent, setManualContent] = useState<string>(
        normalizedInitial.generatedContent?.promoteLong ??
        normalizedInitial.postContent ??
        ''
    );
    const [storefrontSaving, setStorefrontSaving] = useState(false);

    useEffect(() => {
        const nextImages = (normalizedInitial.images ?? []).map((img: any) => ({
            key: img.fileKey,
            url: img.url,
        }));

        setFormData(normalizedInitial);
        setChosenImages(nextImages);
        setImages(nextImages);
        setGeneratedContent(
            normalizedInitial.generatedContent ?? {
                promoteLong: '',
                missingData: [],
                safetyNotes: [],
                specBullets: [],
                hashtags: [],
            }
        );
        setManualContent(
            normalizedInitial.generatedContent?.promoteLong ??
            normalizedInitial.postContent ??
            ''
        );
        snapshotRef.current = normalizedInitial;
    }, [normalizedInitial]);
    const safeCategoryOptions = useMemo(() => {
        const selectedType = String(formData.type ?? '').toUpperCase();
        const shouldFilter = selectedType === 'WATCH' || selectedType === 'WATCH_STRAP';
        const filtered = shouldFilter
            ? categoryOptions.filter(
                (item) => item.scope === 'ALL' || item.scope === selectedType
            )
            : categoryOptions;
        const mapped = filtered.map((item) => ({ label: item.name, value: item.id }));
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

    const selectedInventoryStrap = useMemo(
        () =>
            strapInventoryOptions.find(
                (item) =>
                    String(item.variantId) === String(formData.linkedStrapVariantId ?? '')
            ) ?? null,
        [strapInventoryOptions, formData.linkedStrapVariantId]
    );

    const inventoryStrapSelectOptions = useMemo(
        () =>
            strapInventoryOptions.map((item) => ({
                label: `${item.title} · ${item.strapSpec?.lugWidthMM ?? '—'}-${item.strapSpec?.buckleWidthMM ?? '—'
                    } · ${item.strapSpec?.color ?? '—'} · tồn ${item.stockQty}`,
                value: item.variantId,
            })),
        [strapInventoryOptions]
    );

    const selectedBrand = useMemo(
        () => brands.find((item) => item.id === formData.brandId) ?? null,
        [brands, formData.brandId]
    );
    const selectedCategory = useMemo(
        () => categoryOptions.find((item) => item.id === formData.categoryId) ?? null,
        [categoryOptions, formData.categoryId]
    );

    const previewImageUrl = useMemo(
        () =>
            buildDisplayImageUrl({
                storefrontImageKey:
                    formData.storefrontImageKey ?? normalizedInitial.storefrontImageKey ?? '',
                primaryImageUrl:
                    formData.primaryImageUrl ?? normalizedInitial.primaryImageUrl ?? '',
                image: formData.image ?? normalizedInitial.image ?? [],
                images: formData.images ?? normalizedInitial.images ?? [],
            }),
        [
            formData.storefrontImageKey,
            formData.primaryImageUrl,
            formData.image,
            formData.images,
            normalizedInitial.storefrontImageKey,
            normalizedInitial.primaryImageUrl,
            normalizedInitial.image,
            normalizedInitial.images,
        ]
    );
    const aiImages = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) return images;
        if (previewImageUrl) return [{ key: 'primary', url: previewImageUrl }];
        return [];
    }, [images, previewImageUrl]);

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
    }, [
        formData.strapMode,
        formData.linkedStrapCostPrice,
        selectedInventoryStrap?.costPrice,
    ]);
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

    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
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
            const next = { ...prev, [name]: nextValue } as Record<string, any>;
            if (name === 'caseMaterial' && String(nextValue).toUpperCase() !== 'GOLD') {
                next.goldKarat = '';
                next.goldColor = '';
            }
            return next;
        });
    }

    function toggleComp(cid: string) {
        setErr(null);
        setFormData((prev) => {
            const arr: string[] = prev.complicationIds ?? [];
            return arr.includes(cid)
                ? { ...prev, complicationIds: arr.filter((x) => x !== cid) }
                : { ...prev, complicationIds: [...arr, cid] };
        });
    }

    function onImagesChange(next: Picked[]) {
        const limited = next.slice(0, 10);
        setImages(limited);
        setFormData((prev) => ({
            ...prev,
            images: limited.map((p, i) => ({
                fileKey: p.key,
                alt: null,
                sortOrder: i,
                url: p.url,
            })),
        }));
    }
    function onChosenImagesChange(next: Picked[]) {
        const normalizedNext = next.filter((item) => String(item?.key ?? '').trim());
        setChosenImages(normalizedNext);

        const allowedKeys = new Set(normalizedNext.map((item) => item.key));
        const filteredSelected = images.filter((item) => allowedKeys.has(item.key));

        if (filteredSelected.length !== images.length) {
            onImagesChange(filteredSelected);
        }
    }
    async function handlePickStorefrontImage(fileKey: string) {
        if (!fileKey) return;

        try {
            setStorefrontSaving(true);
            setErr(null);

            const res = await fetch(`/api/admin/products/${id}/storefront-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileKey }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || 'Không cập nhật được ảnh đại diện bán hàng');
            }

            const nextKey = data?.storefrontImageKey ?? fileKey;

            setFormData((prev) => ({
                ...prev,
                storefrontImageKey: nextKey,
                storefrontImageUrl:
                    data?.storefrontImageUrl ??
                    `/api/media/sign?key=${encodeURIComponent(nextKey)}`,
            }));

            snapshotRef.current = {
                ...snapshotRef.current,
                storefrontImageKey: nextKey,
                storefrontImageUrl:
                    data?.storefrontImageUrl ??
                    `/api/media/sign?key=${encodeURIComponent(nextKey)}`,
            };

            notify.success({
                title: 'Đã cập nhật ảnh đại diện',
                message: 'Ảnh storefront đã được chọn và lưu.',
            });

            router.refresh();
        } catch (e: any) {
            const message = e?.message || 'Không cập nhật được ảnh đại diện bán hàng';
            setErr(message);
            notify.error({
                title: 'Cập nhật thất bại',
                message,
            });
        } finally {
            setStorefrontSaving(false);
        }
    }
    function handleStrapModeChange(mode: 'INCLUDED' | 'INVENTORY') {
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
    }

    function handleInventoryStrapChange(e: ChangeEvent<HTMLSelectElement>) {
        const nextVariantId = e.target.value;
        const picked =
            strapInventoryOptions.find((item) => item.variantId === nextVariantId) ??
            null;
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
    }

    function collectSoftWarnings() {
        const warnings: string[] = [];
        if (!hasFilledValue(formData.categoryId)) warnings.push('Category');
        if (!hasFilledValue(formData.ref)) warnings.push('Reference');
        if (!hasFilledValue(formData.model)) warnings.push('Model');
        if (!hasFilledValue(formData.year)) warnings.push('Năm sản xuất');
        if (!hasFilledValue(formData.thickness)) warnings.push('Độ dày');
        if (formData.strapMode === 'INCLUDED' && !hasFilledValue(formData.strap)) {
            warnings.push('Loại dây đi kèm');
        }
        if (canEditPricing && !hasFilledValue(formData.variantPrice)) {
            warnings.push('Giá bán');
        }
        if (!Array.isArray(aiImages) || aiImages.length === 0) {
            warnings.push('Ảnh sản phẩm');
        }
        return warnings;
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!String(formData.title ?? '').trim()) {
            const message = 'Tên sản phẩm không được để trống.';
            setErr(message);
            notify.error({ title: 'Lưu thất bại', message });
            return;
        }

        const warnings = collectSoftWarnings();
        setSoftWarnings(warnings);
        setSaving(true);

        try {
            const changed = diffFlat(snapshotRef.current, formData);
            const productPart = pickKeys(changed, PRODUCT_KEYS);
            const watchSpecRaw = pickKeys(changed, WATCHSPEC_KEYS);
            const variantRaw = pickKeys(changed, VARIANT_KEYS);

            const watchSpecChanged =
                Boolean(sanitizeDeep(watchSpecRaw)) ||
                JSON.stringify(snapshotRef.current.complicationIds ?? []) !==
                JSON.stringify(formData.complicationIds ?? []);

            const watchSpecPart = watchSpecChanged
                ? {
                    ref: watchSpecRaw.ref ?? formData.ref,
                    model: watchSpecRaw.model ?? formData.model,
                    year: watchSpecRaw.year ?? formData.year,
                    caseType: watchSpecRaw.caseType ?? formData.caseType,
                    gender: watchSpecRaw.gender ?? formData.gender,
                    movement: watchSpecRaw.movement ?? formData.movement,
                    caliber: watchSpecRaw.caliber ?? formData.caliber,
                    caseMaterial:
                        watchSpecRaw.caseMaterial ?? formData.caseMaterial,
                    goldKarat: watchSpecRaw.goldKarat ?? formData.goldKarat,
                    goldColor: watchSpecRaw.goldColor ?? formData.goldColor,
                    length: watchSpecRaw.length ?? formData.length,
                    width: watchSpecRaw.width ?? formData.width,
                    thickness: watchSpecRaw.thickness ?? formData.thickness,
                    strap: watchSpecRaw.strap ?? formData.strap,
                    glass: watchSpecRaw.glass ?? formData.glass,
                    dialColor: watchSpecRaw.dialColor ?? formData.dialColor,
                    dialCondition:
                        watchSpecRaw.dialCondition ?? formData.dialCondition,
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

            const body: Record<string, any> = {
                product: sanitizeDeep(productPart),
                watchSpec: sanitizeDeep(watchSpecPart),
                images:
                    changed.images !== undefined ? formData.images ?? [] : undefined,
            };

            if (canEditPricing) {
                body.variant = sanitizeDeep(
                    sanitizeDeep(variantRaw)
                        ? { id: formData.variantId, price: variantRaw.variantPrice }
                        : undefined
                );
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

            const contentRes = await fetch(`/api/admin/products/${id}/content`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generatedContent: manualContent,
                    promptNote: 'manual-content',
                    syncSnapshot: true,
                }),
            });

            const contentData = await contentRes.json().catch(() => null);
            if (!contentRes.ok) {
                throw new Error(
                    contentData?.error || 'Lưu nội dung sản phẩm thất bại.'
                );
            }

            const nextGeneratedContent: GeneratedLongformPayload = {
                ...(generatedContent ?? {
                    promoteLong: '',
                    missingData: [],
                    safetyNotes: [],
                    specBullets: [],
                    hashtags: [],
                }),
                promoteLong: manualContent,
                specBullets:
                    contentData?.content?.specBullets ??
                    generatedContent?.specBullets ??
                    [],
                hashtags:
                    contentData?.content?.hashtags ??
                    generatedContent?.hashtags ??
                    [],
            };

            setGeneratedContent(nextGeneratedContent);

            const nextSnapshot = {
                ...formData,
                postContent: manualContent,
                generatedContent: nextGeneratedContent,
            };

            snapshotRef.current = nextSnapshot;
            setFormData((prev) => ({
                ...prev,
                postContent: manualContent,
                generatedContent: nextGeneratedContent,
            }));

            notify.success({
                title: 'Đã lưu',
                message: warnings.length
                    ? `Đã lưu. Còn thiếu: ${warnings.join(', ')}`
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
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            {previewImageUrl ? (
                                <img
                                    src={previewImageUrl}
                                    alt={formData.title || 'product'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                    No image
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                <Link href="/admin/products" className="hover:text-slate-700">
                                    Sản phẩm
                                </Link>
                                <span>›</span>
                                <span className="truncate">{formData.title || '—'}</span>
                                <span>›</span>
                                <span>Chỉnh sửa</span>
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                                    {formData.title || 'Chỉnh sửa sản phẩm'}
                                </h1>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                    <span>
                                        SKU:{' '}
                                        <span className="font-medium text-slate-700">
                                            {formData.sku || '—'}
                                        </span>
                                    </span>
                                    <span>
                                        Brand:{' '}
                                        <span className="font-medium text-slate-700">
                                            {selectedBrand?.name || '—'}
                                        </span>
                                    </span>
                                    <span>
                                        Category:{' '}
                                        <span className="font-medium text-slate-700">
                                            {selectedCategory?.name || '—'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={saving}
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                        </button>

                        <Link
                            href={`/admin/products/${id}`}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Xem chi tiết
                        </Link>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            ← Quay lại
                        </button>
                    </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                    <StatCard label="Brand" value={selectedBrand?.name || '—'} />
                    <StatCard label="Category" value={selectedCategory?.name || '—'} />
                    <StatCard
                        label="Ảnh"
                        value={aiImages.length ? `${aiImages.length}/4` : 'Primary'}
                    />
                    <StatCard
                        label="Giá bán"
                        value={formatMoney(toNullableNumber(formData.variantPrice))}
                    />
                </div>

                {softWarnings.length > 0 ? (
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Thiếu một số thông tin để dữ liệu đẹp hơn: {softWarnings.join(', ')}.
                        Bạn vẫn có thể lưu trước.
                    </div>
                ) : null}

                {err ? (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {err}
                    </div>
                ) : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3">
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                        Nội dung thủ công
                    </h2>
                    <p className="text-sm leading-6 text-slate-500">
                        Paste nội dung bạn muốn lưu cho product. Khi lưu sẽ tự dựng
                        spec bullet từ spec hiện có và tự thêm hashtag có SKU.
                    </p>
                </div>

                <textarea
                    value={manualContent}
                    onChange={(e) => setManualContent(e.target.value)}
                    rows={10}
                    className="block min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                    placeholder="Dán nội dung thủ công vào đây..."
                />
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
                            <InputField
                                label="Nickname"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange as any}
                                placeholder="Ví dụ: Snowflake, Linen, TV Dial..."
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
                                value={
                                    vendors.find((v) => v.id === formData.vendorId)?.name || '—'
                                }
                                hint="Vendor được lấy từ Acquisition và không chỉnh tại đây."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                            <ReadonlyField
                                label="Loại sản phẩm"
                                value={formData.type || '—'}
                            />
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
                            <InputField
                                label="Reference"
                                name="ref"
                                value={formData.ref}
                                onChange={handleChange as any}
                            />
                            <InputField
                                label="Model / Dòng"
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
                            <InputField
                                label="Caliber"
                                name="caliber"
                                value={formData.caliber}
                                onChange={handleChange as any}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
                            <InputField
                                label="Đường kính / Rộng (mm)"
                                name="width"
                                value={formData.width}
                                onChange={handleChange as any}
                                type="number"
                            />
                            <InputField
                                label="Dài (mm)"
                                name="length"
                                value={formData.length}
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

                        {String(formData.caseMaterial ?? '').toUpperCase() === 'GOLD' ? (
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
                                    Khi chọn chất liệu vỏ là vàng, nên khai báo thêm K vàng và
                                    màu vàng để phần content chuẩn hơn.
                                </div>
                            </div>
                        ) : null}
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Ảnh & dây gắn kèm"
                        description="Đã tách rõ phần ảnh và phần dây để thao tác dễ hơn."
                        defaultOpen
                    >
                        <div className="space-y-5">
                            <ProductImageSection
                                storefrontImageKey={formData.storefrontImageKey ?? ""}
                                storefrontSaving={storefrontSaving}
                                onPickStorefrontImage={handlePickStorefrontImage}
                                chosenImages={chosenImages}
                                selectedImages={images}
                                onChosenImagesChange={onChosenImagesChange}
                                onSelectedImagesChange={onImagesChange}
                                error={err}
                            />

                            <ProductStrapSection>
                                {/* Giữ nguyên toàn bộ JSX strap setup cũ của bạn ở đây */}
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-slate-900">
                                        Strap setup
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                                            <input
                                                type="radio"
                                                checked={formData.strapMode === 'INCLUDED'}
                                                onChange={() =>
                                                    setFormData((prev: any) => ({
                                                        ...prev,
                                                        strapMode: 'INCLUDED',
                                                        linkedStrapProductId: '',
                                                        linkedStrapVariantId: '',
                                                        linkedStrapTitle: '',
                                                    }))
                                                }
                                                className="mt-1"
                                            />
                                            <div>
                                                <div className="font-medium text-slate-900">Dây đã đi kèm sẵn</div>
                                                <div className="text-sm text-slate-500">
                                                    Không lấy thêm dây từ kho, chỉ khai báo loại dây hiện có.
                                                </div>
                                            </div>
                                        </label>

                                        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                                            <input
                                                type="radio"
                                                checked={formData.strapMode === 'INVENTORY'}
                                                onChange={() =>
                                                    setFormData((prev: any) => ({
                                                        ...prev,
                                                        strapMode: 'INVENTORY',
                                                    }))
                                                }
                                                className="mt-1"
                                            />
                                            <div>
                                                <div className="font-medium text-slate-900">Lấy dây từ kho</div>
                                                <div className="text-sm text-slate-500">
                                                    Chọn trực tiếp một dây đang có tồn để ghép với sản phẩm.
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Giữ nguyên các field strap cũ của bạn bên dưới */}
                                    {/* Ví dụ: loại dây, màu dây, lug width, buckle width, linked strap... */}
                                </div>
                            </ProductStrapSection>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Product complications"
                        subtitle="Chọn các complication quan trọng của sản phẩm."
                        icon={<RefreshCcw className="h-5 w-5" />}
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
                        title="AI content workflow"
                        subtitle="Tạm thời không dùng thường xuyên. Mặc định đóng để giao diện gọn hơn."
                        icon={<RefreshCcw className="h-5 w-5" />}
                        defaultOpen={false}
                    >
                        <ProductAiPanel
                            productId={id}
                            previewImageUrl={previewImageUrl}
                            images={aiImages}
                            brands={brands}
                            categories={categoryOptions}
                            title={formData.title ?? ''}
                            brandId={formData.brandId ?? ''}
                            categoryId={formData.categoryId ?? ''}
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
                            onContentChange={(next) => {
                                setGeneratedContent(next);
                                if (next?.promoteLong) {
                                    setManualContent(next.promoteLong);
                                }
                            }}
                        />
                    </CollapsibleSection>
                    {canEditPricing && (
                        <CollapsibleSection
                            title="Pricing"
                            subtitle={
                                canEditPricing
                                    ? 'Khối này chỉ hiện cho Admin / người có quyền giá.'
                                    : 'Bạn không có quyền chỉnh giá.'
                            }
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
                                            <div className="mt-1 font-medium text-slate-900">
                                                {formatMoney(baseVariantCostPrice)}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <div className="text-slate-500">
                                                Chi phí dây cộng thêm
                                            </div>
                                            <div className="mt-1 font-medium text-slate-900">
                                                {formatMoney(strapAddedCost)}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <div className="text-slate-500">
                                                Giá vốn sau khi ghép dây
                                            </div>
                                            <div className="mt-1 font-medium text-slate-900">
                                                {formatMoney(effectiveVariantCostPrice)}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <div className="text-slate-500">
                                                Chênh lệch giá bán so với giá vốn
                                            </div>
                                            <div
                                                className={`mt-1 font-medium ${priceGapVsCost != null && priceGapVsCost < 0
                                                    ? 'text-rose-600'
                                                    : 'text-slate-900'
                                                    }`}
                                            >
                                                {priceGapVsCost == null
                                                    ? '—'
                                                    : `${priceGapVsCost >= 0 ? '+' : ''}${new Intl.NumberFormat(
                                                        'vi-VN'
                                                    ).format(priceGapVsCost)}`}
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
                    )}
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

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <div className="flex items-start gap-2">
                            <ShieldAlert className="mt-0.5 h-4 w-4 text-slate-400" />
                            <span>
                                Form hiện dùng soft validate. Chỉ bắt buộc tên sản phẩm, còn lại
                                có thể lưu trước rồi bổ sung sau.
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
}