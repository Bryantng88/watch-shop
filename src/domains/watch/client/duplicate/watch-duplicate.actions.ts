"use server";

import { revalidatePath } from "next/cache";
import { Prisma, TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { invalidateWatchListCountCache } from "@/domains/watch/server/list/watch-list.repo";
import { emitWatchDuplicateStateEvent } from "@/domains/watch/server/events/watch-business-event.emitter";
import { processBusinessEventOperation } from "@/domains/event/delivery";

export async function confirmDuplicateWatchAction(input: { productId: string }) {
  const user = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const productId = String(input.productId ?? "").trim();
  if (!productId) throw new Error("Thiếu productId của watch.");

  const watch = await prisma.watch.findUnique({
    where: { productId },
    select: {
      id: true,
      duplicateConfirmedAt: true,
      product: {
        select: {
          serviceRequest: {
            select: {
              id: true,
              technicalIssue: { select: { id: true } },
            },
          },
        },
      },
    },
  });
  if (!watch) throw new Error("Không tìm thấy watch.");
  if (watch.duplicateConfirmedAt) {
    return { ok: true, alreadyConfirmed: true };
  }

  const serviceRequestIds = watch.product.serviceRequest.map((item) => item.id);
  const technicalIssueIds = watch.product.serviceRequest.flatMap((item) =>
    item.technicalIssue.map((issue) => issue.id),
  );

  const event = await prisma.$transaction(async (tx) => {
    const executions = await tx.taskExecution.findMany({
      where: {
        actionType: { not: TaskExecutionActionType.CANCELLED },
        OR: [
          { targetType: TaskExecutionTargetType.WATCH, targetId: watch.id },
          ...(serviceRequestIds.length
            ? [{ targetType: TaskExecutionTargetType.SERVICE_REQUEST, targetId: { in: serviceRequestIds } }]
            : []),
          ...(technicalIssueIds.length
            ? [{ targetType: TaskExecutionTargetType.TECHNICAL_ISSUE, targetId: { in: technicalIssueIds } }]
            : []),
        ],
      },
      select: { id: true, actionType: true, metadataJson: true },
    });

    const confirmedAt = new Date();
    for (const execution of executions) {
      const rawMetadata = execution.metadataJson ?? null;
      const metadata = isJsonObject(rawMetadata) ? rawMetadata : {};
      await tx.taskExecution.update({
        where: { id: execution.id },
        data: {
          actionType: TaskExecutionActionType.CANCELLED,
          metadataJson: {
            ...metadata,
            duplicateQuarantine: {
              watchId: watch.id,
              originalActionType: execution.actionType,
              confirmedAt: confirmedAt.toISOString(),
            },
          },
        },
      });
    }

    await tx.watch.update({
      where: { id: watch.id },
      data: {
        duplicateConfirmedAt: confirmedAt,
        duplicateConfirmedByUserId: user.id,
      },
    });

    return emitWatchDuplicateStateEvent(tx, {
      watchId: watch.id,
      productId,
      state: "CONFIRMED",
      actorUserId: user.id,
      occurredAt: confirmedAt,
    });
  });
  await processBusinessEventOperation(event.projectionDeliveryKey);

  invalidateWatchListCountCache();
  revalidatePath("/admin/watches");
  revalidatePath("/admin/coordination/media");

  return { ok: true, alreadyConfirmed: false };
}

export async function restoreDuplicateWatchAction(input: { productId: string }) {
  const user = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const productId = String(input.productId ?? "").trim();
  if (!productId) throw new Error("Thiếu productId của watch.");

  const event = await prisma.$transaction(async (tx) => {
    const watch = await tx.watch.findUnique({ where: { productId }, select: { id: true } });
    if (!watch) throw new Error("Không tìm thấy watch.");

    const executions = await tx.taskExecution.findMany({
      where: {
        actionType: TaskExecutionActionType.CANCELLED,
        metadataJson: { path: ["duplicateQuarantine", "watchId"], equals: watch.id },
      },
      select: { id: true, metadataJson: true },
    });
    for (const execution of executions) {
      const rawMetadata = execution.metadataJson ?? null;
      const metadata = isJsonObject(rawMetadata) ? rawMetadata : {};
      const rawQuarantine = metadata.duplicateQuarantine ?? null;
      const quarantine = isJsonObject(rawQuarantine)
        ? rawQuarantine
        : {};
      const originalActionType = quarantine.originalActionType;
      if (!isTaskExecutionActionType(originalActionType)) continue;
      await tx.taskExecution.update({
        where: { id: execution.id },
        data: {
          actionType: originalActionType,
          metadataJson: {
            ...metadata,
            duplicateQuarantine: { ...quarantine, restoredAt: new Date().toISOString() },
          },
        },
      });
    }

    const restoredAt = new Date();
    await tx.watch.update({
      where: { id: watch.id },
      data: { duplicateConfirmedAt: null, duplicateConfirmedByUserId: null },
    });

    return emitWatchDuplicateStateEvent(tx, {
      watchId: watch.id,
      productId,
      state: "RESTORED",
      actorUserId: user.id,
      occurredAt: restoredAt,
    });
  });
  await processBusinessEventOperation(event.projectionDeliveryKey);

  invalidateWatchListCountCache();
  revalidatePath("/admin/watches");
  return { ok: true };
}

export async function permanentlyDeleteDuplicateWatchAction(input: { productId: string }) {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const productId = String(input.productId ?? "").trim();
  if (!productId) throw new Error("Thiếu productId của watch.");

  const result = await prisma.$transaction(async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId },
      select: {
        id: true,
        duplicateConfirmedAt: true,
        product: {
          select: {
            acquisitionItem: { select: { id: true, acquisitionId: true } },
            serviceRequest: {
              select: {
                id: true,
                technicalIssue: { select: { id: true } },
              },
            },
          },
        },
      },
    });
    if (!watch) throw new Error("Không tìm thấy watch.");
    if (!watch.duplicateConfirmedAt) {
      throw new Error("Chỉ được xóa vĩnh viễn watch đã xác nhận trùng.");
    }

    const serviceRequestIds = watch.product.serviceRequest.map((item) => item.id);
    const technicalIssueIds = watch.product.serviceRequest.flatMap((item) =>
      item.technicalIssue.map((issue) => issue.id),
    );
    const acquisitionIds = [...new Set(watch.product.acquisitionItem.map((item) => item.acquisitionId))];

    await tx.projectionRecord.deleteMany({
      where: {
        OR: [
          { entityType: "WATCH", entityId: watch.id },
          ...(serviceRequestIds.length
            ? [{ entityType: "SERVICE_REQUEST", entityId: { in: serviceRequestIds } }]
            : []),
          ...(technicalIssueIds.length
            ? [{ entityType: "TECHNICAL_ISSUE", entityId: { in: technicalIssueIds } }]
            : []),
        ],
      },
    });
    await tx.taskExecution.deleteMany({
      where: {
        OR: [
          { targetType: TaskExecutionTargetType.WATCH, targetId: watch.id },
          ...(serviceRequestIds.length
            ? [
                { targetType: TaskExecutionTargetType.SERVICE_REQUEST, targetId: { in: serviceRequestIds } },
                { serviceRequestId: { in: serviceRequestIds } },
              ]
            : []),
          ...(technicalIssueIds.length
            ? [
                { targetType: TaskExecutionTargetType.TECHNICAL_ISSUE, targetId: { in: technicalIssueIds } },
                { technicalIssueId: { in: technicalIssueIds } },
              ]
            : []),
        ],
      },
    });
    await tx.task.deleteMany({
      where: {
        OR: [
          { watchId: watch.id },
          ...(serviceRequestIds.length ? [{ serviceRequestId: { in: serviceRequestIds } }] : []),
          ...(technicalIssueIds.length ? [{ technicalIssueId: { in: technicalIssueIds } }] : []),
        ],
      },
    });
    if (serviceRequestIds.length || technicalIssueIds.length) {
      await tx.payment.deleteMany({
        where: {
          OR: [
            ...(serviceRequestIds.length ? [{ service_request_id: { in: serviceRequestIds } }] : []),
            ...(technicalIssueIds.length ? [{ technical_issue_id: { in: technicalIssueIds } }] : []),
          ],
        },
      });
      await tx.maintenanceRecord.deleteMany({
        where: {
          OR: [
            { productId },
            ...(serviceRequestIds.length ? [{ serviceRequestId: { in: serviceRequestIds } }] : []),
            ...(technicalIssueIds.length ? [{ technicalIssueId: { in: technicalIssueIds } }] : []),
          ],
        },
      });
    }
    if (serviceRequestIds.length) {
      await tx.serviceRequest.deleteMany({ where: { id: { in: serviceRequestIds } } });
    }

    await tx.acquisitionItem.deleteMany({ where: { productId } });
    const deletedAcquisitionIds: string[] = [];
    for (const acquisitionId of acquisitionIds) {
      const remainingItems = await tx.acquisitionItem.count({ where: { acquisitionId } });
      if (remainingItems > 0) continue;
      await tx.payment.deleteMany({ where: { acquisition_id: acquisitionId } });
      await tx.task.deleteMany({ where: { acquisitionId } });
      await tx.acquisition.delete({ where: { id: acquisitionId } });
      deletedAcquisitionIds.push(acquisitionId);
    }

    await tx.product.delete({ where: { id: productId } });
    return { deletedAcquisitionIds };
  });

  invalidateWatchListCountCache();
  revalidatePath("/admin/watches");
  revalidatePath("/admin/acquisitions");
  revalidatePath("/admin/coordination/media");
  revalidatePath("/admin/coordination/technical");
  return { ok: true, ...result };
}

function isJsonObject(value: Prisma.JsonValue | null): value is Prisma.JsonObject {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isTaskExecutionActionType(value: unknown): value is TaskExecutionActionType {
  return typeof value === "string" && Object.values(TaskExecutionActionType).includes(value as TaskExecutionActionType);
}
