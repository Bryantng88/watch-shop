import { TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";

import { prisma } from "../src/server/db/client";
import { findRelatedTaskItemIdsForBusinessTarget } from "../src/domains/task/server/business-binding.service";

async function main() {
  const event = await prisma.businessEventLog.findFirst({
    where: { eventKey: "payment.paid", targetType: "PAYMENT" },
    orderBy: { createdAt: "desc" },
    select: { id: true, targetId: true, createdAt: true },
  });
  if (!event) throw new Error("NO_PAYMENT_PAID_EVENT");
  const taskItemIds = await findRelatedTaskItemIdsForBusinessTarget(prisma, {
    targetType: TaskExecutionTargetType.PAYMENT,
    targetId: event.targetId,
  });
  const bindings = await prisma.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.PAYMENT,
      targetId: event.targetId,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    select: { id: true, taskItemId: true, metadataJson: true },
  });
  const runtimeRows = bindings.map((binding) => {
    const metadata = binding.metadataJson as Record<string, unknown> | null;
    const runtime = metadata?.workflowRuntime as Record<string, unknown> | undefined;
    return { bindingId: binding.id, taskItemId: binding.taskItemId, workflowKey: runtime?.workflowKey ?? null, state: runtime?.currentState ?? null };
  });
  console.log(JSON.stringify({ event, relatedTaskItemIds: taskItemIds, bindings: runtimeRows }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
