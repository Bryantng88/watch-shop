-- Lock checklist scope after the user confirms task completion.
ALTER TABLE "TaskItem" ADD COLUMN "checklistLockedAt" TIMESTAMP(3);
