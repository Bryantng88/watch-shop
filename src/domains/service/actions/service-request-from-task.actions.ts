"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { syncTaskStatusFromChecklistRepo } from "@/domains/task/server/core/task.repo";
import {
    createOrLinkServiceRequestFromTask,
    getServiceRequestFromTaskPreview,
    type ServiceRequestFromTaskInput,
} from "../server/service-task/service-request-from-task.service";

function serialize<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export async function getServiceRequestFromTaskPreviewAction(taskId: string) {
    await requirePermission("SERVICE_VIEW");

    const data = await getServiceRequestFromTaskPreview(prisma, taskId);

    return serialize(data);
}

export async function createOrLinkServiceRequestFromTaskAction(
    input: ServiceRequestFromTaskInput,
) {
    const auth = await requirePermission("SERVICE_CREATE");

    const result = await createOrLinkServiceRequestFromTask(prisma, input, auth);

    await syncTaskStatusFromChecklistRepo(prisma, input.taskId);

    revalidatePath(`/admin/tasks/${input.taskId}`);
    revalidatePath("/admin/tasks");
    revalidatePath("/admin/services");

    return serialize(result);
}