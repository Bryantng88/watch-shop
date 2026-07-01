import { TaskKind, TaskPriority, TaskStatus } from "@prisma/client";

import TaskItemListClient from "@/domains/task/client/TaskItemListClient";
import { getTaskItemListPageData } from "@/domains/task/server/core/task.service";
import type { TaskItemListFilters } from "@/domains/task/server/task.types";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default async function AdminTaskItemsPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  const auth = await requirePermission("TASK_VIEW");

  const page = Math.max(1, Number(first(searchParams.page) || 1));
  const pageSize = Math.min(
    100,
    Math.max(10, Number(first(searchParams.pageSize) || 25)),
  );

  const filters: TaskItemListFilters = {
    q: first(searchParams.q) || "",
    status: (first(searchParams.status) || "OPEN") as TaskStatus | "OPEN" | "ALL",
    priority: (first(searchParams.priority) || "ALL") as TaskPriority | "ALL",
    kind: (first(searchParams.kind) || "ALL") as TaskKind | "ALL",
    taskId: first(searchParams.taskId) || null,
    page,
    pageSize,
  };

  const data = await getTaskItemListPageData(prisma, { auth, filters });

  return (
    <TaskItemListClient
      {...serialize(data)}
      rawSearchParams={searchParams}
    />
  );
}
