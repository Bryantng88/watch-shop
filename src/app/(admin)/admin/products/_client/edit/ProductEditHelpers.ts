import type { GeneratedPayload } from '@/app/(admin)/admin/products/_server/product-ai.type';

export type PickedImage = { key: string; url: string };
export type Option = { label: string; value: string };
export type Brand = { id: string; name: string };
export type Vendor = { id: string; name: string };
export type Complication = { id: string; name: string };
export type CategoryOption = { id: string; name: string; scope: string };

export type StrapInventoryItem = {
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

export type NormalizedEditProductState = Record<string, any> & {
    generatedContent: GeneratedPayload;
};

export const PRODUCT_KEYS = [
    'title',
    'brandId',
    'description',
    'categoryId',
    'primaryImageUrl',
    'seoDescription',
    'tag',
    'nickname',
] as const;

export const WATCHSPEC_KEYS = [
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

export const VARIANT_KEYS = ['variantPrice'] as const;
export const STRAP_ATTACHMENT_PREFIX = '__STRAP_LINK__:';

export function pickKeys(obj: Record<string, any>, keys: readonly string[]) {
    return Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => keys.includes(k)));
}

export function isPrimitive(v: any) {
    return v === null || (typeof v !== 'object' && typeof v !== 'function');
}

export function isEqualShallow(a: any, b: any) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => JSON.stringify(v) === JSON.stringify(b[i]));
    }
    return a === b;
}

export function diffFlat(from: Record<string, any>, to: Record<string, any>) {
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

export function sanitizeDeep<T extends Record<string, any>>(obj: T | undefined) {
    if (!obj) return undefined;

    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v === '' || v === null || v === undefined) continue;
        out[k] = v;
    }

    return Object.keys(out).length ? out : undefined;
}

export function mergeCurrentValueOption(options: Option[] | undefined, value: any) {
    const base = Array.isArray(options) ? options : [];
    if (value === null || value === undefined || value === '') return base;

    const strValue = String(value);
    const existed = base.some((opt) => String(opt.value) === strValue);
    if (existed) return base;

    return [{ label: strValue, value: strValue }, ...base];
}

export function toNullableNumber(value: any) {
    if (value === '' || value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

export function parseStoredStrapAttachment(raw: any) {
    if (typeof raw !== 'string' || !raw.startsWith(STRAP_ATTACHMENT_PREFIX)) return null;
    try {
        const parsed = JSON.parse(raw.slice(STRAP_ATTACHMENT_PREFIX.length));
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

export function signedImageUrl(key?: string | null) {
    if (!key) return '';
    return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

export function isAbsoluteUrl(value?: string | null) {
    if (!value) return false;
    return /^https?:\/\//i.test(value) || value.startsWith('data:');
}

export function looksLikeStorageKey(value?: string | null) {
    if (!value) return false;
    const v = String(value).trim();

    return (
        v.startsWith('products/') ||
        v.startsWith('/products/') ||
        v.startsWith('inline/') ||
        v.startsWith('/inline/') ||
        v.includes('/chosen/')
    );
}

export function normalizeRenderableImageUrl(value?: string | null) {
    if (!value) return '';

    const v = String(value).trim();
    if (!v) return '';

    if (isAbsoluteUrl(v)) return v;

    if (looksLikeStorageKey(v)) {
        const clean = v.replace(/^\/+/, '');
        return signedImageUrl(clean);
    }

    if (v.startsWith('/')) return v;

    return `/${v.replace(/^\/+/, '')}`;
}

export function buildDisplayImageUrl(input?: {
    primaryImageUrl?: string | null;
    image?: Array<{ fileKey?: string | null; url?: string | null }>;
    images?: Array<{ fileKey?: string | null; url?: string | null }>;
}) {
    const firstFromImage = input?.image?.[0];
    const firstFromImages = input?.images?.[0];

    const firstKey = firstFromImage?.fileKey?.trim() || firstFromImages?.fileKey?.trim() || '';
    if (firstKey) return signedImageUrl(firstKey);

    const primary = normalizeRenderableImageUrl(input?.primaryImageUrl);
    if (primary) return primary;

    const firstUrl =
        normalizeRenderableImageUrl(firstFromImage?.url) ||
        normalizeRenderableImageUrl(firstFromImages?.url);

    return firstUrl;
}

export function hasFilledValue(value: any) {
    if (typeof value === 'number') return Number.isFinite(value);
    if (typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && String(value).trim() !== '';
}

export function formatMoney(value: number | null | undefined) {
    if (value == null || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('vi-VN').format(Number(value));
}

export function normalizeInitial(initial: any): NormalizedEditProductState {
    const firstVariant = initial?.variants?.[0] ?? null;
    const storedStrapAttachment = parseStoredStrapAttachment(firstVariant?.name);
    const ws = initial?.watchSpec ?? {};
    const complicationIds =
        ws?.complication?.map((c: any) => c.id) ??
        initial?.complications?.map((c: any) => c.id) ??
        [];

    const rawImages = initial?.images ?? initial?.image ?? [];

    const images = rawImages.map((img: any, i: number) => {
        const fileKey = img?.fileKey ?? img?.key ?? null;
        const rawUrl = img?.url ?? img?.src ?? null;

        return {
            fileKey,
            alt: img?.alt ?? null,
            sortOrder: img?.sortOrder ?? i,
            url: fileKey ? signedImageUrl(fileKey) : normalizeRenderableImageUrl(rawUrl),
        };
    });

    const currentVariantCost = toNullableNumber(firstVariant?.costPrice);
    const attachedStrapCost = toNullableNumber(storedStrapAttachment?.costPrice) ?? 0;
    const baseVariantCostPrice =
        currentVariantCost != null ? Math.max(currentVariantCost - attachedStrapCost, 0) : null;

    return {
        ...initial,
        ...ws,
        complicationIds,
        categoryId: initial?.categoryId ?? initial?.ProductCategory?.id ?? '',
        brandName: initial?.brand?.name ?? '',
        categoryName: initial?.ProductCategory?.name ?? '',
        variantId: firstVariant?.id ?? undefined,
        variantPrice: firstVariant?.price != null ? Number(firstVariant.price) : '',
        variantCostPrice: currentVariantCost ?? '',
        baseVariantCostPrice: baseVariantCostPrice ?? '',
        image: rawImages,
        images,
        nickname: initial?.nickname ?? '',
        primaryImageUrl: normalizeRenderableImageUrl(initial?.primaryImageUrl ?? ''),
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
        },
    } satisfies NormalizedEditProductState;
}

export function collectSoftWarnings(input: {
    formData: Record<string, any>;
    canEditPricing: boolean;
    aiImages: PickedImage[];
}) {
    const { formData, canEditPricing, aiImages } = input;
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
    if (!Array.isArray(aiImages) || aiImages.length === 0) warnings.push('Ảnh sản phẩm');
    return warnings;
}

export function getAutoSpecJobLimit(newItemsCount: number) {
    return Math.max(2, Math.min(newItemsCount, 6));
}
