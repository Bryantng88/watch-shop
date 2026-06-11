import { TaskExecutionActionType, TaskExecutionTargetType, TaskStatus } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { createTaskExecutionRepo } from "@/domains/task/server/task-execution.repo";

export async function createServiceRequestFromTask(
    db: DB,
    input: {
        auth: any;
        taskId: string;
    },
) {
    const task = await db.task.findUnique({
        where: { id: input.taskId },
        include: {
            workCase: true,
            watch: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!task) throw new Error("Không tìm thấy task");
    if (!task.watchId) throw new Error("Task chưa gắn với watch nên chưa thể tạo service request");

    const createdByUserId =
        input.auth?.user?.id ??
        input.auth?.id ??
        task.assignedToUserId ??
        task.createdByUserId;

    const serviceRequest = await db.serviceRequest.create({
        data: {
            watchId: task.watchId,
            workCaseId: task.workCaseId ?? null,
            createdByUserId,
            title: task.title,
            description: task.description ?? null,
        } as any,
    });

    await createTaskExecutionRepo(db, {
        taskId: task.id,
        targetType: TaskExecutionTargetType.SERVICE_REQUEST,
        targetId: serviceRequest.id,
        actionType: TaskExecutionActionType.CREATED,
        note: "Tạo service request từ task",
        createdByUserId,
    });

    if (task.status === TaskStatus.TODO) {
        await db.task.update({
            where: { id: task.id },
            data: { status: TaskStatus.IN_PROGRESS },
        });
    }

    return serviceRequest;
}