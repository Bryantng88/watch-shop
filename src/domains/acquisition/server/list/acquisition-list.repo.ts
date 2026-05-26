import { prisma } from "@/server/db/client";
import type {
    AcquisitionListFilters,
    AcquisitionListView,
} from "../../shared/search-params";
import { cleanAcquisitionItemDescription, getAiMetaFromDescription } from "../../shared/acquisition-item-metadata";

function normalizeText(value: unknown) {
    return String(value ?? "").trim();
}


function buildMediaUrl(fileKey?: string | null) {
    const key = String(fileKey ?? "").trim();

    if (!key) return null;
    if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/")) {
        return key;
    }

    return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

function pickAcquisitionItemImage(item: any) {
    const inlineImage = item?.product?.productImage?.[0] ?? null;
    const productImageKey =
        inlineImage?.fileKey ??
        item?.product?.storefrontImageKey ??
        item?.product?.primaryImageUrl ??
        null;

    if (productImageKey) {
        return {
            imageKey: productImageKey,
            imageUrl: buildMediaUrl(productImageKey),
        };
    }

    const aiImage = getAiMetaFromDescription(item?.description)?.images?.[0] ?? null;
    const rawImage = aiImage?.key ?? aiImage?.url ?? null;

    return {
        imageKey: aiImage?.key ?? null,
        imageUrl: buildMediaUrl(rawImage),
    };
}

function calcItemTotal(item: any) {
    const unitCost = item?.unitCost != null ? Number(item.unitCost) : null;
    const quantity = item?.quantity != null ? Number(item.quantity) : null;

    if (!Number.isFinite(unitCost as number)) return null;
    if (!Number.isFinite(quantity as number) || !quantity) return unitCost;

    return (unitCost as number) * (quantity as number);
}

function mapStatus(value: unknown) {
    return String(value ?? "DRAFT").toUpperCase();
}

function formatStatusLabel(value: unknown) {
    const status = mapStatus(value);

    switch (status) {
        case "DRAFT":
            return "Draft";
        case "POSTED":
            return "Posted";
        case "RETURNED":
            return "Returned";
        case "CANCELED":
        case "CANCELLED":
            return "Cancelled";
        default:
            return status || "-";
    }
}

function buildWhere(input: AcquisitionListFilters) {
    const and: any[] = [];

    if (normalizeText(input.q)) {
        const q = normalizeText(input.q);

        and.push({
            OR: [
                { refNo: { contains: q, mode: "insensitive" } },
                { notes: { contains: q, mode: "insensitive" } },
                { condition: { contains: q, mode: "insensitive" } },
                {
                    vendor: {
                        is: {
                            name: { contains: q, mode: "insensitive" },
                        },
                    },
                },
                {
                    acquisitionItem: {
                        some: {
                            OR: [
                                { productTitle: { contains: q, mode: "insensitive" } },
                                { description: { contains: q, mode: "insensitive" } },
                            ],
                        },
                    },
                },
            ],
        });
    }

    if (normalizeText(input.vendorId)) {
        and.push({ vendorId: normalizeText(input.vendorId) });
    }

    if (normalizeText(input.status)) {
        and.push({ accquisitionStt: normalizeText(input.status) });
    }

    return and.length ? { AND: and } : {};
}

function matchView(row: any, view: AcquisitionListView) {
    const status = mapStatus(row?.accquisitionStt);

    switch (view) {
        case "draft":
            return status === "DRAFT";
        case "posted":
            return status === "POSTED";
        case "returned":
            return status === "RETURNED";
        case "cancelled":
            return status === "CANCELED" || status === "CANCELLED";
        case "open":
            return !["POSTED", "RETURNED", "CANCELED", "CANCELLED"].includes(status);
        case "all":
        default:
            return true;
    }
}

function buildItemTitle(item: any) {
    return (
        item?.productTitle ||
        item?.product?.title ||
        cleanAcquisitionItemDescription(item?.description) ||
        "Untitled watch"
    );
}

function buildItemSubtitle(item: any) {
    return cleanAcquisitionItemDescription(item?.description) || item?.product?.sku || "";
}

export async function listAdminAcquisitions(input: AcquisitionListFilters) {
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const rows = await prisma.acquisition.findMany({
        where: buildWhere(input),
        orderBy: [{ updatedAt: "desc" }],
        include: {
            vendor: true,
            acquisitionItem: {
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            sku: true,
                            primaryImageUrl: true,
                            storefrontImageKey: true,
                            productImage: {
                                where: { role: "INLINE" as any },
                                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                                select: {
                                    id: true,
                                    fileKey: true,
                                    sortOrder: true,
                                },
                                take: 1,
                            },
                        },
                    },
                },
                orderBy: [{ createdAt: "asc" }],
            },
        },
    });

    const allRows = rows.filter((row) => matchView(row, "all"));
    const draftRows = rows.filter((row) => matchView(row, "draft"));
    const openRows = rows.filter((row) => matchView(row, "open"));
    const postedRows = rows.filter((row) => matchView(row, "posted"));
    const returnedRows = rows.filter((row) => matchView(row, "returned"));
    const cancelledRows = rows.filter((row) => matchView(row, "cancelled"));

    const filteredRows = rows.filter((row) => matchView(row, input.view ?? "all"));
    const total = filteredRows.length;
    const pagedRows = filteredRows.slice(skip, skip + pageSize);

    const items = pagedRows.map((row) => {
        const acquisitionItems = Array.isArray(row.acquisitionItem)
            ? row.acquisitionItem
            : [];

        const linkedWatchCount = acquisitionItems.filter((item) => Boolean(item?.productId)).length;

        const detailItems = acquisitionItems.map((item, index) => {
            const image = pickAcquisitionItemImage(item);

            return {
                id: item.id,
                index: index + 1,
                title: buildItemTitle(item),
                subtitle: buildItemSubtitle(item),
                linkedWatchProductId: item.productId ?? null,
                linkedWatchTitle: item.product?.title ?? null,
                linkedWatchSku: item.product?.sku ?? null,
                imageUrl: image.imageUrl,
                imageKey: image.imageKey,
                totalAmount: calcItemTotal(item),
                quantity:
                    item.quantity != null && Number.isFinite(Number(item.quantity))
                        ? Number(item.quantity)
                        : null,
            };
        });

        const previewTitles = detailItems.slice(0, 2).map((item) => item.title);
        const remaining = Math.max(detailItems.length - previewTitles.length, 0);

        return {
            id: row.id,
            refNo: row.refNo ?? "-",
            status: mapStatus(row.accquisitionStt),
            statusLabel: formatStatusLabel(row.accquisitionStt),
            vendorName: row.vendor?.name ?? "-",
            itemCount: acquisitionItems.length,
            linkedWatchCount,
            totalAmount: row.totalAmount != null ? Number(row.totalAmount) : null,
            notes: row.notes ?? "",
            acquiredAt: row.acquiredAt ? row.acquiredAt.toISOString() : "",
            createdAt: row.createdAt ? row.createdAt.toISOString() : "",
            updatedAt: row.updatedAt ? row.updatedAt.toISOString() : "",
            type: row.type ?? null,
            previewTitles,
            remainingCount: remaining,
            detailItems,
        };
    });

    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        counts: {
            all: allRows.length,
            draft: draftRows.length,
            open: openRows.length,
            posted: postedRows.length,
            returned: returnedRows.length,
            cancelled: cancelledRows.length,
        },
    };
}
