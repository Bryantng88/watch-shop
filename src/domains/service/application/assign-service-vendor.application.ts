import { prisma } from "@/server/db/client";
import * as maintRepo from "../server/maintenance/maintenance.repo";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";

export async function assignVendorForServiceRequestApplication(input: {
  serviceRequestId: string;
  vendorId: string;
  reason?: string | null;
  setInProgress?: boolean;
  actorUserId?: string | null;
  deferConsumers?: (work: () => Promise<void>) => void;
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

    const event = await recordBusinessEvent(tx, {
      eventKey: "service_request.status_changed",
      targetType: "SERVICE_REQUEST",
      targetId: serviceRequestId,
      actorUserId: input.actorUserId ?? null,
      payload: {
        status: input.setInProgress === false ? undefined : "IN_PROGRESS",
        vendorId: vendor.id,
        vendorName: vendor.name,
        reason: input.reason ?? null,
        sourceId: `${serviceRequestId}:service_request.vendor_assigned:${vendor.id}`,
      },
    }, { deferConsumers: input.deferConsumers });

    return {
      ok: true,
      skipped: false,
      projectionDeliveryKey: event.projectionDeliveryKey,
    };
  });
}

export async function bulkAssignVendorAndCreateMaintenanceApplication(input: {
  ids: string[];
  vendorId: string | null;
  reason?: string | null;
  actorUserId?: string | null;
  deferConsumers?: (work: () => Promise<void>) => void;
}) {
  const ids = Array.from(new Set((input.ids ?? []).map((x) => String(x).trim()).filter(Boolean)));
  if (!ids.length) throw new Error("Missing ids");

  const vendorId = String(input.vendorId || "").trim();
  if (!vendorId) throw new Error("Missing vendorId");

  return prisma.$transaction(async (tx) => {
    const vendor = await tx.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true } });
    if (!vendor) throw new Error("Vendor not found");
    const targets = await tx.serviceRequest.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    if (!targets.length) return { updatedCount: 0, createdLogs: 0, events: [] };

    const result = await maintRepo.bulkAssignVendor(tx, {
      ids: targets.map((target) => target.id),
      vendorId: vendor.id,
      vendorName: vendor.name,
      onlyFromDraft: false,
      setInProgress: true,
    });
    const events = [];
    for (const { id: serviceRequestId } of targets) {
      const event = await recordBusinessEvent(tx, {
        eventKey: "service_request.status_changed",
        targetType: "SERVICE_REQUEST",
        targetId: serviceRequestId,
        actorUserId: input.actorUserId ?? null,
        payload: {
          status: "IN_PROGRESS",
          vendorId: vendor.id,
          vendorName: vendor.name,
          reason: input.reason ?? null,
          sourceId: `${serviceRequestId}:service_request.vendor_assigned:${vendor.id}`,
        },
      }, { deferConsumers: input.deferConsumers });
      events.push({ projectionDeliveryKey: event.projectionDeliveryKey });
    }
    return { ...result, events };
  });
}
