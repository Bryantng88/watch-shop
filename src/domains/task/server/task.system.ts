import { PaymentStatus, ShipmentStatus, TaskKind, TaskPriority, TechnicalIssueExecutionStatus, WatchSaleStage } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { completeRelatedTasksRepo, ensureSystemTaskRepo } from "./task.repo";
import { notifyTaskAssignedSafe, notifyTaskToRolesSafe } from "@/domains/notification/notification.service";

function addHours(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d;
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function moneyLabel(value: any, currency?: string | null) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return currency || "VND";
  return `${n.toLocaleString("vi-VN")} ${currency || "VND"}`;
}

async function notifyWhenNewOrReopened(db: DB, result: { id: string; created: boolean; reopened: boolean }, extra?: { type?: string; roles?: string[]; title?: string; message?: string }) {
  if (!result.created && !result.reopened) return;

  if (extra?.roles?.length) {
    await notifyTaskToRolesSafe(db, {
      taskId: result.id,
      roles: extra.roles,
      type: extra.type,
      title: extra.title,
      message: extra.message,
      priority: "HIGH",
    });
    return;
  }

  await notifyTaskAssignedSafe(db, {
    taskId: result.id,
    type: extra?.type,
    title: extra?.title,
    message: extra?.message,
  });
}

export async function syncWatchContentAndImageTasks(db: DB, input: { watchId: string; assignedToUserId?: string | null; actorUserId?: string | null; notify?: boolean }) {
  const watch = await db.watch.findUnique({
    where: { id: input.watchId },
    select: {
      id: true,
      saleStage: true,
      product: {
        select: {
          id: true,
          title: true,
          postContent: true,
          productContent: { select: { generatedContent: true } },
          productImage: { where: { role: "GALLERY" }, select: { id: true }, take: 1 },
        },
      },
    },
  });
  if (!watch) return;

  const terminal = [WatchSaleStage.HOLD, WatchSaleStage.SOLD, WatchSaleStage.CONSIGNED_TO].includes(watch.saleStage);
  const hasContent = Boolean(watch.product.postContent?.trim() || watch.product.productContent?.generatedContent?.trim());
  const hasGallery = watch.product.productImage.length > 0;

  if (!terminal && !hasContent) {
    const task = await ensureSystemTaskRepo(db, {
      kind: TaskKind.WATCH_CONTENT,
      watchId: watch.id,
      title: `Viết nội dung cho ${watch.product.title}`,
      description: "Watch đang thiếu content để đủ điều kiện chuyển sang Ready.",
      priority: TaskPriority.MEDIUM,
      dueAt: addDays(2),
      assignedToUserId: input.assignedToUserId ?? input.actorUserId ?? null,
      createdByUserId: input.actorUserId ?? null,
    });
    if (input.notify) await notifyWhenNewOrReopened(db, task);
  } else {
    await completeRelatedTasksRepo(db, { kind: TaskKind.WATCH_CONTENT, watchId: watch.id, completedByUserId: input.actorUserId ?? null });
  }

  if (!terminal && !hasGallery) {
    const task = await ensureSystemTaskRepo(db, {
      kind: TaskKind.WATCH_IMAGE,
      watchId: watch.id,
      title: `Bổ sung hình ảnh cho ${watch.product.title}`,
      description: "Watch đang thiếu gallery image để đủ điều kiện bán.",
      priority: TaskPriority.MEDIUM,
      dueAt: addDays(2),
      assignedToUserId: input.assignedToUserId ?? input.actorUserId ?? null,
      createdByUserId: input.actorUserId ?? null,
    });
    if (input.notify) await notifyWhenNewOrReopened(db, task);
  } else {
    await completeRelatedTasksRepo(db, { kind: TaskKind.WATCH_IMAGE, watchId: watch.id, completedByUserId: input.actorUserId ?? null });
  }
}

export async function syncPaymentTask(db: DB, input: { paymentId: string; assignedToUserId?: string | null; actorUserId?: string | null; notify?: boolean }) {
  const payment = await db.payment.findUnique({
    where: { id: input.paymentId },
    select: { id: true, refNo: true, status: true, amount: true, currency: true, order_id: true, service_request_id: true, acquisition_id: true, technical_issue_id: true, shipment_id: true },
  });
  if (!payment) return;

  if (payment.status === PaymentStatus.UNPAID) {
    const task = await ensureSystemTaskRepo(db, {
      kind: TaskKind.PAYMENT_FOLLOW_UP,
      paymentId: payment.id,
      orderId: payment.order_id,
      serviceRequestId: payment.service_request_id,
      acquisitionId: payment.acquisition_id,
      technicalIssueId: payment.technical_issue_id,
      shipmentId: payment.shipment_id,
      title: `Xử lý payment ${payment.refNo || "chưa có mã"}`,
      description: `Payment đang UNPAID: ${moneyLabel(payment.amount, payment.currency)}.`,
      priority: TaskPriority.HIGH,
      dueAt: addDays(3),
      assignedToUserId: input.assignedToUserId ?? input.actorUserId ?? null,
      createdByUserId: input.actorUserId ?? null,
    });
    if (input.notify !== false) await notifyWhenNewOrReopened(db, task);
  } else {
    await completeRelatedTasksRepo(db, { kind: TaskKind.PAYMENT_FOLLOW_UP, paymentId: payment.id, completedByUserId: input.actorUserId ?? null });
  }
}

export async function syncShipmentTask(db: DB, input: { shipmentId: string; assignedToUserId?: string | null; actorUserId?: string | null; notify?: boolean }) {
  const shipment = await db.shipment.findUnique({ where: { id: input.shipmentId }, select: { id: true, refNo: true, orderId: true, orderRefNo: true, status: true, customerName: true } });
  if (!shipment) return;

  if (shipment.status === ShipmentStatus.READY || shipment.status === ShipmentStatus.SHIPPED) {
    const task = await ensureSystemTaskRepo(db, {
      kind: TaskKind.SHIPMENT_FOLLOW_UP,
      shipmentId: shipment.id,
      orderId: shipment.orderId,
      title: `Theo dõi giao hàng ${shipment.refNo || shipment.orderRefNo || ""}`.trim(),
      description: shipment.customerName ? `Đơn của ${shipment.customerName} đang ở trạng thái ${shipment.status}.` : `Shipment đang ở trạng thái ${shipment.status}.`,
      priority: shipment.status === ShipmentStatus.READY ? TaskPriority.HIGH : TaskPriority.MEDIUM,
      dueAt: shipment.status === ShipmentStatus.READY ? addDays(1) : addDays(2),
      assignedToUserId: input.assignedToUserId ?? input.actorUserId ?? null,
      createdByUserId: input.actorUserId ?? null,
    });
    if (input.notify !== false) await notifyWhenNewOrReopened(db, task);
  } else {
    await completeRelatedTasksRepo(db, { kind: TaskKind.SHIPMENT_FOLLOW_UP, shipmentId: shipment.id, completedByUserId: input.actorUserId ?? null });
  }

  if (shipment.status === ShipmentStatus.RETURNING) {
    const task = await ensureSystemTaskRepo(db, {
      kind: TaskKind.SHIPMENT_RETURN,
      shipmentId: shipment.id,
      orderId: shipment.orderId,
      title: `Theo dõi hoàn hàng ${shipment.refNo || shipment.orderRefNo || ""}`.trim(),
      description: "Shipment đang hoàn về, cần theo dõi đến khi xác nhận RETURNED.",
      priority: TaskPriority.HIGH,
      dueAt: addDays(2),
      assignedToUserId: input.assignedToUserId ?? input.actorUserId ?? null,
      createdByUserId: input.actorUserId ?? null,
    });
    if (input.notify !== false) await notifyWhenNewOrReopened(db, task);
  } else {
    await completeRelatedTasksRepo(db, { kind: TaskKind.SHIPMENT_RETURN, shipmentId: shipment.id, completedByUserId: input.actorUserId ?? null });
  }
}

export async function syncTechnicalIssueTask(db: DB, input: { technicalIssueId: string; assignedToUserId?: string | null; actorUserId?: string | null; notify?: boolean }) {
  const issue = await db.technicalIssue.findUnique({
    where: { id: input.technicalIssueId },
    select: { id: true, area: true, executionStatus: true, priority: true, serviceRequestId: true, technicianId: true, ServiceRequest: { select: { refNo: true } } },
  });
  if (!issue) return;

  if (issue.executionStatus === TechnicalIssueExecutionStatus.OPEN || issue.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS) {
    const task = await ensureSystemTaskRepo(db, {
      kind: TaskKind.TECHNICAL_ISSUE_FOLLOW_UP,
      technicalIssueId: issue.id,
      serviceRequestId: issue.serviceRequestId,
      title: `Xử lý issue ${issue.area || "kỹ thuật"}${issue.ServiceRequest?.refNo ? ` - ${issue.ServiceRequest.refNo}` : ""}`,
      description: `Issue đang ở trạng thái ${issue.executionStatus}.`,
      priority: String(issue.priority || "").toUpperCase() === "URGENT" ? TaskPriority.URGENT : TaskPriority.HIGH,
      dueAt: issue.executionStatus === TechnicalIssueExecutionStatus.OPEN ? addDays(2) : addDays(7),
      assignedToUserId: input.assignedToUserId ?? issue.technicianId ?? input.actorUserId ?? null,
      createdByUserId: input.actorUserId ?? null,
    });
    if (input.notify !== false) await notifyWhenNewOrReopened(db, task);
  } else {
    await completeRelatedTasksRepo(db, { kind: TaskKind.TECHNICAL_ISSUE_FOLLOW_UP, technicalIssueId: issue.id, completedByUserId: input.actorUserId ?? null });
  }
}

export async function notifyIssueCancelledTask(db: DB, input: { technicalIssueId: string; assignedToUserId?: string | null; actorUserId?: string | null; reason?: string | null }) {
  const issue = await db.technicalIssue.findUnique({
    where: { id: input.technicalIssueId },
    select: { id: true, area: true, serviceRequestId: true, ServiceRequest: { select: { refNo: true } } },
  });
  if (!issue) return;

  const task = await ensureSystemTaskRepo(db, {
    kind: TaskKind.TECHNICAL_ISSUE_FOLLOW_UP,
    technicalIssueId: issue.id,
    serviceRequestId: issue.serviceRequestId,
    title: `Issue đã bị hủy${issue.ServiceRequest?.refNo ? ` - ${issue.ServiceRequest.refNo}` : ""}`,
    description: input.reason || `Issue ${issue.area || "kỹ thuật"} đã bị hủy, cần sale/admin kiểm tra lại.`,
    priority: TaskPriority.HIGH,
    dueAt: addHours(12),
    assignedToUserId: input.assignedToUserId ?? input.actorUserId ?? null,
    createdByUserId: input.actorUserId ?? null,
  });

  await notifyWhenNewOrReopened(db, task, {
    type: "ISSUE_CANCELLED_TASK",
    roles: input.assignedToUserId ? undefined : ["ADMIN", "SALE"],
    title: "Issue đã bị hủy",
    message: input.reason || "Có issue bị hủy, cần kiểm tra lại service.",
  });
}
