import OperationCoordinationWorkspace from "@/domains/coordination/ui/OperationCoordinationWorkspace";
import { getCoordinationDashboard } from "@/domains/coordination/server/coordination-dashboard.service";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function MediaCoordinationPage(props: PageProps) {
  const totalStartedAt = perfNow();
  const searchParams = (await props.searchParams) ?? {};

  const auth = await perfStep("coordination-media-page", "requirePermission", () =>
    requireAnyPermission(["TASK_VIEW", "MEDIA_PRODUCTION_VIEW"]),
  );

  const mediaOnly = !auth.roles.includes("ADMIN") && !auth.permissions.includes("TASK_VIEW");
  const data = await perfStep(
    "coordination-media-page",
    "getCoordinationDashboard",
    () =>
      getCoordinationDashboard({
        context: "MEDIA",
        db: prisma,
        date: first(searchParams.date) ?? null,
        includeDashboardDetails: false,
        ...(mediaOnly ? { modeKey: "media-production-flow", includeWorkspaceSummaries: false, includeManagementDetails: false } : {}),
        auth,
      }),
  );

  perfLog("coordination-media-page", "totalBeforeRender", totalStartedAt);

  if (mediaOnly) {
    data.viewConfig = { ...data.viewConfig,
      modes: data.viewConfig.modes.filter((mode) => mode.key === "media-production-flow"),
      createWorkspace: { ...data.viewConfig.createWorkspace, enabled: false },
    };
    data.mediaProductionOnly = true;
  }
  return <OperationCoordinationWorkspace data={data} />;
}
