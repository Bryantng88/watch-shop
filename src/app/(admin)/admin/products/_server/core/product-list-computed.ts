export type ProductServiceState =
    | "DONE"
    | "IN_PROGRESS"
    | "PENDING"
    | "NOT_REQUIRED";

export type ProductReadinessStage =
    | "DRAFT"
    | "PROCESSING"
    | "READY"
    | "HOLD"
    | "SOLD";

export type ProductPricingState =
    | "READY_PRICE"
    | "MISSING_PRICE";

export type ProductListComputed = {
    hasContent: boolean;
    hasImages: boolean;
    hasSellPrice: boolean;
    serviceState: ProductServiceState;
    readinessStage: ProductReadinessStage;
    pricingState: ProductPricingState;
};

export type BuildProductListComputedInput = {
    productStatus?: string | null;
    contentStatus?: string | null;
    postContent?: string | null;
    imageCount?: number | null;
    hasOpenService?: boolean;
    latestServiceStatus?: string | null;
    needService?: boolean;
    salePrice?: number | null;
    basePrice?: number | null;
};

function normalize(value?: string | null) {
    return String(value ?? "").trim().toUpperCase();
}

function resolveServiceState(input: {
    hasOpenService: boolean;
    needService: boolean;
    latestServiceStatus?: string | null;
}): ProductServiceState {
    if (input.hasOpenService) return "IN_PROGRESS";
    if (input.needService) return "PENDING";
    if (input.latestServiceStatus) return "DONE";
    return "NOT_REQUIRED";
}

function resolveReadinessStage(input: {
    productStatus?: string | null;
    hasContent: boolean;
    hasImages: boolean;
}): ProductReadinessStage {
    const status = normalize(input.productStatus);

    if (status === "SOLD") return "SOLD";

    if (
        status === "HOLD" ||
        status === "CONSIGNED_FROM" ||
        status === "CONSIGNED_TO"
    ) {
        return "HOLD";
    }

    if (!input.hasContent && !input.hasImages) return "DRAFT";
    if (input.hasContent && input.hasImages) return "READY";
    return "PROCESSING";
}

export function buildProductListComputed(
    input: BuildProductListComputedInput
): ProductListComputed {
    const hasContent =
        Boolean(String(input.postContent ?? "").trim()) ||
        normalize(input.contentStatus) === "PUBLISHED";

    const hasImages = Number(input.imageCount ?? 0) > 0;

    const sellPrice = Number(input.salePrice ?? input.basePrice ?? 0);
    const hasSellPrice = Number.isFinite(sellPrice) && sellPrice > 0;

    const serviceState = resolveServiceState({
        hasOpenService: Boolean(input.hasOpenService),
        needService: Boolean(input.needService),
        latestServiceStatus: input.latestServiceStatus,
    });

    const readinessStage = resolveReadinessStage({
        productStatus: input.productStatus,
        hasContent,
        hasImages,
    });

    return {
        hasContent,
        hasImages,
        hasSellPrice,
        serviceState,
        readinessStage,
        pricingState: hasSellPrice ? "READY_PRICE" : "MISSING_PRICE",
    };
}