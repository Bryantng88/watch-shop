import { PaymentDirection, PaymentMethod } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { getPaymentOwnerSeedTx, createPaymentRowTx, getPaymentSummary, listPayments } from "./payment.core";
import type { Tx } from "./payment.utils";

export async function createInitialPaymentForAcquisitionTx(tx: Tx, acquisitionId: string) {
  const seed = await getPaymentOwnerSeedTx(tx, "ACQUISITION", acquisitionId);

  if (seed.totalDue <= 0) {
    throw new Error("Không thể tạo payment cho phiếu nhập có tổng giá trị bằng 0.");
  }

  const existing = await tx.payment.findFirst({
    where: {
      acquisition_id: acquisitionId,
      type: "ACQUISITION" as any,
      purpose: "ACQUISITION_FULL" as any,
    },
    select: { id: true },
  });

  if (existing) return existing;

  return createPaymentRowTx(tx, {
    ownerType: "ACQUISITION",
    ownerId: acquisitionId,
    amount: seed.totalDue,
    direction: PaymentDirection.OUT,
    type: "ACQUISITION" as any,
    purpose: "ACQUISITION_FULL" as any,
    method: PaymentMethod.BANK_TRANSFER,
    note: "Payment mặc định cho phiếu nhập.",
  });
}

export async function listAcquisitionPayments(acquisitionId: string) {
  return listPayments("ACQUISITION", acquisitionId);
}

export async function getAcquisitionPaymentSummary(acquisitionId: string) {
  return getPaymentSummary("ACQUISITION", acquisitionId);
}
