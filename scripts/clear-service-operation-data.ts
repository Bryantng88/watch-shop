import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");
const allServiceDomain = process.argv.includes("--all-service-domain");

function unique(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

function inIds(ids: string[]) {
  return ids.length ? { in: ids } : { in: ["__no_matching_id__"] };
}

function printSample<T>(label: string, rows: T[]) {
  console.log(`[clear-service-operation] ${label}:`, rows.length);
  if (rows.length) console.table(rows.slice(0, 10));
}

function noteValue(note: string | null | undefined, key: string) {
  return String(note ?? "").match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "im"))?.[1]?.trim() ?? null;
}

async function main() {
  if (apply && allServiceDomain && !process.argv.includes("--i-understand-all-service-domain")) {
    throw new Error(
      "Refusing broad delete. Add --i-understand-all-service-domain only if you intentionally want to delete every ServiceRequest and TechnicalIssue row.",
    );
  }

  const serviceOperationItems = await prisma.taskItem.findMany({
    where: {
      OR: [
        { title: { contains: "Service Operation", mode: "insensitive" } },
        { note: { contains: "workTypeKey: service-operation", mode: "insensitive" } },
        { note: { contains: "serviceOperationWorkspaceRole:", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      title: true,
      note: true,
      status: true,
      task: { select: { id: true, title: true, periodKey: true } },
    },
  });
  const serviceOperationItemIds = serviceOperationItems.map((item) => item.id);

  const serviceOperationExecutions = await prisma.taskExecution.findMany({
    where: { taskItemId: inIds(serviceOperationItemIds) },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      taskItemId: true,
      serviceRequestId: true,
      technicalIssueId: true,
    },
  });

  const seedEvents = await prisma.businessEventLog.findMany({
    where: {
      OR: [
        { eventKey: { startsWith: "service_request." } },
        { eventKey: { startsWith: "technical_issue." } },
      ],
    },
    select: {
      id: true,
      eventKey: true,
      targetType: true,
      targetId: true,
      createdAt: true,
    },
  });

  const scopedServiceRequestIds = unique([
    ...serviceOperationItems.map((item) => noteValue(item.note, "serviceRequestId")),
    ...serviceOperationExecutions
      .filter((execution) => execution.targetType === "SERVICE_REQUEST")
      .map((execution) => execution.targetId),
    ...serviceOperationExecutions.map((execution) => execution.serviceRequestId),
    ...seedEvents
      .filter((event) => event.targetType === "SERVICE_REQUEST")
      .map((event) => event.targetId),
  ]);

  const scopedTechnicalIssueIds = unique([
    ...serviceOperationExecutions
      .filter((execution) => execution.targetType === "TECHNICAL_ISSUE")
      .map((execution) => execution.targetId),
    ...serviceOperationExecutions.map((execution) => execution.technicalIssueId),
    ...seedEvents
      .filter((event) => event.targetType === "TECHNICAL_ISSUE")
      .map((event) => event.targetId),
  ]);

  const serviceRequests = await prisma.serviceRequest.findMany({
    where: allServiceDomain ? undefined : { id: inIds(scopedServiceRequestIds) },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      refNo: true,
      status: true,
      productId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const serviceRequestIds = serviceRequests.map((row) => row.id);

  const technicalIssues = await prisma.technicalIssue.findMany({
    where: allServiceDomain
      ? undefined
      : {
          OR: [
            { id: inIds(scopedTechnicalIssueIds) },
            { serviceRequestId: inIds(serviceRequestIds) },
          ],
        },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      serviceRequestId: true,
      summary: true,
      executionStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const technicalIssueIds = technicalIssues.map((row) => row.id);

  const boundExecutions = await prisma.taskExecution.findMany({
    where: {
      OR: [
        { taskItemId: inIds(serviceOperationItemIds) },
        { targetType: "SERVICE_REQUEST", targetId: inIds(serviceRequestIds) },
        { targetType: "TECHNICAL_ISSUE", targetId: inIds(technicalIssueIds) },
        { serviceRequestId: inIds(serviceRequestIds) },
        { technicalIssueId: inIds(technicalIssueIds) },
      ],
    },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      taskItemId: true,
      serviceRequestId: true,
      technicalIssueId: true,
    },
  });

  const taskItemIds = unique([
    ...serviceOperationItems.map((item) => item.id),
    ...boundExecutions.map((execution) => execution.taskItemId),
  ]);

  const businessEvents = await prisma.businessEventLog.findMany({
    where: {
      OR: [
        { targetType: "SERVICE_REQUEST", targetId: inIds(serviceRequestIds) },
        { targetType: "TECHNICAL_ISSUE", targetId: inIds(technicalIssueIds) },
        ...(allServiceDomain
          ? [
              { eventKey: { startsWith: "service_request." } },
              { eventKey: { startsWith: "technical_issue." } },
            ]
          : []),
      ],
    },
    select: {
      id: true,
      eventKey: true,
      targetType: true,
      targetId: true,
      createdAt: true,
    },
  });
  const businessEventIds = businessEvents.map((event) => event.id);

  const payments = await prisma.payment.findMany({
    where: {
      OR: [
        { service_request_id: inIds(serviceRequestIds) },
        { technical_issue_id: inIds(technicalIssueIds) },
      ],
    },
    select: {
      id: true,
      refNo: true,
      amount: true,
      status: true,
      service_request_id: true,
      technical_issue_id: true,
    },
  });
  const paymentIds = payments.map((payment) => payment.id);

  const invoices = await prisma.invoice.findMany({
    where: { serviceRequestId: inIds(serviceRequestIds) },
    select: {
      id: true,
      code: true,
      status: true,
      serviceRequestId: true,
    },
  });
  const invoiceIds = invoices.map((invoice) => invoice.id);

  const maintenanceRecords = await prisma.maintenanceRecord.findMany({
    where: {
      OR: [
        { serviceRequestId: inIds(serviceRequestIds) },
        { technicalIssueId: inIds(technicalIssueIds) },
        { paymentId: inIds(paymentIds) },
      ],
    },
    select: {
      id: true,
      serviceRequestId: true,
      technicalIssueId: true,
      paymentId: true,
      eventType: true,
    },
  });
  const maintenanceRecordIds = maintenanceRecords.map((record) => record.id);

  const workflowExecutions = await prisma.workflowExecution.findMany({
    where: {
      actionTargetType: "TASK_ITEM",
      actionTargetId: inIds(taskItemIds),
    },
    select: {
      id: true,
      actionTargetId: true,
      status: true,
    },
  });
  const workflowExecutionIds = workflowExecutions.map((execution) => execution.id);

  const eventActivities = await prisma.taskItemActivity.findMany({
    where: {
      sourceType: "BUSINESS_EVENT",
      sourceId: inIds(businessEventIds),
    },
    select: { id: true },
  });
  const eventActivityIds = eventActivities.map((activity) => activity.id);

  console.log("[clear-service-operation] mode:", apply ? "APPLY" : "DRY_RUN");
  console.log(
    "[clear-service-operation] scope:",
    allServiceDomain ? "ALL_SERVICE_DOMAIN" : "SERVICE_OPERATION_LINKED",
  );
  printSample("service requests", serviceRequests.map((row) => ({
    id: row.id,
    refNo: row.refNo,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
  })));
  printSample("technical issues", technicalIssues.map((row) => ({
    id: row.id,
    serviceRequestId: row.serviceRequestId,
    status: row.executionStatus,
    summary: row.summary,
  })));
  printSample("service operation task items/workspaces", serviceOperationItems.map((item) => ({
    id: item.id,
    title: item.title,
    status: item.status,
    parent: item.task.title,
    periodKey: item.task.periodKey,
  })));
  printSample("business events", businessEvents.map((event) => ({
    id: event.id,
    eventKey: event.eventKey,
    targetType: event.targetType,
    targetId: event.targetId,
  })));
  printSample("payments", payments.map((payment) => ({
    id: payment.id,
    refNo: payment.refNo,
    status: payment.status,
    serviceRequestId: payment.service_request_id,
    technicalIssueId: payment.technical_issue_id,
  })));
  printSample("invoices", invoices);
  printSample("maintenance records", maintenanceRecords);

  console.log("[clear-service-operation] delete plan:", {
    taskItemIds: taskItemIds.length,
    taskExecutions: boundExecutions.length,
    workflowExecutions: workflowExecutions.length,
    businessEvents: businessEvents.length,
    serviceRequests: serviceRequestIds.length,
    technicalIssues: technicalIssueIds.length,
    payments: paymentIds.length,
    invoices: invoiceIds.length,
    maintenanceRecords: maintenanceRecordIds.length,
  });

  if (!apply) {
    console.log("[clear-service-operation] add --apply to delete these records.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.workflowExecutionEvent.deleteMany({
      where: {
        OR: [
          { executionId: inIds(workflowExecutionIds) },
          { businessEventLogId: inIds(businessEventIds) },
          { targetType: "SERVICE_REQUEST", targetId: inIds(serviceRequestIds) },
          { targetType: "TECHNICAL_ISSUE", targetId: inIds(technicalIssueIds) },
        ],
      },
    });

    await tx.workflowExecution.deleteMany({
      where: { id: inIds(workflowExecutionIds) },
    });

    await tx.timelineEntry.deleteMany({
      where: {
        OR: [
          { sourceId: inIds(businessEventIds) },
          { containerId: inIds(taskItemIds) },
          { containerId: inIds(serviceRequestIds) },
          { containerId: inIds(technicalIssueIds) },
        ],
      },
    });

    await tx.businessFeedback.deleteMany({
      where: {
        OR: [
          { targetType: "SERVICE_REQUEST", targetId: inIds(serviceRequestIds) },
          { targetType: "TECHNICAL_ISSUE", targetId: inIds(technicalIssueIds) },
        ],
      },
    });

    await tx.userComment.deleteMany({
      where: {
        OR: [
          { targetType: "SERVICE_REQUEST", targetId: inIds(serviceRequestIds) },
          { targetType: "TECHNICAL_ISSUE", targetId: inIds(technicalIssueIds) },
        ],
      },
    });

    await tx.taskItemActivityReply.deleteMany({
      where: { activityId: inIds(eventActivityIds) },
    });

    await tx.taskItemActivity.deleteMany({
      where: {
        OR: [
          { id: inIds(eventActivityIds) },
          { taskItemId: inIds(taskItemIds) },
        ],
      },
    });

    await tx.taskExecution.deleteMany({
      where: {
        OR: [
          { id: inIds(boundExecutions.map((execution) => execution.id)) },
          { taskItemId: inIds(taskItemIds) },
          { serviceRequestId: inIds(serviceRequestIds) },
          { technicalIssueId: inIds(technicalIssueIds) },
          { targetType: "SERVICE_REQUEST", targetId: inIds(serviceRequestIds) },
          { targetType: "TECHNICAL_ISSUE", targetId: inIds(technicalIssueIds) },
        ],
      },
    });

    await tx.taskItem.deleteMany({
      where: { id: inIds(taskItemIds) },
    });

    if ((tx as any).projectionRecord) {
      await (tx as any).projectionRecord.deleteMany({
        where: {
          OR: [
            { entityType: "SERVICE_REQUEST", entityId: inIds(serviceRequestIds) },
            { entityType: "TECHNICAL_ISSUE", entityId: inIds(technicalIssueIds) },
            { workspaceId: inIds(taskItemIds) },
          ],
        },
      });
    }

    await tx.maintenanceRecord.deleteMany({
      where: { id: inIds(maintenanceRecordIds) },
    });

    await tx.payment.deleteMany({
      where: { id: inIds(paymentIds) },
    });

    await tx.invoice.deleteMany({
      where: { id: inIds(invoiceIds) },
    });

    await tx.approvalRequests.deleteMany({
      where: { serviceRequestId: inIds(serviceRequestIds) },
    });

    await tx.technicalAssessments.deleteMany({
      where: { serviceRequestId: inIds(serviceRequestIds) },
    });

    await tx.acquisitionItem.updateMany({
      where: { serviceRequestId: inIds(serviceRequestIds) },
      data: { serviceRequestId: null },
    });

    await tx.businessEventLog.deleteMany({
      where: { id: inIds(businessEventIds) },
    });

    await tx.technicalIssue.deleteMany({
      where: { id: inIds(technicalIssueIds) },
    });

    await tx.technicalAssessment.deleteMany({
      where: { serviceRequestId: inIds(serviceRequestIds) },
    });

    await tx.serviceRequest.deleteMany({
      where: { id: inIds(serviceRequestIds) },
    });
  });

  console.log("[clear-service-operation] deleted Service Operation SR/TI/workspace data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
