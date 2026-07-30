CREATE INDEX IF NOT EXISTS "TaskItemActivity_sourceType_occurredAt_idx"
ON "TaskItemActivity" ("sourceType", "occurredAt" DESC);
