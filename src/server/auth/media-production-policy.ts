import { PERMISSIONS } from "@/constants/permissions";

/** Media rights never authorize sales, technical or payment workflow transitions. */
export function isMediaProductionTransitionAllowed(permissions: readonly string[], targetType: string, workflowKey: string | null | undefined) {
  return permissions.includes(PERMISSIONS.MEDIA_PRODUCTION_UPDATE) &&
    ["WATCH", "MEDIA_POST"].includes(targetType) &&
    ["watch-photography", "watch-media-processing", "watch-publish"].includes(workflowKey ?? "");
}

const FINANCIAL_FIELDS = new Set([
  "unitCost", "costPrice", "serviceCost", "landedCost", "minPrice", "pricingNote",
  "acquisitionAmount", "serviceAmount", "shipmentAmount", "otherAmount",
]);

/** Remove financial values from server-to-client data, including nested snapshots. */
export function redactWatchFinancials<T>(value: T): T {
  if (Array.isArray(value)) return value.map(redactWatchFinancials) as T;
  if (!value || typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key, FINANCIAL_FIELDS.has(key) ? null : redactWatchFinancials(item),
  ])) as T;
}

export function canReadMediaCoordinationQuery(user: { roles: string[]; permissions: string[] }, resource: "board" | "flow", key: string, context: string | null) {
  if (user.roles.includes("ADMIN") || user.permissions.includes(PERMISSIONS.TASK_VIEW)) return true;
  return user.permissions.includes(PERMISSIONS.MEDIA_PRODUCTION_VIEW) && context === "MEDIA" &&
    key === (resource === "board" ? "media-operation" : "media-production-flow");
}
