CREATE TYPE "PurchaseRequestItemDecision" AS ENUM ('PENDING', 'SELECTED', 'DECLINED', 'UNAVAILABLE');
CREATE TYPE "PurchaseRequestActivityType" AS ENUM ('ASSIGNED', 'CONTACT_ATTEMPT', 'NOTE', 'FOLLOW_UP', 'STATUS_CHANGED');

ALTER TABLE "PurchaseRequestItem"
  ADD COLUMN "decision" "PurchaseRequestItemDecision" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "agreedPrice" DECIMAL(12,2),
  ADD COLUMN "decisionReason" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "PurchaseRequestActivity" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "purchaseRequestId" TEXT NOT NULL,
  "type" "PurchaseRequestActivityType" NOT NULL,
  "note" TEXT,
  "actorUserId" TEXT,
  "followUpAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PurchaseRequestActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PurchaseRequestActivity_purchaseRequestId_createdAt_idx"
  ON "PurchaseRequestActivity"("purchaseRequestId", "createdAt" DESC);
CREATE INDEX "PurchaseRequestActivity_actorUserId_createdAt_idx"
  ON "PurchaseRequestActivity"("actorUserId", "createdAt" DESC);

ALTER TABLE "PurchaseRequestActivity"
  ADD CONSTRAINT "PurchaseRequestActivity_purchaseRequestId_fkey"
  FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PurchaseRequest"
  DROP CONSTRAINT IF EXISTS "PurchaseRequest_assignedUserId_fkey";
UPDATE "PurchaseRequest" pr
SET "assignedUserId" = NULL
WHERE "assignedUserId" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "User" u WHERE u."id" = pr."assignedUserId");
ALTER TABLE "PurchaseRequest"
  ADD CONSTRAINT "PurchaseRequest_assignedUserId_fkey"
  FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PurchaseRequestActivity"
  ADD CONSTRAINT "PurchaseRequestActivity_actorUserId_fkey"
  FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
