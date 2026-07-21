import { TaskExecutionActionType, TaskStatus } from "@prisma/client";

import { prisma } from "../src/server/db/client";
import { ensureCoordinationCycle } from "../src/domains/coordination/server/coordination-cycle.service";

async function main() {
  const cycle = await ensureCoordinationCycle(prisma, { context: "OPERATION" });
  const unifiedItems = await prisma.taskItem.findMany({
    where: { taskId: cycle.task.id, status: { not: TaskStatus.CANCELLED } },
    select: { id: true, title: true },
  });
  const unifiedByTitle = new Map(unifiedItems.map((item) => [item.title.trim(), item]));
  const legacyTasks = await prisma.task.findMany({
    where: {
      id: { not: cycle.task.id },
      periodKey: cycle.week.periodKey,
      status: { not: TaskStatus.CANCELLED },
      title: { endsWith: `tuần ${cycle.week.weekNumber}` },
    },
    select: {
      id: true,
      title: true,
      taskItems: {
        where: { status: { not: TaskStatus.CANCELLED } },
        select: {
          id: true,
          title: true,
          note: true,
          status: true,
          priority: true,
          assignedToUserId: true,
          userId: true,
          sortOrder: true,
          dueAt: true,
        },
      },
    },
  });

  let copied = 0;
  let alreadyPresent = 0;
  let unmatchedWorkspaces = 0;
  const unmatchedWorkspaceTitles = new Set<string>();
  for (const legacyTask of legacyTasks) {
    for (const legacyItem of legacyTask.taskItems) {
      let destination = unifiedByTitle.get(legacyItem.title.trim());
      if (!destination && legacyItem.title.startsWith("Service Operation - SR-")) {
        destination = await prisma.taskItem.create({
          data: {
            taskId: cycle.task.id,
            title: legacyItem.title,
            note: legacyItem.note,
            status: legacyItem.status,
            priority: legacyItem.priority,
            assignedToUserId: legacyItem.assignedToUserId,
            userId: legacyItem.userId,
            sortOrder: legacyItem.sortOrder,
            dueAt: legacyItem.dueAt,
          },
          select: { id: true, title: true },
        });
        unifiedByTitle.set(destination.title.trim(), destination);
      }
      if (!destination) {
        unmatchedWorkspaces += 1;
        unmatchedWorkspaceTitles.add(`${legacyTask.title} → ${legacyItem.title}`);
        continue;
      }
      const bindings = await prisma.taskExecution.findMany({
        where: {
          taskId: legacyTask.id,
          taskItemId: legacyItem.id,
          actionType: { not: TaskExecutionActionType.CANCELLED },
        },
      });
      for (const binding of bindings) {
        const exists = await prisma.taskExecution.findFirst({
          where: {
            taskId: cycle.task.id,
            taskItemId: destination.id,
            targetType: binding.targetType,
            targetId: binding.targetId,
            actionType: { not: TaskExecutionActionType.CANCELLED },
          },
          select: { id: true },
        });
        if (exists) {
          alreadyPresent += 1;
          continue;
        }
        await prisma.taskExecution.create({
          data: {
            taskId: cycle.task.id,
            taskItemId: destination.id,
            targetType: binding.targetType,
            targetId: binding.targetId,
            actionType: binding.actionType,
            metadataJson: binding.metadataJson ?? undefined,
            note: binding.note,
            createdByUserId: binding.createdByUserId,
            serviceRequestId: binding.serviceRequestId,
            technicalIssueId: binding.technicalIssueId,
          },
        });
        copied += 1;
      }
    }
  }

  console.log(JSON.stringify({
    ok: true,
    operationSpace: { id: cycle.task.id, title: cycle.task.title, periodKey: cycle.week.periodKey },
    coreFlowWorkspaces: unifiedItems.length,
    legacySpacesKept: legacyTasks.length,
    bindingsCopied: copied,
    bindingsAlreadyPresent: alreadyPresent,
    unmatchedWorkspaces,
    unmatchedWorkspaceTitles: [...unmatchedWorkspaceTitles],
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
