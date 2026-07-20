import {
    ServiceRequestStatus,
    TaskExecutionActionType,
    TaskExecutionTargetType,
    TaskStatus,
} from "@prisma/client";
import type { DB } from "@/server/db/client";

export type ServiceRequestFromTaskInput = {
    taskId: string;
    mode: "LINK_EXISTING" | "CREATE_NEW";
    title?: string | null;
    description?: string | null;
};

type ServiceTaskAuth = {
    id?: string | null;
    userId?: string | null;
    user?: {
        id?: string | null;
    } | null;
} | null | undefined;

function getAuthUserId(auth: ServiceTaskAuth) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

function activeSrWhere(productId: string) {
    return {
        productId,
        status: {
            notIn: [
                ServiceRequestStatus.COMPLETED,
                ServiceRequestStatus.DELIVERED,
                ServiceRequestStatus.CANCELED,
            ],
        },
    };
}

async function getTaskContext(db: DB, taskId: string) {
    const task = await db.task.findUnique({
        where: { id: taskId },
        include: {
            watch: { include: { product: true } },
            workCase: {
                include: {
                    watch: { include: { product: true } },
                },
            },
        },
    });

    if (!task) throw new Error("Không tìm thấy task");

    const watch = task.watch ?? task.workCase?.watch ?? null;

    if (!watch?.productId) {
        throw new Error("Task chưa gắn product/watch nên không thể tạo Service Request");
    }

    return { task, watch };
}

export async function getServiceRequestFromTaskPreview(db: DB, taskId: string) {
    const { task, watch } = await getTaskContext(db, taskId);

    const activeServiceRequest = await db.serviceRequest.findFirst({
        where: activeSrWhere(watch.productId),
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            refNo: true,
            status: true,
            notes: true,
            createdAt: true,
        },
    });

    return {
        taskId: task.id,
        watch: {
            id: watch.id,
            productId: watch.productId,
            title: watch.product?.title ?? "Untitled watch",
            sku: watch.product?.sku ?? null,
        },
        activeServiceRequest,
    };
}

async function linkSrToTask(
    db: DB,
    input: {
        taskId: string;
        serviceRequestId: string;
        userId: string;
        note?: string | null;
    },
) {
    const existing = await db.taskExecution.findFirst({
        where: {
            taskId: input.taskId,
            targetType: TaskExecutionTargetType.SERVICE_REQUEST,
            targetId: input.serviceRequestId,
            actionType: { not: TaskExecutionActionType.CANCELLED },
        },
    });

    if (!existing) {
        await db.taskExecution.create({
            data: {
                taskId: input.taskId,
                targetType: TaskExecutionTargetType.SERVICE_REQUEST,
                targetId: input.serviceRequestId,
                actionType: TaskExecutionActionType.LINKED,
                note: input.note ?? "Gán Service Request đang active vào task",
                createdByUserId: input.userId,
            },
        });
    }

    const task = await db.task.update({
        where: { id: input.taskId },
        data: {
            serviceRequestId: input.serviceRequestId,
            status: TaskStatus.IN_PROGRESS,
        },
    });

    return {
        task,
        serviceRequestId: input.serviceRequestId,
        linked: true,
    };
}

export async function createOrLinkServiceRequestFromTask(
    db: DB,
    input: ServiceRequestFromTaskInput,
    auth: ServiceTaskAuth,
) {
    const userId = getAuthUserId(auth);
    if (!userId) throw new Error("Không xác định được user hiện tại");

    const { task, watch } = await getTaskContext(db, input.taskId);

    const activeServiceRequest = await db.serviceRequest.findFirst({
        where: activeSrWhere(watch.productId),
        orderBy: { createdAt: "desc" },
    });

    if (activeServiceRequest && input.mode === "LINK_EXISTING") {
        return linkSrToTask(db, {
            taskId: task.id,
            serviceRequestId: activeServiceRequest.id,
            userId,
            note: "Gán Service Request active mới nhất vào task",
        });
    }

    if (activeServiceRequest && input.mode === "CREATE_NEW") {
        throw new Error("Watch này đang có Service Request active. Hãy gán SR hiện có vào task trước.");
    }

    const title = input.title?.trim() || `Service Request từ task: ${task.title}`;
    const description = input.description?.trim() || task.description || null;

    const notes = [title, description].filter(Boolean).join("\n\n") || null;

    const serviceRequest = await db.serviceRequest.create({
        data: {
            productId: watch.productId,
            workCaseId: task.workCaseId ?? null,
            technicianId: userId,
            notes,
            status: ServiceRequestStatus.DRAFT,
            primaryImageUrlSnapshot: watch.product?.primaryImageUrl ?? null,
            skuSnapshot: watch.product?.sku ?? null,
        },
    });

    await db.taskExecution.create({
        data: {
            taskId: task.id,
            targetType: TaskExecutionTargetType.SERVICE_REQUEST,
            targetId: serviceRequest.id,
            actionType: TaskExecutionActionType.CREATED,
            note: "Tạo Service Request từ task",
            createdByUserId: userId,
        },
    });

    await db.task.update({
        where: { id: task.id },
        data: {
            serviceRequestId: serviceRequest.id,
            status: TaskStatus.IN_PROGRESS,
        },
    });

    return {
        serviceRequest,
        linked: false,
        created: true,
    };
}
