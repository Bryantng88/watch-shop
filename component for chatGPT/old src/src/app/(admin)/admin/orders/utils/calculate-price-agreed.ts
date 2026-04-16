type DiscountType = 'PERCENT' | 'AMOUNT';

export function calcUnitPriceAgreed(params: {
    listPrice: number;
    discountType?: DiscountType | null;
    discountValue?: number | null;
}) {
    const { listPrice, discountType, discountValue } = params;

    if (!discountType || !discountValue || discountValue <= 0) {
        return listPrice;
    }

    if (discountType === 'PERCENT') {
        return Math.round(listPrice * (1 - discountValue / 100));
    }

    if (discountType === 'AMOUNT') {
        return Math.max(listPrice - discountValue, 0);
    }

    return listPrice;
}