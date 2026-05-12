"use server";

import type { DB } from "@/server/db/client";
import * as dto from "../shared/acquisition.dto";
import { toDraftItem } from "../shared/acquisition.mapper";
import { computeActiveAcquisitionTotal } from "../shared/helper";
import * as repoAcq from "../server";
import {
    attachInlineImageToAcquisitionWatchDraft,
    pickFirstAcquisitionInlineImage,
    type AcquisitionInlineImageInput,
} from "../server/media";

type PendingInlineImageAttach = {
    acquisitionId: string;
    productId: string;
    image: AcquisitionInlineImageInput;
    sortOrder: number;
};

export async function updateAcquisitionItemsApplication(
    tx: DB,
    acqId: string,
    items: dto.WatchItemInput[]
) {
    const pendingInlineImages: PendingInlineImageAttach[] = [];

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

    for (const pending of pendingInlineImages) {
        await attachInlineImageToAcquisitionWatchDraft(pending);
    }

    return { success: true, total };
}

export const updateAcquisitionItems = updateAcquisitionItemsApplication;
