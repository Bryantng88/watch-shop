CREATE TABLE IF NOT EXISTS "ProjectionEventDelivery" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "idempotencyKey" TEXT NOT NULL,
    "businessEventLogId" TEXT,
    "eventKey" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "effect" TEXT NOT NULL DEFAULT 'ASSERT',
    "revokeEventKey" TEXT,
    "targetAliasIds" JSONB,
    "eventInstanceId" TEXT,
    "payloadJson" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectionEventDelivery_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProjectionEventDelivery_businessEventLogId_fkey"
      FOREIGN KEY ("businessEventLogId") REFERENCES "BusinessEventLog"("id")
      ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProjectionEventDelivery_idempotencyKey_key"
  ON "ProjectionEventDelivery"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "ProjectionEventDelivery_status_nextAttemptAt_idx"
  ON "ProjectionEventDelivery"("status", "nextAttemptAt");
CREATE INDEX IF NOT EXISTS "ProjectionEventDelivery_businessEventLogId_idx"
  ON "ProjectionEventDelivery"("businessEventLogId");
CREATE INDEX IF NOT EXISTS "ProjectionEventDelivery_eventKey_targetType_idx"
  ON "ProjectionEventDelivery"("eventKey", "targetType");
CREATE INDEX IF NOT EXISTS "ProjectionEventDelivery_targetType_targetId_idx"
  ON "ProjectionEventDelivery"("targetType", "targetId");
