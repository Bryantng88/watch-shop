-- A Payment may occupy only one active Payment Collection workspace per task.
-- Prefer the workspace matching the business status while repairing legacy races.
WITH ranked_payment_bindings AS (
  SELECT
    execution."id",
    ROW_NUMBER() OVER (
      PARTITION BY execution."taskId", execution."targetType", execution."targetId"
      ORDER BY
        CASE
          WHEN UPPER(payment."status"::text) IN ('PAID', 'COLLECTED', 'CANCELED', 'CANCELLED', 'FAILED')
            AND item."note" ~* '(^|[[:space:]])operationWorkspaceRole:[[:space:]]*PAYMENT_SETTLED([[:space:]]|$)'
            THEN 0
          WHEN UPPER(payment."status"::text) NOT IN ('PAID', 'COLLECTED', 'CANCELED', 'CANCELLED', 'FAILED')
            AND item."note" ~* '(^|[[:space:]])operationWorkspaceRole:[[:space:]]*PAYMENT_REVIEW([[:space:]]|$)'
            THEN 0
          ELSE 1
        END,
        execution."createdAt" DESC,
        execution."id" DESC
    ) AS binding_rank
  FROM "TaskExecution" execution
  INNER JOIN "Payment" payment
    ON payment."id" = execution."targetId"
  LEFT JOIN "TaskItem" item
    ON item."id" = execution."taskItemId"
  WHERE execution."targetType" = 'PAYMENT'
    AND execution."actionType" <> 'CANCELLED'
    AND execution."taskItemId" IS NOT NULL
)
UPDATE "TaskExecution" execution
SET "actionType" = 'CANCELLED'
FROM ranked_payment_bindings ranked
WHERE execution."id" = ranked."id"
  AND ranked.binding_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS "task_execution_payment_active_per_task_unique"
ON "TaskExecution" ("taskId", "targetType", "targetId")
WHERE "targetType" = 'PAYMENT'
  AND "actionType" <> 'CANCELLED'
  AND "taskItemId" IS NOT NULL;
