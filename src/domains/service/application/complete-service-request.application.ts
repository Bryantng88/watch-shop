import { prisma, type DB } from "@/server/db/client";
import { ProductStatus, ServiceRequestStatus } from "@prisma/client";
import * as serviceRepo from "../server/repository/service-request.repo";
import * as maintRepo from "../server/maintenance/maintenance.repo";
import { OPEN_SERVICE_STATUSES, canCompleteServiceStatus } from "../server/shared/service-request.rules";

async function restoreProductStatusIfDone(tx: DB, productId?: string | null) {
  if (!productId) return;
  const openCount = await tx.serviceRequest.count({ where: { productId, status: { in: [...OPEN_SERVICE_STATUSES] } } });
  if (openCount > 0) return;

  const product = await tx.product.findUnique({ where: { id: productId }, select: { id: true, status: true } });
  if (product?.status === ProductStatus.IN_SERVICE) {
    await tx.product.update({ where: { id: product.id }, data: { status: ProductStatus.AVAILABLE } });
  }
}

export async function completeServiceRequestApplication(input: { serviceRequestId: string; note?: string | null }) {
  const serviceRequestId = String(input.serviceRequestId || "").trim();
  if (!serviceRequestId) throw new Error("Missing serviceRequestId");

  return prisma.$transaction(async (tx) => {
    const existing = await tx.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      select: {
        id: true, status: true, vendorId: true, vendorNameSnap: true, technicianId: true,
        technicianNameSnap: true, productId: true, variantId: true, brandSnapshot: true,
        modelSnapshot: true, refSnapshot: true, serialSnapshot: true,
      },
    });

    if (!existing) throw new Error("Service request not found");
    if (!canCompleteServiceStatus(existing.status as ServiceRequestStatus)) {
      throw new Error("Service request đã bị hủy, không thể kết thúc");
    }

    if ([ServiceRequestStatus.COMPLETED, ServiceRequestStatus.DELIVERED].includes(existing.status as any)) {
      return { ok: true, skipped: true, status: existing.status };
    }

    const technicalAssessment = await tx.technicalAssessment.findUnique({
      where: { serviceRequestId },
      select: {
        id: true,
        movementKind: true,
        imageFileKey: true,
        TechnicalIssue: { select: { id: true, isConfirmed: true, executionStatus: true, serviceCatalogId: true, actualCost: true, resolutionNote: true } },
      },
    });

    if (technicalAssessment) {
      const activeIssues = technicalAssessment.TechnicalIssue.filter(
        (issue: any) => String(issue.executionStatus || "").toUpperCase() !== "CANCELED"
      );

      const unfinishedIssue = activeIssues.find((issue: any) => {
        const status = String(issue.executionStatus || "").toUpperCase();
        return status !== "DONE" && status !== "COMPLETED";
      });

      if (unfinishedIssue) {
        throw new Error("Còn issue chưa hoàn tất. Vui lòng hoàn tất, hủy hoặc xử lý lại issue trước khi đóng SR.");
      }

      const missingConclusionIssue = activeIssues.find((issue: any) => {
        const status = String(issue.executionStatus || "").toUpperCase();
        if (status !== "DONE" && status !== "COMPLETED") return false;

        return (
          !issue.serviceCatalogId ||
          issue.actualCost == null ||
          !String(issue.resolutionNote || "").trim()
        );
      });

      if (missingConclusionIssue) {
        throw new Error("Có issue đã hoàn tất nhưng thiếu kết luận kỹ thuật/hạng mục/chi phí. Vui lòng bổ sung trước khi đóng SR.");
      }

      const needsMechanicalImage =
        String(technicalAssessment.movementKind || "").toUpperCase() === "MECHANICAL" &&
        activeIssues.length > 0 &&
        !String(technicalAssessment.imageFileKey || "").trim();

      if (needsMechanicalImage) throw new Error("Máy cơ đã hoàn tất issue nhưng vẫn chưa có hình ảnh kỹ thuật.");
    }

    const completedAt = new Date();
    const updated = await serviceRepo.completeServiceRequestOne(tx, { id: serviceRequestId, completedAt });

    await maintRepo.createLog(tx, {
      serviceRequestId: updated.id,
      eventType: "NOTE" as any,
      vendorId: updated.vendorId ?? null,
      vendorName: updated.vendorNameSnap ?? null,
      technicianId: updated.technicianId ?? null,
      technicianNameSnap: updated.technicianNameSnap ?? null,
      notes: input.note && String(input.note).trim() ? `Kết thúc service\n${String(input.note).trim()}` : "Kết thúc service",
      servicedAt: completedAt,
      productId: updated.productId ?? null,
      variantId: updated.variantId ?? null,
      brandSnapshot: updated.brandSnapshot ?? null,
      modelSnapshot: updated.modelSnapshot ?? null,
      refSnapshot: updated.refSnapshot ?? null,
      serialSnapshot: updated.serialSnapshot ?? null,
    } as any);

    await restoreProductStatusIfDone(tx, updated.productId ?? null);
    return { ok: true, skipped: false, status: updated.status };
  });
}
