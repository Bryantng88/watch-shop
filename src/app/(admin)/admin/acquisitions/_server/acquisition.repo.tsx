// src/features/acquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionStatus, AcquisitionType } from "@prisma/client";
import { acqFiltersSchema } from "./dto";
import prisma from "@/server/db/client";
import { CreateAcqWithItemInput } from "./acquisition.dto";

import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

type DB = Tx | typeof prisma;
const dbOrTx = (tx?: Tx): DB => tx ?? prisma;



export const acquisitionRepo = (tx: Tx) => ({
    async createWithItem(data: CreateAcqWithItemInput) {
        async function findDraftOfVendorToday(vendorId: string) {
            const start = new Date(); start.setHours(0, 0, 0, 0);
            const end = new Date(); end.setHours(23, 59, 59, 999);

            return tx.acquisition.findFirst({
                where: {
                    vendorId,
                    accquisitionStt: "DRAFT",
                    acquiredAt: { gte: start, lte: end },
                },
                select: { id: true },
            });
        }
        async function createDraft(input: {
            vendorId: string;
            currency?: string;
            type?: AcquisitionType;
            acquiredAt?: Date;
            notes?: string | null;
        }) {
            return tx.acquisition.create({
                data: {
                    vendor: { connect: { id: input.vendorId } },
                    acquiredAt: input.acquiredAt ?? new Date(),
                    currency: input.currency ?? "VND",
                    accquisitionStt: "DRAFT",
                    type: input.type ?? "PURCHASE",
                    notes: input.notes ?? null,
                    cost: new Prisma.Decimal(0),
                },
                select: { id: true },
            });
        }
        async function addItem(acqId: string, item: {
            productId: string;
            variantId?: string | null;
            quantity?: number;
            unitCost?: number;
        }) {
            return tx.acquisitionItem.create({
                data: {
                    acquisition: { connect: { id: acqId } },
                    product: { connect: { id: item.productId } },
                    ...(item.variantId ? { variant: { connect: { id: item.variantId } } } : {}),
                    quantity: item.quantity ?? 1,
                    unitCost: new Prisma.Decimal(item.unitCost ?? 0),
                },
                select: { id: true },
            });
        }
        async function recalcCost(acqId: string) {
            const rows = await tx.acquisitionItem.findMany({
                where: { acquisitionId: acqId },
                select: { quantity: true, unitCost: true },
            });
            const total = rows.reduce((s, r) => s + (Number(r.quantity) * Number(r.unitCost ?? 0)), 0);
            await tx.acquisition.update({
                where: { id: acqId },
                data: { cost: new Prisma.Decimal(total) },
            });
            return total;
        }
        async function upsertDraftAndAddItem(input: {
            vendorId: string;
            currency?: string;
            type?: AcquisitionType;
            acquiredAt?: Date;
            notes?: string | null;
            item: { productId: string; variantId?: string | null; quantity?: number; unitCost?: number; };
        }) {
            let draft = await findDraftOfVendorToday(input.vendorId);
            if (!draft) draft = await createDraft(input);
            await addItem(draft.id, input.item);
            await recalcCost(draft.id);
            return draft; // { id }
        }
        return { findDraftOfVendorToday, createDraft, addItem, recalcCost, upsertDraftAndAddItem };
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