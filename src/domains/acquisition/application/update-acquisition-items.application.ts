"use server";

import { prisma, type DB } from "@/server/db/client";
import * as dto from "../shared/acquisition.dto";
import { toDraftItem } from "../shared/acquisition.mapper";
import { computeActiveAcquisitionTotal } from "../shared/helper";
import * as repoAcq from "../server";

type UpdateAcquisitionItemsInput = {
    acquisitionId: string;
    items: dto.WatchItemInput[];
};

async function updateAcquisitionItemsTx(
    tx: DB,
    input: UpdateAcquisitionItemsInput
) {
    const { acquisitionId: acqId, items } = input;

    const acq = await tx.acquisition.findUnique({
        where: { id: acqId },
        select: { accquisitionStt: true },
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
            await repoAcq.createAcqItem(tx, acqId, item);
            continue;
        }

        await repoAcq.updateAcqItem(tx, {
            ...item,
            id: raw.id,
        });

        if (acq.accquisitionStt === "POSTED") {
            await repoAcq.syncLinkedProductFromAcquisitionItem(tx, raw.id);
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
    return prisma.$transaction((tx) =>
        updateAcquisitionItemsTx(tx as unknown as DB, input)
    );
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
    return updateAcquisitionItemsTx(tx, { acquisitionId: acqId, items });
}
