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
  'Zalo - Media Post sẵn sàng đăng',
  'media.post.ready_for_publish',
  TRUE,
  'ZALO_OA',
  'OPERATIONS',
  '📣 {{actorName}} vừa duyệt xong Media Post:',
  E'Bài: {{mediaPostTitle}}\nMã: {{mediaPostRef}}\nKênh đăng: {{publishChannels}}\nBrief: {{brief}}\nMở xử lý: {{route}}',
  'NORMAL',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "NotificationRule"
  WHERE "eventKey" = 'media.post.ready_for_publish'
    AND "channel" = 'ZALO_OA'
    AND "recipientGroupKey" = 'OPERATIONS'
);
