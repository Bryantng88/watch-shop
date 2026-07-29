import { prisma } from "@/server/db/client";
import * as repo from "./technical-assessment.repo";
import { createTechnicalChecksFromProductsApplication } from "@/domains/service/application/create-technical-checks-from-products.application";
import {
    ServiceRequestStatus,
    ServiceScope,
    TechnicalAssessmentStatus,
    TechnicalIssueExecutionStatus,
} from "@prisma/client";
import { emitWatchSpecUpdatedEvent } from "@/domains/watch/server/events";

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
    movement?: string | null,
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
    productMovement?: string | null,
): "BATTERY" | "MECHANICAL" {
    return mapProductMovementToMachineType(productMovement) === "QUARTZ"
        ? "BATTERY"
        : "MECHANICAL";
}

function inferMovementStatusFromPayload(input: any): "GOOD" | "ISSUE" {
    const raw = String(
        input?.movement?.status || input?.movementStatus || "",
    ).toUpperCase();
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

function isMechanicalMovement(value: unknown) {
    return !["QUARTZ", "SOLAR", "KINETIC", "MECHAQUARTZ", "HYBRID"].includes(
        String(value ?? "").trim().toUpperCase(),
    );
}

export async function updateServiceMovementMeasurement(input: {
    serviceRequestId: string;
    movementCalibre: string;
    before?: {
        rate?: string | number | null;
        amplitude?: string | number | null;
        beatError?: string | number | null;
    } | null;
    after?: {
        rate?: string | number | null;
        amplitude?: string | number | null;
        beatError?: string | number | null;
    } | null;
    actorUserId?: string | null;
    deferConsumers?: (work: () => Promise<void>) => void;
}) {
    const movementCalibre = toText(input.movementCalibre);
    if (!movementCalibre) throw new Error("Vui lòng nhập mã máy.");

    const result = await prisma.$transaction(async (tx) => {
        const serviceRequest = await tx.serviceRequest.findUnique({
            where: { id: input.serviceRequestId },
            select: {
                id: true,
                product: {
                    select: {
                        id: true,
                        title: true,
                        sku: true,
                        watch: {
                            select: {
                                id: true,
                                productId: true,
                                movementType: true,
                                movementCalibre: true,
                            },
                        },
                    },
                },
            },
        });
        const watch = serviceRequest?.product?.watch;
        if (!serviceRequest || !watch) {
            throw new Error("Không tìm thấy Watch của Service Request.");
        }

        const mechanical = isMechanicalMovement(watch.movementType);
        const measurement = mechanical
            ? {
                preRate: toNumberOrNull(input.before?.rate),
                preAmplitude: toNumberOrNull(input.before?.amplitude),
                preBeatError: toNumberOrNull(input.before?.beatError),
                postRate: toNumberOrNull(input.after?.rate),
                postAmplitude: toNumberOrNull(input.after?.amplitude),
                postBeatError: toNumberOrNull(input.after?.beatError),
            }
            : {
                preRate: null,
                preAmplitude: null,
                preBeatError: null,
                postRate: null,
                postAmplitude: null,
                postBeatError: null,
            };

        await tx.watch.update({
            where: { id: watch.id },
            data: { movementCalibre },
        });
        await tx.watchSpecV2.upsert({
            where: { watchId: watch.id },
            create: {
                watchId: watch.id,
                movementType: watch.movementType,
                calibre: movementCalibre,
            },
            update: { calibre: movementCalibre },
        });
        await tx.technicalAssessment.upsert({
            where: { serviceRequestId: serviceRequest.id },
            create: {
                serviceRequestId: serviceRequest.id,
                movementKind: mechanical ? "MECHANICAL" : "BATTERY",
                status: TechnicalAssessmentStatus.IN_PROGRESS,
                ...measurement,
            },
            update: {
                movementKind: mechanical ? "MECHANICAL" : "BATTERY",
                status: TechnicalAssessmentStatus.IN_PROGRESS,
                updatedAt: new Date(),
                ...measurement,
            },
        });

        return {
            watch: {
                id: watch.id,
                productId: watch.productId,
                product: {
                    title: serviceRequest.product?.title ?? null,
                    sku: serviceRequest.product?.sku ?? null,
                },
            },
            previousCalibre: watch.movementCalibre,
            movementCalibre,
            mechanical,
            measurement,
        };
    });

    if (result.previousCalibre !== result.movementCalibre) {
        await emitWatchSpecUpdatedEvent(prisma, {
            watch: result.watch,
            actorUserId: input.actorUserId ?? null,
            before: { movementCalibre: result.previousCalibre },
            after: { movementCalibre: result.movementCalibre },
        }, { deferConsumers: input.deferConsumers });
    }

    return result;
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
            issueType: String(crown?.action || "").toUpperCase().includes("REPLACE")
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
    },
) {
    const { assessmentId, serviceRequestId, vendorNameMap, payload } = params;

    const existing = await repo.listAssessmentIssuesForSync(tx, assessmentId);

    const openExisting = existing.filter(
        (x: any) => x.executionStatus === TechnicalIssueExecutionStatus.OPEN,
    );

    const desired = buildDesiredIssuesFromPayload(payload);

    const maxSort = await repo.countAssessmentIssues(tx, assessmentId);

    for (let i = 0; i < desired.length; i++) {
        const d = desired[i];
        const current = openExisting.find((x: any) => x.technicalIssueId === d.technicalIssueId) as any;
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
        for (const item of redundant as any[]) {
            await repo.updateAssessmentIssue(tx, item.id, {
                executionStatus: TechnicalIssueExecutionStatus.CANCELED,
                canceledAt: new Date(),
                resolutionNote:
                    "Auto closed because assessment no longer requests this issue",
                updatedAt: new Date(),
            } as any);
        }
    }
}

export async function getTechnicalAssessmentCatalogs() {
    return repo.getTechnicalAssessmentCatalogs();
}

export async function getTechnicalAssessmentPanel(serviceRequestId: string) {
    const panel = await repo.getPanel(serviceRequestId);
    if (!panel) {
        throw new Error("Không tìm thấy service request");
    }

    const maintenanceRecords = await repo.listServiceMaintenanceRecords(
        prisma,
        serviceRequestId,
    );

    const issues = panel.assessment?.issues ?? [];
    const confirmedIssues = issues.filter((x: any) => x.isConfirmed);
    const openIssueCount = confirmedIssues.filter(
        (x: any) =>
            x.executionStatus === TechnicalIssueExecutionStatus.OPEN ||
            x.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS,
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

async function resolveServiceRequestIdForSave(input: any) {
    const existingServiceRequestId = String(input?.serviceRequestId || "").trim();
    if (existingServiceRequestId) return existingServiceRequestId;

    const productId = String(input?.productId || "").trim();
    if (!productId) {
        throw new Error("Missing serviceRequestId or productId");
    }

    const created = await createTechnicalChecksFromProductsApplication({
        productIds: [productId],
        scope: ServiceScope.WITH_PURCHASE,
        notes: "Tạo service request từ đánh giá kỹ thuật watch",
    });

    const createdId = String(created?.[0]?.id || "").trim();
    if (!createdId) {
        throw new Error("Create service request failed");
    }

    return createdId;
}

export async function saveTechnicalAssessment(input: any) {
    const serviceRequestId = await resolveServiceRequestIdForSave(input);
    await assertServiceRequestEditable(serviceRequestId);

    const payload = {
        ...input,
        serviceRequestId,
    };

    const result = await prisma.$transaction(async (tx) => {
        const sr = await tx.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: {
                id: true,
                technicianId: true,
                technicianNameSnap: true,
                product: {
                    select: {
                        title: true,
                        sku: true,
                        watchSpec: {
                            select: {
                                movement: true,
                            },
                        },
                        watch: {
                            select: {
                                id: true,
                                productId: true,
                                movementType: true,
                                movementCalibre: true,
                            },
                        },
                    },
                },
            },
        });

        if (!sr) {
            throw new Error("Service request not found");
        }

        const productMovement =
            sr.product?.watch?.movementType ??
            sr.product?.watchSpec?.movement ??
            null;
        const requestedCalibre = toText(payload?.movement?.calibre);

        const vendorIds = new Set<string>();
        const singleVendorId = inferVendorIdFromPayload(payload);
        if (singleVendorId) vendorIds.add(singleVendorId);

        const movementLines = Array.isArray(payload?.movement?.lines)
            ? payload.movement.lines
            : [];

        movementLines.forEach((x: any) => {
            const id = toText(x?.vendorId);
            if (id) vendorIds.add(id);
        });

        [
            payload?.appearance?.case?.proposal,
            payload?.appearance?.glass?.proposal,
            payload?.appearance?.dial?.proposal,
            payload?.appearance?.crown,
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
            movementStatus: inferMovementStatusFromPayload(payload),
            caseStatus: inferCaseStatusFromPayload(payload),
            crystalStatus: inferCrystalStatusFromPayload(payload),
            crownStatus: inferCrownStatusFromPayload(payload),
            preRate: inferPreRate(payload),
            preAmplitude: inferPreAmplitude(payload),
            preBeatError: inferPreBeatError(payload),
            postRate: inferPostRate(payload),
            postAmplitude: inferPostAmplitude(payload),
            postBeatError: inferPostBeatError(payload),
            actionMode: inferActionModeFromPayload(payload),
            vendorId,
            vendorNameSnap,
            conclusion: inferConclusion(payload),
            imageFileKey: inferImageFileKey(payload),
            status: TechnicalAssessmentStatus.IN_PROGRESS,
            evaluatedById: sr.technicianId ?? null,
            evaluatedByNameSnap: sr.technicianNameSnap ?? null,
        });

        if (requestedCalibre && sr.product?.watch) {
            await tx.watch.update({
                where: { id: sr.product.watch.id },
                data: { movementCalibre: requestedCalibre },
            });
            await tx.watchSpecV2.upsert({
                where: { watchId: sr.product.watch.id },
                create: {
                    watchId: sr.product.watch.id,
                    movementType: sr.product.watch.movementType,
                    calibre: requestedCalibre,
                },
                update: { calibre: requestedCalibre },
            });
        }

        await syncTechnicalIssuesFromAssessment(tx, {
            assessmentId: assessment.id,
            serviceRequestId,
            vendorNameMap,
            payload,
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
            serviceRequestId,
            item: assessment,
            watchSpecUpdate:
                requestedCalibre && sr.product?.watch
                    ? {
                        watch: {
                            id: sr.product.watch.id,
                            productId: sr.product.watch.productId,
                            product: {
                                title: sr.product.title ?? null,
                                sku: sr.product.sku ?? null,
                            },
                        },
                        before: sr.product.watch.movementCalibre,
                        after: requestedCalibre,
                    }
                    : null,
        };
    });

    if (
        result.watchSpecUpdate &&
        result.watchSpecUpdate.before !== result.watchSpecUpdate.after
    ) {
        await emitWatchSpecUpdatedEvent(prisma, {
            watch: result.watchSpecUpdate.watch,
            actorUserId: input.actorUserId ?? null,
            before: { movementCalibre: result.watchSpecUpdate.before },
            after: { movementCalibre: result.watchSpecUpdate.after },
        }, { deferConsumers: input.deferConsumers });
    }

    return result;
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
                    x.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS),
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
                    x.executionStatus === TechnicalIssueExecutionStatus.IN_PROGRESS),
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

export async function assertServiceRequestEditable(serviceRequestId: string) {
    const sr = await repo.findServiceRequestStatusById(serviceRequestId);

    if (!sr) {
        throw new Error("Service request không tồn tại");
    }

    if (String(sr.status).toUpperCase() === "COMPLETED") {
        throw new Error("Service request đã hoàn tất, không thể chỉnh sửa nữa");
    }

    return sr;
}
