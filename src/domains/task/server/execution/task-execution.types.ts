import type { TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";

export type CreateTaskExecutionInput = {
  taskId: string;
  targetType: TaskExecutionTargetType;
  targetId: string;
  actionType?: TaskExecutionActionType;
  note?: string | null;
  taskItemId?: string | null;
};

export type LinkTaskExecutionInput = CreateTaskExecutionInput & {
  syncTaskRelation?: boolean;
};
