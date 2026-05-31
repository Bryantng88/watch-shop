import { prisma } from "@/server/db/client";
import * as maintRepo from "../server/maintenance/maintenance.repo";

export async function assignVendorForServiceRequestApplication(input: {
  serviceRequestId: string;
  vendorId: string;
  reason?: string | null;
  setInProgress?: boolean;
}) {
  const serviceRequestId = String(input.serviceRequestId || "").trim();
  const vendorId = String(input.vendorId || "").trim();
  if (!serviceRequestId) throw new Error("Missing serviceRequestId");
  if (!vendorId) throw new Error("Missing vendorId");

  return prisma.$transaction(async (tx) => {
    const sr = await tx.serviceRequest.findUnique({ where: { id: serviceRequestId }, select: { id: true, vendorId: true } });
    if (!sr) throw new Error("Service request not found");
    if (sr.vendorId && sr.vendorId === vendorId) return { ok: true, skipped: true, reason: "SAME_VENDOR" };

    const vendor = await tx.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true } });
    if (!vendor) throw new Error("Vendor not found");

    await maintRepo.assignVendorOne(tx, {
      serviceRequestId,
      vendorId: vendor.id,
      vendorName: vendor.name,
      reason: input.reason ?? null,
      setInProgress: input.setInProgress !== false,
    });

    return { ok: true, skipped: false };
  });
}

export async function bulkAssignVendorAndCreateMaintenanceApplication(input: {
  ids: string[];
  vendorId: string | null;
  reason?: string | null;
}) {
  const ids = Array.from(new Set((input.ids ?? []).map((x) => String(x).trim()).filter(Boolean)));
  if (!ids.length) throw new Error("Missing ids");

  const vendorId = String(input.vendorId || "").trim();
  if (!vendorId) throw new Error("Missing vendorId");

  return prisma.$transaction(async (tx) => {
    const vendor = await tx.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true } });
    if (!vendor) throw new Error("Vendor not found");

    return maintRepo.bulkAssignVendor(tx, {
      ids,
      vendorId: vendor.id,
      vendorName: vendor.name,
      onlyFromDraft: false,
      setInProgress: true,
    });
  });
}
