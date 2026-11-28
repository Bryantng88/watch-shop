ALTER TABLE "TaskItemChecklist" ADD COLUMN "startAt" TIMESTAMP(3), ADD COLUMN "deadlineAt" TIMESTAMP(3);
-- Retain the existing schedule when introducing per-checklist scheduling.
UPDATE "TaskItemChecklist" c SET "startAt" = t."dueAt", "deadlineAt" = COALESCE(t."scheduledEndAt", t."dueAt")
FROM "TaskItem" t WHERE t.id = c."taskItemId" AND t."dueAt" IS NOT NULL
AND (t."personalOwnerUserId" IS NOT NULL OR EXISTS (SELECT 1 FROM "Task" task WHERE task.id=t."taskId" AND task.kind='PERSONAL'));
