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
            primaryImageUrlSnapshot: true,
            technicianId: true,
            technicianNameSnap: true,
            skuSnapshot: true,
            productId: true,
            variantId: true,
            brandSnapshot: true,
            modelSnapshot: true,
            refSnapshot: true,
            serialSnapshot: true,
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
                    variants: {
                        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
                        select: {
                            id: true,
                            costPrice: true,
                        },
                        take: 1,
                    },
                },
            },
            technicalAssessment: {
                select: {
                    id: true,
                    movementKind: true,
                    runningOk: true,
                    batteryWeak: true,
                    batteryIssueBattery: true,
                    batteryIssueIC: true,
                    batteryIssueCoil: true,
                    preRate: true,
                    preAmplitude: true,
                    preBeatError: true,
                    postRate: true,
                    postAmplitude: true,
                    postBeatError: true,
                    diagnosis: true,
                    conclusion: true,
                    imageFileKey: true,
                    status: true,
                    issues: {
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                        select: {
                            id: true,
                            area: true,
                            issueType: true,
                            actionMode: true,
                            vendorId: true,
                            vendorNameSnap: true,
                            serviceCatalogId: true,
                            supplyCatalogId: true,
                            note: true,
                            estimatedCost: true,
                            sortOrder: true,
                        },
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
            select: { id: true, name: true },
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
            productId: sr.productId ?? null,
            variantId: sr.variantId ?? null,
            brandSnapshot: sr.brandSnapshot ?? null,
            modelSnapshot: sr.modelSnapshot ?? null,
            refSnapshot: sr.refSnapshot ?? null,
            serialSnapshot: sr.serialSnapshot ?? null,
            productTitle: sr.product?.title ?? null,
            movement: sr.product?.watchSpec?.movement ?? null,
            model: sr.product?.watchSpec?.model ?? null,
            ref: sr.product?.watchSpec?.ref ?? null,
            primaryImageUrl:
                sr.primaryImageUrlSnapshot ?? sr.product?.primaryImageUrl ?? null,
            productImages: sr.product?.image ?? [],
            primaryVariantId: sr.product?.variants?.[0]?.id ?? sr.variantId ?? null,
            currentVariantCost:
                sr.product?.variants?.[0]?.costPrice != null
                    ? Number(sr.product.variants[0].costPrice)
                    : null,
        },
        assessment: sr.technicalAssessment
            ? {
                id: sr.technicalAssessment.id,
                movementKind: sr.technicalAssessment.movementKind,
                runningOk: sr.technicalAssessment.runningOk,
                batteryWeak: sr.technicalAssessment.batteryWeak,
                batteryIssueBattery: sr.technicalAssessment.batteryIssueBattery,
                batteryIssueIC: sr.technicalAssessment.batteryIssueIC,
                batteryIssueCoil: sr.technicalAssessment.batteryIssueCoil,
                preRate: sr.technicalAssessment.preRate,
                preAmplitude: sr.technicalAssessment.preAmplitude,
                preBeatError:
                    sr.technicalAssessment.preBeatError != null
                        ? Number(sr.technicalAssessment.preBeatError)
                        : null,
                postRate: sr.technicalAssessment.postRate,
                postAmplitude: sr.technicalAssessment.postAmplitude,
                postBeatError:
                    sr.technicalAssessment.postBeatError != null
                        ? Number(sr.technicalAssessment.postBeatError)
                        : null,
                diagnosis: sr.technicalAssessment.diagnosis ?? "",
                conclusion: sr.technicalAssessment.conclusion ?? "",
                imageFileKey: sr.technicalAssessment.imageFileKey ?? null,
                status: sr.technicalAssessment.status,
                issues: sr.technicalAssessment.issues.map((x) => ({
                    id: x.id,
                    area: x.area ?? "",
                    issueType: x.issueType,
                    actionMode: x.actionMode,
                    vendorId: x.vendorId ?? "",
                    vendorNameSnap: x.vendorNameSnap ?? "",
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
        diagnosis?: string | null;
        conclusion?: string | null;
        imageFileKey?: string | null;
        evaluatedById?: string | null;
        evaluatedByNameSnap?: string | null;
        issues: Array<{
            area?: string | null;
            issueType: "CHECK" | "SERVICE" | "REPAIR" | "REPLACE" | "OBSERVATION";
            actionMode: "NONE" | "INTERNAL" | "VENDOR";
            vendorId?: string | null;
            vendorNameSnap?: string | null;
            serviceCatalogId?: string | null;
            supplyCatalogId?: string | null;
            note?: string | null;
            estimatedCost?: number | null;
            sortOrder?: number | null;
        }>;
    }
) {
    const assessment = await tx.technicalAssessment.upsert({
        where: { serviceRequestId: input.serviceRequestId },
        create: {
            id: crypto.randomUUID(),
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
                id: crypto.randomUUID(),
                assessmentId: assessment.id,
                area: x.area ?? null,
                issueType: x.issueType as any,
                actionMode: x.actionMode as any,
                vendorId: x.vendorId || null,
                vendorNameSnap: x.vendorNameSnap || null,
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