import { TaskKind, TaskPeriod, TaskSource, TaskStatus } from "@prisma/client";
import { dbOrTx, withDbTransaction, type DB } from "@/server/db/client";
import {
  listWorkTypes,
  normalizeWorkTypeKey,
  type CoordinationWorkTypeDefinition,
} from "./coordination-work-type.registry";
import type {
  CoordinationContext,
  CoordinationWeekRange,
  EnsureCoordinationCycleInput,
  EnsureCoordinationCycleResult,
  ResolveCurrentCoordinationCycleInput,
  ResolveCurrentCoordinationCycleResult,
} from "./coordination-cycle.types";

const COORDINATION_CYCLE_TASK_SELECT = {
  id: true,
  title: true,
  description: true,
  source: true,
  kind: true,
  periodType: true,
  periodKey: true,
  status: true,
} as const;

const COORDINATION_WORK_TICKET_SELECT = {
  id: true,
  taskId: true,
  title: true,
  note: true,
  sortOrder: true,
  status: true,
} as const;

function startOfUtcDate(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function contextToTaskKind(context: CoordinationContext) {
  if (context === "OPERATION") return TaskKind.OPERATION;
  if (context === "TECHNICAL") return TaskKind.SERVICE;

  return TaskKind.BUSINESS;
}

function workTypeNote(workType: CoordinationWorkTypeDefinition) {
  return `workTypeKey: ${workType.key}`;
}

export function getWeekRange(date = new Date()): CoordinationWeekRange {
  const current = startOfUtcDate(date);
  const day = current.getUTCDay() || 7;
  const startDate = new Date(current);
  startDate.setUTCDate(current.getUTCDate() - day + 1);

  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 6);
  endDate.setUTCHours(23, 59, 59, 999);

  const weekDate = new Date(startDate);
  weekDate.setUTCDate(startDate.getUTCDate() + 3);

  const yearStart = new Date(Date.UTC(weekDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(
    ((weekDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  const year = weekDate.getUTCFullYear();

  return {
    weekLabel: `Tuần ${weekNumber}`,
    startDate,
    endDate,
    year,
    weekNumber,
    periodKey: `${year}-W${String(weekNumber).padStart(2, "0")}`,
  };
}

export function getCoordinationCycleTitle(
  context: CoordinationContext,
  weekNumber: number,
) {
  if (context === "OPERATION") return `Vận hành tuần ${weekNumber}`;
  if (context === "SALES") return `Bán hàng tuần ${weekNumber}`;
  if (context === "TECHNICAL") return `Kỹ thuật tuần ${weekNumber}`;

  return `Khác tuần ${weekNumber}`;
}

async function findCoordinationCycleTask(
  db: DB,
  input: {
    context: CoordinationContext;
    week: CoordinationWeekRange;
  },
) {
  const title = getCoordinationCycleTitle(
    input.context,
    input.week.weekNumber,
  );

  return dbOrTx(db).task.findFirst({
    where: {
      title,
      kind: contextToTaskKind(input.context),
      periodType: TaskPeriod.WEEKLY,
      periodKey: input.week.periodKey,
      status: { not: TaskStatus.CANCELLED },
    },
    select: COORDINATION_CYCLE_TASK_SELECT,
    orderBy: [
      { source: "asc" },
      { createdAt: "asc" },
    ],
  });
}

async function listWorkTicketsForCycle(db: DB, taskId: string) {
  return dbOrTx(db).taskItem.findMany({
    where: { taskId },
    select: COORDINATION_WORK_TICKET_SELECT,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function resolveCoordinationCycle(
  db: DB,
  input: ResolveCurrentCoordinationCycleInput,
): Promise<ResolveCurrentCoordinationCycleResult | null> {
  const week = getWeekRange(input.date);
  const task = await findCoordinationCycleTask(db, {
    context: input.context,
    week,
  });

  if (!task) return null;

  return {
    task,
    week,
    context: input.context,
  };
}

export async function ensureWorkTickets(
  db: DB,
  input: {
    taskId: string;
    context: CoordinationContext;
  },
) {
  const client = dbOrTx(db);
  const existing = await listWorkTicketsForCycle(client, input.taskId);
  const existingTitles = new Set(existing.map((item) => item.title.trim()));
  let createdCount = 0;

  for (const workType of listWorkTypes(input.context)) {
    if (existingTitles.has(workType.title)) continue;

    await client.taskItem.create({
      data: {
        taskId: input.taskId,
        title: workType.title,
        note: workTypeNote(workType),
        status: TaskStatus.TODO,
        priority: "MEDIUM",
        assignedToUserId: null,
        sortOrder: workType.sortOrder,
      },
    });

    existingTitles.add(workType.title);
    createdCount += 1;
  }

  return {
    items: await listWorkTicketsForCycle(client, input.taskId),
    createdCount,
  };
}

export async function ensureCoordinationCycle(
  db: DB,
  input: EnsureCoordinationCycleInput,
): Promise<EnsureCoordinationCycleResult> {
  const week = getWeekRange(input.date);

  return withDbTransaction(db, async (tx) => {
    const existing = await findCoordinationCycleTask(tx, {
      context: input.context,
      week,
    });

    if (existing) {
      const workTickets = await ensureWorkTickets(tx, {
        taskId: existing.id,
        context: input.context,
      });

      return {
        task: existing,
        week,
        context: input.context,
        created: false,
        workTickets: workTickets.items,
        workTicketsCreated: workTickets.createdCount,
      };
    }

    const title = getCoordinationCycleTitle(
      input.context,
      week.weekNumber,
    );

    const task = await tx.task.create({
      data: {
        title,
        description: `Coordination cycle ${input.context} ${week.periodKey}`,
        source: TaskSource.SYSTEM,
        kind: contextToTaskKind(input.context),
        periodType: TaskPeriod.WEEKLY,
        periodKey: week.periodKey,
        priority: "MEDIUM",
      },
      select: COORDINATION_CYCLE_TASK_SELECT,
    });

    const workTickets = await ensureWorkTickets(tx, {
      taskId: task.id,
      context: input.context,
    });

    return {
      task,
      week,
      context: input.context,
      created: true,
      workTickets: workTickets.items,
      workTicketsCreated: workTickets.createdCount,
    };
  });
}

export async function resolveCurrentCoordinationCycle(
  db: DB,
  input: ResolveCurrentCoordinationCycleInput & { createIfMissing?: boolean },
) {
  if (input.createIfMissing) {
    return ensureCoordinationCycle(db, input);
  }

  return resolveCoordinationCycle(db, input);
}

export function getWorkTypeKeyFromTicketNote(note: string | null | undefined) {
  const match = String(note ?? "").match(/workTypeKey:\s*([a-z0-9-]+)/i);
  return match ? normalizeWorkTypeKey(match[1]) : null;
}
