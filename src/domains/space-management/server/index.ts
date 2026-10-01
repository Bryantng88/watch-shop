export type {
  ItemDTO,
  ItemSummaryDTO,
  ItemViewModel,
  SpaceContext,
  SpaceViewColumnConfig,
  SpaceViewConfig,
  SpaceViewModeConfig,
  SpaceReportMetricDTO,
  WorkspaceSummaryDTO,
  WorkspaceTemplateDefinition,
} from "./space-management.types";

export {
  getSpaceViewConfig,
} from "./space-view.config";

export {
  getWorkTypeDefinition as getWorkspaceTemplateDefinition,
  getWorkTypeWorkflowDefinition as getWorkspaceTemplateWorkflowDefinition,
  listAllWorkTypes as listAllWorkspaceTemplates,
  listWorkTypes as listWorkspaceTemplates,
  listWorkTypesWithWorkflow as listWorkspaceTemplatesWithWorkflow,
  normalizeWorkTypeKey as normalizeWorkspaceTemplateKey,
} from "@/domains/task/server/work-type.service";

export {
  listTaskItemQueueItems as listWorkspaceItems,
  summarizeTaskItemQueue as summarizeWorkspaceItems,
} from "@/domains/task/server/business-binding.service";

export {
  getTaskDetail as getSpaceDetail,
  getTaskItemDetail as getWorkspaceDetail,
  getTaskItemListPageData as getWorkspaceListPageData,
  getTaskListPageData as getSpaceListPageData,
} from "@/domains/task/server/core/task.service";
