import { ProductType } from "@prisma/client";
import { type DB, dbOrTx } from "@/server/db/client";
import {
    stringifyAcquisitionItemMeta,
    type AcquisitionPricingMeta,
} from "../shared/acquisition-item-metadata";

export type CreateOrUpdateAcqItemInput = {
    id?: string;
    title?: string;
    productTitle?: string;
    quantity?: number;
    unitCost?: number;
    unitPrice?: number;
    quickSpec?: any;
    aiMeta?: any;
    pricing?: AcquisitionPricingMeta;
};

function getDb(tx?: DB) {
    return dbOrTx(tx);
}

function resolveItemTitle(input: CreateOrUpdateAcqItemInput) {
    return String(input.productTitle ?? input.title ?? "").trim() || "Untitled watch";
}

function resolveItemUnitCost(input: CreateOrUpdateAcqItemInput) {
    return Number(input.unitCost ?? input.unitPrice ?? 0);
}

function buildItemDescription(input: CreateOrUpdateAcqItemInput) {
    return stringifyAcquisitionItemMeta({
        quickSpec: input.quickSpec,
        aiMeta: input.aiMeta,
        pricing: input.pricing,
    });
}

export async function createAcqItem(
    tx: DB,
    acqId: string,
    item: CreateOrUpdateAcqItemInput
) {
    const db = getDb(tx);

    return db.acquisitionItem.create({
        data: {
            acquisitionId: acqId,
            productTitle: resolveItemTitle(item),
            quantity: 1,
            unitCost: resolveItemUnitCost(item),
            productType: ProductType.WATCH,
            productId: null,
            variantId: null,
            description: buildItemDescription(item),
        },
        select: {
            id: true,
            productTitle: true,
            quantity: true,
            unitCost: true,
            productType: true,
            productId: true,
            variantId: true,
            description: true,
        },
    });
}

export async function updateAcqItem(
    tx: DB,
    item: CreateOrUpdateAcqItemInput & { id: string }
) {
    const db = getDb(tx);

    const shouldRewriteDescription =
        item.quickSpec !== undefined ||
        item.aiMeta !== undefined;

    return db.acquisitionItem.update({
        where: { id: item.id },
        data: {
            productTitle: resolveItemTitle(item),
            quantity: 1,
            unitCost: resolveItemUnitCost(item),
            ...(shouldRewriteDescription
                ? { description: buildItemDescription(item) }
                : {}),
        },
    });
}

export async function deleteAcqItems(tx: DB, ids: string[]) {
    const db = getDb(tx);
    if (!ids.length) return;

    await db.acquisitionItem.deleteMany({
        where: { id: { in: ids } },
    });
}

export async function findAcqItems(tx: DB, acqId: string) {
    const db = getDb(tx);

    return db.acquisitionItem.findMany({
        where: { acquisitionId: acqId },
        include: {
            product: true,
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
}

export async function linkAcquisitionItemToProduct(
    tx: DB,
    input: {
        itemId: string;
        productId: string;
    }
) {
    const db = getDb(tx);

    return db.acquisitionItem.update({
        where: { id: input.itemId },
        data: {
            productId: input.productId,
            variantId: null,
        },
        select: {
            id: true,
            productId: true,
            variantId: true,
        },
    });
}

export async function updateAcquisitionItemStatus(
    tx: DB,
    input:
        | {
            itemId: string;
            toStatus: string;
        }
        | {
            acquisitionId: string;
            fromStatus?: string;
            toStatus: string;
        }
) {
    const db = getDb(tx);

    if ("itemId" in input) {
        return db.acquisitionItem.update({
            where: { id: input.itemId },
            data: { status: input.toStatus as any },
        });
    }

    return db.acquisitionItem.updateMany({
        where: {
            acquisitionId: input.acquisitionId,
            ...(input.fromStatus ? { status: input.fromStatus as any } : {}),
        },
        data: {
            status: input.toStatus as any,
        },
    });
}
