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
        allowedWorkspaceKinds: ["STANDALONE_WORKSPACE"],
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
      terminalStatesByTargetType: {
        SERVICE_REQUEST: ["COMPLETED", "DELIVERED", "CANCELED"],
        TECHNICAL_ISSUE: ["DONE", "CANCELED"],
      },
    },
    createWorkspace: {
      enabled: true,
      actionLabel: "Tạo Workspace",
      defaultTitlePlaceholder: "Tên Workspace",
    },
    emptyState: "Chưa có Workspace trong tuần này.",
  };
}

const MEDIA_PRODUCTION_FLOW = {
  key: "media-production-flow",
  label: "Media Production",
  description:
    "Renders the current Media operation path as ordered Workspace stages.",
  rowModel: "FLOW_STAGE_WORKSPACE",
  primaryTarget: "workspace",
  itemTargetType: "WATCH",
  stages: [
    {
      key: "photography",
      label: "Photography",
      workspaceKey: "photography",
      sortOrder: 10,
      itemTargetType: "WATCH",
      evidenceEvents: ["watch.media.photoshoot.requested"],
    },
    {
      key: "media-processing",
      label: "Media Processing",
      workspaceKey: "media-processing",
      sortOrder: 20,
      itemTargetType: "WATCH",
      evidenceEvents: [
        "watch.media.photoshoot.completed",
        "watch.media.asset.attached",
        "watch.content.submitted",
        "watch.content.approved",
        "watch.image.submitted",
        "watch.image.approved",
      ],
    },
    {
      key: "publish",
      label: "Publish",
      workspaceKey: "publish",
      sortOrder: 30,
      itemTargetType: "WATCH",
      evidenceEvents: [
        "watch.media.ready_for_publish",
        "watch.publish.assets.downloaded",
      ],
    },
  ],
} as const satisfies NonNullable<SpaceViewConfig["coreFlows"]>[number];

function mediaSpaceViewConfig(): SpaceViewConfig {
  return {
    ...defaultSpaceViewConfig("MEDIA"),
    key: "media-production-space-view",
    label: "Media Production Space",
    description:
      "Media Space renders the production core flow as ordered Workspace stages. Internal item workflow states stay inside Workspace detail.",
    defaultModeKey: "media-production-flow",
    defaultCoreFlowKey: MEDIA_PRODUCTION_FLOW.key,
    modes: [
      {
        key: "media-production-flow",
        label: "Media Production Flow",
        description:
          "Photography -> Media Processing -> Publish. One row represents one flow-stage Workspace.",
        rowModel: "FLOW_STAGE_WORKSPACE",
        primaryTarget: "workspace",
        coreFlowKey: MEDIA_PRODUCTION_FLOW.key,
        allowedWorkspaceKinds: ["FLOW_STAGE_WORKSPACE"],
        columns: WORKSPACE_COLUMNS,
      },
      {
        key: "workspaces",
        label: "Workspace Index",
        description:
          "Fallback index for manual or standalone Workspaces in the Media Space.",
        rowModel: "WORKSPACE",
        primaryTarget: "workspace",
        allowedWorkspaceKinds: ["STANDALONE_WORKSPACE"],
        columns: WORKSPACE_COLUMNS,
      },
    ],
    coreFlows: [MEDIA_PRODUCTION_FLOW],
    carryover: {
      enabled: true,
      actionLabel: "Nháº­n item tá»“n tuáº§n trÆ°á»›c",
      source: "PREVIOUS_CYCLE",
      onlyProcessingItems: true,
      processingRule:
        "Carry over unfinished WATCH items bound to Photography, Media Processing, or Publish. Terminal media/publish work must stay out of carryover.",
      terminalStatesByTargetType: {
        WATCH: ["DONE", "POSTED", "SOLD", "CONSIGNED_TO", "CANCELED", "CANCELLED"],
      },
    },
    createWorkspace: {
      enabled: true,
      actionLabel: "Táº¡o Workspace",
      defaultTitlePlaceholder: "TÃªn Workspace",
    },
    emptyState:
      "ChÆ°a cÃ³ Workspace trong Media Production Flow tuáº§n nÃ y.",
  };
}

const TECHNICAL_ISSUE_FLOW = {
  key: "technical-issue-flow",
  label: "Technical Issue Flow",
  description:
    "Renders technical issue work as ordered Workspace stages inside Technical Space.",
  rowModel: "FLOW_STAGE_WORKSPACE",
  primaryTarget: "workspace",
  itemTargetType: "TECHNICAL_ISSUE",
  stages: [
    {
      key: "inspect",
      label: "Inspect",
      workspaceKey: "inspect",
      sortOrder: 10,
      itemTargetType: "TECHNICAL_ISSUE",
      evidenceEvents: ["technical.issue.created", "technical.issue.inspect.requested"],
    },
    {
      key: "processing",
      label: "Processing",
      workspaceKey: "processing",
      sortOrder: 20,
      itemTargetType: "TECHNICAL_ISSUE",
      evidenceEvents: ["technical.issue.processing.started"],
    },
    {
      key: "done",
      label: "Done / Follow-up",
      workspaceKey: "done",
      sortOrder: 30,
      itemTargetType: "TECHNICAL_ISSUE",
      evidenceEvents: ["technical.issue.done", "technical.issue.payment.follow_up"],
    },
  ],
} as const satisfies NonNullable<SpaceViewConfig["coreFlows"]>[number];

function technicalSpaceViewConfig(): SpaceViewConfig {
  return {
    ...defaultSpaceViewConfig("TECHNICAL"),
    key: "technical-service-space-view",
    label: "Technical Service Space",
    description:
      "Technical Space separates SR case Workspaces from Technical Issue flow-stage Workspaces.",
    defaultModeKey: "sr-cases",
    defaultCoreFlowKey: TECHNICAL_ISSUE_FLOW.key,
    modes: [
      {
        key: "sr-cases",
        label: "SR Cases",
        description:
          "One row represents one Workspace identity-bound to a Service Request.",
        rowModel: "CASE_WORKSPACE",
        primaryTarget: "workspace",
        allowedWorkspaceKinds: ["CASE_WORKSPACE"],
        columns: WORKSPACE_COLUMNS,
      },
      {
        key: "technical-issue-flow",
        label: "Technical Bench",
        description:
          "Inspect -> Processing -> Done. The UI label can say Bench, but rows are ordered flow-stage Workspaces.",
        rowModel: "FLOW_STAGE_WORKSPACE",
        primaryTarget: "workspace",
        coreFlowKey: TECHNICAL_ISSUE_FLOW.key,
        allowedWorkspaceKinds: ["FLOW_STAGE_WORKSPACE"],
        columns: WORKSPACE_COLUMNS,
      },
      {
        key: "workspaces",
        label: "Workspace Index",
        description:
          "Fallback index for manual or standalone Technical Workspaces.",
        rowModel: "WORKSPACE",
        primaryTarget: "workspace",
        allowedWorkspaceKinds: ["STANDALONE_WORKSPACE", "BENCH_WORKSPACE"],
        columns: WORKSPACE_COLUMNS,
      },
    ],
    coreFlows: [TECHNICAL_ISSUE_FLOW],
    carryover: {
      enabled: true,
      actionLabel: "Nhận item tồn tuần trước",
      source: "PREVIOUS_CYCLE",
      onlyProcessingItems: true,
      processingRule:
        "Carry over active SERVICE_REQUEST cases and TECHNICAL_ISSUE items only. Do not carry terminal Service Requests or Technical Issues.",
      terminalStatesByTargetType: {
        SERVICE_REQUEST: ["COMPLETED", "DELIVERED", "CANCELED"],
        TECHNICAL_ISSUE: ["DONE", "CANCELED"],
      },
    },
    createWorkspace: {
      enabled: true,
      actionLabel: "Tạo Workspace",
      defaultTitlePlaceholder: "Tên Workspace",
    },
    emptyState: "Chưa có Workspace trong Technical Space này.",
  };
}

const PAYMENT_COLLECTION_FLOW = {
  key: "payment-collection-flow",
  label: "Payment Collection",
  description:
    "Renders payment collection as ordered Workspace stages. Payment remains the business item.",
  rowModel: "FLOW_STAGE_WORKSPACE",
  primaryTarget: "workspace",
  itemTargetType: "PAYMENT",
  stages: [
    {
      key: "payment-inbox",
      label: "Inbox",
      workspaceKey: "payment-inbox",
      sortOrder: 10,
      itemTargetType: "PAYMENT",
      evidenceEvents: ["payment.created", "payment.collection.requested"],
    },
    {
      key: "payment-review",
      label: "Review",
      workspaceKey: "payment-review",
      sortOrder: 20,
      itemTargetType: "PAYMENT",
      evidenceEvents: ["payment.review.requested", "payment.review.started"],
    },
    {
      key: "payment-settled",
      label: "Settled",
      workspaceKey: "payment-settled",
      sortOrder: 30,
      itemTargetType: "PAYMENT",
      evidenceEvents: ["payment.settled"],
    },
    {
      key: "payment-exception",
      label: "Exception",
      workspaceKey: "payment-exception",
      sortOrder: 40,
      itemTargetType: "PAYMENT",
      evidenceEvents: ["payment.exception.created"],
    },
  ],
} as const satisfies NonNullable<SpaceViewConfig["coreFlows"]>[number];

function paymentSpaceViewConfig(): SpaceViewConfig {
  return {
    ...defaultSpaceViewConfig("PAYMENT"),
    key: "payment-collection-space-view",
    label: "Payment Collection Space",
    description:
      "Payment Space renders Payment items inside ordered collection stage Workspaces.",
    defaultModeKey: "payment-collection-flow",
    defaultCoreFlowKey: PAYMENT_COLLECTION_FLOW.key,
    modes: [
      {
        key: "payment-collection-flow",
        label: "Payment Collection Flow",
        description:
          "Inbox -> Review -> Settled / Exception. One row represents one flow-stage Workspace.",
        rowModel: "FLOW_STAGE_WORKSPACE",
        primaryTarget: "workspace",
        coreFlowKey: PAYMENT_COLLECTION_FLOW.key,
        allowedWorkspaceKinds: ["FLOW_STAGE_WORKSPACE"],
        columns: WORKSPACE_COLUMNS,
      },
      {
        key: "workspaces",
        label: "Workspace Index",
        description:
          "Fallback index for manual or standalone Payment Workspaces.",
        rowModel: "WORKSPACE",
        primaryTarget: "workspace",
        allowedWorkspaceKinds: ["STANDALONE_WORKSPACE"],
        columns: WORKSPACE_COLUMNS,
      },
    ],
    coreFlows: [PAYMENT_COLLECTION_FLOW],
    carryover: {
      enabled: true,
      actionLabel: "Nhận item tồn tuần trước",
      source: "PREVIOUS_CYCLE",
      onlyProcessingItems: true,
      processingRule:
        "Carry over unsettled PAYMENT items only. Settled, canceled, or voided payments must not be carried over.",
      terminalStatesByTargetType: {
        PAYMENT: ["PAID", "COLLECTED", "CANCELED", "REFUNDED"],
      },
    },
    createWorkspace: {
      enabled: true,
      actionLabel: "Tạo Workspace",
      defaultTitlePlaceholder: "Tên Workspace",
    },
    emptyState: "Chua co Workspace trong Payment Collection Flow nay.",
  };
}

const SPACE_VIEW_CONFIGS: Record<CoordinationContext, SpaceViewConfig> = {
  OPERATION: defaultSpaceViewConfig("OPERATION"),
  SALES: defaultSpaceViewConfig("SALES"),
  TECHNICAL: technicalSpaceViewConfig(),
  MEDIA: mediaSpaceViewConfig(),
  PAYMENT: paymentSpaceViewConfig(),
  GENERAL: defaultSpaceViewConfig("GENERAL"),
};

export function getSpaceViewConfig(context: CoordinationContext) {
  return SPACE_VIEW_CONFIGS[context];
}
