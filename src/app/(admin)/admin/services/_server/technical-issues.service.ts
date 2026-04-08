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

function inferMovementKindFromPayload(input: any): "BATTERY" | "MECHANICAL" {
    const machineType = String(input?.movement?.machineType || "").toUpperCase();
    const movementKind = String(input?.movementKind || "").toUpperCase();

    if (machineType === "QUARTZ" || movementKind === "BATTERY") {
        return "BATTERY";
    }
    return "MECHANICAL";
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
function toText(v: any) {
    const s = String(v ?? "").trim();
    return s.length ? s : null;
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
    const openIssueCount = issues.filter(
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
            issueCount: issues.length,
            openIssueCount,
            maintenanceCount: maintenanceRecords.length,
        },
    };
}
export async function startTechnicalIssue(input: {
    id: string;
    actorName?: string | null;
}) {
    const id = toText(input.id);
    if (!id) throw new Error("Missing issue id");

    return prisma.$transaction(async (tx) => {
        const issue = await tx.technicalIssue.findUnique({
            where: { id },
            select: {
                id: true,
                executionStatus: true,
                isConfirmed: true,
            },
        });

        if (!issue) throw new Error("Issue not found");

        if (!issue.isConfirmed) {
            throw new Error("Issue chưa được xác nhận");
        }

        if (issue.executionStatus !== "OPEN") {
            throw new Error("Issue không ở trạng thái OPEN");
        }

        return tx.technicalIssue.update({
            where: { id },
            data: {
                executionStatus: "IN_PROGRESS",
                startedAt: new Date(),
                updatedAt: new Date(),
            },
        });
    });
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

        const created = await tx.technicalAssessment.create({
            data: {
                serviceRequestId,
                status: "DRAFT",
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
            },
        });

        if (!sr) {
            throw new Error("Service request not found");
        }

        const vendorId = inferVendorIdFromPayload(input);
        let vendorNameSnap: string | null = null;

        if (vendorId) {
            const vendor = await tx.vendor.findUnique({
                where: { id: vendorId },
                select: { id: true, name: true },
            });
            vendorNameSnap = vendor?.name ?? null;
        }

        const assessment = await repo.upsertAssessment(tx, {
            serviceRequestId,
            movementKind: inferMovementKindFromPayload(input),
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

        const hasOpen = assessment.TechnicalIssue.some(
            (x) =>
                x.executionStatus === TechnicalIssueExecutionStatus.OPEN ||
                x.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS
        );

        if (hasOpen) {
            throw new Error("Còn issue chưa hoàn tất");
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


export async function cancelTechnicalIssue(
    issueId: string,
    opts?: { reason?: string | null }
) {
    const issue = await prisma.technicalIssue.findUnique({
        where: { id: issueId },
        select: {
            id: true,
            executionStatus: true,
            isConfirmed: true,
        } as any,
    });

    if (!issue) {
        throw new Error("Issue không tồn tại");
    }

    const currentStatus = String(issue.executionStatus || "").toUpperCase();

    if (currentStatus === "DONE" || currentStatus === "COMPLETED") {
        throw new Error("Issue đã hoàn tất, không thể hủy");
    }

    return prisma.technicalIssue.update({
        where: { id: issueId },
        data: {
            executionStatus: "CANCELED" as any,
            canceledAt: new Date(),
            resolutionNote: opts?.reason || "Hủy issue từ Issue Board",
        } as any,
    });
}


export async function getServiceRequestTechnicalSummary(serviceRequestId: string) {
    return repo.getTechnicalSummaryByServiceRequest(serviceRequestId);
}

export async function confirmTechnicalIssue(input: {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
}) {
    const id = String(input.id || "").trim();
    if (!id) throw new Error("Missing issue id");

    return prisma.technicalIssue.update({
        where: { id },
        data: {
            isConfirmed: true,
            confirmedAt: new Date(),
            confirmedById: input.actorId ?? null,
            confirmedByNameSnap: input.actorName ?? null,
            updatedAt: new Date(),
        } as any,
    });
}
export async function completeTechnicalIssue(input: {
    id: string;
    actorName?: string | null;
    actualCost?: number | null;
    resolutionNote?: string | null;
}) {
    const id = toText(input.id);
    if (!id) throw new Error("Missing issue id");

    return prisma.$transaction(async (tx) => {
        const issue = await tx.technicalIssue.findUnique({
            where: { id },
            select: {
                id: true,
                executionStatus: true,
            },
        });

        if (!issue) throw new Error("Issue not found");
        if (String(issue.executionStatus || "").toUpperCase() !== "IN_PROGRESS") {
            throw new Error("Issue không ở trạng thái IN_PROGRESS");
        }

        return tx.technicalIssue.update({
            where: { id },
            data: {
                executionStatus: "DONE",
                completedAt: new Date(),
                completedByNameSnap: input.actorName ?? null,
                resolutionNote: toText(input.resolutionNote),
                actualCost:
                    input.actualCost != null && Number.isFinite(Number(input.actualCost))
                        ? Number(input.actualCost)
                        : null,
                updatedAt: new Date(),
            } as any,
        });
    });
}