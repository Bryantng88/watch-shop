"use server";

import { AppTagOwnerType, AppTagTargetType } from "@prisma/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { prisma } from "@/server/db/client";
import {
    ensureOwnerTagsRepo,
    listOwnerTagsRepo,
    setTargetTagsRepo,
} from "../server/tag/task-tag.repo";

async function getTaskAuth() {
    return requirePermission(PERMISSIONS.TASK_VIEW);
}

export async function listTaskScopeTagsAction(taskId: string) {
    await getTaskAuth();

    const cleanTaskId = String(taskId || "").trim();
    if (!cleanTaskId) throw new Error("Missing taskId");

    const tags = await listOwnerTagsRepo(prisma, {
        ownerType: AppTagOwnerType.TASK,
        ownerId: cleanTaskId,
    });

    return { ok: true, tags };
}

export async function ensureTaskScopeTagsAction(input: {
    taskId: string;
    names: string[];
}) {
    await requirePermission(PERMISSIONS.TASK_MANAGE);

    const taskId = String(input.taskId || "").trim();
    if (!taskId) throw new Error("Missing taskId");

    const tags = await ensureOwnerTagsRepo(prisma, {
        ownerType: AppTagOwnerType.TASK,
        ownerId: taskId,
        names: input.names,
    });

    return { ok: true, tags };
}

export async function setTaskItemTagsAction(input: {
    taskId: string;
    taskItemId: string;
    names: string[];
}) {
    await requirePermission(PERMISSIONS.TASK_MANAGE);

    const taskId = String(input.taskId || "").trim();
    const taskItemId = String(input.taskItemId || "").trim();

    if (!taskId) throw new Error("Missing taskId");
    if (!taskItemId) throw new Error("Missing taskItemId");

    const tags = await setTargetTagsRepo(prisma, {
        ownerType: AppTagOwnerType.TASK,
        ownerId: taskId,
        targetType: AppTagTargetType.TASK_ITEM,
        targetId: taskItemId,
        names: input.names,
    });

    return { ok: true, tags };
}
