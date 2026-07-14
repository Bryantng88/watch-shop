import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

const REQUIRED_LINES = [
  "operationWorkspaceRole: SR_CASE",
  "workspaceKind: CASE_WORKSPACE",
  "identityTargetType: SERVICE_REQUEST",
];

function hasLine(note: string, key: string) {
  return new RegExp(`^${key}:\\s*`, "im").test(note);
}

function appendMissingLines(note: string | null) {
  const text = String(note ?? "").trim();
  const lines = text ? text.split(/\r?\n/) : [];
  for (const line of REQUIRED_LINES) {
    const key = line.split(":")[0] ?? "";
    if (key && !hasLine(text, key)) lines.push(line);
  }

  return lines.join("\n");
}

async function main() {
  const items = await prisma.taskItem.findMany({
    where: {
      note: {
        contains: "serviceOperationWorkspaceRole: SR_CASE",
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      title: true,
      note: true,
      task: { select: { title: true, periodKey: true } },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  const changes = items
    .map((item) => ({
      ...item,
      nextNote: appendMissingLines(item.note),
    }))
    .filter((item) => item.nextNote !== String(item.note ?? "").trim());

  console.log("[backfill-sr-case-workspace-metadata] mode:", apply ? "APPLY" : "DRY_RUN");
  console.log("[backfill-sr-case-workspace-metadata] matched:", items.length);
  console.log("[backfill-sr-case-workspace-metadata] changes:", changes.length);
  console.table(
    changes.map((item) => ({
      id: item.id,
      title: item.title,
      parentSpace: item.task.title,
      periodKey: item.task.periodKey,
    })),
  );

  if (!apply) {
    console.log("[backfill-sr-case-workspace-metadata] add --apply to update notes.");
    return;
  }

  for (const item of changes) {
    await prisma.taskItem.update({
      where: { id: item.id },
      data: { note: item.nextNote },
    });
  }

  console.log("[backfill-sr-case-workspace-metadata] updated:", changes.length);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
