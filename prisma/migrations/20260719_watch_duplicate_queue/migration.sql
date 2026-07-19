ALTER TABLE "Watch"
ADD COLUMN "duplicateConfirmedAt" TIMESTAMPTZ(6),
ADD COLUMN "duplicateConfirmedByUserId" TEXT;

CREATE INDEX "Watch_duplicateConfirmedAt_idx"
ON "Watch"("duplicateConfirmedAt");
