INSERT INTO "NotificationRule" (
  "id",
  "name",
  "eventKey",
  "enabled",
  "channel",
  "recipientGroupKey",
  "titleTemplate",
  "messageTemplate",
  "priority",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  'Zalo - Yêu cầu mua hàng mới',
  'purchase_request.created',
  TRUE,
  'ZALO_OA',
  'OPERATIONS',
  '🛎️ Yêu cầu mua hàng mới',
  E'📋 Mã: {{reference}}\n👤 Khách: {{customerName}}\n☎️ Liên hệ: {{phone}} ({{contactPreference}})\n⌚ Watch: {{watchTitles}}\n📝 Ghi chú: {{customerNote}}\n🌐 Kênh: {{channel}}',
  'HIGH',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "NotificationRule"
  WHERE "eventKey" = 'purchase_request.created'
    AND "channel" = 'ZALO_OA'
    AND "recipientGroupKey" = 'OPERATIONS'
);

INSERT INTO "NotificationRule" (
  "id",
  "name",
  "eventKey",
  "enabled",
  "channel",
  "recipientGroupKey",
  "titleTemplate",
  "messageTemplate",
  "priority",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  'Zalo - Khách bổ sung Watch vào yêu cầu',
  'purchase_request.items_added',
  TRUE,
  'ZALO_OA',
  'OPERATIONS',
  '➕ Khách bổ sung Watch vào yêu cầu',
  E'📋 Mã: {{reference}}\n👤 Khách: {{customerName}}\n☎️ Liên hệ: {{phone}} ({{contactPreference}})\n⌚ Danh sách hiện tại: {{watchTitles}}\n📝 Ghi chú: {{customerNote}}\n🌐 Kênh: {{channel}}',
  'HIGH',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "NotificationRule"
  WHERE "eventKey" = 'purchase_request.items_added'
    AND "channel" = 'ZALO_OA'
    AND "recipientGroupKey" = 'OPERATIONS'
);
