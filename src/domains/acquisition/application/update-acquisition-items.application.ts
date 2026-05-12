"use server";

import { prisma, type DB } from "@/server/db/client";
import * as dto from "../shared/acquisition.dto";
import { toDraftItem } from "../shared/acquisition.mapper";
import { computeActiveAcquisitionTotal } from "../shared/helper";
import * as repoAcq from "../server";
import {
    attachInlineImageToAcquisitionWatchDraft,
    pickFirstAcquisitionInlineImage,
    type AcquisitionInlineImageInput,
} from "../server/acquisition-media.service";

type PendingInlineImageAttach = {
    acquisitionId: string;
    productId: string;
    image: AcquisitionInlineImageInput;
    sortOrder: number;
};

type UpdateAcquisitionItemsInput = {
    acquisitionId: string;
    items: dto.WatchItemInput[];
};

async function updateAcquisitionItemsTx(
    tx: DB,
    input: UpdateAcquisitionItemsInput,
    pendingInlineImages: PendingInlineImageAttach[]
) {
    const { acquisitionId: acqId, items } = input;

    const acq = await tx.acquisition.findUnique({
        where: { id: acqId },
        select: { accquisitionStt: true, vendorId: true },
    });

    if (!acq) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    const existing = await repoAcq.findAcqItems(tx, acqId);
    const existingIds = new Set(existing.map((i) => i.id));
    const receivedIds = new Set(items.map((i) => i.id));
    const toDelete = [...existingIds].filter((id) => !receivedIds.has(id));

    if (acq.accquisitionStt !== "POSTED" && toDelete.length > 0) {
        await repoAcq.deleteAcqItems(tx, toDelete);
    }

    for (const [index, raw] of items.entries()) {
        const item = toDraftItem(raw);
        const firstImage = pickFirstAcquisitionInlineImage(item.aiMeta?.images);

        if (raw.id.startsWith("tmp-")) {
            const createdItem = await repoAcq.createAcqItem(tx, acqId, item);

            if (acq.accquisitionStt !== "POSTED") {
                if (!acq.vendorId) {
                    throw new Error("Phiếu nhập không có vendor");
                }

                const draft = await repoAcq.createWatchDraftForAcquisitionItem(tx, {
                    acquisitionItemId: createdItem.id,
                    acquisitionId: acqId,
                    vendorId: acq.vendorId,
                    title: item.productTitle ?? "Watch draft",
                    unitCost: Number(item.unitCost ?? 0),
                });

                if (firstImage) {
                    pendingInlineImages.push({
                        acquisitionId: acqId,
                        productId: draft.productId,
                        image: firstImage,
                        sortOrder: index,
                    });
                }
            }

            continue;
        }

        await repoAcq.updateAcqItem(tx, {
            ...item,
            id: raw.id,
        });

        const synced = await repoAcq.syncLinkedProductFromAcquisitionItem(tx, raw.id);

        if (synced?.productId && firstImage) {
            pendingInlineImages.push({
                acquisitionId: acqId,
                productId: synced.productId,
                image: firstImage,
                sortOrder: index,
            });
        }
    }

    const all = await repoAcq.findAcqItems(tx, acqId);
    const total = computeActiveAcquisitionTotal(
        all.map((item) => ({
            quantity: item.quantity,
            unitCost: Number(item.unitCost ?? 0),
        }))
    );

    await repoAcq.updateAcqTotal(tx, acqId, total);

    return { success: true, total };
}

export async function updateAcquisitionItemsApplication(
    input: UpdateAcquisitionItemsInput
) {
    const pendingInlineImages: PendingInlineImageAttach[] = [];

    const result = await prisma.$transaction((tx) =>
        updateAcquisitionItemsTx(tx as unknown as DB, input, pendingInlineImages)
    );

    for (const pending of pendingInlineImages) {
        await attachInlineImageToAcquisitionWatchDraft(pending);
    }

    return result;
}

/**
 * Compatibility wrapper for older internal callers.
 * New code should call updateAcquisitionItemsApplication({ acquisitionId, items }).
 */
export async function updateAcquisitionItems(
    tx: DB,
    acqId: string,
    items: dto.WatchItemInput[]
) {
    const pendingInlineImages: PendingInlineImageAttach[] = [];
    const result = await updateAcquisitionItemsTx(
        tx,
        { acquisitionId: acqId, items },
        pendingInlineImages
    );

    for (const pending of pendingInlineImages) {
        await attachInlineImageToAcquisitionWatchDraft(pending);
    }

    return result;
}
