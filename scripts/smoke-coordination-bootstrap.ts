import { getCoordinationDashboard } from "@/domains/coordination/server/coordination-dashboard.service";
import { getSpaceViewConfig } from "@/domains/space-management/server/space-view.config";
import { prisma } from "@/server/db/client";

async function main() {
  const config = getSpaceViewConfig("OPERATION");
  const modeKey = config.defaultModeKey;
  const startedAt = performance.now();
  const data = await getCoordinationDashboard({
    context: "OPERATION",
    db: prisma,
    modeKey,
    includeDashboardDetails: false,
    includeTechnicalBoard: false,
    includeFlowItems:
      modeKey !== "technical-issue-flow" &&
      modeKey !== "media-production-flow",
  });
  console.log(JSON.stringify({
    durationMs: Math.round(performance.now() - startedAt),
    modeKey,
    workspaces: data.workTickets.length,
    flowItems: data.flowItems.length,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
