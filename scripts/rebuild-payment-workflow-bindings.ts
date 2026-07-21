import { PaymentStatus, TaskExecutionActionType, TaskExecutionTargetType, type Prisma } from "@prisma/client";

import { prisma } from "../src/server/db/client";
import { getWorkTypeWorkflowDefinition } from "../src/domains/task/server/work-type.service";

const WORKFLOW_KEY = "payment-collection-workflow";

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

async function main() {
  const workflowDefinition = getWorkTypeWorkflowDefinition("payment");
  const bindings = await prisma.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.PAYMENT,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    select: { id: true, targetId: true, metadataJson: true, createdAt: true },
  });
  const payments = await prisma.payment.findMany({
    where: { id: { in: bindings.map((binding) => binding.targetId) } },
    select: { id: true, status: true, paidAt: true, updatedAt: true },
  });
  const paymentById = new Map(payments.map((payment) => [payment.id, payment]));
  let updated = 0;

  for (const binding of bindings) {
    const payment = paymentById.get(binding.targetId);
    const metadata = record(binding.metadataJson);
    const previousRuntime = record(metadata.workflowRuntime);
    const state = payment?.status === PaymentStatus.PAID
      ? "PAID"
      : payment?.status === PaymentStatus.CANCELED
        ? "EXCEPTION"
        : "READY";
    const timestamp = (payment?.updatedAt ?? binding.createdAt).toISOString();
    const terminal = state === "PAID" || state === "EXCEPTION";
    const nextMetadata = {
      ...metadata,
      workTypeKey: "payment",
      workflowKey: WORKFLOW_KEY,
      appliedWorkflowSnapshot: JSON.parse(JSON.stringify(workflowDefinition)) as Prisma.JsonObject,
      workflowRuntime: {
        ...previousRuntime,
        workflowKey: WORKFLOW_KEY,
        currentState: state,
        startedAt: String(previousRuntime.startedAt ?? binding.createdAt.toISOString()),
        updatedAt: timestamp,
        completedAt: terminal ? (payment?.paidAt ?? payment?.updatedAt ?? binding.createdAt).toISOString() : null,
        metadata: previousRuntime.metadata ?? null,
      },
    } satisfies Prisma.JsonObject;

    await prisma.taskExecution.update({
      where: { id: binding.id },
      data: { metadataJson: nextMetadata },
    });
    updated += 1;
  }

  console.log(JSON.stringify({ ok: true, bindings: bindings.length, payments: payments.length, updated }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
