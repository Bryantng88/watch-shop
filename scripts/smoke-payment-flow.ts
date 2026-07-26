import { getCoordinationDashboard } from "../src/domains/coordination/server/coordination-dashboard.service";
import { prisma } from "../src/server/db/client";

async function main() {
  const stage = process.argv[2] === "payment-settled"
    ? "payment-settled"
    : "payment-review";
  const startedAt = Date.now();
  const data = await getCoordinationDashboard({
    context: "OPERATION",
    db: prisma,
    modeKey: "payment-collection-flow",
    flowStageKey: stage,
    flowPage: 1,
    flowPageSize: 20,
    includeDashboardDetails: false,
    includeTechnicalBoard: false,
    includeMediaBoard: false,
    includeFlowItems: true,
    includeManagementDetails: false,
    includeWorkspaceSummaries: false,
    auth: { roles: ["admin"] },
  });
  console.log(JSON.stringify({
    elapsedMs: Date.now() - startedAt,
    stage,
    items: data.flowItems.length,
    itemsWithImage: data.flowItems.filter((item) => Boolean(item.preview.imageUrl)).length,
    acquisitionItemsWithImage: data.flowItems.filter(
      (item) =>
        item.payment?.ownerType === "ACQUISITION" &&
        Boolean(item.preview.imageUrl),
    ).length,
    pagination: data.flowItemsPagination,
    workspaces: data.workTickets.map((ticket) => ({
      title: ticket.title,
      role: ticket.blueprint?.operationWorkspaceRole,
      stage: ticket.blueprint?.flowStageKey,
    })),
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
