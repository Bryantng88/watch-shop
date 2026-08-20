import { redirect } from "next/navigation";
import { PERMISSIONS } from "@/constants/permissions";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import SalesReportClient from "@/domains/report/sales/SalesReportClient";
import { getSalesReport } from "@/domains/report/sales/sales-report.service";

export default async function SalesReportPage() {
  const { user, permissions } = await getCurrentUserPermissions();
  if (!user) redirect("/login");
  if (!user.roles.includes("ADMIN") && !permissions.includes(PERMISSIONS.REPORT_VIEW)) redirect("/403");
  return <SalesReportClient data={await getSalesReport()} />;
}
