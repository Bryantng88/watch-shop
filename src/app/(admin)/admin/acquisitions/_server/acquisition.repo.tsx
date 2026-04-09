import { Prisma, AcquisitionType, Acquisition, ProductType } from "@prisma/client";
import { genRefNo } from "../../__components/AutoGenRef";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import { DB, dbOrTx } from "@/server/db/client";
//import type { AcquisitionItemInput, ItemInput } from "./acquisition.dto";
import { stringifyAcquisitionItemMeta } from "./item-metadata";
import { itemsEqual } from "@dnd-kit/sortable/dist/utilities";

export async function createDraft(
    tx: DB,
    input: {
        vendorId: string;
        currency?: string;
        type?: AcquisitionType;
        createdAt?: Date;
        notes?: string | null;
    }
) {
    const db = dbOrTx(tx);
    const vendor = await db.vendor.findUnique({ where: { id: input.vendorId } });
    if (!vendor) throw new Error("Vendor không tồn tại!");

    return db.acquisition.create({
        data: {
            vendor: { connect: { id: input.vendorId } },
            acquiredAt: input.createdAt ?? new Date(),
            currency: input.currency ?? "VND",
            accquisitionStt: "DRAFT",
            type: input.type ?? "PURCHASE",
            notes: input.notes ?? null,
            cost: new Prisma.Decimal(0),
        },
        select: { id: true },
    });
}
export async function resolveVariantIdForProduct(
    tx: DB,
    productId?: string | null
) {
    const db = dbOrTx(tx);
    if (!productId) return null;

    const v = await db.productVariant.findFirst({
        where: { productId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true },
    });

    return v?.id ?? null;
}
export async function updateAcquisitionCost(tx: DB, acqId: string, total: number) {
    const db = dbOrTx(tx);
    return db.acquisition.update({
        where: { id: acqId },
        data: { cost: total },
        select: { id: true, cost: true },
    });
}

export async function changeDraftToPost(tx: DB, acqId: string) {
    const db = dbOrTx(tx);
    const refNo = await genRefNo(db, {
        model: db.acquisition,
        prefix: "PN",
    });

    const count = await db.acquisitionItem.count({ where: { acquisitionId: acqId } });
    if (count === 0) throw new Error("Không thể đăng phiếu trống.");

    return db.acquisition.update({
        where: { id: acqId },
        data: {
            refNo,
            accquisitionStt: "POSTED",
        },
        select: { id: true, accquisitionStt: true },
    });
}

export async function getAcqList(
    where: Prisma.AcquisitionWhereInput,
    orderBy: Prisma.AcquisitionOrderByWithRelationInput[],
    skip: number,
    take: number,
    tx?: DB
) {
    const db = dbOrTx(tx);
    const [rows, total] = await Promise.all([
        db.acquisition.findMany({
            where,
            orderBy,
            skip,
            take,
            select: {
                id: true,
                refNo: true,
                type: true,
                accquisitionStt: true,
                createdAt: true,
                cost: true,
                currency: true,
                updatedAt: true,
                notes: true,
                vendor: { select: { id: true, name: true } },
                acquisitionItem: {
                    select: {
                        id: true,
                        status: true,
                        quantity: true,
                        unitCost: true,
                    },
                },
                _count: { select: { invoice: true } },
            },
        }),
        db.acquisition.count({ where }),
    ]);
    return { rows, total };
}
export async function getAcqtById(id: string, tx?: DB) {
    const db = dbOrTx(tx);
    return db.acquisition.findUnique({
        where: { id },
        include: {
            vendor: true,
            customer: true,
            acquisitionItem: { include: { product: true, variant: true } },
            invoice: true,
        },
    });
}
export async function findAcqItems(tx: DB, acqId: string) {
    const db = dbOrTx(tx);
    return db.acquisitionItem.findMany({
        where: { acquisitionId: acqId },
    });
}


export async function createAcqItem(
    tx: DB,
    acqId: string,
    item: any
) {
    const db = dbOrTx(tx);

    const productId = item.productId ?? null;
    const variantId =
        item.variantId ??
        (productId ? await resolveVariantIdForProduct(tx, productId) : null);

    return db.acquisitionItem.create({
        data: {
            acquisitionId: acqId,
            productTitle: item.title,
            quantity: item.quantity,
            unitCost: item.unitCost ?? item.unitPrice ?? 0,
            productType: item.productType ?? ProductType.WATCH,
            productId,
            variantId,
            description: stringifyAcquisitionItemMeta({
                strapSpec: item.strapSpec,
                watchFlags: item.watchFlags,
                quickSpec: item.quickSpec,
                aiMeta: item.aiMeta,
            }),
        },
    });
}

export async function updateAcqItem(tx: DB, it: any) {
    const db = dbOrTx(tx);

    const productId = it.productId ?? null;
    const variantId =
        it.variantId ??
        (productId ? await resolveVariantIdForProduct(tx, productId) : null);

    return db.acquisitionItem.update({
        where: { id: it.id },
        data: {
            productTitle: it.title,
            quantity: it.quantity,
            unitCost: it.unitCost ?? it.unitPrice ?? 0,
            productType: it.productType ?? undefined,
            productId,
            variantId,
            description:
                it.strapSpec || it.watchFlags || it.quickSpec
                    ? stringifyAcquisitionItemMeta({
                        strapSpec: it.strapSpec,
                        watchFlags: it.watchFlags,
                        quickSpec: it.quickSpec,
                        aiMeta: it.aiMeta,
                    })
                    : undefined,
        },
    });
}

export async function updateAcqTotal(tx: DB, acqId: string, total: number) {
    const db = dbOrTx(tx);
    return db.acquisition.update({
        where: { id: acqId },
        data: { cost: total },
    });
}

export async function deleteAcqItems(tx: DB, ids: string[]) {
    const db = dbOrTx(tx);
    if (!ids?.length) return;
    await db.acquisitionItem.deleteMany({ where: { id: { in: ids } } });
}