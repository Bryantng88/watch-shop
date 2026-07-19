import { WatchSaleStage, WatchServiceStage } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { WatchListFilters, WatchListSubFilter } from "../../ui/list/types";
import type { WatchListView } from "../../shared/watch-status";

export const WATCH_LIST_THUMBNAIL_IMAGE_ROLES = ["INLINE", "GALLERY"] as const;
export const WATCH_LIST_READY_IMAGE_ROLES = ["GALLERY"] as const;

export function mergeWatchWhere(
    ...items: Prisma.WatchWhereInput[]
): Prisma.WatchWhereInput {
    const filtered = items.filter((item) => Object.keys(item).length > 0);

    if (filtered.length === 0) return {};
    if (filtered.length === 1) return filtered[0];

    return { AND: filtered };
}

export function buildWatchHasContentWhere(): Prisma.WatchWhereInput {
    return {
        OR: [
            { watchContent: { is: { titleOverride: { not: null } } } },
            { watchContent: { is: { hookText: { not: null } } } },
            { watchContent: { is: { body: { not: null } } } },
            { watchContent: { is: { summary: { not: null } } } },
            {
                watchContent: {
                    is: {
                        bulletSpecs: {
                            isEmpty: false,
                        },
                    },
                },
            },
        ],
    };
}

export function buildWatchHasGalleryImageWhere(): Prisma.WatchWhereInput {
    return {
        product: {
            is: {
                productImage: {
                    some: {
                        role: {
                            in: [...WATCH_LIST_READY_IMAGE_ROLES] as any,
                        },
                    },
                },
            },
        },
    };
}

export function buildWatchNonTerminalSaleWhere(): Prisma.WatchWhereInput {
    return {
        saleStage: {
            notIn: [WatchSaleStage.HOLD, WatchSaleStage.SOLD],
        },
    };
}
function reviewSubmittedWhere(): Prisma.WatchWhereInput {
    return {
        AND: [
            notPostedWhere(),
            {
                OR: [
                    {
                        reviewStates: {
                            some: {
                                targetType: "CONTENT" as any,
                                status: "SUBMITTED" as any,
                            },
                        },
                    },
                    {
                        reviewStates: {
                            some: {
                                targetType: "IMAGE" as any,
                                status: "SUBMITTED" as any,
                            },
                        },
                    },
                ],
            },
        ],
    };
}
function reviewApprovedWhere(
    targetType: "CONTENT" | "IMAGE",
): Prisma.WatchWhereInput {
    return {
        reviewStates: {
            some: {
                targetType: targetType as any,
                status: "APPROVED" as any,
            },
        },
    };
}

function reviewRejectedWhere(
    targetType: "CONTENT" | "IMAGE",
): Prisma.WatchWhereInput {
    return {
        reviewStates: {
            some: {
                targetType: targetType as any,
                status: "REJECTED" as any,
            },
        },
    };
}

function reviewNotApprovedWhere(
    targetType: "CONTENT" | "IMAGE",
): Prisma.WatchWhereInput {
    return {
        NOT: reviewApprovedWhere(targetType),
    };
}

function notPostedWhere(): Prisma.WatchWhereInput {
    return {
        OR: [{ isContentDownloaded: false }, { isImageDownloaded: false }],
    };
}

function postedWhere(): Prisma.WatchWhereInput {
    return {
        isContentDownloaded: true,
        isImageDownloaded: true,
    };
}

function buildOperationalMediaWhere(status: string): Prisma.WatchWhereInput {
    switch (status) {
        case "POSTED":
            return postedWhere();
        case "NO_IMAGE":
        case "PHOTOSHOOT":
            return { NOT: buildWatchHasGalleryImageWhere() };
        case "READY_TO_PUBLISH":
            return {
                AND: [
                    notPostedWhere(),
                    reviewApprovedWhere("CONTENT"),
                    reviewApprovedWhere("IMAGE"),
                ],
            };
        case "NEEDS_REWORK":
            return {
                AND: [
                    notPostedWhere(),
                    {
                        OR: [
                            reviewRejectedWhere("CONTENT"),
                            reviewRejectedWhere("IMAGE"),
                        ],
                    },
                ],
            };
        case "MEDIA_PROCESSING":
            return {
                AND: [
                    buildWatchHasGalleryImageWhere(),
                    notPostedWhere(),
                ],
            };
        default:
            return {};
    }
}

function buildOperationalServiceWhere(status: string): Prisma.WatchWhereInput {
    switch (status) {
        case "DONE":
            return { serviceStage: WatchServiceStage.DONE };
        case "IN_SERVICE":
            return { serviceStage: WatchServiceStage.IN_SERVICE };
        case "WAITING":
            return { serviceStage: WatchServiceStage.PENDING };
        case "NOT_REQUIRED":
            return { serviceStage: WatchServiceStage.NOT_REQUIRED };
        case "ISSUE":
            return { id: "__NO_SOURCE_FALLBACK_SERVICE_ISSUE__" };
        default:
            return {};
    }
}

function buildOperationalSaleWhere(status: string): Prisma.WatchWhereInput {
    switch (status) {
        case "SOLD":
            return { saleStage: WatchSaleStage.SOLD };
        case "HOLD":
            return { saleStage: WatchSaleStage.HOLD };
        case "CONSIGNED":
            return { saleStage: WatchSaleStage.CONSIGNED_TO };
        case "READY":
            return {
                saleStage: {
                    notIn: [
                        WatchSaleStage.HOLD,
                        WatchSaleStage.SOLD,
                        WatchSaleStage.CONSIGNED_TO,
                    ],
                },
            };
        default:
            return {};
    }
}

function buildQuickFilterWhere(quickFilter: string): Prisma.WatchWhereInput {
    switch (quickFilter) {
        case "missingPrice":
            return {
                OR: [
                    { watchPrice: null },
                    { watchPrice: { is: { salePrice: null } } },
                ],
            };
        case "missingImage":
            return { NOT: buildWatchHasGalleryImageWhere() };
        case "missingContent":
            return { NOT: buildWatchHasContentWhere() };
        case "photoshoot":
            return buildOperationalMediaWhere("PHOTOSHOOT");
        case "mediaProcessing":
            return buildOperationalMediaWhere("MEDIA_PROCESSING");
        case "readyToPublish":
            return buildOperationalMediaWhere("READY_TO_PUBLISH");
        case "readyToSell":
            return buildOperationalSaleWhere("READY");
        case "hasIssue":
            return buildOperationalMediaWhere("NEEDS_REWORK");
        default:
            return {};
    }
}

function buildPriceStatusWhere(priceStatus: string): Prisma.WatchWhereInput {
    switch (priceStatus) {
        case "MISSING":
            return {
                OR: [
                    { watchPrice: null },
                    { watchPrice: { is: { salePrice: null } } },
                ],
            };
        case "HAS_PRICE":
            return {
                watchPrice: { is: { salePrice: { not: null } } },
            };
        default:
            return {};
    }
}

function buildPriceRangeWhere(input: WatchListFilters): Prisma.WatchWhereInput {
    const rawMin = String(input.priceMin ?? "").trim();
    const rawMax = String(input.priceMax ?? "").trim();
    const min = Number(rawMin);
    const max = Number(rawMax);
    const hasMin = rawMin !== "" && Number.isFinite(min) && min >= 0;
    const hasMax = rawMax !== "" && Number.isFinite(max) && max >= 0;

    if (!hasMin && !hasMax) return {};

    return {
        watchPrice: {
            is: {
                salePrice: {
                    ...(hasMin ? { gte: min } : {}),
                    ...(hasMax ? { lte: max } : {}),
                },
            },
        },
    };
}

function reviewWorkflowWhere(): Prisma.WatchWhereInput {
    return {
        reviewStates: {
            some: {
                status: {
                    in: ["SUBMITTED", "APPROVED", "REJECTED"] as any,
                },
            },
        },
    };
}

function noReviewWorkflowWhere(): Prisma.WatchWhereInput {
    return {
        NOT: reviewWorkflowWhere(),
    };
}

function reviewSubmittedOnlyWhere(): Prisma.WatchWhereInput {
    return {
        AND: [
            notPostedWhere(),
            reviewNotApprovedWhere("CONTENT"),
            reviewNotApprovedWhere("IMAGE"),
            reviewSubmittedWhere(),
        ],
    };
}

function partialApprovedWhere(): Prisma.WatchWhereInput {
    return {
        AND: [
            notPostedWhere(),
            {
                OR: [
                    {
                        AND: [
                            reviewApprovedWhere("CONTENT"),
                            reviewNotApprovedWhere("IMAGE"),
                        ],
                    },
                    {
                        AND: [
                            reviewNotApprovedWhere("CONTENT"),
                            reviewApprovedWhere("IMAGE"),
                        ],
                    },
                ],
            },
        ],
    };
}

export function buildWatchListBaseWhere(
    input: WatchListFilters,
): Prisma.WatchWhereInput {
    const and: Prisma.WatchWhereInput[] = [
        input.duplicateScope === "DUPLICATE"
            ? { duplicateConfirmedAt: { not: null } }
            : { duplicateConfirmedAt: null },
    ];

    if (input.q?.trim()) {
        const q = input.q.trim();

        and.push({
            OR: [
                { product: { is: { title: { contains: q, mode: "insensitive" } } } },
                { product: { is: { sku: { contains: q, mode: "insensitive" } } } },
                {
                    product: {
                        is: {
                            brand: {
                                is: {
                                    name: { contains: q, mode: "insensitive" },
                                },
                            },
                        },
                    },
                },
                {
                    watchSpecV2: {
                        is: {
                            model: { contains: q, mode: "insensitive" },
                        },
                    },
                },
                {
                    watchSpecV2: {
                        is: {
                            referenceNumber: {
                                contains: q,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        });
    }

    if (input.sku?.trim()) {
        and.push({
            product: {
                is: {
                    sku: { contains: input.sku.trim(), mode: "insensitive" },
                },
            },
        });
    }

    if (input.brandId) {
        and.push({ product: { is: { brandId: input.brandId } } });
    }

    if (input.vendorId) {
        and.push({ product: { is: { vendorId: input.vendorId } } });
    }

    if (input.hasContent === "yes") {
        and.push(buildWatchHasContentWhere());
    }

    if (input.hasContent === "no") {
        and.push({ NOT: buildWatchHasContentWhere() });
    }

    if (input.hasImages === "yes") {
        and.push(buildWatchHasGalleryImageWhere());
    }

    if (input.hasImages === "no") {
        and.push({ NOT: buildWatchHasGalleryImageWhere() });
    }

    if (input.saleStage) {
        and.push({ saleStage: input.saleStage as any });
    }

    if (input.opsStage) {
        and.push({ serviceStage: input.opsStage as any });
    }

    if (input.mediaStatus) {
        and.push(buildOperationalMediaWhere(String(input.mediaStatus).toUpperCase()));
    }

    if (input.serviceStatus) {
        and.push(buildOperationalServiceWhere(String(input.serviceStatus).toUpperCase()));
    }

    if (input.saleStatus) {
        and.push(buildOperationalSaleWhere(String(input.saleStatus).toUpperCase()));
    }

    if (input.priceStatus) {
        and.push(buildPriceStatusWhere(String(input.priceStatus).toUpperCase()));
    }

    const priceRangeWhere = buildPriceRangeWhere(input);
    if (Object.keys(priceRangeWhere).length > 0) {
        and.push(priceRangeWhere);
    }

    if (input.quickFilter) {
        and.push(buildQuickFilterWhere(String(input.quickFilter)));
    }

    return and.length ? { AND: and } : {};
}

export function buildWatchListSegmentWhere(
    view?: WatchListView,
): Prisma.WatchWhereInput {
    switch (view) {
        case "draft":
            return { saleStage: WatchSaleStage.DRAFT };

        case "processing":
            return { saleStage: WatchSaleStage.PROCESSING };

        case "ready":
            return { saleStage: WatchSaleStage.READY };

        case "hold":
            return { saleStage: WatchSaleStage.HOLD };

        case "sold":
            return { saleStage: WatchSaleStage.SOLD };

        case "all":
        default:
            return {};
    }
}

export function buildWatchListSubFilterWhere(
    subFilter?: WatchListSubFilter,
): Prisma.WatchWhereInput {
    switch (subFilter) {
        case "MISSING_CONTENT":
            return {
                AND: [
                    { NOT: buildWatchHasContentWhere() },
                    buildWatchHasGalleryImageWhere(),
                ],
            };

        case "MISSING_IMAGE":
            return {
                AND: [
                    buildWatchHasContentWhere(),
                    { NOT: buildWatchHasGalleryImageWhere() },
                ],
            };

        case "REVIEW_DRAFT":
            return {
                AND: [
                    notPostedWhere(),
                    reviewNotApprovedWhere("CONTENT"),
                    reviewNotApprovedWhere("IMAGE"),
                    { NOT: reviewRejectedWhere("CONTENT") },
                    { NOT: reviewRejectedWhere("IMAGE") },
                    {
                        NOT: reviewSubmittedWhere(),
                    },
                ],
            };
        case "REVIEW_SUBMITTED":
            return reviewSubmittedOnlyWhere();

        case "PARTIAL_APPROVED":
            return partialApprovedWhere();
        case "APPROVED":
            return {
                AND: [
                    notPostedWhere(),
                    reviewApprovedWhere("CONTENT"),
                    reviewApprovedWhere("IMAGE"),
                ],
            };

        case "POSTED":
            return postedWhere();

        default:
            return {};
    }
}

export function buildWatchListWhere(
    input: WatchListFilters,
    view: WatchListView,
): Prisma.WatchWhereInput {
    return mergeWatchWhere(
        buildWatchListBaseWhere(input),
        buildWatchListSegmentWhere(view),
        buildWatchListSubFilterWhere(input.subFilter),
    );
}

export function buildWatchListSummaryWhere(
    listWhere: Prisma.WatchWhereInput,
    target: "content" | "image",
): Prisma.WatchWhereInput {
    return mergeWatchWhere(
        listWhere,
        target === "content"
            ? buildWatchHasContentWhere()
            : buildWatchHasGalleryImageWhere(),
    );
}
