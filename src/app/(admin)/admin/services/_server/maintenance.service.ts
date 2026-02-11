"use server";

import { prisma } from "@/server/db/client";
import * as maintenanceRepo from "./maintenance.repo";

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_k, v) => {
            if (v instanceof Date) return v.toISOString();
            // Prisma Decimal
            if (typeof v === "object" && v?._isDecimal) return Number(v);
            return v;
        })
    );
}

export async function getMaintenanceLogsByServiceRequest(serviceRequestId: string) {
    const id = String(serviceRequestId || "").trim();
    if (!id) throw new Error("Missing serviceRequestId");

    const rows = await maintenanceRepo.listByServiceRequestId(prisma, id);
    return serialize(rows);
}
