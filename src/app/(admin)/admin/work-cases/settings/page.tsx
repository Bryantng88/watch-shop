import WorkCaseSettingsClient from "@/domains/work-case/client/WorkCaseSettingsClient";
import { getWorkCaseSettingsPageData } from "@/domains/work-case/server/work-case.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

export default async function WorkCaseSettingsPage() {
  await requirePermission("TASK_VIEW");
  const data = await getWorkCaseSettingsPageData(prisma);
  return <WorkCaseSettingsClient {...data} />;
}
