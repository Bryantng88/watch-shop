import { getAdminDashboardApplication } from "@/domains/dashboard/application";
import { AdminDashboardClient } from "@/domains/dashboard/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardApplication();

  return <AdminDashboardClient data={data} />;
}
