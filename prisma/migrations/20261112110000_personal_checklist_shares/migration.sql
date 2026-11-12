CREATE TABLE "PersonalChecklistShare" (
 "id" TEXT NOT NULL PRIMARY KEY, "checklistItemId" TEXT NOT NULL, "userId" TEXT NOT NULL,
 "accessLevel" "PersonalTaskShareAccess" NOT NULL DEFAULT 'VIEWER', "sharedByUserId" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "PersonalChecklistShare_checklistItemId_fkey" FOREIGN KEY ("checklistItemId") REFERENCES "TaskItemChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT "PersonalChecklistShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "PersonalChecklistShare_checklistItemId_userId_key" ON "PersonalChecklistShare"("checklistItemId","userId");
CREATE INDEX "PersonalChecklistShare_userId_accessLevel_idx" ON "PersonalChecklistShare"("userId","accessLevel");
ALTER TABLE "WorkPushDelivery" ADD COLUMN "checklistItemId" TEXT;
