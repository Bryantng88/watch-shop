import type { Prisma, PrismaClient } from "@prisma/client";
import { MaintenanceEventType, ServiceRequestStatus } from "@prisma/client";
import { prisma, DB, dbOrTx } from "@/server/db/client";

//export type DB = PrismaClient | Prisma.TransactionClient;

/** =========================
 *  READ: panel data (SR + logs)
 * ========================= */
export async function getPanelByServiceRequestId(tx: DB, serviceRequestId: string) {
    const db = dbOrTx(tx);

    const sr = await db.serviceRequest.findUnique({
        where: { id: serviceRequestId },
        select: {
            id: true,
            refNo: true,
            status: true,
            scope: true,
            notes: true,
            createdAt: true,
            updatedAt: true,

            vendorId: true,
            vendorNameSnap: true,

            productId: true,
            product: { select: { id: true, title: true } },

            // nếu bạn có relation Vendor
            Vendor: { select: { id: true, name: true } },

            // count logs
            _count: { select: { maintenance: true } },
        },
    });

    if (!sr) return null;

    const logs = await db.maintenanceRecord.findMany({
        where: { serviceRequestId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            eventType: true,

            vendorId: true,
            vendorName: true,
            prevVendorId: true,
            prevVendorName: true,

            notes: true,
            totalCost: true,
            currency: true,

            servicedAt: true,
            createdAt: true,

            paymentId: true,
            paidAmount: true,
            paidAt: true,
        },
    });

    return {
        sr: {
            ...sr,
            maintenanceCount: sr._count.maintenance,
        },
        logs,
    };
}

/** =========================
 *  CREATE: add maintenance log
 *  (optionally attach payment fields if you already create payment elsewhere)
 * ========================= */
export type CreateMaintenanceLogInput = {
    serviceRequestId: string;

    eventType: MaintenanceEventType;

    vendorId?: string | null;
    vendorName?: string | null;

    prevVendorId?: string | null;
    prevVendorName?: string | null;

    notes?: string | null;
    servicedAt?: Date | null;

    totalCost?: Prisma.Decimal | number | string | null;
    currency?: string; // default "VND"

    paymentId?: string | null;
    paidAmount?: Prisma.Decimal | number | string | null;
    paidAt?: Date | null;

    // snapshot cho product/variant nếu bạn muốn
    productId?: string | null;
    variantId?: string | null;
    brandSnapshot?: string | null;
    modelSnapshot?: string | null;
    refSnapshot?: string | null;
    serialSnapshot?: string | null;
};

export async function createLog(tx: DB, input: CreateMaintenanceLogInput) {
    const db = dbOrTx(tx);

    return db.maintenanceRecord.create({
        data: {
            serviceRequestId: input.serviceRequestId,

            eventType: input.eventType,

            vendorId: input.vendorId ?? null,
            vendorName: input.vendorName ?? null,

            prevVendorId: input.prevVendorId ?? null,
            prevVendorName: input.prevVendorName ?? null,

            notes: input.notes ?? null,
            servicedAt: input.servicedAt ?? null,

            totalCost: (input.totalCost as any) ?? null,
            currency: input.currency ?? "VND",

            paymentId: input.paymentId ?? null,
            paidAmount: (input.paidAmount as any) ?? null,
            paidAt: input.paidAt ?? null,

            productId: input.productId ?? null,
            variantId: input.variantId ?? null,

            brandSnapshot: input.brandSnapshot ?? null,
            modelSnapshot: input.modelSnapshot ?? null,
            refSnapshot: input.refSnapshot ?? null,
            serialSnapshot: input.serialSnapshot ?? null,
        },
    });
}

/** =========================
 *  WRITE: assign/change vendor for ONE SR
 *  - update SR vendor + status IN_PROGRESS + updatedAt
 *  - create maintenance log (ASSIGN_VENDOR / CHANGE_VENDOR)
 * ========================= */
export async function assignVendorOne(
    tx: DB,
    args: {
        serviceRequestId: string;
        vendorId: string;
        vendorName: string;
        reason?: string | null;
        setInProgress?: boolean;
    }
) {
    const db = dbOrTx(tx);

    const sr = await db.serviceRequest.findUnique({
        where: { id: args.serviceRequestId },
        select: {
            id: true,
            status: true,
            vendorId: true,
            vendorNameSnap: true,

            productId: true,
            variantId: true,
            brandSnapshot: true,
            modelSnapshot: true,
            refSnapshot: true,
            serialSnapshot: true,
        },
    });

    if (!sr) throw new Error("ServiceRequest not found");

    const prevVendorId = sr.vendorId ?? null;
    const prevVendorName = sr.vendorNameSnap ?? null;
    const isChange = !!prevVendorId && prevVendorId !== args.vendorId;

    // 1) update SR (không set undefined)
    await db.serviceRequest.update({
        where: { id: sr.id },
        data: {
            vendorId: args.vendorId,
            vendorNameSnap: args.vendorName,
            ...(args.setInProgress === false ? {} : { status: ServiceRequestStatus.IN_PROGRESS }),
            updatedAt: new Date(),
        },
    });

    // 2) create maintenance log (1 log, notes gộp)
    const base = isChange
        ? `Change vendor: ${prevVendorName ?? "-"} → ${args.vendorName}`
        : `Assign vendor: ${args.vendorName}`;

    const mergedNotes =
        args.reason && String(args.reason).trim()
            ? `${base}\n${String(args.reason).trim()}`
            : base;

    await createLog(db, {
        serviceRequestId: sr.id,
        eventType: isChange ? MaintenanceEventType.CHANGE_VENDOR : MaintenanceEventType.ASSIGN_VENDOR,

        vendorId: args.vendorId,
        vendorName: args.vendorName,

        prevVendorId,
        prevVendorName,

        notes: mergedNotes,

        productId: sr.productId ?? null,
        variantId: sr.variantId ?? null,
        brandSnapshot: sr.brandSnapshot ?? null,
        modelSnapshot: sr.modelSnapshot ?? null,
        refSnapshot: sr.refSnapshot ?? null,
        serialSnapshot: sr.serialSnapshot ?? null,
    });

    return { ok: true };
}
/** =========================
 *  WRITE: bulk assign vendor
 *  - updateMany SR
 *  - createMany maintenance logs (one per SR)
 * ========================= */
export async function bulkAssignVendor(
    tx: DB,
    args: {
        ids: string[];
        vendorId: string;
        vendorName: string;

        onlyFromDraft?: boolean; // default false
        setInProgress?: boolean; // default true
    }
) {
    const db = dbOrTx(tx);

    const ids = Array.from(new Set(args.ids.map((x) => String(x).trim()).filter(Boolean)));
    if (!ids.length) return { updatedCount: 0, createdLogs: 0 };

    // load SRs to build logs with prevVendor + snapshots
    const rows = await db.serviceRequest.findMany({
        where: {
            id: { in: ids },
            ...(args.onlyFromDraft ? { status: ServiceRequestStatus.DRAFT } : {}),
        },
        select: {
            id: true,
            status: true,
            vendorId: true,
            vendorNameSnap: true,

            productId: true,
            variantId: true,
            brandSnapshot: true,
            modelSnapshot: true,
            refSnapshot: true,
            serialSnapshot: true,
        },
    });

    if (!rows.length) return { updatedCount: 0, createdLogs: 0 };

    // 1) updateMany SR
    const updated = await db.serviceRequest.updateMany({
        where: { id: { in: rows.map((r) => r.id) } },
        data: {
            vendorId: args.vendorId,
            vendorNameSnap: args.vendorName,
            status: args.setInProgress === false ? undefined : ServiceRequestStatus.IN_PROGRESS,
            updatedAt: new Date(),
        },
    });

    // 2) createMany logs
    const now = new Date();

    const createData: Prisma.MaintenanceRecordCreateManyInput[] = rows.map((r) => {
        const prevVendorId = r.vendorId ?? null;
        const prevVendorName = r.vendorNameSnap ?? null;
        const isChange = !!prevVendorId && prevVendorId !== args.vendorId;

        return {
            serviceRequestId: r.id,
            eventType: isChange ? MaintenanceEventType.CHANGE_VENDOR : MaintenanceEventType.ASSIGN_VENDOR,

            vendorId: args.vendorId,
            vendorName: args.vendorName,

            prevVendorId,
            prevVendorName,

            notes: isChange
                ? `Change vendor: ${prevVendorName ?? "-"} → ${args.vendorName}`
                : `Assign vendor: ${args.vendorName}`,

            createdAt: now,

            productId: r.productId ?? null,
            variantId: r.variantId ?? null,
            brandSnapshot: r.brandSnapshot ?? null,
            modelSnapshot: r.modelSnapshot ?? null,
            refSnapshot: r.refSnapshot ?? null,
            serialSnapshot: r.serialSnapshot ?? null,
        };
    });

    const created = await db.maintenanceRecord.createMany({
        data: createData,
        skipDuplicates: false,
    });

    return { updatedCount: updated.count, createdLogs: created.count };
}
