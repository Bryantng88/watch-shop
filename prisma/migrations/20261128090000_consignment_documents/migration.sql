-- Additive document metadata; legacy clients continue to use existing fields.
ALTER TABLE "Acquisition" ADD COLUMN "consignment" JSONB;
CREATE INDEX "acquisition_consignment_direction_status" ON "Acquisition" (("consignment"->>'direction'), ("consignment"->>'status')) WHERE "consignment" IS NOT NULL;
CREATE UNIQUE INDEX "acquisition_consignment_receipt_id" ON "Acquisition" (("consignment"->'receipt'->>'id')) WHERE "consignment"->'receipt'->>'id' IS NOT NULL;
CREATE UNIQUE INDEX "acquisition_consignment_live_watch" ON "Acquisition" (("consignment"->>'productId')) WHERE "consignment"->>'status' IN ('DRAFT', 'ACTIVE', 'SOLD');
