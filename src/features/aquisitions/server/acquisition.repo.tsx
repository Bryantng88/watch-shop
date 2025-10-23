// src/features/aquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionType } from "@prisma/client";

export const acquisitionRepo = (tx: Prisma.TransactionClient) => ({
    create: (data: {
        vendorId: string;
        acquiredAt?: Date;
        cost?: number;
        currency?: string;
        refNo?: string | null;
        notes?: string | null;
        type?: AcquisitionType | string; // 'PURCHASE' | 'CONSIGN'
    }) =>
        tx.acquisition.create({
            data: {
                vendor: { connect: { id: data.vendorId } },
                acquiredAt: data.acquiredAt ?? undefined,
                cost: data.cost ?? 0,
                currency: data.currency ?? "VND",
                refNo: data.refNo ?? null,
                notes: data.notes ?? null,
                type:
                    (typeof data.type === "string"
                        ? (data.type as AcquisitionType)
                        : data.type) ?? "PURCHASE",
            },
            select: { id: true },
        }),
});
