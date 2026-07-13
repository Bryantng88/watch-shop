import type { CoordinationContext } from "@/domains/coordination/server/coordination-cycle.types";
import type {
  SpaceViewColumnConfig,
  SpaceViewConfig,
} from "./space-view.types";

const WORKSPACE_COLUMNS: SpaceViewColumnConfig[] = [
  { key: "title", label: "Workspace" },
  { key: "owner", label: "Owner" },
  { key: "queueSummary", label: "Items" },
  { key: "attention", label: "Attention" },
  { key: "feedback", label: "Feedback" },
  { key: "updatedAt", label: "Updated" },
  { key: "lastActivity", label: "Last activity" },
];

const CONTEXT_LABELS: Record<CoordinationContext, string> = {
  OPERATION: "Operation",
  SALES: "Sales",
  TECHNICAL: "Technical",
  MEDIA: "Media",
  PAYMENT: "Payment",
  GENERAL: "General",
};

function defaultSpaceViewConfig(context: CoordinationContext): SpaceViewConfig {
  const label = CONTEXT_LABELS[context];

  return {
    key: `${context.toLowerCase()}-workspace-index`,
    context,
    label: `${label} Workspace Index`,
    description:
      "This Space view renders workspace rows. Business items are opened from the workspace detail.",
    defaultModeKey: "workspaces",
    modes: [
      {
        key: "workspaces",
        label: "Workspaces",
        description: "One row represents one Workspace in this Space cycle.",
        rowModel: "WORKSPACE",
        primaryTarget: "workspace",
        columns: WORKSPACE_COLUMNS,
      },
    ],
    carryover: {
      enabled: true,
      actionLabel: "Nhận item tồn tuần trước",
      source: "PREVIOUS_CYCLE",
      onlyProcessingItems: true,
      processingRule:
        "Only active workspace bindings are carried over. Service Requests must not be COMPLETED, DELIVERED, or CANCELED; Technical Issues must not be DONE or CANCELED.",
    },
    createWorkspace: {
      enabled: true,
      actionLabel: "Tạo Workspace",
      defaultTitlePlaceholder: "Tên Workspace",
    },
    emptyState: "Chưa có Workspace trong tuần này.",
  };
}

const SPACE_VIEW_CONFIGS: Record<CoordinationContext, SpaceViewConfig> = {
  OPERATION: defaultSpaceViewConfig("OPERATION"),
  SALES: defaultSpaceViewConfig("SALES"),
  TECHNICAL: {
    ...defaultSpaceViewConfig("TECHNICAL"),
    description:
      "Technical Space may expose multiple configured modes. The generic index still renders workspace rows; Service Operation adds SR Case and Technical Bench modes.",
  },
  MEDIA: defaultSpaceViewConfig("MEDIA"),
  PAYMENT: defaultSpaceViewConfig("PAYMENT"),
  GENERAL: defaultSpaceViewConfig("GENERAL"),
};

export function getSpaceViewConfig(context: CoordinationContext) {
  return SPACE_VIEW_CONFIGS[context];
}
