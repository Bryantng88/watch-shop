export type {
  CoordinationBusinessEvent,
  CoordinationRoute,
  CoordinationRouteKey,
  CoordinationRouteMetadata,
  CoordinationRouteRegistration,
  CoordinationRouteResolution,
  CoordinationWorkTypeResolution,
} from "./coordination-router.types";

export {
  getCoordinationRoute,
  listCoordinationRoutes,
  registerCoordinationRoute,
  registerCoordinationRoutes,
} from "./coordination-router.registry";

export {
  listRegisteredCoordinationRoutes,
  resolveRoute,
  resolveWorkType,
  routeBusinessEvent,
} from "./coordination-router.service";

export type {
  CoordinationContext,
  CoordinationCycleTask,
  CoordinationWorkTicket,
  CoordinationWeekRange,
  EnsureCoordinationCycleInput,
  EnsureCoordinationCycleResult,
  ResolveCurrentCoordinationCycleInput,
  ResolveCurrentCoordinationCycleResult,
} from "./coordination-cycle.types";

export {
  ensureCoordinationCycle,
  ensureWorkTickets,
  getCoordinationCycleTitle,
  getWeekRange,
  getWorkTypeKeyFromTicketNote,
  resolveCoordinationCycle,
  resolveCurrentCoordinationCycle,
} from "./coordination-cycle.service";

export type {
  WorkTypeDefinition as CoordinationWorkTypeDefinition,
} from "@/domains/task/server/work-type.types";

export {
  getWorkTypeWorkflowDefinition,
  getWorkTypeDefinition,
  listAllWorkTypes,
  listWorkTypes,
  listWorkTypesWithWorkflow,
  normalizeWorkTypeKey,
} from "@/domains/task/server/work-type.service";

export type {
  CoordinationDashboardDTO,
  CoordinationReportMetricDTO,
  CoordinationWorkTicketSummaryDTO,
} from "./coordination-dashboard.types";

export {
  getCoordinationDashboard,
  getOperationCoordinationDashboard,
} from "./coordination-dashboard.service";

export type {
  CoordinationConsumerSkipReason,
  CoordinationEventDiagnosticResult,
  CoordinationEventConsumerInput,
  CoordinationEventConsumerResult,
} from "./coordination-event-consumer";

export {
  consumeBusinessEventForCoordination,
  diagnoseBusinessEventForCoordination,
} from "./coordination-event-consumer";
