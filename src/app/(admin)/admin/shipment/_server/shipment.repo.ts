import { Prisma } from "@prisma/client";
import { prisma, DB, dbOrTx } from "@/server/db/client";

export type ShipmentListRow = {
    id: string;
    status: string;

    trackingCode: string | null;
    shippingFee: Prisma.Decimal | null;

    createdAt: Date;

    Order: {
        id: string;
        refNo: string | null;
        customerName: string | null;
        shipPhone: string;
        shipAddress: string;
    } | null;
};


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



// shipment.repo.ts

export async function getShipmentList(
    where: Prisma.ShipmentWhereInput,
    orderBy: Prisma.ShipmentOrderByWithRelationInput,
    skip: number,
    take: number,
    tx: DB
) {
    const db = dbOrTx(tx);
    const [rows, total] = await Promise.all([
        db.shipment.findMany({
            where,
            orderBy,
            skip,
            take,
            include: {
                Order: {
                    select: {
                        refNo: true,
                        customerName: true,
                        shipPhone: true,
                        shipAddress: true,
                    },
                },
            },

        }),
        prisma.shipment.count({ where }),
    ]);

    return { rows, total };
}



export async function findShipmentsByIds(
    tx: DB,
    ids: string[]
) {
    const db = dbOrTx(tx);

    return db.shipment.findMany({
        where: { id: { in: ids } },
        select: {
            id: true,
            status: true,
            orderId: true, // nếu bạn cần
        },
    });
}

export async function bulkMarkReady(
    tx: DB,
    shipmentIds: string[]
) {
    const db = dbOrTx(tx);

    // chỉ update các shipment đang DRAFT
    return db.shipment.updateMany({
        where: {
            id: { in: shipmentIds },
            status: "DRAFT",
        },
        data: {
            status: "READY",
            updatedAt: new Date(),
        },
    });
}
