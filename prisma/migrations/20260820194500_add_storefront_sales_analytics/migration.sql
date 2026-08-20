ALTER TABLE "PurchaseRequest"
  ADD COLUMN "analyticsAnonymousIdHash" TEXT,
  ADD COLUMN "analyticsSessionIdHash" TEXT,
  ADD COLUMN "analyticsSource" TEXT,
  ADD COLUMN "analyticsMedium" TEXT,
  ADD COLUMN "analyticsCampaign" TEXT,
  ADD COLUMN "analyticsLandingPath" TEXT;

CREATE INDEX "PurchaseRequest_analyticsSource_createdAt_idx"
  ON "PurchaseRequest"("analyticsSource", "createdAt" DESC);

CREATE TABLE "StorefrontAnalyticsEvent" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "eventId" VARCHAR(80) NOT NULL,
  "eventName" VARCHAR(40) NOT NULL,
  "occurredAt" TIMESTAMPTZ(6) NOT NULL,
  "anonymousIdHash" VARCHAR(64) NOT NULL,
  "sessionIdHash" VARCHAR(64) NOT NULL,
  "productId" TEXT,
  "purchaseRequestId" TEXT,
  "path" VARCHAR(500) NOT NULL,
  "source" VARCHAR(100),
  "medium" VARCHAR(100),
  "campaign" VARCHAR(150),
  "referrerHost" VARCHAR(255),
  "deviceType" VARCHAR(20),
  "metadataJson" JSONB,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StorefrontAnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StorefrontAnalyticsEvent_eventId_key" ON "StorefrontAnalyticsEvent"("eventId");
CREATE INDEX "StorefrontAnalyticsEvent_eventName_occurredAt_idx" ON "StorefrontAnalyticsEvent"("eventName", "occurredAt" DESC);
CREATE INDEX "StorefrontAnalyticsEvent_productId_eventName_occurredAt_idx" ON "StorefrontAnalyticsEvent"("productId", "eventName", "occurredAt" DESC);
CREATE INDEX "StorefrontAnalyticsEvent_anonymousIdHash_occurredAt_idx" ON "StorefrontAnalyticsEvent"("anonymousIdHash", "occurredAt" DESC);
CREATE INDEX "StorefrontAnalyticsEvent_sessionIdHash_occurredAt_idx" ON "StorefrontAnalyticsEvent"("sessionIdHash", "occurredAt" DESC);
CREATE INDEX "StorefrontAnalyticsEvent_source_occurredAt_idx" ON "StorefrontAnalyticsEvent"("source", "occurredAt" DESC);
CREATE INDEX "StorefrontAnalyticsEvent_purchaseRequestId_idx" ON "StorefrontAnalyticsEvent"("purchaseRequestId");

ALTER TABLE "StorefrontAnalyticsEvent" ADD CONSTRAINT "StorefrontAnalyticsEvent_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StorefrontAnalyticsEvent" ADD CONSTRAINT "StorefrontAnalyticsEvent_purchaseRequestId_fkey"
  FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
