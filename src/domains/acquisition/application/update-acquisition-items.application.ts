"use server";

import type { DB } from "@/server/db/client";
import * as dto from "../shared/acquisition.dto";
import { toDraftItem } from "../shared/acquisition.mapper";
import { computeActiveAcquisitionTotal } from "../shared/helper";
import * as repoAcq from "../serverOld/core/write/acquisition-write.repo";

export async function updateAcquisitionItemsApplication(
    tx: DB,
    acqId: string,
    items: dto.WatchItemInput[]
) {
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

    for (const raw of items) {
        const item = toDraftItem(raw);

        if (raw.id.startsWith("tmp-")) {
            const createdItem = await repoAcq.createAcqItem(tx, acqId, item);

            if (acq.accquisitionStt !== "POSTED") {
                const aiMeta = item.aiMeta ?? {};
                const firstImage = Array.isArray(aiMeta?.images) ? aiMeta.images[0] : null;

                if (!acq.vendorId) {
                    throw new Error("Phiếu nhập không có vendor");
                }

                await repoAcq.createWatchDraftForAcquisitionItem(tx, {
                    acquisitionItemId: createdItem.id,
                    acquisitionId: acqId,
                    vendorId: acq.vendorId,
                    title: item.productTitle ?? "Watch draft",
                    unitCost: Number(item.unitCost ?? 0),
                    imageKey: firstImage?.key ?? null,
                    imageUrl: firstImage?.url ?? null,
                });
            }

            continue;
        }

        await repoAcq.updateAcqItem(tx, {
            ...item,
            id: raw.id,
        });

        await repoAcq.syncLinkedProductFromAcquisitionItem(tx, raw.id);
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
