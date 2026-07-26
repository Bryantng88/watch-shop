CREATE INDEX IF NOT EXISTS "ProjectionRecord_workspace_read_idx"
ON "ProjectionRecord" ("projectionKey", "workspaceId", "projectionVersion");
