import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { AcquisitionListFilters } from "@/domains/acquisition/shared/search-params";
import type { AcquisitionListProjectionResult, AcquisitionListProjectionRow } from "@/domains/acquisition/shared/acquisition-list.projection";
import { ACQUISITION_LIST_PROJECTION_KEY } from "./acquisition-list-projection.constants";

type ProjectionJsonRow = { dataJson: AcquisitionListProjectionRow };
type CountRow = { count: bigint | number };

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeStatus(value: unknown) {
  const status = clean(value).toUpperCase();
  return status === "CANCELLED" ? "CANCELED" : status;
}

function statusCondition(input: AcquisitionListFilters) {
  const requested = normalizeStatus(input.status);
  if (requested) return Prisma.sql`"status" = ${requested}`;

  const view = clean(input.view).toLowerCase();
  if (!view || view === "all") return null;
  if (view === "open") return Prisma.sql`COALESCE("status", '') NOT IN ('POSTED', 'CANCELED')`;
  if (view === "cancelled") return Prisma.sql`"status" = 'CANCELED'`;
  return Prisma.sql`"status" = ${normalizeStatus(view)}`;
}

function conditions(input: AcquisitionListFilters) {
  const result: Prisma.Sql[] = [
    Prisma.sql`"projectionKey" = ${ACQUISITION_LIST_PROJECTION_KEY}`,
  ];
  const status = statusCondition(input);
  if (status) result.push(status);
  if (clean(input.q)) result.push(Prisma.sql`COALESCE("searchText", '') ILIKE ${`%${clean(input.q)}%`}`);
  if (clean(input.audienceSegment)) {
    result.push(
      Prisma.sql`COALESCE("dataJson"->>'audienceSegment', 'MEN') = ${clean(input.audienceSegment).toUpperCase()}`,
    );
  }
  if (clean(input.vendorId)) result.push(Prisma.sql`"dataJson"->>'vendorId' = ${clean(input.vendorId)}`);
  if (clean(input.type)) result.push(Prisma.sql`"dataJson"->>'acquisitionType' = ${clean(input.type)}`);
  return result;
}

function orderBy(sort: AcquisitionListFilters["sort"]) {
  switch (sort) {
    case "updatedAsc": return Prisma.sql`"sortAt" ASC NULLS LAST, "rowKey" ASC`;
    case "createdDesc": return Prisma.sql`("dataJson"->>'createdAt')::timestamptz DESC NULLS LAST, "rowKey" ASC`;
    case "createdAsc": return Prisma.sql`("dataJson"->>'createdAt')::timestamptz ASC NULLS LAST, "rowKey" ASC`;
    case "acquiredDesc": return Prisma.sql`("dataJson"->>'acquiredAt')::timestamptz DESC NULLS LAST, "rowKey" ASC`;
    case "acquiredAsc": return Prisma.sql`("dataJson"->>'acquiredAt')::timestamptz ASC NULLS LAST, "rowKey" ASC`;
    default: return Prisma.sql`"sortAt" DESC NULLS LAST, "rowKey" ASC`;
  }
}

export async function queryAcquisitionListProjection(db: DB, input: AcquisitionListFilters) {
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20)));
  const offset = (page - 1) * pageSize;
  const where = Prisma.join(conditions(input), " AND ");

  const [rows, counts, projectionCounts] = await Promise.all([
    client.$queryRaw<ProjectionJsonRow[]>(Prisma.sql`
      SELECT "dataJson" FROM "ProjectionRecord"
      WHERE ${where}
      ORDER BY ${orderBy(input.sort)}
      LIMIT ${pageSize} OFFSET ${offset}
    `),
    client.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS "count" FROM "ProjectionRecord" WHERE ${where}
    `),
    client.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS "count" FROM "ProjectionRecord"
      WHERE "projectionKey" = ${ACQUISITION_LIST_PROJECTION_KEY}
    `),
  ]);

  const total = Number(counts[0]?.count ?? 0);
  return {
    items: rows.map((row) => row.dataJson),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    projectionRowCount: Number(projectionCounts[0]?.count ?? 0),
  } satisfies AcquisitionListProjectionResult & { projectionRowCount: number };
}
