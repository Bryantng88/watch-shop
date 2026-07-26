import { findQueueActivityStatsByTaskItemTargets } from "../src/domains/task/server/business-binding.repo";
import { prisma } from "../src/server/db/client";

async function main() {
  const activity = await prisma.taskItemActivity.findFirst({
    where: {
      metadataJson: {
        path: ["targetId"],
        not: null,
      },
    },
    select: {
      taskItemId: true,
      metadataJson: true,
    },
    orderBy: { occurredAt: "desc" },
  });
  const metadata = activity?.metadataJson &&
    typeof activity.metadataJson === "object" &&
    !Array.isArray(activity.metadataJson)
    ? activity.metadataJson as Record<string, unknown>
    : null;
  const activityTargetType = String(metadata?.targetType ?? "").trim();
  const activityTargetId = String(metadata?.targetId ?? "").trim();
  if (activity && activityTargetType && activityTargetId) {
    const rows = await findQueueActivityStatsByTaskItemTargets(prisma, {
      taskItemId: activity.taskItemId,
      targetType: activityTargetType as never,
      targetIds: [activityTargetId],
    });
    console.log(JSON.stringify({
      ok: true,
      sample: true,
      targets: 1,
      rows: rows.length,
    }));
    return;
  }
  const bindings = await prisma.taskExecution.findMany({
    where: {
      taskItemId: { not: null },
      actionType: { not: "CANCELLED" },
    },
    select: {
      taskItemId: true,
      targetType: true,
      targetId: true,
    },
    take: 20,
  });
  const sample = bindings.find((binding) => binding.taskItemId);
  if (!sample?.taskItemId) {
    console.log(JSON.stringify({ ok: true, sample: false, rows: 0 }));
    return;
  }
  const targetIds = bindings
    .filter(
      (binding) =>
        binding.taskItemId === sample.taskItemId &&
        binding.targetType === sample.targetType,
    )
    .map((binding) => binding.targetId);
  const rows = await findQueueActivityStatsByTaskItemTargets(prisma, {
    taskItemId: sample.taskItemId,
    targetType: sample.targetType,
    targetIds,
  });
  console.log(JSON.stringify({
    ok: true,
    sample: true,
    targets: targetIds.length,
    rows: rows.length,
  }));
}

main()
  .finally(() => prisma.$disconnect());
