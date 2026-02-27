"use server";

import { prisma } from "@/server/db/client";
import * as maintenanceRepo from "./maintenance.repo";
import { MaintenanceEventType, Prisma } from "@prisma/client";

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
        type: true,
        billable: true,

        productId: true,
        variantId: true,
        brandSnapshot: true,
        modelSnapshot: true,
        refSnapshot: true,
        serialSnapshot: true,

        vendorId: true,
        vendorNameSnap: true,
      },
    });

    if (!sr) throw new Error("Service request not found");

    // vendorId ưu tiên input, fallback SR.vendorId
    const vendorId = (input.vendorId ?? sr.vendorId ?? null) as string | null;

    // vendorName ưu tiên lookup theo vendorId; fallback snapshot SR
    let vendorName: string | null = sr.vendorNameSnap ?? null;
    if (vendorId) {
      const v = await tx.vendor.findUnique({
        where: { id: vendorId },
        select: { id: true, name: true },
      });
      vendorName = v?.name ?? vendorName;
    }

    const created = await maintenanceRepo.createLog(tx, {
      serviceRequestId: sr.id,
      eventType: MaintenanceEventType.NOTE, // bạn có thể đổi: COST_ADDED / WORKLOG / ...

      vendorId,
      vendorName,

      notes: input.notes ?? null,
      servicedAt: input.servicedAt ?? null,

      totalCost:
        input.totalCost == null ? null : new Prisma.Decimal(String(input.totalCost)),
      currency: input.currency ?? "VND",

      // invoice/billed (nếu bạn vẫn giữ)
      // (chỉ set nếu schema maintenanceRecord có field tương ứng)
      // @ts-ignore
      billed: input.billed ?? undefined,
      // @ts-ignore
      invoiceId: input.invoiceId ?? undefined,

      // payment fields (nếu bạn đã add)
      paymentId: input.paymentId ?? null,
      paidAmount:
        input.paidAmount == null ? null : new Prisma.Decimal(String(input.paidAmount)),
      paidAt: input.paidAt ?? null,

      // snapshots
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

export async function assignVendorForServiceRequest(input: {
  serviceRequestId: string;
  vendorId: string;
  setInProgress?: boolean; // default true
}) {
  const serviceRequestId = String(input.serviceRequestId || "").trim();
  const vendorId = String(input.vendorId || "").trim();
  if (!serviceRequestId) throw new Error("Missing serviceRequestId");
  if (!vendorId) throw new Error("Missing vendorId");

  return prisma.$transaction(async (tx) => {
    // 1) load SR current vendorId
    const sr = await tx.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      select: {
        id: true,
        vendorId: true,
      },
    });

    if (!sr) throw new Error("Service request not found");

    // 2) nếu chọn đúng vendor hiện tại -> SKIP (không tạo log)
    if (sr.vendorId && sr.vendorId === vendorId) {
      return serialize({ ok: true, skipped: true, reason: "SAME_VENDOR" });
    }

    // 3) lookup vendorName (bắt buộc để snap + log)
    const v = await tx.vendor.findUnique({
      where: { id: vendorId },
      select: { id: true, name: true },
    });
    if (!v) throw new Error("Vendor not found");

    // 4) update SR + create maintenance log (ASSIGN/CHANGE) trong repo
    await maintenanceRepo.assignVendorOne(tx, {
      serviceRequestId,
      vendorId: v.id,
      vendorName: v.name,
      setInProgress: input.setInProgress !== false,
    });

    return serialize({ ok: true, skipped: false });
  });
}