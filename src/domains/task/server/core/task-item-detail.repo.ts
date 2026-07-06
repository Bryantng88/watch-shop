import { dbOrTx, type DB } from "@/server/db/client";
import { getTaskItemActivityViewModels } from "@/domains/task/server/activity";
import { listTaskItemQueueItems } from "@/domains/task/server/business-binding.service";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
} as const;

function noteHasSystemOwner(note?: string | null) {
  return /ownerType:\s*SYSTEM/i.test(String(note ?? ""));
}

function noteHasCoreWorkspace(note?: string | null) {
  return /workTypeKey:\s*[a-z0-9-]+/i.test(String(note ?? ""));
}

async function listDefaultAdminShareUserIds(db: DB) {
  const users = await dbOrTx(db).user.findMany({
    where: {
      isActive: true,
      roles: {
        some: {
          OR: [
            { name: { equals: "ADMIN", mode: "insensitive" } },
            {
              permissions: {
                some: { code: { equals: "ADMIN", mode: "insensitive" } },
              },
            },
          ],
        },
      },
    },
    select: { id: true },
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });

  return users.map((user) => user.id);
}

function fallbackQueueTitle(targetType: string) {
  if (targetType === "WATCH") return "Watch";
  if (targetType === "ORDER") return "Đơn hàng";
  if (targetType === "SERVICE_REQUEST") return "Yêu cầu dịch vụ";
  if (targetType === "TECHNICAL_ISSUE") return "Vấn đề kỹ thuật";
  if (targetType === "SHIPMENT") return "Vận chuyển";
  if (targetType === "PAYMENT") return "Thanh toán";
  if (targetType === "WORK_CASE") return "Hồ sơ xử lý";
  if (targetType === "ACQUISITION") return "Thu mua";
  return "Nghiệp vụ";
}

function queueKey(targetType: string, targetId: string) {
  return `${targetType}:${targetId}`;
}

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

  const rows = await perfStep("task-item-detail-repo", "watchProductIds", () =>
    dbOrTx(db).watch.findMany({
      where: { id: { in: watchIds } },
      select: { id: true, productId: true },
    }),
  );

  return new Map(
    rows
      .filter((row) => row.productId)
      .map((row) => [row.id, row.productId as string]),
  );
}

export async function getTaskItemDetailPageRepo(db: DB, id: string) {
  const totalStartedAt = perfNow();
  const client = dbOrTx(db);
  const item = await perfStep("task-item-detail-repo", "taskItemFindUnique", () =>
    client.taskItem.findUnique({
      where: { id },
      include: {
        assignedToUser: { select: USER_SELECT },
        User: { select: USER_SELECT },
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
            taskItems: {
              select: {
                id: true,
                title: true,
                note: true,
                status: true,
                sortOrder: true,
                updatedAt: true,
              },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
          },
        },
      },
    }),
  );

  if (!item) return null;

  const noteSharedUserIds = Array.from(
    new Set(
      String(item.note ?? "")
        .match(/^sharedUserIds:\s*(.+)$/im)?.[1]
        ?.split(",")
        .map((id) => id.trim())
        .filter(Boolean) ?? [],
    ),
  );
  const defaultAdminShareUserIds =
    noteHasSystemOwner(item.note) && noteHasCoreWorkspace(item.note)
      ? await listDefaultAdminShareUserIds(db)
      : [];
  const sharedUserIds = Array.from(
    new Set([...noteSharedUserIds, ...defaultAdminShareUserIds]),
  );

  const [activities, queueItems, sharedUsers] = await Promise.all([
    perfStep("task-item-detail-repo", "activities", () =>
      getTaskItemActivityViewModels(item.id, 50),
    ),
    perfStep("task-item-detail-repo", "queueItems", () =>
      listTaskItemQueueItems(db, item.id),
    ),
    sharedUserIds.length
      ? client.user.findMany({
        where: { id: { in: sharedUserIds } },
        select: USER_SELECT,
        orderBy: [{ name: "asc" }, { email: "asc" }],
      })
      : Promise.resolve([]),
  ]);
  const watchProductIds = await resolveWatchProductIds(db, queueItems);
  const queueHrefs = new Map(
    queueItems.map((queueItem) => [
      queueKey(queueItem.targetType, queueItem.targetId),
      bindingHref(queueItem, watchProductIds),
    ]),
  );

  const result = {
    ...item,
    ownerUser: item.User,
    sharedUserIds,
    sharedUsers,
    activities,
    queueItems: queueItems.map((queueItem) => ({
      ...queueItem,
      href: queueHrefs.get(queueKey(queueItem.targetType, queueItem.targetId)) ?? null,
    })),
    businessBindings: queueItems.map((queueItem) => ({
      id: queueItem.id,
      targetType: queueItem.targetType,
      targetId: queueItem.targetId,
      taskItemId: queueItem.taskItemId,
      actionType: queueItem.status,
      href: queueHrefs.get(queueKey(queueItem.targetType, queueItem.targetId)) ?? null,
      createdAt: queueItem.updatedAt,
      updatedAt: queueItem.updatedAt,
      preview: {
        title: queueItem.preview.title ||
          fallbackQueueTitle(queueItem.targetType),
        ref: queueItem.preview.ref || queueItem.targetType,
        subtitle: null,
        status: queueItem.preview.status || queueItem.status,
        imageUrl: queueItem.preview.imageUrl ?? null,
        imageUrls: queueItem.preview.imageUrls ?? [],
      },
      stats: {
        lastActivityTitle: queueItem.latestActivityTitle,
        lastActivityAt: queueItem.updatedAt,
        feedbackCount: queueItem.feedbackCount,
        discussionCount: queueItem.discussionCount,
      },
      processingLabel: queueItem.status,
    })),
  };
  perfLog("task-item-detail-repo", "total", totalStartedAt);
  return result;
}
