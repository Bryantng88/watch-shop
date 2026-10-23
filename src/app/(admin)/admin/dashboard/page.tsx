import { getOperationsDashboardApplication } from "@/domains/admin-home/application";
import { OperationsDashboard } from "@/domains/admin-home/ui";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAuthUserId } from "@/domains/task/server/core/task.service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await requirePermission(PERMISSIONS.DASHBOARD_VIEW);
  const data = await getOperationsDashboardApplication({
    canAssignPurchaseRequests: user.permissions.includes(PERMISSIONS.TASK_MANAGE),
    userId: getAuthUserId(user),
  });
  return <OperationsDashboard data={data} />;
}
