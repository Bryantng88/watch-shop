import { dbOrTx, type DB } from "@/server/db/client";
import { isUuid } from "./task.repo.shared";

type BusinessStageTone = "todo" | "progress" | "done" | "cancelled";

export function normalizeBusinessStage(
  targetType: string,
  row: any,
): {
  businessStage: string;
  businessStageLabel: string;
  businessStageTone: BusinessStageTone;
  isBusinessDone: boolean;
} {
  const type = String(targetType).toUpperCase();

  if (type === "ORDER") {
    const stage = String(row.status ?? "").toUpperCase();
    return {
      businessStage: stage,
      businessStageLabel: `Order · ${stage}`,
      businessStageTone:
        stage === "COMPLETED"
          ? "done"
          : ["CANCELLED", "RETURNED"].includes(stage)
            ? "cancelled"
            : ["POSTED", "PROCESSING", "SHIPPED", "PAID", "RESERVED", "RETURNING"].includes(stage)
              ? "progress"
              : "todo",
      isBusinessDone: stage === "COMPLETED",
    };
  }

  if (type === "SERVICE_REQUEST") {
    const stage = String(row.status ?? "").toUpperCase();
    return {
      businessStage: stage,
      businessStageLabel: `SR · ${stage}`,
      businessStageTone: ["COMPLETED", "DELIVERED"].includes(stage)
        ? "done"
        : stage === "CANCELED"
          ? "cancelled"
          : ["DIAGNOSING", "WAIT_APPROVAL", "IN_PROGRESS"].includes(stage)
            ? "progress"
            : "todo",
      isBusinessDone: ["COMPLETED", "DELIVERED"].includes(stage),
    };
  }

  if (type === "TECHNICAL_ISSUE") {
    const stage = String(row.executionStatus ?? "").toUpperCase();
    return {
      businessStage: stage,
      businessStageLabel: `TI · ${stage}`,
      businessStageTone:
        stage === "DONE"
          ? "done"
          : stage === "CANCELED"
            ? "cancelled"
            : ["CONFIRMED", "OPEN", "IN_PROGRESS"].includes(stage)
              ? "progress"
              : "todo",
      isBusinessDone: stage === "DONE",
    };
  }

  if (type === "PAYMENT") {
    const stage = String(row.status ?? "").toUpperCase();
    return {
      businessStage: stage,
      businessStageLabel: `Payment · ${stage}`,
      businessStageTone: ["PAID", "COLLECTED"].includes(stage)
        ? "done"
        : ["CANCELED", "REFUNDED"].includes(stage)
          ? "cancelled"
          : "todo",
      isBusinessDone: ["PAID", "COLLECTED"].includes(stage),
    };
  }

  if (type === "SHIPMENT") {
    const stage = String(row.status ?? "").toUpperCase();
    return {
      businessStage: stage,
      businessStageLabel: `Shipment · ${stage}`,
      businessStageTone:
        stage === "DELIVERED"
          ? "done"
          : ["CANCELLED", "RETURNED"].includes(stage)
            ? "cancelled"
            : ["READY", "SHIPPED", "RETURNING"].includes(stage)
              ? "progress"
              : "todo",
      isBusinessDone: stage === "DELIVERED",
    };
  }

  if (type === "ACQUISITION") {
    const stage = String(row.accquisitionStt ?? "").toUpperCase();
    return {
      businessStage: stage,
      businessStageLabel: `Acquisition · ${stage}`,
      businessStageTone: stage === "POSTED" ? "done" : stage === "CANCELED" ? "cancelled" : "todo",
      isBusinessDone: stage === "POSTED",
    };
  }

  if (type === "WORK_CASE") {
    const stage = String(row.status ?? "").toUpperCase();
    return {
      businessStage: stage,
      businessStageLabel: `WorkCase · ${stage}`,
      businessStageTone:
        stage === "RESOLVED"
          ? "done"
          : stage === "CANCELLED"
            ? "cancelled"
            : ["TRIAGED", "IN_PROGRESS"].includes(stage)
              ? "progress"
              : "todo",
      isBusinessDone: stage === "RESOLVED",
    };
  }

  if (type === "WATCH") {
    const stage = String(row.saleStage ?? row.status ?? "").toUpperCase();
    return {
      businessStage: stage || "LINKED",
      businessStageLabel: stage ? `Watch · ${stage}` : "Watch · LINKED",
      businessStageTone: "progress",
      isBusinessDone: false,
    };
  }

  return {
    businessStage: "LINKED",
    businessStageLabel: "Linked",
    businessStageTone: "progress",
    isBusinessDone: false,
  };
}

async function getExecutionTargetSnapshot(client: any, execution: any) {
  const type = String(execution.targetType).toUpperCase();
  const rawId = String(execution.targetId ?? "").trim();

  if (!rawId) return { ...execution, ...normalizeBusinessStage(type, execution) };

  if (type === "ORDER") {
    const row = await client.order.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, status: true, customerName: true },
    });
    if (!row) return { ...execution, ...normalizeBusinessStage(type, execution) };
    return { ...execution, targetId: row.id, targetRefNo: row.refNo, targetTitle: row.customerName, targetStatus: row.status, ...normalizeBusinessStage(type, row) };
  }

  if (type === "SERVICE_REQUEST") {
    const row = await client.serviceRequest.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, status: true },
    });
    if (!row) return { ...execution, ...normalizeBusinessStage(type, execution) };
    return { ...execution, targetId: row.id, targetRefNo: row.refNo, targetStatus: row.status, ...normalizeBusinessStage(type, row) };
  }

  if (type === "TECHNICAL_ISSUE") {
    const row = await client.technicalIssue.findUnique({
      where: { id: rawId },
      select: { id: true, summary: true, area: true, executionStatus: true },
    });
    if (!row) return { ...execution, ...normalizeBusinessStage(type, execution) };
    return { ...execution, targetId: row.id, targetTitle: row.summary || row.area, targetStatus: row.executionStatus, technicalIssue: row, ...normalizeBusinessStage(type, row) };
  }

  if (type === "PAYMENT") {
    const row = await client.payment.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, status: true },
    });
    if (!row) return { ...execution, ...normalizeBusinessStage(type, execution) };
    return { ...execution, targetId: row.id, targetRefNo: row.refNo, targetStatus: row.status, ...normalizeBusinessStage(type, row) };
  }

  if (type === "SHIPMENT") {
    const or: any[] = [{ refNo: rawId }, { trackingCode: rawId }];
    if (isUuid(rawId)) or.push({ id: rawId });
    const row = await client.shipment.findFirst({
      where: { OR: or },
      select: { id: true, refNo: true, trackingCode: true, status: true },
    });
    if (!row) return { ...execution, ...normalizeBusinessStage(type, execution) };
    return { ...execution, targetId: row.id, targetRefNo: row.refNo || row.trackingCode, targetStatus: row.status, ...normalizeBusinessStage(type, row) };
  }

  if (type === "ACQUISITION") {
    const row = await client.acquisition.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, accquisitionStt: true },
    });
    if (!row) return { ...execution, ...normalizeBusinessStage(type, execution) };
    return { ...execution, targetId: row.id, targetRefNo: row.refNo, targetStatus: row.accquisitionStt, ...normalizeBusinessStage(type, row) };
  }

  if (type === "WORK_CASE") {
    const row = await client.workCase.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, title: true, status: true },
    });
    if (!row) return { ...execution, ...normalizeBusinessStage(type, execution) };
    return { ...execution, targetId: row.id, targetRefNo: row.refNo, targetTitle: row.title, targetStatus: row.status, ...normalizeBusinessStage(type, row) };
  }

  if (type === "WATCH") {
    const row = await client.watch.findFirst({
      where: { OR: [{ id: rawId }, { productId: rawId }, { product: { sku: rawId } }] },
      select: { id: true, productId: true, saleStage: true, product: { select: { title: true, sku: true } } },
    });
    if (!row) return { ...execution, ...normalizeBusinessStage(type, execution) };
    return { ...execution, targetId: row.id, targetRefNo: row.product?.sku, targetTitle: row.product?.title, targetStatus: row.saleStage, ...normalizeBusinessStage(type, row) };
  }

  return { ...execution, ...normalizeBusinessStage(type, execution) };
}

export async function hydrateTaskBusinessLinks(db: DB, task: any) {
  const client = dbOrTx(db);
  const hydrateList = async (items: any[]) => Promise.all(items.map((item) => getExecutionTargetSnapshot(client, item)));

  const executions = await hydrateList(task.executions ?? []);
  const taskItems = await Promise.all(
    (task.taskItems ?? []).map(async (item: any) => ({
      ...item,
      executions: await hydrateList(item.executions ?? []),
    })),
  );

  return { ...task, executions, taskItems };
}

export function executionIsDone(execution: any) {
  return Boolean(execution?.isBusinessDone);
}
