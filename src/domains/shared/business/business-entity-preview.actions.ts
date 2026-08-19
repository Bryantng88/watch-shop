"use server";

import { TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";
import { after } from "next/server";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import {
    getBusinessTargetActivityViewModels,
    getTaskItemActivityViewModels,
} from "@/domains/task/server/activity";
import { resolveWorkspaceCapabilities } from "@/domains/blueprint/shared/workspace-capabilities";
import { getAuthUserId } from "@/domains/task/server/core/task.service";
import type {
    BusinessEntityPreview,
    BusinessEntityType,
} from "./business-entity.types";
import {
    updateServiceMovementMeasurement,
    updateTechnicalIssue,
} from "@/domains/service/server";
import { perfStep } from "@/lib/server-perf";
import { resolveProductDisplayImage } from "@/domains/shared/media/server/display-image";
import { ensureTechnicalIssuePaymentTx } from "@/domains/payment/server/service-issue-payment.service";

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

function authHasPermission(auth: unknown, permission: string) {
    if (!auth || typeof auth !== "object" || Array.isArray(auth)) return false;
    const permissions = (auth as { permissions?: unknown }).permissions;
    return Array.isArray(permissions) && permissions.includes(permission);
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

const PREVIEW_TASK_TARGET = {
    WATCH: TaskExecutionTargetType.WATCH,
    ORDER: TaskExecutionTargetType.ORDER,
    SHIPMENT: TaskExecutionTargetType.SHIPMENT,
    PAYMENT: TaskExecutionTargetType.PAYMENT,
    SERVICE: TaskExecutionTargetType.SERVICE_REQUEST,
    TECHNICAL_ISSUE: TaskExecutionTargetType.TECHNICAL_ISSUE,
    ACQUISITION: TaskExecutionTargetType.ACQUISITION,
} satisfies Record<BusinessEntityType, TaskExecutionTargetType>;

async function loadPreviewActivity(input: {
    auth: unknown;
    type: BusinessEntityType;
    targetId: string;
    activityMode?: "ALL" | "DISCUSSION";
    canRead: boolean;
    canEdit: boolean;
}): Promise<BusinessEntityPreview["activity"]> {
    if (!input.canRead) return undefined;
    const taskItem = await prisma.taskExecution.findFirst({
        where: {
            targetType: PREVIEW_TASK_TARGET[input.type],
            targetId: input.targetId,
            actionType: { not: TaskExecutionActionType.CANCELLED },
            taskItemId: { not: null },
        },
        orderBy: { createdAt: "desc" },
        select: {
            taskItem: {
                select: {
                    id: true,
                    note: true,
                },
            },
        },
    });
    if (!taskItem?.taskItem) return undefined;

    const targetType = PREVIEW_TASK_TARGET[input.type];
    const [items, users] = await Promise.all([
        input.activityMode === "DISCUSSION"
            ? getBusinessTargetActivityViewModels(
                targetType,
                input.targetId,
                8,
                "DISCUSSION",
            )
            : getTaskItemActivityViewModels(taskItem.taskItem.id, {
                limit: 20,
                scope: {
                    targets: [{ targetType, targetId: input.targetId }],
                    includeWorkspaceLevel: false,
                },
            }),
        input.canEdit
            ? prisma.user.findMany({
                where: { isActive: true },
                orderBy: [{ name: "asc" }, { email: "asc" }],
                select: { id: true, name: true, email: true, avatarUrl: true },
            })
            : Promise.resolve([]),
    ]);
    const capabilities = resolveWorkspaceCapabilities({
        note: taskItem.taskItem.note,
    });
    return {
        taskItemId: taskItem.taskItem.id,
        discussionEnabled: input.canEdit && capabilities.discussion,
        viewerUserId: getAuthUserId(input.auth),
        mentionableUsers: users.map((user) => ({
            id: user.id,
            label: user.name || user.email,
            avatarUrl: user.avatarUrl,
        })),
        items,
    };
}

export async function getBusinessEntityPreviewAction(input: {
    type: BusinessEntityType;
    id: string;
    activityMode?: "ALL" | "DISCUSSION";
}): Promise<BusinessEntityPreview | null> {
    const auth = await requirePermission("TASK_VIEW");
    const canReadActivity = authHasPermission(auth, PERMISSIONS.ACTIVITY_READ);
    const canEditActivity = authHasPermission(auth, PERMISSIONS.ACTIVITY_EDIT);
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
        const activity = await loadPreviewActivity({
            auth,
            type: "WATCH",
            targetId: row.id,
            activityMode: input.activityMode,
            canRead: canReadActivity,
            canEdit: canEditActivity,
        });

        return {
            type: "WATCH",
            id: row.id,
            title: product?.title || product?.sku || "Watch",
            subtitle: product?.sku ? `SKU: ${product.sku}` : compactId(row.id),
            status: row.saleStage,
            imageUrl: imageUrlFromProduct(product),
            activity,
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
        const activity = await loadPreviewActivity({
            auth,
            type: "ORDER",
            targetId: row.id,
            activityMode: input.activityMode,
            canRead: canReadActivity,
            canEdit: canEditActivity,
        });

        return {
            type: "ORDER",
            id: row.id,
            refNo: row.refNo,
            title: row.refNo || "Order",
            subtitle: row.customerName ? `Khách: ${row.customerName}` : compactId(row.id),
            status: row.status,
            imageUrl: imageUrlFromProduct(firstProduct),
            activity,
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
        const activity = await loadPreviewActivity({
            auth,
            type: "SHIPMENT",
            targetId: row.id,
            activityMode: input.activityMode,
            canRead: canReadActivity,
            canEdit: canEditActivity,
        });

        return {
            type: "SHIPMENT",
            id: row.id,
            refNo: row.refNo || row.trackingCode,
            title: row.refNo || row.trackingCode || "Shipment",
            subtitle: row.order?.refNo ? `Order: ${row.order.refNo}` : compactId(row.id),
            status: row.status,
            activity,
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
            },
        });

        if (!row) return null;

        const activity = await loadPreviewActivity({
            auth,
            type: "SERVICE",
            targetId: row.id,
            activityMode: input.activityMode,
            canRead: canReadActivity,
            canEdit: canEditActivity,
        });
        const workspaceHref = activity?.taskItemId
            ? "/admin/coordination/operation"
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
            imageUrl: resolveProductDisplayImage(
                row.product,
                row.primaryImageUrlSnapshot,
            ),
            activity,
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

    if (input.type === "PAYMENT") {
        const row = await prisma.payment.findUnique({ where: { id } });
        if (!row) return null;
        const activity = await loadPreviewActivity({
            auth,
            type: "PAYMENT",
            targetId: row.id,
            activityMode: input.activityMode,
            canRead: canReadActivity,
            canEdit: canEditActivity,
        });
        const owner =
            row.order_id ||
            row.shipment_id ||
            row.service_request_id ||
            row.technical_issue_id ||
            row.acquisition_id ||
            row.vendor_id ||
            null;

        return {
            type: "PAYMENT",
            id: row.id,
            refNo: row.refNo,
            title: row.refNo || "Payment",
            subtitle: owner ? `Đối tượng: ${compactId(owner)}` : compactId(row.id),
            status: row.status,
            activity,
            facts: [
                { label: "Loại", value: row.type },
                { label: "Mục đích", value: row.purpose },
                { label: "Thu/chi", value: row.direction || "-" },
                {
                    label: "Số tiền",
                    value: `${Number(row.amount).toLocaleString("vi-VN")} ${row.currency}`,
                },
                { label: "Phương thức", value: row.method || "-" },
                { label: "Tham chiếu", value: row.reference || "-" },
            ],
            notes: row.note
                ? [{ label: "Ghi chú", body: row.note, tone: "neutral" }]
                : undefined,
        };
    }

    if (input.type === "ACQUISITION") {
        const row = await prisma.acquisition.findUnique({
            where: { id },
            include: {
                vendor: { select: { name: true } },
                customer: { select: { name: true } },
                _count: { select: { acquisitionItem: true } },
                acquisitionItem: {
                    take: 1,
                    orderBy: { createdAt: "asc" },
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
        const activity = await loadPreviewActivity({
            auth,
            type: "ACQUISITION",
            targetId: row.id,
            activityMode: input.activityMode,
            canRead: canReadActivity,
            canEdit: canEditActivity,
        });
        const firstItem = row.acquisitionItem[0];

        return {
            type: "ACQUISITION",
            id: row.id,
            refNo: row.refNo,
            title: row.refNo || firstItem?.productTitle || "Acquisition",
            subtitle: row.vendor?.name || row.customer?.name || compactId(row.id),
            status: row.accquisitionStt,
            imageUrl: imageUrlFromProduct(firstItem?.product),
            activity,
            facts: [
                { label: "Loại", value: row.type },
                { label: "Vendor", value: row.vendor?.name || "-" },
                { label: "Khách", value: row.customer?.name || "-" },
                { label: "Số item", value: row._count.acquisitionItem },
                {
                    label: "Tổng tiền",
                    value: row.totalAmount
                        ? `${Number(row.totalAmount).toLocaleString("vi-VN")} ${row.currency || "VND"}`
                        : "-",
                },
            ],
            notes: row.notes
                ? [{ label: "Ghi chú", body: row.notes, tone: "neutral" }]
                : undefined,
        };
    }

    if (input.type === "TECHNICAL_ISSUE") {
        const row = await perfStep("business-preview", "technical-issue:source", () =>
          prisma.technicalIssue.findUnique({
            where: { id },
            include: {
                serviceRequest: {
                    include: {
                        technicalAssessment: true,
                        product: {
                            include: {
                                watch: {
                                    include: {
                                        watchSpecV2: true,
                                    },
                                },
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
          }),
        );

        if (!row) return null;

        const sr = row.serviceRequest;
        const technicalWorkspaceItem = row.TaskExecution?.[0]?.taskItem ?? null;
        const movementType = String(
            sr.product?.watch?.movementType ??
            sr.product?.watch?.watchSpecV2?.movementType ??
            "",
        ).toUpperCase();
        const mechanical = !["QUARTZ", "SOLAR", "KINETIC", "MECHAQUARTZ", "HYBRID"]
            .includes(movementType);
        const assessment = sr.technicalAssessment;
        const isEditable = !["DONE", "CANCELED", "CANCELLED"].includes(
            String(row.executionStatus).toUpperCase(),
        );
        const [vendorOptions, activityItems, mentionableUsers] = await perfStep(
          "business-preview",
          "technical-issue:activity-and-options",
          () => Promise.all([
            isEditable
                ? prisma.vendor.findMany({
                    where: { isActive: true },
                    orderBy: { name: "asc" },
                    select: { id: true, name: true },
                })
                : Promise.resolve([]),
            technicalWorkspaceItem && canReadActivity
                ? getBusinessTargetActivityViewModels(
                    "TECHNICAL_ISSUE",
                    row.id,
                    input.activityMode === "DISCUSSION" ? 8 : 20,
                    input.activityMode === "DISCUSSION" ? "DISCUSSION" : "ALL",
                )
                : Promise.resolve([]),
            technicalWorkspaceItem && canReadActivity && canEditActivity
                ? prisma.user.findMany({
                    where: { isActive: true },
                    orderBy: [{ name: "asc" }, { email: "asc" }],
                    select: { id: true, name: true, email: true, avatarUrl: true },
                })
                : Promise.resolve([]),
          ]),
        );
        let activity: BusinessEntityPreview["activity"];

        if (technicalWorkspaceItem && canReadActivity) {
            const capabilities = resolveWorkspaceCapabilities({ note: technicalWorkspaceItem.note });
            activity = {
                taskItemId: technicalWorkspaceItem.id,
                discussionEnabled: canEditActivity && capabilities.discussion,
                viewerUserId: getAuthUserId(auth),
                mentionableUsers: canEditActivity
                    ? mentionableUsers.map((user) => ({
                        id: user.id,
                        label: user.name || user.email,
                        avatarUrl: user.avatarUrl,
                    }))
                    : [],
                items: activityItems,
            };
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
            imageUrl: resolveProductDisplayImage(
                sr.product,
                sr.primaryImageUrlSnapshot,
            ),
            facts: [
                {
                    label: "SR",
                    value: sr.refNo || "-",
                    href: `/admin/services/${sr.id}`,
                },
                { label: "Trạng thái SR", value: sr.status || "-" },
                { label: "Ưu tiên", value: row.priority || "NORMAL" },
                { label: "Nhóm", value: row.area || "-" },
                { label: "Người xử lý", value: row.actionMode || "-" },
                { label: "Kỹ thuật", value: row.user?.name || "-" },
                { label: "Vendor", value: row.vendor?.name || row.vendorNameSnap || "-" },
                { label: "Chi phí dự kiến", value: row.estimatedCost?.toString() || "-" },
                { label: "Chi phí thực tế", value: row.actualCost?.toString() || "-" },
                { label: "Ghi chú kỹ thuật", value: row.note || "-" },
                ...(String(row.area ?? "").toUpperCase() === "MOVEMENT"
                    ? [
                        {
                            label: "Mã máy",
                            value:
                                sr.product?.watch?.movementCalibre ??
                                sr.product?.watch?.watchSpecV2?.calibre ??
                                "-",
                        },
                        ...(mechanical
                            ? [
                                {
                                    label: "Đo trước xử lý",
                                    value: [
                                        assessment?.preRate != null ? `${assessment.preRate} s/day` : null,
                                        assessment?.preAmplitude != null ? `${assessment.preAmplitude}°` : null,
                                        assessment?.preBeatError != null ? `${assessment.preBeatError} ms` : null,
                                    ].filter(Boolean).join(" · ") || "-",
                                },
                                {
                                    label: "Đo sau xử lý",
                                    value: [
                                        assessment?.postRate != null ? `${assessment.postRate} s/day` : null,
                                        assessment?.postAmplitude != null ? `${assessment.postAmplitude}°` : null,
                                        assessment?.postBeatError != null ? `${assessment.postBeatError} ms` : null,
                                    ].filter(Boolean).join(" · ") || "-",
                                },
                            ]
                            : []),
                    ]
                    : []),
            ],
            costCorrection: String(row.executionStatus).toUpperCase() === "DONE"
                ? { actualCost: row.actualCost?.toString() ?? "", missing: row.actualCost == null }
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
            edit: isEditable
                ? {
                    kind: "TECHNICAL_ISSUE",
                    values: {
                        summary: row.summary ?? "",
                        note: row.note ?? "",
                        area: row.area ?? "GENERAL",
                        actionMode: String(row.actionMode ?? "INTERNAL"),
                        vendorId: row.vendorId ?? "",
                        estimatedCost: row.estimatedCost?.toString() ?? "",
                        expectedWorkingDays: row.expectedWorkingDays?.toString() ?? "",
                        machine: {
                            enabled: String(row.area ?? "").toUpperCase() === "MOVEMENT",
                            mechanical,
                            movementCalibre:
                                sr.product?.watch?.movementCalibre ??
                                sr.product?.watch?.watchSpecV2?.calibre ??
                                "",
                            before: {
                                rate: assessment?.preRate?.toString() ?? "",
                                amplitude: assessment?.preAmplitude?.toString() ?? "",
                                beatError: assessment?.preBeatError?.toString() ?? "",
                            },
                            after: {
                                rate: assessment?.postRate?.toString() ?? "",
                                amplitude: assessment?.postAmplitude?.toString() ?? "",
                                beatError: assessment?.postBeatError?.toString() ?? "",
                            },
                        },
                    },
                    vendorOptions,
                }
                : undefined,
        };
    }

    return null;
}

export async function updateTechnicalIssuePreviewAction(input: {
    id: string;
    summary: string;
    note?: string | null;
    area: string;
    actionMode: string;
    vendorId?: string | null;
    estimatedCost?: string | number | null;
    expectedWorkingDays?: string | number | null;
    machine?: {
        enabled?: boolean;
        mechanical?: boolean;
        movementCalibre?: string;
        before?: {
            rate?: string;
            amplitude?: string;
            beatError?: string;
        };
        after?: {
            rate?: string;
            amplitude?: string;
            beatError?: string;
        };
    };
}) {
    const auth = await requirePermission("SERVICE_UPDATE");
    const issue = await prisma.technicalIssue.findUnique({
        where: { id: input.id },
        select: { executionStatus: true },
    });
    if (!issue) throw new Error("Không tìm thấy TI.");
    if (["DONE", "CANCELED", "CANCELLED"].includes(String(issue.executionStatus).toUpperCase())) {
        throw new Error("TI đã Done hoặc đã hủy nên không thể chỉnh sửa.");
    }
    if (
        String(issue.executionStatus).toUpperCase() === "IN_PROGRESS" &&
        !String(input.expectedWorkingDays ?? "").trim()
    ) {
        throw new Error("TI đang xử lý phải có số ngày dự kiến.");
    }
    if (!input.summary.trim()) throw new Error("Vui lòng nhập nội dung TI.");
    if (String(input.actionMode).toUpperCase() === "VENDOR" && !input.vendorId) {
        throw new Error("Vui lòng chọn vendor.");
    }
    if (input.machine?.enabled && !String(input.machine.movementCalibre ?? "").trim()) {
        throw new Error("Vui lòng nhập mã máy.");
    }

    await updateTechnicalIssue({
        id: input.id,
        actorId: getAuthUserId(auth),
        summary: input.summary,
        note: input.note,
        area: input.area,
        actionMode: input.actionMode,
        vendorId: input.vendorId,
        estimatedCost: input.estimatedCost,
        expectedWorkingDays: input.expectedWorkingDays,
        deferConsumers: (work) => after(work),
    });
    if (input.machine?.enabled) {
        const serviceRequest = await prisma.technicalIssue.findUnique({
            where: { id: input.id },
            select: { serviceRequestId: true },
        });
        if (!serviceRequest?.serviceRequestId) {
            throw new Error("Không tìm thấy Service Request của TI.");
        }
        await updateServiceMovementMeasurement({
            serviceRequestId: serviceRequest.serviceRequestId,
            movementCalibre: input.machine.movementCalibre ?? "",
            before: input.machine.before,
            after: input.machine.after,
            actorUserId: getAuthUserId(auth),
            deferConsumers: (work) => after(work),
        });
    }

    return { ok: true };
}

export async function correctDoneTechnicalIssueCostAction(input: {
    id: string;
    actualCost: string | number;
}) {
    const auth = await requirePermission("SERVICE_UPDATE");
    const actualCost = Number(input.actualCost);
    if (!Number.isFinite(actualCost) || actualCost < 0) {
        throw new Error("Vui lòng nhập chi phí thực tế hợp lệ. Chi phí có thể bằng 0.");
    }

    await prisma.$transaction(async (tx) => {
        const issue = await tx.technicalIssue.findUnique({
            where: { id: input.id },
            select: { executionStatus: true },
        });
        if (!issue) throw new Error("Không tìm thấy TI.");
        if (String(issue.executionStatus).toUpperCase() !== "DONE") {
            throw new Error("Chỉ bổ sung chi phí hậu kiểm cho TI đã Done.");
        }

        await updateTechnicalIssue({
            id: input.id,
            actorId: getAuthUserId(auth),
            actualCost,
            deferConsumers: (work) => after(work),
        }, tx);
        await ensureTechnicalIssuePaymentTx(tx, input.id);
    });

    return { ok: true };
}
