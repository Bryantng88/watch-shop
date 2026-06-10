import { TaskPriority, WorkCaseScope, WorkCaseStatus } from "@prisma/client";
import WorkCaseListClient from "@/domains/work-case/client/WorkCaseListClient";
import { getWorkCaseListPageData } from "@/domains/work-case/server/work-case.service";
import { listActiveTaskTypes } from "@/domains/task/server/task-type.service";

import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import type { WorkCaseViewKey } from "@/domains/work-case/server/work-case.types";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminWorkCasesPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  const auth = await requirePermission("TASK_VIEW");



  const permissions =
    (auth as any)?.user?.permissions ??
    (auth as any)?.permissions ??
    [];

  const role =
    (auth as any)?.user?.role ??
    (auth as any)?.role ??
    null;

  const canManage =
    permissions.includes("TASK_MANAGE") ||
    permissions.includes("WORK_CASE_MANAGE") ||
    role === "ADMIN";
  const page = Math.max(1, Number(first(searchParams.page) || 1));
  const pageSize = Math.min(
    100,
    Math.max(10, Number(first(searchParams.pageSize) || 25)),
  );

  const data = await getWorkCaseListPageData(prisma, {

    auth,
    filters: {
      view: (first(searchParams.view) || "mine") as WorkCaseViewKey,
      q: first(searchParams.q) || "",
      status: (first(searchParams.status) || "OPEN") as WorkCaseStatus | "OPEN" | "ALL",
      scope: (first(searchParams.scope) || "ALL") as WorkCaseScope | "ALL",
      priority: (first(searchParams.priority) || "ALL") as TaskPriority | "ALL",
      page,
      pageSize,
    },
  });
  const taskTypes = await listActiveTaskTypes();
  return (
    <WorkCaseListClient
      {...data}
      taskTypes={taskTypes}
      canManage={canManage}
      rawSearchParams={searchParams}
    />
  );
}