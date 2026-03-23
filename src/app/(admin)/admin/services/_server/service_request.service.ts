import { Prisma, PrismaClient, ServiceRequestStatus, ServiceScope, ServiceType } from "@prisma/client";
import * as serviceRequestRepo from "./service_request.repo";
import * as maintRepo from "./maintenance.repo";
import { genRefNo } from "../../__components/AutoGenRef";
import type { ServiceRequestListSort, ServiceRequestSearchInput, ServiceRequestViewKey } from "../_helper/SearchParams";

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
    technicianName: string | null;
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

function viewToStatusWhere(view?: ServiceRequestViewKey): Prisma.ServiceRequestWhereInput | undefined {
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
                    in: [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.DELIVERED],
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
    if (baseWhere && extraWhere) return { AND: [baseWhere, extraWhere] };
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
                    { vendorNameSnap: { contains: q, mode: "insensitive" } },
                    { technicianNameSnap: { contains: q, mode: "insensitive" } },
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
        prisma.serviceRequest.count({ where: combineWhere(baseWhere, viewToStatusWhere("draft")) }),
        prisma.serviceRequest.count({ where: combineWhere(baseWhere, viewToStatusWhere("in_progress")) }),
        prisma.serviceRequest.count({ where: combineWhere(baseWhere, viewToStatusWhere("done")) }),
        prisma.serviceRequest.count({ where: combineWhere(baseWhere, viewToStatusWhere("canceled")) }),
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
        technicianName: r.technicianName ?? null,
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

export async function createServiceRequestsFromOrderTx(tx: Prisma.TransactionClient, order: OrderForPost) {
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
            scope: it.serviceScope ?? ServiceScope.CUSTOMER_OWNED,
            status: ServiceRequestStatus.DRAFT,
            billable: true,
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
    return rows.map((r) => ({
        id: r.id,
        code: r.code ?? null,
        name: r.name,
        defaultPrice: r.defaultPrice,
    }));
}

export async function getTechnicianOptions() {
    const rows = await serviceRequestRepo.findTechniciansLite(prisma);
    return rows.map((r) => ({
        id: r.id,
        name: r.name?.trim() || r.email,
        email: r.email,
    }));
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

export async function createFromProductTx(tx: Prisma.TransactionClient, input: CreateServiceRequestFromProductInput) {
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

    return serviceRequestRepo.createOne(tx, {
        refNo,
        type: ServiceType.PAID,
        billable: false,
        status: ServiceRequestStatus.DRAFT,
        productId: input.productId,
        variantId,
        servicecatalogid: input.serviceCatalogId,
        scope: input.scope,
        customerId: input.customerId ?? null,
        notes: input.notes ?? null,
        brandSnapshot,
        modelSnapshot,
        refSnapshot,
    });
}

export async function postServiceRequests(ids: string[]) {
    const cleanIds = Array.from(new Set((ids ?? []).map(String).map((x) => x.trim()).filter(Boolean)));
    if (!cleanIds.length) return { updatedCount: 0 };

    const result = await prisma.serviceRequest.updateMany({
        where: {
            id: { in: cleanIds },
            status: ServiceRequestStatus.DRAFT,
        },
        data: {
            status: ServiceRequestStatus.IN_PROGRESS,
            updatedAt: new Date(),
        },
    });

    return { updatedCount: result.count };
}

export async function assignTechnicianForServiceRequest(input: { serviceRequestId: string; technicianId: string; note?: string | null }) {
    const serviceRequestId = String(input.serviceRequestId || "").trim();
    const technicianId = String(input.technicianId || "").trim();
    if (!serviceRequestId) throw new Error("Missing serviceRequestId");
    if (!technicianId) throw new Error("Missing technicianId");

    return prisma.$transaction(async (tx) => {
        const techs = await serviceRequestRepo.findTechniciansLite(tx);
        const technician = techs.find((t) => t.id === technicianId);
        if (!technician) throw new Error("Technician not found");

        const existing = await serviceRequestRepo.findByIdForMaintenance(tx, serviceRequestId);
        if (!existing) throw new Error("Service request not found");

        const nextName = technician.name?.trim() || technician.email;

        await serviceRequestRepo.assignTechnicianOne(tx, {
            id: serviceRequestId,
            technicianId,
            technicianNameSnap: nextName,
        });

        const base = existing.technicianNameSnap
            ? `Đổi thợ tiếp nhận: ${existing.technicianNameSnap} → ${nextName}`
            : `Gán thợ tiếp nhận: ${nextName}`;
        const notes = input.note?.trim() ? `${base}\n${input.note.trim()}` : base;

        await maintRepo.createLog(tx, {
            serviceRequestId,
            eventType: "NOTE" as any,
            technicianId,
            technicianName: nextName,
            vendorId: existing.vendorId ?? null,
            vendorName: existing.vendorNameSnap ?? null,
            notes,
            productId: existing.productId ?? null,
            variantId: existing.variantId ?? null,
        });

        return { ok: true };
    });
}

export async function bulkAssignTechnicianAndCreateMaintenance(input: { ids: string[]; technicianId: string; note?: string | null }) {
    const ids = Array.from(new Set((input.ids ?? []).map(String).map((x) => x.trim()).filter(Boolean)));
    const technicianId = String(input.technicianId || "").trim();
    if (!ids.length) throw new Error("Missing ids");
    if (!technicianId) throw new Error("Missing technicianId");

    return prisma.$transaction(async (tx) => {
        const techs = await serviceRequestRepo.findTechniciansLite(tx);
        const technician = techs.find((t) => t.id === technicianId);
        if (!technician) throw new Error("Technician not found");
        const technicianName = technician.name?.trim() || technician.email;

        const rows = await tx.serviceRequest.findMany({
            where: { id: { in: ids } },
            select: {
                id: true,
                technicianId: true,
                technicianNameSnap: true,
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

        if (!rows.length) return { updatedCount: 0, createdLogs: 0 };

        const updatedCount = await serviceRequestRepo.bulkAssignTechnician(tx, {
            ids: rows.map((r) => r.id),
            technicianId,
            technicianNameSnap: technicianName,
        });

        const now = new Date();
        const createData: Prisma.MaintenanceRecordCreateManyInput[] = rows.map((r) => ({
            serviceRequestId: r.id,
            eventType: "NOTE" as any,
            technicianId,
            technicianName,
            vendorId: r.vendorId ?? null,
            vendorName: r.vendorNameSnap ?? null,
            notes: input.note?.trim()
                ? `${r.technicianNameSnap ? `Đổi thợ tiếp nhận: ${r.technicianNameSnap} → ${technicianName}` : `Gán thợ tiếp nhận: ${technicianName}`}\n${input.note.trim()}`
                : r.technicianNameSnap
                    ? `Đổi thợ tiếp nhận: ${r.technicianNameSnap} → ${technicianName}`
                    : `Gán thợ tiếp nhận: ${technicianName}`,
            createdAt: now,
            productId: r.productId ?? null,
            variantId: r.variantId ?? null,
            brandSnapshot: r.brandSnapshot ?? null,
            modelSnapshot: r.modelSnapshot ?? null,
            refSnapshot: r.refSnapshot ?? null,
            serialSnapshot: r.serialSnapshot ?? null,
        }));

        const createdLogs = await tx.maintenanceRecord.createMany({ data: createData });
        return { updatedCount, createdLogs: createdLogs.count };
    });
}

export async function bulkAssignVendorAndCreateMaintenance(input: { ids: string[]; vendorId: string }) {
    const ids = Array.from(new Set((input.ids ?? []).map(String).map((x) => x.trim()).filter(Boolean)));
    const vendorId = String(input.vendorId || "").trim();
    if (!ids.length) throw new Error("Missing ids");
    if (!vendorId) throw new Error("Missing vendorId");

    return prisma.$transaction(async (tx) => {
        const vendors = await serviceRequestRepo.findVendorsLite(tx);
        const vendor = vendors.find((v) => v.id === vendorId);
        if (!vendor) throw new Error("Vendor not found");
        return maintRepo.bulkAssignVendor(tx, {
            ids,
            vendorId,
            vendorName: vendor.name,
            setInProgress: true,
        });
    });
}

export async function completeServiceRequest(input: { serviceRequestId: string; note?: string | null }) {
    const serviceRequestId = String(input.serviceRequestId || "").trim();
    if (!serviceRequestId) throw new Error("Missing serviceRequestId");

    return prisma.$transaction(async (tx) => {
        const existing = await tx.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: {
                id: true,
                status: true,
                vendorId: true,
                vendorNameSnap: true,
                technicianId: true,
                technicianNameSnap: true,
                productId: true,
                variantId: true,
                brandSnapshot: true,
                modelSnapshot: true,
                refSnapshot: true,
                serialSnapshot: true,
            },
        });

        if (!existing) throw new Error("Service request not found");
        if (existing.status === ServiceRequestStatus.CANCELED) {
            throw new Error("Service request đã bị hủy, không thể kết thúc");
        }
        if (existing.status === ServiceRequestStatus.COMPLETED || existing.status === ServiceRequestStatus.DELIVERED) {
            return { ok: true, skipped: true, status: existing.status };
        }

        const completedAt = new Date();
        const updated = await serviceRequestRepo.completeServiceRequestOne(tx, {
            id: serviceRequestId,
            completedAt,
        });

        const baseNote = "Kết thúc service";
        const mergedNote = input.note && String(input.note).trim() ? `${baseNote}\n${String(input.note).trim()}` : baseNote;

        await maintRepo.createLog(tx, {
            serviceRequestId: updated.id,
            eventType: "NOTE" as any,
            technicianId: updated.technicianId ?? null,
            technicianName: updated.technicianNameSnap ?? null,
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

        return { ok: true, skipped: false, status: updated.status };
    });
}
