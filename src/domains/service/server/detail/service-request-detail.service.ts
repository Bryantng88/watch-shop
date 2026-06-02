import { prisma } from "@/server/db/client";
import {
  getServiceRequestTechnicalSummary,
} from "@/domains/service/server/technical/technical-assessment.service";
import { getTechnicalIssueBoardData } from "@/domains/service/server/issue-board";

function toNumber(value: unknown) {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function serialize<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      if (value instanceof Date) return value.toISOString();
      if (typeof value === "object" && value?._isDecimal) return Number(value);
      return value;
    }),
  );
}

function buildAppearanceScore(assessment: any) {
  if (!assessment) return 100;
  const sections = [assessment.movementStatus, assessment.caseStatus, assessment.crystalStatus, assessment.crownStatus];
  const issueCount = sections.filter((x) => String(x ?? "").toUpperCase() === "ISSUE").length;
  return Math.max(0, 100 - issueCount * 15);
}

export async function getServiceRequestDetailPageData(serviceRequestId: string) {
  const id = String(serviceRequestId || "").trim();
  if (!id) return null;

  const sr = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          primaryImageUrl: true,
          watchSpec: {
            select: {
              movement: true,
              model: true,
              ref: true,
            },
          },
          productImage: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: { fileKey: true },
          },
        },
      },
      vendor: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true } },
      serviceCatalog: { select: { id: true, code: true, name: true } },
      technicalAssessment: {
        include: {
          TechnicalIssue: {
            where: { executionStatus: { not: "CANCELED" as any } },
            orderBy: [{ openedAt: "desc" }, { createdAt: "desc" }],
            include: {
              serviceCatalog: { select: { id: true, code: true, name: true } },
              SupplyCatalog: { select: { id: true, code: true, name: true } },
              MechanicalPartCatalog: { select: { id: true, code: true, name: true } },
              Vendor: { select: { id: true, name: true } },
            },
          },
        },
      },
      technicalIssue: {
        where: { executionStatus: { not: "CANCELED" as any } },
        orderBy: [{ openedAt: "desc" }, { createdAt: "desc" }],
        include: {
          serviceCatalog: { select: { id: true, code: true, name: true } },
          SupplyCatalog: { select: { id: true, code: true, name: true } },
          MechanicalPartCatalog: { select: { id: true, code: true, name: true } },
          Vendor: { select: { id: true, name: true } },
        },
      },
    } as any,
  });

  if (!sr) return null;

  const [technicalSummary, issueBoard] = await Promise.all([
    getServiceRequestTechnicalSummary(id).catch(() => null),
    getTechnicalIssueBoardData({ serviceRequestId: id }).catch(() => ({
      items: [],
      counts: {
        pendingConfirm: 0,
        ready: 0,
        inProgress: 0,
        done: 0,
        readyToCloseSrCount: 0,
      },
      catalogs: {
        serviceCatalogs: [],
        supplyCatalogs: [],
        mechanicalPartCatalogs: [],
      },
    })),
  ]);

  const assessment = (sr as any).technicalAssessment ?? null;
  const issues = ((sr as any).technicalIssue ?? assessment?.TechnicalIssue ?? []).map((issue: any) => ({
    id: issue.id,
    area: issue.area ?? null,
    summary: issue.summary ?? null,
    note: issue.note ?? null,
    actionMode: issue.actionMode ?? null,
    executionStatus: issue.executionStatus ?? null,
    actualCost: toNumber(issue.actualCost),
    estimatedCost: toNumber(issue.estimatedCost),
    resolutionNote: issue.resolutionNote ?? null,
    serviceCatalog: issue.serviceCatalog
      ? { id: issue.serviceCatalog.id, code: issue.serviceCatalog.code ?? null, name: issue.serviceCatalog.name ?? null }
      : null,
    supplyCatalog: issue.SupplyCatalog
      ? { id: issue.SupplyCatalog.id, code: issue.SupplyCatalog.code ?? null, name: issue.SupplyCatalog.name ?? null }
      : null,
    mechanicalPartCatalog: issue.MechanicalPartCatalog
      ? { id: issue.MechanicalPartCatalog.id, code: issue.MechanicalPartCatalog.code ?? null, name: issue.MechanicalPartCatalog.name ?? null }
      : null,
  }));

  const totalCost = issues.reduce((sum: number, issue: any) => sum + Number(issue.actualCost ?? 0), 0);

  return serialize({
    detail: {
      serviceRequest: {
        id: sr.id,
        refNo: sr.refNo ?? null,
        status: sr.status ?? null,
        scope: sr.scope ?? null,
        priority: (sr as any).priority ?? "NORMAL",
        priorityReason: (sr as any).priorityReason ?? (sr as any).priority_reason ?? null,
        productId: sr.productId ?? null,
        productTitle: sr.modelSnapshot ?? sr.product?.title ?? null,
        skuSnapshot: sr.skuSnapshot ?? null,
        primaryImageUrl:
          sr.primaryImageUrlSnapshot ??
          sr.product?.primaryImageUrl ??
          sr.product?.productImage?.[0]?.fileKey ??
          null,
        ref: sr.refSnapshot ?? sr.product?.watchSpec?.ref ?? null,
        model: sr.modelSnapshot ?? sr.product?.watchSpec?.model ?? null,
        movement: sr.product?.watchSpec?.movement ?? null,
        technicianNameSnap: sr.technicianNameSnap ?? sr.user?.name ?? sr.user?.email ?? null,
        vendorNameSnap: sr.vendorNameSnap ?? sr.vendor?.name ?? null,
        customerItemNote: sr.notes ?? null,
        serviceName: sr.serviceCatalog?.name ?? "Kiểm tra kỹ thuật",
        createdAt: sr.createdAt,
        updatedAt: sr.updatedAt,
      },
      technicalSummary: technicalSummary ?? {
        issueCount: issues.length,
        openIssueCount: issues.filter((x: any) => !["DONE", "COMPLETED"].includes(String(x.executionStatus ?? "").toUpperCase())).length,
      },
      technicalIssues: issues,
      technicalAssessment: assessment
        ? {
          id: assessment.id,
          status: assessment.status ?? null,
          movementStatus: assessment.movementStatus ?? null,
          conclusion: assessment.conclusion ?? null,
        }
        : null,
      assessment: assessment
        ? {
          id: assessment.id,
          status: assessment.status ?? null,
          movementStatus: assessment.movementStatus ?? null,
          conclusion: assessment.conclusion ?? null,
        }
        : null,
      appearanceSummary: { score: buildAppearanceScore(assessment) },
      financialSummary: { totalCost },
    },
    issueBoard,
  });
}
