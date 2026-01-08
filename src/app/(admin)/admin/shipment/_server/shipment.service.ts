// shipment.service.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import * as shipmentRepo from "./shipment.repo";
import { ShipmentSearchInput } from "./shipment.type";

export async function getAdminShipmentList(input: ShipmentSearchInput) {
    const { page, pageSize, q, status } = input;

    const where: Prisma.ShipmentWhereInput = {
        ...(status ? { status } : {}),
        ...(q
            ? {
                OR: [
                    { refNo: { contains: q, mode: "insensitive" } },
                    { trackingNo: { contains: q, mode: "insensitive" } },
                    {
                        order: {
                            OR: [
                                { refNo: { contains: q, mode: "insensitive" } },
                                { customerName: { contains: q, mode: "insensitive" } },
                                { shipPhone: { contains: q, mode: "insensitive" } },
                            ],
                        },
                    },
                ],
            }
            : {}),
    };

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const { rows, total } = await shipmentRepo.getShipmentList(
        where,
        { createdAt: "desc" },
        skip,
        take,
        prisma
    );

    /**
     * 🔥 Map dữ liệu cho UI (giống Order)
     */
    const items = rows.map((s) => ({
        id: s.id,
        refNo: s.refNo,
        status: s.status,
        shippingFee: Number(s.shippingFee ?? 0),
        orderRefNo: s.Order?.refNo ?? null,
        customerName: s.Order?.customerName ?? "",
        shipPhone: s.Order?.shipPhone ?? "",
        shipAddress: s.Order?.shipAddress ?? "",

        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
    }));

    return {
        items,
        total,
        page,
        pageSize,
    };
}
