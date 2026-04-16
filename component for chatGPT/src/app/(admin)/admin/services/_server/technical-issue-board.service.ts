import prisma from "@/server/db/client";

type BoardColumnKey = "PENDING_CONFIRM" | "READY" | "IN_PROGRESS" | "DONE";


function toNumber(v: unknown): number | null {
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function normalizeBoardColumn(issue: {
    executionStatus?: string | null;
    isConfirmed?: boolean | null;
}): BoardColumnKey {
    const status = String(issue.executionStatus || "").toUpperCase();

    if (status === "DONE" || status === "COMPLETED") return "DONE";
    if (status === "IN_PROGRESS") return "IN_PROGRESS";
    if (status === "OPEN" && issue.isConfirmed) return "READY";
    return "PENDING_CONFIRM";
}

function normalizeAssessments(
    raw: unknown
): Array<{
    id: string;
    status: string | null;
    createdAt: Date;
    updatedAt: Date;
    TechnicalIssue?: Array<{
        id: string;
        executionStatus: string | null;
        isConfirmed?: boolean | null;
    }>;
}> {
    if (Array.isArray(raw)) return raw as any[];
    if (raw && typeof raw === "object") return [raw as any];
    return [];
}

function priorityWeight(priority?: string | null) {
    const p = String(priority || "NORMAL").toUpperCase();
    if (p === "URGENT") return 3;
    if (p === "HIGH") return 2;
    return 1;
}

function boardWeight(col: BoardColumnKey) {
    if (col === "IN_PROGRESS") return 4;
    if (col === "READY") return 3;
    if (col === "PENDING_CONFIRM") return 2;
    return 1;
}

export async function getTechnicalIssueBoardData() {
    const rows = await prisma.technicalIssue.findMany({
        where: {
            executionStatus: {
                not: "CANCELED" as any,
            },
        },
        orderBy: [{ openedAt: "desc" }, { createdAt: "desc" as any }],
        include: {
            ServiceRequest: {
                select: {
                    id: true,
                    refNo: true,
                    status: true,
                    scope: true,
                    technicianNameSnap: true,
                    vendorNameSnap: true,
                    priority: true,
                    priorityReason: true,
                    prioritySource: true,
                    priorityMarkedAt: true,
                    technicalAssessment: {
                        select: {
                            id: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true,
                            TechnicalIssue: {
                                where: {
                                    executionStatus: {
                                        not: "CANCELED" as any,
                                    },
                                },
                                select: {
                                    id: true,
                                    executionStatus: true,
                                    isConfirmed: true,
                                } as any,
                            },
                        },
                    },
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
                } as any,
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

    const items = rows
        .map((x) => {
            const sr = x.ServiceRequest;
            if (!sr?.id) return null;

            const assessments = normalizeAssessments(sr.technicalAssessment).sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            const activeAssessment =
                assessments.find(
                    (a) => a.status === "DRAFT" || a.status === "IN_PROGRESS"
                ) ??
                assessments[0] ??
                null;

            const activeIssues = activeAssessment?.TechnicalIssue ?? [];
            const productWatchSpec = (sr.product as any)?.watchSpec ?? null;

            const hasOpenIssue = activeIssues.some((i) => {
                const status = String(i.executionStatus || "").toUpperCase();
                return status === "OPEN" || status === "IN_PROGRESS";
            });

            const serviceRequestReadyToClose =
                activeIssues.length > 0 && !hasOpenIssue;

            const boardColumn = normalizeBoardColumn({
                executionStatus: x.executionStatus,
                isConfirmed: (x as any).isConfirmed ?? false,
            });

            return {
                id: x.id,
                summary: x.summary ?? "",
                note: x.note ?? "",
                area: x.area ?? "",
                issueType: x.issueType ?? null,
                actionMode: x.actionMode ?? null,
                executionStatus: x.executionStatus ?? null,
                isConfirmed: (x as any).isConfirmed ?? false,
                confirmedAt: (x as any).confirmedAt ?? null,
                openedAt: x.openedAt ?? null,
                startedAt: x.startedAt ?? null,
                completedAt: x.completedAt ?? null,
                canceledAt: x.canceledAt ?? null,
                estimatedCost: toNumber(x.estimatedCost),
                actualCost: toNumber(x.actualCost),
                resolutionNote: x.resolutionNote ?? "",
                vendorId: x.vendorId ?? null,
                vendorNameSnap: x.vendorNameSnap ?? x.Vendor?.name ?? null,
                boardColumn,
                serviceRequestReadyToClose,
                isLastDoneIssueOfServiceRequest:
                    serviceRequestReadyToClose &&
                    String(x.executionStatus || "").toUpperCase() === "DONE",

                serviceRequest: {
                    id: sr.id,
                    refNo: sr.refNo ?? sr.id,
                    status: sr.status ?? null,
                    scope: sr.scope ?? null,
                    technicianNameSnap: sr.technicianNameSnap ?? null,
                    vendorNameSnap: sr.vendorNameSnap ?? null,
                    productTitle: sr.product?.title ?? null,
                    primaryImageUrl: sr.product?.primaryImageUrl ?? null,
                    movement: productWatchSpec?.movement ?? null,
                    model: productWatchSpec?.model ?? null,
                    ref: productWatchSpec?.ref ?? null,
                    priority: (sr as any).priority ?? "NORMAL",
                    priorityReason: (sr as any).priorityReason ?? null,
                    prioritySource: (sr as any).prioritySource ?? null,
                    priorityMarkedAt: (sr as any).priorityMarkedAt ?? null,
                },

                assessment: x.TechnicalAssessment
                    ? {
                        id: x.TechnicalAssessment.id,
                        status: x.TechnicalAssessment.status ?? null,
                    }
                    : null,

                serviceCatalog: x.ServiceCatalog
                    ? {
                        id: x.ServiceCatalog.id,
                        code: x.ServiceCatalog.code ?? null,
                        name: x.ServiceCatalog.name ?? null,
                    }
                    : null,

                supplyCatalog: x.SupplyCatalog
                    ? {
                        id: x.SupplyCatalog.id,
                        code: x.SupplyCatalog.code ?? null,
                        name: x.SupplyCatalog.name ?? null,
                    }
                    : null,

                mechanicalPartCatalog: x.MechanicalPartCatalog
                    ? {
                        id: x.MechanicalPartCatalog.id,
                        code: x.MechanicalPartCatalog.code ?? null,
                        name: x.MechanicalPartCatalog.name ?? null,
                    }
                    : null,
            };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x))
        .sort((a, b) => {
            const p = priorityWeight(b.serviceRequest.priority) - priorityWeight(a.serviceRequest.priority);
            if (p !== 0) return p;

            const c = boardWeight(b.boardColumn) - boardWeight(a.boardColumn);
            if (c !== 0) return c;

            return (
                new Date(b.openedAt ?? 0).getTime() -
                new Date(a.openedAt ?? 0).getTime()
            );
        });

    const readyToCloseSrIds = Array.from(
        new Set(
            items
                .filter((x) => x.serviceRequestReadyToClose && x.serviceRequest?.id)
                .map((x) => x.serviceRequest.id)
        )
    );

    const counts = {
        pendingConfirm: items.filter((x) => x.boardColumn === "PENDING_CONFIRM")
            .length,
        ready: items.filter((x) => x.boardColumn === "READY").length,
        inProgress: items.filter((x) => x.boardColumn === "IN_PROGRESS").length,
        done: items.filter((x) => x.boardColumn === "DONE").length,
        readyToCloseSrCount: readyToCloseSrIds.length,
    };

    return { items, counts };
}





