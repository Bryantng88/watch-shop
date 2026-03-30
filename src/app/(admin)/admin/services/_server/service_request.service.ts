
import { PrismaClient, Prisma, ProductStatus, ServiceRequestStatus, ServiceScope, ServiceType } from "@prisma/client";
import * as serviceRequestRepo from "./service_request.repo";
import * as maintRepo from "./maintenance.repo";
import { genRefNo } from "../../__components/AutoGenRef";
import type { ServiceRequestSearchInput, ServiceRequestListSort, ServiceRequestViewKey } from "../_helper/SearchParams";

const prisma = new PrismaClient();
const OPEN_SERVICE_STATUSES = [ServiceRequestStatus.DRAFT, ServiceRequestStatus.DIAGNOSING, ServiceRequestStatus.WAIT_APPROVAL, ServiceRequestStatus.IN_PROGRESS];

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
    maintenanceCostTotal: number | null;
    productTitle: string | null;
    skuSnapshot: string | null;
    primaryImageUrlSnapshot: string | null;
};

function buildOrderBy(sort?: ServiceRequestListSort): Prisma.ServiceRequestOrderByWithRelationInput {
    switch (sort) {
        case 'createdAsc': return { createdAt: 'asc' };
        case 'createdDesc': return { createdAt: 'desc' };
        case 'updatedAsc': return { updatedAt: 'asc' };
        case 'updatedDesc':
        default: return { updatedAt: 'desc' };
    }
}
function viewToStatusWhere(view?: ServiceRequestViewKey): Prisma.ServiceRequestWhereInput | undefined {
    switch (view) {
        case 'draft': return { status: ServiceRequestStatus.DRAFT };
        case 'in_progress': return { status: { in: [ServiceRequestStatus.DIAGNOSING, ServiceRequestStatus.WAIT_APPROVAL, ServiceRequestStatus.IN_PROGRESS] } };
        case 'done': return { status: { in: [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.DELIVERED] } };
        case 'canceled': return { status: ServiceRequestStatus.CANCELED };
        default: return undefined;
    }
}
function combineWhere(a?: Prisma.ServiceRequestWhereInput, b?: Prisma.ServiceRequestWhereInput): Prisma.ServiceRequestWhereInput {
    if (a && b) return { AND: [a, b] };
    return a ?? b ?? {};
}
async function resolveDefaultTechnicianTx(tx: Prisma.TransactionClient) {
    return serviceRequestRepo.findDefaultTechnician(tx);
}
async function markProductInServiceIfNeeded(tx: Prisma.TransactionClient, productId?: string | null) {
    if (!productId) return;
    const product = await tx.product.findUnique({ where: { id: productId }, select: { id: true, status: true } });
    if (!product) return;
    if ([ProductStatus.AVAILABLE].includes(product.status as any)) {
        await tx.product.update({ where: { id: product.id }, data: { status: ProductStatus.IN_SERVICE } });
    }
}
async function restoreProductStatusIfDone(tx: Prisma.TransactionClient, productId?: string | null) {
    if (!productId) return;
    const openCount = await tx.serviceRequest.count({ where: { productId, status: { in: OPEN_SERVICE_STATUSES } } });
    if (openCount > 0) return;
    const product = await tx.product.findUnique({ where: { id: productId }, select: { id: true, status: true } });
    if (!product) return;
    if (product.status === ProductStatus.IN_SERVICE) {
        await tx.product.update({ where: { id: product.id }, data: { status: ProductStatus.AVAILABLE } });
    }
}

export async function getAdminServiceRequestList(input: ServiceRequestSearchInput) {
    const { page, pageSize, q, sort, view } = input;
    const baseWhere: Prisma.ServiceRequestWhereInput = q?.trim() ? {
        OR: [
            { id: { contains: q, mode: 'insensitive' } },
            { refNo: { contains: q, mode: 'insensitive' } },
            { notes: { contains: q, mode: 'insensitive' } },
            { vendorNameSnap: { contains: q, mode: 'insensitive' } },
            { technicianNameSnap: { contains: q, mode: 'insensitive' } },
            { product: { is: { title: { contains: q, mode: 'insensitive' } } } },
            { ServiceCatalog: { is: { name: { contains: q, mode: 'insensitive' } } } },
            { orderItem: { is: { order: { is: { refNo: { contains: q, mode: 'insensitive' } } } } } },
        ],
    } : {};
    const where = combineWhere(baseWhere, viewToStatusWhere(view));
    const skip = (page - 1) * pageSize;
    const { rows, total } = await serviceRequestRepo.getServiceRequestList(where, buildOrderBy(sort), skip, pageSize, prisma);
    const [cAll, cDraft, cInProgress, cDone, cCanceled] = await Promise.all([
        prisma.serviceRequest.count({ where: baseWhere }),
        prisma.serviceRequest.count({ where: combineWhere(baseWhere, viewToStatusWhere('draft')) }),
        prisma.serviceRequest.count({ where: combineWhere(baseWhere, viewToStatusWhere('in_progress')) }),
        prisma.serviceRequest.count({ where: combineWhere(baseWhere, viewToStatusWhere('done')) }),
        prisma.serviceRequest.count({ where: combineWhere(baseWhere, viewToStatusWhere('canceled')) }),
    ]);
    const items: ServiceRequestListItem[] = rows.map((r) => ({
        id: r.id,
        refNo: r.refNo ?? null,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        serviceName: r.serviceCatalog?.name ?? 'Kiểm tra kỹ thuật',
        serviceCode: r.serviceCatalog?.code ?? null,
        orderId: r.orderItem?.order?.id ?? null,
        orderRefNo: r.orderItem?.order?.refNo ?? null,
        scope: r.scope ?? null,
        vendorName: r.vendorName ?? null,
        technicianName: r.technicianName ?? null,
        customerItemNote: r.orderItem?.customerItemNote ?? null,
        maintenanceCount: r.maintenanceCount ?? 0,
        maintenanceCostTotal: (r as any).maintenanceCostTotal ?? null,
        productTitle: r.productTitle ?? null,
        skuSnapshot: r.skuSnapshot ?? null,
        primaryImageUrlSnapshot: r.primaryImageUrlSnapshot ?? null,
    }));
    return { items, total, page, pageSize, counts: { all: cAll, draft: cDraft, in_progress: cInProgress, done: cDone, canceled: cCanceled } };
}

export type ServiceCatalogOption = { id: string; code: string | null; name: string; defaultPrice: number | null; };
export async function getServiceCatalogOptions() {
    const rows = await serviceRequestRepo.getOptions(prisma, { isActive: true });
    return rows.map((r) => ({ id: r.id, code: r.code ?? null, name: r.name, defaultPrice: r.defaultPrice != null ? Number(r.defaultPrice) : null }));
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
    const tech = await resolveDefaultTechnicianTx(tx);
    const serviceItems = (order.items ?? []).filter((i: any) => i.kind === 'SERVICE');
    if (!serviceItems.length) return { created: 0 };
    const rows: Prisma.ServiceRequestCreateManyInput[] = serviceItems.map((it: any) => {
        const linked = (order.items ?? []).find((x: any) => x.id === it.linkedOrderItemId) ?? null;
        const snap = pickSnapFromLinkedProductItem(linked);
        const servicecatalogid = it.serviceCatalogId ?? it.servicecatalogid ?? null;
        if (!servicecatalogid) throw new Error(`OrderItem SERVICE thiếu serviceCatalogId (item=${it.id})`);
        return {
            refNo: null,
            type: ServiceType.PAID,
            scope: (it.serviceScope ?? ServiceScope.CUSTOMER_OWNED) as any,
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
            notes: it.customerItemNote ?? it.notes ?? null,
            warrantyUntil: null,
            warrantyPolicy: null,
            servicecatalogid,
            technicianId: tech?.id ?? null,
            technicianNameSnap: tech?.name ?? tech?.email ?? null,
        } as any;
    });
    await serviceRequestRepo.createMany(tx, rows);
    return { created: rows.length };
}

export type CreateServiceRequestFromProductInput = {
    productId: string;
    serviceCatalogId?: string | null;
    scope: ServiceScope;
    notes?: string | null;
    customerId?: string | null;
};
export async function createFromProduct(input: CreateServiceRequestFromProductInput) {
    return prisma.$transaction((tx) => createFromProductTx(tx, input));
}
export async function createFromProductTx(tx: Prisma.TransactionClient, input: CreateServiceRequestFromProductInput) {
    const product = await serviceRequestRepo.findProductForService(tx, input.productId);
    if (!product) throw new Error('Product not found');
    const variantId = product.variants?.[0]?.id ?? null;
    const tech = await resolveDefaultTechnicianTx(tx);
    const refNo = await genRefNo(tx, { model: tx.serviceRequest, prefix: 'SR', field: 'refNo', padding: 6 });
    const created = await serviceRequestRepo.createOne(tx, {
        refNo,
        type: ServiceType.PAID,
        billable: false,
        status: ServiceRequestStatus.DRAFT,
        product: { connect: { id: input.productId } },
        ...(variantId ? { variant: { connect: { id: variantId } } } : {}),
        ...(input.serviceCatalogId ? { ServiceCatalog: { connect: { id: input.serviceCatalogId } } } : {}),
        scope: input.scope,
        ...(input.customerId ? { customer: { connect: { id: input.customerId } } } : {}),
        notes: input.notes ?? null,
        brandSnapshot: product.brand?.name ?? null,
        modelSnapshot: product.watchSpec?.model ?? product.title ?? null,
        refSnapshot: product.watchSpec?.ref ?? null,
        technician: tech?.id ? { connect: { id: tech.id } } : undefined,
        technicianNameSnap: tech?.name ?? tech?.email ?? null,
        skuSnapshot: product.variants?.[0]?.sku ?? null,
        primaryImageUrlSnapshot: product.primaryImageUrl ?? null,
    } as any);
    await markProductInServiceIfNeeded(tx, input.productId);
    return created;
}

export async function createTechnicalCheckFromAcquisitionTx(
    tx: DB,
    input: {
        productId: string;
        variantId?: string | null;
        notes?: string | null;
        skuSnapshot?: string | null;
        primaryImageUrlSnapshot?: string | null;
    }
) {
    const technician = await serviceRequestRepo.findDefaultTechnician(tx);

    const request = await serviceRequestRepo.createTechnicalCheckRequest(tx, {
        productId: input.productId,
        variantId: input.variantId ?? null,
        notes: input.notes ?? null,
        technicianId: technician?.id ?? null,
        technicianNameSnap: technician?.name?.trim() || technician?.email || null,
        skuSnapshot: input.skuSnapshot ?? null,
        primaryImageUrlSnapshot: input.primaryImageUrlSnapshot ?? null,
    });

    await serviceRequestRepo.markProductInService(tx, input.productId);

    return request;
}

export async function finalizeTechnicalRequestTx(
    tx: DB,
    input: {
        productId: string;
    }
) {
    const openCount = await serviceRequestRepo.countOpenTechnicalRequests(tx, input.productId);

    if (openCount === 0) {
        await serviceRequestRepo.markProductPosted(tx, input.productId);
    }
}

export async function bulkAssignVendorAndCreateMaintenance(input: { ids: string[]; vendorId: string | null; reason?: string | null }) {
    const ids = Array.from(new Set((input.ids ?? []).map((x) => String(x).trim()).filter(Boolean)));
    if (!ids.length) throw new Error('Missing ids');
    const vendorId = String(input.vendorId || '').trim();
    if (!vendorId) throw new Error('Missing vendorId');
    return prisma.$transaction(async (tx) => {
        const vendor = await tx.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true } });
        if (!vendor) throw new Error('Vendor not found');
        return maintRepo.bulkAssignVendor(tx, { ids, vendorId: vendor.id, vendorName: vendor.name, onlyFromDraft: false, setInProgress: true });
    });
}

export async function postServiceRequests(ids: string[]) {
    const cleanIds = Array.from(new Set((ids ?? []).map((x) => String(x).trim()).filter(Boolean)));
    if (!cleanIds.length) return { updated: 0 };
    const result = await prisma.serviceRequest.updateMany({
        where: { id: { in: cleanIds }, status: ServiceRequestStatus.DRAFT },
        data: { status: ServiceRequestStatus.IN_PROGRESS, updatedAt: new Date() },
    });
    return { updated: result.count };
}

export async function completeServiceRequest(input: { serviceRequestId: string; note?: string | null; }) {
    const serviceRequestId = String(input.serviceRequestId || '').trim();
    if (!serviceRequestId) throw new Error('Missing serviceRequestId');
    return prisma.$transaction(async (tx) => {
        const existing = await tx.serviceRequest.findUnique({ where: { id: serviceRequestId }, select: { id: true, status: true, vendorId: true, vendorNameSnap: true, technicianId: true, technicianNameSnap: true, productId: true, variantId: true, brandSnapshot: true, modelSnapshot: true, refSnapshot: true, serialSnapshot: true } });
        if (!existing) throw new Error('Service request not found');
        if (existing.status === ServiceRequestStatus.CANCELED) throw new Error('Service request đã bị hủy, không thể kết thúc');
        if ([ServiceRequestStatus.COMPLETED, ServiceRequestStatus.DELIVERED].includes(existing.status as any)) return { ok: true, skipped: true, status: existing.status };
        const completedAt = new Date();
        const updated = await serviceRequestRepo.completeServiceRequestOne(tx, { id: serviceRequestId, completedAt });
        await maintRepo.createLog(tx, {
            serviceRequestId: updated.id,
            eventType: 'NOTE' as any,
            vendorId: updated.vendorId ?? null,
            vendorName: updated.vendorNameSnap ?? null,
            technicianId: updated.technicianId ?? null,
            technicianNameSnap: updated.technicianNameSnap ?? null,
            notes: input.note && String(input.note).trim() ? `Kết thúc service
${String(input.note).trim()}` : 'Kết thúc service',
            servicedAt: completedAt,
            productId: updated.productId ?? null,
            variantId: updated.variantId ?? null,
            brandSnapshot: updated.brandSnapshot ?? null,
            modelSnapshot: updated.modelSnapshot ?? null,
            refSnapshot: updated.refSnapshot ?? null,
            serialSnapshot: updated.serialSnapshot ?? null,
        });
        await restoreProductStatusIfDone(tx, updated.productId ?? null);
        return { ok: true, skipped: false, status: updated.status };
    });
}

export async function getTechnicianOptions() {
    const rows = await prisma.user.findMany({
        where: {
            roles: {
                some: {
                    name: "TECHNICIAN",
                },
            },
            isActive: true,
        },
        orderBy: [{ name: "asc" }, { email: "asc" }],
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    return rows.map((u) => ({
        id: u.id,
        name: (u.name || "").trim() || u.email,
        email: u.email,
    }));
}