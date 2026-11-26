import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getPersonalWorkPageData } from "@/domains/personal-work";
import { PersonalWorkClient } from "@/domains/personal-work/ui/PersonalWorkClient";

export const dynamic = "force-dynamic";

export default async function PersonalWorkPage() {
  const start = performance.now();
  const user = await requirePermission(PERMISSIONS.TASK_VIEW);
  const authorized = performance.now();
  const data = await getPersonalWorkPageData(user);
  console.info("[personal-work-timing]", JSON.stringify({
    authMs: Math.round(authorized - start),
    dataMs: Math.round(performance.now() - authorized),
  }));
  return <PersonalWorkClient data={data} />;
}
