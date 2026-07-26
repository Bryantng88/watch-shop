import { getBusinessEventContract } from "../src/domains/event/catalog/business-event-catalog";
import { getCoordinationDashboard } from "../src/domains/coordination/server/coordination-dashboard.service";
import { listOperationAdapterBindings } from "../src/domains/blueprint/shared/operation-adapter-bindings";
import { operationalBlueprintForWorkType } from "../src/domains/blueprint/shared/operational-blueprint";
import { prisma } from "../src/server/db/client";

async function main() {
  const stage = process.argv[2] ?? "shipment-done";
  const startedAt = Date.now();
  const data = await getCoordinationDashboard({
    context: "OPERATION",
    db: prisma,
    modeKey: "shipment-operation-flow",
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
  const contract = operationalBlueprintForWorkType({
    workTypeKey: "shipment",
    coordinationContext: "OPERATION",
  });
  console.log(JSON.stringify({
    elapsedMs: Date.now() - startedAt,
    stage,
    items: data.flowItems.length,
    itemsWithImage: data.flowItems.filter((item) => Boolean(item.preview.imageUrl)).length,
    actions: data.flowItems[0]?.manualTransitions.map((transition) => ({
      key: transition.actionKey,
      enabled: transition.enabled,
      hasForm: Boolean(
        transition.metadata &&
          typeof transition.metadata === "object" &&
          !Array.isArray(transition.metadata) &&
          "operationalBlueprintAction" in transition.metadata
      ),
    })) ?? [],
    pagination: data.flowItemsPagination,
    workspaces: data.workTickets.map((ticket) => ({
      title: ticket.title,
      role: ticket.blueprint?.operationWorkspaceRole,
      stage: ticket.blueprint?.flowStageKey,
    })),
    eventContracts: [
      "shipment.created",
      "shipment.shipped",
      "shipment.delivered",
      "shipment.returning",
      "shipment.returned",
      "shipment.cancelled",
    ].map((key) => ({ key, registered: Boolean(getBusinessEventContract(key)) })),
    adapters: listOperationAdapterBindings(contract).map((binding) => ({
      actionKey: binding.actionKey,
      status: binding.status,
      adapterKey: binding.adapterKey,
    })),
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
