import prisma from "@/server/db/client";
import type { Prisma, TechnicalMovementKind } from "@prisma/client";

export async function getPanel(serviceRequestId: string) {
    const sr = await prisma.serviceRequest.findUnique({
        where: { id: serviceRequestId },
        select: {
            id: true,
            refNo: true,
            status: true,
            scope: true,
            notes: true,
            productId: true,
            skuSnapshot: true,
            primaryImageUrlSnapshot: true,
            technicianId: true,
            technicianNameSnap: true,
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
                    image: {
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                        select: { fileKey: true, role: true },
                        take: 8,
                    },
                },
            },
            TechnicalAssessment: {
                include: {
                    TechnicalIssue: {
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    },
                },
            },
        },
    });

    if (!sr) return null;

    const [serviceCatalogs, supplyCatalogs, vendors] = await Promise.all([
        prisma.serviceCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: {
                id: true,
                code: true,
                name: true,
                vendorPrice: true,
                customerPrice: true,
                internalCost: true,
                note: true,
            },
        }),
        prisma.supplyCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: {
                id: true,
                code: true,
                name: true,
                category: true,
                unit: true,
                defaultCost: true,
                note: true,
            },
        }),
        prisma.vendor.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
            },
        }),
    ]);

    return {
        serviceRequest: {
            id: sr.id,
            refNo: sr.refNo ?? null,
            status: sr.status,
            scope: sr.scope ?? null,
            notes: sr.notes ?? null,
            skuSnapshot: sr.skuSnapshot ?? null,
            productTitle: sr.product?.title ?? null,
            movement: sr.product?.watchSpec?.movement ?? null,
            model: sr.product?.watchSpec?.model ?? null,
            ref: sr.product?.watchSpec?.ref ?? null,
            primaryImageUrl:
                sr.primaryImageUrlSnapshot ?? sr.product?.primaryImageUrl ?? null,
            productImages: sr.product?.image ?? [],
        },
        assessment: sr.TechnicalAssessment
            ? {
                id: sr.TechnicalAssessment.id,
                movementKind: sr.TechnicalAssessment.movementKind,
                runningOk: sr.TechnicalAssessment.runningOk,
                batteryWeak: sr.TechnicalAssessment.batteryWeak,
                batteryIssueBattery: sr.TechnicalAssessment.batteryIssueBattery,
                batteryIssueIC: sr.TechnicalAssessment.batteryIssueIC,
                batteryIssueCoil: sr.TechnicalAssessment.batteryIssueCoil,
                preRate: sr.TechnicalAssessment.preRate,
                preAmplitude: sr.TechnicalAssessment.preAmplitude,
                preBeatError:
                    sr.TechnicalAssessment.preBeatError != null
                        ? Number(sr.TechnicalAssessment.preBeatError)
                        : null,
                postRate: sr.TechnicalAssessment.postRate,
                postAmplitude: sr.TechnicalAssessment.postAmplitude,
                postBeatError:
                    sr.TechnicalAssessment.postBeatError != null
                        ? Number(sr.TechnicalAssessment.postBeatError)
                        : null,
                actionMode: sr.TechnicalAssessment.actionMode,
                vendorId: sr.TechnicalAssessment.vendorId ?? null,
                vendorNameSnap: sr.TechnicalAssessment.vendorNameSnap ?? null,
                diagnosis: sr.TechnicalAssessment.diagnosis ?? "",
                conclusion: sr.TechnicalAssessment.conclusion ?? "",
                imageFileKey: sr.TechnicalAssessment.imageFileKey ?? null,
                status: sr.TechnicalAssessment.status,
                issues: sr.TechnicalAssessment.TechnicalIssue.map((x) => ({
                    id: x.id,
                    area: x.area ?? "",
                    issueType: x.issueType,
                    actionMode: x.actionMode,
                    serviceCatalogId: x.serviceCatalogId ?? "",
                    supplyCatalogId: x.supplyCatalogId ?? "",
                    note: x.note ?? "",
                    estimatedCost:
                        x.estimatedCost != null ? Number(x.estimatedCost) : null,
                    sortOrder: x.sortOrder ?? 0,
                })),
            }
            : null,
        serviceCatalogs: serviceCatalogs.map((x) => ({
            ...x,
            vendorPrice: x.vendorPrice != null ? Number(x.vendorPrice) : null,
            customerPrice: x.customerPrice != null ? Number(x.customerPrice) : null,
            internalCost: x.internalCost != null ? Number(x.internalCost) : null,
        })),
        supplyCatalogs: supplyCatalogs.map((x) => ({
            ...x,
            defaultCost: x.defaultCost != null ? Number(x.defaultCost) : null,
        })),
        vendors,
    };
}

export async function upsertAssessment(
    tx: Prisma.TransactionClient,
    input: {
        serviceRequestId: string;
        movementKind: TechnicalMovementKind;
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
        actionMode: "NONE" | "INTERNAL" | "VENDOR";
        vendorId?: string | null;
        vendorNameSnap?: string | null;
        diagnosis?: string | null;
        conclusion?: string | null;
        imageFileKey?: string | null;
        evaluatedById?: string | null;
        evaluatedByNameSnap?: string | null;
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
    const assessment = await tx.TechnicalAssessment.upsert({
        where: { serviceRequestId: input.serviceRequestId },
        create: {
            serviceRequestId: input.serviceRequestId,
            movementKind: input.movementKind,
            runningOk: input.runningOk ?? null,
            batteryWeak: input.batteryWeak ?? null,
            batteryIssueBattery: !!input.batteryIssueBattery,
            batteryIssueIC: !!input.batteryIssueIC,
            batteryIssueCoil: !!input.batteryIssueCoil,
            preRate: input.preRate ?? null,
            preAmplitude: input.preAmplitude ?? null,
            preBeatError: input.preBeatError as any,
            postRate: input.postRate ?? null,
            postAmplitude: input.postAmplitude ?? null,
            postBeatError: input.postBeatError as any,
            actionMode: input.actionMode as any,
            vendorId: input.vendorId ?? null,
            vendorNameSnap: input.vendorNameSnap ?? null,
            diagnosis: input.diagnosis ?? null,
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            evaluatedById: input.evaluatedById ?? null,
            evaluatedByNameSnap: input.evaluatedByNameSnap ?? null,
        },
        update: {
            movementKind: input.movementKind,
            runningOk: input.runningOk ?? null,
            batteryWeak: input.batteryWeak ?? null,
            batteryIssueBattery: !!input.batteryIssueBattery,
            batteryIssueIC: !!input.batteryIssueIC,
            batteryIssueCoil: !!input.batteryIssueCoil,
            preRate: input.preRate ?? null,
            preAmplitude: input.preAmplitude ?? null,
            preBeatError: input.preBeatError as any,
            postRate: input.postRate ?? null,
            postAmplitude: input.postAmplitude ?? null,
            postBeatError: input.postBeatError as any,
            actionMode: input.actionMode as any,
            vendorId: input.vendorId ?? null,
            vendorNameSnap: input.vendorNameSnap ?? null,
            diagnosis: input.diagnosis ?? null,
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            evaluatedById: input.evaluatedById ?? null,
            evaluatedByNameSnap: input.evaluatedByNameSnap ?? null,
        },
        select: { id: true },
    });

    await tx.technicalIssue.deleteMany({
        where: { assessmentId: assessment.id },
    });

    if (input.issues.length) {
        await tx.technicalIssue.createMany({
            data: input.issues.map((x, idx) => ({
                assessmentId: assessment.id,
                area: x.area ?? null,
                issueType: x.issueType as any,
                actionMode: x.actionMode as any,
                serviceCatalogId: x.serviceCatalogId || null,
                supplyCatalogId: x.supplyCatalogId || null,
                note: x.note ?? null,
                estimatedCost: x.estimatedCost as any,
                sortOrder: x.sortOrder ?? idx,
            })),
        });
    }

    return assessment;
}