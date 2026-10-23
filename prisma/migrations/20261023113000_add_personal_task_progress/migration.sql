CREATE TYPE "TaskProgressMode" AS ENUM ('MANUAL', 'CHECKLIST');

ALTER TABLE "TaskItem"
ADD COLUMN "progressPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "progressMode" "TaskProgressMode" NOT NULL DEFAULT 'MANUAL';

ALTER TABLE "TaskItem"
ADD CONSTRAINT "TaskItem_progressPercent_check"
CHECK ("progressPercent" >= 0 AND "progressPercent" <= 100);
