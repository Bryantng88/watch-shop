// src/features/acquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionStatus } from "@prisma/client";
import { Tx } from "@/server/db/client";


export type CreateAcqWithItemInput = {
    vendorId: string;
    acquiredAt?: Date;
    cost?: number;
    accquisitionStt?: AcquisitionStatus
    currency?: string;
    refNo?: string | null;
    notes?: string | null;
    // line:
    productId: string;
    unitCost?: number;  // nếu bạn muốn lưu đơn giá line (thường = cost)
    qty?: number;       // mặc định 1
};

export const acquisitionRepo = (tx: Tx) => ({
    async createWithItem(data: CreateAcqWithItemInput) {

        let acquisition = await tx.acquisition.findFirst({
            where: {
                vendorId: data.vendorId,
                accquisitionStt: "DRAFT",
                acquiredAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
            select: { id: true },
        })
        console.log('test acquisition binding: ' + acquisition?.id)
        if (!acquisition) {
            acquisition = await tx.acquisition.create({
                data: {
                    vendor: { connect: { id: data.vendorId } },
                    acquiredAt: data.acquiredAt ?? new Date(),
                    cost: data.cost ?? data.unitCost ?? 0,
                    accquisitionStt: "DRAFT",
                    currency: data.currency ?? "VND",
                    refNo: data.refNo ?? null,
                    notes: data.notes ?? null,
                    type: "PURCHASE",
                },
                select: { id: true },
            });
        }
        await tx.acquisitionItem.create({
            data: {
                acquisition: { connect: { id: acquisition.id } },
                product: { connect: { id: data.productId } },
                quantity: 1,
                unitCost: data.cost,
            },
        });

        return acquisition; // { id }
    },
});
