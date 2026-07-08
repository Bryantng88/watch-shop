CREATE TABLE "ProjectionRecord" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "projectionKey" TEXT NOT NULL,
  "projectionVersion" INTEGER NOT NULL,
  "rowKey" TEXT NOT NULL,
  "workspaceId" TEXT,
  "spaceId" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "status" TEXT,
  "searchText" TEXT,
  "sortAt" TIMESTAMP(3),
  "dataJson" JSONB NOT NULL,
  "sourceUpdatedAt" TIMESTAMP(3),
  "projectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProjectionRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectionRecord_projectionKey_rowKey_key"
  ON "ProjectionRecord"("projectionKey", "rowKey");

CREATE INDEX "ProjectionRecord_projectionKey_workspaceId_status_sortAt_idx"
  ON "ProjectionRecord"("projectionKey", "workspaceId", "status", "sortAt");

CREATE INDEX "ProjectionRecord_projectionKey_entityType_entityId_idx"
  ON "ProjectionRecord"("projectionKey", "entityType", "entityId");

CREATE INDEX "ProjectionRecord_projectionKey_projectedAt_idx"
  ON "ProjectionRecord"("projectionKey", "projectedAt");
