ALTER TABLE "PurchaseRequest"
ADD COLUMN "emailVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN "emailVerificationTokenHash" TEXT,
ADD COLUMN "emailVerificationExpiresAt" TIMESTAMPTZ(6),
ADD COLUMN "emailVerificationSentAt" TIMESTAMPTZ(6),
ADD COLUMN "emailVerifiedAt" TIMESTAMPTZ(6),
ADD COLUMN "emailDeliveryFailedAt" TIMESTAMPTZ(6);

CREATE UNIQUE INDEX "PurchaseRequest_emailVerificationTokenHash_key"
ON "PurchaseRequest"("emailVerificationTokenHash");

CREATE INDEX "PurchaseRequest_emailVerificationStatus_createdAt_idx"
ON "PurchaseRequest"("emailVerificationStatus", "createdAt" DESC);
