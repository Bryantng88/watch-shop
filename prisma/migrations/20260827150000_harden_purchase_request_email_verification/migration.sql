ALTER TABLE "PurchaseRequest"
ALTER COLUMN "emailVerificationStatus" SET DEFAULT 'NOT_SENT';

ALTER TABLE "PurchaseRequest"
ADD COLUMN "emailVerificationAttemptedAt" TIMESTAMPTZ(6),
ADD COLUMN "emailVerificationSendCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "emailVerificationWindowStartedAt" TIMESTAMPTZ(6);

UPDATE "PurchaseRequest"
SET "emailVerificationStatus" = 'NOT_SENT'
WHERE "emailVerificationStatus" = 'PENDING'
  AND "emailVerificationSentAt" IS NULL
  AND "emailVerifiedAt" IS NULL;

ALTER TABLE "PurchaseRequest"
ADD CONSTRAINT "PurchaseRequest_emailVerificationStatus_check"
CHECK ("emailVerificationStatus" IN ('NOT_SENT', 'SENDING', 'PENDING', 'VERIFIED', 'DELIVERY_FAILED'));

INSERT INTO "NotificationRule" (
  "id", "name", "eventKey", "enabled", "channel", "recipientGroupKey",
  "titleTemplate", "messageTemplate", "priority", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  'Zalo - Khach xac minh email',
  'purchase_request.email_verified',
  TRUE,
  'ZALO_OA',
  'OPERATIONS',
  'Khach hang da xac minh email',
  E'Ma: {{reference}}\nKhach: {{customerName}}\nEmail: {{customerEmail}}\nDien thoai: {{phone}}\nWatch: {{watchTitles}}',
  'NORMAL',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "NotificationRule"
  WHERE "eventKey" = 'purchase_request.email_verified'
    AND "channel" = 'ZALO_OA'
    AND "recipientGroupKey" = 'OPERATIONS'
);
