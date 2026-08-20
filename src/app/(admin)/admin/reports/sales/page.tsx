import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import SalesReportClient from "@/domains/report/sales/SalesReportClient";
import { getSalesReport } from "@/domains/report/sales/sales-report.service";

export default async function SalesReportPage() {
  const user = await requirePermission(PERMISSIONS.REPORT_SALES_VIEW);
  const permissions = new Set(user.permissions);
  const isAdmin = user.roles.includes("ADMIN");
  return <SalesReportClient data={await getSalesReport({
    canViewFinance: isAdmin || permissions.has(PERMISSIONS.REPORT_FINANCE_VIEW),
    canViewProductCost: isAdmin || permissions.has(PERMISSIONS.PRODUCT_COST_VIEW),
    canViewPayments: isAdmin || permissions.has(PERMISSIONS.PAYMENT_VIEW_ALL),
  })} />;
}
