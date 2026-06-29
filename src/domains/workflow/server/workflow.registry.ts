import { WorkflowActionType } from "@prisma/client";

export const WORKFLOW_ACTIONS = [
  {
    key: WorkflowActionType.COMPLETE_TASK_ITEM,
    label: "Hoàn tất Task Item",
    description: "Đánh dấu Task Item là DONE khi workflow đủ điều kiện.",
  },
];