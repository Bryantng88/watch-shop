// domains/task/actions/task-support.actions.ts
"use server";

import { prisma } from "@/server/db/client";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { authCanViewAllTasks, getAuthUserId } from "../server/core/task.service";
import { buildAccessWhere } from "../server/core/task.repo";

export async function requestSubtaskSupportAction(input: {
    taskId: string;
    taskItemId: string;
    reason: string;
    suggestedAssigneeId?: string | null;
}) {
    const auth = await requirePermission(PERMISSIONS.TASK_VIEW);
    const userId = getAuthUserId(auth);
    if (!userId) throw new Error("AUTHENTICATED_ACTOR_REQUIRED");
    const reason = input.reason.trim();
    if (!reason) throw new Error("Vui lòng nhập lý do cần hỗ trợ.");

    const task = await prisma.task.findUnique({
        where: {
            id: input.taskId,
            AND: [
                { taskItems: { some: { id: input.taskItemId } } },
                buildAccessWhere(userId, authCanViewAllTasks(auth)),
            ],
        },
        select: {
            id: true,
            workCaseId: true,
            title: true,
        },
    });

    if (!task) throw new Error("Task không tồn tại.");

    await prisma.taskExecution.create({
        data: {
            taskId: input.taskId,
            taskItemId: input.taskItemId,
            targetType: "WORK_CASE",
            targetId: task.workCaseId || input.taskId,
            actionType: "UPDATED",
            note: reason,
            metadataJson: {
                type: "SUBTASK_NEEDS_HELP",
                reason,
                suggestedAssigneeId: input.suggestedAssigneeId || null,
            },
        } as any,
    });

    if (task.workCaseId) {
        await prisma.workCaseActivity.create({
            data: {
                workCaseId: task.workCaseId,
                action: "SUBTASK_NEEDS_HELP",
                note: reason,
                metadata: {
                    taskId: input.taskId,
                    taskItemId: input.taskItemId,
                    suggestedAssigneeId: input.suggestedAssigneeId || null,
                },
            },
        });
    }

    return { ok: true };
}
