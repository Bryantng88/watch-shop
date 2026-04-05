import { DB, dbOrTx } from "@/server/db/client";
import { Prisma, TechnicalIssueExecutionStatus } from "@prisma/client";

export type TechnicalIssueListFilters = {
    serviceRequestId?: string;
    assessmentId?: string;
    status?: TechnicalIssueExecutionStatus | "ALL";
};

export async function listTechnicalIssues(tx: DB, filters: TechnicalIssueListFilters) {
    const db = dbOrTx(tx);

    const where: Prisma.TechnicalIssueWhereInput = {
        ...(filters.serviceRequestId ? { serviceRequestId: filters.serviceRequestId } : {}),
        ...(filters.assessmentId ? { assessmentId: filters.assessmentId } : {}),
        ...(filters.status && filters.status !== "ALL"
            ? { executionStatus: filters.status }
            : {}),
    };

    return db.technicalIssue.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
            MaintenanceRecord: {
                orderBy: { createdAt: "desc" },
            },
            Vendor: {
                select: { id: true, name: true },
            },
            User: {
                select: { id: true, name: true, email: true },
            },
            ServiceCatalog: {
                select: { id: true, code: true, name: true },
            },
            SupplyCatalog: {
                select: { id: true, code: true, name: true },
            },
            MechanicalPartCatalog: {
                select: { id: true, code: true, name: true },
            },
        },
    });
}

export async function getTechnicalIssueById(tx: DB, id: string) {
    const db = dbOrTx(tx);

    return db.technicalIssue.findUnique({
        where: { id },
        include: {
            ServiceRequest: true,
            MaintenanceRecord: {
                orderBy: { createdAt: "desc" },
            },
            Vendor: {
                select: { id: true, name: true },
            },
            User: {
                select: { id: true, name: true, email: true },
            },
            ServiceCatalog: {
                select: { id: true, code: true, name: true },
            },
            SupplyCatalog: {
                select: { id: true, code: true, name: true },
            },
            MechanicalPartCatalog: {
                select: { id: true, code: true, name: true },
            },
        },
    });
}

export async function createTechnicalIssue(
    tx: DB,
    data: Prisma.TechnicalIssueCreateInput
) {
    const db = dbOrTx(tx);
    return db.technicalIssue.create({
        data,
    });
}

export async function updateTechnicalIssue(
    tx: DB,
    id: string,
    data: Prisma.TechnicalIssueUpdateInput
) {
    const db = dbOrTx(tx);
    return db.technicalIssue.update({
        where: { id },
        data,
    });
}

export async function deleteTechnicalIssue(tx: DB, id: string) {
    const db = dbOrTx(tx);
    return db.technicalIssue.delete({
        where: { id },
    });
}

export async function createMaintenanceRecordForIssue(
    tx: DB,
    data: Prisma.MaintenanceRecordCreateInput
) {
    const db = dbOrTx(tx);
    return db.maintenanceRecord.create({
        data,
    });
}

export async function countOpenIssuesByServiceRequest(tx: DB, serviceRequestId: string) {
    const db = dbOrTx(tx);

    return db.technicalIssue.count({
        where: {
            serviceRequestId,
            executionStatus: {
                in: [
                    TechnicalIssueExecutionStatus.OPEN,
                    TechnicalIssueExecutionStatus.IN_PROGRESS,
                ],
            },
        },
    });
}