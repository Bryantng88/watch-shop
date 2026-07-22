"use server";

import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { authorizeTaskItemDetail } from "@/domains/task/server/core/task-item-detail.service";
import { getTaskItemActivityViewModels } from "@/domains/task/server/activity";
import { resolveWorkspaceCapabilities } from "@/domains/blueprint/shared/workspace-capabilities";
import type {
    BusinessEntityPreview,
    BusinessEntityType,
} from "./business-entity.types";

type ProductPreviewImageSource = {
    primaryImageUrl?: string | null;
    storefrontImageKey?: string | null;
    productImage?: Array<{ fileKey?: string | null }> | null;
};

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

function imageUrlFromProduct(product?: ProductPreviewImageSource | null) {
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
    const auth = await requirePermission("TASK_VIEW");
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
                            where: { role: "INLINE" },
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
                technicalIssue: {
                    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
                    include: {
                        vendor: { select: { name: true } },
                        user: { select: { name: true } },
                        technicalDetailCatalog: {
                            select: {
                                area: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
                TaskExecution: {
                    where: {
                        targetType: "SERVICE_REQUEST",
                        actionType: { not: "CANCELLED" },
                        taskItemId: { not: null },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        taskItemId: true,
                    },
                },
            },
        });

        if (!row) return null;

        const workspaceHref = row.TaskExecution?.[0]?.taskItemId
            ? `/admin/task-items/${row.TaskExecution[0].taskItemId}`
            : null;

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
            href: workspaceHref ?? `/admin/service/${row.id}`,
            facts: [
                { label: "Status", value: row.status || "-" },
                { label: "Priority", value: row.priority || "-" },
                { label: "Khách", value: row.customer?.name || "-" },
                { label: "Kỹ thuật", value: row.user?.name || row.technicianNameSnap || "-" },
                { label: "Vendor", value: row.vendor?.name || row.vendorNameSnap || "-" },
            ],
            sections: row.technicalIssue.length
                ? [
                    {
                        title: "Technical Issues",
                        subtitle: "Các dòng TI thuộc SR này",
                        items: row.technicalIssue.map((issue) => ({
                            id: issue.id,
                            title:
                                issue.summary ||
                                issue.note ||
                                issue.technicalDetailCatalog?.name ||
                                issue.area ||
                                "Technical Issue",
                            subtitle:
                                issue.technicalDetailCatalog?.area ||
                                issue.area ||
                                issue.technicalDetailCatalog?.code ||
                                null,
                            status: issue.executionStatus,
                            facts: [
                                { label: "Vendor", value: issue.vendor?.name || issue.vendorNameSnap || "-" },
                                { label: "Kỹ thuật", value: issue.user?.name || "-" },
                                { label: "Chi phí dự kiến", value: issue.estimatedCost?.toString() || "-" },
                                { label: "Chi phí thực tế", value: issue.actualCost?.toString() || "-" },
                            ],
                            href: workspaceHref,
                        })),
                    },
                ]
                : [],
            actions: workspaceHref
                ? [{ label: "Mở workspace SR", href: workspaceHref }]
                : undefined,
        };
    }

    if (input.type === "TECHNICAL_ISSUE") {
        const row = await prisma.technicalIssue.findUnique({
            where: { id },
            include: {
                serviceRequest: {
                    include: {
                        product: {
                            include: {
                                productImage: {
                                    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                                    take: 1,
                                },
                            },
                        },
                        technicalIssue: {
                            orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
                            include: {
                                vendor: { select: { name: true } },
                                user: { select: { name: true } },
                                technicalDetailCatalog: {
                                    select: { area: true, name: true, code: true },
                                },
                            },
                        },
                        TaskExecution: {
                            where: {
                                targetType: "SERVICE_REQUEST",
                                actionType: { not: "CANCELLED" },
                                taskItemId: { not: null },
                            },
                            orderBy: { createdAt: "desc" },
                            take: 1,
                            select: { taskItemId: true },
                        },
                    },
                },
                vendor: true,
                user: true,
                TaskExecution: {
                    where: {
                        targetType: "TECHNICAL_ISSUE",
                        actionType: { not: "CANCELLED" },
                        taskItemId: { not: null },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        taskItem: {
                            select: {
                                id: true,
                                note: true,
                                userId: true,
                                assignedToUserId: true,
                                task: {
                                    select: {
                                        kind: true,
                                        createdByUserId: true,
                                        assignedToUserId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!row) return null;

        const sr = row.serviceRequest;
        const workspaceHref = sr.TaskExecution?.[0]?.taskItemId
            ? `/admin/task-items/${sr.TaskExecution[0].taskItemId}`
            : null;
        const technicalWorkspaceItem = row.TaskExecution?.[0]?.taskItem ?? null;
        let activity: BusinessEntityPreview["activity"];

        if (technicalWorkspaceItem) {
            try {
                authorizeTaskItemDetail(technicalWorkspaceItem, auth);
                const capabilities = resolveWorkspaceCapabilities({ note: technicalWorkspaceItem.note });
                activity = {
                    taskItemId: technicalWorkspaceItem.id,
                    discussionEnabled: capabilities.discussion,
                    items: await getTaskItemActivityViewModels(technicalWorkspaceItem.id, {
                        limit: 20,
                        scope: {
                            targets: [{ targetType: "TECHNICAL_ISSUE", targetId: row.id }],
                            includeWorkspaceLevel: false,
                        },
                    }),
                };
            } catch {
                activity = undefined;
            }
        }

        return {
            type: "TECHNICAL_ISSUE",
            id: row.id,
            refNo: sr.refNo,
            title: row.summary || row.note || row.area || "Technical Issue",
            subtitle: sr.refNo
                ? `SR: ${sr.refNo}`
                : sr.skuSnapshot || sr.product?.sku || compactId(sr.id),
            status: row.executionStatus,
            imageUrl:
                mediaUrl(sr.primaryImageUrlSnapshot) ||
                imageUrlFromProduct(sr.product),
            href: workspaceHref ?? `/admin/services/${sr.id}`,
            facts: [
                { label: "SR", value: sr.refNo || "-" },
                { label: "Trạng thái SR", value: sr.status || "-" },
                { label: "Ưu tiên", value: row.priority || "NORMAL" },
                { label: "Nhóm", value: row.area || "-" },
                { label: "Người xử lý", value: row.actionMode || "-" },
                { label: "Kỹ thuật", value: row.user?.name || "-" },
                { label: "Vendor", value: row.vendor?.name || row.vendorNameSnap || "-" },
                { label: "Chi phí dự kiến", value: row.estimatedCost?.toString() || "-" },
            ],
            notes: row.note
                ? [{ label: "Ghi chú kỹ thuật", body: row.note, tone: "info" as const }]
                : undefined,
            activity,
            sections: [
                {
                    title: `Các Technical Issue trong ${sr.refNo || "Service Request"}`,
                    subtitle: "Toàn bộ vấn đề kỹ thuật cùng thuộc một hồ sơ SR",
                    items: sr.technicalIssue.map((issue) => ({
                        id: issue.id,
                        title: issue.summary || issue.note || issue.technicalDetailCatalog?.name || "Technical Issue",
                        subtitle: issue.id === row.id
                            ? "TI đang xem"
                            : issue.technicalDetailCatalog?.name || issue.area || null,
                        status: String(issue.executionStatus),
                        facts: [
                            { label: "Nhóm", value: issue.area || issue.technicalDetailCatalog?.area || "-" },
                            { label: "Xử lý", value: issue.actionMode || "-" },
                            { label: "Kỹ thuật", value: issue.user?.name || "-" },
                            { label: "Vendor", value: issue.vendor?.name || issue.vendorNameSnap || "-" },
                        ],
                    })),
                },
            ],
            actions: workspaceHref
                ? [{ label: "Mở workspace SR", href: workspaceHref }]
                : [{ label: "Mở Service Request", href: `/admin/services/${sr.id}` }],
        };
    }

    return null;
}
