import { prisma } from "@/server/db/client";
import type {
    AcquisitionListFilters,
    AcquisitionListView,
} from "../shared/search-params";


function normalizeText(value: any) {
    return String(value ?? "").trim();
}

function mapStatus(value: any) {
    return String(value ?? "DRAFT").toUpperCase();
}

function formatStatusLabel(value: any) {
    const status = mapStatus(value);

    switch (status) {
        case "DRAFT":
            return "Draft";
        case "POSTED":
            return "Posted";
        case "RETURNED":
            return "Returned";
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
                    Vendor: {
                        is: {
                            name: { contains: q, mode: "insensitive" },
                        },
                    },
                },
                {
                    AcquisitionItem: {
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
        and.push({
            vendorId: normalizeText(input.vendorId),
        });
    }

    if (normalizeText(input.status)) {
        and.push({
            accquisitionStt: normalizeText(input.status),
        });
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
            return status === "CANCELLED";

        case "open":
            return !["POSTED", "RETURNED", "CANCELLED"].includes(status);

        case "all":
        default:
            return true;
    }
}

function buildItemTitle(item: any) {
    return (
        item?.productTitle ||
        item?.Product?.title ||
        item?.description ||
        "Untitled watch"
    );
}

function buildItemSubtitle(item: any) {
    return item?.description || item?.Product?.sku || "";
}

export async function listAdminAcquisitions(input: AcquisitionListFilters) {
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const rows = await prisma.acquisition.findMany({
        where: buildWhere(input),
        orderBy: [{ updatedAt: "desc" }],
        include: {
            Vendor: true,
            AcquisitionItem: {
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            sku: true,
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
        const acquisitionItems = Array.isArray(row.AcquisitionItem)
            ? row.AcquisitionItem
            : [];

        const linkedWatchCount = acquisitionItems.filter(
            (item) => Boolean(item?.productId)
        ).length;

        const detailItems = acquisitionItems.map((item, index) => ({
            id: item.id,
            index: index + 1,
            title: buildItemTitle(item),
            subtitle: buildItemSubtitle(item),
            linkedWatchProductId: item.productId ?? null,
            linkedWatchTitle: item.product?.title ?? null,
            linkedWatchSku: item.product?.sku ?? null,
            cost: item.cost != null ? Number(item.cost) : null,
            quantity:
                item.quantity != null && Number.isFinite(Number(item.quantity))
                    ? Number(item.quantity)
                    : null,
        }));

        const previewTitles = detailItems.slice(0, 2).map((item) => item.title);
        const remaining = Math.max(detailItems.length - previewTitles.length, 0);

        return {
            id: row.id,
            refNo: row.refNo ?? "-",
            status: mapStatus(row.accquisitionStt),
            statusLabel: formatStatusLabel(row.accquisitionStt),
            vendorName: row.Vendor?.name ?? "-",
            itemCount: acquisitionItems.length,
            linkedWatchCount,
            totalAmount: row.cost != null ? Number(row.cost) : null,
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