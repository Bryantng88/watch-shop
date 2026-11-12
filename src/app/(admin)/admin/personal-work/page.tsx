import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getPersonalWorkPageData } from "@/domains/personal-work";
import { PersonalWorkClient } from "@/domains/personal-work/ui/PersonalWorkClient";

export const dynamic = "force-dynamic";

export default async function PersonalWorkPage() {
  const user = await requirePermission(PERMISSIONS.TASK_VIEW);
  return <PersonalWorkClient data={await getPersonalWorkPageData(user)} />;
}
