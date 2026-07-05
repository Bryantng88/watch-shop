import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

function argValue(name: string) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length)?.trim() || "";
}

async function main() {
  const taskItemId = argValue("task-item-id");
  if (!taskItemId) throw new Error("Provide --task-item-id=<id>.");

  const item = await prisma.taskItem.findUnique({
    where: { id: taskItemId },
    select: {
      id: true,
      title: true,
      status: true,
      isDone: true,
      note: true,
      task: {
        select: {
          id: true,
          title: true,
          periodKey: true,
        },
      },
      executions: {
        select: {
          id: true,
          targetType: true,
          targetId: true,
          actionType: true,
        },
      },
      activities: {
        select: {
          id: true,
          title: true,
        },
      },
      checklists: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!item) throw new Error(`Task item workspace not found: ${taskItemId}`);

  console.log("[delete-task-item-workspace] mode:", apply ? "APPLY" : "DRY_RUN");
  console.log("[delete-task-item-workspace] parent space:", item.task);
  console.log("[delete-task-item-workspace] workspace item:", {
    id: item.id,
    title: item.title,
    status: item.status,
    isDone: item.isDone,
  });
  console.log("[delete-task-item-workspace] executions:", item.executions.length);
  console.log("[delete-task-item-workspace] activities:", item.activities.length);
  console.log("[delete-task-item-workspace] checklists:", item.checklists.length);
  console.table(
    item.executions.map((execution) => ({
      id: execution.id,
      targetType: execution.targetType,
      targetId: execution.targetId,
      actionType: execution.actionType,
    })),
  );

  if (!apply) {
    console.log("[delete-task-item-workspace] add --apply to delete this workspace item.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.taskExecution.deleteMany({
      where: { taskItemId: item.id },
    });

    await tx.taskItem.delete({
      where: { id: item.id },
    });
  });

  console.log("[delete-task-item-workspace] deleted workspace item:", item.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
