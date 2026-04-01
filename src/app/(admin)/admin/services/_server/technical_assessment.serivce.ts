import crypto from "node:crypto";
import prisma from "@/server/db/client";
import * as repo from "./technical.assessment.repo";

import {
    MaintenanceEventType,
    Prisma,
    ServiceRequestStatus,
    TechnicalAssessmentStatus,
} from "@prisma/client";

function inferMovementKind(raw?: string | null): "BATTERY" | "MECHANICAL" | "UNKNOWN" {
    const text = String(raw || "").toUpperCase();

    if (!text) return "UNKNOWN";

    if (
        text.includes("QUARTZ") ||
        text.includes("PIN") ||
        text.includes("ECO") ||
        text.includes("SOLAR") ||
        text.includes("KINETIC")
    ) {
        return "BATTERY";
    }

    if (
        text.includes("AUTOMATIC") ||
        text.includes("AUTO") ||
        text.includes("MANUAL") ||
        text.includes("CÓT") ||
        text.includes("MECHANICAL")
    ) {
        return "MECHANICAL";
    }

    return "UNKNOWN";
}

function marker(serviceRequestId: string) {
    return `[AUTO_TECH_ASSESSMENT:${serviceRequestId}]`;
}

function makeStatusChangeNote(nextStatus: ServiceRequestStatus, conclusion?: string | null) {
    return [
        `[AUTO_TECH_STATUS] ${nextStatus}`,
        conclusion ? `Kết luận: ${conclusion}` : null,
    ]
        .filter(Boolean)
        .join("\n");
}

async function syncAutoLogsAndCost(
    tx: Prisma.TransactionClient,
    input: {
        serviceRequestId: string;
        productId?: string | null;
        variantId?: string | null;
        brandSnapshot?: string | null;
        modelSnapshot?: string | null;
        refSnapshot?: string | null;
        serialSnapshot?: string | null;
        technicianId?: string | null;
        technicianNameSnap?: string | null;
        issues: Array<{
            area?: string | null;
            issueType: "CHECK" | "SERVICE" | "REPAIR" | "REPLACE" | "OBSERVATION";
            actionMode: "NONE" | "INTERNAL" | "VENDOR";
            vendorId?: string | null;
            vendorNameSnap?: string | null;
            serviceCatalogId?: string | null;
            supplyCatalogId?: string | null;
            mechanicalPartCatalogId?: string | null;
            note?: string | null;
            estimatedCost?: number | null;
            sortOrder?: number | null;
        }>;
        conclusion?: string | null;
    }
) {
    const mark = marker(input.serviceRequestId);

    const oldAutoLogs = await tx.maintenanceRecord.findMany({
        where: {
            serviceRequestId: input.serviceRequestId,
            notes: { startsWith: mark },
        },
        select: { id: true, totalCost: true },
    });

    const oldAutoTotal = oldAutoLogs.reduce((sum, x) => sum + Number(x.totalCost ?? 0), 0);

    if (oldAutoLogs.length) {
        await tx.maintenanceRecord.deleteMany({
            where: { id: { in: oldAutoLogs.map((x) => x.id) } },
        });
    }

    const vendorIds = Array.from(new Set(input.issues.map((x) => x.vendorId).filter((x): x is string => !!x)));

    const [serviceCatalogs, supplyCatalogs, mechanicalPartCatalogs, vendors] = await Promise.all([
        tx.serviceCatalog.findMany({
            where: {
                id: {
                    in: Array.from(new Set(input.issues.map((x) => x.serviceCatalogId).filter((x): x is string => !!x))),
                },
            },
            select: { id: true, name: true },
        }),
        tx.supplyCatalog.findMany({
            where: {
                id: {
                    in: Array.from(new Set(input.issues.map((x) => x.supplyCatalogId).filter((x): x is string => !!x))),
                },
            },
            select: { id: true, name: true, defaultCost: true },
        }),
        tx.mechanicalPartCatalog.findMany({
            where: {
                id: {
                    in: Array.from(
                        new Set(input.issues.map((x) => x.mechanicalPartCatalogId).filter((x): x is string => !!x))
                    ),
                },
            },
            select: { id: true, name: true, defaultCost: true },
        }),
        vendorIds.length
            ? tx.vendor.findMany({
                where: { id: { in: vendorIds } },
                select: { id: true, name: true },
            })
            : Promise.resolve([]),
    ]);

    const serviceMap = new Map(serviceCatalogs.map((x) => [x.id, x]));
    const supplyMap = new Map(
        supplyCatalogs.map((x) => [x.id, { ...x, defaultCost: x.defaultCost != null ? Number(x.defaultCost) : null }])
    );
    const partMap = new Map(
        mechanicalPartCatalogs.map((x) => [x.id, { ...x, defaultCost: x.defaultCost != null ? Number(x.defaultCost) : null }])
    );
    const vendorMap = new Map(vendors.map((x) => [x.id, x]));

    let newAutoTotal = 0;

    for (const [idx, issue] of input.issues.entries()) {
        const serviceName = issue.serviceCatalogId ? serviceMap.get(issue.serviceCatalogId)?.name : null;
        const supplyName = issue.supplyCatalogId ? supplyMap.get(issue.supplyCatalogId)?.name : null;
        const partName = issue.mechanicalPartCatalogId ? partMap.get(issue.mechanicalPartCatalogId)?.name : null;
        const vendorName = issue.vendorId ? vendorMap.get(issue.vendorId)?.name ?? null : null;

        const cost = Number(issue.estimatedCost ?? 0);
        if (cost > 0) newAutoTotal += cost;

        const lines = [
            `${mark} #${idx + 1}`,
            issue.area ? `Hạng mục: ${issue.area}` : null,
            `Loại xử lý: ${issue.issueType}`,
            serviceName ? `Hạng mục kỹ thuật: ${serviceName}` : null,
            supplyName ? `Vật tư: ${supplyName}` : null,
            partName ? `Linh kiện máy cơ: ${partName}` : null,
            issue.actionMode === "VENDOR"
                ? `Thực hiện: Vendor${vendorName ? ` (${vendorName})` : ""}`
                : issue.actionMode === "INTERNAL"
                    ? "Thực hiện: Nội bộ"
                    : "Thực hiện: Chưa rõ",
            input.conclusion ? `Kết luận: ${input.conclusion}` : null,
            issue.note ? `Ghi chú: ${issue.note}` : null,
        ].filter(Boolean);

        const createdLog = await tx.maintenanceRecord.create({
            data: {
                serviceRequestId: input.serviceRequestId,
                productId: input.productId ?? null,
                variantId: input.variantId ?? null,
                brandSnapshot: input.brandSnapshot ?? null,
                modelSnapshot: input.modelSnapshot ?? null,
                refSnapshot: input.refSnapshot ?? null,
                serialSnapshot: input.serialSnapshot ?? null,
                technicianId: input.technicianId ?? null,
                technicianNameSnap: input.technicianNameSnap ?? null,
                vendorId: issue.actionMode === "VENDOR" ? issue.vendorId ?? null : null,
                vendorName: issue.actionMode === "VENDOR" ? vendorName ?? issue.vendorNameSnap ?? null : null,
                eventType:
                    issue.actionMode === "VENDOR"
                        ? MaintenanceEventType.ASSIGN_VENDOR
                        : MaintenanceEventType.NOTE,
                notes: lines.join("\n"),
                totalCost: cost > 0 ? new Prisma.Decimal(String(cost)) : null,
                currency: "VND",
                servicedAt: new Date(),
            },
            select: { id: true },
        });

        if (issue.supplyCatalogId || issue.mechanicalPartCatalogId) {
            const supply = issue.supplyCatalogId ? supplyMap.get(issue.supplyCatalogId) : null;
            const part = issue.mechanicalPartCatalogId ? partMap.get(issue.mechanicalPartCatalogId) : null;

            await tx.maintenancePart.create({
                data: {
                    recordId: createdLog.id,
                    variantId: null,
                    name: supply?.name || part?.name || "Vật tư / linh kiện",
                    quantity: 1,
                    unitCost:
                        cost > 0
                            ? new Prisma.Decimal(String(cost))
                            : supply?.defaultCost != null
                                ? new Prisma.Decimal(String(supply.defaultCost))
                                : part?.defaultCost != null
                                    ? new Prisma.Decimal(String(part.defaultCost))
                                    : null,
                    notes: issue.note ?? null,
                } as any,
            });
        }
    }

    if (input.variantId) {
        const currentVariant = await tx.productVariant.findUnique({
            where: { id: input.variantId },
            select: { id: true, costPrice: true },
        });

        if (currentVariant) {
            const currentCost = Number(currentVariant.costPrice ?? 0);
            const nextCost = Math.max(0, currentCost - oldAutoTotal + newAutoTotal);

            await tx.productVariant.update({
                where: { id: currentVariant.id },
                data: { costPrice: new Prisma.Decimal(String(nextCost)) },
            });
        }
    }

    return { oldAutoTotal, newAutoTotal };
}

export async function getTechnicalAssessmentPanel(serviceRequestId: string) {
    const panel = await repo.getPanel(serviceRequestId);
    if (!panel) throw new Error("Không tìm thấy service request");

    if (!panel.assessment) {
        return {
            ...panel,
            assessment: {
                movementKind: inferMovementKind(panel.serviceRequest.movement),
                movementStatus: "GOOD",
                caseStatus: "GOOD",
                crystalStatus: "GOOD",
                crownStatus: "GOOD",
                preRate: null,
                preAmplitude: null,
                preBeatError: null,
                postRate: null,
                postAmplitude: null,
                postBeatError: null,
                conclusion: "",
                imageFileKey:
                    panel.serviceRequest.primaryImageUrl ??
                    panel.serviceRequest.productImages?.[0]?.fileKey ??
                    null,
                status: "DRAFT",
                issues: [],
            },
        };
    }

    return panel;
}

export async function saveTechnicalAssessment(input: {
    serviceRequestId: string;
    movementKind?: "BATTERY" | "MECHANICAL" | "UNKNOWN";
    movementStatus: "GOOD" | "ISSUE";
    caseStatus: "GOOD" | "ISSUE";
    crystalStatus: "GOOD" | "ISSUE";
    crownStatus: "GOOD" | "ISSUE";
    preRate?: number | null;
    preAmplitude?: number | null;
    preBeatError?: number | null;
    postRate?: number | null;
    postAmplitude?: number | null;
    postBeatError?: number | null;
    conclusion?: string | null;
    imageFileKey?: string | null;
    issues?: Array<{
        area?: string | null;
        issueType: "CHECK" | "SERVICE" | "REPAIR" | "REPLACE" | "OBSERVATION";
        actionMode: "NONE" | "INTERNAL" | "VENDOR";
        vendorId?: string | null;
        serviceCatalogId?: string | null;
        supplyCatalogId?: string | null;
        mechanicalPartCatalogId?: string | null;
        note?: string | null;
        estimatedCost?: number | null;
        sortOrder?: number | null;
    }>;
}) {
    const serviceRequestId = String(input.serviceRequestId || "").trim();
    if (!serviceRequestId) throw new Error("Missing serviceRequestId");

    return prisma.$transaction(async (tx) => {
        const sr = await tx.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: {
                id: true,
                status: true,
                technicianId: true,
                technicianNameSnap: true,
                productId: true,
                variantId: true,
                brandSnapshot: true,
                modelSnapshot: true,
                refSnapshot: true,
                serialSnapshot: true,
            },
        });

        if (!sr) throw new Error("Service request not found");

        const movementKind = input.movementKind ?? "UNKNOWN";

        const normalizedIssues = Array.isArray(input.issues)
            ? input.issues.map((x, idx) => ({
                area: x.area ?? null,
                issueType: x.issueType,
                actionMode: x.actionMode ?? "NONE",
                vendorId: x.vendorId ?? null,
                vendorNameSnap: null,
                serviceCatalogId: x.serviceCatalogId ?? null,
                supplyCatalogId: x.supplyCatalogId ?? null,
                mechanicalPartCatalogId: x.mechanicalPartCatalogId ?? null,
                note: x.note ?? null,
                estimatedCost: x.estimatedCost ?? null,
                sortOrder: x.sortOrder ?? idx,
            }))
            : [];

        const vendorIds = Array.from(new Set(normalizedIssues.map((x) => x.vendorId).filter((x): x is string => !!x)));
        const vendors = vendorIds.length
            ? await tx.vendor.findMany({
                where: { id: { in: vendorIds } },
                select: { id: true, name: true },
            })
            : [];
        const vendorMap = new Map(vendors.map((x) => [x.id, x.name]));

        const issuesWithVendorSnap = normalizedIssues.map((x) => ({
            ...x,
            vendorNameSnap: x.vendorId ? vendorMap.get(x.vendorId) ?? null : null,
        }));

        const hasAnyIssue =
            input.movementStatus === "ISSUE" ||
            input.caseStatus === "ISSUE" ||
            input.crystalStatus === "ISSUE" ||
            input.crownStatus === "ISSUE" ||
            issuesWithVendorSnap.length > 0;

        const nextServiceStatus = hasAnyIssue
            ? ServiceRequestStatus.IN_PROGRESS
            : ServiceRequestStatus.COMPLETED;

        const nextAssessmentStatus = TechnicalAssessmentStatus.COMPLETED;

        const topLevelActionMode: "NONE" | "INTERNAL" | "VENDOR" =
            issuesWithVendorSnap.some((x) => x.actionMode === "VENDOR")
                ? "VENDOR"
                : issuesWithVendorSnap.some((x) => x.actionMode === "INTERNAL")
                    ? "INTERNAL"
                    : "NONE";

        const firstVendor = issuesWithVendorSnap.find((x) => x.vendorId)?.vendorId ?? null;
        const firstVendorName = firstVendor ? vendorMap.get(firstVendor) ?? null : null;

        const assessment = await repo.upsertAssessment(tx, {
            serviceRequestId,
            movementKind,
            movementStatus: input.movementStatus,
            caseStatus: input.caseStatus,
            crystalStatus: input.crystalStatus,
            crownStatus: input.crownStatus,
            preRate: input.preRate ?? null,
            preAmplitude: input.preAmplitude ?? null,
            preBeatError: input.preBeatError ?? null,
            postRate: input.postRate ?? null,
            postAmplitude: input.postAmplitude ?? null,
            postBeatError: input.postBeatError ?? null,
            actionMode: topLevelActionMode,
            vendorId: firstVendor,
            vendorNameSnap: firstVendorName,
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            status: nextAssessmentStatus,
            evaluatedById: sr.technicianId ?? null,
            evaluatedByNameSnap: sr.technicianNameSnap ?? null,
            issues: issuesWithVendorSnap,
        });

        const autoArtifacts = await syncAutoLogsAndCost(tx, {
            serviceRequestId,
            productId: sr.productId ?? null,
            variantId: sr.variantId ?? null,
            brandSnapshot: sr.brandSnapshot ?? null,
            modelSnapshot: sr.modelSnapshot ?? null,
            refSnapshot: sr.refSnapshot ?? null,
            serialSnapshot: sr.serialSnapshot ?? null,
            technicianId: sr.technicianId ?? null,
            technicianNameSnap: sr.technicianNameSnap ?? null,
            conclusion: input.conclusion ?? null,
            issues: issuesWithVendorSnap,
        });

        if (nextServiceStatus !== sr.status) {
            await tx.serviceRequest.update({
                where: { id: serviceRequestId },
                data: {
                    status: nextServiceStatus,
                    vendorId: firstVendor,
                    vendorNameSnap: firstVendorName,
                    updatedAt: new Date(),
                },
            });

            await tx.maintenanceRecord.create({
                data: {
                    id: crypto.randomUUID(),
                    serviceRequestId,
                    productId: sr.productId ?? null,
                    variantId: sr.variantId ?? null,
                    brandSnapshot: sr.brandSnapshot ?? null,
                    modelSnapshot: sr.modelSnapshot ?? null,
                    refSnapshot: sr.refSnapshot ?? null,
                    serialSnapshot: sr.serialSnapshot ?? null,
                    technicianId: sr.technicianId ?? null,
                    technicianNameSnap: sr.technicianNameSnap ?? null,
                    vendorId: firstVendor,
                    vendorName: firstVendorName,
                    eventType: MaintenanceEventType.NOTE,
                    notes: makeStatusChangeNote(nextServiceStatus, input.conclusion ?? null),
                    currency: "VND",
                    servicedAt: new Date(),
                },
            });
        }

        return {
            assessment,
            autoArtifacts,
            serviceRequestStatus: nextServiceStatus,
        };
    });
}