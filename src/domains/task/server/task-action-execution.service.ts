import {
  ServiceRequestStatus,
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskStatus,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { authCanViewAllTasks, getAuthUserId } from "./task.service";

export type ExecuteTaskActionResult = {
  ok: true;
  mode: "SERVICE_REQUEST" | "TECHNICAL_ISSUE" | "NOOP";
  serviceRequest?: { id: string; refNo?: string | null; created?: boolean } | null;
  technicalIssue?: { id: string; created?: boolean } | null;
  message: string;
};

function clean(value: unknown) {
  const text = String(value ?? "").trim();
  return text || null;
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

function isTechnicalIssueAction(action: any) {
  const targetType = String(action?.targetType ?? "").toUpperCase();
  const code = String(action?.code ?? "").toUpperCase();

  return (
    targetType === String(TaskExecutionTargetType.TECHNICAL_ISSUE) ||
    Boolean(action?.technicalDetailCatalogId) ||
    Boolean(action?.serviceCatalogId) ||
    Boolean(action?.supplyCatalogId) ||
    Boolean(action?.mechanicalPartCatalogId) ||
    code.includes("TECHNICAL") ||
    code.includes("ISSUE") ||
    code.includes("STRAP") ||
    code.includes("BATTERY") ||
    code.includes("POLISH") ||
    code.includes("SERVICE")
  );
}

function isServiceRequestAction(action: any) {
  const targetType = String(action?.targetType ?? "").toUpperCase();
  return targetType === String(TaskExecutionTargetType.SERVICE_REQUEST) || isTechnicalIssueAction(action);
}

function inferIssueType(action: any) {
  const code = String(action?.code ?? "").toUpperCase();
  const metadata = action?.metadataJson ?? {};
  const fromMetadata = clean(metadata?.issueType);
  if (fromMetadata) return fromMetadata;
  if (code.includes("REPLACE") || code.includes("THAY")) return "REPLACE";
  if (code.includes("REPAIR") || code.includes("SUA")) return "REPAIR";
  if (code.includes("SERVICE")) return "SERVICE";
  return "CHECK";
}

function inferArea(action: any) {
  const metadata = action?.metadataJson ?? {};
  return clean(metadata?.area) ?? clean(metadata?.technicalArea) ?? null;
}

function actionTitle(task: any) {
  return clean(task?.taskAction?.name) ?? clean(task?.taskType?.name) ?? clean(task?.title) ?? "Nghiệp vụ task";
}

function buildIssueSummary(task: any) {
  const actionName = actionTitle(task);
  const productTitle = task?.watch?.product?.title ?? task?.workCase?.watch?.product?.title ?? null;
  return productTitle ? `${actionName}: ${productTitle}` : actionName;
}

function getWatchFromTask(task: any) {
  return task?.watch ?? task?.workCase?.watch ?? null;
}

async function assertTaskCanExecute(db: DB, taskId: string, auth: any) {
  const client = dbOrTx(db);
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được user hiện tại");

  const task = await client.task.findUnique({
    where: { id: taskId },
    include: {
      taskType: true,
      taskAction: true,
      createdByUser: { select: { id: true, name: true, email: true } },
      assignedToUser: { select: { id: true, name: true, email: true } },
      watch: { include: { product: true } },
      workCase: { include: { watch: { include: { product: true } } } },
      executions: true,
    } as any,
  });

  if (!task) throw new Error("Không tìm thấy task");
  if (!authCanViewAllTasks(auth) && task.createdByUserId !== userId && task.assignedToUserId !== userId) {
    throw new Error("Bạn không có quyền thực thi task này");
  }
  if (task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELLED) {
    throw new Error("Task đã đóng, không thể thực thi action");
  }
  if (!(task as any).taskAction) {
    throw new Error("Task chưa chọn action cụ thể");
  }

  return { task: task as any, userId };
}

async function ensureActiveServiceRequest(client: any, input: { task: any; userId: string }) {
  const watch = getWatchFromTask(input.task);
  const productId = clean(watch?.productId);
  if (!productId) throw new Error("Task chưa gắn product/watch nên không thể tạo Service Request");

  const existing = await client.serviceRequest.findFirst({
    where: activeSrWhere(productId),
    orderBy: { createdAt: "desc" },
    select: { id: true, refNo: true, status: true },
  });

  if (existing?.id) return { serviceRequest: existing, created: false };

  const product = watch?.product ?? null;
  const notes = [
    `Tạo từ task: ${input.task.title}`,
    input.task.description ?? null,
  ].filter(Boolean).join("\n\n") || null;

  const created = await client.serviceRequest.create({
    data: {
      productId,
      workCaseId: input.task.workCaseId ?? null,
      technicianId: input.task.assignedToUserId ?? input.userId,
      status: ServiceRequestStatus.DRAFT,
      notes,
      modelSnapshot: product?.title ?? null,
      skuSnapshot: product?.sku ?? null,
      primaryImageUrlSnapshot: product?.primaryImageUrl ?? null,
      servicecatalogid: input.task.taskAction?.serviceCatalogId ?? null,
    } as any,
    select: { id: true, refNo: true, status: true },
  });

  return { serviceRequest: created, created: true };
}

async function ensureAssessment(client: any, serviceRequestId: string) {
  const existing = await client.technicalAssessment.findUnique({
    where: { serviceRequestId },
    select: { id: true },
  });
  if (existing?.id) return existing;

  return client.technicalAssessment.create({
    data: {
      serviceRequestId,
      status: "DRAFT" as any,
    } as any,
    select: { id: true },
  });
}

async function createTechnicalIssueForTaskAction(
  client: any,
  input: { task: any; serviceRequestId: string; userId: string },
) {
  const assessment = await ensureAssessment(client, input.serviceRequestId);
  const action = input.task.taskAction;
  const now = new Date();
  const summary = buildIssueSummary(input.task);
  const note = input.task.description ?? action?.description ?? null;

  return client.technicalIssue.create({
    data: {
      serviceRequestId: input.serviceRequestId,
      assessmentId: assessment.id,
      area: inferArea(action),
      issueType: inferIssueType(action) as any,
      actionMode: (action?.technicalActionMode ?? "INTERNAL") as any,
      executionStatus: "OPEN" as any,
      isConfirmed: false,
      priority: input.task.priority ?? "MEDIUM",
      summary,
      note,
      technicianId: input.task.assignedToUserId ?? input.userId,
      serviceCatalogId: action?.serviceCatalogId ?? null,
      supplyCatalogId: action?.supplyCatalogId ?? null,
      mechanicalPartCatalogId: action?.mechanicalPartCatalogId ?? null,
      technicalDetailCatalogId: action?.technicalDetailCatalogId ?? null,
      openedAt: now,
      updatedAt: now,
    } as any,
    select: {
      id: true,
      serviceRequestId: true,
      executionStatus: true,
      serviceRequest: {
        select: {
          id: true,
          refNo: true,
          status: true,
        },
      },
    },
  });
}

async function createExecutionIfMissing(
  client: any,
  input: {
    taskId: string;
    targetType: TaskExecutionTargetType;
    targetId: string;
    actionType: TaskExecutionActionType;
    note?: string | null;
    userId?: string | null;
    metadataJson?: any;
  },
) {
  const existing = await client.taskExecution.findFirst({
    where: {
      taskId: input.taskId,
      targetType: input.targetType,
      targetId: input.targetId,
      actionType: input.actionType,
    },
    select: { id: true },
  });

  if (existing?.id) return existing;

  return client.taskExecution.create({
    data: {
      taskId: input.taskId,
      targetType: input.targetType,
      targetId: input.targetId,
      actionType: input.actionType,
      note: input.note ?? null,
      createdByUserId: input.userId ?? null,
      metadataJson: input.metadataJson ?? undefined,
    } as any,
    select: { id: true },
  });
}

export async function executeTaskAction(
  db: DB,
  input: { taskId: string },
  auth: any,
): Promise<ExecuteTaskActionResult> {
  const client = dbOrTx(db);
  const { task, userId } = await assertTaskCanExecute(client as any, input.taskId, auth);
  const action = task.taskAction;

  if (!isServiceRequestAction(action)) {
    return {
      ok: true,
      mode: "NOOP",
      message:
        "Action này không có nghiệp vụ tự động. Người xử lý có thể hoàn tất thủ công hoặc link nghiệp vụ đã có.",
    };
  }

  const { serviceRequest, created: srCreated } = await ensureActiveServiceRequest(client as any, {
    task,
    userId,
  });

  if (!isTechnicalIssueAction(action)) {
    await createExecutionIfMissing(client as any, {
      taskId: task.id,
      targetType: TaskExecutionTargetType.SERVICE_REQUEST,
      targetId: serviceRequest.id,
      actionType: TaskExecutionActionType.CREATED,
      note: srCreated ? "Tạo Service Request từ task action" : "Gán Service Request active vào task action",
      userId,
    });

    await client.task.update({
      where: { id: task.id },
      data: {
        serviceRequestId: serviceRequest.id,
        status: TaskStatus.IN_PROGRESS,
      } as any,
    });

    return {
      ok: true,
      mode: "SERVICE_REQUEST",
      serviceRequest: {
        id: serviceRequest.id,
        refNo: serviceRequest.refNo ?? null,
        created: srCreated,
      },
      message: srCreated ? "Đã tạo Service Request từ action" : "Đã gán Service Request active vào task",
    };
  }

  const issue = await createTechnicalIssueForTaskAction(client as any, {
    task,
    serviceRequestId: serviceRequest.id,
    userId,
  });

  await createExecutionIfMissing(client as any, {
    taskId: task.id,
    targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
    targetId: issue.id,
    actionType: TaskExecutionActionType.CREATED,
    note: `Tạo Technical Issue từ action: ${action.name}`,
    userId,
    metadataJson: {
      serviceRequestId: issue.serviceRequest?.id ?? issue.serviceRequestId,
      serviceRequestRefNo: issue.serviceRequest?.refNo ?? null,
      serviceRequestStatus: issue.serviceRequest?.status ?? null,
    },
  });

  await client.task.update({
    where: { id: task.id },
    data: {
      serviceRequestId: serviceRequest.id,
      technicalIssueId: issue.id,
      status: TaskStatus.IN_PROGRESS,
    } as any,
  });

  await client.serviceRequest
    .update({
      where: { id: serviceRequest.id },
      data: {
        status: ServiceRequestStatus.IN_PROGRESS,
        updatedAt: new Date(),
      } as any,
    })
    .catch(() => null);

  return {
    ok: true,
    mode: "TECHNICAL_ISSUE",
    serviceRequest: {
      id: serviceRequest.id,
      refNo: serviceRequest.refNo ?? null,
      created: srCreated,
    },
    technicalIssue: {
      id: issue.id,
      created: true,
    },
    message: srCreated
      ? "Đã tạo Service Request và Technical Issue từ action"
      : "Đã gán Service Request active và tạo Technical Issue từ action",
  };
}

export async function previewTaskAction(
  db: DB,
  input: { taskId: string },
  auth: any,
) {
  const client = dbOrTx(db);
  const { task, userId } = await assertTaskCanExecute(client as any, input.taskId, auth);
  const action = task.taskAction;

  if (!isServiceRequestAction(action)) {
    return {
      mode: "NOOP",
      message: "Action này không có nghiệp vụ tự động.",
    };
  }

  const watch = getWatchFromTask(task);
  const productId = clean(watch?.productId);
  if (!productId) throw new Error("Task chưa gắn product/watch.");

  const existingSr = await client.serviceRequest.findFirst({
    where: activeSrWhere(productId),
    orderBy: { createdAt: "desc" },
    select: { id: true, refNo: true, status: true },
  });

  return {
    mode: isTechnicalIssueAction(action) ? "TECHNICAL_ISSUE" : "SERVICE_REQUEST",
    serviceRequest: existingSr
      ? {
        id: existingSr.id,
        refNo: existingSr.refNo,
        status: existingSr.status,
        willCreate: false,
      }
      : {
        id: null,
        refNo: null,
        status: "DRAFT",
        willCreate: true,
      },
    technicalIssue: isTechnicalIssueAction(action)
      ? {
        willCreate: true,
        summary: buildIssueSummary(task),
        actionName: actionTitle(task),
        area: inferArea(action),
        issueType: inferIssueType(action),
        actionMode: action?.technicalActionMode ?? "INTERNAL",
      }
      : null,
    message: existingSr
      ? "Sẽ gán vào Service Request active hiện có và tạo Technical Issue mới."
      : "Sẽ tạo Service Request mới và Technical Issue mới.",
  };
}