CREATE TYPE "PersonalTaskShareAccess" AS ENUM ('VIEWER', 'EDITOR');

CREATE TABLE "PersonalTaskShare" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "taskItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessLevel" "PersonalTaskShareAccess" NOT NULL DEFAULT 'VIEWER',
    "sharedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalTaskShare_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PersonalTaskShare_taskItemId_userId_key" ON "PersonalTaskShare"("taskItemId", "userId");
CREATE INDEX "PersonalTaskShare_userId_accessLevel_idx" ON "PersonalTaskShare"("userId", "accessLevel");
CREATE INDEX "PersonalTaskShare_sharedByUserId_idx" ON "PersonalTaskShare"("sharedByUserId");

ALTER TABLE "PersonalTaskShare" ADD CONSTRAINT "PersonalTaskShare_taskItemId_fkey" FOREIGN KEY ("taskItemId") REFERENCES "TaskItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalTaskShare" ADD CONSTRAINT "PersonalTaskShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalTaskShare" ADD CONSTRAINT "PersonalTaskShare_sharedByUserId_fkey" FOREIGN KEY ("sharedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
