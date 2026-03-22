import * as sevRepo from "./service_request.repo";
import {
    Prisma,
    PrismaClient,
    ServiceScope,
    ServiceType,
    ServiceRequestStatus,
} from "@prisma/client";
import * as serviceRequestRepo from "./service_request.repo";
import * as maintRepo from "./maintenance.repo";

import { genRefNo } from "../../__components/AutoGenRef";
import type {
    ServiceRequestSearchInput,
    ServiceRequestViewKey,
    ServiceRequestListSort,
} from "../_helper/SearchParams";

export type ServiceCatalogItem = {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    detail: string;
    defaultPrice: number | null;
    durationMin: number | null;
};

const prisma = new PrismaClient();

export type ServiceRequestListItem = {
    id: string;
    refNo: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;

    serviceName: string | null;
    serviceCode: string | null;

    orderId: string | null;
    orderRefNo: string | null;

    scope: string | null;
    customerItemNote: string | null;
    vendorName: string | null;
    maintenanceCount: number;
    productTitle: string | null;
};

function buildOrderBy(sort?: ServiceRequestListSort): Prisma.ServiceRequestOrderByWithRelationInput {
    switch (sort) {
        case "createdAsc":
            return { createdAt: "asc" };
        case "createdDesc":
            return { createdAt: "desc" };
        case "updatedAsc":
            return { updatedAt: "asc" };
        case "updatedDesc":
        default:
            return { updatedAt: "desc" };
    }
}

function viewToStatusWhere(
    view?: ServiceRequestViewKey
): Prisma.ServiceRequestWhereInput | undefined {
    switch (view) {
        case "draft":
            return { status: ServiceRequestStatus.DRAFT };

        case "in_progress":
            return {
                status: {
                    in: [
                        ServiceRequestStatus.DIAGNOSING,
                        ServiceRequestStatus.WAIT_APPROVAL,
                        ServiceRequestStatus.IN_PROGRESS,
                    ],
                },
            };

        case "done":
            return {
                status: {
                    in: [
                        ServiceRequestStatus.COMPLETED,
                        ServiceRequestStatus.DELIVERED,
                    ],
                },
            };

        case "canceled":
            return { status: ServiceRequestStatus.CANCELED };

        case "all":
        default:
            return undefined;
    }
}

function combineWhere(
    baseWhere?: Prisma.ServiceRequestWhereInput,
    extraWhere?: Prisma.ServiceRequestWhereInput
): Prisma.ServiceRequestWhereInput {
    if (baseWhere && extraWhere) {
        return { AND: [baseWhere, extraWhere] };
    }
    return baseWhere ?? extraWhere ?? {};
}

export async function getAdminServiceRequestList(input: ServiceRequestSearchInput) {
    const { page, pageSize, q, sort, view } = input;

    const baseWhere: Prisma.ServiceRequestWhereInput = {
        ...(q?.trim()
            ? {
                OR: [
                    { id: { contains: q, mode: "insensitive" } },
                    { refNo: { contains: q, mode: "insensitive" } },
                    { notes: { contains: q, mode: "insensitive" } },
                    {
                        orderItem: {
                            is: {
                                order: {
                                    is: {
                                        refNo: { contains: q, mode: "insensitive" },
                                    },
                                },
                            },
                        },
                    },
                    {
                        ServiceCatalog: {
                            is: { name: { contains: q, mode: "insensitive" } },
                        },
                    },
                    {
                        product: {
                            is: { title: { contains: q, mode: "insensitive" } },
                        },
                    },
                    { vendorNameSnap: { contains: q, mode: "insensitive" } },
                ],
            }
            : {}),
    };

    const where = combineWhere(baseWhere, viewToStatusWhere(view));
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const { rows, total } = await serviceRequestRepo.getServiceRequestList(
        where,
        buildOrderBy(sort),
        skip,
        take,
        prisma
    );

    const [cAll, cDraft, cInProgress, cDone, cCanceled] = await Promise.all([
        prisma.serviceRequest.count({ where: baseWhere }),
        prisma.serviceRequest.count({
            where: combineWhere(baseWhere, viewToStatusWhere("draft")),
        }),
        prisma.serviceRequest.count({
            where: combineWhere(baseWhere, viewToStatusWhere("in_progress")),
        }),
        prisma.serviceRequest.count({
            where: combineWhere(baseWhere, viewToStatusWhere("done")),
        }),
        prisma.serviceRequest.count({
            where: combineWhere(baseWhere, viewToStatusWhere("canceled")),
        }),
    ]);

    const items: ServiceRequestListItem[] = rows.map((r) => ({
        id: r.id,
        refNo: r.refNo ?? null,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        serviceName: r.serviceCatalog?.name ?? null,
        serviceCode: r.serviceCatalog?.code ?? null,
        orderId: r.orderItem?.order?.id ?? null,
        orderRefNo: r.orderItem?.order?.refNo ?? null,
        scope: r.scope ?? null,
        vendorName: r.vendorName ?? null,
        customerItemNote: r.orderItem?.customerItemNote ?? null,
        maintenanceCount: r.maintenanceCount ?? 0,
        productTitle: r.productTitle ?? null,
    }));

    return {
        items,
        total,
        counts: {
            all: cAll,
            draft: cDraft,
            in_progress: cInProgress,
            done: cDone,
            canceled: cCanceled,
        },
        page,
        pageSize,
    };
}

/* ===== giữ nguyên phần còn lại của file bên dưới ===== */
type OrderForPost = any;

function pickSnapFromLinkedProductItem(linked: any) {
    const product = linked?.Product ?? null;
    const variant = linked?.variant ?? null;

    return {
        productId: linked?.productId ?? null,
        variantId: linked?.variantId ?? null,
        brandSnapshot: product?.brandName ?? product?.brand ?? null,
        modelSnapshot: product?.modelName ?? product?.title ?? linked?.title ?? null,
        refSnapshot: product?.refNo ?? product?.ref ?? null,
        serialSnapshot: variant?.serial ?? variant?.serialNo ?? null,
    };
}

export async function createServiceRequestsFromOrderTx(
    tx: Prisma.TransactionClient,
    order: OrderForPost
) {
    const serviceItems = (order.items ?? []).filter((i: any) => i.kind === "SERVICE");
    if (!serviceItems.length) return { created: 0 };

    const rows = serviceItems.map((it: any) => {
        const linked = (order.items ?? []).find((x: any) => x.id === it.linkedOrderItemId) ?? null;
        const snap = pickSnapFromLinkedProductItem(linked);

        const notes = it.customerItemNote ?? it.notes ?? null;
        const servicecatalogid = it.serviceCatalogId ?? it.servicecatalogid ?? null;

        if (!servicecatalogid) {
            throw new Error(`OrderItem SERVICE thiếu serviceCatalogId (item=${it.id})`);
        }

        return {
            refNo: null,
            type: ServiceType.PAID,
            scope: it.serviceScope ?? ServiceScope.CUSTOMER_ITEM,
            status: ServiceRequestStatus.DRAFT,
            billable: true,

            orderId: order.id,
            orderItemId: it.id,
            customerId: order.customerId ?? null,

            productId: snap.productId,
            variantId: snap.variantId,
            brandSnapshot: snap.brandSnapshot,
            modelSnapshot: snap.modelSnapshot,
            refSnapshot: snap.refSnapshot,
            serialSnapshot: snap.serialSnapshot,

            appointmentAt: null,
            notes,
            warrantyUntil: null,
            warrantyPolicy: null,
            servicecatalogid,
        };
    });

    await serviceRequestRepo.createMany(tx, rows);
    return { created: rows.length };
}

export type ServiceCatalogOption = {
    id: string;
    code: string | null;
    name: string;
    defaultPrice: number | null;
};

export async function getServiceCatalogOptions() {
    const rows = await serviceRequestRepo.getOptions(prisma, { isActive: true });
    const items: ServiceCatalogOption[] = rows.map((r) => ({
        id: r.id,
        code: r.code ?? null,
        name: r.name,
        defaultPrice: r.defaultPrice,
    }));
    return items;
}

export type CreateServiceRequestFromProductInput = {
    productId: string;
    serviceCatalogId: string;
    scope: ServiceScope;
    notes?: string | null;
    customerId?: string | null;
};

export async function createFromProduct(input: CreateServiceRequestFromProductInput) {
    return prisma.$transaction((tx) => createFromProductTx(tx, input));
}

export async function createFromProductTx(
    tx: Prisma.TransactionClient,
    input: CreateServiceRequestFromProductInput
) {
    const product = await serviceRequestRepo.findProductForService(tx, input.productId);
    if (!product) throw new Error("Product not found");

    const variantId = product.variants?.[0]?.id ?? null;

    const refNo = await genRefNo(tx, {
        model: tx.serviceRequest,
        prefix: "SR",
        field: "refNo",
        padding: 6,
    });

    const brandSnapshot = product.brand?.name ?? null;
    const modelSnapshot = product.watchSpec?.model ?? product.title ?? null;
    const refSnapshot = product.watchSpec?.ref ?? null;

    const created = await serviceRequestRepo.createOne(tx, {
        refNo,
        type: ServiceType.PAID,
        billable: false,
        status: ServiceRequestStatus.DRAFT,
        product: { connect: { id: input.productId } },
        ...(variantId ? { variant: { connect: { id: variantId } } } : {}),
        ServiceCatalog: { connect: { id: input.serviceCatalogId } },
        scope: input.scope,
        customer: input.customerId ? { connect: { id: input.customerId } } : undefined,
        notes: input.notes ?? null,
        brandSnapshot,
        modelSnapshot,
        refSnapshot,
    });

    return created;
}

export async function completeServiceRequest(input: {
    serviceRequestId: string;
    note?: string | null;
}) {
    const serviceRequestId = String(input.serviceRequestId || '').trim();
    if (!serviceRequestId) throw new Error('Missing serviceRequestId');

    return prisma.$transaction(async (tx) => {
        const existing = await tx.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: {
                id: true,
                status: true,
                vendorId: true,
                vendorNameSnap: true,
                productId: true,
                variantId: true,
                brandSnapshot: true,
                modelSnapshot: true,
                refSnapshot: true,
                serialSnapshot: true,
            },
        });

        if (!existing) throw new Error('Service request not found');
        if (existing.status === ServiceRequestStatus.CANCELED) {
            throw new Error('Service request đã bị hủy, không thể kết thúc');
        }
        if (
            existing.status === ServiceRequestStatus.COMPLETED ||
            existing.status === ServiceRequestStatus.DELIVERED
        ) {
            return { ok: true, skipped: true, status: existing.status };
        }

        const completedAt = new Date();
        const updated = await serviceRequestRepo.completeServiceRequestOne(tx, {
            id: serviceRequestId,
            completedAt,
        });

        const baseNote = 'Kết thúc service';
        const mergedNote = input.note && String(input.note).trim()
            ? `${baseNote}
${String(input.note).trim()}`
            : baseNote;

        await maintRepo.createLog(tx, {
            serviceRequestId: updated.id,
            eventType: 'NOTE' as any,
            vendorId: updated.vendorId ?? null,
            vendorName: updated.vendorNameSnap ?? null,
            notes: mergedNote,
            servicedAt: completedAt,
            productId: updated.productId ?? null,
            variantId: updated.variantId ?? null,
            brandSnapshot: updated.brandSnapshot ?? null,
            modelSnapshot: updated.modelSnapshot ?? null,
            refSnapshot: updated.refSnapshot ?? null,
            serialSnapshot: updated.serialSnapshot ?? null,
        });

        return {
            ok: true,
            skipped: false,
            status: updated.status,
        };
    });
}
