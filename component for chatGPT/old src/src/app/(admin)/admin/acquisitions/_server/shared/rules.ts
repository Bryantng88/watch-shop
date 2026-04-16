import { DB } from "@/server/db/client";

export async function ensureItemCanBeCancelled(
  tx: DB,
  input: {
    productId?: string | null;
    productTitle?: string | null;
  }
) {
  if (!input.productId) return;

  const linked = await tx.product.findUnique({
    where: { id: input.productId },
    select: {
      id: true,
      _count: {
        select: {
          orderItems: true,
          InvoiceItem: true,
          ServiceRequest: true,
          maintenanceRecords: true,
          Reservation: true,
        },
      },
    },
  });

  if (!linked) return;

  const blockers = [
    linked._count.orderItems > 0 ? "đơn hàng" : null,
    linked._count.InvoiceItem > 0 ? "hóa đơn" : null,
    linked._count.ServiceRequest > 0 ? "phiếu service" : null,
    linked._count.maintenanceRecords > 0 ? "maintenance log" : null,
    linked._count.Reservation > 0 ? "reservation" : null,
  ].filter(Boolean);

  if (blockers.length > 0) {
    throw new Error(
      `Không thể hủy dòng "${input.productTitle ?? "Không rõ tên"}" vì sản phẩm đã phát sinh ${blockers.join(", ")}.`
    );
  }
}