import { prisma } from "@/server/db/client";
import { MaintenanceEventType, Prisma } from "@prisma/client";
import * as maintenanceRepo from "../server/maintenance/maintenance.repo";
import { createTechnicalIssueMaintenanceCostPaymentTx } from "@/domains/payment/server";

export type CreateMaintenanceRecordInput = {
  serviceRequestId: string;
  vendorId?: string | null;
  notes?: string | null;
  diagnosis?: string | null;
  workSummary?: string | null;
  processingMode?: string | null;
  servicedAt?: Date | null;
  totalCost?: number | null;
  currency?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  paymentType?: string | null;
  paymentPurpose?: string | null;
  serviceCatalogId?: string | null;
  imageFileKey?: string | null;
  technicalIssueId?: string | null;
};

export async function createMaintenanceRecordForServiceRequestApplication(input: CreateMaintenanceRecordInput) {
  const serviceRequestId = String(input.serviceRequestId || "").trim();
  if (!serviceRequestId) throw new Error("Missing serviceRequestId");

  return prisma.$transaction(async (tx) => {
    const sr = await tx.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      select: {
        id: true, vendorId: true, vendorNameSnap: true, technicianId: true, technicianNameSnap: true,
        productId: true, variantId: true, brandSnapshot: true, modelSnapshot: true, refSnapshot: true, serialSnapshot: true,
      },
    });
    if (!sr) throw new Error("Service request not found");

    if (sr.productId) {
      const product = await tx.product.findUnique({ where: { id: sr.productId }, select: { contentStatus: true } });
      if (product && String((product as any).contentStatus ?? "").toUpperCase() === "ARCHIVED") {
        throw new Error("Sản phẩm đã hủy/ẩn, không thể ghi thêm nhật ký xử lý.");
      }
    }

    const useExternal = (input.processingMode ?? "INTERNAL") === "EXTERNAL";
    const vendorId = useExternal ? ((input.vendorId ?? sr.vendorId ?? null) as string | null) : null;
    let vendorName: string | null = useExternal ? (sr.vendorNameSnap ?? null) : null;
    if (vendorId) {
      const vendor = await tx.vendor.findUnique({ where: { id: vendorId }, select: { name: true } });
      vendorName = vendor?.name ?? vendorName;
    }

    const currency = input.currency ?? "VND";
    let paymentId: string | null = null;
    let paidAmount: Prisma.Decimal | null = null;
    let paidAt: Date | null = null;

    const technicalIssueId = String(input.technicalIssueId ?? "").trim() || null;

    if (input.totalCost != null && Number(input.totalCost) >= 0 && technicalIssueId) {
      const createdPayment = await createTechnicalIssueMaintenanceCostPaymentTx(tx, {
        technicalIssueId,
        amount: Number(input.totalCost),
        vendorId,
        note: input.notes ?? null,
        method: input.paymentMethod ?? "CASH",
        status: input.paymentStatus ?? "UNPAID",
        purpose: input.paymentPurpose ?? "MAINTENANCE_COST",
      });
      paymentId = createdPayment?.id ?? null;
      paidAmount = null;
      paidAt = null;
    }

    const created = await maintenanceRepo.createLog(tx, {
      serviceRequestId: sr.id,
      eventType: input.totalCost != null ? MaintenanceEventType.COST : MaintenanceEventType.NOTE,
      vendorId,
      vendorName,
      technicianId: sr.technicianId ?? null,
      technicianNameSnap: sr.technicianNameSnap ?? null,
      notes: input.notes ?? null,
      diagnosis: input.diagnosis ?? null,
      workSummary: input.workSummary ?? null,
      processingMode: input.processingMode ?? "INTERNAL",
      servicedAt: input.servicedAt ?? new Date(),
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
      serviceCatalogId: input.serviceCatalogId ?? null,
      imageFileKey: input.imageFileKey ?? null,
      technicalIssueId: input.technicalIssueId ?? null,
    });

    if (useExternal && vendorId) {
      const vendor = await tx.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true } });
      if (vendor) await tx.serviceRequest.update({ where: { id: sr.id }, data: { vendorId: vendor.id, vendorNameSnap: vendor.name } });
    }

    return created;
  });
}
