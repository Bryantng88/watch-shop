import { WatchSaleState } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { WatchListFilters } from "../../../ui/list/types";
import type { WatchListView } from "../../../shared/watch-status";

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
        saleState: {
            notIn: [WatchSaleState.HOLD, WatchSaleState.SOLD],
        },
    };
}

export function buildWatchListBaseWhere(
    input: WatchListFilters
): Prisma.WatchWhereInput {
    const and: Prisma.WatchWhereInput[] = [];

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
                { watchSpecV2: { is: { model: { contains: q, mode: "insensitive" } } } },
                {
                    watchSpecV2: {
                        is: {
                            referenceNumber: { contains: q, mode: "insensitive" },
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
        and.push({ saleState: input.saleStage as any });
    }

    if (input.opsStage) {
        and.push({ serviceState: input.opsStage as any });
    }

    return and.length ? { AND: and } : {};
}

export function buildWatchListSegmentWhere(
    view?: WatchListView
): Prisma.WatchWhereInput {
    switch (view) {
        case "draft":
            return {
                AND: [
                    buildWatchNonTerminalSaleWhere(),
                    { NOT: buildWatchHasContentWhere() },
                    { NOT: buildWatchHasGalleryImageWhere() },
                ],
            };

        case "processing":
            return {
                AND: [
                    buildWatchNonTerminalSaleWhere(),
                    {
                        OR: [
                            {
                                AND: [
                                    buildWatchHasContentWhere(),
                                    { NOT: buildWatchHasGalleryImageWhere() },
                                ],
                            },
                            {
                                AND: [
                                    { NOT: buildWatchHasContentWhere() },
                                    buildWatchHasGalleryImageWhere(),
                                ],
                            },
                        ],
                    },
                ],
            };

        case "ready":
            return {
                AND: [
                    buildWatchNonTerminalSaleWhere(),
                    buildWatchHasContentWhere(),
                    buildWatchHasGalleryImageWhere(),
                ],
            };

        case "hold":
            return { saleState: WatchSaleState.HOLD };

        case "sold":
            return { saleState: WatchSaleState.SOLD };

        case "all":
        default:
            return {};
    }
}

export function buildWatchListWhere(
    input: WatchListFilters,
    view: WatchListView
): Prisma.WatchWhereInput {
    return mergeWatchWhere(
        buildWatchListBaseWhere(input),
        buildWatchListSegmentWhere(view)
    );
}

export function buildWatchListSummaryWhere(
    listWhere: Prisma.WatchWhereInput,
    target: "content" | "image"
): Prisma.WatchWhereInput {
    return mergeWatchWhere(
        listWhere,
        target === "content" ? buildWatchHasContentWhere() : buildWatchHasGalleryImageWhere()
    );
}
