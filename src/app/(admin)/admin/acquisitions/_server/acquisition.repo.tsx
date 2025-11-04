// src/features/acquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionStatus, AcquisitionType } from "@prisma/client";
import { acqFiltersSchema } from "./dto";
import prisma from "@/server/db/client";
import { CreateAcqWithItemInput } from "./acquisition.dto";

import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

type DB = Tx | typeof prisma;
const dbOrTx = (tx?: Tx): DB => tx ?? prisma;

export async function findDraftOfVendorToday(tx: Tx, vendorId: string) {
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
export async function createDraft(
    tx: Tx,
    input: {
        vendorId: string;
        currency?: string;
        type?: AcquisitionType;
        acquiredAt?: Date;
        notes?: string | null;
    }
) {
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

// 3. Thêm item vào phiếu nhập
export async function addItem(
    tx: Tx,
    acqId: string,
    item: {
        productId: string;
        variantId?: string | null;
        quantity?: number;
        unitCost?: number;
    }
) {
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

// 4. Cập nhật tổng cost của phiếu
export async function recalcCost(tx: Tx, acqId: string) {
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

// 5. Tạo mới + thêm item (nếu chưa có)
export async function upsertDraftAndAddItem(
    tx: Tx,
    input: {
        vendorId: string;
        currency?: string;
        type?: AcquisitionType;
        acquiredAt?: Date;
        notes?: string | null;
        item: { productId: string; variantId?: string | null; quantity?: number; unitCost?: number; };
    }
) {
    let draft = await findDraftOfVendorToday(tx, input.vendorId);
    if (!draft) draft = await createDraft(tx, input);
    await addItem(tx, draft.id, input.item);
    await recalcCost(tx, draft.id);
    return draft; // { id }
}

// 6. Chuyển phiếu sang trạng thái POSTED
export async function post(tx: Tx, acqId: string) {
    const count = await tx.acquisitionItem.count({ where: { acquisitionId: acqId } });
    if (count === 0) throw new Error("Không thể đăng phiếu trống.");

    return tx.acquisition.update({
        where: { id: acqId },
        data: { accquisitionStt: "POSTED" },
        select: { id: true, accquisitionStt: true },
    });
}



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
                _count: { select: { acquisitionItem: true, invoice: true } }
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
            acquisitionItem: { include: { product: true, variant: true } },
            invoice: true,
        },
    });
}