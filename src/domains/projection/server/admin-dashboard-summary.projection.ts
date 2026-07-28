import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import type { AdminDashboardData } from "@/domains/dashboard/shared";
import { getAdminDashboardService } from "@/domains/dashboard/server";
import { dbOrTx, type DB } from "@/server/db/client";
import { WATCH_LIST_PROJECTION_SOURCE_EVENTS } from "./watch-list";
import { upsertProjectionRecord } from "./projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";

export const ADMIN_DASHBOARD_SUMMARY_PROJECTION_KEY = "admin-dashboard-summary";
export const ADMIN_DASHBOARD_SUMMARY_PROJECTION_VERSION = 1;
const ROW_KEY = "global";

const SOURCE_EVENTS = [
  ...WATCH_LIST_PROJECTION_SOURCE_EVENTS,
  "acquisition.created",
  "acquisition.updated",
  "acquisition.items.updated",
  "acquisition.posted",
  "acquisition.canceled",
  "order.created",
  "order.updated",
  "order.posted",
  "order.cancelled",
  "shipment.created",
  "shipment.updated",
  "shipment.shipped",
  "shipment.delivered",
  "shipment.returning",
  "shipment.returned",
  "shipment.cancelled",
  "payment.created",
  "payment.status_updated",
  "payment.paid",
  "payment.refunded",
] as const;

function result(
  context: ProjectionBuildContext,
  scope: ProjectionScope,
  applied: number,
): ProjectionBuildResult {
  return {
    ok: true,
    status: applied ? "applied" : "skipped",
    projectionKey: context.projectionKey,
    projectionVersion: context.projectionVersion,
    scope,
    applied,
    skipped: applied ? 0 : 1,
    failed: 0,
  };
}

export async function rebuildAdminDashboardSummary(db: DB) {
  const data = await getAdminDashboardService(db);
  const generatedAt = new Date(data.generatedAt);
  await upsertProjectionRecord(db, {
    projectionKey: ADMIN_DASHBOARD_SUMMARY_PROJECTION_KEY,
    projectionVersion: ADMIN_DASHBOARD_SUMMARY_PROJECTION_VERSION,
    rowKey: ROW_KEY,
    entityType: "ADMIN_DASHBOARD",
    entityId: ROW_KEY,
    sortAt: generatedAt,
    sourceUpdatedAt: generatedAt,
    dataJson: data,
  });
  return data;
}

export async function queryAdminDashboardSummary(db: DB) {
  const row = await dbOrTx(db).projectionRecord.findFirst({
    where: {
      projectionKey: ADMIN_DASHBOARD_SUMMARY_PROJECTION_KEY,
      projectionVersion: ADMIN_DASHBOARD_SUMMARY_PROJECTION_VERSION,
      rowKey: ROW_KEY,
    },
    select: { dataJson: true },
  });
  return (row?.dataJson as AdminDashboardData | undefined) ?? null;
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  await rebuildAdminDashboardSummary(db);
  return result(context, {
    targetType: context.sourceEvent.targetType,
    targetId: context.sourceEvent.targetId,
  }, 1);
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  await rebuildAdminDashboardSummary(db);
  return result(context, context.scope, 1);
}

export const adminDashboardSummaryProjectionBuilder: ProjectionBuilder = {
  key: ADMIN_DASHBOARD_SUMMARY_PROJECTION_KEY,
  version: ADMIN_DASHBOARD_SUMMARY_PROJECTION_VERSION,
  description: "Global admin dashboard metrics, pipelines and recent activity.",
  sourceEvents: [...SOURCE_EVENTS],
  targetTypes: ["WATCH", "ACQUISITION", "ORDER", "SHIPMENT", "PAYMENT"],
  buildFromEvent,
  rebuild,
};
