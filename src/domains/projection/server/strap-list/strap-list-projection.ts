import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { deleteProjectionRecords, upsertProjectionRecord } from "../projection-record.repo";
import type { ProjectionBuildContext, ProjectionBuildResult, ProjectionBuilder, ProjectionScope } from "../projection.types";

export const STRAP_LIST_PROJECTION_KEY = "strap-list";
// v3 rebuilds rows that were missed when acquisition posting did not emit
// strap.created events.
export const STRAP_LIST_PROJECTION_VERSION = 4;
export const STRAP_LIST_SOURCE_EVENTS = [
  "strap.created",
  "strap.updated",
  "strap.intake.requested",
  "strap.received",
  "strap.stock.adjusted",
  "strap.installed",
  "strap.removed",
  "strap.clasp.updated",
  "strap.links.adjusted",
  "strap.processing.completed",
] as const;

export type StrapListProjectionRow = {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  sku: string | null;
  imageUrl: string | null;
  material: string;
  lugWidthMM: number;
  buckleWidthMM: number | null;
  color: string | null;
  originType: string;
  brandName: string | null;
  leatherType: string | null;
  surface: string | null;
  inventoryPolicy: string;
  claspType: string | null;
  stockQty: number;
  minStockQty: number;
  targetStockQty: number;
  attachedWatch: { id: string; productId: string; title: string } | null;
  lowStock: boolean;
  updatedAt: string;
};

function result(context: ProjectionBuildContext, scope: ProjectionScope, applied: number, reason?: string): ProjectionBuildResult {
  return {
    ok: true,
    status: applied ? "applied" : "skipped",
    projectionKey: STRAP_LIST_PROJECTION_KEY,
    projectionVersion: STRAP_LIST_PROJECTION_VERSION,
    scope,
    applied,
    skipped: applied ? 0 : 1,
    failed: 0,
    reason: applied ? undefined : reason,
  };
}

async function sourceRows(db: DB, variantIds?: string[]) {
  const client = dbOrTx(db);
  const variants = await client.productVariant.findMany({
    where: {
      ...(variantIds?.length ? { id: { in: variantIds } } : {}),
      Product: { type: "WATCH_STRAP" },
    },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      sku: true,
      stockQty: true,
      updatedAt: true,
      Product: { select: { id: true, title: true, primaryImageUrl: true, status: true, specStatus: true } },
      StrapVariantSpec: true,
      strapInstallations: {
        where: { removedAt: null },
        take: 1,
        select: {
          watch: { select: { id: true, productId: true, product: { select: { title: true } } } },
        },
      },
    },
  });

  return variants.flatMap((variant): StrapListProjectionRow[] => {
    const spec = variant.StrapVariantSpec;
    if (!spec || variant.Product.status !== "AVAILABLE" || variant.Product.specStatus === "MERGED") return [];
    const active = variant.strapInstallations[0]?.watch;
    const stocked = spec.inventoryPolicy === "STOCKED";
    return [{
      id: variant.id,
      productId: variant.Product.id,
      variantId: variant.id,
      title: variant.Product.title,
      sku: variant.sku,
      imageUrl: variant.Product.primaryImageUrl,
      material: String(spec.material),
      lugWidthMM: spec.lugWidthMM,
      buckleWidthMM: spec.buckleWidthMM,
      color: spec.color,
      originType: String(spec.originType),
      brandName: spec.brandName,
      leatherType: spec.leatherType,
      surface: spec.surface ? String(spec.surface) : null,
      inventoryPolicy: String(spec.inventoryPolicy),
      claspType: spec.claspType ? String(spec.claspType) : null,
      stockQty: variant.stockQty,
      minStockQty: spec.minStockQty,
      targetStockQty: spec.targetStockQty,
      attachedWatch: active ? { id: active.id, productId: active.productId, title: active.product.title } : null,
      lowStock: stocked && variant.stockQty <= spec.minStockQty,
      updatedAt: variant.updatedAt.toISOString(),
    }];
  });
}

export async function rebuildStrapListRows(db: DB, variantIds?: string[]) {
  const rows = await sourceRows(db, variantIds);
  if (!variantIds?.length) await deleteProjectionRecords(db, { projectionKey: STRAP_LIST_PROJECTION_KEY });
  for (const row of rows) {
    await upsertProjectionRecord(db, {
      projectionKey: STRAP_LIST_PROJECTION_KEY,
      projectionVersion: STRAP_LIST_PROJECTION_VERSION,
      rowKey: row.variantId,
      entityType: "STRAP",
      entityId: row.variantId,
      spaceId: row.productId,
      status: row.attachedWatch ? "WATCH_ATTACHED" : row.lowStock ? "LOW_STOCK" : "AVAILABLE",
      searchText: [row.title, row.sku, row.material, row.color, `${row.lugWidthMM}-${row.buckleWidthMM ?? ""}`].filter(Boolean).join(" ").toLowerCase(),
      sortAt: row.updatedAt,
      sourceUpdatedAt: row.updatedAt,
      dataJson: row,
    });
  }
  return rows.length;
}

async function rebuild(db: DB, context: ProjectionBuildContext & { scope: ProjectionScope }) {
  const targetId = String(context.scope.targetId ?? "").trim();
  const ids = String(context.scope.targetType ?? "").toUpperCase() === "STRAP" && targetId ? [targetId] : undefined;
  const applied = await rebuildStrapListRows(db, ids);
  return result(context, context.scope, applied, "NO_STRAP_ROWS");
}

async function buildFromEvent(db: DB, context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext }) {
  return rebuild(db, { ...context, scope: { targetType: "STRAP", targetId: context.sourceEvent.targetId } });
}

export const strapListProjectionBuilder: ProjectionBuilder = {
  key: STRAP_LIST_PROJECTION_KEY,
  version: STRAP_LIST_PROJECTION_VERSION,
  description: "Projection-backed Strap list and replenishment source.",
  sourceEvents: [...STRAP_LIST_SOURCE_EVENTS],
  targetTypes: ["STRAP"],
  buildFromEvent,
  rebuild,
};
