import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
} from "@prisma/client";

import { ensureCoordinationCycle } from "../src/domains/coordination/server/coordination-cycle.service";
import {
  buildShipmentOperationQueueRow,
  shipmentOperationStage,
} from "../src/domains/projection/server/shipment-operation-queue.projection";
import { prisma } from "../src/server/db/client";

function roleFromNote(note: string | null) {
  return note?.match(
    /^operationWorkspaceRole:\s*(SHIPMENT_WAITING|SHIPMENT_PROCESSING|SHIPMENT_DONE)\s*$/im,
  )?.[1] ?? null;
}

async function main() {
  const cycle = await ensureCoordinationCycle(prisma, {
    context: "OPERATION",
    provisionWorkTickets: true,
  });
  const workspaces = await prisma.taskItem.findMany({
    where: { taskId: cycle.task.id },
    select: { id: true, note: true, title: true },
  });
  const workspaceByRole = new Map(
    workspaces
      .map((workspace) => [roleFromNote(workspace.note), workspace] as const)
      .filter((entry): entry is [string, (typeof workspaces)[number]] => Boolean(entry[0])),
  );
  const shipments = await prisma.shipment.findMany({
    select: { id: true, status: true, updatedAt: true },
    orderBy: { updatedAt: "asc" },
  });
  const existingBindings = await prisma.taskExecution.findMany({
    where: {
      taskId: cycle.task.id,
      targetType: TaskExecutionTargetType.SHIPMENT,
      targetId: { in: shipments.map((shipment) => shipment.id) },
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    orderBy: { createdAt: "desc" },
  });
  const bindingsByShipment = new Map<string, typeof existingBindings>();
  for (const binding of existingBindings) {
    const rows = bindingsByShipment.get(binding.targetId) ?? [];
    rows.push(binding);
    bindingsByShipment.set(binding.targetId, rows);
  }

  let created = 0;
  let moved = 0;
  let deduplicated = 0;
  for (const shipment of shipments) {
    const role = shipmentOperationStage(shipment.status);
    const workspace = workspaceByRole.get(role);
    if (!workspace) throw new Error(`Missing Shipment workspace ${role}`);
    const bindings = bindingsByShipment.get(shipment.id) ?? [];
    const primary = bindings[0] ?? null;
    const metadataJson = {
      source: "BACKFILL",
      backfilledAt: new Date().toISOString(),
      targetType: "SHIPMENT",
      targetId: shipment.id,
      operationWorkspaceRole: role,
      flowStageKey:
        role === "SHIPMENT_PROCESSING"
          ? "shipment-processing"
          : role === "SHIPMENT_DONE"
            ? "shipment-done"
            : "shipment-waiting",
      shipmentStatus: String(shipment.status),
    };
    if (!primary) {
      await prisma.taskExecution.create({
        data: {
          taskId: cycle.task.id,
          taskItemId: workspace.id,
          targetType: TaskExecutionTargetType.SHIPMENT,
          targetId: shipment.id,
          actionType: TaskExecutionActionType.LINKED,
          metadataJson,
        },
      });
      created += 1;
    } else {
      if (primary.taskItemId !== workspace.id) moved += 1;
      await prisma.taskExecution.update({
        where: { id: primary.id },
        data: {
          taskItemId: workspace.id,
          actionType: TaskExecutionActionType.LINKED,
          metadataJson: {
            ...(primary.metadataJson && typeof primary.metadataJson === "object"
              ? primary.metadataJson as Record<string, unknown>
              : {}),
            ...metadataJson,
          },
        },
      });
      for (const duplicate of bindings.slice(1)) {
        await prisma.taskExecution.update({
          where: { id: duplicate.id },
          data: { actionType: TaskExecutionActionType.CANCELLED },
        });
        deduplicated += 1;
      }
    }
  }

  for (let index = 0; index < shipments.length; index += 5) {
    await Promise.all(
      shipments.slice(index, index + 5).map((shipment) =>
        buildShipmentOperationQueueRow(prisma, shipment.id, "BACKFILL"),
      ),
    );
  }

  const stageCounts = await prisma.projectionRecord.groupBy({
    by: ["status"],
    where: { projectionKey: "shipment-operation-queue" },
    _count: { _all: true },
  });
  console.log(JSON.stringify({
    taskId: cycle.task.id,
    shipments: shipments.length,
    bindings: { created, moved, deduplicated },
    projection: Object.fromEntries(
      stageCounts.map((row) => [row.status ?? "UNKNOWN", row._count._all]),
    ),
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
