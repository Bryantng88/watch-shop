import { Prisma } from "@prisma/client";
import * as shipRepo from "./shipment.repo"

export async function createFromOrder(
    tx: Prisma.TransactionClient,
    order: any
) {
    return shipRepo.createShipment(tx, {
        orderId: order.id,
        shipPhone: order.shipPhone ?? null,
        shipAddress: order.shipAddress ?? null,
        shipCity: order.shipCity ?? null,
        shipDistrict: order.shipDistrict ?? null,
        shipWard: order.shipWard ?? null,
    });
}
