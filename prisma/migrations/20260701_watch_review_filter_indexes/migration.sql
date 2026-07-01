CREATE INDEX "WatchReviewState_watch_target_status_idx"
ON "WatchReviewState"("watchId", "targetType", "status");

CREATE INDEX "WatchReviewState_target_status_watch_idx"
ON "WatchReviewState"("targetType", "status", "watchId");
