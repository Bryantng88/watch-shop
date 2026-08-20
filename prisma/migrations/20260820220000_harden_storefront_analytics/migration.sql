ALTER TABLE "PurchaseRequest"
  ADD COLUMN IF NOT EXISTS "convertedAt" TIMESTAMPTZ(6);

UPDATE "PurchaseRequest"
SET "convertedAt" = "completedAt"
WHERE "outcome" = 'CONVERTED'
  AND "convertedAt" IS NULL;

ALTER TABLE "StorefrontAnalyticsEvent"
  ADD COLUMN IF NOT EXISTS "requestFingerprintHash" VARCHAR(64);

CREATE INDEX IF NOT EXISTS "StorefrontAnalyticsEvent_requestFingerprintHash_createdAt_idx"
  ON "StorefrontAnalyticsEvent" ("requestFingerprintHash", "createdAt" DESC);
