// domains/task/server/task-technical-issue-sync.service.ts
import {
    TaskExecutionActionType,
    TaskExecutionTargetType,
    TaskStatus,
} from "@prisma/client";
import type { DB } from "@/server/db/client";
import { recordTaskBusinessEvent } from "./task-rule-engine.service";

export async function syncTechnicalIssueToTasks(
    db: DB,
    input: {
        technicalIssueId: string;
        event:
        | "TECHNICAL_ISSUE_CREATED"
        | "TECHNICAL_ISSUE_CONFIRMED"
        | "TECHNICAL_ISSUE_STARTED"
        | "TECHNICAL_ISSUE_DONE"
        | "TECHNICAL_ISSUE_CANCELED"
        | "TECHNICAL_ISSUE_UPDATED";
        actorUserId?: string | null;
        note?: string | null;
    },
) {
    const issue = await db.technicalIssue.findUnique({
        where: { id: input.technicalIssueId },
        select: {
            id: true,
            summary: true,
            executionStatus: true,
            serviceRequestId: true,
            actualCost: true,
            resolutionNote: true,
            task: { select: { id: true } },
        },
    });

    if (!issue) return { matched: 0 };

    const taskIds = new Set<string>();

    for (const task of issue.task ?? []) taskIds.add(task.id);

    const executionTasks = await db.taskExecution.findMany({
        where: {
            targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
            targetId: issue.id,
        },
        select: { taskId: true },
    });

    for (const row of executionTasks) taskIds.add(row.taskId);

    const srTasks = await db.task.findMany({
        where: {
            serviceRequestId: issue.serviceRequestId,
            status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
        },
        select: { id: true },
    });

    for (const task of srTasks) taskIds.add(task.id);

    const actionType =
        input.event === "TECHNICAL_ISSUE_CANCELED"
            ? TaskExecutionActionType.CANCELLED
            : TaskExecutionActionType.UPDATED;

    for (const taskId of taskIds) {
        await db.taskExecution.create({
            data: {
                taskId,
                targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
                targetId: issue.id,
                actionType,
                note:
                    input.note ??
                    `${input.event}: ${issue.summary ?? issue.id} - ${issue.executionStatus}`,
                metadataJson: {
                    event: input.event,
                    executionStatus: issue.executionStatus,
                    actualCost: issue.actualCost,
                    resolutionNote: issue.resolutionNote,
                    syncedAt: new Date().toISOString(),
                },
                createdByUserId: input.actorUserId ?? null,
            },
        });

        await db.task.update({
            where: { id: taskId },
            data: { status: TaskStatus.IN_PROGRESS },
        });
    }

    if (input.event === "TECHNICAL_ISSUE_DONE") {
        await recordTaskBusinessEvent(db, {
            eventKey: "TECHNICAL_ISSUE_DONE",
            targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
            targetId: issue.id,
            actorUserId: input.actorUserId,
            note: input.note,
        });
    }

    return { matched: taskIds.size };
}