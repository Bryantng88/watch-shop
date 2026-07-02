import { notFound, redirect } from "next/navigation";
import { TaskKind, TaskPeriod, TaskSource } from "@prisma/client";
import TaskDetailClient from "@/domains/task/client/TaskDetailClient";
import { getTaskDetail } from "@/domains/task/server/core/task.service";
import { listAssignableUsersRepo } from "@/domains/task/server/core/task.repo";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

type PageProps = {
  params: Promise<{ id: string }>;
};

function dateFromIsoWeekPeriod(periodKey?: string | null) {
  const match = String(periodKey ?? "").match(/^(\d{4})-W(\d{1,2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(week)) return null;

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const day = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - day + 1 + (week - 1) * 7);

  return monday.toISOString().slice(0, 10);
}

function coordinationWorkspaceHref(task: {
  kind: TaskKind;
  source: TaskSource;
  periodType: TaskPeriod | null;
  periodKey: string | null;
  title: string;
}) {
  if (task.source !== TaskSource.SYSTEM) return null;
  if (task.periodType !== TaskPeriod.WEEKLY) return null;

  let workspace: "operation" | "sales" | "technical" | "general" | null = null;
  const title = task.title.toLowerCase();

  if (task.kind === TaskKind.OPERATION) workspace = "operation";
  if (task.kind === TaskKind.SERVICE) workspace = "technical";
  if (task.kind === TaskKind.BUSINESS) {
    workspace = title.includes("khác") || title.includes("khac")
      ? "general"
      : "sales";
  }

  if (!workspace) return null;

  const date = dateFromIsoWeekPeriod(task.periodKey);
  return date
    ? `/admin/coordination/${workspace}?date=${date}`
    : `/admin/coordination/${workspace}`;
}

export default async function AdminTaskDetailPage(props: PageProps) {
  const { id } = await props.params;
  const auth = await requirePermission("TASK_VIEW");

  const routeProbe = await prisma.task.findUnique({
    where: { id },
    select: {
      kind: true,
      source: true,
      periodType: true,
      periodKey: true,
      title: true,
    },
  });

  if (!routeProbe) notFound();

  const coordinationHref = coordinationWorkspaceHref(routeProbe);
  if (coordinationHref) redirect(coordinationHref);

  const [task, users] = await Promise.all([
    getTaskDetail(prisma, id, auth),
    listAssignableUsersRepo(prisma),
  ]);

  if (!task) notFound();

  return <TaskDetailClient task={task} users={users} />;
}
