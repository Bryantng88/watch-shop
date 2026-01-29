import * as sevRepo from "./service_request.repo"
import { Prisma, PrismaClient } from "@prisma/client";
import * as serviceRequestRepo from "./service_request.repo";

export type ServiceCatalogItem = {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    detail: string;          // BASIC | OVERHAUL | SPA ...
    defaultPrice: number | null;
    durationMin: number | null;
};



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

    scope: string | null;
    customerItemNote: string | null;
};

export async function getAdminServiceRequestList(input: ServiceRequestSearchInput) {
    const { page, pageSize, q, status } = input;

    const where: Prisma.ServiceRequestWhereInput = {
        ...(status ? { status: status as any } : {}),
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

        scope: (r.orderItem?.serviceScope as any) ?? null,
        customerItemNote: r.orderItem?.customerItemNote ?? null,
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
            scope === "PRODUCT_ITEM" && linked
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
            (scope === "CUSTOMER_ITEM" ? (it.customerItemNote ?? null) : null) ??
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
