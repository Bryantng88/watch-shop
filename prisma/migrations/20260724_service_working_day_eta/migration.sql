ALTER TABLE "TechnicalIssue"
ADD COLUMN "expectedWorkingDays" INTEGER,
ADD COLUMN "expectedCompletionAt" TIMESTAMP(6);

ALTER TABLE "Watch"
ADD COLUMN "serviceExpectedWorkingDays" INTEGER,
ADD COLUMN "serviceExpectedCompletionAt" TIMESTAMP(6);

CREATE INDEX "TechnicalIssue_expectedCompletionAt_idx"
ON "TechnicalIssue"("expectedCompletionAt");

CREATE INDEX "Watch_serviceExpectedCompletionAt_idx"
ON "Watch"("serviceExpectedCompletionAt");
