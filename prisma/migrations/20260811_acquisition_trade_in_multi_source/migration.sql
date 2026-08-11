ALTER TABLE "Acquisition"
ADD COLUMN "sourceOrderId" TEXT;

CREATE INDEX "Acquisition_sourceOrderId_idx"
ON "Acquisition"("sourceOrderId");

ALTER TABLE "Acquisition"
ADD CONSTRAINT "Acquisition_sourceOrderId_fkey"
FOREIGN KEY ("sourceOrderId") REFERENCES "Order"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Existing TRADE_IN rows encoded their source order through the first item.
UPDATE "Acquisition" acquisition
SET "sourceOrderId" = source_item."orderId"
FROM (
  SELECT DISTINCT ON (item."acquisitionId")
    item."acquisitionId",
    order_item."orderId"
  FROM "AcquisitionItem" item
  JOIN "OrderItem" order_item ON order_item.id = item."sourceOrderItemId"
  ORDER BY item."acquisitionId", item."createdAt", item.id
) source_item
WHERE acquisition.id = source_item."acquisitionId"
  AND acquisition.type = 'TRADE_IN'
  AND acquisition."sourceOrderId" IS NULL;

-- Acquisition totals are derived truth. Repair drafts created or edited by
-- legacy paths that ignored quantity.
UPDATE "Acquisition" acquisition
SET "totalAmount" = totals.amount,
    "updatedAt" = NOW()
FROM (
  SELECT
    item."acquisitionId",
    COALESCE(SUM(item.quantity * COALESCE(item."unitCost", 0)), 0)::numeric(12, 2) AS amount
  FROM "AcquisitionItem" item
  GROUP BY item."acquisitionId"
) totals
WHERE acquisition.id = totals."acquisitionId"
  AND acquisition."accquisitionStt" = 'DRAFT'
  AND acquisition."totalAmount" IS DISTINCT FROM totals.amount;
