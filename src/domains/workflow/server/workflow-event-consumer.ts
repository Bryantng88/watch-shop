import { evaluateWorkflowExecution } from "./workflow-evaluator";
import type { BusinessEventEffect } from "@/domains/event/server/business-event.service";

type ConsumeBusinessEventInput = {
    eventLog: any;
    eventKey: string;
    targetType: string;
    targetId: string;
    actorUserId?: string | null;
    effect: BusinessEventEffect;
    revokeEventKey?: string | null;
    targetAliasIds?: string[];
};

export async function consumeBusinessEventForWorkflow(
    client: any,
    input: ConsumeBusinessEventInput,
) {
    if (input.effect === "REVOKE") {
        return consumeRevokeEvent(client, input);
    }

    return consumeAssertEvent(client, input);
}

async function consumeRevokeEvent(client: any, input: ConsumeBusinessEventInput) {
    const revokeTargetIds = Array.from(
        new Set(
            [input.targetId, ...(input.targetAliasIds ?? [])]
                .map((id) => String(id || "").trim())
                .filter(Boolean),
        ),
    );

    const executionEventsToRevoke =
        await client.workflowExecutionEvent.findMany({
            where: {
                eventKey: input.revokeEventKey,
                targetType: input.targetType,
                targetId: { in: revokeTargetIds },
            },
            select: {
                executionId: true,
            },
            distinct: ["executionId"],
        });

    await client.workflowExecutionEvent.deleteMany({
        where: {
            eventKey: input.revokeEventKey,
            targetType: input.targetType,
            targetId: { in: revokeTargetIds },
        },
    });

    for (const row of executionEventsToRevoke) {
        await client.workflowExecution.update({
            where: { id: row.executionId },
            data: {
                status: "RUNNING" as any,
                completedAt: null,
                errorMessage: null,
            },
        });

        await evaluateWorkflowExecution(client, row.executionId, {
            actorUserId: input.actorUserId ?? null,
            eventLog: input.eventLog,
        });
    }

    return {
        ok: true,
        effect: "REVOKE",
        affectedExecutions: executionEventsToRevoke.length,
    };
}

async function consumeAssertEvent(client: any, input: ConsumeBusinessEventInput) {
    const conditions = await client.workflowCondition.findMany({
        where: {
            eventKey: input.eventKey,
        },
        include: {
            workflow: {
                include: {
                    tags: true,
                },
            },
        },
    });

    let affectedExecutions = 0;

    for (const condition of conditions) {
        const workflow = condition.workflow;
        if (!workflow || workflow.status !== "ACTIVE") continue;

        const tagIds = (workflow.tags ?? []).map((tag: any) => tag.id);
        if (!tagIds.length) continue;

        const tagLinks = await client.appTagLink.findMany({
            where: {
                tagId: { in: tagIds },
                targetType: "TASK_ITEM" as any,
            },
            select: {
                targetId: true,
            },
        });

        for (const link of tagLinks) {
            const taskItem = await client.taskItem.findUnique({
                where: { id: link.targetId },
                select: {
                    id: true,
                    isDone: true,
                    status: true,
                },
            });

            if (!taskItem) continue;

            const existingExecution = await client.workflowExecution.findFirst({
                where: {
                    workflowId: workflow.id,
                    actionTargetType: "TASK_ITEM",
                    actionTargetId: taskItem.id,
                },
            });

            const execution = existingExecution
                ? await client.workflowExecution.update({
                    where: { id: existingExecution.id },
                    data: {
                        status:
                            String(existingExecution.status) === "COMPLETED"
                                ? existingExecution.status
                                : ("RUNNING" as any),
                        startedAt: existingExecution.startedAt ?? new Date(),
                        errorMessage: null,
                    },
                })
                : await client.workflowExecution.create({
                    data: {
                        workflowId: workflow.id,
                        actionTargetType: "TASK_ITEM",
                        actionTargetId: taskItem.id,
                        status: "RUNNING" as any,
                        startedAt: new Date(),
                    },
                });

            const existingExecutionEvent =
                await client.workflowExecutionEvent.findFirst({
                    where: {
                        executionId: execution.id,
                        eventKey: input.eventKey,
                        targetType: input.targetType,
                        targetId: input.targetId,
                    },
                });

            if (!existingExecutionEvent) {
                await client.workflowExecutionEvent.create({
                    data: {
                        executionId: execution.id,
                        eventKey: input.eventKey,
                        targetType: input.targetType,
                        targetId: input.targetId,
                        businessEventLogId: input.eventLog.id,
                    },
                });
            }

            await evaluateWorkflowExecution(client, execution.id, {
                actorUserId: input.actorUserId ?? null,
                eventLog: input.eventLog,
            });

            affectedExecutions += 1;
        }
    }

    return {
        ok: true,
        effect: "ASSERT",
        affectedExecutions,
    };
}