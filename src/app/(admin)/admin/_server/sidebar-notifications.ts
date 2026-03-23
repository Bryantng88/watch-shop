import {
    AcquisitionStatus,
    InvoiceStatus,
    OrderSource,
    OrderStatus,
    OrderVerificationStatus,
    PaymentStatus,
    ProductStatus,
    ServiceRequestStatus,
} from "@prisma/client";
import { prisma } from "@/server/db/client";

export type SideMenuNotificationCounts = {
    products: number;
    acquisitions: number;
    orders: number;
    services: number;
    shipments: number;
    invoices: number;
    payments: number;
};

export async function getSideMenuNotificationCounts(): Promise<SideMenuNotificationCounts> {
    const [products, acquisitions, ordersWebPending, ordersNeedAction, services, shipments, invoices, payments] =
        await Promise.all([
            prisma.product.count({ where: { status: ProductStatus.DRAFT } }),
            prisma.acquisition.count({ where: { accquisitionStt: AcquisitionStatus.DRAFT } }),
            prisma.order.count({
                where: {
                    source: OrderSource.WEB,
                    verificationStatus: OrderVerificationStatus.PENDING,
                },
            }),
            prisma.order.count({
                where: {
                    source: OrderSource.ADMIN,
                    status: { in: [OrderStatus.DRAFT, OrderStatus.RESERVED] },
                    NOT: { verificationStatus: OrderVerificationStatus.PENDING },
                },
            }),
            prisma.serviceRequest.count({ where: { status: ServiceRequestStatus.DRAFT } }),
            prisma.shipment.count({ where: { status: "DRAFT" as any } }),
            prisma.invoice.count({ where: { status: InvoiceStatus.DRAFT } }),
            prisma.payment.count({ where: { status: PaymentStatus.UNPAID } }),
        ]);

    return {
        products,
        acquisitions,
        orders: ordersWebPending + ordersNeedAction,
        services,
        shipments,
        invoices,
        payments,
    };
}
