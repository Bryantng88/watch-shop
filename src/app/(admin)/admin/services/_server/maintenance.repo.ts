"use server";

import { Prisma } from "@prisma/client";
import { DB, dbOrTx } from "@/server/db/client";

export async function createMany(
    tx: DB,
    data: Prisma.MaintenanceRecordCreateManyInput[]
) {
    const db = dbOrTx(tx);
    return db.maintenanceRecord.createMany({
        data,
        skipDuplicates: false,
    });
}


export async function listByServiceRequestId(tx: DB, serviceRequestId: string) {
    const db = dbOrTx(tx);

    return db.maintenanceRecord.findMany({
        where: { serviceRequestId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            createdAt: true,
            servicedAt: true,
            notes: true,
            vendorName: true,
            totalCost: true,
            billed: true,
        },
    });
}
