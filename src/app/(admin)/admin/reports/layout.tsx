import type { ReactNode } from "react";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { reportEntries } from "@/domains/shared/ui/navigation/section-navigation";
import ReportWorkspace from "@/domains/report/ReportWorkspace";
export default async function ReportsLayout({ children }: { children: ReactNode }) {
  const { user, permissions } = await getCurrentUserPermissions();
  return <ReportWorkspace entries={reportEntries({ roles: user?.roles, permissions })}>{children}</ReportWorkspace>;
}
