import { TaskKind, TaskPriority, TaskStatus } from "@prisma/client";

import TaskListClient from "@/domains/task/client/TaskListClient";
import { getTaskListPageData } from "@/domains/task/server/core/task.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import type { TaskViewKey } from "@/domains/task/server/task.types";

type PageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

export default async function AdminTasksPage(props: PageProps) {
    const searchParams = (await props.searchParams) ?? {};

    const auth = await requirePermission("TASK_VIEW");

    const page = Math.max(1, Number(first(searchParams.page) || 1));
    const pageSize = Math.min(
        100,
        Math.max(10, Number(first(searchParams.pageSize) || 25))
    );

    const data = await getTaskListPageData(prisma, {
        auth,
        filters: {
            view: (first(searchParams.view) || "all") as TaskViewKey,
            q: first(searchParams.q) || "",
            status: (first(searchParams.status) || "OPEN") as
                | TaskStatus
                | "OPEN"
                | "ALL",
            priority: (first(searchParams.priority) || "ALL") as
                | TaskPriority
                | "ALL",
            kind: (first(searchParams.kind) || "ALL") as TaskKind | "ALL",
            page,
            pageSize,
        },
    });

    return <TaskListClient {...data} rawSearchParams={searchParams} />;
}