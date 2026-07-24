UPDATE "TechnicalIssue"
SET "expectedCompletionAt" = "startedAt" + ("expectedWorkingDays" * INTERVAL '1 day')
WHERE "startedAt" IS NOT NULL
  AND "expectedWorkingDays" IS NOT NULL;

WITH latest_eta AS (
  SELECT DISTINCT ON (sr."productId")
    sr."productId",
    ti."expectedWorkingDays",
    ti."expectedCompletionAt"
  FROM "TechnicalIssue" ti
  INNER JOIN "ServiceRequest" sr ON sr."id" = ti."serviceRequestId"
  WHERE sr."productId" IS NOT NULL
    AND ti."expectedCompletionAt" IS NOT NULL
    AND ti."executionStatus" NOT IN ('DONE', 'CANCELED')
  ORDER BY sr."productId", ti."expectedCompletionAt" DESC
)
UPDATE "Watch" w
SET
  "serviceExpectedWorkingDays" = latest_eta."expectedWorkingDays",
  "serviceExpectedCompletionAt" = latest_eta."expectedCompletionAt",
  "updatedAt" = NOW()
FROM latest_eta
WHERE w."productId" = latest_eta."productId";
