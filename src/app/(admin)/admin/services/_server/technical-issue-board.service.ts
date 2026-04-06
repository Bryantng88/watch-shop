import prisma from "@/server/db/client";

function toNumber(v: any) {
    return v != null ? Number(v) : null;
}

function normalizeBoardColumn(issue: {
    executionStatus?: string | null;
    isConfirmed?: boolean | null;
}) {
    const status = String(issue.executionStatus || "").toUpperCase();

    if (status === "DONE" || status === "COMPLETED") return "DONE";
    if (status === "IN_PROGRESS") return "IN_PROGRESS";
    if (status === "OPEN" && issue.isConfirmed) return "READY";
    return "PENDING_CONFIRM";
}

export async function getTechnicalIssueBoardData() {
    const rows = await prisma.technicalIssue.findMany({
        orderBy: [{ openedAt: "desc" }, { createdAt: "desc" }],
        include: {
            ServiceRequest: {
                select: {
                    id: true,
                    refNo: true,
                    status: true,
                    scope: true,
                    technicianNameSnap: true,
                    vendorNameSnap: true,
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
                        },
                    },
                },
            },
            Vendor: {
                select: { id: true, name: true },
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
            TechnicalAssessment: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
    });

    const items = rows.map((x) => ({
        id: x.id,
        summary: x.summary ?? "",
        note: x.note ?? "",
        area: x.area ?? "",
        issueType: x.issueType,
        actionMode: x.actionMode,
        executionStatus: x.executionStatus,
        isConfirmed: (x as any).isConfirmed ?? false,
        confirmedAt: (x as any).confirmedAt ?? null,
        openedAt: x.openedAt,
        startedAt: x.startedAt,
        completedAt: x.completedAt,
        canceledAt: x.canceledAt,
        estimatedCost: toNumber(x.estimatedCost),
        actualCost: toNumber(x.actualCost),
        resolutionNote: x.resolutionNote ?? "",
        vendorId: x.vendorId ?? null,
        vendorNameSnap: x.vendorNameSnap ?? x.Vendor?.name ?? null,
        boardColumn: normalizeBoardColumn({
            executionStatus: x.executionStatus,
            isConfirmed: (x as any).isConfirmed ?? false,
        }),

        serviceRequest: {
            id: x.ServiceRequest.id,
            refNo: x.ServiceRequest.refNo ?? x.ServiceRequest.id,
            status: x.ServiceRequest.status,
            scope: x.ServiceRequest.scope ?? null,
            technicianNameSnap: x.ServiceRequest.technicianNameSnap ?? null,
            vendorNameSnap: x.ServiceRequest.vendorNameSnap ?? null,
            productTitle: x.ServiceRequest.product?.title ?? null,
            primaryImageUrl: x.ServiceRequest.product?.primaryImageUrl ?? null,
            movement: x.ServiceRequest.product?.watchSpec?.movement ?? null,
            model: x.ServiceRequest.product?.watchSpec?.model ?? null,
            ref: x.ServiceRequest.product?.watchSpec?.ref ?? null,
        },

        assessment: x.TechnicalAssessment
            ? {
                id: x.TechnicalAssessment.id,
                status: x.TechnicalAssessment.status,
            }
            : null,

        serviceCatalog: x.ServiceCatalog,
        supplyCatalog: x.SupplyCatalog,
        mechanicalPartCatalog: x.MechanicalPartCatalog,
    }));

    const counts = {
        pendingConfirm: items.filter((x) => x.boardColumn === "PENDING_CONFIRM").length,
        ready: items.filter((x) => x.boardColumn === "READY").length,
        inProgress: items.filter((x) => x.boardColumn === "IN_PROGRESS").length,
        done: items.filter((x) => x.boardColumn === "DONE").length,
    };

    return { items, counts };
}