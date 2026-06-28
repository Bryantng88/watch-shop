"use server";

import { prisma } from "@/server/db/client";
import type {
    BusinessEntityPreview,
    BusinessEntityType,
} from "./business-entity.types";

function mediaUrl(value?: string | null) {
    const raw = String(value ?? "").trim();
    if (!raw) return null;

    if (
        raw.startsWith("http://") ||
        raw.startsWith("https://") ||
        raw.startsWith("/")
    ) {
        return raw;
    }

    return `/api/media/sign?key=${encodeURIComponent(raw)}`;
}

function imageUrlFromProduct(product: any) {
    const img = product?.productImage?.[0];

    const key =
        img?.fileKey ||
        product?.primaryImageUrl ||
        product?.storefrontImageKey ||
        null;

    return mediaUrl(key);
}

function compactId(id: string) {
    if (!id) return "-";
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
}

export async function getBusinessEntityPreviewAction(input: {
    type: BusinessEntityType;
    id: string;
}): Promise<BusinessEntityPreview | null> {
    const id = input.id?.trim();
    if (!id) return null;

    if (input.type === "WATCH") {
        const row = await prisma.watch.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        sku: true,
                        status: true,
                        primaryImageUrl: true,
                        storefrontImageKey: true,
                        brand: { select: { name: true } },
                        productImage: {
                            where: { role: "INLINE" as any },
                            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                            take: 1,
                            select: {
                                id: true,
                                fileKey: true,
                            },
                        },
                    },
                },
            },
        });

        if (!row) return null;

        const product = row.product;

        return {
            type: "WATCH",
            id: row.id,
            title: product?.title || product?.sku || "Watch",
            subtitle: product?.sku ? `SKU: ${product.sku}` : compactId(row.id),
            status: row.saleStage,
            imageUrl: imageUrlFromProduct(product),
            href: `/admin/watches/${product?.id}/edit`, facts: [
                { label: "Brand", value: product?.brand?.name || "-" },
                { label: "Product status", value: product?.status || "-" },
                { label: "Sale stage", value: row.saleStage || "-" },
                { label: "Stock stage", value: row.stockStage || "-" },
            ],
        };
    }

    if (input.type === "ORDER") {
        const row = await prisma.order.findUnique({
            where: { id },
            include: {
                orderItem: {
                    take: 3,
                    include: {
                        product: {
                            include: {
                                productImage: {
                                    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                                    take: 1,
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!row) return null;

        const firstProduct = row.orderItem?.[0]?.product;

        return {
            type: "ORDER",
            id: row.id,
            refNo: row.refNo,
            title: row.refNo || "Order",
            subtitle: row.customerName ? `Khách: ${row.customerName}` : compactId(row.id),
            status: row.status,
            imageUrl: imageUrlFromProduct(firstProduct),
            href: `/admin/orders/${row.id}`,
            facts: [
                { label: "Khách", value: row.customerName || "-" },
                { label: "SĐT", value: row.shipPhone || "-" },
                { label: "Payment", value: row.paymentStatus || "-" },
                { label: "Số sản phẩm", value: row.orderItem?.length ?? 0 },
            ],
        };
    }

    if (input.type === "SHIPMENT") {
        const row = await prisma.shipment.findUnique({
            where: { id },
            include: {
                order: true,
            },
        });

        if (!row) return null;

        return {
            type: "SHIPMENT",
            id: row.id,
            refNo: row.refNo || row.trackingCode,
            title: row.refNo || row.trackingCode || "Shipment",
            subtitle: row.order?.refNo ? `Order: ${row.order.refNo}` : compactId(row.id),
            status: row.status,
            href: `/admin/shipments/${row.id}`,
            facts: [
                { label: "Carrier", value: row.carrier || "-" },
                { label: "Tracking", value: row.trackingCode || "-" },
                { label: "Order", value: row.order?.refNo || row.orderRefNo || "-" },
                { label: "Khách", value: row.customerName || row.order?.customerName || "-" },
            ],
        };
    }

    if (input.type === "SERVICE") {
        const row = await prisma.serviceRequest.findUnique({
            where: { id },
            include: {
                product: {
                    include: {
                        productImage: {
                            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                            take: 1,
                        },
                    },
                },
                customer: true,
                vendor: true,
                user: true,
            },
        });

        if (!row) return null;

        return {
            type: "SERVICE",
            id: row.id,
            refNo: row.refNo,
            title: row.refNo || row.modelSnapshot || row.product?.title || "Service",
            subtitle:
                row.skuSnapshot || row.product?.sku
                    ? `SKU: ${row.skuSnapshot || row.product?.sku}`
                    : compactId(row.id),
            status: row.status,
            imageUrl:
                mediaUrl(row.primaryImageUrlSnapshot) ||
                imageUrlFromProduct(row.product),
            href: `/admin/service/${row.id}`,
            facts: [
                { label: "Status", value: row.status || "-" },
                { label: "Priority", value: row.priority || "-" },
                { label: "Khách", value: row.customer?.name || "-" },
                { label: "Kỹ thuật", value: row.user?.name || row.technicianNameSnap || "-" },
                { label: "Vendor", value: row.vendor?.name || row.vendorNameSnap || "-" },
            ],
        };
    }

    return null;
}