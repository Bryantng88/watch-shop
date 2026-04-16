import { Prisma, shipmentstatus } from "@prisma/client";
import { prisma } from "@/server/db/client";
import * as shipmentRepo from "./shipment.repo";
import * as paymentRepo from "../../payments/_server/payment.repo";
import * as orderRepo from "../../orders/_servers/order.repo";
import * as productRepo from "../../products/_server/product.repo";

import { ShipmentSearchInput, ShipmentViewKey } from "./shipment.type";

export type OrderForShipment = {
    id: string;
    orderRefNo: string | null;
    customerName: string | null;
    shipPhone: string | null;
    shipAddress: string | null;
    shipCity?: string | null;
    shipDistrict?: string | null;
    shipWard?: string | null;
};

export async function createFromOrderTx(
    tx: Prisma.TransactionClient,
    order: OrderForShipment
) {
    if (!order?.id) throw new Error("Missing order.id");

    const existed = await tx.shipment.findUnique({
        where: { orderId: order.id },
        select: { id: true },
    });

    if (existed) {
        throw new Error("Order đã có shipment");
    }

    return tx.shipment.create({
        data: {
            orderId: order.id,
            orderRefNo: order.orderRefNo ?? null,
            customerName: order.customerName ?? "",
            shipPhone: order.shipPhone ?? "",
            shipAddress: order.shipAddress ?? "",
            shipCity: order.shipCity ?? null,
            shipDistrict: order.shipDistrict ?? null,
            shipWard: order.shipWard ?? null,
            status: "DRAFT",
            shippingFee: 0,
        },
    });
}

export async function createFromOrder(orderId: string) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
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
            },
        });

        if (!order) throw new Error("Order không tồn tại");

        return createFromOrderTx(tx, order);
    });
}

function viewToStatus(view?: ShipmentViewKey): shipmentstatus | undefined {
    switch (view) {
        case "draft":
            return "DRAFT";
        case "ready":
            return "READY";
        case "shipped":
            return "SHIPPED";
        case "delivered":
            return "DELIVERED";
        case "cancelled":
            return "CANCELLED";
        case "all":
        default:
            return undefined;
    }
}

export async function getAdminShipmentList(input: ShipmentSearchInput) {
    const { page, pageSize, q, status, view } = input;

    const explicitStatus: shipmentstatus | undefined =
        status && Object.values(shipmentstatus).includes(status as shipmentstatus)
            ? (status as shipmentstatus)
            : undefined;

    const effectiveStatus = explicitStatus ?? viewToStatus(view);

    const baseWhere: Prisma.ShipmentWhereInput = q
        ? {
            OR: [
                { refNo: { contains: q, mode: "insensitive" } },
                { shipPhone: { contains: q, mode: "insensitive" } },
                { customerName: { contains: q, mode: "insensitive" } },
                { carrier: { contains: q, mode: "insensitive" } },
                { trackingCode: { contains: q, mode: "insensitive" } },
                { notes: { contains: q, mode: "insensitive" } },
                { orderId: { contains: q, mode: "insensitive" } },
                { orderRefNo: { contains: q, mode: "insensitive" } },
            ],
        }
        : {};

    const where: Prisma.ShipmentWhereInput = effectiveStatus
        ? { ...baseWhere, status: effectiveStatus }
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

    const [cAll, cDraft, cReady, cShipped, cDelivered, cCancelled] = await Promise.all([
        prisma.shipment.count({ where: baseWhere }),
        prisma.shipment.count({ where: { ...baseWhere, status: "DRAFT" } }),
        prisma.shipment.count({ where: { ...baseWhere, status: "READY" } }),
        prisma.shipment.count({ where: { ...baseWhere, status: "SHIPPED" } }),
        prisma.shipment.count({ where: { ...baseWhere, status: "DELIVERED" } }),
        prisma.shipment.count({ where: { ...baseWhere, status: "CANCELLED" } }),
    ]);

    const items = rows.map((s) => ({
        id: s.id,
        refNo: s.refNo,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        orderId: s.orderId,
        orderRefNo: s.orderRefNo ?? s.Order?.refNo ?? null,
        customerName: s.customerName ?? s.Order?.customerName ?? "",
        shipPhone: s.shipPhone ?? s.Order?.shipPhone ?? "",
        shipAddress: s.shipAddress ?? s.Order?.shipAddress ?? "",
        carrier: s.carrier,
        trackingNo: s.trackingCode,
        shippingFee: s.shippingFee == null ? null : Number(s.shippingFee),
        currency: s.currency ?? "VND",
        shippedAt: s.shippedAt,
        deliveredAt: s.deliveredAt,
        notes: s.notes,
    }));

    return {
        items,
        total,
        counts: {
            all: cAll,
            draft: cDraft,
            ready: cReady,
            shipped: cShipped,
            delivered: cDelivered,
            cancelled: cCancelled,
        },
        page,
        pageSize,
    };
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
        const rows = await shipmentRepo.findShipmentsByIds(tx, shipmentIds);

        if (rows.length !== shipmentIds.length) {
            const found = new Set(rows.map((x) => x.id));
            const missing = shipmentIds.filter((id) => !found.has(id));
            throw new Error(`Shipment không tồn tại: ${missing.join(", ")}`);
        }

        const notDraft = rows.filter((x) => x.status !== "DRAFT");
        if (notDraft.length > 0) {
            throw new Error(
                `Chỉ duyệt shipment DRAFT. Các shipment không hợp lệ: ${notDraft
                    .map((x) => `${x.id}(${x.status})`)
                    .join(", ")}`
            );
        }

        const result = await shipmentRepo.bulkMarkReady(tx, shipmentIds);

        return {
            updated: result.count,
            shipmentIds,
        };
    });
}

export async function markShipmentShipped(input: { shipmentId: string; shippingFee: number }) {
    const { shipmentId, shippingFee } = input;

    await prisma.$transaction(async (tx) => {
        const s = await shipmentRepo.getById(shipmentId, tx);
        if (!s) throw new Error("Shipment not found");

        if (s.status !== "READY") {
            throw new Error(`Shipment must be READY to mark SHIPPED (current=${s.status})`);
        }

        await shipmentRepo.updateShipmentStt(
            shipmentId,
            {
                status: "SHIPPED",
                shippingFee,
                shippedAt: new Date(),
            },
            tx
        );
    });
}

// ... giữ nguyên phần còn lại của file nếu bạn còn logic khác bên dưới ...