import { notFound } from "next/navigation";
import TaskItemDetailClient from "@/domains/task/client/TaskItemDetailClient";
import { getTaskItemDetailPageData } from "@/domains/task/server/core/task-item-detail.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

type PageProps = {
  params: Promise<{ id: string }>;
};

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default async function AdminTaskItemDetailPage(props: PageProps) {
  const { id } = await props.params;
  const auth = await requirePermission("TASK_VIEW");
  const item = await getTaskItemDetailPageData(prisma, id, auth);

  if (!item) notFound();

  return <TaskItemDetailClient item={serialize(item)} />;
}
