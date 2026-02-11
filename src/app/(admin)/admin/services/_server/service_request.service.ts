import * as sevRepo from "./service_request.repo"
import { Prisma, PrismaClient, ServiceScope, ServiceType, ServiceRequestStatus } from "@prisma/client";
import * as serviceRequestRepo from "./service_request.repo";
import * as maintRepo from "./maintenance.repo"

import { genRefNo } from "../../__components/AutoGenRef";
export type ServiceCatalogItem = {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    detail: string;          // BASIC | OVERHAUL | SPA ...
    defaultPrice: number | null;
    durationMin: number | null;
};

const prisma = new PrismaClient();

/**
 * Repo cần có hàm:
 * serviceCatalogRepo.getList(where, orderBy, skip, take, prisma)
 * -> return { rows, total }
 */
export type ServiceRequestSearchInput = {
    page: number;
    pageSize: number;
    q?: string | null;
    isActive?: boolean | null;
};

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
    //maintenanceCount: number;
    scope: string | null;
    customerItemNote: string | null;
};

export async function getAdminServiceRequestList(input: ServiceRequestSearchInput) {
    const { page, pageSize, q } = input;

    const where: Prisma.ServiceRequestWhereInput = {

        ...(q?.trim()
            ? {
                OR: [
                    { id: { contains: q, mode: "insensitive" } },
                    { refNo: { contains: q, mode: "insensitive" } },
                    { notes: { contains: q, mode: "insensitive" } },

                    // order refNo (qua orderItem -> order)
                    {
                        orderItem: {
                            is: {
                                order: {
                                    is: { refNo: { contains: q, mode: "insensitive" } },
                                },
                            },
                        },
                    },

                    // search theo tên serviceCatalog
                    {
                        ServiceCatalog: {
                            is: { name: { contains: q, mode: "insensitive" } },
                        },
                    },
                ],
            }
            : {}),
    };

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const { rows, total } = await serviceRequestRepo.getServiceRequestList(
        where,
        { updatedAt: "desc" },
        skip,
        take,
        prisma
    );

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
        vendorName: r.vendorName,
        customerItemNote: r.orderItem?.customerItemNote ?? null,
        maintenanceCount: r.maintenanceCount ?? 0, // ✅
    }));

    return { items, total, page, pageSize };
}

type OrderForPost = any; // bạn đang có type order trong getOrderForPost(); để any cho bạn paste nhanh

function pickSnapFromLinkedProductItem(linked: any) {
    // linked: OrderItem PRODUCT (include Product + variant)
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

/**
 * Tạo ServiceRequest từ các OrderItem.kind === "SERVICE"
 * - servicecatalogid lấy từ orderItem.serviceCatalogId / orderItem.servicecatalogid tuỳ schema OrderItem
 * - PRODUCT_ITEM: lấy snapshot từ linkedOrderItemId (item PRODUCT)
 * - CUSTOMER_ITEM: snapshot product/variant null, notes ưu tiên customerItemNote
 */
export async function createServiceRequestsFromOrderTx(
    tx: Prisma.TransactionClient,
    order: OrderForPost
) {
    const serviceItems = (order.items ?? []).filter((i: any) => i.kind === "SERVICE");
    if (!serviceItems.length) return { created: 0 };

    // Map orderItemId => item (để lookup linkedOrderItem)
    const itemById = new Map<string, any>();
    for (const it of order.items ?? []) {
        if (it?.id) itemById.set(it.id, it);
    }

    const rows: Prisma.ServiceRequestCreateManyInput[] = serviceItems.map((it: any) => {
        const servicecatalogid =
            it.serviceCatalogId ?? it.servicecatalogid ?? null;
        if (!servicecatalogid) {
            throw new Error(`SERVICE item thiếu serviceCatalogId: orderItemId=${it.id}`);
        }

        const scope = it.serviceScope; // enum ServiceScope ở OrderItem
        const linked = it.linkedOrderItemId ? itemById.get(it.linkedOrderItemId) : null;

        const snap =
            scope === "WITH_PURCHASE" && linked
                ? pickSnapFromLinkedProductItem(linked)
                : {
                    productId: null,
                    variantId: null,
                    brandSnapshot: null,
                    modelSnapshot: null,
                    refSnapshot: null,
                    serialSnapshot: null,
                };

        // notes: CUSTOMER_ITEM ưu tiên note mô tả đồ khách mang tới
        const notes =
            (scope === "CUSTOMER_OWNED" ? (it.customerItemNote ?? null) : null) ??
            (order.notes ?? null);

        return {
            orderItemId: it.id,
            customerId: order.customerId ?? null,

            // snapshots from linked product item (nếu có)
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

            // schema field name (lowercase theo ảnh)
            servicecatalogid,
            // type/status default đã có trong schema nên không cần set
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
        defaultPrice: r.defaultPrice
    }));
    return items;
}

export type CreateServiceRequestFromProductInput = {
    productId: string;
    serviceCatalogId: string;
    scope: ServiceScope; // INTERNAL
    notes?: string | null; // ghi chú kỹ thuật
    // nếu bạn muốn gán customer ngay (vd ký gửi):
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

    // refNo cho ServiceRequest (SR-xxxxxx)
    const refNo = await genRefNo(tx, {
        model: tx.serviceRequest,
        prefix: "SR",
        field: "refNo",
        padding: 6,
    });

    // snapshot (tùy schema bạn đang có)
    const brandSnapshot = (product as any).brand?.name ?? null;
    const modelSnapshot = (product as any).model ?? null;
    const refSnapshot = (product as any).ref ?? null;

    const created = await serviceRequestRepo.createOne(tx, {
        refNo,
        type: ServiceType.PAID,          // hoặc INTERNAL -> nếu bạn có ServiceType khác
        billable: false,                 // INTERNAL thường không tính phí khách
        status: ServiceRequestStatus.DRAFT,

        // liên kết product
        product: { connect: { id: input.productId } },
        ...(variantId ? { variant: { connect: { id: variantId } } } : {}),

        // service catalog
        ServiceCatalog: { connect: { id: input.serviceCatalogId } }, // hoặc serviceCatalog (tùy relation name trong schema)
        serviceScope: input.scope, // INTERNAL

        customer: input.customerId ? { connect: { id: input.customerId } } : undefined,

        // notes kỹ thuật
        notes: input.notes ?? null,

        // snapshot
        brandSnapshot,
        modelSnapshot,
        refSnapshot,
    });

    return created;
}

type CreateFromProductManyInput = {
    productId: string;
    customerId?: string | null;
    scope: ServiceScope; // INTERNAL | CUSTOMER_OWNED | WITH_PURCHASE
    services: Array<{ serviceCatalogId: string; notes?: string | null }>;
};

export async function createFromProductMany(input: CreateFromProductManyInput) {
    return prisma.$transaction(async (tx) => {
        // 1) lấy product + variantId để snapshot/attach nếu bạn cần
        const product = await serviceRequestRepo.findProductForService(tx, input.productId);
        if (!product) throw new Error("Product not found");

        const variantId = product.variants?.[0]?.id ?? null;

        // 2) tạo nhiều service
        const created: Array<{ id: string; refNo: string | null }> = [];

        for (const s of input.services) {
            if (!s.serviceCatalogId) continue;

            const refNo = await genRefNo(tx, {
                model: tx.serviceRequest,
                prefix: "SR",
                field: "refNo",
                padding: 6,
            });

            const row = await serviceRequestRepo.createOne(tx, {
                refNo,
                type: ServiceType.PAID, // hoặc theo logic của bạn
                billable: true,         // internal service có thể billable=false tuỳ bạn
                status: "DRAFT",
                scope: "INTERNAL",

                productId: product.id,
                variantId,
                customerId: input.customerId ?? null,

                servicecatalogid: s.serviceCatalogId,
                notes: s.notes ?? null,

                // internal service => không có orderItemId
                orderItemId: null,
            }
            )
            created.push({ id: row.id, refNo: row.refNo ?? null });
        }

        return created;
    });
}

export async function bulkAssignVendorAndCreateMaintenance(input: {
    ids: string[];
    vendorId: string;
    note?: string | null;          // note chung cho log
    //onlyFromDraft?: boolean;       // default true
}) {
    const ids = Array.from(new Set((input.ids ?? []).map((x) => String(x).trim()).filter(Boolean)));
    if (!ids.length) throw new Error("Missing ids");
    const vendorId = String(input.vendorId ?? "").trim();
    if (!vendorId) throw new Error("Missing vendorId");

    return prisma.$transaction(async (tx) => {
        const vendor = await tx.vendor.findUnique({
            where: { id: vendorId },
            select: { id: true, name: true },
        });
        if (!vendor) throw new Error("Vendor not found");

        // 1) update SR
        const count = await serviceRequestRepo.bulkAssignVendor(tx, {
            ids,
            vendorId: vendor.id,
            vendorNameSnap: vendor.name,
            //onlyFromDraft: input.onlyFromDraft ?? true,
        });

        if (count === 0) return { count: 0, maintenance: 0 };

        // 2) lấy SR đã assign để tạo maintenance record
        const assigned = await tx.serviceRequest.findMany({
            where: {
                id: { in: ids },
                //...(input.onlyFromDraft ?? true ? { status: ServiceRequestStatus.IN_PROGRESS } : {}),
                vendorId: vendor.id,
            },
            select: { id: true, productId: true, variantId: true },
        });

        const now = new Date();
        const note = (input.note ?? "").trim();
        const defaultNote = `Assign vendor: ${vendor.name}`;
        const finalNote = note ? `${defaultNote}\n${note}` : defaultNote;

        // 3) create maintenance logs
        const logs = assigned.map((sr) => ({
            serviceRequestId: sr.id,
            productId: sr.productId ?? null,
            variantId: sr.variantId ?? null,
            vendorId: vendor.id,
            vendorName: vendor.name,
            notes: finalNote,
            servicedAt: now,
            currency: "VND",
            // totalCost/billed/etc để null default
        }));

        const created = await maintRepo.createMany(tx, logs);

        // (optional) chạm updatedAt lần nữa cho chắc, nhưng updateMany ở trên đã set updatedAt rồi
        return { count, maintenance: created.count };
    });
}

export async function getVendorDropdown() {
    return prisma.$transaction(async (tx) => {
        const rows = await serviceRequestRepo.findVendorsLite(tx);
        return rows;
    });
}