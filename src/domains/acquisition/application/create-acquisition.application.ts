"use server";

import { prisma } from "@/server/db/client";
import * as dto from "../shared/acquisition.dto";
import { toDraftItem } from "../shared/acquisition.mapper";
import * as repoAcq from "../server";

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
            audienceSegment: input.audienceSegment,
        });

        let total = 0;

        for (const raw of input.items) {
            const item = toDraftItem(raw);
            await repoAcq.createAcqItem(tx, acq.id, item);
            total += Number(item.unitCost ?? 0);
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);

        return { id: acq.id };
    });

    await repoAcq.emitAcquisitionBusinessEvent(prisma, {
        eventKey: "acquisition.created",
        acquisitionId: result.id,
    });

    return result;
}

export const createAcquisitionWithItem = createAcquisitionWithItemApplication;
export const createAcquisitionApplication = createAcquisitionWithItemApplication;
