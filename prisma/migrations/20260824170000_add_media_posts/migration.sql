ALTER TYPE "TaskExecutionTargetType" ADD VALUE IF NOT EXISTS 'MEDIA_POST';
ALTER TYPE "MediaOwnerType" ADD VALUE IF NOT EXISTS 'MEDIA_POST';
CREATE TYPE "MediaPostStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'READY', 'PUBLISHED', 'CANCELLED');
CREATE TYPE "MediaPostTargetStatus" AS ENUM ('PENDING', 'READY', 'PUBLISHED', 'FAILED', 'CANCELLED');
CREATE TYPE "MediaPostWatchRole" AS ENUM ('FEATURED', 'MENTIONED');

CREATE TABLE "MediaPost" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "refNo" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "brief" TEXT,
  "caption" TEXT,
  "contentJson" JSONB,
  "status" "MediaPostStatus" NOT NULL DEFAULT 'DRAFT',
  "priority" INTEGER NOT NULL DEFAULT 0,
  "scheduledAt" TIMESTAMPTZ(6),
  "createdByUserId" TEXT,
  "assignedToUserId" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "MediaPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaPostTarget" (
  "mediaPostId" TEXT NOT NULL,
  "postTargetId" TEXT NOT NULL,
  "status" "MediaPostTargetStatus" NOT NULL DEFAULT 'PENDING',
  "caption" TEXT,
  "scheduledAt" TIMESTAMPTZ(6),
  "publishedAt" TIMESTAMPTZ(6),
  "externalUrl" TEXT,
  "externalRef" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "MediaPostTarget_pkey" PRIMARY KEY ("mediaPostId", "postTargetId")
);

CREATE TABLE "MediaPostWatch" (
  "mediaPostId" TEXT NOT NULL,
  "watchId" TEXT NOT NULL,
  "role" "MediaPostWatchRole" NOT NULL DEFAULT 'FEATURED',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaPostWatch_pkey" PRIMARY KEY ("mediaPostId", "watchId")
);

CREATE UNIQUE INDEX "MediaPost_refNo_key" ON "MediaPost"("refNo");
CREATE INDEX "MediaPost_status_updatedAt_idx" ON "MediaPost"("status", "updatedAt");
CREATE INDEX "MediaPost_scheduledAt_idx" ON "MediaPost"("scheduledAt");
CREATE INDEX "MediaPost_assignedToUserId_status_idx" ON "MediaPost"("assignedToUserId", "status");
CREATE INDEX "MediaPostTarget_postTargetId_status_idx" ON "MediaPostTarget"("postTargetId", "status");
CREATE INDEX "MediaPostWatch_watchId_idx" ON "MediaPostWatch"("watchId");

ALTER TABLE "MediaPostTarget" ADD CONSTRAINT "MediaPostTarget_mediaPostId_fkey"
  FOREIGN KEY ("mediaPostId") REFERENCES "MediaPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MediaPostTarget" ADD CONSTRAINT "MediaPostTarget_postTargetId_fkey"
  FOREIGN KEY ("postTargetId") REFERENCES "PostTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MediaPostWatch" ADD CONSTRAINT "MediaPostWatch_mediaPostId_fkey"
  FOREIGN KEY ("mediaPostId") REFERENCES "MediaPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MediaPostWatch" ADD CONSTRAINT "MediaPostWatch_watchId_fkey"
  FOREIGN KEY ("watchId") REFERENCES "Watch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
