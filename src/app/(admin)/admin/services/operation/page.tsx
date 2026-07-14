import OperationCoordinationWorkspace from "@/domains/coordination/ui/OperationCoordinationWorkspace";
import { getCoordinationDashboard } from "@/domains/coordination/server/coordination-dashboard.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ServiceOperationPage(props: PageProps) {
  const totalStartedAt = perfNow();
  const searchParams = (await props.searchParams) ?? {};

  const auth = await perfStep("service-operation-page", "requirePermission", () =>
    requirePermission("TASK_VIEW"),
  );

  const data = await perfStep(
    "service-operation-page",
    "getCoordinationDashboard",
    () =>
      getCoordinationDashboard({
        context: "TECHNICAL",
        db: prisma,
        date: first(searchParams.date) ?? null,
        auth,
      }),
  );

  perfLog("service-operation-page", "totalBeforeRender", totalStartedAt);

  return <OperationCoordinationWorkspace data={data} />;
}
