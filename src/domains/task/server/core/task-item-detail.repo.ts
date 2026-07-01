import { dbOrTx, type DB } from "@/server/db/client";
import { getTaskItemActivityViewModels } from "@/domains/task/server/activity";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

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
  createdAt: true,
} as const;

type ActivityViewModel = Awaited<ReturnType<typeof getTaskItemActivityViewModels>>[number];
type BusinessBindingRow = Awaited<ReturnType<typeof listTaskItemBusinessBindings>>[number];

type BusinessQueuePreview = {
  title: string;
  ref: string;
  subtitle: string | null;
  status: string | null;
  imageUrl: string | null;
};

function mediaUrl(value?: string | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }
  return `/api/media/sign?key=${encodeURIComponent(raw)}`;
}

function metadataRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function compactId(id: string) {
  if (!id) return "-";
  if (id.length <= 18) return id;
  return `${id.slice(0, 8)}...${id.slice(-6)}`;
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

async function listTaskItemBusinessBindings(db: DB, taskItemId: string) {
  return perfStep("task-item-detail-repo", "businessBindings", () =>
    dbOrTx(db).taskExecution.findMany({
      where: { taskItemId },
      select: BUSINESS_BINDING_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  );
}

async function resolveWatchQueuePreviews(
  db: DB,
  bindings: BusinessBindingRow[],
) {
  const ids = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === "WATCH")
        .map((binding) => binding.targetId)
        .filter(Boolean),
    ),
  );
  if (!ids.length) return new Map<string, BusinessQueuePreview>();

  const rows = await perfStep("task-item-detail-repo", "watchQueuePreviews", () =>
    dbOrTx(db).watch.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        saleStage: true,
        stockStage: true,
        product: {
          select: {
            title: true,
            sku: true,
            status: true,
            primaryImageUrl: true,
            storefrontImageKey: true,
            productImage: {
              where: { role: "INLINE" },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
              take: 1,
              select: { fileKey: true },
            },
          },
        },
      },
    }),
  );

  return new Map(
    rows.map((row) => {
      const product = row.product;
      const imageKey =
        product?.productImage?.[0]?.fileKey ||
        product?.primaryImageUrl ||
        product?.storefrontImageKey ||
        null;
      const preview: BusinessQueuePreview = {
        title: product?.title || product?.sku || "Watch",
        ref: product?.sku || compactId(row.id),
        subtitle: product?.status ? `Product ${product.status}` : null,
        status: row.saleStage || row.stockStage || product?.status || null,
        imageUrl: mediaUrl(imageKey),
      };
      return [queueKey("WATCH", row.id), preview] as const;
    }),
  );
}

async function resolveOrderQueuePreviews(
  db: DB,
  bindings: BusinessBindingRow[],
) {
  const ids = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === "ORDER")
        .map((binding) => binding.targetId)
        .filter(Boolean),
    ),
  );
  if (!ids.length) return new Map<string, BusinessQueuePreview>();

  const rows = await perfStep("task-item-detail-repo", "orderQueuePreviews", () =>
    dbOrTx(db).order.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        refNo: true,
        status: true,
        paymentStatus: true,
        customerName: true,
        orderItem: {
          take: 1,
          select: {
            product: {
              select: {
                title: true,
                primaryImageUrl: true,
                storefrontImageKey: true,
                productImage: {
                  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                  take: 1,
                  select: { fileKey: true },
                },
              },
            },
          },
        },
      },
    }),
  );

  return new Map(
    rows.map((row) => {
      const product = row.orderItem?.[0]?.product;
      const imageKey =
        product?.productImage?.[0]?.fileKey ||
        product?.primaryImageUrl ||
        product?.storefrontImageKey ||
        null;
      const preview: BusinessQueuePreview = {
        title: row.refNo || product?.title || "Order",
        ref: row.refNo || compactId(row.id),
        subtitle: row.customerName ? `Khach: ${row.customerName}` : null,
        status: row.status || row.paymentStatus || null,
        imageUrl: mediaUrl(imageKey),
      };
      return [queueKey("ORDER", row.id), preview] as const;
    }),
  );
}

async function resolveServiceQueuePreviews(
  db: DB,
  bindings: BusinessBindingRow[],
) {
  const ids = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === "SERVICE_REQUEST")
        .map((binding) => binding.targetId)
        .filter(Boolean),
    ),
  );
  if (!ids.length) return new Map<string, BusinessQueuePreview>();

  const rows = await perfStep("task-item-detail-repo", "serviceQueuePreviews", () =>
    dbOrTx(db).serviceRequest.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        refNo: true,
        status: true,
        brandSnapshot: true,
        modelSnapshot: true,
        skuSnapshot: true,
        primaryImageUrlSnapshot: true,
      },
    }),
  );

  return new Map(
    rows.map((row) => {
      const title = [row.brandSnapshot, row.modelSnapshot].filter(Boolean).join(" ");
      const preview: BusinessQueuePreview = {
        title: title || row.refNo || "Service Request",
        ref: row.refNo || row.skuSnapshot || compactId(row.id),
        subtitle: row.skuSnapshot ? `SKU: ${row.skuSnapshot}` : null,
        status: row.status || null,
        imageUrl: mediaUrl(row.primaryImageUrlSnapshot),
      };
      return [queueKey("SERVICE_REQUEST", row.id), preview] as const;
    }),
  );
}

async function resolveBusinessQueuePreviews(
  db: DB,
  bindings: BusinessBindingRow[],
) {
  const maps = await Promise.all([
    resolveWatchQueuePreviews(db, bindings),
    resolveOrderQueuePreviews(db, bindings),
    resolveServiceQueuePreviews(db, bindings),
  ]);

  const result = new Map<string, BusinessQueuePreview>();
  for (const map of maps) {
    for (const [key, value] of map) result.set(key, value);
  }
  return result;
}

function activityTarget(activity: ActivityViewModel) {
  const metadata = metadataRecord(activity.metadataJson);
  const targetType = cleanText(metadata.targetType);
  const targetId = cleanText(metadata.targetId);
  if (!targetType || !targetId) return null;
  return { targetType, targetId };
}

function buildActivityStats(activities: ActivityViewModel[]) {
  const map = new Map<
    string,
    { lastActivityTitle: string | null; lastActivityAt: string | null; feedbackCount: number }
  >();

  for (const activity of activities) {
    const target = activityTarget(activity);
    if (!target) continue;
    const key = queueKey(target.targetType, target.targetId);
    const current = map.get(key) ?? {
      lastActivityTitle: null,
      lastActivityAt: null,
      feedbackCount: 0,
    };

    current.lastActivityTitle = activity.title;
    current.lastActivityAt = activity.occurredAt;
    if (activity.feedback) current.feedbackCount += 1;
    map.set(key, current);
  }

  return map;
}

export async function getTaskItemDetailPageRepo(db: DB, id: string) {
  const totalStartedAt = perfNow();
  const client = dbOrTx(db);
  const item = await perfStep("task-item-detail-repo", "taskItemFindUnique", () =>
    client.taskItem.findUnique({
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
    }),
  );

  if (!item) return null;

  const [activities, businessBindings] = await Promise.all([
    perfStep("task-item-detail-repo", "activities", () =>
      getTaskItemActivityViewModels(item.id, 50),
    ),
    listTaskItemBusinessBindings(db, item.id),
  ]);
  const watchProductIds = await resolveWatchProductIds(db, businessBindings);
  const [businessQueuePreviews] = await Promise.all([
    resolveBusinessQueuePreviews(db, businessBindings),
  ]);
  const activityStats = buildActivityStats(activities);

  const result = {
    ...item,
    activities,
    businessBindings: businessBindings.map((binding) => ({
      id: binding.id,
      targetType: binding.targetType,
      targetId: binding.targetId,
      taskItemId: binding.taskItemId,
      actionType: binding.actionType,
      metadata: binding.metadataJson,
      href: bindingHref(binding, watchProductIds),
      createdAt: binding.createdAt,
      updatedAt: binding.createdAt,
      preview:
        businessQueuePreviews.get(queueKey(binding.targetType, binding.targetId)) ??
        {
          title: cleanText(metadataRecord(binding.metadataJson).targetTitle) ||
            `${binding.targetType} ${compactId(binding.targetId)}`,
          ref: cleanText(metadataRecord(binding.metadataJson).targetRefNo) ||
            compactId(binding.targetId),
          subtitle: null,
          status: cleanText(metadataRecord(binding.metadataJson).targetStatus) ||
            binding.actionType,
          imageUrl: null,
        },
      stats: activityStats.get(queueKey(binding.targetType, binding.targetId)) ?? {
        lastActivityTitle: null,
        lastActivityAt: null,
        feedbackCount: 0,
      },
      processingLabel: binding.actionType,
    })),
  };
  perfLog("task-item-detail-repo", "total", totalStartedAt);
  return result;
}
