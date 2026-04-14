import type { GeneratedPayload } from '@/app/(admin)/admin/products/_server/ai/product-ai.type';

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
    'storefrontImageKey',
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

export function toNullableNumber(value: any): number | null {
    if (value === '' || value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

export function parseStoredStrapAttachment(raw: unknown) {
    if (typeof raw !== 'string' || !raw.startsWith(STRAP_ATTACHMENT_PREFIX)) return null;

    try {
        const parsed = JSON.parse(raw.slice(STRAP_ATTACHMENT_PREFIX.length));
        if (!parsed || typeof parsed !== 'object') return null;
        if (!(parsed as any).variantId || !(parsed as any).productId) return null;
        return parsed as {
            productId: string;
            variantId: string;
            title?: string | null;
            vendorName?: string | null;
            costPrice?: number | null;
            price?: number | null;
            strapSpec?: {
                lugWidthMM?: number | null;
                buckleWidthMM?: number | null;
                color?: string | null;
                material?: string | null;
                quickRelease?: boolean | null;
            } | null;
            baseName?: string | null;
        };
    } catch {
        return null;
    }
}

function isAbsoluteUrl(value: string) {
    return /^https?:\/\//i.test(value) || value.startsWith('data:');
}

function looksLikeStorageKey(value: string) {
    return (
        value.includes('/') &&
        !value.startsWith('/api/') &&
        !value.startsWith('/')
    );
}

export function signedImageUrl(key: string) {
    return `/api/media/sign?key=${encodeURIComponent(key)}`;
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
    storefrontImageKey?: string | null;
    primaryImageUrl?: string | null;
    image?: Array<{ fileKey?: string | null; url?: string | null }>;
    images?: Array<{ fileKey?: string | null; url?: string | null }>;
}) {
    const storefrontKey = String(input?.storefrontImageKey ?? '').trim();
    if (storefrontKey) return signedImageUrl(storefrontKey);

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
        storefrontImageKey: initial?.storefrontImageKey ?? '',
        storefrontImageUrl: initial?.storefrontImageKey
            ? signedImageUrl(initial.storefrontImageKey)
            : '',
        tag: initial?.tag ?? '',
        strapMode: storedStrapAttachment?.variantId ? 'INVENTORY' : 'INCLUDED',
        linkedStrapProductId: storedStrapAttachment?.productId ?? '',
        linkedStrapVariantId: storedStrapAttachment?.variantId ?? '',
        linkedStrapTitle: storedStrapAttachment?.title ?? '',
        linkedStrapCostPrice: toNullableNumber(storedStrapAttachment?.costPrice) ?? '',
        generatedContent: {
            specBullets: initial?.content?.specBullets ?? [],
            promoteShort: initial?.content?.promoteShort ?? '',
            promoteLong: initial?.content?.promoteLong ?? initial?.content?.generatedContent ?? initial?.postContent ?? '',
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

export type ClosingLineTone = "playful" | "standard";

export type BuildClosingLineInput = {
    brand?: string | null;
    movement?: string | null;
    caseType?: string | null;
    condition?: string | null;
    dialColor?: string | null; // 👈 thêm dòng này
    price?: number | null;
    tone?: ClosingLineTone;
};

function cleanText(value?: string | null) {
    return String(value ?? "").trim();
}

function sentenceCase(value: string) {
    const raw = cleanText(value);
    if (!raw) return "";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function normalizeMovement(value?: string | null) {
    const raw = cleanText(value).toLowerCase();
    if (!raw) return "";

    if (raw.includes("automatic")) return "Automatic";
    if (raw.includes("auto")) return "Automatic";
    if (raw.includes("quartz")) return "Quartz";
    if (raw.includes("manual")) return "máy tay";
    if (raw.includes("handwind")) return "máy tay";
    if (raw.includes("hand-wind")) return "máy tay";

    return cleanText(value);
}

function normalizeCaseType(value?: string | null) {
    const raw = cleanText(value);
    if (!raw) return "";
    return raw.toLowerCase();
}

function normalizeCondition(value?: string | null) {
    const raw = cleanText(value);
    if (!raw) return "";
    return raw.toLowerCase();
}
function normalizeDialColor(value?: string | null) {
    const raw = cleanText(value).toLowerCase();
    if (!raw) return "";

    // normalize một số màu phổ biến cho đẹp câu chữ
    if (raw.includes("black")) return "đen";
    if (raw.includes("white")) return "trắng";
    if (raw.includes("silver")) return "silver";
    if (raw.includes("gold")) return "gold";
    if (raw.includes("champagne")) return "champagne";
    if (raw.includes("blue")) return "xanh";
    if (raw.includes("navy")) return "xanh navy";
    if (raw.includes("brown")) return "nâu";
    if (raw.includes("green")) return "xanh lá";
    if (raw.includes("linen")) return "linen";

    return raw;
}



export function buildPricePhrase(
    price?: number | null,
    tone: ClosingLineTone = "playful"
) {
    if (price == null || !Number.isFinite(price) || price <= 0) return null;



    const million = price / 1_000_000;

    if (tone === "playful") {
        if (million < 5) {
            return `Tiệm có giá chỉ x triệu tiểu học`;
        }

        if (million < 10) {
            return `Tiệm có giá chỉ X triệu vừa phải`;
        }

        if (million < 20) {
            return `Tiệm có giá loanh quanh 1x triệu cho một chiếc đồng hồ có giá trị sưu tầm rõ ràng`;
        }

        return `Inbox Tiệm để lấy giá cho một chiếc đồng hồ giá trị sưu tầm cao`;
    }

    if (million < 5) {
        return `Tiệm có chỉ x triệu rất dễ tiếp cận`;
    }

    if (million < 10) {
        return `Tiệm có X triệu khá hợp lý`;
    }

    if (million < 20) {
        return `Tiệm có 1x triệu cho một chiếc đồng hồ có giá trị sưu tầm rõ ràng`;
    }

    return `Inbox Tiệm để lấy giá cho một chiếc đồng hồ giá trị sưu tầm caoo`;
}

function buildBrandPhrase(brand?: string | null) {
    const raw = cleanText(brand);
    return raw || "chiếc đồng hồ này";
}

function buildMovementPhrase(movement?: string | null) {
    const raw = normalizeMovement(movement);
    return raw || "";
}

function buildCasePhrase(caseType?: string | null) {
    const raw = normalizeCaseType(caseType);
    if (!raw) return "";
    return `form ${raw}`;
}

function buildConditionPhrase(condition?: string | null) {
    const raw = normalizeCondition(condition);
    if (!raw) return "";
    return `tình trạng ${raw}`;
}
export function buildDialColorPhrase(dialColor?: string | null) {
    const raw = normalizeDialColor(dialColor);
    if (!raw) return "";

    // 2 kiểu phrasing để đỡ lặp
    const templates = [
        `dial ${raw}`,
        `mặt ${raw}`,
    ];

    // deterministic chọn template để không nhảy lung tung
    const idx = raw.length % templates.length;

    return templates[idx];
}
function joinParts(parts: Array<string | null | undefined>) {
    return parts
        .map((part) => cleanText(part))
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

function getDeterministicTemplateIndex(input: BuildClosingLineInput) {
    const seed = [
        cleanText(input.brand),
        cleanText(input.movement),
        cleanText(input.caseType),
        cleanText(input.condition),
        String(input.price ?? ""),
    ].join("|");

    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) % 1000000007;
    }

    return Math.abs(hash) % 3;
}

export function shouldGenerateClosingLine(input: BuildClosingLineInput) {
    const brand = cleanText(input.brand);
    const movement = cleanText(input.movement);
    const caseType = cleanText(input.caseType);
    const condition = cleanText(input.condition);
    const price = input.price;

    if (price == null || !Number.isFinite(price) || price <= 0) return false;
    if (!brand) return false;

    const enoughSpec =
        Boolean(movement) ||
        Boolean(caseType) ||
        Boolean(condition) ||
        Boolean(input.dialColor);

    return enoughSpec;
}

export function buildClosingLine(input: BuildClosingLineInput) {
    if (!shouldGenerateClosingLine(input)) return null;

    const tone = input.tone ?? "playful";
    const pricePhrase = buildPricePhrase(input.price, tone);
    if (!pricePhrase) return null;

    const brand = buildBrandPhrase(input.brand);
    const movement = buildMovementPhrase(input.movement);
    const casePhrase = buildCasePhrase(input.caseType);
    const dialPhrase = buildDialColorPhrase(input.dialColor);

    const conditionPhrase = buildConditionPhrase(input.condition);

    const subjectFull = joinParts([
        brand,
        movement,
        casePhrase,
        dialPhrase,
        conditionPhrase,
    ]);

    const subjectCompact = joinParts([
        brand,
        casePhrase,
        dialPhrase,
        movement,
        conditionPhrase,
    ]);

    const subjectValue = joinParts([
        brand,
        casePhrase,
        dialPhrase,
        "nằm ở cả thiết kế lẫn giá trị sử dụng",
        conditionPhrase,
    ]);
    const templates = [
        `${pricePhrase}, rất hợp lý cho một chiếc ${subjectFull}.`,
        `${pricePhrase}, mức giá khá đẹp cho một chiếc ${subjectCompact}.`,
        `${pricePhrase}, đủ để thấy sức hút của một chiếc ${subjectValue}.`,
    ];

    return sentenceCase(templates[getDeterministicTemplateIndex(input)]);
}

export function appendClosingLineToContent(
    content: string,
    input: BuildClosingLineInput
) {
    const closingLine = buildClosingLine(input);
    const base = String(content ?? "").trim();

    if (!closingLine) return base;

    const normalizedBase = base.toLowerCase();
    const normalizedClosing = closingLine.toLowerCase();

    if (normalizedBase.includes(normalizedClosing)) {
        return base;
    }

    if (!base) return closingLine;

    return `${base}\n\n${closingLine}`;
}

export function replaceTrailingClosingLine(
    content: string,
    input: BuildClosingLineInput
) {
    const base = String(content ?? "").trim();
    const nextClosingLine = buildClosingLine(input);

    if (!nextClosingLine) return base;

    const paragraphs = base
        .split(/\n{2,}/)
        .map((item) => item.trim())
        .filter(Boolean);

    if (paragraphs.length === 0) {
        return nextClosingLine;
    }

    const last = paragraphs[paragraphs.length - 1].toLowerCase();
    const looksLikeClosingLine =
        last.includes("tiệm có") &&
        (
            last.includes("rất hợp lý") ||
            last.includes("khá hợp lý") ||
            last.includes("giá trị sưu tầm") ||
            last.includes("mức giá khá đẹp") ||
            last.includes("đủ để thấy sức hút")
        );

    if (looksLikeClosingLine) {
        paragraphs[paragraphs.length - 1] = nextClosingLine;
        return paragraphs.join("\n\n");
    }

    return `${base}\n\n${nextClosingLine}`;
}