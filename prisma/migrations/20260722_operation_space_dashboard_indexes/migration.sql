CREATE INDEX IF NOT EXISTS "idx_payment_status_paidat"
ON "Payment"("status", "paidAt");

CREATE INDEX IF NOT EXISTS "TaskItem_taskId_status_sortOrder_idx"
ON "TaskItem"("taskId", "status", "sortOrder");

CREATE INDEX IF NOT EXISTS "TaskExecution_taskId_targetType_taskItemId_idx"
ON "TaskExecution"("taskId", "targetType", "taskItemId");

CREATE INDEX IF NOT EXISTS "TaskExecution_taskId_taskItemId_actionType_idx"
ON "TaskExecution"("taskId", "taskItemId", "actionType");
