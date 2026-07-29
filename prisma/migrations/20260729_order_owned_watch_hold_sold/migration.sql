-- HOLD/SOLD are owned by active orders. Acquisition historically created
-- Product=HOLD while Watch remained DRAFT/PROCESSING/READY and no OrderItem
-- owned the lock. Restore only orphaned mirrors; never touch an active order.
UPDATE "Product" AS product
SET
  "status" = CASE
    WHEN watch."serviceStage" = 'IN_SERVICE' THEN 'IN_SERVICE'::"ProductStatus"
    WHEN watch."serviceStage" = 'PENDING' THEN 'NEED_SERVICE'::"ProductStatus"
    ELSE 'AVAILABLE'::"ProductStatus"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
FROM "Watch" AS watch
WHERE watch."productId" = product."id"
  AND product."status" = 'HOLD'
  AND watch."saleStage" <> 'HOLD'
  AND NOT EXISTS (
    SELECT 1
    FROM "OrderItem" AS order_item
    INNER JOIN "Order" AS customer_order
      ON customer_order."id" = order_item."orderId"
    WHERE order_item."productId" = product."id"
      AND customer_order."status" <> 'CANCELLED'
  );
