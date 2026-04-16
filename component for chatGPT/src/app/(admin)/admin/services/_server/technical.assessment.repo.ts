import prisma from "@/server/db/client";
import type {
    TechnicalAssessmentStatus,
    TechnicalMovementKind,
} from "@prisma/client";
import { TechnicalIssueExecutionStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type RepoIssueInput = {
    area?: string | null;
    summary?: string | null;
    note?: string | null;
    issueType: "CHECK" | "SERVICE" | "REPAIR" | "REPLACE" | "OBSERVATION";
    actionMode: "NONE" | "INTERNAL" | "VENDOR";
    vendorId?: string | null;
    vendorNameSnap?: string | null;
    technicianId?: string | null;
    serviceCatalogId?: string | null;
    supplyCatalogId?: string | null;
    mechanicalPartCatalogId?: string | null;
    estimatedCost?: number | null;
    sortOrder?: number | null;
};

export async function getPanel(serviceRequestId: string) {
    const sr = await prisma.serviceRequest.findUnique({
        where: { id: serviceRequestId },
        select: {
            id: true,
            refNo: true,
            status: true,
            scope: true,
            notes: true,
            productId: true,
            variantId: true,
            vendorId: true,
            vendorNameSnap: true,
            technicianId: true,
            technicianNameSnap: true,
            skuSnapshot: true,
            primaryImageUrlSnapshot: true,
            createdAt: true,
            updatedAt: true,
            product: {
                select: {
                    id: true,
                    title: true,
                    primaryImageUrl: true,
                    contentStatus: true,
                    watchSpec: {
                        select: {
                            movement: true,
                            model: true,
                            ref: true,
                        },
                    },
                    image: {
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                        take: 8,
                        select: {
                            fileKey: true,
                            role: true,
                        },
                    },
                },
            },
            technicalAssessment: {
                select: {
                    id: true,
                    serviceRequestId: true,
                    movementKind: true,
                    movementStatus: true,
                    caseStatus: true,
                    crystalStatus: true,
                    crownStatus: true,
                    preRate: true,
                    preAmplitude: true,
                    preBeatError: true,
                    postRate: true,
                    postAmplitude: true,
                    postBeatError: true,
                    actionMode: true,
                    vendorId: true,
                    vendorNameSnap: true,
                    conclusion: true,
                    imageFileKey: true,
                    status: true,
                    evaluatedById: true,
                    evaluatedByNameSnap: true,
                    createdAt: true,
                    updatedAt: true,
                    TechnicalIssue: {
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                        include: {
                            Vendor: { select: { id: true, name: true } },
                            User: { select: { id: true, name: true, email: true } },
                            ServiceCatalog: { select: { id: true, code: true, name: true } },
                            SupplyCatalog: { select: { id: true, code: true, name: true } },
                            MechanicalPartCatalog: {
                                select: { id: true, code: true, name: true },
                            },
                            MaintenanceRecord: {
                                orderBy: { createdAt: "desc" },
                                select: {
                                    id: true,
                                    eventType: true,
                                    notes: true,
                                    diagnosis: true,
                                    workSummary: true,
                                    totalCost: true,
                                    servicedAt: true,
                                    createdAt: true,
                                    vendorName: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!sr) return null;

    if (String(sr.product?.contentStatus ?? "").toUpperCase() === "ARCHIVED") {
        throw new Error("Sản phẩm đã hủy/ẩn, không thể mở phiếu kỹ thuật.");
    }

    const [serviceCatalogs, supplyCatalogs, mechanicalPartCatalogs, vendors] =
        await Promise.all([
            prisma.serviceCatalog.findMany({
                where: { isActive: true },
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    code: true,
                    name: true,
                    vendorPrice: true,
                    customerPrice: true,
                    internalCost: true,
                    note: true,
                },
            }),
            prisma.supplyCatalog.findMany({
                where: { isActive: true },
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    code: true,
                    name: true,
                    category: true,
                    unit: true,
                    defaultCost: true,
                    note: true,
                },
            }),
            prisma.mechanicalPartCatalog.findMany({
                where: { isActive: true },
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    code: true,
                    name: true,
                    group: true,
                    defaultCost: true,
                    note: true,
                },
            }),
            prisma.vendor.findMany({
                orderBy: { name: "asc" },
                select: { id: true, name: true },
            }),
        ]);

    return {
        serviceRequest: {
            id: sr.id,
            refNo: sr.refNo ?? null,
            status: sr.status,
            scope: sr.scope ?? null,
            notes: sr.notes ?? null,
            productId: sr.productId ?? null,
            variantId: sr.variantId ?? null,
            vendorId: sr.vendorId ?? null,
            vendorNameSnap: sr.vendorNameSnap ?? null,
            technicianId: sr.technicianId ?? null,
            technicianNameSnap: sr.technicianNameSnap ?? null,
            skuSnapshot: sr.skuSnapshot ?? null,
            productTitle: sr.product?.title ?? null,
            movement: sr.product?.watchSpec?.movement ?? null,
            model: sr.product?.watchSpec?.model ?? null,
            ref: sr.product?.watchSpec?.ref ?? null,
            primaryImageUrl:
                sr.primaryImageUrlSnapshot ?? sr.product?.primaryImageUrl ?? null,
            productImages: sr.product?.image ?? [],
            createdAt: sr.createdAt,
            updatedAt: sr.updatedAt,
        },

        assessment: sr.technicalAssessment
            ? {
                id: sr.technicalAssessment.id,
                serviceRequestId: sr.technicalAssessment.serviceRequestId,
                movementKind: sr.technicalAssessment.movementKind,
                movementStatus: sr.technicalAssessment.movementStatus,
                caseStatus: sr.technicalAssessment.caseStatus,
                crystalStatus: sr.technicalAssessment.crystalStatus,
                crownStatus: sr.technicalAssessment.crownStatus,
                preRate: sr.technicalAssessment.preRate,
                preAmplitude: sr.technicalAssessment.preAmplitude,
                preBeatError:
                    sr.technicalAssessment.preBeatError != null
                        ? Number(sr.technicalAssessment.preBeatError)
                        : null,
                postRate: sr.technicalAssessment.postRate,
                postAmplitude: sr.technicalAssessment.postAmplitude,
                postBeatError:
                    sr.technicalAssessment.postBeatError != null
                        ? Number(sr.technicalAssessment.postBeatError)
                        : null,
                actionMode: sr.technicalAssessment.actionMode,
                vendorId: sr.technicalAssessment.vendorId ?? null,
                vendorNameSnap: sr.technicalAssessment.vendorNameSnap ?? null,
                conclusion: sr.technicalAssessment.conclusion ?? "",
                imageFileKey: sr.technicalAssessment.imageFileKey ?? null,
                status: sr.technicalAssessment.status,
                evaluatedById: sr.technicalAssessment.evaluatedById ?? null,
                evaluatedByNameSnap:
                    sr.technicalAssessment.evaluatedByNameSnap ?? null,
                createdAt: sr.technicalAssessment.createdAt,
                updatedAt: sr.technicalAssessment.updatedAt,
                issues: sr.technicalAssessment.TechnicalIssue.map((x) => ({
                    id: x.id,
                    area: x.area ?? null,
                    summary: x.summary ?? null,
                    note: x.note ?? null,
                    issueType: x.issueType,
                    actionMode: x.actionMode,
                    executionStatus: x.executionStatus,
                    estimatedCost:
                        x.estimatedCost != null ? Number(x.estimatedCost) : null,
                    actualCost:
                        x.actualCost != null ? Number(x.actualCost) : null,
                    resolutionNote: x.resolutionNote ?? null,
                    vendorId: x.vendorId ?? null,
                    vendorNameSnap: x.vendorNameSnap ?? null,
                    technicianId: x.technicianId ?? null,
                    serviceCatalogId: x.serviceCatalogId ?? null,
                    supplyCatalogId: x.supplyCatalogId ?? null,
                    mechanicalPartCatalogId: x.mechanicalPartCatalogId ?? null,
                    sortOrder: x.sortOrder ?? 0,
                    openedAt: x.openedAt,
                    startedAt: x.startedAt,
                    completedAt: x.completedAt,
                    canceledAt: x.canceledAt,
                    isConfirmed: (x as any).isConfirmed ?? false,
                    confirmedAt: (x as any).confirmedAt ?? null,
                    confirmedById: (x as any).confirmedById ?? null,
                    confirmedByNameSnap: (x as any).confirmedByNameSnap ?? null,
                    Vendor: x.Vendor,
                    User: x.User,
                    ServiceCatalog: x.ServiceCatalog,
                    SupplyCatalog: x.SupplyCatalog,
                    MechanicalPartCatalog: x.MechanicalPartCatalog,
                    MaintenanceRecord: x.MaintenanceRecord.map((r) => ({
                        ...r,
                        totalCost: r.totalCost != null ? Number(r.totalCost) : null,
                    })),
                })),
            }
            : null,

        catalogs: {
            serviceCatalogs: serviceCatalogs.map((x) => ({
                ...x,
                vendorPrice: x.vendorPrice != null ? Number(x.vendorPrice) : null,
                customerPrice:
                    x.customerPrice != null ? Number(x.customerPrice) : null,
                internalCost:
                    x.internalCost != null ? Number(x.internalCost) : null,
            })),
            supplyCatalogs: supplyCatalogs.map((x) => ({
                ...x,
                defaultCost: x.defaultCost != null ? Number(x.defaultCost) : null,
            })),
            mechanicalPartCatalogs: mechanicalPartCatalogs.map((x) => ({
                ...x,
                defaultCost: x.defaultCost != null ? Number(x.defaultCost) : null,
            })),
            vendors,
        },
    };
}

export async function listServiceMaintenanceRecords(
    tx: Prisma.TransactionClient | typeof prisma,
    serviceRequestId: string
) {
    const db = tx;
    const rows = await db.maintenanceRecord.findMany({
        where: { serviceRequestId },
        orderBy: [{ createdAt: "desc" }],
        include: {
            TechnicalIssue: {
                select: {
                    id: true,
                    area: true,
                    summary: true,
                    note: true,
                },
            },
            ServiceCatalog: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
            User: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            vendor: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return rows.map((x) => ({
        ...x,
        totalCost: x.totalCost != null ? Number(x.totalCost) : null,
        revenueAmount: x.revenueAmount != null ? Number(x.revenueAmount) : null,
        paidAmount: x.paidAmount != null ? Number(x.paidAmount) : null,
    }));
}

export async function upsertAssessment(
    tx: Prisma.TransactionClient,
    input: {
        serviceRequestId: string;
        movementKind: TechnicalMovementKind;
        movementStatus: "GOOD" | "ISSUE";
        caseStatus: "GOOD" | "ISSUE";
        crystalStatus: "GOOD" | "ISSUE";
        crownStatus: "GOOD" | "ISSUE";
        preRate?: number | null;
        preAmplitude?: number | null;
        preBeatError?: number | null;
        postRate?: number | null;
        postAmplitude?: number | null;
        postBeatError?: number | null;
        actionMode: "NONE" | "INTERNAL" | "VENDOR";
        vendorId?: string | null;
        vendorNameSnap?: string | null;
        conclusion?: string | null;
        imageFileKey?: string | null;
        status?: TechnicalAssessmentStatus;
        evaluatedById?: string | null;
        evaluatedByNameSnap?: string | null;
    }
) {
    return tx.technicalAssessment.upsert({
        where: { serviceRequestId: input.serviceRequestId },
        create: {
            serviceRequestId: input.serviceRequestId,
            movementKind: input.movementKind,
            movementStatus: input.movementStatus as any,
            caseStatus: input.caseStatus as any,
            crystalStatus: input.crystalStatus as any,
            crownStatus: input.crownStatus as any,
            preRate: input.preRate ?? null,
            preAmplitude: input.preAmplitude ?? null,
            preBeatError:
                input.preBeatError != null
                    ? new Prisma.Decimal(String(input.preBeatError))
                    : null,
            postRate: input.postRate ?? null,
            postAmplitude: input.postAmplitude ?? null,
            postBeatError:
                input.postBeatError != null
                    ? new Prisma.Decimal(String(input.postBeatError))
                    : null,
            actionMode: input.actionMode as any,
            vendorId: input.vendorId ?? null,
            vendorNameSnap: input.vendorNameSnap ?? null,
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            status: input.status ?? "DRAFT",
            evaluatedById: input.evaluatedById ?? null,
            evaluatedByNameSnap: input.evaluatedByNameSnap ?? null,
        },
        update: {
            movementKind: input.movementKind,
            movementStatus: input.movementStatus as any,
            caseStatus: input.caseStatus as any,
            crystalStatus: input.crystalStatus as any,
            crownStatus: input.crownStatus as any,
            preRate: input.preRate ?? null,
            preAmplitude: input.preAmplitude ?? null,
            preBeatError:
                input.preBeatError != null
                    ? new Prisma.Decimal(String(input.preBeatError))
                    : null,
            postRate: input.postRate ?? null,
            postAmplitude: input.postAmplitude ?? null,
            postBeatError:
                input.postBeatError != null
                    ? new Prisma.Decimal(String(input.postBeatError))
                    : null,
            actionMode: input.actionMode as any,
            vendorId: input.vendorId ?? null,
            vendorNameSnap: input.vendorNameSnap ?? null,
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            status: input.status ?? "DRAFT",
            evaluatedById: input.evaluatedById ?? null,
            evaluatedByNameSnap: input.evaluatedByNameSnap ?? null,
            updatedAt: new Date(),
        },
    });
}
export async function listAssessmentIssuesForSync(
    tx: Prisma.TransactionClient,
    assessmentId: string
) {
    return tx.technicalIssue.findMany({
        where: { assessmentId },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
            id: true,
            area: true,
            summary: true,
            note: true,
            issueType: true,
            actionMode: true,
            executionStatus: true,
            vendorId: true,
            vendorNameSnap: true,
            serviceCatalogId: true,
            supplyCatalogId: true,
            mechanicalPartCatalogId: true,
            estimatedCost: true,
            sortOrder: true,
            isConfirmed: true,
        } as any,
    });
}

export async function createAssessmentIssue(
    tx: Prisma.TransactionClient,
    data: Prisma.TechnicalIssueUncheckedCreateInput
) {
    return tx.technicalIssue.create({ data });
}

export async function updateAssessmentIssue(
    tx: Prisma.TransactionClient,
    id: string,
    data: Prisma.TechnicalIssueUncheckedUpdateInput
) {
    return tx.technicalIssue.update({
        where: { id },
        data,
    });
}

export async function countAssessmentIssues(
    tx: Prisma.TransactionClient,
    assessmentId: string
) {
    return tx.technicalIssue.count({
        where: { assessmentId },
    });
}

export async function getTechnicalSummaryByServiceRequest(serviceRequestId: string) {
    const assessment = await prisma.technicalAssessment.findUnique({
        where: { serviceRequestId },
        select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            TechnicalIssue: {
                select: {
                    id: true,
                    executionStatus: true,
                    isConfirmed: true,
                } as any,
            },
        },
    });

    if (!assessment) {
        return {
            assessmentCount: 0,
            issueCount: 0,
            openIssueCount: 0,
            activeAssessment: null,
        };
    }

    const confirmedIssues = assessment.TechnicalIssue?.filter((x: any) => x.isConfirmed) ?? [];
    const openConfirmedIssues = confirmedIssues.filter(
        (x: any) =>
            x.executionStatus === TechnicalIssueExecutionStatus.OPEN ||
            x.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS
    );

    const activeAssessment =
        assessment.status === "DRAFT" || assessment.status === "IN_PROGRESS"
            ? {
                id: assessment.id,
                status: assessment.status,
                issueCount: confirmedIssues.length,
                updatedAt: assessment.updatedAt,
            }
            : null;

    return {
        assessmentCount: 1,
        issueCount: confirmedIssues.length,
        openIssueCount: openConfirmedIssues.length,
        activeAssessment,
    };
}


export async function findServiceRequestStatusById(serviceRequestId: string) {
    return prisma.serviceRequest.findUnique({
        where: { id: serviceRequestId },
        select: {
            id: true,
            status: true,
        },
    });
}