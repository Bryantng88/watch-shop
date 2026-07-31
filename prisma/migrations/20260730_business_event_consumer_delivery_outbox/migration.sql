CREATE TABLE IF NOT EXISTS "BusinessEventConsumerDelivery" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "idempotencyKey" TEXT NOT NULL,
    "operationKey" TEXT NOT NULL,
    "businessEventLogId" TEXT,
    "consumerKey" TEXT NOT NULL,
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
    "resultJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BusinessEventConsumerDelivery_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BusinessEventConsumerDelivery_businessEventLogId_fkey"
      FOREIGN KEY ("businessEventLogId") REFERENCES "BusinessEventLog"("id")
      ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "BusinessEventConsumerDelivery_idempotencyKey_key"
  ON "BusinessEventConsumerDelivery"("idempotencyKey");
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessEventConsumerDelivery_operationKey_consumerKey_key"
  ON "BusinessEventConsumerDelivery"("operationKey", "consumerKey");
CREATE INDEX IF NOT EXISTS "BusinessEventConsumerDelivery_status_nextAttemptAt_idx"
  ON "BusinessEventConsumerDelivery"("status", "nextAttemptAt");
CREATE INDEX IF NOT EXISTS "BusinessEventConsumerDelivery_businessEventLogId_idx"
  ON "BusinessEventConsumerDelivery"("businessEventLogId");
CREATE INDEX IF NOT EXISTS "BusinessEventConsumerDelivery_operationKey_status_idx"
  ON "BusinessEventConsumerDelivery"("operationKey", "status");
CREATE INDEX IF NOT EXISTS "BusinessEventConsumerDelivery_eventKey_consumerKey_idx"
  ON "BusinessEventConsumerDelivery"("eventKey", "consumerKey");
