import {
  ServiceRequestStatus,
  ServiceScope,
  ServiceType,
  TechnicalAssessmentStatus,
  TechnicalIssueExecutionStatus,
} from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";
import {
  recordBusinessEvent,
  type BusinessEventDispatchOptions,
} from "@/domains/event/server/business-event.service";

type OrderServiceItem = {
  id: string;
  kind?: string | null;
  serviceScope?: string | null;
  customerItemNote?: string | null;
  productId?: string | null;
  variantId?: string | null;
  serviceCatalogId?: string | null;
  title?: string | null;
};

export type OrderServiceIntakeEntry = {
  orderItemId: string;
  serviceRequestId: string;
  technicalAssessmentId: string;
  technicalIssueId: string;
  emitServiceRequestCreated: boolean;
  createdTechnicalIssue: boolean;
};

export async function createFromOrderTx(
  tx: DB,
  order: { id: string; items?: OrderServiceItem[]; orderItem?: OrderServiceItem[] },
) {
  const items = (order.items ?? order.orderItem ?? []).filter(
    (item) => String(item.kind ?? "").toUpperCase() === "SERVICE",
  );
  const ids: string[] = [];
  const entries: OrderServiceIntakeEntry[] = [];
  let skipped = 0;

  const technician = await tx.user.findFirst({
    where: { isActive: true, roles: { some: { name: "TECHNICIAN" } } },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    select: { id: true, name: true, email: true },
  });

  for (const item of items) {
    const existing = await tx.serviceRequest.findFirst({
      where: { orderItemId: item.id },
      select: { id: true, refNo: true, technicianId: true, status: true },
    });
    let createdServiceRequest = false;
    let serviceRequestId = existing?.id ?? null;
    if (!serviceRequestId) {
      const refNo = await genRefNo(tx, {
        model: tx.serviceRequest,
        prefix: "SR",
        field: "refNo",
        padding: 6,
      });
      const created = await tx.serviceRequest.create({
        data: {
          refNo,
          type: ServiceType.PAID,
          billable: true,
          status: ServiceRequestStatus.DRAFT,
          scope: item.serviceScope === "WITH_PURCHASE"
            ? ServiceScope.WITH_PURCHASE
            : ServiceScope.CUSTOMER_OWNED,
          notes: item.customerItemNote ?? null,
          orderItemId: item.id,
          productId: item.productId ?? null,
          variantId: item.variantId ?? null,
          servicecatalogid: item.serviceCatalogId ?? null,
          modelSnapshot: item.title ?? null,
          technicianId: technician?.id ?? null,
          technicianNameSnap: technician?.name?.trim() || technician?.email || null,
        },
        select: { id: true },
      });
      serviceRequestId = created.id;
      createdServiceRequest = true;
      ids.push(created.id);
    } else {
      skipped += 1;
      const missingRefNo = !existing?.refNo?.trim();
      const missingTechnician = !existing?.technicianId && Boolean(technician?.id);
      if (missingRefNo || missingTechnician) {
        const refNo = missingRefNo
          ? await genRefNo(tx, {
              model: tx.serviceRequest,
              prefix: "SR",
              field: "refNo",
              padding: 6,
            })
          : undefined;
        await tx.serviceRequest.update({
          where: { id: serviceRequestId },
          data: {
            ...(refNo ? { refNo } : {}),
            ...(missingTechnician
              ? {
                  technicianId: technician?.id,
                  technicianNameSnap: technician?.name?.trim() || technician?.email || null,
                }
              : {}),
          },
        });
      }
    }

    const assessment = await tx.technicalAssessment.upsert({
      where: { serviceRequestId },
      create: { serviceRequestId, status: TechnicalAssessmentStatus.DRAFT },
      update: {},
      select: { id: true },
    });
    const existingIssue = await tx.technicalIssue.findFirst({
      where: { serviceRequestId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    const issue = existingIssue ?? await tx.technicalIssue.create({
      data: {
        assessmentId: assessment.id,
        serviceRequestId,
        serviceCatalogId: item.serviceCatalogId ?? null,
        issueType: "SERVICE",
        actionMode: "INTERNAL",
        executionStatus: TechnicalIssueExecutionStatus.OPEN,
        openedAt: new Date(),
        area: "MOVEMENT",
        summary: item.title ?? "Dịch vụ kỹ thuật",
        note: item.customerItemNote ?? null,
        technicianId: technician?.id ?? null,
      },
      select: { id: true },
    });
    if (!existingIssue && existing?.status !== ServiceRequestStatus.CANCELED && existing?.status !== ServiceRequestStatus.DELIVERED) {
      await tx.serviceRequest.update({
        where: { id: serviceRequestId },
        data: { status: ServiceRequestStatus.IN_PROGRESS },
      });
    }
    entries.push({
      orderItemId: item.id,
      serviceRequestId,
      technicalAssessmentId: assessment.id,
      technicalIssueId: issue.id,
      emitServiceRequestCreated: createdServiceRequest || !existingIssue,
      createdTechnicalIssue: !existingIssue,
    });
  }

  return { created: ids.length, skipped, ids, entries };
}

export async function reconcileOrderServiceIntake(
  orderId: string,
  runtime?: BusinessEventDispatchOptions,
) {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        orderItem: {
          where: { kind: "SERVICE" },
          select: {
            id: true,
            kind: true,
            title: true,
            serviceScope: true,
            customerItemNote: true,
            productId: true,
            variantId: true,
            serviceCatalogId: true,
          },
        },
      },
    });
    if (!order) throw new Error("Không tìm thấy đơn hàng.");
    if (!order.orderItem.length) throw new Error("Đơn hàng không có dòng dịch vụ.");
    if (order.status === "DRAFT") {
      throw new Error("Hãy post đơn hàng trước khi tạo phiếu kỹ thuật.");
    }
    return createFromOrderTx(tx, { id: order.id, items: order.orderItem });
  });

  for (const entry of result.entries) {
    if (entry.emitServiceRequestCreated) {
      await recordBusinessEvent(prisma, {
        eventKey: "service_request.created",
        targetType: "SERVICE_REQUEST",
        targetId: entry.serviceRequestId,
        payload: {
          source: "ORDER_SERVICE_INTAKE_RECONCILE",
          serviceRequestId: entry.serviceRequestId,
          orderItemId: entry.orderItemId,
        },
        targetAliasIds: [entry.orderItemId],
      }, runtime);
    }
    if (entry.createdTechnicalIssue) {
      await recordBusinessEvent(prisma, {
        eventKey: "technical_issue.created",
        targetType: "TECHNICAL_ISSUE",
        targetId: entry.technicalIssueId,
        payload: {
          source: "ORDER_SERVICE_INTAKE_RECONCILE",
          serviceRequestId: entry.serviceRequestId,
          technicalIssueId: entry.technicalIssueId,
          orderItemId: entry.orderItemId,
        },
        targetAliasIds: [entry.serviceRequestId, entry.orderItemId],
      }, runtime);
    }
  }
  return result;
}
