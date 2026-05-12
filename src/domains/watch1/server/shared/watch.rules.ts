import type {
    UpdateWatchPricingInput,
    UpsertWatchSpecInput,
} from "./watch.dto";

export function assertWatchWritable(status?: string | null) {
    if (status === "SOLD") {
        throw new Error("Watch đã bán, không thể sửa theo luồng này");
    }
}

export function validateWatchPricingInput(input: UpdateWatchPricingInput) {
    const fields = [
        ["costPrice", input.costPrice],
        ["serviceCost", input.serviceCost],
        ["landedCost", input.landedCost],
        ["listPrice", input.listPrice],
        ["salePrice", input.salePrice],
        ["minPrice", input.minPrice],
    ] as const;

    for (const [label, value] of fields) {
        if (value == null || value === "") continue;
        const n = Number(value);
        if (!Number.isFinite(n) || n < 0) {
            throw new Error(`${label} không hợp lệ`);
        }
    }
}

export function normalizeWatchSpecInput(input: UpsertWatchSpecInput) {
    if (
        input.goldKarat != null &&
        ![10, 14, 18].includes(Number(input.goldKarat))
    ) {
        throw new Error("goldKarat chỉ chấp nhận 10, 14, 18");
    }

    if (
        input.goldTreatment &&
        !(
            input.primaryCaseMaterial === "GOLD" ||
            input.secondaryCaseMaterial === "GOLD"
        )
    ) {
        throw new Error("goldTreatment chỉ hợp lệ khi vật liệu có GOLD");
    }

    return input;
}

export function computeWatchMargin(input: {
    costPrice?: number | null;
    salePrice?: number | null;
}) {
    const cost = input.costPrice ?? 0;
    const sale = input.salePrice ?? 0;
    return sale - cost;
}