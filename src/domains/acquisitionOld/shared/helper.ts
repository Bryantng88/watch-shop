export function toNonEmptyString(value: unknown, fallback = "") {
    const text = String(value ?? "").trim();
    return text || fallback;
}

export function computeActiveAcquisitionTotal(
    items: Array<{
        quantity?: number | null;
        unitCost?: number | null;
    }>
) {
    return items.reduce((sum, item) => {
        const qty = Number(item.quantity ?? 0);
        const cost = Number(item.unitCost ?? 0);
        return sum + qty * cost;
    }, 0);
}