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
      if (typeof value === "object" && value && "_isDecimal" in value) {
        return Number(value);
      }
      return value;
    }),
  );
}

function buildAppearanceScore(assessment: any) {
  if (!assessment) return 100;

  const sections = [
    assessment.movementStatus,
    assessment.caseStatus,
    assessment.crystalStatus,
    assessment.crownStatus,
  ];

  const issueCount = sections.filter(
    (x) => String(x ?? "").toUpperCase() === "ISSUE",
  ).length;

  return Math.max(0, 100 - issueCount * 15);
}

function mapCatalog(item: any) {
  if (!item) return null;

  return {
    id: item.id,
    code: item.code ?? null,
    name: item.name ?? null,
    area: item.area ?? null,
  };
}

function mapIssue(issue: any) {
  return {
    id: issue.id,
    refNo: issue.refNo ?? issue.code ?? null,
    area: issue.area ?? null,
    summary: issue.summary ?? null,
    note: issue.note ?? null,
    priority: issue.priority ?? "NORMAL",
    actionMode: issue.actionMode ?? null,
    executionStatus: issue.executionStatus ?? null,
    actualCost: toNumber(issue.actualCost),
    estimatedCost: toNumber(issue.estimatedCost),
    resolutionNote: issue.resolutionNote ?? null,

    technicalDetailCatalog: mapCatalog(issue.technicalDetailCatalog),
    serviceCatalog: mapCatalog(issue.serviceCatalog),
    supplyCatalog: mapCatalog(issue.SupplyCatalog),
    mechanicalPartCatalog: mapCatalog(issue.MechanicalPartCatalog),
    vendor: issue.Vendor ? { id: issue.Vendor.id, name: issue.Vendor.name } : null,
  };
}

function getProductImage(product: any) {
  return (
    product?.productImage?.[0]?.fileKey ??
    product?.ProductImage?.[0]?.fileKey ??
    null
  );
}

function getSpec(product: any) {
  return product?.watchSpecV2 ?? null;
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
          sku: true,
          productImage: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: {
              fileKey: true,
              imageKey: true,
              url: true,
            },
          },
          watchSpecV2: {
            select: {
              referenceNumber: true,
              model: true,
              movementType: true,
              brand: true,
            },
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
              technicalDetailCatalog: {
                select: { id: true, code: true, name: true, area: true },
              },
              serviceCatalog: { select: { id: true, code: true, name: true } },
              SupplyCatalog: { select: { id: true, code: true, name: true } },
              MechanicalPartCatalog: {
                select: { id: true, code: true, name: true },
              },
              Vendor: { select: { id: true, name: true } },
            },
          },
        },
      },

      technicalIssue: {
        where: { executionStatus: { not: "CANCELED" as any } },
        orderBy: [{ openedAt: "desc" }, { createdAt: "desc" }],
        include: {
          technicalDetailCatalog: {
            select: { id: true, code: true, name: true, area: true },
          },
          serviceCatalog: { select: { id: true, code: true, name: true } },
          SupplyCatalog: { select: { id: true, code: true, name: true } },
          MechanicalPartCatalog: {
            select: { id: true, code: true, name: true },
          },
          Vendor: { select: { id: true, name: true } },
        },
      },
    },
  } as any);

  if (!sr) return null;

  const assessment = (sr as any).technicalAssessment ?? null;
  const spec = getSpec((sr as any).product);

  const [technicalSummary, rawIssueBoard]: any = await Promise.all([
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
      technicalDetailCatalogOptions: [],
      catalogs: {},
    })),
  ]);

  const issues = (
    (sr as any).technicalIssue ??
    assessment?.TechnicalIssue ??
    []
  ).map(mapIssue);

  const totalCost = issues.reduce(
    (sum: number, issue: any) => sum + Number(issue.actualCost ?? 0),
    0,
  );
  const technicalDetailCatalogOptions =
    rawIssueBoard.technicalDetailCatalogOptions ??
    rawIssueBoard.catalogs?.technicalDetailCatalogOptions ??
    [];

  const issueBoard = {
    items: rawIssueBoard.items ?? [],
    counts: rawIssueBoard.counts ?? {
      pendingConfirm: 0,
      ready: 0,
      inProgress: 0,
      done: 0,
      readyToCloseSrCount: 0,
    }, technicalDetailCatalogOptions,
    catalogs: {
      ...(rawIssueBoard.catalogs ?? {}),
      technicalDetailCatalogOptions:
        rawIssueBoard.technicalDetailCatalogOptions ??
        rawIssueBoard.catalogs?.technicalDetailCatalogOptions ??
        [],
    },
  };
  console.log("[service-request-detail] rawIssueBoard", {
    topLevelCount: rawIssueBoard.technicalDetailCatalogOptions?.length,
    catalogsCount: rawIssueBoard.catalogs?.technicalDetailCatalogOptions?.length,
  });
  return serialize({
    detail: {
      serviceRequest: {
        id: sr.id,
        refNo: sr.refNo ?? null,
        status: sr.status ?? null,
        scope: sr.scope ?? null,
        priority: (sr as any).priority ?? "NORMAL",
        priorityReason:
          (sr as any).priorityReason ?? (sr as any).priority_reason ?? null,

        productId: sr.productId ?? sr.product?.id ?? null,
        productTitle: sr.modelSnapshot ?? sr.product?.title ?? null,
        skuSnapshot: sr.skuSnapshot ?? sr.product?.sku ?? null,
        primaryImageUrl:
          sr.primaryImageUrlSnapshot ??
          getProductImage(sr.product) ??
          null,

        ref: sr.refSnapshot ?? spec?.referenceNumber ?? null,
        model: sr.modelSnapshot ?? spec?.model ?? null,
        movement: spec?.movementType ?? null,

        technicianNameSnap:
          sr.technicianNameSnap ?? sr.user?.name ?? sr.user?.email ?? null,
        vendorNameSnap: sr.vendorNameSnap ?? sr.vendor?.name ?? null,
        customerItemNote: sr.notes ?? null,
        serviceName: sr.serviceCatalog?.name ?? "Kiểm tra kỹ thuật",
        createdAt: sr.createdAt,
        updatedAt: sr.updatedAt,
      },

      technicalSummary: technicalSummary ?? {
        issueCount: issues.length,
        openIssueCount: issues.filter(
          (x: any) =>
            !["DONE", "COMPLETED"].includes(
              String(x.executionStatus ?? "").toUpperCase(),
            ),
        ).length,
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

      appearanceSummary: {
        score: buildAppearanceScore(assessment),
      },

      financialSummary: {
        totalCost,
      },
    },

    issueBoard,
  });
}