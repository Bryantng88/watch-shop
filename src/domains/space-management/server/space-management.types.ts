import type {
  BusinessBindingDTO,
  QueueItemDTO,
  QueueSummaryDTO,
} from "@/domains/task/server/business-binding.types";
import type {
  CoordinationDashboardDTO,
  CoordinationReportMetricDTO,
  CoordinationWorkTicketSummaryDTO,
} from "@/domains/coordination/server/coordination-dashboard.types";
import type {
  WorkTypeDefinition,
  WorkTypeContext,
} from "@/domains/task/server/work-type.types";

export type SpaceContext = WorkTypeContext;
export type WorkspaceTemplateDefinition = WorkTypeDefinition;

export type SpaceDashboardDTO = CoordinationDashboardDTO;
export type SpaceReportMetricDTO = CoordinationReportMetricDTO;
export type WorkspaceSummaryDTO = CoordinationWorkTicketSummaryDTO;

export type ItemDTO = BusinessBindingDTO;
export type ItemViewModel = QueueItemDTO;
export type ItemSummaryDTO = QueueSummaryDTO;
