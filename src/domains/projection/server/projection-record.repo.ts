import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";

export type ProjectionRecordRow = {
  id: string;
  projectionKey: string;
  projectionVersion: number;
  rowKey: string;
  workspaceId: string | null;
  spaceId: string | null;
  entityType: string | null;
  entityId: string | null;
  status: string | null;
  searchText: string | null;
  sortAt: Date | null;
  dataJson: unknown;
  sourceUpdatedAt: Date | null;
  projectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectionRecordUpsertInput = {
  projectionKey: string;
  projectionVersion: number;
  rowKey: string;
  workspaceId?: string | null;
  spaceId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  status?: string | null;
  searchText?: string | null;
  sortAt?: Date | string | null;
  sourceUpdatedAt?: Date | string | null;
  dataJson: unknown;
};

export type ProjectionRecordListInput = {
  projectionKey: string;
  workspaceId?: string | null;
  status?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  limit?: number | null;
  offset?: number | null;
};

export type ProjectionRecordSummaryRow = {
  projectionKey: string;
  projectionVersion: number;
  status: string | null;
  count: bigint | number;
  latestProjectedAt: Date | null;
  latestSourceUpdatedAt: Date | null;
  oldestProjectedAt: Date | null;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function cleanNullable(value: unknown) {
  const text = clean(value);
  return text || null;
}

function dateNullable(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function intRange(value: number | null | undefined, fallback: number, max: number) {
  const number = Math.trunc(Number(value ?? fallback));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(0, number));
}

export async function upsertProjectionRecord(
  db: DB,
  input: ProjectionRecordUpsertInput,
) {
  const client = dbOrTx(db);
  const projectionKey = clean(input.projectionKey);
  const rowKey = clean(input.rowKey);

  if (!projectionKey) throw new Error("Missing projectionKey");
  if (!rowKey) throw new Error("Missing projection rowKey");

  await client.$executeRaw(
    Prisma.sql`
      INSERT INTO "ProjectionRecord" (
        "projectionKey",
        "projectionVersion",
        "rowKey",
        "workspaceId",
        "spaceId",
        "entityType",
        "entityId",
        "status",
        "searchText",
        "sortAt",
        "sourceUpdatedAt",
        "dataJson",
        "projectedAt",
        "updatedAt"
      )
      VALUES (
        ${projectionKey},
        ${input.projectionVersion},
        ${rowKey},
        ${cleanNullable(input.workspaceId)},
        ${cleanNullable(input.spaceId)},
        ${cleanNullable(input.entityType)},
        ${cleanNullable(input.entityId)},
        ${cleanNullable(input.status)},
        ${cleanNullable(input.searchText)},
        ${dateNullable(input.sortAt)},
        ${dateNullable(input.sourceUpdatedAt)},
        ${JSON.stringify(input.dataJson)}::jsonb,
        NOW(),
        NOW()
      )
      ON CONFLICT ("projectionKey", "rowKey")
      DO UPDATE SET
        "projectionVersion" = EXCLUDED."projectionVersion",
        "workspaceId" = EXCLUDED."workspaceId",
        "spaceId" = EXCLUDED."spaceId",
        "entityType" = EXCLUDED."entityType",
        "entityId" = EXCLUDED."entityId",
        "status" = EXCLUDED."status",
        "searchText" = EXCLUDED."searchText",
        "sortAt" = EXCLUDED."sortAt",
        "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt",
        "dataJson" = EXCLUDED."dataJson",
        "projectedAt" = NOW(),
        "updatedAt" = NOW()
    `,
  );
}

export async function listProjectionRecords(
  db: DB,
  input: ProjectionRecordListInput,
) {
  const client = dbOrTx(db);
  const projectionKey = clean(input.projectionKey);
  const limit = intRange(input.limit, 100, 500);
  const offset = intRange(input.offset, 0, 100000);

  if (!projectionKey) throw new Error("Missing projectionKey");

  return client.$queryRaw<ProjectionRecordRow[]>(
    Prisma.sql`
      SELECT
        "id",
        "projectionKey",
        "projectionVersion",
        "rowKey",
        "workspaceId",
        "spaceId",
        "entityType",
        "entityId",
        "status",
        "searchText",
        "sortAt",
        "dataJson",
        "sourceUpdatedAt",
        "projectedAt",
        "createdAt",
        "updatedAt"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${projectionKey}
        AND (${cleanNullable(input.workspaceId)}::text IS NULL OR "workspaceId" = ${cleanNullable(input.workspaceId)})
        AND (${cleanNullable(input.status)}::text IS NULL OR "status" = ${cleanNullable(input.status)})
        AND (${cleanNullable(input.entityType)}::text IS NULL OR "entityType" = ${cleanNullable(input.entityType)})
        AND (${cleanNullable(input.entityId)}::text IS NULL OR "entityId" = ${cleanNullable(input.entityId)})
      ORDER BY "sortAt" DESC NULLS LAST, "updatedAt" DESC, "rowKey" ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `,
  );
}

export async function summarizeProjectionRecords(
  db: DB,
  input: {
    projectionKey?: string | null;
    workspaceId?: string | null;
    spaceId?: string | null;
    entityType?: string | null;
    entityId?: string | null;
  } = {},
) {
  const client = dbOrTx(db);
  const projectionKey = cleanNullable(input.projectionKey);
  const workspaceId = cleanNullable(input.workspaceId);
  const spaceId = cleanNullable(input.spaceId);
  const entityType = cleanNullable(input.entityType);
  const entityId = cleanNullable(input.entityId);

  return client.$queryRaw<ProjectionRecordSummaryRow[]>(
    Prisma.sql`
      SELECT
        "projectionKey",
        "projectionVersion",
        "status",
        COUNT(*) AS "count",
        MAX("projectedAt") AS "latestProjectedAt",
        MAX("sourceUpdatedAt") AS "latestSourceUpdatedAt",
        MIN("projectedAt") AS "oldestProjectedAt"
      FROM "ProjectionRecord"
      WHERE (${projectionKey}::text IS NULL OR "projectionKey" = ${projectionKey})
        AND (${workspaceId}::text IS NULL OR "workspaceId" = ${workspaceId})
        AND (${spaceId}::text IS NULL OR "spaceId" = ${spaceId})
        AND (${entityType}::text IS NULL OR "entityType" = ${entityType})
        AND (${entityId}::text IS NULL OR "entityId" = ${entityId})
      GROUP BY "projectionKey", "projectionVersion", "status"
      ORDER BY "projectionKey" ASC, "projectionVersion" DESC, "status" ASC NULLS LAST
    `,
  );
}

export async function deleteProjectionRecords(
  db: DB,
  input: {
    projectionKey: string;
    workspaceId?: string | null;
    rowKeys?: string[] | null;
  },
) {
  const client = dbOrTx(db);
  const projectionKey = clean(input.projectionKey);
  const workspaceId = cleanNullable(input.workspaceId);
  const rowKeys = Array.from(
    new Set((input.rowKeys ?? []).map(clean).filter(Boolean)),
  );

  if (!projectionKey) throw new Error("Missing projectionKey");

  if (rowKeys.length) {
    await client.$executeRaw(
      Prisma.sql`
        DELETE FROM "ProjectionRecord"
        WHERE "projectionKey" = ${projectionKey}
          AND "rowKey" IN (${Prisma.join(rowKeys)})
      `,
    );
    return;
  }

  await client.$executeRaw(
    Prisma.sql`
      DELETE FROM "ProjectionRecord"
      WHERE "projectionKey" = ${projectionKey}
        AND (${workspaceId}::text IS NULL OR "workspaceId" = ${workspaceId})
    `,
  );
}
