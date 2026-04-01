import prisma from "@/server/db/client";
import type { Prisma, TechnicalAssessmentStatus, TechnicalMovementKind } from "@prisma/client";

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
            technicalAssessment: {
                include: {
                    TechnicalIssue: {
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    },
                },
            },
        },
    });

    if (!sr) return null;

    const [serviceCatalogs, supplyCatalogs, mechanicalPartCatalogs, vendors] = await Promise.all([
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
        prisma.mechanicalPartCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: {
                id: true,
                code: true,
                name: true,
                group: true,
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
            productTitle: sr.product?.title ?? null,
            movement: sr.product?.watchSpec?.movement ?? null,
            model: sr.product?.watchSpec?.model ?? null,
            ref: sr.product?.watchSpec?.ref ?? null,
            primaryImageUrl: sr.primaryImageUrlSnapshot ?? sr.product?.primaryImageUrl ?? null,
            productImages: sr.product?.image ?? [],
        },
        assessment: sr.technicalAssessment
            ? {
                movementKind: sr.technicalAssessment.movementKind,
                movementStatus: sr.technicalAssessment.movementStatus,
                caseStatus: sr.technicalAssessment.caseStatus,
                crystalStatus: sr.technicalAssessment.crystalStatus,
                crownStatus: sr.technicalAssessment.crownStatus,
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
                conclusion: sr.technicalAssessment.conclusion ?? "",
                imageFileKey: sr.technicalAssessment.imageFileKey ?? null,
                status: sr.technicalAssessment.status,
                issues: sr.technicalAssessment.TechnicalIssue.map((x) => ({
                    id: x.id,
                    area: x.area ?? "",
                    issueType: x.issueType,
                    actionMode: x.actionMode,
                    vendorId: (x as any).vendorId ?? "",
                    serviceCatalogId: x.serviceCatalogId ?? "",
                    supplyCatalogId: x.supplyCatalogId ?? "",
                    mechanicalPartCatalogId: (x as any).mechanicalPartCatalogId ?? "",
                    note: x.note ?? "",
                    estimatedCost: x.estimatedCost != null ? Number(x.estimatedCost) : null,
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
        mechanicalPartCatalogs: mechanicalPartCatalogs.map((x) => ({
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
        actionMode: "NONE" | "INTERNAL" | "VENDOR";
        vendorId?: string | null;
        vendorNameSnap?: string | null;
        conclusion?: string | null;
        imageFileKey?: string | null;
        status?: TechnicalAssessmentStatus;
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
            mechanicalPartCatalogId?: string | null;
            note?: string | null;
            estimatedCost?: number | null;
            sortOrder?: number | null;
        }>;
    }
) {
    const assessment = await tx.technicalAssessment.upsert({
        where: { serviceRequestId: input.serviceRequestId },
        create: {
            serviceRequestId: input.serviceRequestId,
            movementKind: input.movementKind,
            movementStatus: input.movementStatus as any,
            caseStatus: input.caseStatus as any,
            crystalStatus: input.crystalStatus as any,
            crownStatus: input.crownStatus as any,
            preRate: input.preRate ?? null,
            preAmplitude: input.preAmplitude ?? null,
            preBeatError: input.preBeatError as any,
            postRate: input.postRate ?? null,
            postAmplitude: input.postAmplitude ?? null,
            postBeatError: input.postBeatError as any,
            actionMode: input.actionMode as any,
            vendorId: input.vendorId ?? null,
            vendorNameSnap: input.vendorNameSnap ?? null,
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            status: input.status ?? "DRAFT",
            evaluatedById: input.evaluatedById ?? null,
            evaluatedByNameSnap: input.evaluatedByNameSnap ?? null,
        },
        update: {
            movementKind: input.movementKind,
            movementStatus: input.movementStatus as any,
            caseStatus: input.caseStatus as any,
            crystalStatus: input.crystalStatus as any,
            crownStatus: input.crownStatus as any,
            preRate: input.preRate ?? null,
            preAmplitude: input.preAmplitude ?? null,
            preBeatError: input.preBeatError as any,
            postRate: input.postRate ?? null,
            postAmplitude: input.postAmplitude ?? null,
            postBeatError: input.postBeatError as any,
            actionMode: input.actionMode as any,
            vendorId: input.vendorId ?? null,
            vendorNameSnap: input.vendorNameSnap ?? null,
            conclusion: input.conclusion ?? null,
            imageFileKey: input.imageFileKey ?? null,
            status: input.status ?? "DRAFT",
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
                vendorId: x.vendorId ?? null,
                vendorNameSnap: x.vendorNameSnap ?? null,
                serviceCatalogId: x.serviceCatalogId || null,
                supplyCatalogId: x.supplyCatalogId || null,
                mechanicalPartCatalogId: x.mechanicalPartCatalogId || null,
                note: x.note ?? null,
                estimatedCost: x.estimatedCost as any,
                sortOrder: x.sortOrder ?? idx,
            })) as any,
        });
    }

    return assessment;
}