import {
    WorkflowActionType,
    WorkflowConditionStrategy,
} from "@prisma/client";
import { workflowActionHandlers } from "./workflow-action-registry";

type EvaluateContext = {
    actorUserId?: string | null;
    eventLog?: any;
};
async function syncTaskItemFromWorkflowState(
    client: any,
    input: {
        execution: any;
        matched: boolean;
        hasAnyEvent: boolean;
    },
) {
    if (input.execution.actionTargetType !== "TASK_ITEM") return;

    const taskItem = await client.taskItem.findUnique({
        where: { id: input.execution.actionTargetId },
        select: {
            id: true,
            taskId: true,
            isDone: true,
            status: true,
        },
    });

    if (!taskItem) return;

    if (input.matched) {
        await client.taskItem.update({
            where: { id: taskItem.id },
            data: {
                isDone: true,
                status: "DONE" as any,
                completedAt: new Date(),
                cancelledAt: null,
            },
        });
    } else {
        await client.taskItem.update({
            where: { id: taskItem.id },
            data: {
                isDone: false,
                status: input.hasAnyEvent ? ("IN_PROGRESS" as any) : ("TODO" as any),
                completedAt: null,
            },
        });
    }

    await client.workflowExecution.update({
        where: { id: input.execution.id },
        data: {
            status: input.matched ? ("COMPLETED" as any) : ("RUNNING" as any),
            completedAt: input.matched ? new Date() : null,
            errorMessage: null,
        },
    });

    // sync task cha nếu bạn đang dùng rule checklist/subtask
    const siblings = await client.taskItem.findMany({
        where: { taskId: taskItem.taskId },
        select: { isDone: true, status: true },
    });

    const allDone =
        siblings.length > 0 &&
        siblings.every(
            (item: any) => item.isDone || String(item.status) === "DONE",
        );

    await client.task.update({
        where: { id: taskItem.taskId },
        data: {
            status: allDone ? ("DONE" as any) : ("IN_PROGRESS" as any),
            completedAt: allDone ? new Date() : null,
        },
    });
}
function keyOf(targetType: string, targetId: string) {
    return `${String(targetType).toUpperCase()}:${String(targetId)}`;
}

function sameTargetType(a?: string | null, b?: string | null) {
    if (!a || !b) return true;
    return String(a).toUpperCase() === String(b).toUpperCase();
}

function evaluateOneTarget(input: {
    targetType: string;
    conditions: any[];
    eventKeys: Set<string>;
    strategy: WorkflowConditionStrategy;
}) {
    const relevantConditions = input.conditions.filter((condition) =>
        sameTargetType(condition.targetType, input.targetType),
    );

    if (!relevantConditions.length) return false;

    if (input.strategy === WorkflowConditionStrategy.ANY) {
        return relevantConditions.some((condition) =>
            input.eventKeys.has(condition.eventKey),
        );
    }

    return relevantConditions.every((condition) =>
        input.eventKeys.has(condition.eventKey),
    );
}

async function getLinkedBusinessTargets(client: any, taskItemId: string) {
    const rows = await client.taskExecution.findMany({
        where: {
            taskItemId,
        },
        select: {
            targetType: true,
            targetId: true,
        },
    });

    const seen = new Set<string>();
    const targets: Array<{ targetType: string; targetId: string }> = [];

    for (const row of rows) {
        const targetType = String(row.targetType || "").toUpperCase();
        const targetId = String(row.targetId || "").trim();
        if (!targetType || !targetId) continue;

        const key = keyOf(targetType, targetId);
        if (seen.has(key)) continue;

        seen.add(key);
        targets.push({ targetType, targetId });
    }

    return targets;
}

function buildEventMap(events: any[]) {
    const map = new Map<string, Set<string>>();

    for (const event of events ?? []) {
        const targetType = String(event.targetType || "").toUpperCase();
        const targetId = String(event.targetId || "").trim();
        if (!targetType || !targetId) continue;

        const key = keyOf(targetType, targetId);
        const set = map.get(key) ?? new Set<string>();
        set.add(event.eventKey);
        map.set(key, set);
    }

    return map;
}

async function reopenTaskItemIfNeeded(client: any, execution: any) {
    if (execution.actionTargetType !== "TASK_ITEM") return;

    await client.taskItem.update({
        where: { id: execution.actionTargetId },
        data: {
            isDone: false,
            status: "TODO" as any,
            completedAt: null,
        },
    });

    await client.workflowExecution.update({
        where: { id: execution.id },
        data: {
            status: "RUNNING" as any,
            completedAt: null,
            errorMessage: null,
        },
    });
}

export async function evaluateWorkflowExecution(
    client: any,
    executionId: string,
    context: EvaluateContext = {},
) {
    const execution = await client.workflowExecution.findUnique({
        where: { id: executionId },
        include: {
            workflow: {
                include: {
                    conditions: {
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    },
                    actions: {
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    },
                },
            },
            events: true,
        },
    });

    if (!execution) return { ok: false, reason: "EXECUTION_NOT_FOUND" };

    const workflow = execution.workflow;
    if (!workflow || workflow.status !== "ACTIVE") {
        return { ok: false, reason: "WORKFLOW_INACTIVE" };
    }

    if (execution.actionTargetType !== "TASK_ITEM") {
        return { ok: false, reason: "UNSUPPORTED_ACTION_TARGET" };
    }

    const linkedTargets = await getLinkedBusinessTargets(
        client,
        execution.actionTargetId,
    );

    if (!linkedTargets.length) {
        return { ok: false, reason: "NO_LINKED_TARGETS" };
    }

    const eventMap = buildEventMap(execution.events ?? []);

    const targetResults = linkedTargets.map((target) => {
        const eventKeys =
            eventMap.get(keyOf(target.targetType, target.targetId)) ??
            new Set<string>();

        return {
            ...target,
            done: evaluateOneTarget({
                targetType: target.targetType,
                conditions: workflow.conditions ?? [],
                eventKeys,
                strategy: workflow.strategy,
            }),
        };
    });

    const matched = targetResults.every((target) => target.done);
    const hasAnyEvent = (execution.events ?? []).length > 0;

    await syncTaskItemFromWorkflowState(client, {
        execution,
        matched,
        hasAnyEvent,
    });
    if (!matched) {
        if (String(execution.status) === "COMPLETED") {
            await reopenTaskItemIfNeeded(client, execution);
        }

        return {
            ok: true,
            matched: false,
            targets: targetResults,
        };
    }

    const taskItem = await client.taskItem.findUnique({
        where: { id: execution.actionTargetId },
        include: {
            task: true,
            executions: true,
            checklists: true,
        } as any,
    });

    if (!taskItem) {
        return { ok: false, reason: "TASK_ITEM_NOT_FOUND" };
    }



    for (const action of workflow.actions ?? []) {
        const actionType = action.actionType as WorkflowActionType;
        const handler = workflowActionHandlers[actionType];

        if (!handler) continue;

        await handler(client, {
            workflow,
            taskItem,
            execution,
            eventLog: context.eventLog,
            actorUserId: context.actorUserId ?? null,
        });
    }

    await client.workflowExecution.update({
        where: { id: execution.id },
        data: {
            status: "COMPLETED" as any,
            completedAt: new Date(),
            errorMessage: null,
        },
    });

    return {
        ok: true,
        matched: true,
        targets: targetResults,
    };
}