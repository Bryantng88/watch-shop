import { ActivitySourceType, type Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";
import {
  getBusinessEventDefinition,
  listBusinessEventContracts,
} from "@/domains/event/catalog/business-event-catalog";

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

const TARGET_LABELS: Record<string, string> = {
  WATCH: "đồng hồ",
  ORDER: "đơn hàng",
  ACQUISITION: "phiếu nhập",
  PAYMENT: "thanh toán",
  SHIPMENT: "vận chuyển",
  SERVICE_REQUEST: "yêu cầu dịch vụ",
  TECHNICAL_ISSUE: "Technical Issue",
  TASK_ITEM: "công việc",
  STRAP: "dây đồng hồ",
};

const ACTION_LABELS: Record<string, string> = {
  "acquisition.created": "tạo phiếu nhập",
  "acquisition.updated": "cập nhật phiếu nhập",
  "acquisition.posted": "duyệt phiếu nhập",
  "technical_issue.confirmed": "xác nhận Technical Issue",
  "technical_issue.started": "bắt đầu một Technical Issue",
  "technical_issue.completed": "hoàn tất Technical Issue",
  "technical_issue.created": "tạo một Technical Issue",
  "payment.created": "tạo một khoản thanh toán",
  "payment.paid": "xác nhận đã thanh toán",
  "payment.status_updated": "cập nhật trạng thái thanh toán",
  "shipment.created": "tạo một vận chuyển",
  "shipment.shipped": "bàn giao đơn vị vận chuyển",
  "shipment.delivered": "xác nhận giao hàng thành công",
  "shipment.returned": "đánh dấu vận chuyển hoàn về",
  "order.created": "tạo một đơn hàng",
  "order.completed": "hoàn tất đơn hàng",
  "watch.media.photoshoot.requested": "yêu cầu photoshoot",
  "watch.media.photoshoot.completed": "hoàn tất photoshoot",
  "watch.media.asset.attached": "thêm media cho đồng hồ",
  "watch.media.ready_for_publish": "đưa media sang bước đăng bán",
  "watch.publish.assets.downloaded": "tải bộ media đăng bán",
  "watch.bought_back": "thu lại đồng hồ đã bán",
  "strap.created": "tạo dây đồng hồ",
  "strap.intake.requested": "đưa dây vào xử lý",
  "strap.stock.adjusted": "điều chỉnh tồn dây",
  "strap.installed": "gắn dây vào Watch",
  "strap.removed": "tháo dây khỏi Watch",
  "strap.links.adjusted": "điều chỉnh mắt dây",
};

const TITLE_ACTIONS: Record<string, string> = {
  "confirm issue": "xác nhận Technical Issue",
  "start issue": "bắt đầu một Technical Issue",
  "mark done": "hoàn tất Technical Issue",
  "complete issue": "hoàn tất Technical Issue",
  "request photoshoot": "yêu cầu photoshoot",
};

function friendlyActionLabel(eventKey: string, title: string, targetType: string) {
  const normalizedKey = eventKey.toLowerCase();
  const exact = ACTION_LABELS[normalizedKey];
  if (exact) return exact;

  const normalizedTitle = title.trim().toLowerCase();
  const titleAction = Object.entries(TITLE_ACTIONS).find(
    ([source]) =>
      normalizedTitle === source || normalizedTitle.endsWith(` ${source}`),
  )?.[1];
  if (titleAction) return titleAction;

  const target = TARGET_LABELS[targetType] || "đối tượng";
  const verb = normalizedKey.split(".").at(-1);
  const genericActions: Record<string, string> = {
    created: `tạo ${target}`,
    requested: `gửi yêu cầu cho ${target}`,
    confirmed: `xác nhận ${target}`,
    started: `bắt đầu xử lý ${target}`,
    updated: `cập nhật ${target}`,
    completed: `hoàn tất ${target}`,
    cancelled: `hủy ${target}`,
    canceled: `hủy ${target}`,
    approved: `duyệt ${target}`,
    rejected: `từ chối ${target}`,
    assigned: `phân công ${target}`,
    paid: `xác nhận thanh toán cho ${target}`,
    attached: `đính kèm dữ liệu cho ${target}`,
    downloaded: `tải dữ liệu của ${target}`,
    published: `đăng ${target}`,
    returned: `đánh dấu ${target} hoàn về`,
  };
  return genericActions[verb ?? ""] || getBusinessEventDefinition(eventKey)?.label || title;
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
  if (targetType === "STRAP") return `/admin/straps/${targetId}`;
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

  const acquisitionEventWhere: Prisma.BusinessEventLogWhereInput = {
    targetType: "ACQUISITION",
    eventKey: eventKey || undefined,
    actorUserId: actorUserId || undefined,
    createdAt: occurredAt ? { gte: occurredAt } : undefined,
    ...(targetType && targetType !== "ACQUISITION" ? { id: "__none__" } : {}),
    ...(query
      ? {
        OR: [
          { eventKey: { contains: query, mode: "insensitive" } },
          { targetId: { contains: query, mode: "insensitive" } },
        ],
      }
      : {}),
  };

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

  const [total, rows, actorRows, todayTotal, sourceGroups, acquisitionTotal, acquisitionRows, acquisitionToday] = await Promise.all([
    prisma.taskItemActivity.count({ where }),
    prisma.taskItemActivity.findMany({
      where,
      orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
      take: page * pageSize,
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
    prisma.businessEventLog.count({ where: acquisitionEventWhere }),
    prisma.businessEventLog.findMany({
      where: acquisitionEventWhere,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: page * pageSize,
      select: {
        id: true,
        eventKey: true,
        targetType: true,
        targetId: true,
        actorUserId: true,
        metadataJson: true,
        createdAt: true,
      },
    }),
    prisma.businessEventLog.count({
      where: { ...acquisitionEventWhere, createdAt: { gte: todayStart() } },
    }),
  ]);

  const projectedSourceIds = new Set(rows.map((row) => clean(row.sourceId)).filter(Boolean));
  const rawActorIds = Array.from(new Set(acquisitionRows.map((row) => clean(row.actorUserId)).filter(Boolean)));
  const rawActors = rawActorIds.length
    ? await prisma.user.findMany({
      where: { id: { in: rawActorIds } },
      select: { id: true, name: true, email: true, avatarUrl: true },
    })
    : [];
  const rawActorById = new Map(rawActors.map((actor) => [actor.id, actor]));

  const taskItems = rows.map((row) => {
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
      actionLabel: friendlyActionLabel(
        resolvedEventKey,
        row.title,
        resolvedTargetType,
      ),
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

  const acquisitionItems = acquisitionRows
    .filter((row) => !projectedSourceIds.has(row.id))
    .map((row) => {
      const metadata = metadataRecord(row.metadataJson);
      const actor = row.actorUserId ? rawActorById.get(row.actorUserId) ?? null : null;
      const type = clean(metadata.type).toUpperCase();
      const orderRef = clean(metadata.orderRefNo) || clean(metadata.sourceOrderRefNo) || clean(metadata.sourceOrderId);
      const body = [
        type ? `Loại phiếu: ${type}` : null,
        orderRef ? `Từ đơn hàng: ${orderRef}` : null,
      ].filter(Boolean).join(" · ") || null;

      return {
        id: `business-event:${row.id}`,
        sourceType: ActivitySourceType.BUSINESS_EVENT,
        eventKey: row.eventKey,
        title: row.eventKey,
        actionLabel: friendlyActionLabel(row.eventKey, row.eventKey, row.targetType),
        body,
        occurredAt: row.createdAt.toISOString(),
        targetType: row.targetType,
        targetId: row.targetId,
        targetHref: targetHref(row.targetType, row.targetId, row.targetId),
        taskItemId: row.targetId,
        taskItemTitle: type === "TRADE_IN" ? "Phiếu nhập Trade-in" : "Phiếu nhập",
        workspaceTitle: "Thu mua",
        actor: {
          id: actor?.id ?? null,
          label: actorLabel(actor ?? null),
          avatarUrl: actor?.avatarUrl ?? null,
          isSystem: !actor,
        },
      };
    });

  const items = [...taskItems, ...acquisitionItems]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice((page - 1) * pageSize, page * pageSize);

  const targetTypes = [...TARGET_TYPE_OPTIONS];
  const eventKeys = Array.from(new Set(
    listBusinessEventContracts().map((contract) => contract.key),
  )).sort();
  const actors = Array.from(new Map(
    [...actorRows.map((row) => row.actorUser), ...rawActors]
      .filter((actor): actor is NonNullable<typeof actor> => Boolean(actor))
      .map((actor) => [actor.id, actor]),
  ).values()).sort((a, b) => actorLabel(a).localeCompare(actorLabel(b), "vi"));
  const sourceCount = new Map(
    sourceGroups.map((group) => [group.sourceType, group._count._all]),
  );

  return {
    items,
    summary: {
      total: total + acquisitionTotal,
      today: todayTotal + acquisitionToday,
      businessEvents: (sourceCount.get(ActivitySourceType.BUSINESS_EVENT) ?? 0) + acquisitionTotal,
      systemUpdates: sourceCount.get(ActivitySourceType.SYSTEM) ?? 0,
    },
    filters: { query, targetType, eventKey, actorUserId, period },
    options: { targetTypes, eventKeys, actors },
    pagination: {
      page,
      pageSize,
      total: total + acquisitionTotal,
      totalPages: Math.max(1, Math.ceil((total + acquisitionTotal) / pageSize)),
    },
  };
}

export type GlobalActivityResult = Awaited<ReturnType<typeof listGlobalActivity>>;
