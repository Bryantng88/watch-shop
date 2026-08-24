-- Additive lifecycle identity. Runtime remains compatible while existing rows are backfilled.
CREATE TABLE "WatchInventoryCycle" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "productId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "sourceAcquisitionItemId" TEXT,
    "openedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMPTZ(6),
    "closeReason" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WatchInventoryCycle_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Watch" ADD COLUMN "currentInventoryCycleId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "inventoryCycleId" TEXT;
ALTER TABLE "AcquisitionItem" ADD COLUMN "inventoryCycleId" TEXT;

CREATE UNIQUE INDEX "WatchInventoryCycle_productId_sequence_key" ON "WatchInventoryCycle"("productId", "sequence");
CREATE UNIQUE INDEX "WatchInventoryCycle_sourceAcquisitionItemId_key" ON "WatchInventoryCycle"("sourceAcquisitionItemId");
CREATE UNIQUE INDEX "Watch_currentInventoryCycleId_key" ON "Watch"("currentInventoryCycleId");
CREATE UNIQUE INDEX "watch_inventory_cycle_one_open_per_product" ON "WatchInventoryCycle"("productId") WHERE "closedAt" IS NULL;
CREATE INDEX "WatchInventoryCycle_productId_openedAt_idx" ON "WatchInventoryCycle"("productId", "openedAt");
CREATE INDEX "WatchInventoryCycle_closedAt_idx" ON "WatchInventoryCycle"("closedAt");
CREATE INDEX "idx_order_item_inventory_cycle" ON "OrderItem"("inventoryCycleId");
CREATE INDEX "idx_acquisition_item_inventory_cycle" ON "AcquisitionItem"("inventoryCycleId");

ALTER TABLE "WatchInventoryCycle" ADD CONSTRAINT "WatchInventoryCycle_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Watch"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WatchInventoryCycle" ADD CONSTRAINT "WatchInventoryCycle_sourceAcquisitionItemId_fkey"
  FOREIGN KEY ("sourceAcquisitionItemId") REFERENCES "AcquisitionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_currentInventoryCycleId_fkey"
  FOREIGN KEY ("currentInventoryCycleId") REFERENCES "WatchInventoryCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_inventoryCycleId_fkey"
  FOREIGN KEY ("inventoryCycleId") REFERENCES "WatchInventoryCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_inventoryCycleId_fkey"
  FOREIGN KEY ("inventoryCycleId") REFERENCES "WatchInventoryCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Each posted acquisition of a physical Watch is a durable lifecycle boundary.
WITH boundaries AS (
  SELECT ai."productId", ai."id" AS "acquisitionItemId",
         COALESCE(a."sentAt", a."updatedAt", a."acquiredAt", ai."createdAt") AS "openedAt",
         ROW_NUMBER() OVER (PARTITION BY ai."productId" ORDER BY COALESCE(a."sentAt", a."updatedAt", a."acquiredAt", ai."createdAt"), ai."id")::int AS sequence
  FROM "AcquisitionItem" ai
  JOIN "Acquisition" a ON a."id" = ai."acquisitionId"
  JOIN "Watch" w ON w."productId" = ai."productId"
  WHERE ai."productId" IS NOT NULL AND a."accquisitionStt" = 'POSTED'
), inserted AS (
  INSERT INTO "WatchInventoryCycle" ("productId", "sequence", "sourceAcquisitionItemId", "openedAt", "closedAt", "closeReason")
  SELECT b."productId", b.sequence, b."acquisitionItemId", b."openedAt",
         LEAD(b."openedAt") OVER (PARTITION BY b."productId" ORDER BY b.sequence),
         CASE WHEN LEAD(b."openedAt") OVER (PARTITION BY b."productId" ORDER BY b.sequence) IS NULL THEN NULL ELSE 'SUPERSEDED_BY_ACQUISITION' END
  FROM boundaries b
  RETURNING "id", "productId", "sequence", "openedAt", "closedAt", "sourceAcquisitionItemId"
)
UPDATE "AcquisitionItem" ai SET "inventoryCycleId" = i."id"
FROM inserted i WHERE ai."id" = i."sourceAcquisitionItemId";

-- Legacy Watches without a posted acquisition still receive one current cycle.
INSERT INTO "WatchInventoryCycle" ("productId", "sequence", "openedAt")
SELECT w."productId", 1, w."createdAt"
FROM "Watch" w
WHERE NOT EXISTS (SELECT 1 FROM "WatchInventoryCycle" c WHERE c."productId" = w."productId");

UPDATE "Watch" w SET "currentInventoryCycleId" = c."id"
FROM "WatchInventoryCycle" c
WHERE c."productId" = w."productId" AND c."closedAt" IS NULL;

-- Assign historical orders to the latest cycle already open when the item was created.
UPDATE "OrderItem" oi SET "inventoryCycleId" = (
  SELECT c."id" FROM "WatchInventoryCycle" c
  WHERE c."productId" = oi."productId" AND c."openedAt" <= oi."createdAt"
  ORDER BY c."openedAt" DESC, c."sequence" DESC LIMIT 1
)
WHERE oi."productId" IS NOT NULL AND EXISTS (
  SELECT 1 FROM "WatchInventoryCycle" c
  WHERE c."productId" = oi."productId" AND c."openedAt" <= oi."createdAt"
);

-- Enforce that linked rows cannot cross products, including future direct SQL writers.
CREATE OR REPLACE FUNCTION enforce_watch_inventory_cycle_product() RETURNS trigger AS $$
DECLARE cycle_product TEXT;
BEGIN
  IF NEW."inventoryCycleId" IS NULL THEN RETURN NEW; END IF;
  SELECT "productId" INTO cycle_product FROM "WatchInventoryCycle" WHERE "id" = NEW."inventoryCycleId";
  IF cycle_product IS DISTINCT FROM NEW."productId" THEN
    RAISE EXCEPTION 'inventory cycle % does not belong to product %', NEW."inventoryCycleId", NEW."productId";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "OrderItem_inventory_cycle_product_guard" BEFORE INSERT OR UPDATE OF "productId", "inventoryCycleId" ON "OrderItem" FOR EACH ROW EXECUTE FUNCTION enforce_watch_inventory_cycle_product();
CREATE TRIGGER "AcquisitionItem_inventory_cycle_product_guard" BEFORE INSERT OR UPDATE OF "productId", "inventoryCycleId" ON "AcquisitionItem" FOR EACH ROW EXECUTE FUNCTION enforce_watch_inventory_cycle_product();
