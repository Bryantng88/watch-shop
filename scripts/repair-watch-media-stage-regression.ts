import { TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";

import { consumeBusinessEventForCoordination } from "@/domains/coordination/server/coordination-event-consumer";
import { prisma } from "@/server/db/client";

const APPLY = process.argv.includes("--apply");
const FORWARD_EVENT = "watch.media.ready_for_publish";
const REGRESSION_EVENTS = [
  "watch.media.photoshoot.requested",
  "watch.media.recalled",
  "watch.content.rejected",
  "watch.content.unapproved",
  "watch.image.rejected",
  "watch.image.unapproved",
];

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function workTypeKey(input: { metadataJson: unknown; taskItem: { note: string | null } | null }) {
  const metadataKey = String(record(input.metadataJson).workTypeKey ?? "").trim();
  const noteKey = String(input.taskItem?.note ?? "")
    .match(/workTypeKey:\s*([^\r\n]+)/i)?.[1]
    ?.trim();
  return (metadataKey || noteKey || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function activityAt(input: { metadataJson: unknown; createdAt: Date }) {
  const runtime = record(record(input.metadataJson).workflowRuntime);
  const timestamp = Date.parse(String(runtime.updatedAt ?? ""));
  return Number.isFinite(timestamp) ? timestamp : input.createdAt.getTime();
}

async function main() {
  const bindings = await prisma.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    select: {
      id: true,
      targetId: true,
      metadataJson: true,
      createdAt: true,
      taskItem: { select: { note: true } },
    },
  });

  const visibleByWatch = new Map<string, (typeof bindings)[number]>();
  for (const binding of bindings) {
    if (!workTypeKey(binding).match(/^(photography|media-processing|publish)$/)) continue;
    const current = visibleByWatch.get(binding.targetId);
    if (!current || activityAt(binding) > activityAt(current)) {
      visibleByWatch.set(binding.targetId, binding);
    }
  }

  const mediaProcessingWatchIds = [...visibleByWatch]
    .filter(([, binding]) => workTypeKey(binding) === "media-processing")
    .map(([watchId]) => watchId);

  const events = mediaProcessingWatchIds.length
    ? await prisma.businessEventLog.findMany({
        where: {
          targetType: "WATCH",
          targetId: { in: mediaProcessingWatchIds },
          eventKey: { in: [FORWARD_EVENT, ...REGRESSION_EVENTS] },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const eventsByWatch = new Map<string, typeof events>();
  for (const event of events) {
    const list = eventsByWatch.get(event.targetId) ?? [];
    list.push(event);
    eventsByWatch.set(event.targetId, list);
  }

  const candidates = mediaProcessingWatchIds.flatMap((watchId) => {
    const history = eventsByWatch.get(watchId) ?? [];
    const ready = history.find((event) => event.eventKey === FORWARD_EVENT);
    if (!ready) return [];
    const latestRegression = history.find((event) => REGRESSION_EVENTS.includes(event.eventKey));
    if (latestRegression && latestRegression.createdAt >= ready.createdAt) return [];
    return [{ watchId, ready, binding: visibleByWatch.get(watchId)! }];
  });

  console.log(
    `[repair-watch-media-stage-regression] mode=${APPLY ? "apply" : "dry-run"} ` +
    `mediaProcessing=${mediaProcessingWatchIds.length} candidates=${candidates.length}`,
  );

  for (const candidate of candidates) {
    console.log(
      `watch=${candidate.watchId} binding=${candidate.binding.id} ` +
      `readyAt=${candidate.ready.createdAt.toISOString()}`,
    );
    if (!APPLY) continue;

    const result = await consumeBusinessEventForCoordination(prisma, {
      id: candidate.ready.id,
      businessEventLogId: candidate.ready.id,
      eventKey: candidate.ready.eventKey,
      targetType: candidate.ready.targetType,
      targetId: candidate.ready.targetId,
      actorUserId: candidate.ready.actorUserId,
      metadataJson: candidate.ready.metadataJson,
      createdAt: candidate.ready.createdAt,
    });
    console.log(`repair=${JSON.stringify(result)}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
