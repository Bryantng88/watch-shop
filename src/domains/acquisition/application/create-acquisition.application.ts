"use server";

import { prisma } from "@/server/db/client";
import * as dto from "../shared/acquisition.dto";
import { toDraftItem } from "../shared/acquisition.mapper";
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

function parseLocalDateVN(value?: string | null) {
    const text = String(value ?? "").trim();
    if (!text) return undefined;

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return new Date(`${text}T00:00:00+07:00`);
    }

    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function createAcquisitionWithItemApplication(
    input: dto.CreateAcquisitionInput
) {
    const pendingInlineImages: PendingInlineImageAttach[] = [];

    const result = await prisma.$transaction(async (tx) => {
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
            createdAt: parseLocalDateVN(input.createdAt),
            notes: input.notes,
        });

        let total = 0;

        for (const [index, raw] of input.items.entries()) {
            const item = toDraftItem(raw);
            const createdItem = await repoAcq.createAcqItem(tx, acq.id, item);
            total += Number(item.unitCost ?? 0);

            const draft = await repoAcq.createWatchDraftForAcquisitionItem(tx, {
                acquisitionItemId: createdItem.id,
                acquisitionId: acq.id,
                vendorId,
                title: item.productTitle ?? "Watch draft",
                unitCost: Number(item.unitCost ?? 0),
            });

            const firstImage = pickFirstAcquisitionInlineImage(item.aiMeta?.images);
            if (firstImage) {
                pendingInlineImages.push({
                    acquisitionId: acq.id,
                    productId: draft.productId,
                    image: firstImage,
                    sortOrder: index,
                });
            }
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);

        return { id: acq.id };
    });

    for (const pending of pendingInlineImages) {
        await attachInlineImageToAcquisitionWatchDraft(pending);
    }

    return result;
}

export const createAcquisitionWithItem = createAcquisitionWithItemApplication;
export const createAcquisitionApplication = createAcquisitionWithItemApplication;
