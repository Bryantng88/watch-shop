import { PaymentStatus, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const apply = process.argv.includes("--apply");
  const duplicates = await prisma.watch.findMany({
    where: { duplicateConfirmedAt: { not: null } },
    orderBy: [{ duplicateConfirmedAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      productId: true,
      acquisitionId: true,
      duplicateConfirmedAt: true,
      product: {
        select: {
          title: true,
          sku: true,
          acquisitionItem: {
            select: {
              id: true,
              acquisitionId: true,
              quantity: true,
              unitCost: true,
              status: true,
            },
          },
          orderItem: {
            select: {
              id: true,
              orderId: true,
              title: true,
              order: { select: { status: true, refNo: true } },
            },
          },
          invoiceItem: {
            select: {
              id: true,
              title: true,
              Invoice: { select: { status: true, code: true } },
            },
          },
          reservation: { select: { id: true } },
          serviceRequest: {
            select: { id: true, refNo: true, status: true, orderItemId: true },
          },
          maintenanceRecord: { select: { id: true } },
          purchaseRequestItem: {
            select: { id: true, purchaseRequestId: true, decision: true },
          },
        },
      },
      tasks: { select: { id: true } },
      workCases: { select: { id: true } },
      strapInstallations: { select: { id: true } },
    },
  });

  const acquisitionIds = [...new Set(duplicates.flatMap((row) =>
    row.product.acquisitionItem.map((item) => item.acquisitionId),
  ))];
  const acquisitions = acquisitionIds.length
    ? await prisma.acquisition.findMany({
        where: { id: { in: acquisitionIds } },
        select: {
          id: true,
          refNo: true,
          totalAmount: true,
          accquisitionStt: true,
          acquisitionItem: {
            select: { id: true, productId: true, quantity: true, unitCost: true },
          },
        },
      })
    : [];
  const payments = acquisitionIds.length
    ? await prisma.payment.findMany({
        where: { acquisition_id: { in: acquisitionIds } },
        orderBy: [{ acquisition_id: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          acquisition_id: true,
          refNo: true,
          amount: true,
          status: true,
          direction: true,
          purpose: true,
        },
      })
    : [];

  const report = {
    duplicateCount: duplicates.length,
    duplicates: duplicates.map((row) => ({
      watchId: row.id,
      productId: row.productId,
      title: row.product.title,
      sku: row.product.sku,
      duplicateConfirmedAt: row.duplicateConfirmedAt,
      acquisitionItems: row.product.acquisitionItem.map((item) => ({
        ...item,
        unitCost: Number(item.unitCost ?? 0),
      })),
      dependencies: {
        orderItems: row.product.orderItem,
        invoiceItems: row.product.invoiceItem,
        reservations: row.product.reservation.length,
        serviceRequests: row.product.serviceRequest,
        maintenanceRecords: row.product.maintenanceRecord.length,
        purchaseRequestItems: row.product.purchaseRequestItem,
        tasks: row.tasks.length,
        workCases: row.workCases.length,
        strapInstallations: row.strapInstallations.length,
      },
    })),
    acquisitions: acquisitions.map((row) => ({
      ...row,
      totalAmount: Number(row.totalAmount ?? 0),
      acquisitionItem: row.acquisitionItem.map((item) => ({
        ...item,
        unitCost: Number(item.unitCost ?? 0),
      })),
    })),
    payments: payments.map((row) => ({ ...row, amount: Number(row.amount) })),
  };

  console.log(JSON.stringify(report, null, 2));
  if (!apply) return;

  if (duplicates.length !== 18) {
    throw new Error(`Safety check failed: expected 18 duplicate watches, found ${duplicates.length}.`);
  }

  const productIds = duplicates.map((row) => row.productId);
  const watchIds = duplicates.map((row) => row.id);
  const acquisitionItemIds = duplicates.flatMap((row) =>
    row.product.acquisitionItem.map((item) => item.id),
  );
  const auditNote = "Điều chỉnh 10/08/2026: loại Watch đã xác nhận trùng khỏi phiếu nhập.";

  const result = await prisma.$transaction(async (tx) => {
    const variants = await tx.productVariant.findMany({
      where: { productId: { in: productIds } },
      select: { id: true },
    });
    const variantIds = variants.map((row) => row.id);

    await tx.orderItem.updateMany({
      where: { OR: [{ productId: { in: productIds } }, { variantId: { in: variantIds } }] },
      data: { productId: null, variantId: null },
    });
    await tx.invoiceItem.updateMany({
      where: { OR: [{ productId: { in: productIds } }, { variantId: { in: variantIds } }] },
      data: { productId: null, variantId: null, updatedAt: new Date() },
    });
    await tx.serviceRequest.updateMany({
      where: { OR: [{ productId: { in: productIds } }, { variantId: { in: variantIds } }] },
      data: { productId: null, variantId: null },
    });
    await tx.maintenanceRecord.updateMany({
      where: { OR: [{ productId: { in: productIds } }, { variantId: { in: variantIds } }] },
      data: { productId: null, variantId: null, updatedAt: new Date() },
    });
    await tx.reservation.deleteMany({ where: { productId: { in: productIds } } });
    await tx.purchaseRequestItem.deleteMany({ where: { productId: { in: productIds } } });

    const deletedItems = await tx.acquisitionItem.deleteMany({
      where: { id: { in: acquisitionItemIds } },
    });

    const paymentChanges: Array<{
      acquisitionId: string;
      oldTotal: number;
      newTotal: number;
      paymentId: string;
      oldAmount: number;
      newAmount: number;
      oldStatus: string;
      newStatus: string;
    }> = [];

    for (const acquisitionId of acquisitionIds) {
      const acquisition = await tx.acquisition.findUniqueOrThrow({
        where: { id: acquisitionId },
        select: { totalAmount: true },
      });
      const remaining = await tx.acquisitionItem.findMany({
        where: { acquisitionId },
        select: { quantity: true, unitCost: true },
      });
      const newTotal = remaining.reduce(
        (sum, item) => sum + item.quantity * Number(item.unitCost ?? 0),
        0,
      );
      await tx.acquisition.update({
        where: { id: acquisitionId },
        data: { totalAmount: new Prisma.Decimal(newTotal) },
      });

      const activePayments = await tx.payment.findMany({
        where: {
          acquisition_id: acquisitionId,
          direction: "OUT",
          status: { in: [PaymentStatus.UNPAID, PaymentStatus.PAID, PaymentStatus.COLLECTED] },
        },
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      });
      let excess = Math.max(
        0,
        activePayments.reduce((sum, payment) => sum + Number(payment.amount), 0) - newTotal,
      );
      for (const payment of activePayments) {
        if (excess <= 0) break;
        const oldAmount = Number(payment.amount);
        const reduction = Math.min(oldAmount, excess);
        const newAmount = oldAmount - reduction;
        const newStatus = newAmount === 0 ? PaymentStatus.CANCELED : payment.status;
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            amount: new Prisma.Decimal(newAmount),
            status: newStatus,
            note: [payment.note, `${auditNote} Giảm ${reduction.toLocaleString("vi-VN")} VND.`]
              .filter(Boolean)
              .join("\n"),
            updatedAt: new Date(),
          },
        });
        paymentChanges.push({
          acquisitionId,
          oldTotal: Number(acquisition.totalAmount ?? 0),
          newTotal,
          paymentId: payment.id,
          oldAmount,
          newAmount,
          oldStatus: payment.status,
          newStatus,
        });
        excess -= reduction;
      }
      if (excess > 0) {
        throw new Error(`Cannot reconcile acquisition ${acquisitionId}; remaining excess ${excess}.`);
      }
    }

    await tx.projectionRecord.deleteMany({
      where: { entityId: { in: [...watchIds, ...productIds] } },
    });
    const deletedProducts = await tx.product.deleteMany({
      where: { id: { in: productIds } },
    });
    if (deletedProducts.count !== duplicates.length) {
      throw new Error(`Safety check failed: deleted ${deletedProducts.count}/${duplicates.length} products.`);
    }

    return {
      deletedWatches: duplicates.length,
      deletedProducts: deletedProducts.count,
      deletedAcquisitionItems: deletedItems.count,
      updatedAcquisitions: acquisitionIds.length,
      paymentChanges,
    };
  }, { timeout: 60_000 });

  console.log(JSON.stringify({ applied: true, ...result }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
