// src/features/acquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionStatus, AcquisitionType, Acquisition, ProductType } from "@prisma/client";
import { acqFiltersSchema } from "./acquisition.dto";
import prisma from "@/server/db/client";
import { CreateAcqWithItemInput } from "./acquisition.dto";
import { genRefNoIncrement } from "./helpers";
import { genRefNo } from "../../__components/AutoGenRef";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import { DB, dbOrTx } from "@/server/db/client";
import { ItemInput, NewItemInput } from "./acquisition.dto";


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
        createdAt?: Date;
        notes?: string | null;
    }
) {
    const db = dbOrTx(tx);
    const vendor = await db.vendor.findUnique({ where: { id: input.vendorId } });
    if (!vendor) throw new Error("Vendor không tồn tại!");
    return db.acquisition.create({
        data: {
            vendor: { connect: { id: input.vendorId } },
            acquiredAt: input.createdAt ?? new Date(),
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
    const db = dbOrTx(tx);
    //const refNo = await genRefNoIncrement(db);
    const refNo = await genRefNo(db, {
        model: db.acquisition,
        prefix: "PN",
    });
    //console.log('in ra ref no : ' + refNo + ' va  ' + acqId)
    const count = await tx.acquisitionItem.count({ where: { acquisitionId: acqId } });
    if (count === 0) throw new Error("Không thể đăng phiếu trống.");

    return tx.acquisition.update({
        where: { id: acqId },
        data: {
            refNo: refNo,
            accquisitionStt: "POSTED"
        },
        select: { id: true, accquisitionStt: true },
    });
}

// 7. lấy list acquisition
export async function getAcqList(where: Prisma.AcquisitionWhereInput,
    orderBy: Prisma.AcquisitionOrderByWithRelationInput[],
    skip: number, take: number, tx?: DB) {
    const db = dbOrTx(tx);
    const [rows, total] = await Promise.all([
        db.acquisition.findMany({
            where, orderBy, skip, take,
            select: {
                id: true, refNo: true, type: true, accquisitionStt: true,
                createdAt: true, cost: true, currency: true, updatedAt: true, notes: true,
                vendor: { select: { id: true, name: true } },
                _count: { select: { acquisitionItem: true, invoice: true } }
            }
        }),
        db.acquisition.count({ where }),
    ]);
    return { rows, total };
}

// 8. Lấy detail acquisition
export async function getAcqtById(id: string, tx?: DB) {
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
export async function createAcqItem(
    tx: DB,
    acqId: string,
    item: any
) {
    const db = dbOrTx(tx);
    return db.acquisitionItem.create({
        data: {
            acquisitionId: acqId,
            productTitle: item.title,
            quantity: item.quantity,
            unitCost: item.unitCost, // chuẩn field DB
            productType: item.productType ?? ProductType.WATCH,
        },
    });
}
export async function findAcqItems(tx: DB, acqId: string) {
    const db = dbOrTx(tx);
    return db.acquisitionItem.findMany({
        where: { acquisitionId: acqId },
    })
}

export async function updateAcqItem(tx: DB, it: any) {
    const db = dbOrTx(tx);
    return db.acquisitionItem.update({
        where: { id: it.id },
        data: {
            productTitle: it.title,
            quantity: it.quantity,
            unitCost: it.unitPrice,
        },
    });
}
export async function updateAcqTotal(tx: DB, acqId: string, total: number) {
    const db = dbOrTx(tx);

    return db.acquisition.update({
        where: { id: acqId },
        data: { cost: total },
    });
}
//9 Xoá các item theo id
export async function deleteAcqItems(tx: DB, ids: string[]) {
    const db = dbOrTx(tx);
    if (!ids?.length) return;
    await db.acquisitionItem.deleteMany({ where: { id: { in: ids } } });
}

//10 Update 1 item
export async function updateAcquisitionItem(tx: Prisma.TransactionClient, id: string, data: Partial<AcquisitionItem>) {
    return tx.acquisitionItem.update({ where: { id }, data });
}
