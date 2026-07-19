import { ImageRole, PaymentDirection, PaymentStatus } from "@prisma/client";

import { prisma } from "@/server/db/client";
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

function toNumber(value: unknown) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

function buildPaymentSummary(payments: Array<{ status: unknown; amount: unknown }>, totalAmount: number) {
    const paidAmount = payments
        .filter((payment) => String(payment.status ?? "").toUpperCase() === "PAID")
        .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

    const pendingAmount = payments
        .filter((payment) => String(payment.status ?? "").toUpperCase() === "UNPAID")
        .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

    const activeAmount = payments
        .filter((payment) => {
            const status = String(payment.status ?? "").toUpperCase();
            return status === "PAID" || status === "UNPAID" || status === "COLLECTED";
        })
        .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

    const remainingAmount = Math.max(0, totalAmount - paidAmount);
    const isFullyPaid = totalAmount > 0 && remainingAmount <= 0;

    return {
        paymentStatus: isFullyPaid ? "PAID" : paidAmount > 0 ? "PARTIAL_PAID" : "UNPAID",
        paymentPaidAmount: paidAmount,
        paymentPendingAmount: pendingAmount,
        paymentActiveAmount: activeAmount,
        paymentRemainingAmount: remainingAmount,
        paymentIsFullyPaid: isFullyPaid,
    };
}

export async function listAdminAcquisitions(
    input: AcquisitionListFilters,
): Promise<AcquisitionListProjectionResult> {
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where = buildWhere(input);
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

    const paymentRows = pagedIds.length
        ? await prisma.payment.findMany({
            where: {
                acquisition_id: { in: pagedIds },
                direction: PaymentDirection.OUT,
                status: {
                    in: [
                        PaymentStatus.UNPAID,
                        PaymentStatus.PAID,
                        "COLLECTED" as any,
                    ],
                },
            },
            select: {
                acquisition_id: true,
                status: true,
                amount: true,
            },
        })
        : [];

    const paymentsByAcquisitionId = new Map<string, typeof paymentRows>();

    for (const payment of paymentRows) {
        if (!payment.acquisition_id) continue;
        const list = paymentsByAcquisitionId.get(payment.acquisition_id) ?? [];
        list.push(payment);
        paymentsByAcquisitionId.set(payment.acquisition_id, list);
    }

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
        const paymentSummary = buildPaymentSummary(
            paymentsByAcquisitionId.get(row.id) ?? [],
            totalAmount,
        );

        return {
            id: row.id,
            refNo: row.refNo ?? "-",
            approvalStatus: mapStatus(row.accquisitionStt),
            approvalStatusLabel: formatStatusLabel(row.accquisitionStt),
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
