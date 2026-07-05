import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
  type TaskExecution,
  type Prisma,
} from "@prisma/client";

export type BusinessBindingTargetType = TaskExecutionTargetType;
export type BusinessBindingActionType = TaskExecutionActionType;

export type BusinessBinding = Pick<
  TaskExecution,
  | "id"
  | "targetType"
  | "targetId"
  | "taskItemId"
  | "actionType"
  | "metadataJson"
  | "createdAt"
>;

export type BusinessBindingDTO = {
  id: string;
  targetType: BusinessBindingTargetType;
  targetId: string;
  taskItemId: string | null;
  actionType: BusinessBindingActionType;
  metadata: Prisma.JsonValue | null;
};

export type WorkflowRuntimeState = {
  workflowKey: string;
  currentState: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string | null;
  metadata?: Prisma.JsonObject | null;
};

export type QueueItemSource = "AUTO" | "MANUAL";

export type QueueItemStatus =
  | "WAITING"
  | "IN_PROGRESS"
  | "FEEDBACK"
  | "DONE";

export type QueueItemPreviewDTO = {
  title: string | null;
  ref: string | null;
  status: string | null;
  imageUrl?: string | null;
  imageUrls?: string[];
};

export type QueueItemManualTransitionDTO = {
  actionKey: string;
  label: string;
  toState: string;
  fromState: string;
  manualActionLabel: string;
  enabled: boolean;
  reason: string | null;
  metadata: Prisma.JsonValue | null;
};

export type QueueItemDTO = {
  id: string;
  taskItemId: string;
  targetType: BusinessBindingTargetType;
  targetId: string;
  source: QueueItemSource;
  status: QueueItemStatus;
  preview: QueueItemPreviewDTO;
  latestActivityTitle: string | null;
  feedbackCount: number;
  activityCount: number;
  workflowKey: string | null;
  currentWorkflowState: string | null;
  currentWorkflowStateLabel: string | null;
  isWorkflowDone: boolean;
  manualTransitions: QueueItemManualTransitionDTO[];
  intakeNote: string | null;
  mediaAssetAttachedAt?: string | null;
  mediaWorkProgress?: {
    profile: boolean;
    content: boolean;
    image: boolean;
    completed: number;
    total: number;
    updatedAt?: string | null;
  } | null;
  updatedAt: string;
};

export type ManualQueueTargetPreviewDTO = {
  targetType: BusinessBindingTargetType;
  targetId: string;
  title: string;
  ref: string | null;
  status: string | null;
  imageUrl: string | null;
  href: string | null;
};

export type QueueSummaryDTO = Record<QueueItemStatus, number> & {
  total: number;
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
