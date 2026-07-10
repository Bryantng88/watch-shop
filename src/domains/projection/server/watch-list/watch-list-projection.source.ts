import { ImageRole, Prisma, TaskExecutionTargetType } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { getQueueItemWorkflowState } from "@/domains/task/server/business-binding-workflow.service";
import type {
  WatchListProjectionMediaState,
  WatchListProjectionSourceRow,
} from "./watch-list-projection.types";

const WATCH_LIST_SOURCE_SELECT = {
  id: true,
  productId: true,
  saleStage: true,
  serviceStage: true,
  stockStage: true,
  conditionGrade: true,
  specStatus: true,
  isContentDownloaded: true,
  isImageDownloaded: true,
  createdAt: true,
  updatedAt: true,
  product: {
    select: {
      id: true,
      title: true,
      sku: true,
      slug: true,
      brandId: true,
      vendorId: true,
      brand: { select: { id: true, name: true } },
      vendor: { select: { id: true, name: true } },
      postTargets: {
        orderBy: { createdAt: "asc" },
        select: {
          createdAt: true,
          postTargetId: true,
          postTarget: {
            select: {
              id: true,
              name: true,
              platform: true,
            },
          },
        },
      },
      productImage: {
        where: { role: { in: [ImageRole.INLINE, ImageRole.GALLERY] } },
        select: {
          id: true,
          role: true,
          fileKey: true,
          sortOrder: true,
          createdAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 4,
      },
    },
  },
  watchSpecV2: {
    select: {
      id: true,
      brand: true,
      model: true,
      referenceNumber: true,
    },
  },
  watchPrice: {
    select: {
      salePrice: true,
      listPrice: true,
      costPrice: true,
      minPrice: true,
    },
  },
  watchContent: {
    select: {
      id: true,
      titleOverride: true,
      hookText: true,
      body: true,
      summary: true,
      bulletSpecs: true,
    },
  },
  reviewStates: {
    select: {
      id: true,
      targetType: true,
      status: true,
      reviewedAt: true,
      reviewedById: true,
      submittedAt: true,
      submittedById: true,
    },
  },
} satisfies Prisma.WatchSelect;

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function workTypeKeyFromNote(note: unknown): WatchListProjectionMediaState["workTypeKey"] | null {
  const text = clean(note).toLowerCase();
  if (/worktypekey:\s*photoshoot/.test(text)) return "photoshoot";
  if (/worktypekey:\s*media-processing/.test(text)) return "media-processing";
  if (/worktypekey:\s*publish/.test(text)) return "publish";
  return null;
}

async function loadMediaStatesByWatchId(
  db: DB,
  watchIds: string[],
): Promise<Map<string, WatchListProjectionMediaState[]>> {
  if (!watchIds.length) return new Map();

  const bindings = await dbOrTx(db).taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      targetId: { in: watchIds },
      taskItemId: { not: null },
    },
    select: {
      targetId: true,
      metadataJson: true,
      createdAt: true,
      taskItem: {
        select: {
          note: true,
          status: true,
          updatedAt: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const byWatchId = new Map<string, WatchListProjectionMediaState[]>();

  for (const binding of bindings) {
    const workTypeKey = workTypeKeyFromNote(binding.taskItem?.note);
    if (!workTypeKey) continue;

    const runtime = getQueueItemWorkflowState(binding);
    const item: WatchListProjectionMediaState = {
      watchId: binding.targetId,
      workTypeKey,
      workflowKey: runtime?.workflowKey ?? null,
      workflowState: runtime?.currentState ?? null,
      taskStatus: clean(binding.taskItem?.status) || null,
      updatedAt:
        runtime?.updatedAt ??
        binding.taskItem?.updatedAt?.toISOString() ??
        binding.createdAt.toISOString(),
    };

    byWatchId.set(binding.targetId, [
      ...(byWatchId.get(binding.targetId) ?? []),
      item,
    ]);
  }

  return byWatchId;
}

export async function loadWatchListProjectionSourceRows(
  db: DB,
  input: {
    watchIds?: string[] | null;
    productIds?: string[] | null;
    limit?: number | null;
    offset?: number | null;
  } = {},
): Promise<WatchListProjectionSourceRow[]> {
  const client = dbOrTx(db);
  const watchIds = Array.from(new Set((input.watchIds ?? []).map(clean).filter(Boolean)));
  const productIds = Array.from(new Set((input.productIds ?? []).map(clean).filter(Boolean)));
  const limit = Math.min(1000, Math.max(1, Number(input.limit || 500)));
  const offset = Math.max(0, Number(input.offset || 0));

  const where: Prisma.WatchWhereInput = {
    ...(watchIds.length ? { id: { in: watchIds } } : {}),
    ...(productIds.length ? { productId: { in: productIds } } : {}),
  };

  const rows = await client.watch.findMany({
    where,
    select: WATCH_LIST_SOURCE_SELECT,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: offset,
    take: limit,
  });

  const mediaStatesByWatchId = await loadMediaStatesByWatchId(
    db,
    rows.map((row) => row.id),
  );

  return rows.map((row) => ({
    ...row,
    __mediaState: mediaStatesByWatchId.get(row.id) ?? [],
  })) as WatchListProjectionSourceRow[];
}

export async function resolveWatchIdsForProjectionTarget(
  db: DB,
  input: {
    targetType?: string | null;
    targetId?: string | null;
  },
) {
  const targetType = clean(input.targetType).toUpperCase();
  const targetId = clean(input.targetId);
  if (!targetId) return [];

  if (targetType === "WATCH") return [targetId];

  if (targetType === "PRODUCT") {
    const row = await dbOrTx(db).watch.findUnique({
      where: { productId: targetId },
      select: { id: true },
    });
    return row?.id ? [row.id] : [];
  }

  if (targetType === "SERVICE_REQUEST") {
    return resolveWatchIdsForServiceRequest(db, targetId);
  }

  if (targetType === "TECHNICAL_ISSUE") {
    const issue = await dbOrTx(db).technicalIssue.findUnique({
      where: { id: targetId },
      select: { serviceRequestId: true },
    });
    return resolveWatchIdsForServiceRequest(db, issue?.serviceRequestId);
  }

  if (targetType === "PAYMENT") {
    const payment = await dbOrTx(db).payment.findUnique({
      where: { id: targetId },
      select: {
        service_request_id: true,
        technical_issue_id: true,
      },
    });

    if (payment?.service_request_id) {
      return resolveWatchIdsForServiceRequest(db, payment.service_request_id);
    }

    if (payment?.technical_issue_id) {
      const issue = await dbOrTx(db).technicalIssue.findUnique({
        where: { id: payment.technical_issue_id },
        select: { serviceRequestId: true },
      });
      return resolveWatchIdsForServiceRequest(db, issue?.serviceRequestId);
    }
  }

  return [];
}

async function resolveWatchIdsForServiceRequest(
  db: DB,
  serviceRequestId?: string | null,
) {
  const id = clean(serviceRequestId);
  if (!id) return [];

  const serviceRequest = await dbOrTx(db).serviceRequest.findUnique({
    where: { id },
    select: { productId: true },
  });
  const productId = clean(serviceRequest?.productId);
  if (!productId) return [];

  const watch = await dbOrTx(db).watch.findUnique({
    where: { productId },
    select: { id: true },
  });

  return watch?.id ? [watch.id] : [];
}
