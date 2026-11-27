-- Protect indefinite work even when a stale client attempts finite completion/scheduling.
ALTER TABLE "TaskItem" ADD CONSTRAINT "TaskItem_continuous_lifecycle_check" CHECK (
  "workTypeId" IS DISTINCT FROM 'CONTINUOUS' OR (
    "dueAt" IS NULL AND "scheduledEndAt" IS NULL AND "reminderMinutes" IS NULL
    AND "completedAt" IS NULL AND "checklistLockedAt" IS NULL AND "isDone" = FALSE
    AND "status" IN ('IN_PROGRESS', 'CANCELLED')
  )
);
