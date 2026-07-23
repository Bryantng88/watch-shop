import { ImageRole } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { getPaymentOwnerSummaryProjections } from "@/domains/projection/server/payment-owner-summary.projection";
import type {
    AcquisitionListFilters,
} from "../../shared/search-params";
import {
    cleanAcquisitionItemDescription,
    getAiMetaFromDescription,
} from "../../shared/acquisition-item-metadata";
import type { AcquisitionListProjectionResult } from "../../shared/acquisition-list.projection";

function normalizeText(value: unknown) {
    return String(value ?? "").trim();
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

function buildWhere(input: AcquisitionListFilters, acquisitionIds: string[] = []) {
    const and: any[] = [];

    if (input.audienceSegment) {
        and.push({ audienceSegment: input.audienceSegment });
    }

    if (acquisitionIds.length) {
        and.push({ id: { in: acquisitionIds } });
    }

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

    if (normalizeText(input.type)) {
        and.push({ type: normalizeText(input.type) });
    }

    const legacyView = input.view ?? "all";
    const requestedStatus = normalizeText(input.status);
    if (requestedStatus) {
        if (requestedStatus === "CANCELLED") {
            and.push({ accquisitionStt: "CANCELED" });
        } else {
            and.push({ accquisitionStt: requestedStatus });
        }
    } else if (legacyView === "open") {
        and.push({
            accquisitionStt: { notIn: ["POSTED", "CANCELED"] },
        });
    } else if (legacyView === "returned") {
        and.push({ id: "__unsupported_returned_acquisition__" });
    } else if (legacyView !== "all") {
        const legacyStatus = legacyView === "cancelled" ? "CANCELLED" : legacyView.toUpperCase();
        if (legacyStatus === "CANCELLED") {
            and.push({ accquisitionStt: "CANCELED" });
        } else {
            and.push({ accquisitionStt: legacyStatus });
        }
    }

    return and.length ? { AND: and } : {};
}

function buildOrderBy(sort: AcquisitionListFilters["sort"]) {
    switch (sort) {
        case "updatedAsc":
            return [{ updatedAt: "asc" as const }];
        case "createdDesc":
            return [{ createdAt: "desc" as const }];
        case "createdAsc":
            return [{ createdAt: "asc" as const }];
        case "acquiredDesc":
            return [{ acquiredAt: "desc" as const }];
        case "acquiredAsc":
            return [{ acquiredAt: "asc" as const }];
        case "updatedDesc":
        default:
            return [{ updatedAt: "desc" as const }];
    }
}

function toMediaImageUrl(value: unknown) {
    const text = String(value ?? "").trim();
    if (!text) return null;

    if (
        text.startsWith("http://") ||
        text.startsWith("https://") ||
        text.startsWith("data:image/") ||
        text.startsWith("blob:") ||
        text.startsWith("/api/")
    ) {
        return text;
    }

    if (text.startsWith("/")) return text;

    return `/api/media/sign?key=${encodeURIComponent(text)}`;
}

function getFirstMetaImageUrl(item: any) {
    const images = getAiMetaFromDescription(item?.description)?.images ?? [];
    const firstWithUrl = images.find((image) => String(image?.url ?? "").trim());
    const firstWithKey = images.find((image) => String(image?.key ?? "").trim());

    return (
        toMediaImageUrl(firstWithUrl?.url) ??
        toMediaImageUrl(firstWithKey?.key) ??
        null
    );
}

function getFirstProductImageUrl(product: any) {
    if (!product) return null;

    const primaryProductImage = Array.isArray(product.productImage)
        ? product.productImage.find((image: any) => image?.isPrimary) ?? product.productImage[0]
        : null;

    return (
        toMediaImageUrl(product.storefrontImageKey) ??
        toMediaImageUrl(product.primaryImageUrl) ??
        toMediaImageUrl(primaryProductImage?.fileKey) ??
        null
    );
}

function buildItemImageUrl(item: any) {
    return getFirstProductImageUrl(item?.product) ?? getFirstMetaImageUrl(item);
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

export async function listAdminAcquisitionsFromSource(
    input: AcquisitionListFilters,
    acquisitionIds: string[] = [],
): Promise<AcquisitionListProjectionResult> {
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where = buildWhere(input, acquisitionIds);
    const [rows, total] = await Promise.all([
        prisma.acquisition.findMany({
        where,
        orderBy: buildOrderBy(input.sort),
        skip,
        take: pageSize,
        include: {
            vendor: true,
            _count: { select: { Invoice: true } },
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
                                where: { role: ImageRole.INLINE },
                                select: {
                                    fileKey: true,
                                    isPrimary: true,
                                    sortOrder: true,
                                },
                                orderBy: [
                                    { isPrimary: "desc" },
                                    { sortOrder: "asc" },
                                    { createdAt: "asc" },
                                ],
                                take: 3,
                            },
                        },
                    },
                },
                orderBy: [{ createdAt: "asc" }],
            },
        },
        }),
        prisma.acquisition.count({ where }),
    ]);

    const pagedIds = rows.map((row) => row.id);

    const paymentSummaries = await getPaymentOwnerSummaryProjections(prisma, "ACQUISITION", pagedIds);

    const items = rows.map((row) => {
        const acquisitionItems = Array.isArray(row.acquisitionItem)
            ? row.acquisitionItem
            : [];

        const linkedWatchCount = acquisitionItems.filter((item) => Boolean(item?.productId)).length;

        const detailItems = acquisitionItems.map((item, index) => {
            const quantity =
                item.quantity != null && Number.isFinite(Number(item.quantity))
                    ? Number(item.quantity)
                    : null;
            const cost = item.unitCost != null ? Number(item.unitCost) : null;
            const totalAmount = cost != null ? cost * (quantity ?? 1) : null;

            return {
                id: item.id,
                index: index + 1,
                title: buildItemTitle(item),
                subtitle: buildItemSubtitle(item),
                imageUrl: buildItemImageUrl(item),
                linkedWatchProductId: item.productId ?? null,
                linkedWatchTitle: item.product?.title ?? null,
                linkedWatchSku: item.product?.sku ?? null,
                totalAmount,
                quantity,
            };
        });

        const previewTitles = detailItems.slice(0, 2).map((item) => item.title);
        const remaining = Math.max(detailItems.length - previewTitles.length, 0);
        const totalAmount = row.totalAmount != null ? Number(row.totalAmount) : 0;
        const projection = paymentSummaries.get(row.id);
        const recognizedPaid = (projection?.paidTotal ?? 0) + (projection?.collectedTotal ?? 0);
        const remainingAmount = projection?.remaining ?? totalAmount;
        const paymentSummary = {
            paymentStatus: totalAmount > 0 && remainingAmount <= 0 ? "PAID" : recognizedPaid > 0 ? "PARTIAL_PAID" : "UNPAID",
            paymentPaidAmount: recognizedPaid,
            paymentPendingAmount: projection?.unpaidTotal ?? 0,
            paymentActiveAmount: recognizedPaid + (projection?.unpaidTotal ?? 0),
            paymentRemainingAmount: remainingAmount,
            paymentIsFullyPaid: totalAmount > 0 && remainingAmount <= 0,
        };

        return {
            id: row.id,
            audienceSegment: row.audienceSegment ?? "MEN",
            refNo: row.refNo ?? "-",
            approvalStatus: mapStatus(row.accquisitionStt),
            approvalStatusLabel: formatStatusLabel(row.accquisitionStt),
            vendorId: row.vendorId ?? null,
            vendorName: row.vendor?.name ?? "-",
            itemCount: acquisitionItems.length,
            linkedWatchCount,
            totalAmount: row.totalAmount != null ? Number(row.totalAmount) : null,
            notes: row.notes ?? "",
            acquiredAt: row.acquiredAt ? row.acquiredAt.toISOString() : "",
            createdAt: row.createdAt ? row.createdAt.toISOString() : "",
            updatedAt: row.updatedAt ? row.updatedAt.toISOString() : "",
            acquisitionType: String(row.type ?? "PURCHASE"),
            currency: row.currency ?? "VND",
            hasInvoice: row._count.Invoice > 0,
            previewTitles,
            remainingCount: remaining,
            detailItems,
            ...paymentSummary,
        };
    });

    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
}
