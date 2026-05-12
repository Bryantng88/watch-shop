"use server";

import { prisma } from "@/server/db/client";
import * as dto from "../shared/acquisition.dto";
import { toDraftItem } from "../shared/acquisition.mapper";
import * as repoAcq from "../serverOld/core/write/acquisition-write.repo";

export async function createAcquisitionWithItemApplication(
    input: dto.CreateAcquisitionInput
) {
    return prisma.$transaction(async (tx) => {
        let vendorId = input.vendorId;

        if (!vendorId && input.quickVendorName) {
            const newVendor = await tx.vendor.create({
                data: { name: input.quickVendorName },
            });
            vendorId = newVendor.id;
        }

        if (!vendorId) {
            throw new Error("Thiếu vendor");
        }

        const acq = await repoAcq.createDraft(tx, {
            vendorId,
            currency: input.currency,
            type: input.type,
            createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
            notes: input.notes,
        });

        let total = 0;

        for (const raw of input.items) {
            const item = toDraftItem(raw);
            const createdItem = await repoAcq.createAcqItem(tx, acq.id, item);
            total += Number(item.unitCost ?? 0);

            const aiMeta = item.aiMeta ?? {};
            const firstImage = Array.isArray(aiMeta?.images) ? aiMeta.images[0] : null;

            await repoAcq.createWatchDraftForAcquisitionItem(tx, {
                acquisitionItemId: createdItem.id,
                acquisitionId: acq.id,
                vendorId,
                title: item.productTitle ?? "Watch draft",
                unitCost: Number(item.unitCost ?? 0),
                imageKey: firstImage?.key ?? null,
                imageUrl: firstImage?.url ?? null,
            });
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);

        return { id: acq.id };
    });
}
