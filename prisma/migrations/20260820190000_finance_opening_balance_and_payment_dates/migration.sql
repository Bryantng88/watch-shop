ALTER TYPE "PaymentPurpose" ADD VALUE IF NOT EXISTS 'OTHER_INCOME';
ALTER TYPE "PaymentPurpose" ADD VALUE IF NOT EXISTS 'OPENING_BALANCE';

-- Legacy settled payments predate the invariant that every cash movement has
-- an effective date. updatedAt is the closest persisted settlement timestamp
-- and is frozen into paidAt once so future edits cannot move financial periods.
UPDATE "Payment"
SET "paidAt" = "updatedAt"
WHERE "status" IN ('PAID', 'COLLECTED')
  AND "paidAt" IS NULL;
