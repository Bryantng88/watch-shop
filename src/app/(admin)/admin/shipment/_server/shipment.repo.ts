import { Prisma } from "@prisma/client";
import { DB, dbOrTx } from "@/server/db/client";



export function createShipment(
    tx: DB,
    data: {
        orderId: string;
        shipPhone?: string | null;
        shipAddress?: string | null;
        shipCity?: string | null;
        shipDistrict?: string | null;
        shipWard?: string | null;
    }
) {
    const db = dbOrTx(tx);
    return db.shipment.create({ data });
}
