ALTER TABLE "TaskItem" ADD COLUMN "mergedIntoTaskItemId" TEXT, ADD COLUMN "mergeReceipt" JSONB;
ALTER TABLE "TaskItemChecklist" ADD COLUMN "mergedFromTaskItemId" TEXT;
ALTER TABLE "TaskItem" ADD CONSTRAINT "TaskItem_mergedIntoTaskItemId_fkey" FOREIGN KEY ("mergedIntoTaskItemId") REFERENCES "TaskItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "TaskItem_mergedIntoTaskItemId_idx" ON "TaskItem"("mergedIntoTaskItemId");
