import {
    AcquisitionStatus,
    InvoiceStatus,
    OrderSource,
    OrderStatus,
    OrderVerificationStatus,
    PaymentStatus,
    ProductStatus,
    ServiceRequestStatus,
    ShipmentStatus,
} from "@prisma/client";
import { prisma } from "@/server/db/client";
import { perfStep } from "@/lib/server-perf";

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
            perfStep("sidebar-counts", "products", () =>
                prisma.product.count({ where: { status: ProductStatus.DRAFT } }),
            ),
            perfStep("sidebar-counts", "acquisitions", () =>
                prisma.acquisition.count({ where: { accquisitionStt: AcquisitionStatus.DRAFT } }),
            ),
            perfStep("sidebar-counts", "ordersWebPending", () =>
                prisma.order.count({
                    where: {
                        source: OrderSource.WEB,
                        verificationStatus: OrderVerificationStatus.PENDING,
                    },
                }),
            ),
            perfStep("sidebar-counts", "ordersNeedAction", () =>
                prisma.order.count({
                    where: {
                        source: OrderSource.ADMIN,
                        status: { in: [OrderStatus.DRAFT, OrderStatus.RESERVED] },
                        NOT: { verificationStatus: OrderVerificationStatus.PENDING },
                    },
                }),
            ),
            perfStep("sidebar-counts", "services", () =>
                prisma.serviceRequest.count({ where: { status: ServiceRequestStatus.DRAFT } }),
            ),
            perfStep("sidebar-counts", "shipments", () =>
                prisma.shipment.count({ where: { status: ShipmentStatus.DRAFT } }),
            ),
            perfStep("sidebar-counts", "invoices", () =>
                prisma.invoice.count({ where: { status: InvoiceStatus.DRAFT } }),
            ),
            perfStep("sidebar-counts", "payments", () =>
                prisma.payment.count({ where: { status: PaymentStatus.UNPAID } }),
            ),
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
