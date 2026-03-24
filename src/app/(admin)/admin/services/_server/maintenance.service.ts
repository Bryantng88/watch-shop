
"use server";

import { prisma } from "@/server/db/client";
import * as maintenanceRepo from "./maintenance.repo";
import { MaintenanceEventType, Prisma } from "@prisma/client";
import { createPayment } from "../../payments/_server/payment.repo";

type CreateMaintenanceLogInput = {
  serviceRequestId: string;
  vendorId?: string | null;
  notes?: string | null;
  servicedAt?: Date | null;
  totalCost?: number | null;
  currency?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  paymentType?: string | null;
  paymentPurpose?: string | null;
};

type AssignVendorInput = { serviceRequestId: string; vendorId: string; reason?: string | null; setInProgress?: boolean; };
function serialize(obj: any) { return JSON.parse(JSON.stringify(obj, (_k, v) => { if (v instanceof Date) return v.toISOString(); if (typeof v === 'object' && v?._isDecimal) return Number(v); return v; })); }
export async function getMaintenancePanelByServiceRequest(serviceRequestId: string) { const id = String(serviceRequestId || '').trim(); if (!id) throw new Error('Missing serviceRequestId'); return serialize(await maintenanceRepo.getPanelByServiceRequestId(prisma, id)); }
export async function getMaintenanceLogsByServiceRequest(serviceRequestId: string) { const id = String(serviceRequestId || '').trim(); if (!id) throw new Error('Missing serviceRequestId'); const panel = await maintenanceRepo.getPanelByServiceRequestId(prisma, id); return serialize(panel?.logs ?? []); }
export async function createMaintenanceLogForServiceRequest(input: CreateMaintenanceLogInput) {
  const serviceRequestId = String(input.serviceRequestId || '').trim();
  if (!serviceRequestId) throw new Error('Missing serviceRequestId');
  return prisma.$transaction(async (tx) => {
    const sr = await tx.serviceRequest.findUnique({ where: { id: serviceRequestId }, select: { id: true, vendorId: true, vendorNameSnap: true, technicianId: true, technicianNameSnap: true, productId: true, variantId: true, brandSnapshot: true, modelSnapshot: true, refSnapshot: true, serialSnapshot: true } });
    if (!sr) throw new Error('Service request not found');
    const vendorId = (input.vendorId ?? sr.vendorId ?? null) as string | null;
    let vendorName: string | null = sr.vendorNameSnap ?? null;
    if (vendorId) {
      const v = await tx.vendor.findUnique({ where: { id: vendorId }, select: { name: true } });
      vendorName = v?.name ?? vendorName;
    }
    const currency = input.currency ?? 'VND';
    let paymentId: string | null = null; let paidAmount: Prisma.Decimal | null = null; let paidAt: Date | null = null;
    if (input.totalCost != null) {
      const amountDec = new Prisma.Decimal(String(input.totalCost));
      const createdPayment = await createPayment(tx, { amount: amountDec, currency, service_request_id: sr.id, vendor_id: vendorId, note: input.notes ?? null, method: (input.paymentMethod ?? 'CASH') as any, status: (input.paymentStatus ?? 'UNPAID') as any, direction: ('OUT' as any), type: (input.paymentType ?? 'SERVICE') as any, purpose: (input.paymentPurpose ?? 'MAINTENANCE_COST') as any });
      paymentId = createdPayment.id; paidAmount = amountDec; paidAt = new Date();
    }
    const created = await maintenanceRepo.createLog(tx, { serviceRequestId: sr.id, eventType: input.totalCost != null ? MaintenanceEventType.COST : MaintenanceEventType.NOTE, vendorId, vendorName, technicianId: sr.technicianId ?? null, technicianNameSnap: sr.technicianNameSnap ?? null, notes: input.notes ?? null, servicedAt: input.servicedAt ?? null, totalCost: input.totalCost == null ? null : new Prisma.Decimal(String(input.totalCost)), currency, paymentId, paidAmount, paidAt, productId: sr.productId ?? null, variantId: sr.variantId ?? null, brandSnapshot: sr.brandSnapshot ?? null, modelSnapshot: sr.modelSnapshot ?? null, refSnapshot: sr.refSnapshot ?? null, serialSnapshot: sr.serialSnapshot ?? null });
    return serialize(created);
  });
}
export async function assignVendorForServiceRequest(input: AssignVendorInput) {
  const serviceRequestId = String(input.serviceRequestId || '').trim();
  const vendorId = String(input.vendorId || '').trim();
  if (!serviceRequestId) throw new Error('Missing serviceRequestId');
  if (!vendorId) throw new Error('Missing vendorId');
  return prisma.$transaction(async (tx) => {
    const sr = await tx.serviceRequest.findUnique({ where: { id: serviceRequestId }, select: { id: true, vendorId: true } });
    if (!sr) throw new Error('Service request not found');
    if (sr.vendorId && sr.vendorId === vendorId) return serialize({ ok: true, skipped: true, reason: 'SAME_VENDOR' });
    const v = await tx.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true } });
    if (!v) throw new Error('Vendor not found');
    await maintenanceRepo.assignVendorOne(tx, { serviceRequestId, vendorId: v.id, vendorName: v.name, reason: input.reason ?? null, setInProgress: input.setInProgress !== false });
    return serialize({ ok: true, skipped: false });
  });
}
