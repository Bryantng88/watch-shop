ALTER TYPE "WatchServiceStage" ADD VALUE IF NOT EXISTS 'NOT_ASSESSED' BEFORE 'NOT_REQUIRED';

ALTER TABLE "Watch"
  ALTER COLUMN "serviceStage" SET DEFAULT 'NOT_ASSESSED';

-- NOT_REQUIRED used to be the implicit default, so existing rows do not prove
-- that a user actually made a service decision.
UPDATE "Watch"
SET "serviceStage" = 'NOT_ASSESSED'
WHERE "serviceStage" = 'NOT_REQUIRED';
