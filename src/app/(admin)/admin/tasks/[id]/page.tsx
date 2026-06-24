import { notFound } from "next/navigation";
import TaskDetailClient from "@/domains/task/client/TaskDetailClient";
import { getTaskDetail } from "@/domains/task/server/core/task.service";
import { listAssignableUsersRepo } from "@/domains/task/server/core/task.repo";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTaskDetailPage(props: PageProps) {
  const { id } = await props.params;
  const auth = await requirePermission("TASK_VIEW");

  const [task, users] = await Promise.all([
    getTaskDetail(prisma, id, auth),
    listAssignableUsersRepo(prisma),
  ]);

  if (!task) notFound();

  return <TaskDetailClient task={task} users={users} />;
}