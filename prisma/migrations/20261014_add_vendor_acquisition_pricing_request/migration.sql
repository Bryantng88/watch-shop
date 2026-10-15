CREATE TYPE "VendorAcquisitionPricingRequestStatus" AS ENUM ('OPEN', 'SUBMITTED', 'EXPIRED', 'REVOKED');

CREATE TABLE "VendorAcquisitionPricingRequest" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "vendorId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "VendorAcquisitionPricingRequestStatus" NOT NULL DEFAULT 'OPEN',
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "notes" TEXT,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "submittedAt" TIMESTAMPTZ(6),
    "revokedAt" TIMESTAMPTZ(6),
    "createdByUserId" TEXT,
    "submittedAcquisitionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VendorAcquisitionPricingRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VendorAcquisitionPricingItem" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "requestId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "audienceSegment" "AudienceSegment" NOT NULL DEFAULT 'MEN',
    "imageStorageKey" TEXT,
    "imageMediaObjectId" TEXT,
    "vendorNote" TEXT,
    "unitCost" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VendorAcquisitionPricingItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VendorAcquisitionPricingRequest_tokenHash_key" ON "VendorAcquisitionPricingRequest"("tokenHash");
CREATE UNIQUE INDEX "VendorAcquisitionPricingRequest_submittedAcquisitionId_key" ON "VendorAcquisitionPricingRequest"("submittedAcquisitionId");
CREATE INDEX "VendorAcquisitionPricingRequest_vendorId_status_createdAt_idx" ON "VendorAcquisitionPricingRequest"("vendorId", "status", "createdAt");
CREATE INDEX "VendorAcquisitionPricingRequest_status_expiresAt_idx" ON "VendorAcquisitionPricingRequest"("status", "expiresAt");
CREATE INDEX "VendorAcquisitionPricingItem_requestId_sortOrder_idx" ON "VendorAcquisitionPricingItem"("requestId", "sortOrder");
CREATE INDEX "VendorAcquisitionPricingItem_imageMediaObjectId_idx" ON "VendorAcquisitionPricingItem"("imageMediaObjectId");

ALTER TABLE "VendorAcquisitionPricingRequest" ADD CONSTRAINT "VendorAcquisitionPricingRequest_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VendorAcquisitionPricingRequest" ADD CONSTRAINT "VendorAcquisitionPricingRequest_submittedAcquisitionId_fkey" FOREIGN KEY ("submittedAcquisitionId") REFERENCES "Acquisition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VendorAcquisitionPricingItem" ADD CONSTRAINT "VendorAcquisitionPricingItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "VendorAcquisitionPricingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VendorAcquisitionPricingItem" ADD CONSTRAINT "VendorAcquisitionPricingItem_imageMediaObjectId_fkey" FOREIGN KEY ("imageMediaObjectId") REFERENCES "MediaObject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VendorAcquisitionPricingItem" ADD CONSTRAINT "VendorAcquisitionPricingItem_unitCost_nonnegative" CHECK ("unitCost" IS NULL OR "unitCost" >= 0);

INSERT INTO "NotificationRule" (
  "id", "name", "eventKey", "enabled", "channel", "recipientGroupKey",
  "titleTemplate", "messageTemplate", "priority", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  'Zalo - Vendor xac nhan gia nhap',
  'vendor_acquisition_pricing_request.submitted',
  TRUE,
  'ZALO_OA',
  'OPERATIONS',
  'Vendor da xac nhan gia nhap',
  E'Vendor: {{vendorName}}\nSo watch: {{itemCount}}\nTong gia tri: {{totalAmount}} VND\nPhieu nhap draft: {{acquisitionId}}',
  'NORMAL',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "NotificationRule"
  WHERE "eventKey" = 'vendor_acquisition_pricing_request.submitted'
    AND "channel" = 'ZALO_OA'
    AND "recipientGroupKey" = 'OPERATIONS'
);
