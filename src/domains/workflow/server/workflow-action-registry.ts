import { TaskStatus, WorkflowActionType } from "@prisma/client";
import type { DB } from "@/server/db/client";

export type WorkflowActionContext = {
    workflow: any;
    taskItem: any;
    execution?: any;
    eventLog?: any;
    actorUserId?: string | null;
};
export const workflowActionHandlers: Record<
    WorkflowActionType,
    (db: DB, context: WorkflowActionContext) => Promise<void>
> = {
    [WorkflowActionType.COMPLETE_TASK_ITEM]: async (db, context) => {
        if (!context.taskItem?.id) return;

        await db.taskItem.update({
            where: { id: context.taskItem.id },
            data: {
                isDone: true,
                status: TaskStatus.DONE,
                completedAt: new Date(),
                cancelledAt: null,
            },
        });
    },
};