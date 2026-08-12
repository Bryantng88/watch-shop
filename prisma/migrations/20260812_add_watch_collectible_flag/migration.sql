ALTER TABLE "Watch"
ADD COLUMN "isCollectible" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Watch_isCollectible_updatedAt_idx"
ON "Watch"("isCollectible", "updatedAt");
