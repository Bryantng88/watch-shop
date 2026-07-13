import type { ServiceOperationTechnicalIssueStage } from "@/domains/service/server/shared/service-request.rules";
import type {
  ServiceOperationSpaceViewConfig,
  ServiceOperationSpaceViewMode,
  ServiceOperationTechnicalWorkspaceBucket,
} from "./service-operation.types";

export const SERVICE_OPERATION_TI_STAGE_FILTERS: Array<{
  key: ServiceOperationTechnicalIssueStage;
  label: string;
}> = [
  { key: "INSPECT", label: "Inspect" },
  { key: "READY", label: "Ready" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "DONE", label: "Done" },
];

export const SERVICE_OPERATION_TECHNICAL_WORKSPACE_BUCKETS: ServiceOperationTechnicalWorkspaceBucket[] = [
  {
    role: "INSPECT",
    label: "Inspect",
    description: "Classify, assign owner/vendor, then route the issue.",
    stages: ["INSPECT"],
  },
  {
    role: "PROCESSING",
    label: "Processing",
    description: "Operational workflow: Ready -> In Progress -> Done.",
    stages: ["READY", "IN_PROGRESS"],
  },
  {
    role: "DONE",
    label: "Done / Follow-up",
    description: "Track completion, send back when needed, then payment.",
    stages: ["DONE"],
  },
];

export const SERVICE_OPERATION_SPACE_VIEW_CONFIGS: Record<
  ServiceOperationSpaceViewMode,
  ServiceOperationSpaceViewConfig
> = {
  sr: {
    mode: "sr",
    label: "SR Cases",
    description: "One row represents one SR workspace.",
    rowType: "WORKSPACE",
    primaryTarget: "workspace",
    searchPlaceholder: "Search SR, watch, customer, TI...",
    chips: ["SR view: one workspace per SR case"],
    counters: [
      { key: "activeSr", label: "Active SR" },
      { key: "waitingApproval", label: "Waiting Approval" },
      { key: "hasOpenTi", label: "Has Open TI" },
      { key: "completedSr", label: "Completed SR" },
      { key: "waitingPayment", label: "Waiting Payment" },
      { key: "openTi", label: "Open TI" },
    ],
  },
  ti: {
    mode: "ti",
    label: "Technical Bench",
    description: "Rows are technical operation workspaces with stage items.",
    rowType: "WORKSPACE_BUCKET",
    primaryTarget: "stage",
    searchPlaceholder: "Search TI, SR, watch, area...",
    chips: ["Technical view: Inspect / Processing / Done-Follow-up"],
    counters: [
      { key: "openTi", label: "Open TI" },
      { key: "inspect", label: "Inspect" },
      { key: "ready", label: "Ready" },
      { key: "inProgress", label: "In Progress" },
      { key: "done", label: "Done" },
      { key: "waitingPayment", label: "Waiting Payment" },
    ],
  },
};

export const SERVICE_OPERATION_SPACE_VIEW_LIST = [
  SERVICE_OPERATION_SPACE_VIEW_CONFIGS.sr,
  SERVICE_OPERATION_SPACE_VIEW_CONFIGS.ti,
];

export function normalizeServiceOperationSpaceViewMode(
  value: string | undefined,
): ServiceOperationSpaceViewMode {
  return value === "ti" ? "ti" : "sr";
}
