import { Prisma, type AcquisitionType } from "@prisma/client";
import { type DB, dbOrTx } from "@/server/db/client";

export type CreateDraftInput = {
    vendorId: string;
    currency?: string;
    type?: AcquisitionType;
    createdAt?: Date;
    notes?: string | null;
};

function getDb(tx?: DB) {
    return dbOrTx(tx);
}

export async function ensureVendorExists(tx: DB, vendorId: string) {
    const db = getDb(tx);

    const vendor = await db.vendor.findUnique({
        where: { id: vendorId },
        select: { id: true },
    });

    if (!vendor) {
        throw new Error("Vendor không tồn tại");
    }

    return vendor;
}

export async function createDraft(tx: DB, input: CreateDraftInput) {
    const db = getDb(tx);

    await ensureVendorExists(tx, input.vendorId);

    return db.acquisition.create({
        data: {
            vendorId: input.vendorId,
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

export async function updateAcquisitionCost(tx: DB, acqId: string, total: number) {
    const db = getDb(tx);

    return db.acquisition.update({
        where: { id: acqId },
        data: { cost: new Prisma.Decimal(Number(total || 0)) },
        select: { id: true, cost: true },
    });
}

export async function updateAcqTotal(tx: DB, acqId: string, total: number) {
    return updateAcquisitionCost(tx, acqId, total);
}

export async function getAcqtById(id: string, tx?: DB) {
    const db = getDb(tx);

    return db.acquisition.findUnique({
        where: { id },
        include: {
            vendor: true,
            customer: true,
            acquisitionItem: {
                include: {
                    product: true,
                },
                orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            },
            Invoice: true,
        },
    });
}

export async function changeDraftToPost(tx: DB, acqId: string) {
    const db = getDb(tx);

    const itemCount = await db.acquisitionItem.count({
        where: { acquisitionId: acqId },
    });

    if (itemCount === 0) {
        throw new Error("Không thể duyệt phiếu trống");
    }

    const current = await db.acquisition.findUnique({
        where: { id: acqId },
        select: {
            id: true,
            refNo: true,
            accquisitionStt: true,
        },
    });

    if (!current) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    if (current.accquisitionStt === "POSTED") {
        return current;
    }

    const postedCount = await db.acquisition.count({
        where: {
            refNo: {
                startsWith: "PN-",
            },
        },
    });

    const refNo = current.refNo ?? `PN-${String(postedCount + 1).padStart(6, "0")}`;

    return db.acquisition.update({
        where: { id: acqId },
        data: {
            refNo,
            accquisitionStt: "POSTED",
        },
        select: {
            id: true,
            refNo: true,
            accquisitionStt: true,
        },
    });
}

export async function cancelDraftAcquisition(tx: DB, id: string) {
    const db = getDb(tx);

    return db.acquisition.update({
        where: { id },
        data: { accquisitionStt: "CANCELED" as any },
    });
}
