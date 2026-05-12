"use server";

import {
    Prisma,
    CaseType,
    MovementType,
    Glass,
    Strap,
    WatchCaseMaterialFamily,
    WatchGoldColorV2,
} from "@prisma/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/server/db/client";
import { s3, S3_BUCKET } from "@/server/s3";
import { normalizeKey } from "@/server/lib/storage-key";
import { generateAcquisitionSpec } from "./acquisition-ai.service";
import { resolveBrandFromAcquisitionAi } from "./acquisition-brand-resolver";
import { computeWatchSpecStatus } from "./helper/watch-spec-status.helper";
import { appendAcquisitionSpecJobLog } from "./acquisition-spec-job-log.service";
import { applyWatchTitleAndSkuForSpec } from "@/domains/watch/server/core/write/watch-write.service";

type Tx = Prisma.TransactionClient;
type JsonObject = Record<string, any>;

type PreparedAcquisitionSpecJob =
    | {
        skip: true;
        jobId: string;
        item: any;
    }
    | {
        skip: false;
        jobId: string;
        item: any;
        watch: any;
        ai: any;
        imageEntries: Array<{ key?: string | null; url?: string | null }>;
        resolvedBrand: any;
        resolvedBrandName: string | null;
        mappedMovementType?: MovementType;
        mappedCaseShape?: CaseType;
        mappedCrystal?: Glass;
        mappedBraceletType?: Strap;
        mappedPrimaryCaseMaterial: WatchCaseMaterialFamily;
        mappedGoldColors?: WatchGoldColorV2[];
        inferredCaseSize: Prisma.Decimal | null;
        inferredThickness: Prisma.Decimal | null;
        inferredYearText: string | null;
        inferredCalibre: string | null;
        inferredReference: string | null;
        inferredModel: string | null;
        inferredDialColor: string | null;
        specStatus: "PENDING" | "PARTIAL" | "READY";
    };

function safeJsonParse<T = JsonObject>(value?: string | null): T {
    if (!value) return {} as T;
    try {
        return JSON.parse(value) as T;
    } catch {
        return {} as T;
    }
}

function stringifyJson(value: unknown) {
    return JSON.stringify(value ?? {});
}

function getAiMetaFromDescription(description?: string | null) {
    const meta = safeJsonParse<JsonObject>(description);
    return meta?.aiMeta ?? {};
}

function getImageEntriesFromAiMeta(
    aiMeta: any
): Array<{ key?: string | null; url?: string | null }> {
    return Array.isArray(aiMeta?.images) ? aiMeta.images : [];
}

async function safeAppendLog(input: {
    acquisitionSpecJobId: string;
    acquisitionItemId: string;
    acquisitionId?: string | null;
    productId?: string | null;
    stage: string;
    level?: "INFO" | "WARN" | "ERROR";
    message: string;
    payload?: unknown;
}) {
    try {
        await appendAcquisitionSpecJobLog(input);
    } catch (error) {
        console.error("[ACQ_SPEC][LOG_APPEND_FAILED]", error);
    }
}

async function persistAiDraftToItem(
    tx: Tx,
    itemId: string,
    description: string | null | undefined,
    input: {
        aiHint?: string | null;
        images?: Array<{ key?: string | null; url?: string | null }>;
        ai: unknown;
    }
) {
    const meta = safeJsonParse<JsonObject>(description);

    await tx.acquisitionItem.update({
        where: { id: itemId },
        data: {
            description: stringifyJson({
                ...meta,
                aiMeta: {
                    ...(meta.aiMeta ?? {}),
                    aiHint: input.aiHint ?? meta?.aiMeta?.aiHint ?? null,
                    images: input.images ?? meta?.aiMeta?.images ?? [],
                    ai: input.ai,
                },
            }),
        },
    });
}

function s(value: unknown) {
    const text = String(value ?? "").trim();
    return text || null;
}

function decimalOrNull(value: unknown) {
    if (value == null || value === "") return null;
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    return new Prisma.Decimal(num);
}

function mapCaseShape(value: unknown): CaseType | undefined {
    const text = s(value)?.toUpperCase();
    switch (text) {
        case "ROUND":
        case "TANK":
        case "SQUARE":
        case "TONNEAU":
        case "CUSHION":
        case "OVAL":
        case "ASYMMETRICAL":
        case "OCTAGON":
        case "POLYGON":
        case "SPECIAL":
            return text as CaseType;
        default:
            return undefined;
    }
}

function mapMovementType(value: unknown): MovementType | undefined {
    const text = s(value)?.toUpperCase();
    switch (text) {
        case "AUTOMATIC":
        case "HAND_WOUND":
        case "QUARTZ":
        case "SOLAR":
        case "KINETIC":
        case "MECHAQUARTZ":
        case "SPRING_DRIVE":
        case "HYBRID":
            return text as MovementType;
        default:
            return undefined;
    }
}

function mapGlass(value: unknown): Glass | undefined {
    const text = s(value)?.toUpperCase();
    switch (text) {
        case "SAPPHIRE":
        case "ACRYLIC":
        case "MINERAL":
        case "HARDLEX":
        case "AR_COATED":
            return text as Glass;
        default:
            return undefined;
    }
}

function mapBraceletType(value: unknown): Strap | undefined {
    const text = s(value)?.toUpperCase();
    switch (text) {
        case "LEATHER":
        case "BRACELET":
        case "RUBBER":
        case "NATO":
        case "CANVASS":
        case "SPECIAL":
            return text as Strap;
        default:
            return undefined;
    }
}

function mapPrimaryCaseMaterial(value: unknown): WatchCaseMaterialFamily {
    const text = s(value)?.toUpperCase();
    switch (text) {
        case "STAINLESS_STEEL":
        case "TITANIUM":
        case "CERAMIC":
        case "CARBON":
        case "GOLD":
        case "PLATINUM":
        case "SILVER":
        case "BRASS":
            return text as WatchCaseMaterialFamily;
        default:
            return "OTHER";
    }
}

function mapGoldColors(value: unknown): WatchGoldColorV2[] | undefined {
    const text = s(value)?.toUpperCase();
    switch (text) {
        case "YELLOW":
            return ["YELLOW"];
        case "WHITE":
            return ["WHITE"];
        case "ROSE":
            return ["ROSE"];
        default:
            return undefined;
    }
}

function normalizeImageRole(value: unknown) {
    return String(value ?? "").toUpperCase();
}

function sortImages(images: any[]) {
    return [...images].sort(
        (a, b) => Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
    );
}

function pickPreferredImages(images: any[]) {
    const sorted = sortImages(images);

    const inline = sorted.filter(
        (img) => normalizeImageRole(img?.role) === "INLINE"
    );
    if (inline.length > 0) return inline;

    const gallery = sorted.filter(
        (img) => normalizeImageRole(img?.role) === "GALLERY"
    );
    if (gallery.length > 0) return gallery;

    return sorted;
}

async function bodyToBuffer(body: any): Promise<Buffer> {
    if (!body) throw new Error("Empty S3 body");

    if (typeof body.transformToByteArray === "function") {
        const bytes = await body.transformToByteArray();
        return Buffer.from(bytes);
    }

    if (typeof body.arrayBuffer === "function") {
        const arr = await body.arrayBuffer();
        return Buffer.from(arr);
    }

    const chunks: Buffer[] = [];
    for await (const chunk of body) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

function inferMimeType(input?: string | null) {
    const value = String(input ?? "").toLowerCase();

    if (
        value.includes("image/jpeg") ||
        value.endsWith(".jpg") ||
        value.endsWith(".jpeg")
    ) {
        return "image/jpeg";
    }
    if (value.includes("image/png") || value.endsWith(".png")) {
        return "image/png";
    }
    if (value.includes("image/webp") || value.endsWith(".webp")) {
        return "image/webp";
    }
    if (value.includes("image/gif") || value.endsWith(".gif")) {
        return "image/gif";
    }

    return "image/jpeg";
}

async function fileKeyToDataUrl(
    fileKey?: string | null,
    mimeHint?: string | null
) {
    const key = normalizeKey(fileKey);
    if (!key) return null;

    try {
        const obj = await s3.send(
            new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
            })
        );

        if (!obj.Body) return null;

        const buffer = await bodyToBuffer(obj.Body);
        if (!buffer.length) return null;

        const mime = inferMimeType(obj.ContentType ?? mimeHint ?? key);
        return `data:${mime};base64,${buffer.toString("base64")}`;
    } catch (error) {
        console.error("[ACQ_SPEC][READ_IMAGE_FAILED]", { key, error });
        return null;
    }
}

async function getImageDataUrlsForAi(product: any, aiMeta: any): Promise<string[]> {
    const productImages = Array.isArray(product?.productImage)
        ? product.productImage
        : [];

    const preferred = pickPreferredImages(productImages);

    const fromProduct = await Promise.all(
        preferred.map((img) =>
            fileKeyToDataUrl(
                img?.fileKey ?? img?.key ?? img?.path ?? null,
                img?.mime ?? null
            )
        )
    );

    const validFromProduct = fromProduct.filter(
        (x): x is string => typeof x === "string" && x.trim().length > 0
    );

    if (validFromProduct.length > 0) {
        return Array.from(new Set(validFromProduct));
    }

    const aiMetaEntries = getImageEntriesFromAiMeta(aiMeta);

    const fallback = await Promise.all(
        aiMetaEntries.map((img) => fileKeyToDataUrl(img?.key ?? null, null))
    );

    return Array.from(
        new Set(
            fallback.filter(
                (x): x is string => typeof x === "string" && x.trim().length > 0
            )
        )
    );
}

export async function enqueueAcquisitionSpecJob(
    tx: Tx,
    input: {
        acquisitionItemId: string;
        productId: string;
    }
) {
    await tx.acquisitionSpecJob.upsert({
        where: { acquisitionItemId: input.acquisitionItemId },
        update: {
            productId: input.productId,
            status: "PENDING",
            attempts: 0,
            lastError: null,
            startedAt: null,
            finishedAt: null,
            runAfter: new Date(),
        },
        create: {
            acquisitionItemId: input.acquisitionItemId,
            productId: input.productId,
            status: "PENDING",
            attempts: 0,
            runAfter: new Date(),
        },
    });
}

async function prepareAcquisitionSpecJobData(input: {
    jobId: string;
    acquisitionItemId: string;
}): Promise<PreparedAcquisitionSpecJob> {
    const item = await prisma.acquisitionItem.findUnique({
        where: { id: input.acquisitionItemId },
        include: {
            acquisition: true,
            product: {
                include: {
                    brand: true,
                    productImage: true,
                    watch: {
                        include: {
                            watchSpecV2: true,
                        },
                    },
                },
            },
        },
    });

    if (!item || !item.productId || !item.product) {
        throw new Error("Acquisition item or product not found");
    }

    if (item.product.type !== "WATCH") {
        return {
            skip: true,
            jobId: input.jobId,
            item,
        };
    }

    const currentAiMeta = getAiMetaFromDescription(item.description);
    const imageEntries = getImageEntriesFromAiMeta(currentAiMeta);
    const imageDataUrls = await getImageDataUrlsForAi(item.product, currentAiMeta);

    await safeAppendLog({
        acquisitionSpecJobId: input.jobId,
        acquisitionItemId: item.id,
        acquisitionId: item.acquisitionId ?? null,
        productId: item.productId ?? null,
        stage: "PREPARE_INPUT",
        message: "Chuẩn bị input AI",
        payload: {
            titleHint: item.productTitle ?? item.product.title,
            imageCount: imageDataUrls.length,
            imageKeys: imageEntries.map((x) => x?.key).filter(Boolean),
        },
    });

    const ai =
        currentAiMeta?.ai?.extractedSpec
            ? currentAiMeta.ai
            : await generateAcquisitionSpec({
                title: item.productTitle ?? item.product.title,
                brand: item.product.brand?.name ?? null,
                model: null,
                notes: item.notes ?? item.acquisition?.notes ?? null,
                condition: null,
                images: imageDataUrls,
            });

    if (!ai?.extractedSpec) {
        throw new Error("AI did not return extractedSpec");
    }

    await safeAppendLog({
        acquisitionSpecJobId: input.jobId,
        acquisitionItemId: item.id,
        acquisitionId: item.acquisitionId ?? null,
        productId: item.productId ?? null,
        stage: "AI_OUTPUT",
        message: "AI đã trả extractedSpec",
        payload: {
            extractedSpec: ai.extractedSpec ?? null,
            summary: ai.summary ?? null,
        },
    });

    const ex = ai.extractedSpec;

    const resolvedBrand =
        item.product.brand ??
        (await resolveBrandFromAcquisitionAi(prisma as any, {
            titleHint: item.productTitle ?? item.product.title,
            aiHint: currentAiMeta?.aiHint ?? null,
            extractedSpec: ex,
        }));

    const resolvedBrandName =
        resolvedBrand?.name ??
        item.product.brand?.name ??
        ex?.confirmedFacts?.brandName ??
        ex?.brandName ??
        ex?.suggestedFacts?.probableBrand ??
        ex?.probableVisualFacts?.probableBrand ??
        null;

    const watch =
        item.product.watch ??
        (await prisma.watch.findUnique({
            where: { productId: item.productId },
            include: { watchSpecV2: true },
        }));

    if (!watch) {
        throw new Error("Watch not found for product");
    }

    const mappedMovementType =
        mapMovementType(ex?.movement) ??
        mapMovementType(ex?.probableVisualFacts?.movement);

    const mappedCaseShape =
        mapCaseShape(ex?.caseType) ??
        mapCaseShape(ex?.probableVisualFacts?.caseType);

    const mappedCrystal =
        mapGlass(ex?.glass) ??
        mapGlass(ex?.probableVisualFacts?.glass);

    const mappedBraceletType = mapBraceletType(
        (ex as any)?.braceletType ??
        (ex as any)?.strap ??
        ex?.probableVisualFacts?.strap
    );

    const mappedPrimaryCaseMaterial = mapPrimaryCaseMaterial(
        ex?.caseMaterial ?? ex?.probableVisualFacts?.caseMaterial
    );

    const mappedGoldColors = mapGoldColors((ex as any)?.goldColor);

    const inferredCaseSize =
        decimalOrNull(ex?.widthEstimateMm) ??
        decimalOrNull(ex?.probableVisualFacts?.widthEstimateMm);

    const inferredThickness = decimalOrNull((ex as any)?.thicknessMm);
    const inferredYearText = s(ex?.yearEstimate);
    const inferredCalibre = s(ex?.bestCaliberCandidate);
    const inferredReference = s(ex?.bestRefCandidate);
    const inferredModel = s(ex?.modelFamily);
    const inferredDialColor =
        s(ex?.dialColor) ?? s(ex?.probableVisualFacts?.dialColor);

    const specStatus = computeWatchSpecStatus({
        brand: resolvedBrandName,
        model: inferredModel,
        referenceNumber: inferredReference,
        movementType: mappedMovementType ?? null,
        calibre: inferredCalibre,
        dialColor: inferredDialColor,
        caseSizeMM: inferredCaseSize,
    });

    return {
        skip: false,
        jobId: input.jobId,
        item,
        watch,
        ai,
        imageEntries,
        resolvedBrand,
        resolvedBrandName,
        mappedMovementType,
        mappedCaseShape,
        mappedCrystal,
        mappedBraceletType,
        mappedPrimaryCaseMaterial,
        mappedGoldColors,
        inferredCaseSize,
        inferredThickness,
        inferredYearText,
        inferredCalibre,
        inferredReference,
        inferredModel,
        inferredDialColor,
        specStatus,
    };
}

async function persistPreparedAcquisitionSpecJob(
    tx: Tx,
    prepared: PreparedAcquisitionSpecJob
) {
    if (prepared.skip) {
        await tx.acquisitionSpecJob.update({
            where: { acquisitionItemId: prepared.item.id },
            data: {
                status: "DONE",
                lastError: null,
                finishedAt: new Date(),
            },
        });

        await safeAppendLog({
            acquisitionSpecJobId: prepared.jobId,
            acquisitionItemId: prepared.item.id,
            acquisitionId: prepared.item.acquisitionId ?? null,
            productId: prepared.item.productId ?? null,
            stage: "DONE",
            message: "Bỏ qua vì item không phải WATCH",
        });

        return;
    }

    const {
        jobId,
        item,
        watch,
        ai,
        imageEntries,
        resolvedBrand,
        resolvedBrandName,
        mappedMovementType,
        mappedCaseShape,
        mappedCrystal,
        mappedBraceletType,
        mappedPrimaryCaseMaterial,
        mappedGoldColors,
        inferredCaseSize,
        inferredThickness,
        inferredYearText,
        inferredCalibre,
        inferredReference,
        inferredModel,
        inferredDialColor,
        specStatus,
    } = prepared;

    const currentAiMeta = getAiMetaFromDescription(item.description);

    await persistAiDraftToItem(tx, item.id, item.description, {
        aiHint: currentAiMeta?.aiHint ?? null,
        images: imageEntries,
        ai,
    });

    const derived = await applyWatchTitleAndSkuForSpec(tx, {
        productId: item.productId,
        currentSku: item.product.sku,
        currentBrandId: item.product.brandId,
        resolvedBrandId: resolvedBrand?.id ?? null,
        brandName: resolvedBrandName,
        model: inferredModel,
        movement: mappedMovementType ? String(mappedMovementType) : null,
        dialColor: inferredDialColor,
        acquiredAt: item.acquisition?.acquiredAt ?? new Date(),
    });

    await safeAppendLog({
        acquisitionSpecJobId: jobId,
        acquisitionItemId: item.id,
        acquisitionId: item.acquisitionId ?? null,
        productId: item.productId ?? null,
        stage: "BUILD_DERIVED",
        message: "Đã build title và SKU",
        payload: {
            title: derived.title,
            sku: derived.sku,
            resolvedBrandName,
            model: inferredModel,
            movement: mappedMovementType ?? null,
            dialColor: inferredDialColor,
            specStatus,
        },
    });

    await tx.watch.update({
        where: { productId: item.productId },
        data: {
            movementType: mappedMovementType,
            movementCalibre: inferredCalibre ?? undefined,
            yearText: inferredYearText ?? undefined,
            hasBox:
                typeof (ai.extractedSpec as any)?.boxIncluded === "boolean"
                    ? Boolean((ai.extractedSpec as any).boxIncluded)
                    : watch.hasBox,
            hasPapers:
                typeof (ai.extractedSpec as any)?.bookletIncluded === "boolean" ||
                    typeof (ai.extractedSpec as any)?.cardIncluded === "boolean"
                    ? Boolean(
                        (ai.extractedSpec as any)?.bookletIncluded ||
                        (ai.extractedSpec as any)?.cardIncluded
                    )
                    : watch.hasPapers,
            specStatus,
            updatedAt: new Date(),
        },
    });

    await tx.watchSpecV2.upsert({
        where: { watchId: watch.id },
        create: {
            watchId: watch.id,
            brand: resolvedBrandName ?? null,
            model: inferredModel,
            referenceNumber: inferredReference,
            caseShape: mappedCaseShape,
            caseSizeMM: inferredCaseSize,
            thicknessMM: inferredThickness,
            primaryCaseMaterial: mappedPrimaryCaseMaterial,
            goldKarat:
                (ai.extractedSpec as any)?.goldKarat != null
                    ? Number((ai.extractedSpec as any).goldKarat)
                    : null,
            goldColors: mappedGoldColors ?? [],
            dialColor: inferredDialColor,
            crystal: mappedCrystal,
            movementType: mappedMovementType,
            calibre: inferredCalibre,
            braceletType: mappedBraceletType,
            bookletIncluded: Boolean((ai.extractedSpec as any)?.bookletIncluded),
            cardIncluded: Boolean((ai.extractedSpec as any)?.cardIncluded),
            rawSpecJson: ai.extractedSpec ?? {},
            updatedAt: new Date(),
        },
        update: {
            brand: resolvedBrandName ?? undefined,
            model: inferredModel ?? undefined,
            referenceNumber: inferredReference ?? undefined,
            caseShape: mappedCaseShape,
            caseSizeMM: inferredCaseSize ?? undefined,
            thicknessMM: inferredThickness ?? undefined,
            primaryCaseMaterial: mappedPrimaryCaseMaterial,
            goldKarat:
                (ai.extractedSpec as any)?.goldKarat != null
                    ? Number((ai.extractedSpec as any).goldKarat)
                    : undefined,
            goldColors: mappedGoldColors ?? undefined,
            dialColor: inferredDialColor ?? undefined,
            crystal: mappedCrystal,
            movementType: mappedMovementType,
            calibre: inferredCalibre ?? undefined,
            braceletType: mappedBraceletType,
            bookletIncluded:
                typeof (ai.extractedSpec as any)?.bookletIncluded === "boolean"
                    ? Boolean((ai.extractedSpec as any).bookletIncluded)
                    : undefined,
            cardIncluded:
                typeof (ai.extractedSpec as any)?.cardIncluded === "boolean"
                    ? Boolean((ai.extractedSpec as any).cardIncluded)
                    : undefined,
            rawSpecJson: ai.extractedSpec ?? undefined,
            updatedAt: new Date(),
        },
    });

    await tx.acquisitionSpecJob.update({
        where: { acquisitionItemId: item.id },
        data: {
            status: "DONE",
            lastError: null,
            finishedAt: new Date(),
        },
    });

    await safeAppendLog({
        acquisitionSpecJobId: jobId,
        acquisitionItemId: item.id,
        acquisitionId: item.acquisitionId ?? null,
        productId: item.productId ?? null,
        stage: "DONE",
        message: "Đã lưu Watch + WatchSpecV2 thành công",
        payload: {
            title: derived.title,
            sku: derived.sku,
            primaryCaseMaterial: mappedPrimaryCaseMaterial,
            referenceNumber: inferredReference,
            model: inferredModel,
            calibre: inferredCalibre,
        },
    });
}

export async function processAcquisitionSpecJob(
    tx: Tx,
    input: {
        acquisitionItemId: string;
    }
) {
    const job = await prisma.acquisitionSpecJob.findUnique({
        where: { acquisitionItemId: input.acquisitionItemId },
    });

    if (!job) {
        throw new Error("AcquisitionSpecJob not found");
    }

    const prepared = await prepareAcquisitionSpecJobData({
        jobId: job.id,
        acquisitionItemId: input.acquisitionItemId,
    });

    await persistPreparedAcquisitionSpecJob(tx, prepared);
}

export async function failAcquisitionSpecJob(
    tx: Tx,
    input: {
        acquisitionItemId: string;
        errorMessage: string;
    }
) {
    const job = await tx.acquisitionSpecJob.findUnique({
        where: { acquisitionItemId: input.acquisitionItemId },
        select: { id: true, productId: true },
    });

    await tx.acquisitionSpecJob.update({
        where: { acquisitionItemId: input.acquisitionItemId },
        data: {
            status: "FAILED",
            lastError: input.errorMessage,
            finishedAt: new Date(),
            runAfter: new Date(Date.now() + 5 * 60 * 1000),
        },
    });

    if (job?.productId) {
        await tx.watch.updateMany({
            where: { productId: job.productId },
            data: {
                specStatus: "FAILED",
                updatedAt: new Date(),
            },
        });
    }

    if (job?.id) {
        await safeAppendLog({
            acquisitionSpecJobId: job.id,
            acquisitionItemId: input.acquisitionItemId,
            productId: job.productId ?? null,
            stage: "FAILED",
            level: "ERROR",
            message: input.errorMessage,
        });
    }
}

export async function claimQueuedAcquisitionSpecJobs(input?: {
    limit?: number;
    includeFailed?: boolean;
}) {
    const limit = Math.max(1, Math.min(Number(input?.limit ?? 3), 10));
    const includeFailed = Boolean(input?.includeFailed);

    return prisma.acquisitionSpecJob.findMany({
        where: {
            status: includeFailed
                ? { in: ["PENDING", "FAILED"] }
                : "PENDING",
            runAfter: {
                lte: new Date(),
            },
        },
        orderBy: [{ runAfter: "asc" }, { createdAt: "asc" }],
        take: limit,
    });
}

export async function processQueuedAcquisitionSpecJobs(input?: {
    limit?: number;
    includeFailed?: boolean;
}) {
    const jobs = await claimQueuedAcquisitionSpecJobs({
        limit: input?.limit,
        includeFailed: input?.includeFailed,
    });

    let processed = 0;
    let failed = 0;
    const errors: Array<{ id: string; error: string }> = [];

    for (const job of jobs) {
        try {
            await safeAppendLog({
                acquisitionSpecJobId: job.id,
                acquisitionItemId: job.acquisitionItemId,
                productId: job.productId ?? null,
                stage: "START",
                message: "Bắt đầu xử lý spec job",
            });

            const prepared = await prepareAcquisitionSpecJobData({
                jobId: job.id,
                acquisitionItemId: job.acquisitionItemId,
            });

            await prisma.$transaction(
                async (tx) => {
                    await tx.acquisitionSpecJob.update({
                        where: { id: job.id },
                        data: {
                            status: "RUNNING",
                            startedAt: new Date(),
                            attempts: { increment: 1 },
                            lastError: null,
                        },
                    });

                    await persistPreparedAcquisitionSpecJob(tx, prepared);
                },
                {
                    timeout: 15000,
                }
            );

            processed += 1;
        } catch (error: any) {
            failed += 1;
            errors.push({
                id: job.acquisitionItemId,
                error: error?.message || "Unknown error",
            });

            await prisma.$transaction(async (tx) => {
                await failAcquisitionSpecJob(tx, {
                    acquisitionItemId: job.acquisitionItemId,
                    errorMessage: error?.message || "Unknown error",
                });
            });
        }
    }

    return {
        total: jobs.length,
        processed,
        failed,
        errors,
    };
}

export async function processAcquisitionSpecJobsByItemIds(input: {
    acquisitionItemIds: string[];
}) {
    const ids = Array.from(
        new Set(
            (input.acquisitionItemIds ?? []).filter(
                (x): x is string => typeof x === "string" && x.trim().length > 0
            )
        )
    );

    let processed = 0;
    let failed = 0;
    const errors: Array<{ id: string; error: string }> = [];

    for (const acquisitionItemId of ids) {
        try {
            const job = await prisma.acquisitionSpecJob.findUnique({
                where: { acquisitionItemId },
            });

            if (!job) {
                throw new Error("AcquisitionSpecJob not found");
            }

            await safeAppendLog({
                acquisitionSpecJobId: job.id,
                acquisitionItemId,
                productId: job.productId ?? null,
                stage: "START",
                message: "Bắt đầu xử lý spec job theo item ids",
            });

            const prepared = await prepareAcquisitionSpecJobData({
                jobId: job.id,
                acquisitionItemId,
            });

            await prisma.$transaction(
                async (tx) => {
                    await tx.acquisitionSpecJob.update({
                        where: { id: job.id },
                        data: {
                            status: "RUNNING",
                            startedAt: new Date(),
                            attempts: { increment: 1 },
                            lastError: null,
                        },
                    });

                    await persistPreparedAcquisitionSpecJob(tx, prepared);
                },
                {
                    timeout: 15000,
                }
            );

            processed += 1;
        } catch (error: any) {
            failed += 1;
            errors.push({
                id: acquisitionItemId,
                error: error?.message || "Unknown error",
            });

            await prisma.$transaction(async (tx) => {
                await failAcquisitionSpecJob(tx, {
                    acquisitionItemId,
                    errorMessage: error?.message || "Unknown error",
                });
            });
        }
    }

    return {
        total: ids.length,
        processed,
        failed,
        errors,
    };
}