import { prisma } from "@/server/db/client";
import {
    Prisma,
    TechnicalActionMode,
    TechnicalAssessmentStatus,
    TechnicalIssueType,
    TechnicalMovementKind,
    TechnicalSectionStatus,
} from "@prisma/client";

function mapMachineType(type?: string): TechnicalMovementKind {
    switch (type) {
        case "MECHANICAL":
            return TechnicalMovementKind.MECHANICAL;
        case "BATTERY":
            return TechnicalMovementKind.BATTERY;
        default:
            return TechnicalMovementKind.UNKNOWN;
    }
}

function mapSectionStatus(hasIssue: boolean): TechnicalSectionStatus {
    return hasIssue
        ? TechnicalSectionStatus.ISSUE
        : TechnicalSectionStatus.GOOD;
}

function mapIssueActionMode(mode?: string): TechnicalActionMode {
    switch (mode) {
        case "VENDOR":
            return TechnicalActionMode.VENDOR;
        case "INHOUSE":
            return TechnicalActionMode.INTERNAL;
        default:
            return TechnicalActionMode.INTERNAL;
    }
}

function mapAssessmentActionMode(payload: any): TechnicalActionMode {
    const movementLines = payload.movement?.lines ?? [];

    const hasAnyMovementWork = movementLines.some((line: any) => !!line.action);
    const hasCrownWork =
        payload.appearance?.crown?.status === "ISSUE" &&
        !!payload.appearance?.crown?.action;
    const hasAppearanceProposal =
        !!payload.appearance?.case?.proposal?.enabled ||
        !!payload.appearance?.glass?.proposal?.enabled ||
        !!payload.appearance?.dial?.proposal?.enabled;

    const hasAnyWork = hasAnyMovementWork || hasCrownWork || hasAppearanceProposal;

    if (!hasAnyWork) {
        return TechnicalActionMode.NONE;
    }

    const hasVendor =
        movementLines.some((line: any) => line.execution === "VENDOR") ||
        payload.appearance?.crown?.execution === "VENDOR" ||
        payload.appearance?.case?.proposal?.execution === "VENDOR" ||
        payload.appearance?.glass?.proposal?.execution === "VENDOR" ||
        payload.appearance?.dial?.proposal?.execution === "VENDOR";

    return hasVendor
        ? TechnicalActionMode.VENDOR
        : TechnicalActionMode.INTERNAL;
}

function toIntOrNull(value?: string | number | null): number | null {
    if (value === undefined || value === null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toDecimalOrNull(value?: string | number | null): Prisma.Decimal | null {
    if (value === undefined || value === null || value === "") return null;
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return new Prisma.Decimal(n);
}

async function getVendorSnapshot(vendorId?: string | null) {
    if (!vendorId) {
        return { vendorId: null, vendorNameSnap: null };
    }

    const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId },
        select: { id: true, name: true },
    });

    return {
        vendorId: vendor?.id ?? null,
        vendorNameSnap: vendor?.name ?? null,
    };
}

function getPrimaryVendorId(payload: any): string | null {
    for (const line of payload.movement?.lines ?? []) {
        if (line.vendorId) return line.vendorId;
    }

    if (payload.appearance?.crown?.vendorId) {
        return payload.appearance.crown.vendorId;
    }

    const proposalVendorId =
        payload.appearance?.case?.proposal?.vendorId ??
        payload.appearance?.glass?.proposal?.vendorId ??
        payload.appearance?.dial?.proposal?.vendorId;

    return proposalVendorId ?? null;
}

export async function upsertTechnicalAssessment(
    payload: any,
    opts?: {
        evaluatedById?: string | null;
        evaluatedByNameSnap?: string | null;
    }
) {
    const { serviceRequestId, movement, appearance, conclusion, productSnapshot } = payload;

    const primaryVendorId = getPrimaryVendorId(payload);
    const vendorSnap = await getVendorSnapshot(primaryVendorId);

    const data = {
        serviceRequestId,

        movementKind: mapMachineType(movement?.machineType),

        preRate: toIntOrNull(movement?.beforeSpecs?.rate),
        preAmplitude: toIntOrNull(movement?.beforeSpecs?.amp),
        preBeatError: toDecimalOrNull(movement?.beforeSpecs?.err),

        postRate: toIntOrNull(movement?.afterSpecs?.rate),
        postAmplitude: toIntOrNull(movement?.afterSpecs?.amp),
        postBeatError: toDecimalOrNull(movement?.afterSpecs?.err),

        actionMode: mapAssessmentActionMode(payload),

        vendorId: vendorSnap.vendorId,
        vendorNameSnap: vendorSnap.vendorNameSnap,

        conclusion: conclusion ?? null,
        imageFileKey: productSnapshot?.image ?? null,

        status: TechnicalAssessmentStatus.DRAFT,

        evaluatedById: opts?.evaluatedById ?? null,
        evaluatedByNameSnap: opts?.evaluatedByNameSnap ?? null,

        movementStatus: mapSectionStatus(movement?.status === "ISSUE"),
        caseStatus: mapSectionStatus((appearance?.case?.issues?.length ?? 0) > 0),
        crystalStatus: mapSectionStatus((appearance?.glass?.issues?.length ?? 0) > 0),
        crownStatus: mapSectionStatus(appearance?.crown?.status === "ISSUE"),
    };

    return prisma.technicalAssessment.upsert({
        where: { serviceRequestId },
        update: data,
        create: data,
    });
}

export async function replaceTechnicalIssues(
    assessmentId: string,
    payload: any
) {
    await prisma.technicalIssue.deleteMany({
        where: { assessmentId },
    });

    const rows: Prisma.TechnicalIssueCreateManyInput[] = [];

    let sortOrder = 0;

    // 1) Movement lines
    for (const line of payload.movement?.lines ?? []) {
        if (!line.action) continue;

        const vendorSnap = await getVendorSnapshot(line.vendorId);

        rows.push({
            assessmentId,
            area: "MOVEMENT",
            issueType: TechnicalIssueType.CHECK,
            actionMode: mapIssueActionMode(line.execution),
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: line.partId ?? null,
            note: [
                "Xử lý máy",
                line.action ? `Action: ${line.action}` : null,
                line.note ?? null,
            ]
                .filter(Boolean)
                .join(" | "),
            estimatedCost: toDecimalOrNull(line.cost),
            sortOrder: sortOrder++,
            vendorId: vendorSnap.vendorId,
            vendorNameSnap: vendorSnap.vendorNameSnap,
        });
    }

    // 2) Case issues
    for (const code of payload.appearance?.case?.issues ?? []) {
        rows.push({
            assessmentId,
            area: "CASE",
            issueType: TechnicalIssueType.CHECK,
            actionMode: TechnicalActionMode.INTERNAL,
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: null,
            note: [code, payload.appearance?.case?.note ?? null].filter(Boolean).join(" | "),
            estimatedCost: null,
            sortOrder: sortOrder++,
            vendorId: null,
            vendorNameSnap: null,
        });
    }

    // 3) Glass issues
    for (const code of payload.appearance?.glass?.issues ?? []) {
        rows.push({
            assessmentId,
            area: "CRYSTAL",
            issueType: TechnicalIssueType.CHECK,
            actionMode: TechnicalActionMode.INTERNAL,
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: null,
            note: [code, payload.appearance?.glass?.note ?? null].filter(Boolean).join(" | "),
            estimatedCost: null,
            sortOrder: sortOrder++,
            vendorId: null,
            vendorNameSnap: null,
        });
    }

    // 4) Dial issues
    for (const code of payload.appearance?.dial?.issues ?? []) {
        rows.push({
            assessmentId,
            area: "DIAL",
            issueType: TechnicalIssueType.CHECK,
            actionMode: TechnicalActionMode.INTERNAL,
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: null,
            note: [code, payload.appearance?.dial?.note ?? null].filter(Boolean).join(" | "),
            estimatedCost: null,
            sortOrder: sortOrder++,
            vendorId: null,
            vendorNameSnap: null,
        });
    }

    // 5) Crown
    if (
        payload.appearance?.crown?.status === "ISSUE" &&
        payload.appearance?.crown?.action
    ) {
        const vendorSnap = await getVendorSnapshot(payload.appearance?.crown?.vendorId);

        rows.push({
            assessmentId,
            area: "CROWN",
            issueType: TechnicalIssueType.CHECK,
            actionMode: mapIssueActionMode(payload.appearance?.crown?.execution),
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: payload.appearance?.crown?.partId ?? null,
            note: [
                payload.appearance?.crown?.action,
                payload.appearance?.crown?.note ?? null,
            ]
                .filter(Boolean)
                .join(" | "),
            estimatedCost: toDecimalOrNull(payload.appearance?.crown?.cost),
            sortOrder: sortOrder++,
            vendorId: vendorSnap.vendorId,
            vendorNameSnap: vendorSnap.vendorNameSnap,
        });
    }

    // 6) Appearance proposals (soft approve)
    const proposalParts = [
        {
            area: "CASE",
            proposal: payload.appearance?.case?.proposal,
        },
        {
            area: "CRYSTAL",
            proposal: payload.appearance?.glass?.proposal,
        },
        {
            area: "DIAL",
            proposal: payload.appearance?.dial?.proposal,
        },
    ];

    for (const item of proposalParts) {
        if (!item.proposal?.enabled) continue;

        const vendorSnap = await getVendorSnapshot(item.proposal.vendorId);

        rows.push({
            assessmentId,
            area: item.area,
            issueType: TechnicalIssueType.CHECK,
            actionMode: mapIssueActionMode(item.proposal.execution),
            serviceCatalogId: null,
            supplyCatalogId: null,
            mechanicalPartCatalogId: null,
            note: [
                `PROPOSAL: ${item.proposal.action ?? ""}`,
                item.proposal.note ?? null,
                "AUTO_APPROVED",
            ]
                .filter(Boolean)
                .join(" | "),
            estimatedCost: toDecimalOrNull(item.proposal.estimatedCost),
            sortOrder: sortOrder++,
            vendorId: vendorSnap.vendorId,
            vendorNameSnap: vendorSnap.vendorNameSnap,
        });
    }

    if (!rows.length) return [];

    await prisma.technicalIssue.createMany({
        data: rows,
    });

    return rows;
}