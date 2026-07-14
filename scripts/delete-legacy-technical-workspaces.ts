import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

const LEGACY_WORK_TYPE_KEYS = new Set([
  "technical",
  "repair",
  "inspection",
  "warranty",
]);

function noteValue(note: string | null | undefined, key: string) {
  return String(note ?? "")
    .match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "im"))?.[1]
    ?.trim() ?? null;
}

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const candidates = await prisma.taskItem.findMany({
    where: {
      OR: [
        { note: { contains: "workTypeKey: technical", mode: "insensitive" } },
        { note: { contains: "workTypeKey: repair", mode: "insensitive" } },
        { note: { contains: "workTypeKey: inspection", mode: "insensitive" } },
        { note: { contains: "workTypeKey: warranty", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      title: true,
      note: true,
      status: true,
      task: {
        select: {
          id: true,
          title: true,
          kind: true,
          periodKey: true,
        },
      },
      _count: {
        select: {
          activities: true,
          checklists: true,
          executions: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  const items = candidates.filter((item) =>
    LEGACY_WORK_TYPE_KEYS.has(normalize(noteValue(item.note, "workTypeKey"))),
  );
  const itemIds = items.map((item) => item.id);

  console.log("[delete-legacy-technical-workspaces] mode:", apply ? "APPLY" : "DRY_RUN");
  console.log("[delete-legacy-technical-workspaces] matched:", items.length);
  console.table(
    items.map((item) => ({
      id: item.id,
      title: item.title,
      workTypeKey: noteValue(item.note, "workTypeKey"),
      status: item.status,
      parentSpace: item.task.title,
      periodKey: item.task.periodKey,
      executions: item._count.executions,
      activities: item._count.activities,
      checklists: item._count.checklists,
    })),
  );

  if (!apply) {
    console.log("[delete-legacy-technical-workspaces] add --apply to delete matched workspaces.");
    return;
  }

  const result = await prisma.$transaction(async (tx) => {
    const executions = await tx.taskExecution.deleteMany({
      where: { taskItemId: { in: itemIds } },
    });
    const taskItems = await tx.taskItem.deleteMany({
      where: { id: { in: itemIds } },
    });

    return {
      executions: executions.count,
      taskItems: taskItems.count,
    };
  });

  console.log("[delete-legacy-technical-workspaces] deleted:", result);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
