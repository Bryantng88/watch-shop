import TaskTypeSettingsClient from "@/domains/task/client/TaskTypeSettingsClient";
import { getTaskTypeSettingsPageData } from "@/domains/task/server/task-type.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

export default async function AdminTaskTypesSettingsPage() {
  await requirePermission("TASK_MANAGE");
  const data = await getTaskTypeSettingsPageData(prisma, {
    isActive: "ALL",
  });

  return <TaskTypeSettingsClient items={data.items} />;
}
