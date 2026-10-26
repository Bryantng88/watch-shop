ALTER TABLE "TaskItem"
ADD COLUMN "mediaGoalTargetCount" INTEGER,
ADD COLUMN "mediaGoalCompletedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "mediaGoalStartedAt" TIMESTAMP(3);

CREATE INDEX "TaskItem_mediaGoalTargetCount_idx" ON "TaskItem"("mediaGoalTargetCount");

CREATE TABLE "PersonalTaskMediaGoalCompletion" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "taskItemId" TEXT NOT NULL,
  "watchId" TEXT NOT NULL,
  "eventLogId" TEXT,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PersonalTaskMediaGoalCompletion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PersonalTaskMediaGoalCompletion_taskItemId_watchId_key"
ON "PersonalTaskMediaGoalCompletion"("taskItemId", "watchId");

CREATE INDEX "PersonalTaskMediaGoalCompletion_watchId_completedAt_idx"
ON "PersonalTaskMediaGoalCompletion"("watchId", "completedAt");

CREATE INDEX "PersonalTaskMediaGoalCompletion_eventLogId_idx"
ON "PersonalTaskMediaGoalCompletion"("eventLogId");

ALTER TABLE "PersonalTaskMediaGoalCompletion"
ADD CONSTRAINT "PersonalTaskMediaGoalCompletion_taskItemId_fkey"
FOREIGN KEY ("taskItemId") REFERENCES "TaskItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
