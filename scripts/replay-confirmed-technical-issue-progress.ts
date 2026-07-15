import { consumeBusinessEventForCoordination } from "@/domains/coordination/server";
import { prisma } from "@/server/db/client";

const APPLY = process.argv.includes("--apply");

function isConfirmedStatus(value: unknown) {
  return String(value ?? "").toUpperCase() === "CONFIRMED";
}

async function main() {
  const events = await prisma.businessEventLog.findMany({
    where: {
      eventKey: "technical_issue.confirmed",
      targetType: "TECHNICAL_ISSUE",
    },
    select: {
      id: true,
      eventKey: true,
      targetType: true,
      targetId: true,
      actorUserId: true,
      metadataJson: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
  const issueIds = events.map((event) => event.targetId);
  const issues = issueIds.length
    ? await prisma.technicalIssue.findMany({
        where: { id: { in: issueIds } },
        select: {
          id: true,
          summary: true,
          executionStatus: true,
          serviceRequest: {
            select: {
              refNo: true,
            },
          },
        },
      })
    : [];
  const issueById = new Map(issues.map((issue) => [issue.id, issue]));
  const confirmedEvents = events.filter((event) =>
    isConfirmedStatus(issueById.get(event.targetId)?.executionStatus),
  );

  console.log(
    JSON.stringify(
      {
        apply: APPLY,
        confirmedEventCount: confirmedEvents.length,
        targets: confirmedEvents.map((event) => {
          const issue = issueById.get(event.targetId);
          return {
            eventId: event.id,
            issueId: event.targetId,
            summary: issue?.summary ?? null,
            sr: issue?.serviceRequest?.refNo ?? null,
            status: issue?.executionStatus ?? null,
          };
        }),
      },
      null,
      2,
    ),
  );

  if (!APPLY) return;

  for (const event of confirmedEvents) {
    const result = await consumeBusinessEventForCoordination(prisma, {
      id: event.id,
      businessEventLogId: event.id,
      eventKey: event.eventKey,
      targetType: event.targetType,
      targetId: event.targetId,
      actorUserId: event.actorUserId,
      metadataJson: event.metadataJson,
      createdAt: event.createdAt,
    });

    console.log(
      JSON.stringify({
        eventId: event.id,
        issueId: event.targetId,
        skipped: result.skipped,
        taskItemId: "taskItemId" in result ? result.taskItemId : null,
        bindingId: "bindingId" in result ? result.bindingId : null,
        reason: result.skipped ? result.reason : null,
      }),
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
