BEGIN;
ALTER TABLE "TaskItem" ADD COLUMN "personalOwnerUserId" TEXT;
ALTER TABLE "TaskItem" ALTER COLUMN "taskId" DROP NOT NULL;
ALTER TABLE "TaskExecution" ALTER COLUMN "taskId" DROP NOT NULL;

-- Preserve all item IDs, links, shares and historical parent relationships.
-- Existing co-owner access remains available through the legacy parent.
UPDATE "TaskItem" i SET "personalOwnerUserId" = COALESCE(t."createdByUserId", t."assignedToUserId")
FROM "Task" t WHERE t.id = i."taskId" AND t.kind = 'PERSONAL';

ALTER TABLE "TaskItem" ADD CONSTRAINT "TaskItem_personalOwnerUserId_fkey"
  FOREIGN KEY ("personalOwnerUserId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "TaskItem_personalOwnerUserId_status_dueAt_idx" ON "TaskItem"("personalOwnerUserId", status, "dueAt");
ALTER TABLE "TaskItem" ADD CONSTRAINT "TaskItem_work_scope_check"
  CHECK ("taskId" IS NOT NULL OR "personalOwnerUserId" IS NOT NULL);
ALTER TABLE "TaskExecution" ADD CONSTRAINT "TaskExecution_work_scope_check"
  CHECK ("taskId" IS NOT NULL OR "taskItemId" IS NOT NULL);
COMMIT;
