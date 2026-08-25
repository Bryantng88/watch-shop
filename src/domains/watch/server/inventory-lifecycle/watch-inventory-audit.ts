export type WatchInventoryStateAudit = {
  severity: "ERROR" | "WARNING";
  code: "DIVERGENT_INVENTORY_PAIR" | "SERVICE_STATUS_OVERLAY";
  detail: string;
};

const VALID_INVENTORY_PAIRS = new Set([
  "READY/IN_STOCK",
  "PROCESSING/IN_STOCK",
  "HOLD/RESERVED",
  "SOLD/OUT_OF_STOCK",
]);

export function auditWatchInventoryState(input: {
  productStatus: string;
  saleStage: string;
  stockStage: string;
  serviceStage: string;
}): WatchInventoryStateAudit | null {
  const triple = `${input.productStatus}/${input.saleStage}/${input.stockStage}`;
  const inventoryPair = `${input.saleStage}/${input.stockStage}`;

  if (input.saleStage !== "DRAFT" && !VALID_INVENTORY_PAIRS.has(inventoryPair)) {
    return { severity: "ERROR", code: "DIVERGENT_INVENTORY_PAIR", detail: triple };
  }

  if (input.productStatus === "IN_SERVICE") {
    return {
      severity: "WARNING",
      code: "SERVICE_STATUS_OVERLAY",
      detail: `${triple}; serviceStage=${input.serviceStage}`,
    };
  }

  return null;
}
