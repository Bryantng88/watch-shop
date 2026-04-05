import prisma from "@/server/db/client";
import * as repo from "./technical.assessment.repo";
import {
    ServiceRequestStatus,
    TechnicalAssessmentStatus,
} from "@prisma/client";

function toNumberOrNull(v: any) {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

export async function getTechnicalAssessmentPanel(serviceRequestId: string) {
    const panel = await repo.getPanel(serviceRequestId);
    if (!panel) throw new Error("Không tìm thấy service request");

    const maintenanceRecords = await repo.listServiceMaintenanceRecords(
        prisma,
        serviceRequestId
    );

    return {
        serviceRequest: panel.serviceRequest,
        assessment: panel.assessment,
        technicalIssues: panel.assessment?.issues ?? [],
        maintenanceRecords,
        catalogs: panel.catalogs,
        stats: {
            issueCount: panel.assessment?.issues?.length ?? 0,
            openIssueCount:
                panel.assessment?.issues?.filter(
                    (x: any) =>
                        x.executionStatus === "OPEN" ||
                        x.executionStatus === "IN_PROGRESS"
                ).length ?? 0,
            maintenanceCount: maintenanceRecords.length,
        },
    };
}

export async function getTechnicalAssessmentWorkbench(assessmentId: string) {
    const assessment = await prisma.technicalAssessment.findUnique({
        where: { id: assessmentId },
        include: {
            ServiceRequest: {
                select: {
                    id: true,
                    refNo: true,
                    status: true,
                    scope: true,
                    notes: true,
                    skuSnapshot: true,
                    vendorNameSnap: true,
                    technicianNameSnap: true,
                    primaryImageUrlSnapshot: true,
                    createdAt: true,
                    updatedAt: true,
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
                },
            },
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
    });

    if (!assessment) {
        throw new Error("Không tìm thấy phiếu kỹ thuật");
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

    const sr = assessment.ServiceRequest;

    return {
        serviceRequest: {
            id: sr.id,
            refNo: sr.refNo ?? null,
            status: sr.status,
            scope: sr.scope ?? null,
            notes: sr.notes ?? null,
            skuSnapshot: sr.skuSnapshot ?? null,
            productTitle: sr.product?.title ?? null,
            movement: sr.product?.watchSpec?.movement ?? null,
            model: sr.product?.watchSpec?.model ?? null,
            ref: sr.product?.watchSpec?.ref ?? null,
            vendorNameSnap: sr.vendorNameSnap ?? null,
            technicianNameSnap: sr.technicianNameSnap ?? null,
            primaryImageUrl:
                sr.primaryImageUrlSnapshot ?? sr.product?.primaryImageUrl ?? null,
            productImages: sr.product?.image ?? [],
            createdAt: sr.createdAt,
            updatedAt: sr.updatedAt,
        },
        assessment: {
            id: assessment.id,
            serviceRequestId: assessment.serviceRequestId,
            movementKind: assessment.movementKind,
            movementStatus: assessment.movementStatus,
            caseStatus: assessment.caseStatus,
            crystalStatus: assessment.crystalStatus,
            crownStatus: assessment.crownStatus,
            preRate: assessment.preRate,
            preAmplitude: assessment.preAmplitude,
            preBeatError:
                assessment.preBeatError != null
                    ? Number(assessment.preBeatError)
                    : null,
            postRate: assessment.postRate,
            postAmplitude: assessment.postAmplitude,
            postBeatError:
                assessment.postBeatError != null
                    ? Number(assessment.postBeatError)
                    : null,
            actionMode: assessment.actionMode,
            vendorId: assessment.vendorId ?? null,
            vendorNameSnap: assessment.vendorNameSnap ?? null,
            conclusion: assessment.conclusion ?? "",
            imageFileKey: assessment.imageFileKey ?? null,
            status: assessment.status,
            evaluatedById: assessment.evaluatedById ?? null,
            evaluatedByNameSnap: assessment.evaluatedByNameSnap ?? null,
            createdAt: assessment.createdAt,
            updatedAt: assessment.updatedAt,
        },
        technicalIssues: assessment.TechnicalIssue.map((x) => ({
            id: x.id,
            area: x.area ?? null,
            summary: x.summary ?? null,
            note: x.note ?? null,
            issueType: x.issueType,
            actionMode: x.actionMode,
            executionStatus: x.executionStatus,
            estimatedCost: x.estimatedCost != null ? Number(x.estimatedCost) : null,
            actualCost: x.actualCost != null ? Number(x.actualCost) : null,
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
        catalogs: {
            serviceCatalogs: serviceCatalogs.map((x) => ({
                ...x,
                vendorPrice: x.vendorPrice != null ? Number(x.vendorPrice) : null,
                customerPrice: x.customerPrice != null ? Number(x.customerPrice) : null,
                internalCost: x.internalCost != null ? Number(x.internalCost) : null,
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
        stats: {
            issueCount: assessment.TechnicalIssue.length,
            openIssueCount: assessment.TechnicalIssue.filter(
                (x) =>
                    x.executionStatus === "OPEN" || x.executionStatus === "IN_PROGRESS"
            ).length,
            maintenanceCount: assessment.TechnicalIssue.reduce(
                (sum, x) => sum + x.MaintenanceRecord.length,
                0
            ),
        },
    };
}

export async function openTechnicalAssessment(serviceRequestId: string) {
    return prisma.$transaction(async (tx) => {
        const existing = await tx.technicalAssessment.findFirst({
            where: {
                serviceRequestId,
                status: {
                    in: ["DRAFT", "IN_PROGRESS"],
                },
            },
            orderBy: { createdAt: "desc" },
        });

        if (existing) return existing;

        const lastCompleted = await tx.technicalAssessment.findFirst({
            where: {
                serviceRequestId,
                status: "COMPLETED",
            },
            orderBy: { createdAt: "desc" },
        });

        const created = await tx.technicalAssessment.create({
            data: {
                serviceRequestId,
                status: "DRAFT",
            },
        });

        if (lastCompleted) {
            await tx.serviceRequest.update({
                where: { id: serviceRequestId },
                data: { status: ServiceRequestStatus.IN_PROGRESS },
            });
        }

        return created;
    });
}

export async function saveTechnicalAssessment(input: any) {
    const id = String(input?.serviceRequestId || "").trim();
    if (!id) throw new Error("Missing serviceRequestId");

    return prisma.$transaction(async (tx) => {
        const sr = await tx.serviceRequest.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!sr) throw new Error("Service request not found");

        const assessment = await repo.upsertAssessment(tx, {
            serviceRequestId: id,
            movementKind: input.movementKind,
            movementStatus: input.movementStatus,
            caseStatus: input.caseStatus,
            crystalStatus: input.crystalStatus,
            crownStatus: input.crownStatus,
            preRate: toNumberOrNull(input.preRate),
            preAmplitude: toNumberOrNull(input.preAmplitude),
            preBeatError: toNumberOrNull(input.preBeatError),
            postRate: toNumberOrNull(input.postRate),
            postAmplitude: toNumberOrNull(input.postAmplitude),
            postBeatError: toNumberOrNull(input.postBeatError),
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            status: "IN_PROGRESS",
        });

        await tx.serviceRequest.update({
            where: { id },
            data: {
                status: ServiceRequestStatus.IN_PROGRESS,
            },
        });

        return assessment;
    });
}

export async function completeTechnicalAssessment(assessmentId: string) {
    return prisma.$transaction(async (tx) => {
        const a = await tx.technicalAssessment.findUnique({
            where: { id: assessmentId },
            include: { TechnicalIssue: true },
        });

        if (!a) throw new Error("Assessment not found");

        const hasOpen = a.TechnicalIssue.some(
            (x) =>
                x.executionStatus === "OPEN" ||
                x.executionStatus === "IN_PROGRESS"
        );

        if (hasOpen) {
            throw new Error("Còn issue chưa hoàn tất");
        }

        await tx.technicalAssessment.update({
            where: { id: assessmentId },
            data: { status: TechnicalAssessmentStatus.COMPLETED },
        });

        await tx.serviceRequest.update({
            where: { id: a.serviceRequestId },
            data: { status: ServiceRequestStatus.COMPLETED },
        });

        return { ok: true };
    });
}