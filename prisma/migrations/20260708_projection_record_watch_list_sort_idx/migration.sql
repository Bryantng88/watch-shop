CREATE INDEX IF NOT EXISTS "ProjectionRecord_watch_list_sort_idx"
  ON "ProjectionRecord"("projectionKey", "sortAt" DESC NULLS LAST, "rowKey");
