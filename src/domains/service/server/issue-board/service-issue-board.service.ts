import { prisma } from "@/server/db/client";


function cleanId(v: unknown): string | null {
    const text = String(v ?? "").trim();
    return text || null;
}

function decimalOrNull(v: unknown): number | null {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

async function vendorName(vendorId?: string | null) {
    const id = cleanId(vendorId);
    if (!id) return null;
    const vendor = await prisma.vendor.findUnique({ where: { id }, select: { name: true } });
    return vendor?.name ?? null;
}

export async function createTechnicalIssue(input: {
    assessmentId?: string | null;
    serviceRequestId?: string | null;
    area?: string | null;
    issueType?: string | null;
    actionMode?: string | null;
    note?: string | null;
    estimatedCost?: unknown;
    vendorId?: string | null;
    technicianId?: string | null;
    serviceCatalogId?: string | null;
    supplyCatalogId?: string | null;
    mechanicalPartCatalogId?: string | null;
    summary?: string | null;
}) {
    const serviceRequestId = cleanId(input.serviceRequestId);
    if (!serviceRequestId) throw new Error("Missing serviceRequestId");

    let assessmentId = cleanId(input.assessmentId);

    if (!assessmentId) {
        const existing = await prisma.technicalAssessment.findUnique({
            where: { serviceRequestId },
            select: { id: true },
        });
        assessmentId = existing?.id ?? null;
    }

    if (!assessmentId) {
        const created = await prisma.technicalAssessment.create({
            data: {
                serviceRequestId,
                status: "DRAFT" as any,
            } as any,
            select: { id: true },
        });
        assessmentId = created.id;
    }

    const now = new Date();
    const vendorId = cleanId(input.vendorId);

    return prisma.technicalIssue.create({
        data: {
            assessmentId,
            serviceRequestId,
            area: cleanId(input.area),
            issueType: (cleanId(input.issueType) ?? "CHECK") as any,
            actionMode: (cleanId(input.actionMode) ?? "INTERNAL") as any,
            note: cleanId(input.note),
            summary: cleanId(input.summary),
            estimatedCost: decimalOrNull(input.estimatedCost),
            vendorId,
            vendorNameSnap: await vendorName(vendorId),
            technicianId: cleanId(input.technicianId),
            serviceCatalogId: cleanId(input.serviceCatalogId),
            supplyCatalogId: cleanId(input.supplyCatalogId),
            mechanicalPartCatalogId: cleanId(input.mechanicalPartCatalogId),
            executionStatus: "OPEN" as any,
            openedAt: now,
            updatedAt: now,
        } as any,
    });
}

export async function confirmTechnicalIssue(input: {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    return prisma.technicalIssue.update({
        where: { id },
        data: {
            isConfirmed: true,
            confirmedAt: new Date(),
            confirmedById: cleanId(input.actorId),
            confirmedByNameSnap: cleanId(input.actorName),
            executionStatus: "OPEN" as any,
            updatedAt: new Date(),
        } as any,
    });
}

export async function startTechnicalIssue(input: { id: string; actorName?: string | null }) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    return prisma.technicalIssue.update({
        where: { id },
        data: {
            isConfirmed: true,
            confirmedAt: new Date(),
            executionStatus: "IN_PROGRESS" as any,
            startedAt: new Date(),
            updatedAt: new Date(),
        } as any,
    });
}

export async function completeTechnicalIssue(input: {
    id: string;
    actorName?: string | null;
    actualCost?: unknown;
    resolutionNote?: string | null;
    serviceCatalogId?: string | null;
    supplyCatalogId?: string | null;
    mechanicalPartCatalogId?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    const serviceCatalogId = cleanId(input.serviceCatalogId);
    const supplyCatalogId = cleanId(input.supplyCatalogId);
    const mechanicalPartCatalogId = cleanId(input.mechanicalPartCatalogId);
    const resolutionNote = cleanId(input.resolutionNote);
    const actualCost = decimalOrNull(input.actualCost);

    if (!serviceCatalogId) {
        throw new Error("Vui lòng chọn hạng mục xử lý trước khi hoàn tất issue.");
    }

    if (actualCost == null || actualCost < 0) {
        throw new Error("Vui lòng nhập chi phí thực tế hợp lệ trước khi hoàn tất issue.");
    }

    if (!resolutionNote) {
        throw new Error("Vui lòng nhập kết luận xử lý trước khi hoàn tất issue.");
    }

    return prisma.technicalIssue.update({
        where: { id },
        data: {
            isConfirmed: true,
            executionStatus: "DONE" as any,
            completedAt: new Date(),
            completedByNameSnap: cleanId(input.actorName),
            actualCost,
            resolutionNote,
            serviceCatalogId,
            supplyCatalogId,
            mechanicalPartCatalogId,
            updatedAt: new Date(),
        } as any,
    });
}

export async function cancelTechnicalIssue(
    idInput: string,
    input: { reason?: string | null } = {}
) {
    const id = cleanId(idInput);
    if (!id) throw new Error("Missing issue id");

    return prisma.technicalIssue.update({
        where: { id },
        data: {
            executionStatus: "CANCELED" as any,
            canceledAt: new Date(),
            resolutionNote: cleanId(input.reason),
            updatedAt: new Date(),
        } as any,
    });
}

export async function updateTechnicalIssue(input: {
    id: string;
    note?: string | null;
    summary?: string | null;
    estimatedCost?: unknown;
    actualCost?: unknown;
    resolutionNote?: string | null;
    actionMode?: string | null;
    vendorId?: string | null;
    technicianId?: string | null;
    serviceCatalogId?: string | null;
    supplyCatalogId?: string | null;
    mechanicalPartCatalogId?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    const vendorId = cleanId(input.vendorId);

    return prisma.technicalIssue.update({
        where: { id },
        data: {
            note: input.note === undefined ? undefined : cleanId(input.note),
            summary: input.summary === undefined ? undefined : cleanId(input.summary),
            estimatedCost: input.estimatedCost === undefined ? undefined : decimalOrNull(input.estimatedCost),
            actualCost: input.actualCost === undefined ? undefined : decimalOrNull(input.actualCost),
            resolutionNote: input.resolutionNote === undefined ? undefined : cleanId(input.resolutionNote),
            actionMode: input.actionMode === undefined ? undefined : (cleanId(input.actionMode) as any),
            vendorId: input.vendorId === undefined ? undefined : vendorId,
            vendorNameSnap: input.vendorId === undefined ? undefined : await vendorName(vendorId),
            technicianId: input.technicianId === undefined ? undefined : cleanId(input.technicianId),
            serviceCatalogId: input.serviceCatalogId === undefined ? undefined : cleanId(input.serviceCatalogId),
            supplyCatalogId: input.supplyCatalogId === undefined ? undefined : cleanId(input.supplyCatalogId),
            mechanicalPartCatalogId:
                input.mechanicalPartCatalogId === undefined ? undefined : cleanId(input.mechanicalPartCatalogId),
            updatedAt: new Date(),
        } as any,
    });
}

export async function removeTechnicalIssue(idInput: string) {
    const id = cleanId(idInput);
    if (!id) throw new Error("Missing issue id");
    await prisma.technicalIssue.delete({ where: { id } });
    return { ok: true };
}


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

export async function getTechnicalIssueBoardData(_input: { serviceRequestId?: string | null } = {}) {
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
            serviceCatalog: {
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

                serviceCatalog: x.serviceCatalog
                    ? {
                        id: x.serviceCatalog.id,
                        code: x.serviceCatalog.code ?? null,
                        name: x.serviceCatalog.name ?? null,
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

    const [serviceCatalogs, supplyCatalogs, mechanicalPartCatalogs] = await Promise.all([
        prisma.serviceCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, code: true, name: true, categoryKey: true },
        }),
        prisma.supplyCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, code: true, name: true, category: true },
        }),
        prisma.mechanicalPartCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, code: true, name: true, group: true },
        }),
    ]);

    return {
        items,
        counts,
        conclusionOptions: {
            serviceCatalogs,
            supplyCatalogs,
            mechanicalPartCatalogs,
        },
    };
}





