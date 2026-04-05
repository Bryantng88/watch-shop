import { prisma } from "@/server/db/client";
import {
    MaintenanceEventType,
    ServiceRequestStatus,
    TechnicalActionMode,
    TechnicalIssueExecutionStatus,
    TechnicalIssueType,
} from "@prisma/client";
import * as repo from "./technical-issues.repo";

function normalizeActionMode(v?: string | null) {
    return String(v ?? "").toUpperCase() === "VENDOR"
        ? TechnicalActionMode.VENDOR
        : TechnicalActionMode.INTERNAL;
}

async function ensureServiceRequestActive(
    tx: typeof prisma,
    serviceRequestId: string
) {
    const sr = await tx.serviceRequest.findUnique({
        where: { id: serviceRequestId },
        select: {
            id: true,
            productId: true,
        },
    });

    if (!sr) {
        throw new Error("Không tìm thấy service request.");
    }

    if (sr.productId) {
        const product = await tx.product.findUnique({
            where: { id: sr.productId },
            select: {
                contentStatus: true,
            },
        });

        if (String(product?.contentStatus ?? "").toUpperCase() === "ARCHIVED") {
            throw new Error("Sản phẩm đã hủy/ẩn, không thể tiếp tục quy trình service.");
        }
    }

    return sr;
}

async function syncServiceRequestStatus(
    tx: typeof prisma,
    serviceRequestId: string
) {
    const openCount = await repo.countOpenIssuesByServiceRequest(
        tx as any,
        serviceRequestId
    );

    await tx.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
            status:
                openCount > 0
                    ? ServiceRequestStatus.IN_PROGRESS
                    : ServiceRequestStatus.COMPLETED,
        },
    });
}

export async function getTechnicalIssues(serviceRequestId: string) {
    return repo.listTechnicalIssues(prisma as any, {
        serviceRequestId,
        status: "ALL",
    });
}

export async function createTechnicalIssue(input: {
    assessmentId: string;
    serviceRequestId: string;
    area: string;
    issueType?: TechnicalIssueType;
    actionMode?: string | null;
    note?: string | null;
    estimatedCost?: number | null;
    vendorId?: string | null;
    technicianId?: string | null;
    serviceCatalogId?: string | null;
    supplyCatalogId?: string | null;
    mechanicalPartCatalogId?: string | null;
    summary?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        await ensureServiceRequestActive(tx as any, input.serviceRequestId);

        const vendor = input.vendorId
            ? await tx.vendor.findUnique({
                where: { id: input.vendorId },
                select: { id: true, name: true },
            })
            : null;

        const issue = await repo.createTechnicalIssue(tx as any, {
            TechnicalAssessment: { connect: { id: input.assessmentId } },
            ServiceRequest: { connect: { id: input.serviceRequestId } },
            area: input.area,
            issueType: input.issueType ?? TechnicalIssueType.REPAIR,
            actionMode: normalizeActionMode(input.actionMode),
            note: input.note ?? null,
            estimatedCost: input.estimatedCost ?? null,
            summary: input.summary ?? null,
            executionStatus: TechnicalIssueExecutionStatus.OPEN,
            openedAt: new Date(),

            ...(input.vendorId
                ? {
                    Vendor: { connect: { id: input.vendorId } },
                    vendorNameSnap: vendor?.name ?? null,
                }
                : {
                    vendorNameSnap: null,
                }),

            ...(input.technicianId
                ? {
                    User: { connect: { id: input.technicianId } },
                }
                : {}),

            ...(input.serviceCatalogId
                ? { ServiceCatalog: { connect: { id: input.serviceCatalogId } } }
                : {}),

            ...(input.supplyCatalogId
                ? { SupplyCatalog: { connect: { id: input.supplyCatalogId } } }
                : {}),

            ...(input.mechanicalPartCatalogId
                ? {
                    MechanicalPartCatalog: {
                        connect: { id: input.mechanicalPartCatalogId },
                    },
                }
                : {}),
        });

        await syncServiceRequestStatus(tx as any, input.serviceRequestId);
        return issue;
    });
}

export async function updateTechnicalIssue(input: {
    id: string;
    note?: string | null;
    summary?: string | null;
    estimatedCost?: number | null;
    actualCost?: number | null;
    resolutionNote?: string | null;
    actionMode?: string | null;
    vendorId?: string | null;
    technicianId?: string | null;
    serviceCatalogId?: string | null;
    supplyCatalogId?: string | null;
    mechanicalPartCatalogId?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        const current = await repo.getTechnicalIssueById(tx as any, input.id);

        if (!current) {
            throw new Error("Không tìm thấy technical issue.");
        }

        await ensureServiceRequestActive(tx as any, current.serviceRequestId);

        const vendor =
            input.vendorId
                ? await tx.vendor.findUnique({
                    where: { id: input.vendorId },
                    select: { id: true, name: true },
                })
                : input.vendorId === null
                    ? null
                    : undefined;

        return repo.updateTechnicalIssue(tx as any, input.id, {
            ...(input.note !== undefined ? { note: input.note } : {}),
            ...(input.summary !== undefined ? { summary: input.summary } : {}),
            ...(input.estimatedCost !== undefined
                ? { estimatedCost: input.estimatedCost }
                : {}),
            ...(input.actualCost !== undefined ? { actualCost: input.actualCost } : {}),
            ...(input.resolutionNote !== undefined
                ? { resolutionNote: input.resolutionNote }
                : {}),
            ...(input.actionMode !== undefined
                ? { actionMode: normalizeActionMode(input.actionMode) }
                : {}),

            ...(input.vendorId !== undefined
                ? input.vendorId
                    ? {
                        Vendor: { connect: { id: input.vendorId } },
                        vendorNameSnap:
                            vendor === undefined ? current.vendorNameSnap : vendor?.name ?? null,
                    }
                    : {
                        Vendor: { disconnect: true },
                        vendorNameSnap: null,
                    }
                : {}),

            ...(input.technicianId !== undefined
                ? input.technicianId
                    ? {
                        User: { connect: { id: input.technicianId } },
                    }
                    : {
                        User: { disconnect: true },
                    }
                : {}),

            ...(input.serviceCatalogId !== undefined
                ? input.serviceCatalogId
                    ? { ServiceCatalog: { connect: { id: input.serviceCatalogId } } }
                    : { ServiceCatalog: { disconnect: true } }
                : {}),

            ...(input.supplyCatalogId !== undefined
                ? input.supplyCatalogId
                    ? { SupplyCatalog: { connect: { id: input.supplyCatalogId } } }
                    : { SupplyCatalog: { disconnect: true } }
                : {}),

            ...(input.mechanicalPartCatalogId !== undefined
                ? input.mechanicalPartCatalogId
                    ? {
                        MechanicalPartCatalog: {
                            connect: { id: input.mechanicalPartCatalogId },
                        },
                    }
                    : { MechanicalPartCatalog: { disconnect: true } }
                : {}),
        });
    });
}

export async function startTechnicalIssue(input: {
    id: string;
    actorName?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        const current = await repo.getTechnicalIssueById(tx as any, input.id);

        if (!current) {
            throw new Error("Không tìm thấy technical issue.");
        }

        await ensureServiceRequestActive(tx as any, current.serviceRequestId);

        const issue = await repo.updateTechnicalIssue(tx as any, input.id, {
            executionStatus: TechnicalIssueExecutionStatus.IN_PROGRESS,
            startedAt: new Date(),
            canceledAt: null,
        });

        await repo.createMaintenanceRecordForIssue(tx as any, {
            serviceRequest: { connect: { id: current.serviceRequestId } },
            TechnicalIssue: { connect: { id: current.id } },
            eventType: MaintenanceEventType.NOTE,
            notes: `Bắt đầu xử lý issue ${current.area}${current.note ? `: ${current.note}` : ""}`,
            technicianNameSnap: input.actorName ?? null,
            servicedAt: new Date(),
        });

        await syncServiceRequestStatus(tx as any, current.serviceRequestId);
        return issue;
    });
}

export async function completeTechnicalIssue(input: {
    id: string;
    actorName?: string | null;
    actualCost?: number | null;
    resolutionNote?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        const current = await repo.getTechnicalIssueById(tx as any, input.id);

        if (!current) {
            throw new Error("Không tìm thấy technical issue.");
        }

        await ensureServiceRequestActive(tx as any, current.serviceRequestId);

        const issue = await repo.updateTechnicalIssue(tx as any, input.id, {
            executionStatus: TechnicalIssueExecutionStatus.DONE,
            completedAt: new Date(),
            actualCost: input.actualCost ?? current.actualCost ?? null,
            resolutionNote: input.resolutionNote ?? current.resolutionNote ?? null,
        });

        await repo.createMaintenanceRecordForIssue(tx as any, {
            serviceRequest: { connect: { id: current.serviceRequestId } },
            TechnicalIssue: { connect: { id: current.id } },
            eventType:
                input.actualCost != null
                    ? MaintenanceEventType.COST
                    : MaintenanceEventType.NOTE,
            notes: input.resolutionNote ?? `Hoàn tất issue ${current.area}`,
            technicianNameSnap: input.actorName ?? null,
            totalCost: input.actualCost ?? current.actualCost ?? null,
            servicedAt: new Date(),
        });

        await syncServiceRequestStatus(tx as any, current.serviceRequestId);
        return issue;
    });
}

export async function cancelTechnicalIssue(input: {
    id: string;
    actorName?: string | null;
    reason?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        const current = await repo.getTechnicalIssueById(tx as any, input.id);

        if (!current) {
            throw new Error("Không tìm thấy technical issue.");
        }

        await ensureServiceRequestActive(tx as any, current.serviceRequestId);

        const issue = await repo.updateTechnicalIssue(tx as any, input.id, {
            executionStatus: TechnicalIssueExecutionStatus.CANCELED,
            canceledAt: new Date(),
            resolutionNote: input.reason ?? current.resolutionNote ?? null,
        });

        await repo.createMaintenanceRecordForIssue(tx as any, {
            serviceRequest: { connect: { id: current.serviceRequestId } },
            TechnicalIssue: { connect: { id: current.id } },
            eventType: MaintenanceEventType.NOTE,
            notes: input.reason ?? `Hủy issue ${current.area}`,
            technicianNameSnap: input.actorName ?? null,
            servicedAt: new Date(),
        });

        await syncServiceRequestStatus(tx as any, current.serviceRequestId);
        return issue;
    });
}

export async function addTechnicalIssueRecord(input: {
    id: string;
    actorName?: string | null;
    notes?: string | null;
    diagnosis?: string | null;
    workSummary?: string | null;
    totalCost?: number | null;
    servicedAt?: string | null;
    serviceCatalogId?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        const current = await repo.getTechnicalIssueById(tx as any, input.id);

        if (!current) {
            throw new Error("Không tìm thấy technical issue.");
        }

        await ensureServiceRequestActive(tx as any, current.serviceRequestId);

        return repo.createMaintenanceRecordForIssue(tx as any, {
            serviceRequest: { connect: { id: current.serviceRequestId } },
            TechnicalIssue: { connect: { id: current.id } },
            eventType:
                input.totalCost != null
                    ? MaintenanceEventType.COST
                    : MaintenanceEventType.NOTE,
            notes: input.notes ?? null,
            diagnosis: input.diagnosis ?? null,
            workSummary: input.workSummary ?? null,
            totalCost: input.totalCost ?? null,
            technicianNameSnap: input.actorName ?? null,
            servicedAt: input.servicedAt ? new Date(input.servicedAt) : new Date(),
            ...(input.serviceCatalogId
                ? { ServiceCatalog: { connect: { id: input.serviceCatalogId } } }
                : {}),
        });
    });
}

export async function removeTechnicalIssue(id: string) {
    return prisma.$transaction(async (tx) => {
        const current = await repo.getTechnicalIssueById(tx as any, id);

        if (!current) {
            throw new Error("Không tìm thấy technical issue.");
        }

        await repo.deleteTechnicalIssue(tx as any, id);
        await syncServiceRequestStatus(tx as any, current.serviceRequestId);

        return { ok: true };
    });
}
