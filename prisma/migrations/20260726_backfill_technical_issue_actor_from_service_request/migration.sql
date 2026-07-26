UPDATE "BusinessEventLog" AS ti_event
SET "actorUserId" = sr_event."actorUserId"
FROM "BusinessEventLog" AS sr_event
WHERE ti_event."eventKey" = 'technical_issue.created'
  AND ti_event."targetType" = 'TECHNICAL_ISSUE'
  AND ti_event."actorUserId" IS NULL
  AND sr_event."eventKey" = 'service_request.created'
  AND sr_event."targetType" = 'SERVICE_REQUEST'
  AND sr_event."targetId" = ti_event."metadataJson"->>'serviceRequestId'
  AND sr_event."actorUserId" IS NOT NULL;
