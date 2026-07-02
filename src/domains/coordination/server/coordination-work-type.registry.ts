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
