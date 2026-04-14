import { ContentStatus, ProductStatus } from "@prisma/client";

export type OpsStage =
    | "NORMAL"
    | "IN_SERVICE"
    | "BLOCKED"
    | "SOLD";

export type SaleStage =
    | "NOT_READY"
    | "READY_TO_POST"
    | "LIVE"
    | "HOLD"
    | "SOLD";

export type SaleMissingKey =
    | "images"
    | "content"
    | "price";

export type OpsFlag =
    | "OPEN_SERVICE"
    | "NEED_SERVICE"
    | "URGENT_ORDER"
    | "MISSING_TECH_INFO";

export type PriorityLevel =
    | "NORMAL"
    | "HIGH"
    | "URGENT";

export type ProductListComputed = {
    opsStage: OpsStage;
    saleStage: SaleStage;
    saleMissing: SaleMissingKey[];
    opsFlags: OpsFlag[];
    priorityLevel: PriorityLevel;
    isReadyForSale: boolean;
    isBlockedForSale: boolean;
    canPostNow: boolean;
};

export type BuildProductListComputedInput = {
    productStatus?: string | null;
    contentStatus?: string | null;
    imageCount?: number | null;
    salePrice?: number | null;
    basePrice?: number | null;
    hasPostContent?: boolean;
    hasOpenService?: boolean;
    needService?: boolean;
    hasHeavyMissingTechInfo?: boolean;
    hasUrgentOrder?: boolean;
};

const MIN_SALE_IMAGES = 3;

const HOLD_STATUSES = new Set<string>([
    ProductStatus.HOLD,
    ProductStatus.CONSIGNED_FROM,
    ProductStatus.CONSIGNED_TO,
]);

function normalizeStatus(value?: string | null) {
    return String(value ?? "").toUpperCase();
}

function resolveSaleStage(input: {
    productStatus?: string | null;
    isReadyForSale: boolean;
    isPosted: boolean;
    isHold: boolean;
}): SaleStage {
    const status = normalizeStatus(input.productStatus);

    if (status === ProductStatus.SOLD) return "SOLD";
    if (input.isHold) return "HOLD";
    if (!input.isReadyForSale) return "NOT_READY";
    if (input.isPosted) return "LIVE";
    return "READY_TO_POST";
}

function resolveOpsStage(input: {
    productStatus?: string | null;
    hasOpenService: boolean;
    needService: boolean;
    hasHeavyMissingTechInfo: boolean;
}): OpsStage {
    const status = normalizeStatus(input.productStatus);

    if (status === ProductStatus.SOLD) return "SOLD";
    if (input.hasOpenService) return "IN_SERVICE";
    if (input.needService && input.hasHeavyMissingTechInfo) return "BLOCKED";
    return "NORMAL";
}

function resolvePriorityLevel(input: {
    hasUrgentOrder: boolean;
    hasOpenService: boolean;
    isReadyForSale: boolean;
    saleStage: SaleStage;
}): PriorityLevel {
    if (input.hasUrgentOrder && input.hasOpenService) return "URGENT";
    if (input.saleStage === "READY_TO_POST") return "HIGH";
    if (input.isReadyForSale) return "HIGH";
    return "NORMAL";
}

export function buildProductListComputed(
    input: BuildProductListComputedInput
): ProductListComputed {
    const imageCount = Number(input.imageCount ?? 0);
    const salePrice = Number(input.salePrice ?? input.basePrice ?? 0);
    const hasPostContent = Boolean(input.hasPostContent);
    const hasOpenService = Boolean(input.hasOpenService);
    const needService = Boolean(input.needService);
    const hasHeavyMissingTechInfo = Boolean(input.hasHeavyMissingTechInfo);
    const hasUrgentOrder = Boolean(input.hasUrgentOrder);

    const missingImages = imageCount < MIN_SALE_IMAGES;
    const missingContent = !hasPostContent;
    const missingPrice = !(Number.isFinite(salePrice) && salePrice > 0);

    const saleMissing: SaleMissingKey[] = [];
    if (missingImages) saleMissing.push("images");
    if (missingContent) saleMissing.push("content");
    if (missingPrice) saleMissing.push("price");

    const isReadyForSale = saleMissing.length === 0;

    const productStatus = normalizeStatus(input.productStatus);
    const contentStatus = normalizeStatus(input.contentStatus);

    const isPosted = contentStatus === ContentStatus.PUBLISHED;
    const isHold = HOLD_STATUSES.has(productStatus);

    const saleStage = resolveSaleStage({
        productStatus,
        isReadyForSale,
        isPosted,
        isHold,
    });

    const opsStage = resolveOpsStage({
        productStatus,
        hasOpenService,
        needService,
        hasHeavyMissingTechInfo,
    });

    const opsFlags: OpsFlag[] = [];
    if (hasOpenService) opsFlags.push("OPEN_SERVICE");
    if (needService) opsFlags.push("NEED_SERVICE");
    if (hasUrgentOrder) opsFlags.push("URGENT_ORDER");
    if (hasHeavyMissingTechInfo) opsFlags.push("MISSING_TECH_INFO");

    const priorityLevel = resolvePriorityLevel({
        hasUrgentOrder,
        hasOpenService,
        isReadyForSale,
        saleStage,
    });

    return {
        opsStage,
        saleStage,
        saleMissing,
        opsFlags,
        priorityLevel,
        isReadyForSale,
        isBlockedForSale: saleStage === "NOT_READY",
        canPostNow: saleStage === "READY_TO_POST",
    };
}