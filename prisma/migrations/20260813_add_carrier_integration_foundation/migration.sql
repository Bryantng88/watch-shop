ALTER TABLE "Shipment"
  ADD COLUMN "carrierCode" TEXT,
  ADD COLUMN "carrierEnvironment" TEXT,
  ADD COLUMN "externalOrderCode" TEXT,
  ADD COLUMN "carrierStatus" TEXT,
  ADD COLUMN "carrierStatusText" TEXT,
  ADD COLUMN "carrierSyncedAt" TIMESTAMPTZ(6),
  ADD COLUMN "carrierCreatedAt" TIMESTAMPTZ(6),
  ADD COLUMN "estimatedDeliveryAt" TIMESTAMPTZ(6);

CREATE UNIQUE INDEX "Shipment_carrier_external_order_key" ON "Shipment"("carrierCode", "carrierEnvironment", "externalOrderCode");
CREATE INDEX "Shipment_carrier_status_idx" ON "Shipment"("carrierCode", "carrierStatus");
CREATE INDEX "Shipment_carrier_synced_at_idx" ON "Shipment"("carrierSyncedAt");

CREATE TYPE "CarrierRequestStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "CarrierWebhookStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'IGNORED', 'FAILED');
CREATE TYPE "CarrierChargeKind" AS ENUM ('SHIPPING', 'INSURANCE', 'COD_FEE', 'RETURN_FEE', 'SURCHARGE');
CREATE TYPE "CarrierSettlementStatus" AS ENUM ('ESTIMATED', 'ACCRUED', 'PAID', 'DEDUCTED', 'INVOICED', 'CANCELLED');

CREATE TABLE "ShipmentPackage" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "shipmentId" UUID NOT NULL,
  "weightGram" INTEGER NOT NULL,
  "lengthCm" INTEGER,
  "widthCm" INTEGER,
  "heightCm" INTEGER,
  "itemCount" INTEGER NOT NULL DEFAULT 1,
  "declaredValue" DECIMAL(14,2),
  "contentDescription" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ShipmentPackage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ShipmentPackage_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ShipmentPackage_shipmentId_idx" ON "ShipmentPackage"("shipmentId");

CREATE TABLE "CarrierRequest" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "shipmentId" UUID NOT NULL,
  "carrierCode" TEXT NOT NULL,
  "environment" TEXT NOT NULL,
  "operation" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "requestJson" JSONB NOT NULL,
  "responseJson" JSONB,
  "status" "CarrierRequestStatus" NOT NULL DEFAULT 'PENDING',
  "httpStatus" INTEGER,
  "externalOrderCode" TEXT,
  "errorCode" TEXT,
  "errorMessage" TEXT,
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "requestedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMPTZ(6),
  CONSTRAINT "CarrierRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CarrierRequest_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CarrierRequest_idempotencyKey_key" ON "CarrierRequest"("idempotencyKey");
CREATE INDEX "CarrierRequest_shipmentId_requestedAt_idx" ON "CarrierRequest"("shipmentId", "requestedAt" DESC);
CREATE INDEX "CarrierRequest_status_requestedAt_idx" ON "CarrierRequest"("status", "requestedAt");

CREATE TABLE "CarrierWebhookDelivery" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "carrierCode" TEXT NOT NULL,
  "environment" TEXT NOT NULL,
  "externalEventId" TEXT,
  "externalOrderCode" TEXT,
  "payloadHash" TEXT NOT NULL,
  "payloadJson" JSONB NOT NULL,
  "signatureValid" BOOLEAN NOT NULL DEFAULT false,
  "status" "CarrierWebhookStatus" NOT NULL DEFAULT 'RECEIVED',
  "receivedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMPTZ(6),
  "errorMessage" TEXT,
  CONSTRAINT "CarrierWebhookDelivery_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CarrierWebhook_external_event_key" ON "CarrierWebhookDelivery"("carrierCode", "environment", "externalEventId");
CREATE UNIQUE INDEX "CarrierWebhook_payload_hash_key" ON "CarrierWebhookDelivery"("carrierCode", "environment", "payloadHash");
CREATE INDEX "CarrierWebhookDelivery_status_receivedAt_idx" ON "CarrierWebhookDelivery"("status", "receivedAt");
CREATE INDEX "CarrierWebhookDelivery_externalOrderCode_idx" ON "CarrierWebhookDelivery"("externalOrderCode");

CREATE TABLE "CarrierStatusHistory" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "shipmentId" UUID NOT NULL,
  "carrierCode" TEXT NOT NULL,
  "externalStatus" TEXT NOT NULL,
  "normalizedStatus" TEXT NOT NULL,
  "description" TEXT,
  "location" TEXT,
  "occurredAt" TIMESTAMPTZ(6) NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CarrierStatusHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CarrierStatusHistory_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CarrierStatusHistory_event_key" ON "CarrierStatusHistory"("shipmentId", "carrierCode", "externalStatus", "occurredAt");
CREATE INDEX "CarrierStatusHistory_shipmentId_occurredAt_idx" ON "CarrierStatusHistory"("shipmentId", "occurredAt" DESC);

CREATE TABLE "CarrierCharge" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "shipmentId" UUID NOT NULL,
  "kind" "CarrierChargeKind" NOT NULL,
  "currency" VARCHAR(10) NOT NULL DEFAULT 'VND',
  "estimatedAmount" DECIMAL(14,2),
  "chargedAmount" DECIMAL(14,2),
  "settlementStatus" "CarrierSettlementStatus" NOT NULL DEFAULT 'ESTIMATED',
  "settlementRef" TEXT,
  "settledAt" TIMESTAMPTZ(6),
  "metadataJson" JSONB,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CarrierCharge_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CarrierCharge_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CarrierCharge_shipment_kind_key" ON "CarrierCharge"("shipmentId", "kind");
CREATE INDEX "CarrierCharge_settlementStatus_updatedAt_idx" ON "CarrierCharge"("settlementStatus", "updatedAt");
