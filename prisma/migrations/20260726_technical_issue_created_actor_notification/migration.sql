UPDATE "NotificationRule"
SET
  "titleTemplate" = '👤 {{actorName}} (User) vừa đưa 1 Watch vào Kiểm tra TI',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "eventKey" = 'technical_issue.created';
