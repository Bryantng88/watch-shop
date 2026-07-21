import { prisma } from "../src/server/db/client";
import { getOperationCoordinationDashboard } from "../src/domains/coordination/server/coordination-dashboard.service";

async function main() {
  const dashboard = await getOperationCoordinationDashboard({
    db: prisma,
    auth: { roles: ["ADMIN"] },
  });
  console.log(JSON.stringify({
    space: { id: dashboard.cycle.id, title: dashboard.cycle.title, context: dashboard.context },
    defaultModeKey: dashboard.viewConfig.defaultModeKey,
    defaultCoreFlowKey: dashboard.viewConfig.defaultCoreFlowKey,
    modes: dashboard.viewConfig.modes.map((mode) => ({ key: mode.key, coreFlowKey: mode.coreFlowKey ?? null })),
    coreFlows: dashboard.viewConfig.coreFlows?.map((flow) => flow.key) ?? [],
    workspaceCount: dashboard.workTickets.length,
    technicalBoardItems: dashboard.technicalIssueBoard?.items.length ?? 0,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
