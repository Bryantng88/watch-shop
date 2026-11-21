import { redirect } from "next/navigation";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { REPORT_READ_PERMISSIONS, reportEntries } from "@/domains/shared/ui/navigation/section-navigation";
export default async function ReportsPage() {
  const user = await requireAnyPermission(REPORT_READ_PERMISSIONS);
  redirect(reportEntries(user)[0]?.href ?? "/403");
}
