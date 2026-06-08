import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import TaskTypeSettingsClient from "@/domains/task/client/TaskTypeSettingsClient";
import { getTaskTypeSettingsPageData } from "@/domains/task/server/task-type.service";

export default async function TaskTypeSettingsPage() {
  await requirePermission("TASK_VIEW");
  const data = await getTaskTypeSettingsPageData(prisma);
  return <TaskTypeSettingsClient items={data.items} />;
}
