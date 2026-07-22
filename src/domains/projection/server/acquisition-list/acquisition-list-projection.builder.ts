import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { listAdminAcquisitionsFromSource } from "@/domains/acquisition/server/list/acquisition-list.repo";
import type { AcquisitionListProjectionRow } from "@/domains/acquisition/shared/acquisition-list.projection";
import { deleteProjectionRecords, upsertProjectionRecord } from "../projection-record.repo";
import type { ProjectionBuildContext, ProjectionBuildResult, ProjectionBuilder, ProjectionScope } from "../projection.types";
import {
  ACQUISITION_LIST_PROJECTION_KEY,
  ACQUISITION_LIST_PROJECTION_SOURCE_EVENTS,
  ACQUISITION_LIST_PROJECTION_VERSION,
} from "./acquisition-list-projection.constants";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function searchText(row: AcquisitionListProjectionRow) {
  return [
    row.refNo,
    row.vendorName,
    row.acquisitionType,
    row.notes,
    ...row.detailItems.flatMap((item) => [item.title, item.subtitle, item.linkedWatchSku]),
  ].filter(Boolean).join(" ").toLowerCase();
}

async function upsertRows(db: DB, rows: AcquisitionListProjectionRow[]) {
  for (const row of rows) {
    await upsertProjectionRecord(db, {
      projectionKey: ACQUISITION_LIST_PROJECTION_KEY,
      projectionVersion: ACQUISITION_LIST_PROJECTION_VERSION,
      rowKey: row.id,
      entityType: "ACQUISITION",
      entityId: row.id,
      status: row.approvalStatus,
      searchText: searchText(row),
      sortAt: row.updatedAt,
      sourceUpdatedAt: row.updatedAt,
      dataJson: row,
    });
  }
}

function buildResult(context: ProjectionBuildContext, scope: ProjectionScope, applied: number, reason?: string): ProjectionBuildResult {
  return {
    ok: true,
    status: applied ? "applied" : "skipped",
    projectionKey: context.projectionKey,
    projectionVersion: context.projectionVersion,
    scope,
    applied,
    skipped: applied ? 0 : 1,
    failed: 0,
    reason: applied ? undefined : reason,
  };
}

async function resolveAcquisitionId(db: DB, targetType: unknown, targetId: unknown) {
  const type = clean(targetType).toUpperCase();
  const id = clean(targetId);
  if (!id) return null;
  if (type === "ACQUISITION") return id;
  if (type !== "PAYMENT") return null;

  const payment = await dbOrTx(db).payment.findUnique({
    where: { id },
    select: { acquisition_id: true },
  });
  return payment?.acquisition_id ?? null;
}

export async function rebuildAcquisitionListProjectionRows(
  db: DB,
  input: { acquisitionIds?: string[]; limit?: number | null } = {},
) {
  const ids = [...new Set((input.acquisitionIds ?? []).map(clean).filter(Boolean))];
  const scoped = ids.length > 0;
  const pageSize = Math.min(500, Math.max(1, Number(input.limit ?? 200)));
  let page = 1;
  let applied = 0;

  if (!scoped) {
    await deleteProjectionRecords(db, { projectionKey: ACQUISITION_LIST_PROJECTION_KEY });
  }

  for (;;) {
    const source = await listAdminAcquisitionsFromSource(
      { view: "all", page, pageSize, sort: "updatedDesc" },
      ids,
    );
    if (scoped) {
      await deleteProjectionRecords(db, {
        projectionKey: ACQUISITION_LIST_PROJECTION_KEY,
        rowKeys: ids,
      });
    }
    await upsertRows(db, source.items);
    applied += source.items.length;
    if (scoped || page >= source.totalPages) break;
    page += 1;
  }

  return applied;
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const acquisitionId = await resolveAcquisitionId(db, context.scope.targetType, context.scope.targetId);
  const hasScope = Boolean(clean(context.scope.targetType) || clean(context.scope.targetId));
  if (hasScope && !acquisitionId) {
    return buildResult(context, context.scope, 0, "ACQUISITION_LIST_TARGET_NOT_FOUND");
  }
  const applied = await rebuildAcquisitionListProjectionRows(db, {
    acquisitionIds: acquisitionId ? [acquisitionId] : [],
    limit: context.scope.limit,
  });
  return buildResult(context, context.scope, applied, "NO_ACQUISITION_ROWS");
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  return rebuild(db, {
    ...context,
    scope: {
      targetType: context.sourceEvent.targetType,
      targetId: context.sourceEvent.targetId,
      limit: 10,
    },
  });
}

export const acquisitionListProjectionBuilder: ProjectionBuilder = {
  key: ACQUISITION_LIST_PROJECTION_KEY,
  version: ACQUISITION_LIST_PROJECTION_VERSION,
  description: "Persistent read model for Admin Acquisition List rows.",
  sourceEvents: [...ACQUISITION_LIST_PROJECTION_SOURCE_EVENTS],
  targetTypes: ["ACQUISITION", "PAYMENT"],
  buildFromEvent,
  rebuild,
};
