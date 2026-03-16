import { DiscountType, Prisma } from "@prisma/client";

type Decimalish = Prisma.Decimal | number | string | null | undefined;

export function toNumber(v: Decimalish): number | null {
    if (v == null || v === "") return null;
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    if (typeof v === "string") {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    }
    const anyV = v as any;
    if (typeof anyV?.toNumber === "function") {
        const n = anyV.toNumber();
        return Number.isFinite(n) ? n : null;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

export function isSaleActive(start?: Date | string | null, end?: Date | string | null, now = new Date()) {
    const startAt = start ? new Date(start) : null;
    const endAt = end ? new Date(end) : null;
    if (startAt && Number.isFinite(startAt.getTime()) && now < startAt) return false;
    if (endAt && Number.isFinite(endAt.getTime()) && now > endAt) return false;
    return true;
}

export function computeEffectivePrice(params: {
    listPrice?: Decimalish;
    discountType?: DiscountType | null;
    discountValue?: Decimalish;
    salePrice?: Decimalish;
    saleStartsAt?: Date | string | null;
    saleEndsAt?: Date | string | null;
    fallbackPrice?: Decimalish;
    now?: Date;
}) {
    const now = params.now ?? new Date();
    const listPrice = toNumber(params.listPrice);
    const salePrice = toNumber(params.salePrice);
    const discountValue = toNumber(params.discountValue);
    const fallbackPrice = toNumber(params.fallbackPrice);
    const active = isSaleActive(params.saleStartsAt, params.saleEndsAt, now);

    if (!listPrice || listPrice <= 0) {
        return fallbackPrice ?? 0;
    }

    if (active && salePrice != null && salePrice >= 0) {
        return Math.max(0, salePrice);
    }

    if (active && params.discountType && discountValue != null) {
        if (params.discountType === "PERCENT") {
            const pct = Math.max(0, Math.min(100, discountValue));
            return Math.max(0, Math.round(listPrice * (100 - pct)) / 100);
        }

        if (params.discountType === "AMOUNT") {
            return Math.max(0, listPrice - discountValue);
        }
    }

    return listPrice;
}

export function computeDiscountPercent(params: {
    listPrice?: Decimalish;
    effectivePrice?: Decimalish;
}) {
    const listPrice = toNumber(params.listPrice);
    const effectivePrice = toNumber(params.effectivePrice);
    if (!listPrice || listPrice <= 0 || effectivePrice == null) return null;
    if (effectivePrice >= listPrice) return 0;
    return Math.round(((listPrice - effectivePrice) / listPrice) * 100);
}
type VariantLike = {
    price: Prisma.Decimal | number | null;
};

export function computeMinPrice(
    variants: VariantLike[]
): number | null {
    const prices = variants
        .map(v => v.price)
        .filter((p): p is Prisma.Decimal | number => p != null)
        .map(p => Number(p));

    if (prices.length === 0) return null;
    return Math.min(...prices);
}
