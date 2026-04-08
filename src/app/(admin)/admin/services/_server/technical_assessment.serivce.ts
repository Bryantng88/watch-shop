import prisma from "@/server/db/client";
import * as repo from "./technical.assessment.repo";
import {
    ServiceRequestStatus,
    TechnicalAssessmentStatus,
    TechnicalIssueExecutionStatus,
} from "@prisma/client";

function toNumberOrNull(v: any) {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function toText(v: any) {
    const s = String(v ?? "").trim();
    return s.length ? s : null;
}

function mapProductMovementToMachineType(
    movement?: string | null
): "MECHANICAL" | "QUARTZ" {
    const raw = String(movement || "").toUpperCase();

    if (
        raw === "QUARTZ" ||
        raw === "SOLAR" ||
        raw === "KINETIC" ||
        raw === "MECHAQUARTZ"
    ) {
        return "QUARTZ";
    }

    return "MECHANICAL";
}

function inferMovementKindFromProduct(
    productMovement?: string | null
): "BATTERY" | "MECHANICAL" {
    return mapProductMovementToMachineType(productMovement) === "QUARTZ"
        ? "BATTERY"
        : "MECHANICAL";
}

function inferMovementStatusFromPayload(input: any): "GOOD" | "ISSUE" {
    const raw =
        String(input?.movement?.status || input?.movementStatus || "").toUpperCase();
    return raw === "ISSUE" ? "ISSUE" : "GOOD";
}

function inferCaseStatusFromPayload(input: any): "GOOD" | "ISSUE" {
    const appearanceCase = input?.appearance?.case;
    if (!appearanceCase) {
        return String(input?.caseStatus || "").toUpperCase() === "ISSUE"
            ? "ISSUE"
            : "GOOD";
    }

    const hasIssue =
        (Array.isArray(appearanceCase.issues) && appearanceCase.issues.length > 0) ||
        Boolean(appearanceCase?.proposal?.enabled);

    return hasIssue ? "ISSUE" : "GOOD";
}

function inferCrystalStatusFromPayload(input: any): "GOOD" | "ISSUE" {
    const appearanceGlass = input?.appearance?.glass;
    if (!appearanceGlass) {
        return String(input?.crystalStatus || "").toUpperCase() === "ISSUE"
            ? "ISSUE"
            : "GOOD";
    }

    const hasIssue =
        (Array.isArray(appearanceGlass.issues) && appearanceGlass.issues.length > 0) ||
        Boolean(appearanceGlass?.proposal?.enabled);

    return hasIssue ? "ISSUE" : "GOOD";
}

function inferCrownStatusFromPayload(input: any): "GOOD" | "ISSUE" {
    const crown = input?.appearance?.crown;
    if (!crown) {
        return String(input?.crownStatus || "").toUpperCase() === "ISSUE"
            ? "ISSUE"
            : "GOOD";
    }

    return String(crown?.status || "").toUpperCase() === "ISSUE"
        ? "ISSUE"
        : "GOOD";
}

function inferActionModeFromPayload(input: any): "NONE" | "INTERNAL" | "VENDOR" {
    const candidates: string[] = [];

    const movementLines = Array.isArray(input?.movement?.lines)
        ? input.movement.lines
        : [];

    for (const line of movementLines) {
        if (line?.execution) candidates.push(String(line.execution).toUpperCase());
    }

    const caseProposal = input?.appearance?.case?.proposal;
    const glassProposal = input?.appearance?.glass?.proposal;
    const dialProposal = input?.appearance?.dial?.proposal;
    const crown = input?.appearance?.crown;

    [caseProposal, glassProposal, dialProposal, crown].forEach((x) => {
        if (x?.execution) candidates.push(String(x.execution).toUpperCase());
    });

    if (candidates.includes("VENDOR")) return "VENDOR";
    if (candidates.includes("INHOUSE") || candidates.includes("INTERNAL")) {
        return "INTERNAL";
    }
    return "NONE";
}

function inferVendorIdFromPayload(input: any): string | null {
    const movementLines = Array.isArray(input?.movement?.lines)
        ? input.movement.lines
        : [];

    for (const line of movementLines) {
        const id = String(line?.vendorId || "").trim();
        if (id) return id;
    }

    const blocks = [
        input?.appearance?.case?.proposal,
        input?.appearance?.glass?.proposal,
        input?.appearance?.dial?.proposal,
        input?.appearance?.crown,
    ];

    for (const block of blocks) {
        const id = String(block?.vendorId || "").trim();
        if (id) return id;
    }

    return null;
}

function inferPreRate(input: any) {
    return toNumberOrNull(input?.movement?.beforeSpecs?.rate ?? input?.preRate);
}
function inferPreAmplitude(input: any) {
    return toNumberOrNull(input?.movement?.beforeSpecs?.amp ?? input?.preAmplitude);
}
function inferPreBeatError(input: any) {
    return toNumberOrNull(input?.movement?.beforeSpecs?.err ?? input?.preBeatError);
}
function inferPostRate(input: any) {
    return toNumberOrNull(input?.movement?.afterSpecs?.rate ?? input?.postRate);
}
function inferPostAmplitude(input: any) {
    return toNumberOrNull(input?.movement?.afterSpecs?.amp ?? input?.postAmplitude);
}
function inferPostBeatError(input: any) {
    return toNumberOrNull(input?.movement?.afterSpecs?.err ?? input?.postBeatError);
}

function inferConclusion(input: any) {
    return input?.conclusion ?? null;
}

function inferImageFileKey(input: any) {
    return input?.imageFileKey ?? input?.productSnapshot?.image ?? null;
}

function buildDesiredIssuesFromPayload(input: any) {
    const desired: Array<any> = [];

    const movementLines = Array.isArray(input?.movement?.lines)
        ? input.movement.lines
        : [];

    movementLines.forEach((line: any, index: number) => {
        const action = String(line?.action || "").toUpperCase();
        const execution = String(line?.execution || "").toUpperCase();

        let summary = "Xử lý bộ máy";
        let issueType = "REPAIR";

        if (action === "SERVICE") {
            summary = "Lau dầu / service máy";
            issueType = "SERVICE";
        } else if (action === "REPLACE_PART") {
            summary = "Thay linh kiện bộ máy";
            issueType = "REPLACE";
        } else if (action === "REGULATE") {
            summary = "Chỉnh sai số / cân chỉnh máy";
            issueType = "REPAIR";
        } else if (action === "WATERPROOF") {
            summary = "Kiểm tra / xử lý chống nước";
            issueType = "REPAIR";
        } else if (action === "REPLACE_MOVEMENT") {
            summary = "Thay máy mới";
            issueType = "REPLACE";
        } else if (action === "BATTERY_CHANGE") {
            summary = "Thay pin";
            issueType = "SERVICE";
        }

        desired.push({
            sourceKey: `MOVEMENT:${index}:${action}:${line?.partId || ""}:${line?.vendorId || ""}`,
            area: "MOVEMENT",
            summary,
            note: toText(line?.note),
            issueType,
            actionMode: execution === "VENDOR" ? "VENDOR" : "INTERNAL",
            vendorId: toText(line?.vendorId),
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: toText(line?.partId),
            estimatedCost: toNumberOrNull(line?.cost),
        });
    });

    const caseProposal = input?.appearance?.case?.proposal;
    if (caseProposal?.enabled) {
        desired.push({
            sourceKey: "CASE:PROPOSAL",
            area: "CASE",
            summary: "Xử lý ngoại hình phần vỏ",
            note: toText(caseProposal?.note),
            issueType: "REPAIR",
            actionMode:
                String(caseProposal?.execution || "").toUpperCase() === "VENDOR"
                    ? "VENDOR"
                    : "INTERNAL",
            vendorId: toText(caseProposal?.vendorId),
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: null,
            estimatedCost: toNumberOrNull(caseProposal?.estimatedCost),
        });
    }

    const glassProposal = input?.appearance?.glass?.proposal;
    if (glassProposal?.enabled) {
        desired.push({
            sourceKey: "CRYSTAL:PROPOSAL",
            area: "CRYSTAL",
            summary: "Xử lý / thay kính",
            note: toText(glassProposal?.note),
            issueType: "REPLACE",
            actionMode:
                String(glassProposal?.execution || "").toUpperCase() === "VENDOR"
                    ? "VENDOR"
                    : "INTERNAL",
            vendorId: toText(glassProposal?.vendorId),
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: null,
            estimatedCost: toNumberOrNull(glassProposal?.estimatedCost),
        });
    }

    const dialProposal = input?.appearance?.dial?.proposal;
    if (dialProposal?.enabled) {
        desired.push({
            sourceKey: "DIAL:PROPOSAL",
            area: "DIAL",
            summary: "Xử lý mặt số",
            note: toText(dialProposal?.note),
            issueType: "REPAIR",
            actionMode:
                String(dialProposal?.execution || "").toUpperCase() === "VENDOR"
                    ? "VENDOR"
                    : "INTERNAL",
            vendorId: toText(dialProposal?.vendorId),
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: null,
            estimatedCost: toNumberOrNull(dialProposal?.estimatedCost),
        });
    }

    const crown = input?.appearance?.crown;
    if (String(crown?.status || "").toUpperCase() === "ISSUE") {
        desired.push({
            sourceKey: `CROWN:${crown?.action || ""}:${crown?.partId || ""}:${crown?.vendorId || ""}`,
            area: "CROWN",
            summary: "Xử lý núm / ty",
            note: toText(crown?.note),
            issueType:
                String(crown?.action || "").toUpperCase().includes("REPLACE")
                    ? "REPLACE"
                    : "REPAIR",
            actionMode:
                String(crown?.execution || "").toUpperCase() === "VENDOR"
                    ? "VENDOR"
                    : "INTERNAL",
            vendorId: toText(crown?.vendorId),
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: toText(crown?.partId),
            estimatedCost: toNumberOrNull(crown?.cost),
        });
    }

    return desired;
}

async function syncTechnicalIssuesFromAssessment(
    tx: any,
    params: {
        assessmentId: string;
        serviceRequestId: string;
        vendorNameMap: Record<string, string>;
        payload: any;
    }
) {
    const { assessmentId, serviceRequestId, vendorNameMap, payload } = params;

    const existing = await repo.listAssessmentIssuesForSync(tx, assessmentId);

    const openExisting = existing.filter(
        (x: any) => x.executionStatus === TechnicalIssueExecutionStatus.OPEN
    );

    const desired = buildDesiredIssuesFromPayload(payload);

    const maxSort = await repo.countAssessmentIssues(tx, assessmentId);

    for (let i = 0; i < desired.length; i++) {
        const d = desired[i];
        const current = openExisting[i];

        const vendorNameSnap = d.vendorId ? vendorNameMap[d.vendorId] ?? null : null;

        if (current) {
            await repo.updateAssessmentIssue(tx, current.id, {
                area: d.area,
                summary: d.summary,
                note: d.note,
                issueType: d.issueType,
                actionMode: d.actionMode,
                vendorId: d.vendorId,
                vendorNameSnap,
                serviceCatalogId: d.serviceCatalogId,
                supplyCatalogId: d.supplyCatalogId,
                mechanicalPartCatalogId: d.mechanicalPartCatalogId,
                estimatedCost: d.estimatedCost,
                sortOrder: i,
                isConfirmed: false,
                confirmedAt: null,
                confirmedById: null,
                confirmedByNameSnap: null,
                updatedAt: new Date(),
            } as any);
        } else {
            await repo.createAssessmentIssue(tx, {
                assessmentId,
                serviceRequestId,
                area: d.area,
                summary: d.summary,
                note: d.note,
                issueType: d.issueType,
                actionMode: d.actionMode,
                executionStatus: TechnicalIssueExecutionStatus.OPEN,
                vendorId: d.vendorId,
                vendorNameSnap,
                serviceCatalogId: d.serviceCatalogId,
                supplyCatalogId: d.supplyCatalogId,
                mechanicalPartCatalogId: d.mechanicalPartCatalogId,
                estimatedCost: d.estimatedCost,
                openedAt: new Date(),
                sortOrder: maxSort + i,
                isConfirmed: false,
                confirmedAt: null,
                confirmedById: null,
                confirmedByNameSnap: null,
            } as any);
        }
    }

    if (openExisting.length > desired.length) {
        const redundant = openExisting.slice(desired.length);
        for (const item of redundant) {
            await repo.updateAssessmentIssue(tx, item.id, {
                executionStatus: TechnicalIssueExecutionStatus.CANCELED,
                canceledAt: new Date(),
                resolutionNote:
                    "Auto closed because assessment no longer requests this issue",
                updatedAt: new Date(),
            });
        }
    }
}

export async function getTechnicalAssessmentPanel(serviceRequestId: string) {
    const panel = await repo.getPanel(serviceRequestId);
    if (!panel) {
        throw new Error("Không tìm thấy service request");
    }

    const maintenanceRecords = await repo.listServiceMaintenanceRecords(
        prisma,
        serviceRequestId
    );

    const issues = panel.assessment?.issues ?? [];
    const confirmedIssues = issues.filter((x: any) => x.isConfirmed);
    const openIssueCount = confirmedIssues.filter(
        (x: any) =>
            x.executionStatus === TechnicalIssueExecutionStatus.OPEN ||
            x.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS
    ).length;

    return {
        serviceRequest: panel.serviceRequest,
        assessment: panel.assessment,
        technicalAssessment: panel.assessment,
        technicalIssues: issues,
        maintenanceRecords,
        catalogs: panel.catalogs,
        stats: {
            issueCount: confirmedIssues.length,
            openIssueCount,
            maintenanceCount: maintenanceRecords.length,
        },
    };
}

export async function openTechnicalAssessment(serviceRequestId: string) {
    return prisma.$transaction(async (tx) => {
        const existing = await tx.technicalAssessment.findUnique({
            where: { serviceRequestId },
        });

        if (existing) {
            if (existing.status === TechnicalAssessmentStatus.COMPLETED) {
                return tx.technicalAssessment.update({
                    where: { id: existing.id },
                    data: {
                        status: TechnicalAssessmentStatus.IN_PROGRESS,
                        updatedAt: new Date(),
                    },
                });
            }

            return existing;
        }

        const created = await tx.technicalAssessment.create({
            data: {
                serviceRequestId,
                status: TechnicalAssessmentStatus.DRAFT,
            },
        });

        await tx.serviceRequest.update({
            where: { id: serviceRequestId },
            data: {
                status: ServiceRequestStatus.IN_PROGRESS,
            },
        });

        return created;
    });
}

export async function saveTechnicalAssessment(input: any) {
    const serviceRequestId = String(input?.serviceRequestId || "").trim();
    if (!serviceRequestId) {
        throw new Error("Missing serviceRequestId");
    }

    return prisma.$transaction(async (tx) => {
        const sr = await tx.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: {
                id: true,
                technicianId: true,
                technicianNameSnap: true,
                product: {
                    select: {
                        watchSpec: {
                            select: {
                                movement: true,
                            },
                        },
                    },
                },
            },
        });

        if (!sr) {
            throw new Error("Service request not found");
        }

        const productMovement = sr.product?.watchSpec?.movement ?? null;

        const vendorIds = new Set<string>();
        const singleVendorId = inferVendorIdFromPayload(input);
        if (singleVendorId) vendorIds.add(singleVendorId);

        const movementLines = Array.isArray(input?.movement?.lines)
            ? input.movement.lines
            : [];

        movementLines.forEach((x: any) => {
            const id = toText(x?.vendorId);
            if (id) vendorIds.add(id);
        });

        [
            input?.appearance?.case?.proposal,
            input?.appearance?.glass?.proposal,
            input?.appearance?.dial?.proposal,
            input?.appearance?.crown,
        ].forEach((x: any) => {
            const id = toText(x?.vendorId);
            if (id) vendorIds.add(id);
        });

        const vendors = vendorIds.size
            ? await tx.vendor.findMany({
                where: { id: { in: Array.from(vendorIds) } },
                select: { id: true, name: true },
            })
            : [];

        const vendorNameMap = vendors.reduce<Record<string, string>>((acc, x) => {
            acc[x.id] = x.name;
            return acc;
        }, {});

        const vendorId = singleVendorId;
        const vendorNameSnap = vendorId ? vendorNameMap[vendorId] ?? null : null;

        const assessment = await repo.upsertAssessment(tx, {
            serviceRequestId,
            movementKind: inferMovementKindFromProduct(productMovement),
            movementStatus: inferMovementStatusFromPayload(input),
            caseStatus: inferCaseStatusFromPayload(input),
            crystalStatus: inferCrystalStatusFromPayload(input),
            crownStatus: inferCrownStatusFromPayload(input),
            preRate: inferPreRate(input),
            preAmplitude: inferPreAmplitude(input),
            preBeatError: inferPreBeatError(input),
            postRate: inferPostRate(input),
            postAmplitude: inferPostAmplitude(input),
            postBeatError: inferPostBeatError(input),
            actionMode: inferActionModeFromPayload(input),
            vendorId,
            vendorNameSnap,
            conclusion: inferConclusion(input),
            imageFileKey: inferImageFileKey(input),
            status: TechnicalAssessmentStatus.IN_PROGRESS,
            evaluatedById: sr.technicianId ?? null,
            evaluatedByNameSnap: sr.technicianNameSnap ?? null,
        });

        await syncTechnicalIssuesFromAssessment(tx, {
            assessmentId: assessment.id,
            serviceRequestId,
            vendorNameMap,
            payload: input,
        });

        await tx.serviceRequest.update({
            where: { id: serviceRequestId },
            data: {
                status: ServiceRequestStatus.IN_PROGRESS,
                vendorId,
                vendorNameSnap,
            },
        });

        return {
            ok: true,
            item: assessment,
        };
    });
}

export async function completeTechnicalAssessment(assessmentId: string) {
    return prisma.$transaction(async (tx) => {
        const assessment = await tx.technicalAssessment.findUnique({
            where: { id: assessmentId },
            include: {
                TechnicalIssue: true,
            },
        });

        if (!assessment) {
            throw new Error("Assessment not found");
        }

        const hasOpenConfirmedIssue = assessment.TechnicalIssue.some(
            (x: any) =>
                x.isConfirmed &&
                (x.executionStatus === TechnicalIssueExecutionStatus.OPEN ||
                    x.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS)
        );

        if (hasOpenConfirmedIssue) {
            throw new Error("Còn issue đã xác nhận nhưng chưa hoàn tất");
        }

        await tx.technicalAssessment.update({
            where: { id: assessmentId },
            data: {
                status: TechnicalAssessmentStatus.COMPLETED,
            },
        });

        await tx.serviceRequest.update({
            where: { id: assessment.serviceRequestId },
            data: {
                status: ServiceRequestStatus.COMPLETED,
            },
        });

        return { ok: true };
    });
}

export async function completeServiceRequestById(serviceRequestId: string) {
    return prisma.$transaction(async (tx) => {
        const assessment = await tx.technicalAssessment.findUnique({
            where: { serviceRequestId },
            include: {
                TechnicalIssue: true,
            },
        });

        if (!assessment) {
            throw new Error("Chưa có phiếu kỹ thuật để chốt service request");
        }

        const hasOpenConfirmedIssue = assessment.TechnicalIssue.some(
            (x: any) =>
                x.isConfirmed &&
                (x.executionStatus === TechnicalIssueExecutionStatus.OPEN ||
                    x.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS)
        );

        if (hasOpenConfirmedIssue) {
            throw new Error("Còn issue đã xác nhận nhưng chưa hoàn tất");
        }

        await tx.technicalAssessment.update({
            where: { id: assessment.id },
            data: {
                status: TechnicalAssessmentStatus.COMPLETED,
            },
        });

        await tx.serviceRequest.update({
            where: { id: serviceRequestId },
            data: {
                status: ServiceRequestStatus.COMPLETED,
            },
        });

        return {
            ok: true,
            assessmentId: assessment.id,
            serviceRequestId,
        };
    });
}
export async function getServiceRequestTechnicalSummary(serviceRequestId: string) {
    return repo.getTechnicalSummaryByServiceRequest(serviceRequestId);
}


