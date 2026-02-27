"use server";

import { prisma } from "@/server/db/client";
import * as maintenanceRepo from "./maintenance.repo";
import { MaintenanceEventType, Prisma } from "@prisma/client";
import { createPayment } from "../../payments/_server/payment.repo";


type CreateMaintenanceLogInput = {
  serviceRequestId: string;

  // optional: nếu không truyền thì lấy vendor hiện tại của SR
  vendorId?: string | null;

  notes?: string | null;
  servicedAt?: Date | null;

  // money fields (optional)
  totalCost?: number | null;
  currency?: string | null;

  // nếu bạn dùng flow invoice/billed
  billed?: boolean;
  invoiceId?: string | null;

  // nếu bạn đã bổ sung payment fields vào maintenanceRecord
  paymentId?: string | null;
  paidAmount?: number | null;
  paidAt?: Date | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  paymentType?: string | null;
  paymentPurpose?: string | null;
};
type AssignVendorInput = {
  serviceRequestId: string;
  vendorId: string;
  reason?: string | null;
  setInProgress?: boolean;
};

function serialize(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_k, v) => {
      if (v instanceof Date) return v.toISOString();
      // Prisma Decimal
      if (typeof v === "object" && v?._isDecimal) return Number(v);
      return v;
    })
  );
}

/** Panel: SR + logs + count (UI cần vendor hiện tại + timeline) */
export async function getMaintenancePanelByServiceRequest(serviceRequestId: string) {
  const id = String(serviceRequestId || "").trim();
  if (!id) throw new Error("Missing serviceRequestId");

  const panel = await maintenanceRepo.getPanelByServiceRequestId(prisma, id);
  return serialize(panel);
}

/** Only logs */
export async function getMaintenanceLogsByServiceRequest(serviceRequestId: string) {
  const id = String(serviceRequestId || "").trim();
  if (!id) throw new Error("Missing serviceRequestId");

  const panel = await maintenanceRepo.getPanelByServiceRequestId(prisma, id);
  return serialize(panel?.logs ?? []);
}

/**
 * Create 1 maintenance log for SR
 * - vendorName lấy theo vendorId thực tế (input.vendorId hoặc SR.vendorId)
 * - eventType mặc định NOTE (bạn đổi nếu muốn)
 */
export async function createMaintenanceLogForServiceRequest(input: CreateMaintenanceLogInput) {
  const serviceRequestId = String(input.serviceRequestId || "").trim();
  if (!serviceRequestId) throw new Error("Missing serviceRequestId");

  return prisma.$transaction(async (tx) => {
    const sr = await tx.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      select: {
        id: true,
        vendorId: true,
        vendorNameSnap: true,

        productId: true,
        variantId: true,
        brandSnapshot: true,
        modelSnapshot: true,
        refSnapshot: true,
        serialSnapshot: true,
      },
    });

    if (!sr) throw new Error("Service request not found");

    const vendorId = (input.vendorId ?? sr.vendorId ?? null) as string | null;

    // vendorName ưu tiên lookup; fallback snapshot
    let vendorName: string | null = sr.vendorNameSnap ?? null;
    if (vendorId) {
      const v = await tx.vendor.findUnique({
        where: { id: vendorId },
        select: { id: true, name: true },
      });
      vendorName = v?.name ?? vendorName;
    }

    const currency = input.currency ?? "VND";

    // (A) nếu có cost => tạo Payment
    let paymentId: string | null = null;
    let paidAmount: Prisma.Decimal | null = null;
    let paidAt: Date | null = null;

    if (input.totalCost != null) {
      const amountDec = new Prisma.Decimal(String(input.totalCost));
      const createdPayment = await createPayment(tx, {
        amount: amountDec,
        currency,
        service_request_id: sr.id,
        vendor_id: vendorId,
        note: input.notes ?? null,

        // default values - TUỲ ENUM CỦA BẠN
        method: (input.paymentMethod ?? "CASH") as any,
        status: (input.paymentStatus ?? "UNPAID") as any,
        direction: ("OUT" as any),
        type: (input.paymentType ?? "ORDER") as any,
        purpose: (input.paymentPurpose ?? "ORDER_FULL") as any,
      });

      paymentId = createdPayment.id;
      paidAmount = amountDec;
      // paidAt schema bạn đang default(now) => vẫn set rõ ràng cho thống nhất
      paidAt = new Date();
    }

    // (B) tạo maintenance log
    const created = await maintenanceRepo.createLog(tx, {
      serviceRequestId: sr.id,
      eventType:
        input.totalCost != null ? MaintenanceEventType.COST_ADDED : MaintenanceEventType.NOTE,

      vendorId,
      vendorName,

      notes: input.notes ?? null,
      servicedAt: input.servicedAt ?? null,

      totalCost: input.totalCost == null ? null : new Prisma.Decimal(String(input.totalCost)),
      currency,

      paymentId,
      paidAmount,
      paidAt,

      productId: sr.productId ?? null,
      variantId: sr.variantId ?? null,
      brandSnapshot: sr.brandSnapshot ?? null,
      modelSnapshot: sr.modelSnapshot ?? null,
      refSnapshot: sr.refSnapshot ?? null,
      serialSnapshot: sr.serialSnapshot ?? null,
    });

    return serialize(created);
  });
}

/**
 * Assign/change vendor:
 * - update SR vendor + status IN_PROGRESS
 * - create 1 maintenance log (ASSIGN_VENDOR / CHANGE_VENDOR)
 * - nếu có reason -> gộp reason vào notes của log này (1 log)
 */
export async function assignVendorForServiceRequest(input: AssignVendorInput) {
  const serviceRequestId = String(input.serviceRequestId || "").trim();
  const vendorId = String(input.vendorId || "").trim();

  if (!serviceRequestId) throw new Error("Missing serviceRequestId");
  if (!vendorId) throw new Error("Missing vendorId");

  return prisma.$transaction(async (tx) => {
    const sr = await tx.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      select: { id: true, vendorId: true },
    });
    if (!sr) throw new Error("Service request not found");

    // chọn đúng vendor hiện tại -> skip
    if (sr.vendorId && sr.vendorId === vendorId) {
      return serialize({ ok: true, skipped: true, reason: "SAME_VENDOR" });
    }

    const v = await tx.vendor.findUnique({
      where: { id: vendorId },
      select: { id: true, name: true },
    });
    if (!v) throw new Error("Vendor not found");

    await maintenanceRepo.assignVendorOne(tx, {
      serviceRequestId,
      vendorId: v.id,
      vendorName: v.name,
      reason: input.reason ?? null,
      setInProgress: input.setInProgress !== false,
    });

    return serialize({ ok: true, skipped: false });
  });
}