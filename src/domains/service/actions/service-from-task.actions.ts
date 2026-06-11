"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { createServiceRequestFromTask } from "../server/service-from-task.service";

export async function createServiceRequestFromTaskAction(taskId: string) {
    const auth = await requirePermission("SERVICE_MANAGE");

    const result = await createServiceRequestFromTask(prisma, {
        auth,
        taskId,
    });

    revalidatePath(`/admin/tasks/${taskId}`);
    revalidatePath("/admin/tasks");
    revalidatePath("/admin/services");

    return result;
}