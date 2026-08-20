ALTER TABLE "StorefrontAnalyticsEvent"
  ADD COLUMN "isInternal" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "PurchaseRequest"
  ADD COLUMN "analyticsIsInternal" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "PurchaseRequest_analyticsIsInternal_createdAt_idx"
  ON "PurchaseRequest"("analyticsIsInternal", "createdAt" DESC);

CREATE INDEX "StorefrontAnalyticsEvent_isInternal_occurredAt_idx"
  ON "StorefrontAnalyticsEvent"("isInternal", "occurredAt" DESC);
