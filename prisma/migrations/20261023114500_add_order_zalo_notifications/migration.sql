INSERT INTO "NotificationRule" (
  "id", "name", "eventKey", "enabled", "channel", "recipientGroupKey",
  "titleTemplate", "messageTemplate", "priority", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  CASE WHEN event_key = 'order.created' THEN 'Zalo - Đơn hàng nháp mới' ELSE 'Zalo - Đơn hàng mới đã ghi nhận' END,
  event_key,
  TRUE,
  'ZALO_OA',
  'OPERATIONS',
  '🛒 Đơn hàng mới {{orderRef}}',
  E'Khách: {{customerName}}\nLiên hệ: {{phone}}\nWatch: {{watchTitles}}\nTổng tiền: {{totalAmount}} VND\nThanh toán: {{paymentStatus}}\nMở xử lý: {{route}}',
  'HIGH',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (VALUES ('order.created'), ('order.posted')) AS events(event_key)
WHERE NOT EXISTS (
  SELECT 1 FROM "NotificationRule"
  WHERE "eventKey" = event_key
    AND "channel" = 'ZALO_OA'
    AND "recipientGroupKey" = 'OPERATIONS'
);
