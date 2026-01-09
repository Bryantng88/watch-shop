// shipment.service.ts
import { Prisma, shipmentstatus } from "@prisma/client";
import { prisma } from "@/server/db/client";
import * as shipmentRepo from "./shipment.repo";
import { ShipmentSearchInput } from "./shipment.type";

export async function getAdminShipmentList(input: ShipmentSearchInput) {
    const { page, pageSize, q, status } = input;

    // parse status string -> enum (để Prisma nhận đúng type)
    const statusEnum: shipmentstatus | undefined =
        status && Object.values(shipmentstatus).includes(status as shipmentstatus)
            ? (status as shipmentstatus)
            : undefined;

    // ✅ giống format Order: q ? { OR: [...] } : {}
    const baseWhere: Prisma.ShipmentWhereInput = q
        ? {
            OR: [
                { refNo: { contains: q, mode: "insensitive" } },
                { shipPhone: { contains: q, mode: "insensitive" } },
                { carrier: { contains: q, mode: "insensitive" } },
                { trackingCode: { contains: q, mode: "insensitive" } },
                { notes: { contains: q, mode: "insensitive" } },
                // orderId là uuid/string → chỉ search "contains" được nếu bạn lưu dạng string
                { orderId: { contains: q, mode: "insensitive" } },
            ],
        }
        : {};

    const where: Prisma.ShipmentWhereInput = statusEnum
        ? { ...baseWhere, status: statusEnum }
        : baseWhere;

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
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,

        orderId: s.orderId, // thay cho orderRefNo
        shipPhone: s.shipPhone,
        shipAddress: s.shipAddress,
        shipCity: s.shipCity,
        shipDistrict: s.shipDistrict,
        shipWard: s.shipWard,

        carrier: s.carrier,
        trackingCode: s.trackingCode, // thay cho trackingNo
        shippingFee: s.shippingFee,   // Decimal (serialize ở page.tsx giống Order)
        currency: s.currency,

        shippedAt: s.shippedAt,
        deliveredAt: s.deliveredAt,
        notes: s.notes,
    }));

    return { items, total, page, pageSize };
}
