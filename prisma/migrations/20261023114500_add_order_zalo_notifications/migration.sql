INSERT INTO "NotificationRule" (
  "id", "name", "eventKey", "enabled", "channel", "recipientGroupKey",
  "titleTemplate", "messageTemplate", "priority", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  'Zalo - Đơn hàng mới',
  event_key,
  TRUE,
  'ZALO_OA',
  'OPERATIONS',
  '🛒 Đơn hàng mới {{orderRef}}',
  E'Khách: {{customerName}}\nLiên hệ: {{phone}}\nWatch: {{itemSummary}}\nTổng tiền: {{orderTotal}}\nThanh toán: {{paymentStatus}}\nGiao hàng: {{deliverySummary}}\nMở xử lý: {{route}}',
  'HIGH',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (VALUES ('order.created')) AS events(event_key)
WHERE NOT EXISTS (
  SELECT 1 FROM "NotificationRule"
  WHERE "eventKey" = event_key
    AND "channel" = 'ZALO_OA'
    AND "recipientGroupKey" = 'OPERATIONS'
);
