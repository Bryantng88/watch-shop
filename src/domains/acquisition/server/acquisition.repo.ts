import { AudienceSegment, Prisma, type AcquisitionType } from "@prisma/client";
import { type DB, dbOrTx } from "@/server/db/client";

export type CreateDraftInput = {
    vendorId: string;
    currency?: string;
    type?: AcquisitionType;
    createdAt?: Date;
    notes?: string | null;
    audienceSegment?: AudienceSegment;
};

function getDb(tx?: DB) {
    return dbOrTx(tx);
}

function formatRefNoDatePart(date: Date) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    }).formatToParts(date);

    const day = parts.find((part) => part.type === "day")?.value ?? "00";
    const month = parts.find((part) => part.type === "month")?.value ?? "00";
    const year = parts.find((part) => part.type === "year")?.value ?? "00";

    return `${day}${month}${year}`;
}

async function generatePostedRefNo(tx: DB, date: Date) {
    const db = getDb(tx);
    const prefix = `PN-${formatRefNoDatePart(date)}-`;

    const latest = await db.acquisition.findFirst({
        where: {
            refNo: { startsWith: prefix },
        },
        select: { refNo: true },
        orderBy: { refNo: "desc" },
    });

    const currentSeq = Number(latest?.refNo?.slice(prefix.length) ?? 0);
    const nextSeq = Number.isFinite(currentSeq) ? currentSeq + 1 : 1;

    return `${prefix}${String(nextSeq).padStart(6, "0")}`;
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
            audienceSegment: input.audienceSegment ?? AudienceSegment.MEN,
            totalAmount: new Prisma.Decimal(0),
        },
        select: { id: true },
    });
}

export async function updateAcquisitionCost(tx: DB, acqId: string, total: number) {
    const db = getDb(tx);

    return db.acquisition.update({
        where: { id: acqId },
        data: { totalAmount: new Prisma.Decimal(Number(total || 0)) },
        select: { id: true, totalAmount: true },
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
            acquiredAt: true,
            createdAt: true,
        },
    });

    if (!current) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    if (current.accquisitionStt === "POSTED") {
        return current;
    }

    const refNo = current.refNo ?? (await generatePostedRefNo(
        tx,
        current.acquiredAt ?? current.createdAt ?? new Date()
    ));

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

export async function findFirstAcquisitionInlineMediaAsset(
    tx: DB,
    input: { acquisitionId: string }
): Promise<AcquisitionInlineImageInput | null> {
    const db = tx ?? prisma;

    const asset = await db.mediaAsset.findFirst({
        where: {
            acquisitionId: input.acquisitionId,
            role: "INLINE",
            isMissing: false,
            status: { in: ["ACTIVE", "CHOSEN", "ATTACHED"] },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
            key: true,
        },
    });

    return asset?.key ? { key: asset.key } : null;
}
