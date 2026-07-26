import { getCoordinationDashboard } from "../src/domains/coordination/server/coordination-dashboard.service";
import { prisma } from "../src/server/db/client";

async function main() {
  const data = await getCoordinationDashboard({
    context: "TECHNICAL",
    db: prisma,
    includeDashboardDetails: false,
    includeTechnicalBoard: true,
    includeFlowItems: false,
  });
  console.log(JSON.stringify({
    defaultModeKey: data.viewConfig.defaultModeKey,
    boardLoaded: Boolean(data.technicalIssueBoard),
    boardItems: data.technicalIssueBoard?.items.length ?? 0,
    boardColumns: data.technicalIssueBoard?.columnPagination ?? null,
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
