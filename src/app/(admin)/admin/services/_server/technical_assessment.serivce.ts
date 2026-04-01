import prisma from "@/server/db/client";
import * as repo from "./technical.assessment.repo"
import { MaintenanceEventType, Prisma } from "@prisma/client";

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
        text.includes("CO") ||
        text.includes("MECHANICAL")
    ) {
        return "MECHANICAL";
    }

    return "UNKNOWN";
}

function buildInternalTaskNote(input: {
    diagnosis?: string | null;
    conclusion?: string | null;
    issues: Array<{
        area?: string | null;
        issueType: string;
        serviceCatalogId?: string | null;
        supplyCatalogId?: string | null;
        note?: string | null;
    }>;
    serviceCatalogMap: Map<string, { name: string }>;
    supplyCatalogMap: Map<string, { name: string }>;
}) {
    const lines: string[] = ["[AUTO_TECH_INTERNAL]"];

    if (input.diagnosis) {
        lines.push(`Chẩn đoán: ${input.diagnosis}`);
    }

    if (input.conclusion) {
        lines.push(`Kết luận: ${input.conclusion}`);
    }

    if (input.issues.length) {
        lines.push("Hạng mục nội bộ:");
        input.issues.forEach((x, idx) => {
            const sv = x.serviceCatalogId ? input.serviceCatalogMap.get(x.serviceCatalogId)?.name : null;
            const sp = x.supplyCatalogId ? input.supplyCatalogMap.get(x.supplyCatalogId)?.name : null;

            lines.push(
                `${idx + 1}. ${x.issueType}` +
                (x.area ? ` | ${x.area}` : "") +
                (sv ? ` | ${sv}` : "") +
                (sp ? ` | VT: ${sp}` : "") +
                (x.note ? ` | ${x.note}` : "")
            );
        });
    }

    return lines.join("\n");
}

function buildVendorTaskNote(input: {
    diagnosis?: string | null;
    conclusion?: string | null;
    issues: Array<{
        area?: string | null;
        issueType: string;
        serviceCatalogId?: string | null;
        supplyCatalogId?: string | null;
        note?: string | null;
    }>;
    serviceCatalogMap: Map<string, { name: string }>;
    supplyCatalogMap: Map<string, { name: string }>;
}) {
    const lines: string[] = ["[AUTO_TECH_VENDOR]"];

    if (input.diagnosis) {
        lines.push(`Chẩn đoán: ${input.diagnosis}`);
    }

    if (input.conclusion) {
        lines.push(`Kết luận: ${input.conclusion}`);
    }

    if (input.issues.length) {
        lines.push("Hạng mục chuyển vendor:");
        input.issues.forEach((x, idx) => {
            const sv = x.serviceCatalogId ? input.serviceCatalogMap.get(x.serviceCatalogId)?.name : null;
            const sp = x.supplyCatalogId ? input.supplyCatalogMap.get(x.supplyCatalogId)?.name : null;

            lines.push(
                `${idx + 1}. ${x.issueType}` +
                (x.area ? ` | ${x.area}` : "") +
                (sv ? ` | ${sv}` : "") +
                (sp ? ` | VT: ${sp}` : "") +
                (x.note ? ` | ${x.note}` : "")
            );
        });
    }

    return lines.join("\n");
}

async function syncAutoMaintenanceArtifacts(
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
        vendorId?: string | null;
        vendorNameSnap?: string | null;
        diagnosis?: string | null;
        conclusion?: string | null;
        issues: Array<{
            area?: string | null;
            issueType: "CHECK" | "SERVICE" | "REPAIR" | "REPLACE" | "OBSERVATION";
            actionMode: "NONE" | "INTERNAL" | "VENDOR";
            serviceCatalogId?: string | null;
            supplyCatalogId?: string | null;
            note?: string | null;
            estimatedCost?: number | null;
            sortOrder?: number | null;
        }>;
    }
) {
    const internalIssues = input.issues.filter((x) => x.actionMode === "INTERNAL");
    const vendorIssues = input.issues.filter((x) => x.actionMode === "VENDOR");

    const serviceCatalogIds = Array.from(
        new Set(
            input.issues
                .map((x) => x.serviceCatalogId)
                .filter((x): x is string => !!x)
        )
    );

    const supplyCatalogIds = Array.from(
        new Set(
            input.issues
                .map((x) => x.supplyCatalogId)
                .filter((x): x is string => !!x)
        )
    );

    const [serviceCatalogs, supplyCatalogs] = await Promise.all([
        serviceCatalogIds.length
            ? tx.serviceCatalog.findMany({
                where: { id: { in: serviceCatalogIds } },
                select: { id: true, name: true },
            })
            : Promise.resolve([]),
        supplyCatalogIds.length
            ? tx.supplyCatalog.findMany({
                where: { id: { in: supplyCatalogIds } },
                select: { id: true, name: true, defaultCost: true },
            })
            : Promise.resolve([]),
    ]);

    const serviceCatalogMap = new Map(serviceCatalogs.map((x) => [x.id, { name: x.name }]));
    const supplyCatalogMap = new Map(
        supplyCatalogs.map((x) => [
            x.id,
            {
                name: x.name,
                defaultCost: x.defaultCost != null ? Number(x.defaultCost) : null,
            },
        ])
    );

    // xóa các artifact auto cũ trước khi tạo lại
    const autoRecords = await tx.maintenanceRecord.findMany({
        where: {
            serviceRequestId: input.serviceRequestId,
            OR: [
                { notes: { startsWith: "[AUTO_TECH_INTERNAL]" } },
                { notes: { startsWith: "[AUTO_TECH_VENDOR]" } },
            ],
        },
        select: { id: true },
    });

    if (autoRecords.length) {
        await tx.maintenanceRecord.deleteMany({
            where: {
                id: { in: autoRecords.map((x) => x.id) },
            },
        });
    }

    // internal task
    let internalRecordId: string | null = null;

    if (internalIssues.length) {
        const internalTotal = internalIssues.reduce(
            (sum, x) => sum + Number(x.estimatedCost ?? 0),
            0
        );

        const internalRecord = await tx.maintenanceRecord.create({
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
                eventType: MaintenanceEventType.NOTE,
                notes: buildInternalTaskNote({
                    diagnosis: input.diagnosis,
                    conclusion: input.conclusion,
                    issues: internalIssues,
                    serviceCatalogMap,
                    supplyCatalogMap,
                }),
                totalCost: internalTotal ? new Prisma.Decimal(String(internalTotal)) : null,
                currency: "VND",
                servicedAt: new Date(),
            },
            select: { id: true },
        });

        internalRecordId = internalRecord.id;

        const internalParts = internalIssues
            .filter((x) => x.supplyCatalogId)
            .map((x) => {
                const supply = x.supplyCatalogId ? supplyCatalogMap.get(x.supplyCatalogId) : null;
                return {
                    recordId: internalRecord.id,
                    variantId: null,
                    name: supply?.name || x.supplyCatalogId || "Vật tư",
                    quantity: 1,
                    unitCost: x.estimatedCost != null
                        ? new Prisma.Decimal(String(x.estimatedCost))
                        : supply?.defaultCost != null
                            ? new Prisma.Decimal(String(supply.defaultCost))
                            : null,
                    notes: x.note ?? null,
                };
            });

        if (internalParts.length) {
            await tx.maintenancePart.createMany({
                data: internalParts,
            });
        }
    }

    // vendor task
    if (vendorIssues.length) {
        const vendorTotal = vendorIssues.reduce(
            (sum, x) => sum + Number(x.estimatedCost ?? 0),
            0
        );

        const vendorRecord = await tx.maintenanceRecord.create({
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
                vendorId: input.vendorId ?? null,
                vendorName: input.vendorNameSnap ?? null,
                eventType: MaintenanceEventType.ASSIGN_VENDOR,
                notes: buildVendorTaskNote({
                    diagnosis: input.diagnosis,
                    conclusion: input.conclusion,
                    issues: vendorIssues,
                    serviceCatalogMap,
                    supplyCatalogMap,
                }),
                totalCost: vendorTotal ? new Prisma.Decimal(String(vendorTotal)) : null,
                currency: "VND",
                servicedAt: new Date(),
            },
            select: { id: true },
        });

        const vendorParts = vendorIssues
            .filter((x) => x.supplyCatalogId)
            .map((x) => {
                const supply = x.supplyCatalogId ? supplyCatalogMap.get(x.supplyCatalogId) : null;
                return {
                    recordId: vendorRecord.id,
                    variantId: null,
                    name: supply?.name || x.supplyCatalogId || "Vật tư",
                    quantity: 1,
                    unitCost: x.estimatedCost != null
                        ? new Prisma.Decimal(String(x.estimatedCost))
                        : supply?.defaultCost != null
                            ? new Prisma.Decimal(String(supply.defaultCost))
                            : null,
                    notes: x.note ?? null,
                };
            });

        if (vendorParts.length) {
            await tx.maintenancePart.createMany({
                data: vendorParts,
            });
        }

        // sync vendor snapshot vào service request
        if (input.vendorId) {
            await tx.serviceRequest.update({
                where: { id: input.serviceRequestId },
                data: {
                    vendorId: input.vendorId,
                    vendorNameSnap: input.vendorNameSnap ?? null,
                },
            });
        }
    }

    return {
        internalTaskCreated: !!internalRecordId,
        vendorTaskCreated: vendorIssues.length > 0,
        internalIssueCount: internalIssues.length,
        vendorIssueCount: vendorIssues.length,
    };
}

export async function getTechnicalAssessmentPanel(serviceRequestId: string) {
    const panel = await repo.getPanel(serviceRequestId);
    if (!panel) throw new Error("Không tìm thấy service request");

    if (!panel.assessment) {
        return {
            ...panel,
            assessment: {
                movementKind: inferMovementKind(panel.serviceRequest.movement),
                runningOk: null,
                batteryWeak: false,
                batteryIssueBattery: false,
                batteryIssueIC: false,
                batteryIssueCoil: false,
                preRate: null,
                preAmplitude: null,
                preBeatError: null,
                postRate: null,
                postAmplitude: null,
                postBeatError: null,
                actionMode: "NONE",
                vendorId: null,
                vendorNameSnap: null,
                diagnosis: "",
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
    runningOk?: boolean | null;
    batteryWeak?: boolean | null;
    batteryIssueBattery?: boolean;
    batteryIssueIC?: boolean;
    batteryIssueCoil?: boolean;
    preRate?: number | null;
    preAmplitude?: number | null;
    preBeatError?: number | null;
    postRate?: number | null;
    postAmplitude?: number | null;
    postBeatError?: number | null;
    actionMode?: "NONE" | "INTERNAL" | "VENDOR";
    vendorId?: string | null;
    diagnosis?: string | null;
    conclusion?: string | null;
    imageFileKey?: string | null;
    issues?: Array<{
        area?: string | null;
        issueType: "CHECK" | "SERVICE" | "REPAIR" | "REPLACE" | "OBSERVATION";
        actionMode: "NONE" | "INTERNAL" | "VENDOR";
        serviceCatalogId?: string | null;
        supplyCatalogId?: string | null;
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
                vendorId: true,
                vendorNameSnap: true,
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

        let vendorNameSnap: string | null = null;

        if (input.actionMode === "VENDOR" && input.vendorId) {
            const vendor = await tx.vendor.findUnique({
                where: { id: input.vendorId },
                select: { id: true, name: true },
            });
            vendorNameSnap = vendor?.name ?? null;
        }

        const assessment = await repo.upsertAssessment(tx, {
            serviceRequestId,
            movementKind: (input.movementKind ?? "UNKNOWN") as any,
            runningOk: input.runningOk ?? null,
            batteryWeak: input.batteryWeak ?? null,
            batteryIssueBattery: !!input.batteryIssueBattery,
            batteryIssueIC: !!input.batteryIssueIC,
            batteryIssueCoil: !!input.batteryIssueCoil,
            preRate: input.preRate ?? null,
            preAmplitude: input.preAmplitude ?? null,
            preBeatError: input.preBeatError ?? null,
            postRate: input.postRate ?? null,
            postAmplitude: input.postAmplitude ?? null,
            postBeatError: input.postBeatError ?? null,
            actionMode: (input.actionMode ?? "NONE") as any,
            vendorId: input.actionMode === "VENDOR" ? input.vendorId ?? null : null,
            vendorNameSnap,
            diagnosis: input.diagnosis ?? null,
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            evaluatedById: sr.technicianId ?? null,
            evaluatedByNameSnap: sr.technicianNameSnap ?? null,
            issues: input.issues ?? [],
        });

        const autoArtifacts = await syncAutoMaintenanceArtifacts(tx, {
            serviceRequestId,
            productId: sr.productId ?? null,
            variantId: sr.variantId ?? null,
            brandSnapshot: sr.brandSnapshot ?? null,
            modelSnapshot: sr.modelSnapshot ?? null,
            refSnapshot: sr.refSnapshot ?? null,
            serialSnapshot: sr.serialSnapshot ?? null,
            technicianId: sr.technicianId ?? null,
            technicianNameSnap: sr.technicianNameSnap ?? null,
            vendorId: input.actionMode === "VENDOR" ? input.vendorId ?? null : null,
            vendorNameSnap,
            diagnosis: input.diagnosis ?? null,
            conclusion: input.conclusion ?? null,
            issues: input.issues ?? [],
        });

        return {
            assessment,
            autoArtifacts,
        };
    });
}