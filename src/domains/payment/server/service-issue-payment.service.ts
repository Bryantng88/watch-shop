import { PaymentDirection, PaymentMethod, PaymentPurpose, PaymentStatus, PaymentType } from "@prisma/client";

import { prisma } from "@/server/db/client";
import {
  COLLECTED,
  createPaymentRowTx,
  getPaymentOwnerSeedTx,
  mapPaymentListItem,
} from "./payment.core";
import { money, toNumber, toPlain, type Tx } from "./payment.utils";

export async function ensureTechnicalIssuePaymentTx(tx: Tx, technicalIssueId: string) {
  const seed = await getPaymentOwnerSeedTx(tx, "TECHNICAL_ISSUE", technicalIssueId);

  if (seed.totalDue < 0) throw new Error("Chi phí technical issue không hợp lệ.");

  const existingUnpaid = await tx.payment.findFirst({
    where: {
      technical_issue_id: technicalIssueId,
      type: PaymentType.SERVICE,
      purpose: PaymentPurpose.MAINTENANCE_COST,
      status: PaymentStatus.UNPAID,
    } as any,
    select: { id: true },
  });

  if (existingUnpaid) {
    return tx.payment.update({
      where: { id: existingUnpaid.id },
      data: {
        amount: money(seed.totalDue),
        status: PaymentStatus.UNPAID,
        paidAt: null,
        updatedAt: new Date(),
      } as any,
    });
  }

  const existingClosed = await tx.payment.findFirst({
    where: {
      technical_issue_id: technicalIssueId,
      type: PaymentType.SERVICE,
      purpose: PaymentPurpose.MAINTENANCE_COST,
      status: { in: [PaymentStatus.PAID, COLLECTED] as any },
    } as any,
    select: { id: true },
  });

  if (existingClosed) return existingClosed;

  return createPaymentRowTx(tx, {
    ownerType: "TECHNICAL_ISSUE",
    ownerId: technicalIssueId,
    amount: seed.totalDue,
    direction: PaymentDirection.OUT,
    type: PaymentType.SERVICE,
    purpose: PaymentPurpose.MAINTENANCE_COST,
    method: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.UNPAID,
    note: "Payment UNPAID tự động khi hoàn tất technical issue.",
  });
}

export async function createTechnicalIssueMaintenanceCostPaymentTx(
  tx: Tx,
  input: {
    technicalIssueId: string;
    amount: number;
    method?: string | null;
    note?: string | null;
    vendorId?: string | null;
    status?: string | null;
    purpose?: string | null;
  },
) {
  if (!Number.isFinite(input.amount) || input.amount < 0) {
    throw new Error("Chi phÃ­ technical issue khÃ´ng há»£p lá»‡.");
  }

  return createPaymentRowTx(tx, {
    ownerType: "TECHNICAL_ISSUE",
    ownerId: input.technicalIssueId,
    amount: input.amount,
    direction: PaymentDirection.OUT,
    type: PaymentType.SERVICE,
    purpose: (input.purpose ?? PaymentPurpose.MAINTENANCE_COST) as any,
    method: normalizeServiceIssuePaymentMethod(input.method),
    status: (input.status ?? PaymentStatus.UNPAID) as any,
    note: input.note ?? null,
    vendorId: input.vendorId ?? null,
  });
}

function normalizeServiceIssuePaymentMethod(value?: string | null) {
  const raw = String(value ?? "").trim().toUpperCase();
  if (raw === "CASH") return PaymentMethod.CASH;
  if (raw === "COD") return PaymentMethod.COD;
  return PaymentMethod.BANK_TRANSFER;
}

export async function listServicePaymentsByServiceRequest(serviceRequestId: string) {
  const issues = await prisma.technicalIssue.findMany({
    where: { serviceRequestId },
    select: { id: true },
  });

  const issueIds = issues.map((issue) => issue.id);
  if (issueIds.length === 0) return [];

  const rows = await prisma.payment.findMany({
    where: {
      technical_issue_id: { in: issueIds },
      type: PaymentType.SERVICE,
    } as any,
    orderBy: [{ createdAt: "asc" }],
  });

  return toPlain(rows.map(mapPaymentListItem));
}

export async function getServicePaymentSummaryByServiceRequest(serviceRequestId: string) {
  const issues = await prisma.technicalIssue.findMany({
    where: { serviceRequestId },
    select: { id: true, actualCost: true },
  });

  const issueIds = issues.map((issue) => issue.id);
  const totalDue = issues.reduce((sum, issue) => sum + toNumber(issue.actualCost), 0);

  if (issueIds.length === 0) {
    return {
      totalDue: 0,
      paidTotal: 0,
      collectedTotal: 0,
      unpaidTotal: 0,
      remaining: 0,
      depositRequired: 0,
      depositPaid: 0,
    };
  }

  const [paid, collected, unpaid] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        technical_issue_id: { in: issueIds },
        type: PaymentType.SERVICE,
        direction: PaymentDirection.OUT,
        status: PaymentStatus.PAID,
      } as any,
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        technical_issue_id: { in: issueIds },
        type: PaymentType.SERVICE,
        direction: PaymentDirection.OUT,
        status: COLLECTED,
      } as any,
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        technical_issue_id: { in: issueIds },
        type: PaymentType.SERVICE,
        direction: PaymentDirection.OUT,
        status: PaymentStatus.UNPAID,
      } as any,
      _sum: { amount: true },
    }),
  ]);

  const paidTotal = toNumber(paid._sum.amount);
  const collectedTotal = toNumber(collected._sum.amount);
  const unpaidTotal = toNumber(unpaid._sum.amount);

  return toPlain({
    totalDue,
    paidTotal,
    collectedTotal,
    unpaidTotal,
    remaining: Math.max(0, totalDue - paidTotal),
    depositRequired: 0,
    depositPaid: 0,
  });
}

// Backward-compatible alias cho route cũ đang dùng /service-requests/[id]/payment
export const listServicePayments = listServicePaymentsByServiceRequest;
export const getServicePaymentSummary = getServicePaymentSummaryByServiceRequest;

// Legacy name chỉ để không vỡ import cũ. Không tạo payment theo SR nữa.
export async function ensureServiceRequestPaymentTx(tx: Tx, serviceRequestId: string) {
  const doneIssues = await tx.technicalIssue.findMany({
    where: {
      serviceRequestId,
      executionStatus: "DONE" as any,
      actualCost: { not: null },
    } as any,
    select: { id: true },
  });

  const rows = [];
  for (const issue of doneIssues) {
    rows.push(await ensureTechnicalIssuePaymentTx(tx, issue.id));
  }
  return rows;
}
