// src/features/acquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionStatus } from "@prisma/client";
import { acqFiltersSchema } from "./dto";
import prisma from "@/server/db/client";
import { CreateAcqWithItemInput } from "./acquisition.dto";

import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

type DB = Tx | typeof prisma;
const dbOrTx = (tx?: Tx): DB => tx ?? prisma;



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
                    currency: data.currency ?? "VND",
                    accquisitionStt: "DRAFT",
                    type: data.type ?? "PURCHASE",
                    notes: data.notes ?? null,
                    cost: 0,
                },
                select: { id: true },
            });
        }
        await tx.acquisitionItem.create({
            data: {
                acquisition: { connect: { id: acquisition.id } },
                product: { connect: { id: data.item.productId } },
                ...(data.item.variantId ? { variant: { connect: { id: data.item.variantId } } } : {}),
                quantity: data.item.quantity ?? 1,
                unitCost: new Prisma.Decimal(data.item.unitCost ?? 0),
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