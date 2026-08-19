import { redirect } from "next/navigation";
import { PERMISSIONS } from "@/constants/permissions";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";

const REQUIRED_FINANCE_REPORT_PERMISSIONS = [
  PERMISSIONS.REPORT_VIEW,
  PERMISSIONS.PRODUCT_COST_VIEW,
  PERMISSIONS.PAYMENT_VIEW_ALL,
] as const;

export async function requireFinanceReportAccess() {
  const { user, permissions } = await getCurrentUserPermissions();
  if (!user) redirect("/login");
  if (user.roles.includes("ADMIN")) return user;
  if (!REQUIRED_FINANCE_REPORT_PERMISSIONS.every((permission) => permissions.includes(permission))) {
    redirect("/403");
  }
  return user;
}
