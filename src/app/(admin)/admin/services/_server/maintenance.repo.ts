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
