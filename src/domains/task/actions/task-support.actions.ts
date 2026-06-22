// domains/task/actions/task-support.actions.ts
"use server";

import { prisma } from "@/server/db/client";

export async function requestSubtaskSupportAction(input: {
    taskId: string;
    checklistItemId: string;
    reason: string;
    suggestedAssigneeId?: string | null;
}) {
    const reason = input.reason.trim();
    if (!reason) throw new Error("Vui lòng nhập lý do cần hỗ trợ.");

    const task = await prisma.task.findUnique({
        where: { id: input.taskId },
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
            checklistItemId: input.checklistItemId,
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
                    checklistItemId: input.checklistItemId,
                    suggestedAssigneeId: input.suggestedAssigneeId || null,
                },
            },
        });
    }

    return { ok: true };
}