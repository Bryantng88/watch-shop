CREATE TYPE "ActivitySourceType" AS ENUM ('BUSINESS_EVENT', 'DISCUSSION', 'SYSTEM');

CREATE TYPE "ActivityStatus" AS ENUM ('OPEN', 'RESOLVED', 'ARCHIVED');

CREATE TABLE "TaskItemActivity" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "taskItemId" TEXT NOT NULL,
    "sourceType" "ActivitySourceType" NOT NULL,
    "sourceId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "status" "ActivityStatus" NOT NULL DEFAULT 'OPEN',
    "actorUserId" TEXT,
    "metadataJson" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskItemActivity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TaskItemActivityReply" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "activityId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "body" TEXT NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskItemActivityReply_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TaskItemActivity_taskItemId_occurredAt_idx" ON "TaskItemActivity"("taskItemId", "occurredAt");
CREATE INDEX "TaskItemActivity_sourceType_sourceId_idx" ON "TaskItemActivity"("sourceType", "sourceId");
CREATE INDEX "TaskItemActivity_actorUserId_idx" ON "TaskItemActivity"("actorUserId");

CREATE INDEX "TaskItemActivityReply_activityId_createdAt_idx" ON "TaskItemActivityReply"("activityId", "createdAt");
CREATE INDEX "TaskItemActivityReply_actorUserId_idx" ON "TaskItemActivityReply"("actorUserId");

ALTER TABLE "TaskItemActivity"
    ADD CONSTRAINT "TaskItemActivity_taskItemId_fkey"
    FOREIGN KEY ("taskItemId") REFERENCES "TaskItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TaskItemActivity"
    ADD CONSTRAINT "TaskItemActivity_actorUserId_fkey"
    FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TaskItemActivityReply"
    ADD CONSTRAINT "TaskItemActivityReply_activityId_fkey"
    FOREIGN KEY ("activityId") REFERENCES "TaskItemActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TaskItemActivityReply"
    ADD CONSTRAINT "TaskItemActivityReply_actorUserId_fkey"
    FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
