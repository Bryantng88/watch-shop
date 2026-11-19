import OperationCoordinationWorkspace from "@/domains/coordination/ui/OperationCoordinationWorkspace";
import { getCoordinationDashboard } from "@/domains/coordination/server/coordination-dashboard.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

export default async function MediaCoordinationPage() {
  const totalStartedAt = perfNow();

  const auth = await perfStep("coordination-media-page", "requirePermission", () =>
    requirePermission("TASK_VIEW"),
  );

  const data = await perfStep(
    "coordination-media-page",
    "getCoordinationDashboard",
    () =>
      getCoordinationDashboard({
        context: "MEDIA",
        db: prisma,
        includeDashboardDetails: false,
        auth,
      }),
  );

  perfLog("coordination-media-page", "totalBeforeRender", totalStartedAt);

  return <OperationCoordinationWorkspace data={data} />;
}
