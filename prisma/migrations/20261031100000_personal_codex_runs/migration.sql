-- CreateEnum
CREATE TYPE "PersonalCodexRunStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'TIMED_OUT');

-- CreateTable
CREATE TABLE "PersonalCodexRun" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "taskItemId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "status" "PersonalCodexRunStatus" NOT NULL DEFAULT 'QUEUED',
    "activeTaskItemId" TEXT,
    "fingerprint" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "repository" TEXT NOT NULL,
    "baseBranch" TEXT NOT NULL DEFAULT 'main',
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "leaseToken" TEXT,
    "workerId" TEXT,
    "leaseExpiresAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "summary" TEXT,
    "errorCode" TEXT,
    "resultUrl" TEXT,
    "commitSha" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalCodexRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalCodexRun_activeTaskItemId_key" ON "PersonalCodexRun"("activeTaskItemId");

-- CreateIndex
CREATE INDEX "PersonalCodexRun_status_createdAt_idx" ON "PersonalCodexRun"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PersonalCodexRun_taskItemId_createdAt_idx" ON "PersonalCodexRun"("taskItemId", "createdAt");

-- AddForeignKey
ALTER TABLE "PersonalCodexRun" ADD CONSTRAINT "PersonalCodexRun_taskItemId_fkey" FOREIGN KEY ("taskItemId") REFERENCES "TaskItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalCodexRun" ADD CONSTRAINT "PersonalCodexRun_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
