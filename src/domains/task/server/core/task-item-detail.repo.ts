import { TimelineContainerType } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { listTimelineEntryRecords } from "@/domains/shared/timeline/server/timeline.repo";
import { mapTimelineEntriesToViewModels } from "@/domains/shared/timeline/server/timeline-renderer.service";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
} as const;

const BUSINESS_BINDING_SELECT = {
  id: true,
  targetType: true,
  targetId: true,
  taskItemId: true,
  actionType: true,
  metadataJson: true,
} as const;

function bindingHref(
  binding: { targetType: string; targetId: string },
  watchProductIds: Map<string, string>,
) {
  if (binding.targetType === "WATCH") {
    const productId = watchProductIds.get(binding.targetId);
    return productId ? `/admin/watches/${productId}` : null;
  }

  if (binding.targetType === "SERVICE_REQUEST") return `/admin/services/${binding.targetId}`;
  if (binding.targetType === "TECHNICAL_ISSUE") {
    return `/admin/services/issues-board?issueId=${binding.targetId}`;
  }
  if (binding.targetType === "ORDER") return `/admin/orders/${binding.targetId}`;
  if (binding.targetType === "SHIPMENT") return `/admin/shipments/${binding.targetId}`;
  if (binding.targetType === "PAYMENT") return "/admin/payments";
  if (binding.targetType === "WORK_CASE") return `/admin/work-cases/${binding.targetId}`;
  if (binding.targetType === "ACQUISITION") return `/admin/acquisitions/${binding.targetId}`;

  return null;
}

async function resolveWatchProductIds(
  db: DB,
  bindings: Array<{ targetType: string; targetId: string }>,
) {
  const watchIds = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === "WATCH")
        .map((binding) => binding.targetId)
        .filter(Boolean),
    ),
  );

  if (!watchIds.length) return new Map<string, string>();

  const rows = await dbOrTx(db).watch.findMany({
    where: { id: { in: watchIds } },
    select: { id: true, productId: true },
  });

  return new Map(
    rows
      .filter((row) => row.productId)
      .map((row) => [row.id, row.productId as string]),
  );
}

async function getTaskItemTimelineViewModels(db: DB, taskItemId: string) {
  const entries = await listTimelineEntryRecords(db, {
    containerType: TimelineContainerType.TASK_ITEM,
    containerId: taskItemId,
    limit: 50,
  });

  return mapTimelineEntriesToViewModels(entries);
}

async function listTaskItemBusinessBindings(db: DB, taskItemId: string) {
  return dbOrTx(db).taskExecution.findMany({
    where: { taskItemId },
    select: BUSINESS_BINDING_SELECT,
    orderBy: { createdAt: "desc" },
  });
}

export async function getTaskItemDetailPageRepo(db: DB, id: string) {
  const client = dbOrTx(db);
  const item = await client.taskItem.findUnique({
    where: { id },
    include: {
      assignedToUser: { select: USER_SELECT },
      checklists: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      task: {
        select: {
          id: true,
          title: true,
          kind: true,
          status: true,
          priority: true,
          dueAt: true,
          periodKey: true,
          createdByUserId: true,
          assignedToUserId: true,
        },
      },
    },
  });

  if (!item) return null;

  const [timeline, businessBindings] = await Promise.all([
    getTaskItemTimelineViewModels(db, item.id),
    listTaskItemBusinessBindings(db, item.id),
  ]);
  const watchProductIds = await resolveWatchProductIds(db, businessBindings);

  return {
    ...item,
    timeline,
    businessBindings: businessBindings.map((binding) => ({
      id: binding.id,
      targetType: binding.targetType,
      targetId: binding.targetId,
      taskItemId: binding.taskItemId,
      actionType: binding.actionType,
      metadata: binding.metadataJson,
      href: bindingHref(binding, watchProductIds),
    })),
  };
}
