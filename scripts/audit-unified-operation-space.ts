import { prisma } from "../src/server/db/client";
import { getCoordinationDashboard } from "../src/domains/coordination/server/coordination-dashboard.service";

async function main() {
  const workspace = await getCoordinationDashboard({
    context: "OPERATION",
    db: prisma,
    includeDashboardDetails: false,
    auth: { roles: ["ADMIN"] },
  });
  console.log(JSON.stringify({
    space: { id: workspace.cycle.id, title: workspace.cycle.title, context: workspace.context },
    defaultModeKey: workspace.viewConfig.defaultModeKey,
    defaultCoreFlowKey: workspace.viewConfig.defaultCoreFlowKey,
    modes: workspace.viewConfig.modes.map((mode) => ({ key: mode.key, coreFlowKey: mode.coreFlowKey ?? null })),
    coreFlows: workspace.viewConfig.coreFlows?.map((flow) => flow.key) ?? [],
    workspaceCount: workspace.workTickets.length,
    technicalBoardItems: workspace.technicalIssueBoard?.items.length ?? 0,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
