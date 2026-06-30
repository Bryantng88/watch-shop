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

export type BusinessBinding = TaskExecution;

export const BusinessBindingRole = {
  PRIMARY: "PRIMARY",
  REVIEW: "REVIEW",
  IMAGE: "IMAGE",
  SERVICE: "SERVICE",
  PAYMENT: "PAYMENT",
  SHIPMENT: "SHIPMENT",
  GENERAL: "GENERAL",
} as const;

export type BusinessBindingRole =
  (typeof BusinessBindingRole)[keyof typeof BusinessBindingRole];

export type BusinessBindingDTO = {
  id: string;
  role: BusinessBindingRole;
  targetType: BusinessBindingTargetType;
  targetId: string;
  taskItemId: string | null;
  actionType: BusinessBindingActionType;
  metadata: Prisma.JsonValue | null;
};

export type BusinessBindingTargetInput = {
  targetType: BusinessBindingTargetType;
  targetId: string;
  aliasIds?: string[];
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
