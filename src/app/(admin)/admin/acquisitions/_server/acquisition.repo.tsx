// src/features/acquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionStatus } from "@prisma/client";
import { acqFiltersSchema } from "./dto";
import prisma from "@/server/db/client";

import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
export type Tx = Prisma.TransactionClient;
const dbOrTx = (tx?: Tx) => (tx ?? prisma) as Prisma.TransactionClient;

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
export async function acqList(where: Prisma.AcquisitionWhereInput,
    orderBy: Prisma.AcquisitionOrderByWithRelationInput[],
    skip: number, take: number, tx?: Tx) {
    const db = dbOrTx(tx);
    const [rows, total] = await Promise.all([
        db.acquisition.findMany({
            where, orderBy, skip, take,
            select: {
                id: true, refNo: true, type: true, accquisitionStt: true,
                acquiredAt: true, cost: true, currency: true,
                vendor: { select: { id: true, name: true } },
                _count: { select: { AcquisitionItem: true, Invoice: true } }
            }
        }),
        db.acquisition.count({ where }),
    ]);
    return { rows, total };
}

// DETAIL
export async function acqGetById(id: string, tx?: Tx) {
    const db = dbOrTx(tx);
    return db.acquisition.findUnique({
        where: { id },
        include: {
            vendor: true,
            customer: true,
            AcquisitionItem: { include: { product: true, variant: true } },
            Invoice: true,
        },
    });
}