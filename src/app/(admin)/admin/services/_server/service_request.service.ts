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
export type ServiceCatalogSearchInput = {
    page: number;
    pageSize: number;
    q?: string | null;
    isActive?: boolean | null;
};

export async function getServiceCatalogList(
    input: ServiceCatalogSearchInput,
    prisma: PrismaClient
) {
    const { page, pageSize, q, isActive } = input;

    const where: Prisma.ServiceCatalogWhereInput = {
        ...(typeof isActive === "boolean" ? { isActive } : {}),
        ...(q
            ? {
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { code: { contains: q, mode: "insensitive" } },
                ],
            }
            : {}),
    };

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const { rows, total } = await serviceRequestRepo.getServiceCatalogList(
        where,
        { updatedAt: "desc" },
        skip,
        take,
        prisma
    );

    const items = rows.map((s) => ({
        id: s.id,
        code: s.code ?? null,
        name: s.name,
        defaultPrice: s.defaultPrice != null ? Number(s.defaultPrice) : null,
        isActive: Boolean(s.isActive),
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
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
