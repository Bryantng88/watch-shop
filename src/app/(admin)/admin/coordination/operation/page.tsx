import OperationCoordinationWorkspace from "@/domains/coordination/ui/OperationCoordinationWorkspace";
import { getCoordinationDashboard } from "@/domains/coordination/server/coordination-dashboard.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";
import { getSpaceViewConfig } from "@/domains/space-management/server/space-view.config";
import { loadTechnicalDailyPerformance } from "@/domains/coordination/server/coordination-dashboard-metrics.service";
import { mapCoordinationDashboardShell } from "@/domains/coordination/shared/coordination-dashboard-shell.mapper";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OperationCoordinationPage(props: PageProps) {
  const totalStartedAt = perfNow();
  const searchParams = (await props.searchParams) ?? {};

  const auth = await perfStep("coordination-operation-page", "requirePermission", () =>
    requirePermission("TASK_VIEW"),
  );
  const modeKey = first(searchParams.view) ?? null;
  const viewConfig = getSpaceViewConfig("OPERATION");
  const effectiveModeKey = viewConfig.modes.some((mode) => mode.key === modeKey)
    ? modeKey
    : viewConfig.defaultModeKey;

  const [data, technicalDailyPerformance] = await Promise.all([
    perfStep(
      "coordination-operation-page",
      "getCoordinationDashboard",
      () => getCoordinationDashboard({
        context: "OPERATION",
        db: prisma,
        date: first(searchParams.date) ?? null,
        modeKey: effectiveModeKey,
        flowStageKey: first(searchParams.flowStage) ?? null,
        flowPage: Number(first(searchParams.flowPage) ?? 1),
        flowPageSize: Number(first(searchParams.flowPageSize) ?? 20),
        flowQuery: first(searchParams.flowQuery) ?? null,
        flowStatus: first(searchParams.flowStatus) ?? null,
        flowPaymentStatus: first(searchParams.flowPaymentStatus) ?? null,
        flowSort: first(searchParams.flowSort) ?? null,
        includeDashboardDetails: false,
        includeManagementDetails: false,
        // The TI board has its own paginated client request. Keeping it out of
        // the page payload avoids blocking the entire route on the heaviest query.
        includeTechnicalBoard: false,
        includeFlowItems:
          effectiveModeKey !== "technical-issue-flow" &&
          effectiveModeKey !== "media-production-flow",
        auth,
      }),
    ),
    effectiveModeKey === "technical-issue-flow"
      ? loadTechnicalDailyPerformance(prisma)
      : Promise.resolve(undefined),
  ]);
  const initialDashboard = mapCoordinationDashboardShell(data, {
    modeKey: effectiveModeKey,
    technicalDailyPerformance,
  });

  perfLog("coordination-operation-page", "totalBeforeRender", totalStartedAt);

  return (
    <OperationCoordinationWorkspace
      data={data}
      initialDashboard={initialDashboard}
    />
  );
}
