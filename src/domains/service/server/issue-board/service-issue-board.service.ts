import { prisma } from "@/server/db/client";
import { ensureTechnicalIssuePaymentTx } from "@/domains/payment/server/payment.service";
import { syncTechnicalIssueToTasks } from "@/domains/task/server/task-technical-issue-sync.service";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import {
    deriveServiceRequestStatusFromTechnicalIssues,
    getTechnicalIssueBoardColumn,
    isTechnicalIssueDone,
} from "@/domains/service/server/shared/service-request.rules";

function cleanId(v: unknown): string | null {
    const text = String(v ?? "").trim();
    return text || null;
}

function cleanText(v: unknown): string | null {
    const text = String(v ?? "").trim();
    return text || null;
}

function decimalOrNull(v: unknown): number | null {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

async function recordTechnicalIssueEvent(input: {
    eventKey: string;
    technicalIssueId: string;
    serviceRequestId?: string | null;
    actorUserId?: string | null;
    payload?: Record<string, unknown>;
}) {
    await recordBusinessEvent(prisma, {
        eventKey: input.eventKey,
        targetType: "TECHNICAL_ISSUE",
        targetId: input.technicalIssueId,
        actorUserId: input.actorUserId ?? null,
        targetAliasIds: [cleanId(input.serviceRequestId)].filter(Boolean) as string[],
        payload: {
            ...(input.payload ?? {}),
            serviceRequestId: cleanId(input.serviceRequestId),
            sourceId: `${input.technicalIssueId}:${input.eventKey}`,
        },
    });
}

async function vendorName(vendorId?: string | null) {
    const id = cleanId(vendorId);
    if (!id) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { id },
        select: { name: true },
    });

    return vendor?.name ?? null;
}

async function syncServiceRequestStatusFromIssues(client: any, serviceRequestId?: string | null) {
    const srId = cleanId(serviceRequestId);
    if (!srId) return;

    const [serviceRequest, issues] = await Promise.all([
        client.serviceRequest.findUnique({
            where: { id: srId },
            select: { status: true, productId: true },
        }),
        client.technicalIssue.findMany({
            where: { serviceRequestId: srId },
            select: {
                id: true,
                executionStatus: true,
            },
        }),
    ]);

    if (!serviceRequest) return;

    const nextStatus = deriveServiceRequestStatusFromTechnicalIssues(
        serviceRequest.status,
        issues,
    );

    await client.serviceRequest.update({
        where: { id: srId },
        data: {
            status: nextStatus,
            updatedAt: new Date(),
        } as any,
    });

    const productId = cleanId((serviceRequest as any).productId);
    if (!productId) return;

    const activeIssues = issues.filter(
        (issue) => !["CANCELED", "CANCELLED"].includes(String(issue.executionStatus ?? "").toUpperCase()),
    );
    const allDone =
        activeIssues.length > 0 &&
        activeIssues.every((issue) => isTechnicalIssueDone(issue.executionStatus));
    const nextServiceStage = activeIssues.length === 0
        ? "NOT_REQUIRED"
        : allDone
            ? "DONE"
            : "IN_SERVICE";

    await client.watch.updateMany({
        where: { productId },
        data: {
            serviceStage: nextServiceStage,
            updatedAt: new Date(),
        } as any,
    });
}

async function ensureTechnicalIssuePaymentEventSeed(client: any, technicalIssueId: string) {
    const existingPayment = await client.payment.findFirst({
        where: {
            technical_issue_id: technicalIssueId,
            type: "SERVICE",
            purpose: "MAINTENANCE_COST",
        },
        select: { id: true },
    });

    const payment = await ensureTechnicalIssuePaymentTx(client, technicalIssueId);
    if (existingPayment || !payment?.id) return null;

    return {
        id: String(payment.id),
        amount: (payment as any).amount ?? null,
        status: (payment as any).status ?? "UNPAID",
    };
}

function normalizeAreaKey(value?: string | null) {
    const raw = String(value ?? "").trim().toUpperCase();

    const map: Record<string, string> = {
        CASE: "CASE",
        "VỎ": "CASE",
        VO: "CASE",

        MOVEMENT: "MOVEMENT",
        "MÁY": "MOVEMENT",
        MAY: "MOVEMENT",

        CROWN: "CROWN",
        "NÚM": "CROWN",
        NUM: "CROWN",

        CRYSTAL: "CRYSTAL",
        GLASS: "CRYSTAL",
        "KÍNH": "CRYSTAL",
        KINH: "CRYSTAL",

        DIAL: "DIAL",
        "MẶT SỐ": "DIAL",
        "MAT SO": "DIAL",

        HANDS: "HANDS",
        KIM: "HANDS",

        BRACELET: "BRACELET",
        STRAP: "BRACELET",
        "DÂY": "BRACELET",
        DAY: "BRACELET",

        GENERAL: "GENERAL",
        "TỔNG QUÁT": "GENERAL",
        "TONG QUAT": "GENERAL",
    };

    return map[raw] ?? raw;
}

async function resolveTechnicalDetailCatalog(input: {
    technicalDetailCatalogId?: string | null;
    area?: string | null;
}) {
    const technicalDetailCatalogId = cleanId(input.technicalDetailCatalogId);
    if (!technicalDetailCatalogId) return null;

    const catalog = await (prisma as any).technicalDetailCatalog.findFirst({
        where: {
            id: technicalDetailCatalogId,
            isActive: true,
        },
        select: {
            id: true,
            area: true,
            code: true,
            name: true,
        },
    });

    if (!catalog) {
        throw new Error("Chi tiết kỹ thuật không tồn tại hoặc đã bị ẩn.");
    }

    const issueArea = normalizeAreaKey(input.area);
    const catalogArea = normalizeAreaKey(catalog.area);

    if (issueArea && catalogArea && issueArea !== catalogArea) {
        throw new Error("Chi tiết kỹ thuật không khớp với khu vực issue.");
    }

    return catalog;
}

export async function listTechnicalDetailCatalogOptions() {
    const rows = await (prisma as any).technicalDetailCatalog.findMany({
        orderBy: [{ area: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
        select: {
            id: true,
            area: true,
            code: true,
            name: true,
            sortOrder: true,
            isActive: true,
        },
    });

    return rows
        .filter((x: any) => x.isActive !== false)
        .map((x: any) => ({
            id: x.id,
            area: x.area ?? null,
            code: x.code ?? null,
            name: x.name ?? null,
            sortOrder: x.sortOrder ?? null,
        }));
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
    technicalDetailCatalogId?: string | null;
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
        const createdAssessment = await prisma.technicalAssessment.create({
            data: {
                serviceRequestId,
                status: "DRAFT" as any,
            } as any,
            select: { id: true },
        });
        assessmentId = createdAssessment.id;
    }

    const now = new Date();
    const vendorId = cleanId(input.vendorId);

    const created = await prisma.technicalIssue.create({
        data: {
            assessmentId,
            serviceRequestId,
            area: cleanId(input.area),
            issueType: (cleanId(input.issueType) ?? "CHECK") as any,
            actionMode: (cleanId(input.actionMode) ?? "INTERNAL") as any,
            note: cleanId(input.note),
            summary: cleanId(input.summary) ?? cleanId(input.note) ?? "Technical issue",
            estimatedCost: decimalOrNull(input.estimatedCost),
            vendorId,
            vendorNameSnap: await vendorName(vendorId),
            technicianId: cleanId(input.technicianId),
            serviceCatalogId: cleanId(input.serviceCatalogId),
            supplyCatalogId: cleanId(input.supplyCatalogId),
            mechanicalPartCatalogId: cleanId(input.mechanicalPartCatalogId),
            technicalDetailCatalogId: cleanId(input.technicalDetailCatalogId),
            executionStatus: "OPEN" as any,
            openedAt: now,
            updatedAt: now,
        } as any,
    });

    await syncServiceRequestStatusFromIssues(prisma as any, serviceRequestId);
    await recordTechnicalIssueEvent({
        eventKey: "technical_issue.created",
        technicalIssueId: created.id,
        serviceRequestId,
        payload: {
            executionStatus: "OPEN",
            area: cleanId(input.area),
        },
    });

    return created;
}

export async function confirmTechnicalIssue(input: {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    const updated = await prisma.technicalIssue.update({
        where: { id },
        data: {
            isConfirmed: true,
            confirmedAt: new Date(),
            confirmedById: cleanId(input.actorId),
            confirmedByNameSnap: cleanId(input.actorName),
            executionStatus: "CONFIRMED" as any,
            updatedAt: new Date(),
        } as any,
    });

    await syncServiceRequestStatusFromIssues(prisma as any, (updated as any).serviceRequestId);

    await syncTechnicalIssueToTasks(prisma as any, {
        technicalIssueId: id,
        event: "TECHNICAL_ISSUE_CONFIRMED",
        actorUserId: cleanId(input.actorId),
        note: "Technical Issue đã xác nhận",
    });

    await recordTechnicalIssueEvent({
        eventKey: "technical_issue.confirmed",
        technicalIssueId: id,
        serviceRequestId: (updated as any).serviceRequestId,
        actorUserId: cleanId(input.actorId),
        payload: {
            executionStatus: "CONFIRMED",
        },
    });

    return updated;
}

export async function startTechnicalIssue(input: {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
    technicalDetailCatalogId?: string | null;
    actionMode?: string | null;
    vendorId?: string | null;
    estimatedCost?: unknown;
    startedNote?: string | null;
    vendorChangeNote?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    const issue = await prisma.technicalIssue.findUnique({
        where: { id },
        select: {
            id: true,
            area: true,
            executionStatus: true,
            isConfirmed: true,
            serviceRequestId: true,
            vendorId: true,
        } as any,
    });

    if (!issue) throw new Error("Không tìm thấy issue.");

    const detail = await resolveTechnicalDetailCatalog({
        technicalDetailCatalogId: input.technicalDetailCatalogId,
        area: (issue as any).area,
    });

    if (!detail?.id) {
        throw new Error("Vui lòng chọn chi tiết kỹ thuật trước khi bắt đầu xử lý.");
    }

    const vendorId = cleanId(input.vendorId);
    const actionMode = cleanId(input.actionMode) ?? "INTERNAL";
    const isChangingVendor = vendorId !== cleanId((issue as any).vendorId);

    if (String(actionMode).toUpperCase() === "VENDOR" && !vendorId) {
        throw new Error("Vui lòng chọn vendor khi xử lý bởi vendor.");
    }

    if (isChangingVendor && !cleanText(input.vendorChangeNote)) {
        throw new Error("Vui lòng nhập lý do đổi vendor.");
    }

    const updated = await prisma.technicalIssue.update({
        where: { id },
        data: {
            isConfirmed: true,
            confirmedAt: new Date(),
            executionStatus: "IN_PROGRESS" as any,
            startedAt: new Date(),
            actionMode: actionMode as any,
            vendorId,
            vendorNameSnap: await vendorName(vendorId),
            technicalDetailCatalogId: detail.id,
            estimatedCost: input.estimatedCost === undefined ? undefined : decimalOrNull(input.estimatedCost),
            updatedAt: new Date(),
        } as any,
    });

    await syncServiceRequestStatusFromIssues(prisma as any, (updated as any).serviceRequestId);

    await syncTechnicalIssueToTasks(prisma as any, {
        technicalIssueId: id,
        event: "TECHNICAL_ISSUE_STARTED",
        actorUserId: cleanId(input.actorId),
        note: "Technical Issue đã bắt đầu xử lý",
    });
    if (cleanText(input.vendorChangeNote)) {
        await syncTechnicalIssueToTasks(prisma as any, {
            technicalIssueId: id,
            event: "TECHNICAL_ISSUE_VENDOR_CHANGED",
            actorUserId: cleanId(input.actorId),
            note: `Ly do doi vendor: ${cleanText(input.vendorChangeNote)}`,
        });
    }
    await recordTechnicalIssueEvent({
        eventKey: "technical_issue.started",
        technicalIssueId: id,
        serviceRequestId: (updated as any).serviceRequestId,
        actorUserId: cleanId(input.actorId),
        payload: {
            executionStatus: "IN_PROGRESS",
            actionMode,
            vendorId,
            technicalDetailCatalogId: detail.id,
            estimatedCost: decimalOrNull(input.estimatedCost),
            startedNote: cleanText(input.startedNote),
            vendorChangeNote: cleanText(input.vendorChangeNote),
        },
    });

    return updated;
}

export async function completeTechnicalIssue(input: {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
    actualCost?: unknown;
    resolutionNote?: string | null;
    supplyCatalogId?: string | null;
    mechanicalPartCatalogId?: string | null;
    createPayment?: boolean;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    const actualCost = decimalOrNull(input.actualCost);
    if (actualCost == null || actualCost < 0) {
        throw new Error("Vui lòng nhập chi phí thực tế hợp lệ. Chi phí có thể bằng 0.");
    }

    const completion = await prisma.$transaction(async (tx) => {
        const issue = await tx.technicalIssue.findUnique({
            where: { id },
            select: {
                id: true,
                technicalDetailCatalogId: true,
                executionStatus: true,
                serviceRequestId: true,
            } as any,
        });

        if (!issue) throw new Error("Không tìm thấy issue.");

        if (!(issue as any).technicalDetailCatalogId) {
            throw new Error("Issue chưa có chi tiết kỹ thuật. Vui lòng bắt đầu xử lý đúng luồng trước khi hoàn tất.");
        }

        const updated = await tx.technicalIssue.update({
            where: { id },
            data: {
                isConfirmed: true,
                executionStatus: "DONE" as any,
                completedAt: new Date(),
                completedByNameSnap: cleanId(input.actorName),
                actualCost,
                resolutionNote: cleanText(input.resolutionNote),
                supplyCatalogId: input.supplyCatalogId === undefined ? undefined : cleanId(input.supplyCatalogId),
                mechanicalPartCatalogId:
                    input.mechanicalPartCatalogId === undefined ? undefined : cleanId(input.mechanicalPartCatalogId),
                updatedAt: new Date(),
            } as any,
        });

        const createdPayment =
            input.createPayment !== false
                ? await ensureTechnicalIssuePaymentEventSeed(tx as any, id)
                : null;

        await syncServiceRequestStatusFromIssues(tx as any, (updated as any).serviceRequestId);

        await syncTechnicalIssueToTasks(tx as any, {
            technicalIssueId: id,
            event: "TECHNICAL_ISSUE_DONE",
            actorUserId: cleanId(input.actorId),
            note: "Technical Issue đã hoàn tất",
        });

        return { issue: updated, createdPayment };
    });

    const updated = completion.issue;

    await recordTechnicalIssueEvent({
        eventKey: "technical_issue.completed",
        technicalIssueId: id,
        serviceRequestId: (updated as any).serviceRequestId,
        actorUserId: cleanId(input.actorId),
        payload: {
            executionStatus: "DONE",
            actualCost,
            createPayment: input.createPayment !== false,
        },
    });

    if (completion.createdPayment) {
        await recordBusinessEvent(prisma, {
            eventKey: "payment.created",
            targetType: "PAYMENT",
            targetId: completion.createdPayment.id,
            payload: {
                ownerType: "TECHNICAL_ISSUE",
                ownerId: id,
                status: completion.createdPayment.status,
                amount: completion.createdPayment.amount,
                sourceId: `${completion.createdPayment.id}:payment.created`,
            },
        });
    }

    return updated;
}

export async function closeTechnicalIssueNoIssue(input: {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
    resolutionNote?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    const updated = await prisma.technicalIssue.update({
        where: { id },
        data: {
            isConfirmed: true,
            executionStatus: "DONE" as any,
            completedAt: new Date(),
            completedByNameSnap: cleanId(input.actorName),
            actualCost: 0,
            resolutionNote: cleanText(input.resolutionNote) ?? "Kiểm tra không phát hiện vấn đề.",
            updatedAt: new Date(),
        } as any,
    });

    await syncServiceRequestStatusFromIssues(prisma as any, (updated as any).serviceRequestId);

    await syncTechnicalIssueToTasks(prisma as any, {
        technicalIssueId: id,
        event: "TECHNICAL_ISSUE_DONE",
        actorUserId: cleanId(input.actorId),
        note: "Technical Issue không phát hiện vấn đề",
    });

    await recordTechnicalIssueEvent({
        eventKey: "technical_issue.completed",
        technicalIssueId: id,
        serviceRequestId: (updated as any).serviceRequestId,
        actorUserId: cleanId(input.actorId),
        payload: {
            executionStatus: "DONE",
            actualCost: 0,
            noIssue: true,
        },
    });

    return updated;
}

export async function cancelTechnicalIssue(
    idInput: string,
    input: { reason?: string | null } = {},
) {
    const id = cleanId(idInput);
    if (!id) throw new Error("Missing issue id");

    const updated = await prisma.technicalIssue.update({
        where: { id },
        data: {
            executionStatus: "CANCELED" as any,
            canceledAt: new Date(),
            resolutionNote: cleanId(input.reason),
            updatedAt: new Date(),
        } as any,
    });

    await syncServiceRequestStatusFromIssues(prisma as any, (updated as any).serviceRequestId);

    await syncTechnicalIssueToTasks(prisma as any, {
        technicalIssueId: id,
        event: "TECHNICAL_ISSUE_CANCELED",
        note: cleanId(input.reason) ?? "Technical Issue đã hủy",
    });

    return updated;
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
    technicalDetailCatalogId?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing issue id");

    const vendorId = cleanId(input.vendorId);

    const updated = await prisma.technicalIssue.update({
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
            technicalDetailCatalogId:
                input.technicalDetailCatalogId === undefined ? undefined : cleanId(input.technicalDetailCatalogId),
            updatedAt: new Date(),
        } as any,
    });

    await syncServiceRequestStatusFromIssues(prisma as any, (updated as any).serviceRequestId);

    await syncTechnicalIssueToTasks(prisma as any, {
        technicalIssueId: id,
        event: "TECHNICAL_ISSUE_UPDATED",
        note: "Technical Issue đã được cập nhật",
    });

    return updated;
}

export async function removeTechnicalIssue(idInput: string) {
    const id = cleanId(idInput);
    if (!id) throw new Error("Missing issue id");

    const issue = await prisma.technicalIssue.findUnique({
        where: { id },
        select: { serviceRequestId: true },
    });

    await prisma.technicalIssue.delete({ where: { id } });

    await syncServiceRequestStatusFromIssues(prisma as any, issue?.serviceRequestId);

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
    return getTechnicalIssueBoardColumn(issue) as BoardColumnKey;
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

export async function getTechnicalIssueBoardData(input: { serviceRequestId?: string | null } = {}) {
    const serviceRequestId = cleanId(input.serviceRequestId);

    const [rows, technicalDetailCatalogOptions, vendorOptions] = await Promise.all([
        prisma.technicalIssue.findMany({
            where: {
                ...(serviceRequestId ? { serviceRequestId } : {}),
                executionStatus: {
                    not: "CANCELED" as any,
                },
            },
            orderBy: [{ openedAt: "desc" }, { createdAt: "desc" as any }],
            include: {
                serviceRequest: {
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
                vendor: {
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
                technicalDetailCatalog: {
                    select: { id: true, area: true, code: true, name: true },
                },
                technicalAssessment: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
                maintenanceRecord: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        eventType: true,
                        notes: true,
                        totalCost: true,
                        approvalStatus: true,
                        approvedAt: true,
                        rejectedAt: true,
                        rejectionReason: true,
                        createdAt: true,
                    },
                },
            } as any,
        }),
        listTechnicalDetailCatalogOptions(),
        prisma.vendor.findMany({
            orderBy: [{ name: "asc" }],
            select: {
                id: true,
                name: true,
                phone: true,
            },
        }),
    ]);

    const items = rows
        .map((x: any) => {
            const sr = x.serviceRequest;
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

            const serviceRequestCompleted =
                activeIssues.length > 0 &&
                activeIssues.every((i) => isTechnicalIssueDone(i.executionStatus));

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
                serviceRequestReadyToClose: serviceRequestCompleted,
                serviceRequestCompleted,
                isLastDoneIssueOfServiceRequest:
                    serviceRequestCompleted &&
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
                maintenanceLogs: (x.maintenanceRecord ?? []).map((log: any) => ({
                    id: log.id,
                    eventType: log.eventType,
                    notes: log.notes,
                    totalCost: toNumber(log.totalCost),
                    approvalStatus: log.approvalStatus,
                    approvedAt: log.approvedAt,
                    rejectedAt: log.rejectedAt,
                    rejectionReason: log.rejectionReason,
                    createdAt: log.createdAt,
                })),
                hasPendingMaintenanceApproval: (x.maintenanceRecord ?? []).some(
                    (log: any) => log.approvalStatus === "PENDING",
                ),
                technicalDetailCatalog: x.technicalDetailCatalog
                    ? {
                        id: x.technicalDetailCatalog.id,
                        area: x.technicalDetailCatalog.area ?? null,
                        code: x.technicalDetailCatalog.code ?? null,
                        name: x.technicalDetailCatalog.name ?? null,
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
    return {
        items,
        counts,
        technicalDetailCatalogOptions,
        catalogs: {
            technicalDetailCatalogOptions,
            vendorOptions,
        },
    };
}
export async function createTechnicalIssueMaintenanceLog(input: {
    technicalIssueId: string;
    eventType: string;
    notes?: string | null;
    totalCost?: unknown;
    needApproval?: boolean;
}) {
    const technicalIssueId = cleanId(input.technicalIssueId);
    if (!technicalIssueId) throw new Error("Missing technicalIssueId");

    const issue = await prisma.technicalIssue.findUnique({
        where: { id: technicalIssueId },
        select: {
            id: true,
            serviceRequestId: true,
            vendorId: true,
            vendorNameSnap: true,
            technicianId: true,
            technicalDetailCatalogId: true,
        } as any,
    });

    if (!issue) throw new Error("Không tìm thấy issue.");

    const approvalStatus = input.needApproval ? "PENDING" : "NOT_REQUIRED";

    return prisma.maintenanceRecord.create({
        data: {
            technicalIssueId,
            serviceRequestId: (issue as any).serviceRequestId,
            vendorId: (issue as any).vendorId,
            vendorName: (issue as any).vendorNameSnap,
            technicianId: (issue as any).technicianId,
            serviceCatalogId: (issue as any).technicalDetailCatalogId,
            eventType: input.eventType as any,
            notes: cleanText(input.notes),
            totalCost: decimalOrNull(input.totalCost),
            approvalStatus: approvalStatus as any,
            billable: input.eventType === "COST",
            billed: false,
            servicedAt: new Date(),
        } as any,
    });
}

export async function approveTechnicalIssueMaintenanceLog(input: {
    id: string;
    actorId?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing maintenance log id");

    return prisma.maintenanceRecord.update({
        where: { id },
        data: {
            approvalStatus: "APPROVED" as any,
            approvedAt: new Date(),
            approvedByUserId: cleanId(input.actorId),
            updatedAt: new Date(),
        } as any,
    });
}

export async function rejectTechnicalIssueMaintenanceLog(input: {
    id: string;
    actorId?: string | null;
    reason?: string | null;
    nextAction: "CHANGE_VENDOR" | "CANCEL_ISSUE";
    newVendorId?: string | null;
}) {
    const id = cleanId(input.id);
    if (!id) throw new Error("Missing maintenance log id");

    return prisma.$transaction(async (tx) => {
        const log = await tx.maintenanceRecord.update({
            where: { id },
            data: {
                approvalStatus: "REJECTED" as any,
                rejectedAt: new Date(),
                rejectedByUserId: cleanId(input.actorId),
                rejectionReason: cleanText(input.reason),
                updatedAt: new Date(),
            } as any,
        });

        const technicalIssueId = (log as any).technicalIssueId;
        if (!technicalIssueId) return log;

        if (input.nextAction === "CHANGE_VENDOR") {
            const newVendorId = cleanId(input.newVendorId);
            if (!newVendorId) throw new Error("Vui lòng chọn vendor mới.");

            const vendorNameSnap = await vendorName(newVendorId);

            await tx.technicalIssue.update({
                where: { id: technicalIssueId },
                data: {
                    vendorId: newVendorId,
                    vendorNameSnap,
                    executionStatus: "CONFIRMED" as any,
                    updatedAt: new Date(),
                } as any,
            });

            await tx.maintenanceRecord.create({
                data: {
                    technicalIssueId,
                    serviceRequestId: (log as any).serviceRequestId,
                    eventType: "CHANGE_VENDOR" as any,
                    vendorId: newVendorId,
                    vendorName: vendorNameSnap,
                    notes: cleanText(input.reason) || "Đổi vendor sau khi từ chối phát sinh.",
                    approvalStatus: "NOT_REQUIRED" as any,
                    billable: false,
                    servicedAt: new Date(),
                } as any,
            });
        }

        if (input.nextAction === "CANCEL_ISSUE") {
            await tx.technicalIssue.update({
                where: { id: technicalIssueId },
                data: {
                    executionStatus: "CANCELED" as any,
                    canceledAt: new Date(),
                    resolutionNote: cleanText(input.reason),
                    updatedAt: new Date(),
                } as any,
            });

            await tx.maintenanceRecord.create({
                data: {
                    technicalIssueId,
                    serviceRequestId: (log as any).serviceRequestId,
                    eventType: "CANCELLED" as any,
                    notes: cleanText(input.reason) || "Hủy issue sau khi từ chối phát sinh.",
                    approvalStatus: "NOT_REQUIRED" as any,
                    billable: false,
                    servicedAt: new Date(),
                } as any,
            });
        }

        return log;
    });
}
