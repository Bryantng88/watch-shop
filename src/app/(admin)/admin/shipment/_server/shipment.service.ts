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

export async function createFromOrder(orderId: string) {
    // 1) lấy order để copy info
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
            id: true,
            refNo: true,
            customerName: true,
            shipPhone: true,
            shipAddress: true,
            shipCity: true,
            shipDistrict: true,
            shipWard: true,
            //currency: true,
            // tuỳ schema order của bạn
            // shippingFee: true,
        },
    });

    if (!order) throw new Error("Order không tồn tại");

    // 2) tạo shipment (nếu cần chặn trùng do orderId unique)
    //    nếu bạn muốn: check trước để tránh crash unique constraint
    const existed = await prisma.shipment.findUnique({
        where: { orderId: orderId },
        select: { id: true },
    });
    if (existed) {
        throw new Error("Order đã có shipment");
    }

    // 3) tạo
    return shipmentRepo.createShipment(prisma as any, {
        orderId: orderId,
        shipPhone: order.shipPhone ?? null,
        shipAddress: order.shipAddress ?? null,
        shipCity: order.shipCity ?? null,
        shipDistrict: order.shipDistrict ?? null,
        shipWard: order.shipWard ?? null,
    });
}


function uniq(xs: string[]) {
    return Array.from(new Set(xs));
}

export async function bulkReadyShipments(input: { shipmentIds: string[] }) {
    const shipmentIds = uniq((input.shipmentIds || []).filter(Boolean));

    if (shipmentIds.length === 0) {
        throw new Error("shipmentIds rỗng");
    }

    return prisma.$transaction(async (tx) => {
        // 1) check tồn tại
        const rows = await shipmentRepo.findShipmentsByIds(tx, shipmentIds);

        if (rows.length !== shipmentIds.length) {
            const found = new Set(rows.map((x) => x.id));
            const missing = shipmentIds.filter((id) => !found.has(id));
            throw new Error(`Shipment không tồn tại: ${missing.join(", ")}`);
        }

        // 2) chỉ cho duyệt DRAFT
        const notDraft = rows.filter((x) => x.status !== "DRAFT");
        if (notDraft.length > 0) {
            throw new Error(
                `Chỉ duyệt shipment DRAFT. Các shipment không hợp lệ: ${notDraft
                    .map((x) => `${x.id}(${x.status})`)
                    .join(", ")}`
            );
        }

        // 3) update DRAFT -> READY
        const result = await shipmentRepo.bulkMarkReady(tx, shipmentIds);

        return {
            updated: result.count,
            shipmentIds,
        };
    });
}
