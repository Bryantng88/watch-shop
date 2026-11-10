-- Nullable start gate preserves immediate execution for existing queued runs.
ALTER TABLE "PersonalCodexRun" ADD COLUMN "notBefore" TIMESTAMPTZ(6);
CREATE INDEX "PersonalCodexRun_status_notBefore_createdAt_idx" ON "PersonalCodexRun"("status", "notBefore", "createdAt");
