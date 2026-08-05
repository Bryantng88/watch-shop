ALTER TABLE "Order"
  ADD COLUMN "publicRequestKey" TEXT,
  ADD COLUMN "publicRequestHash" TEXT,
  ADD COLUMN "publicRequestChannel" TEXT,
  ADD COLUMN "publicExternalId" TEXT,
  ADD COLUMN "publicFingerprintHash" TEXT;

CREATE UNIQUE INDEX "Order_publicRequestKey_key"
  ON "Order"("publicRequestKey");

CREATE UNIQUE INDEX "Order_public_channel_external_key"
  ON "Order"("publicRequestChannel", "publicExternalId");

CREATE INDEX "idx_order_public_fingerprint_created"
  ON "Order"("publicFingerprintHash", "createdAt");

CREATE TABLE "IntegrationIngressReceipt" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "channel" TEXT NOT NULL,
  "keyId" TEXT NOT NULL,
  "nonce" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "responseJson" JSONB,
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "IntegrationIngressReceipt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "IntegrationIngressReceipt_channel_nonce_key"
  ON "IntegrationIngressReceipt"("channel", "nonce");
CREATE UNIQUE INDEX "IntegrationIngressReceipt_channel_event_key"
  ON "IntegrationIngressReceipt"("channel", "eventId");
CREATE INDEX "IntegrationIngressReceipt_expiresAt_idx"
  ON "IntegrationIngressReceipt"("expiresAt");
