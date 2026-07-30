import { ActivitySourceType, type Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { listBusinessEventContracts } from "@/domains/event/catalog/business-event-catalog";

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;
const TARGET_TYPE_OPTIONS = [
  "WATCH",
  "ORDER",
  "ACQUISITION",
  "PAYMENT",
  "SHIPMENT",
  "SERVICE_REQUEST",
  "TECHNICAL_ISSUE",
  "TASK_ITEM",
] as const;

export type GlobalActivityQuery = {
  query?: string;
  targetType?: string;
  eventKey?: string;
  actorUserId?: string;
  period?: "TODAY" | "7D" | "30D" | "ALL";
  page?: number;
  pageSize?: number;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function positiveInt(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function metadataRecord(value: Prisma.JsonValue | null) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function actorLabel(actor: { name: string | null; email: string | null } | null) {
  return actor?.name?.trim() || actor?.email?.trim() || "Hệ thống";
}

function periodStart(period: GlobalActivityQuery["period"]) {
  const now = new Date();
  if (period === "TODAY") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "7D" || period === "30D") {
    const date = new Date(now);
    date.setDate(date.getDate() - (period === "7D" ? 7 : 30));
    return date;
  }
  return null;
}

function todayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function targetHref(targetType: string, targetId: string, taskItemId: string) {
  if (targetType === "WATCH") return `/admin/watches/${targetId}`;
  if (targetType === "ORDER") return `/admin/orders?search=${encodeURIComponent(targetId)}`;
  if (targetType === "ACQUISITION") {
    return `/admin/acquisitions?search=${encodeURIComponent(targetId)}`;
  }
  if (targetType === "PAYMENT") {
    return `/admin/coordination/operation?context=PAYMENT&view=payment-flow&search=${encodeURIComponent(targetId)}`;
  }
  if (targetType === "SHIPMENT") {
    return `/admin/shipments?search=${encodeURIComponent(targetId)}`;
  }
  if (targetType === "TECHNICAL_ISSUE" || targetType === "SERVICE_REQUEST") {
    return `/admin/coordination/operation?context=OPERATION&view=technical-issue-flow&search=${encodeURIComponent(targetId)}`;
  }
  return `/admin/task-items/${taskItemId}`;
}

export async function listGlobalActivity(input: GlobalActivityQuery) {
  const query = clean(input.query);
  const targetType = clean(input.targetType).toUpperCase();
  const eventKey = clean(input.eventKey);
  const actorUserId = clean(input.actorUserId);
  const period = input.period ?? "7D";
  const page = positiveInt(input.page, 1);
  const requestedPageSize = positiveInt(input.pageSize, 50);
  const pageSize = PAGE_SIZE_OPTIONS.includes(requestedPageSize as 20 | 50 | 100)
    ? requestedPageSize
    : 50;
  const occurredAt = periodStart(period);

  const where: Prisma.TaskItemActivityWhereInput = {
    sourceType: {
      in: [ActivitySourceType.BUSINESS_EVENT, ActivitySourceType.SYSTEM],
    },
    actorUserId: actorUserId || undefined,
    occurredAt: occurredAt ? { gte: occurredAt } : undefined,
    AND: [
      ...(targetType
        ? [{ metadataJson: { path: ["targetType"], equals: targetType } }]
        : []),
      ...(eventKey
        ? [{ metadataJson: { path: ["eventKey"], equals: eventKey } }]
        : []),
      ...(query
        ? [{
            OR: [
              { title: { contains: query, mode: "insensitive" as const } },
              { body: { contains: query, mode: "insensitive" as const } },
              { sourceId: { contains: query, mode: "insensitive" as const } },
              { taskItem: { title: { contains: query, mode: "insensitive" as const } } },
              { actorUser: { name: { contains: query, mode: "insensitive" as const } } },
              { actorUser: { email: { contains: query, mode: "insensitive" as const } } },
            ],
          }]
        : []),
    ],
  };

  const [total, rows, actorRows, todayTotal, sourceGroups] = await Promise.all([
    prisma.taskItemActivity.count({ where }),
    prisma.taskItemActivity.findMany({
      where,
      orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        taskItemId: true,
        sourceType: true,
        sourceId: true,
        title: true,
        body: true,
        occurredAt: true,
        metadataJson: true,
        actorUser: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        taskItem: {
          select: {
            id: true,
            title: true,
            task: { select: { id: true, title: true } },
          },
        },
      },
    }),
    prisma.taskItemActivity.findMany({
      where: {
        sourceType: {
          in: [ActivitySourceType.BUSINESS_EVENT, ActivitySourceType.SYSTEM],
        },
        actorUserId: { not: null },
      },
      distinct: ["actorUserId"],
      take: 200,
      select: {
        actorUser: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    }),
    prisma.taskItemActivity.count({
      where: {
        ...where,
        occurredAt: { gte: todayStart() },
      },
    }),
    prisma.taskItemActivity.groupBy({
      by: ["sourceType"],
      where,
      _count: { _all: true },
    }),
  ]);

  const items = rows.map((row) => {
    const metadata = metadataRecord(row.metadataJson);
    const resolvedTargetType = clean(metadata.targetType).toUpperCase() || "TASK_ITEM";
    const resolvedTargetId = clean(metadata.targetId) || row.taskItemId;
    const resolvedEventKey =
      clean(metadata.eventKey) ||
      (row.sourceType === ActivitySourceType.SYSTEM ? "system.activity" : "business.event");

    return {
      id: row.id,
      sourceType: row.sourceType,
      eventKey: resolvedEventKey,
      title: row.title,
      body: row.body,
      occurredAt: row.occurredAt.toISOString(),
      targetType: resolvedTargetType,
      targetId: resolvedTargetId,
      targetHref: targetHref(resolvedTargetType, resolvedTargetId, row.taskItemId),
      taskItemId: row.taskItemId,
      taskItemTitle: row.taskItem.title,
      workspaceTitle: row.taskItem.task.title,
      actor: {
        id: row.actorUser?.id ?? null,
        label: actorLabel(row.actorUser),
        avatarUrl: row.actorUser?.avatarUrl ?? null,
        isSystem: !row.actorUser,
      },
    };
  });

  const targetTypes = [...TARGET_TYPE_OPTIONS];
  const eventKeys = Array.from(new Set(
    listBusinessEventContracts().map((contract) => contract.key),
  )).sort();
  const actors = actorRows
    .map((row) => row.actorUser)
    .filter((actor): actor is NonNullable<typeof actor> => Boolean(actor))
    .sort((a, b) => actorLabel(a).localeCompare(actorLabel(b), "vi"));
  const sourceCount = new Map(
    sourceGroups.map((group) => [group.sourceType, group._count._all]),
  );

  return {
    items,
    summary: {
      total,
      today: todayTotal,
      businessEvents: sourceCount.get(ActivitySourceType.BUSINESS_EVENT) ?? 0,
      systemUpdates: sourceCount.get(ActivitySourceType.SYSTEM) ?? 0,
    },
    filters: { query, targetType, eventKey, actorUserId, period },
    options: { targetTypes, eventKeys, actors },
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

export type GlobalActivityResult = Awaited<ReturnType<typeof listGlobalActivity>>;
