// src/features/acquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionStatus, AcquisitionType, Acquisition } from "@prisma/client";
import { acqFiltersSchema } from "./acquisition.dto";
import prisma from "@/server/db/client";
import { CreateAcqWithItemInput } from "./acquisition.dto";
import { genRefNoIncrement } from "./helpers";

import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import { DB, dbOrTx } from "@/server/db/client";


export async function findDraftOfVendorToday(tx: Prisma.TransactionClient, vendorId: string) {
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
    tx: DB,
    input: {
        vendorId: string;
        currency?: string;
        type?: AcquisitionType;
        acquiredAt?: Date;
        notes?: string | null;
    }
) {
    const db = dbOrTx(tx);
    const vendor = await db.vendor.findUnique({ where: { id: input.vendorId } });
    if (!vendor) throw new Error("Vendor không tồn tại!");
    return db.acquisition.create({
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

export async function updateAcquisitionCost(
    tx: DB,
    acqId: string,
    total: number
) {
    return tx.acquisition.update({
        where: { id: acqId },
        data: { cost: total },
        select: { id: true, cost: true },
    });
}

// 4. Cập nhật tổng cost của phiếu
export async function recalcCost(tx: DB, acqId: string) {
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

// 5. Cập nhật thông tin phiếu acquisition
export async function updateAcquisition(id: string, tx: DB, data: Partial<Acquisition>) {
    const db = dbOrTx(tx);
    return db.acquisition.update({ where: { id }, data });
}


// 6. Chuyển phiếu sang trạng thái POSTED
export async function changeDraftToPost(tx: DB, acqId: string) {

    const refNo = await genRefNoIncrement();
    console.log('in ra ref no : ' + refNo)
    const count = await tx.acquisitionItem.count({ where: { acquisitionId: acqId } });
    if (count === 0) throw new Error("Không thể đăng phiếu trống.");

    return tx.acquisition.update({
        where: { id: acqId },
        data: {
            //refNo: refNo,
            accquisitionStt: "POSTED"
        },
        select: { id: true, accquisitionStt: true },
    });
}

// 7. lấy list acquisition
export async function acqList(where: Prisma.AcquisitionWhereInput,
    orderBy: Prisma.AcquisitionOrderByWithRelationInput[],
    skip: number, take: number, tx?: DB) {
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

// 8. Lấy detail acquisition
export async function acqGetById(id: string, tx?: DB) {
    const db = dbOrTx(tx);
    //const db = dbOrTx(tx);
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
// thêm acquisition item
export async function addAcqItem(
    tx: DB,
    acqId: string,
    productId: string,
    unitCost: number
) {
    const db = dbOrTx(tx);
    return db.acquisitionItem.create({
        data: {
            acquisition: { connect: { id: acqId } },
            product: { connect: { id: productId } },
            quantity: 1,
            unitCost: unitCost
        }
    })
}
export async function updateAcqItem(
    tx: DB,
    itemId: string,
    data: {
        quantity?: number;
        unitCost?: number;

        // thêm các field khác nếu cần
    }
) {
    const db = dbOrTx(tx);

    return db.acquisitionItem.update({
        where: { id: itemId },
        data: {
            ...data
            // nếu có thêm trường khác thì bổ sung ở đây
        },
    });
}

//9 Xoá các item theo id
export async function deleteAcquisitionItems(tx: Prisma.TransactionClient, ids: string[]) {
    if (!ids?.length) return;
    await tx.acquisitionItem.deleteMany({ where: { id: { in: ids } } });
}

//10 Update 1 item
export async function updateAcquisitionItem(tx: Prisma.TransactionClient, id: string, data: Partial<AcquisitionItem>) {
    return tx.acquisitionItem.update({ where: { id }, data });
}
