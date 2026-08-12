ALTER TABLE "PurchaseRequest"
ADD COLUMN "normalizedPhone" TEXT;

UPDATE "PurchaseRequest"
SET "normalizedPhone" = CASE
  WHEN regexp_replace("phone", '\\D', '', 'g') LIKE '84%'
    AND length(regexp_replace("phone", '\\D', '', 'g')) >= 10
    THEN '0' || substring(regexp_replace("phone", '\\D', '', 'g') FROM 3)
  ELSE regexp_replace("phone", '\\D', '', 'g')
END;

ALTER TABLE "PurchaseRequest"
ALTER COLUMN "normalizedPhone" SET NOT NULL;

CREATE INDEX "PurchaseRequest_normalizedPhone_status_updatedAt_idx"
ON "PurchaseRequest"("normalizedPhone", "status", "updatedAt" DESC);

CREATE TYPE "PurchaseRequestIngressDisposition" AS ENUM ('CREATED', 'MERGED');

CREATE TABLE "PurchaseRequestIngressReceipt" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "requestKey" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "purchaseRequestId" TEXT NOT NULL,
  "disposition" "PurchaseRequestIngressDisposition" NOT NULL,
  "addedItemCount" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PurchaseRequestIngressReceipt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PurchaseRequestIngressReceipt_purchaseRequestId_fkey"
    FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "PurchaseRequestIngressReceipt_requestKey_key"
ON "PurchaseRequestIngressReceipt"("requestKey");

CREATE INDEX "PurchaseRequestIngressReceipt_purchaseRequestId_createdAt_idx"
ON "PurchaseRequestIngressReceipt"("purchaseRequestId", "createdAt" DESC);

INSERT INTO "PurchaseRequestIngressReceipt" (
  "requestKey", "requestHash", "purchaseRequestId", "disposition", "addedItemCount", "createdAt"
)
SELECT "requestKey", "requestHash", "id", 'CREATED'::"PurchaseRequestIngressDisposition",
       (SELECT COUNT(*) FROM "PurchaseRequestItem" item WHERE item."purchaseRequestId" = request."id"),
       "createdAt"
FROM "PurchaseRequest" request
ON CONFLICT ("requestKey") DO NOTHING;

CREATE INDEX "Watch_style_updatedAt_idx"
ON "Watch"("style", "updatedAt" DESC);

CREATE INDEX "WatchSpecV2_caseSizeMM_idx"
ON "WatchSpecV2"("caseSizeMM");

CREATE INDEX "WatchSpecV2_braceletType_idx"
ON "WatchSpecV2"("braceletType");
