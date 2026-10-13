ALTER TABLE "WatchSpecV2"
ADD COLUMN "goldWeightGrams" DECIMAL(12,3);

ALTER TABLE "WatchSpecV2"
ADD CONSTRAINT "WatchSpecV2_goldWeightGrams_nonnegative"
CHECK ("goldWeightGrams" IS NULL OR "goldWeightGrams" >= 0);
