CREATE TYPE "PurchaseRequestStatus" AS ENUM ('WAITING', 'PROCESSING', 'COMPLETED');
CREATE TYPE "PurchaseRequestOutcome" AS ENUM ('CONVERTED', 'REJECTED', 'CANCELLED', 'EXPIRED', 'DUPLICATE');
CREATE TYPE "PurchaseRequestContactPreference" AS ENUM ('PHONE', 'ZALO');

CREATE TABLE "PurchaseRequest" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "reference" TEXT NOT NULL,
  "status" "PurchaseRequestStatus" NOT NULL DEFAULT 'WAITING',
  "outcome" "PurchaseRequestOutcome",
  "channel" TEXT NOT NULL,
  "externalRequestId" TEXT,
  "requestKey" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "fingerprintHash" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "contactPreference" "PurchaseRequestContactPreference" NOT NULL DEFAULT 'PHONE',
  "address" TEXT,
  "city" TEXT,
  "district" TEXT,
  "ward" TEXT,
  "customerNote" TEXT,
  "processingNote" TEXT,
  "completionReason" TEXT,
  "assignedUserId" TEXT,
  "followUpAt" TIMESTAMPTZ(6),
  "processingStartedAt" TIMESTAMPTZ(6),
  "completedAt" TIMESTAMPTZ(6),
  "orderId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PurchaseRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PurchaseRequestItem" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "purchaseRequestId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "titleSnapshot" TEXT NOT NULL,
  "listPriceSnapshot" DECIMAL(12,2) NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PurchaseRequestItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PurchaseRequest_reference_key" ON "PurchaseRequest"("reference");
CREATE UNIQUE INDEX "PurchaseRequest_requestKey_key" ON "PurchaseRequest"("requestKey");
CREATE UNIQUE INDEX "PurchaseRequest_orderId_key" ON "PurchaseRequest"("orderId");
CREATE UNIQUE INDEX "PurchaseRequest_channel_external_key" ON "PurchaseRequest"("channel", "externalRequestId");
CREATE INDEX "PurchaseRequest_status_createdAt_idx" ON "PurchaseRequest"("status", "createdAt" DESC);
CREATE INDEX "PurchaseRequest_fingerprintHash_createdAt_idx" ON "PurchaseRequest"("fingerprintHash", "createdAt");
CREATE INDEX "PurchaseRequest_assignedUserId_status_idx" ON "PurchaseRequest"("assignedUserId", "status");
CREATE UNIQUE INDEX "PurchaseRequestItem_purchaseRequestId_productId_key" ON "PurchaseRequestItem"("purchaseRequestId", "productId");
CREATE INDEX "PurchaseRequestItem_productId_idx" ON "PurchaseRequestItem"("productId");

ALTER TABLE "PurchaseRequest"
  ADD CONSTRAINT "PurchaseRequest_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PurchaseRequestItem"
  ADD CONSTRAINT "PurchaseRequestItem_purchaseRequestId_fkey"
  FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PurchaseRequestItem"
  ADD CONSTRAINT "PurchaseRequestItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
