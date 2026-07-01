import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
  type TaskExecution,
  type Prisma,
} from "@prisma/client";

export { TaskExecutionActionType as BusinessBindingActionType };
export { TaskExecutionTargetType as BusinessBindingTargetType };

export type BusinessBindingTargetType = TaskExecutionTargetType;
export type BusinessBindingActionType = TaskExecutionActionType;

export type BusinessBinding = Pick<
  TaskExecution,
  "id" | "targetType" | "targetId" | "taskItemId" | "actionType" | "metadataJson"
>;

export type BusinessBindingDTO = {
  id: string;
  targetType: BusinessBindingTargetType;
  targetId: string;
  taskItemId: string | null;
  actionType: BusinessBindingActionType;
  metadata: Prisma.JsonValue | null;
};

export type BusinessBindingTargetInput = {
  targetType: BusinessBindingTargetType;
  targetId: string;
};

export type CreateBusinessBindingInput = BusinessBindingTargetInput & {
  taskId: string;
  taskItemId?: string | null;
  actionType?: BusinessBindingActionType;
  metadataJson?: Prisma.InputJsonValue | null;
  note?: string | null;
  createdByUserId?: string | null;
  serviceRequestId?: string | null;
  technicalIssueId?: string | null;
};

export type BindTaskItemToBusinessObjectInput = BusinessBindingTargetInput & {
  taskId: string;
  taskItemId: string;
  actionType?: BusinessBindingActionType;
  metadataJson?: Prisma.InputJsonValue | null;
  note?: string | null;
  createdByUserId?: string | null;
};
