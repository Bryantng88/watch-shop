ALTER TABLE "TaskItem" ADD COLUMN "workTypeId" TEXT;

CREATE INDEX "TaskItem_workTypeId_idx" ON "TaskItem"("workTypeId");
