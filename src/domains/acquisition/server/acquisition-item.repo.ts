import { AudienceSegment, ProductType } from "@prisma/client";
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
    audienceSegment?: AudienceSegment;
    sourceOrderItemId?: string | null;
    productType?: ProductType;
    productId?: string | null;
    variantId?: string | null;
    strapSpec?: Record<string, unknown> | null;
    claspSpec?: Record<string, unknown> | null;
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

function resolveItemQuantity(input: CreateOrUpdateAcqItemInput) {
    const quantity = Math.trunc(Number(input.quantity ?? 1));
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function buildItemDescription(input: CreateOrUpdateAcqItemInput) {
    return stringifyAcquisitionItemMeta({
        quickSpec: input.quickSpec,
        aiMeta: input.aiMeta,
        pricing: input.pricing,
        strapSpec: input.strapSpec ?? undefined,
        claspSpec: input.claspSpec ?? undefined,
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
            audienceSegment: item.audienceSegment ?? AudienceSegment.MEN,
            quantity: resolveItemQuantity(item),
            unitCost: resolveItemUnitCost(item),
            productType: item.productType ?? ProductType.WATCH,
            productId: item.productId ?? null,
            variantId: item.variantId ?? null,
            description: buildItemDescription(item),
            sourceOrderItemId: item.sourceOrderItemId ?? null,
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
            audienceSegment: true,
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
            quantity: resolveItemQuantity(item),
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
