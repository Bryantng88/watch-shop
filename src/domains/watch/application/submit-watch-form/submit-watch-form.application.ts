import { prisma } from "@/server/db/client";
import { markGalleryMediaAssetsAttached } from "@/domains/media/server";
import { notifyUsersByRole } from "@/app/(admin)/admin/notifications/notification.service";

import { WatchSpecStatus } from "@prisma/client";
import type { WatchFormValues } from "../../client/form/watch-form.types";
import { replaceWatchGalleryImagesRepo } from "../../server/media";
import {
    moveWatchGalleryImagesToChosen,
    moveWatchPoolImagesToChosenPool,
    releaseRemovedWatchPoolImagesToActive,
    ensureWatchInlineImageFromFirstGallery,
} from "../../server/media";
import { updateWatchPricingWithDiff } from "../../server/pricing";
import {
    WatchFormEnums,
    dedupeMediaItems,
    mediaKey,
    normalizeArray,
    normalizeImageKeys,
    normalizeText,
    pickEnumOrDefault,
    pickEnumOrNull,
    pickEnumOrUndefined,
    pickGoldColors,
    sameJson,
    textOrUndefined,
    toDecimal,
} from "../../server/shared";
import {
    emitWatchContentModifiedEvent,
    emitWatchMediaAssetAttachedEvent,
    emitWatchPriceUpdatedEvent,
    emitWatchSpecUpdatedEvent,
} from "../../server/events";

type SubmitWatchFormContext = {
    userId?: string | null;
    canReviewContent: boolean;
    canEditPrice?: boolean;
    deferConsumers?: (work: () => Promise<void>) => void;
};

type ReviewSubmitTarget = "CONTENT" | "IMAGE";

type SubmitWatchFormResult = {
    ok: true;
    message: string;
    contentChanged: boolean;
    imagesChanged: boolean;
    hasContentData: boolean;
    media: {
        poolImages: unknown[];
        galleryImages: unknown[];
    };
    reviewSubmitTargets: ReviewSubmitTarget[];
    askSubmitReview: boolean;
    askContinueContent: boolean;
    contentReviewStatus?: "DRAFT";
    imageReviewStatus?: "DRAFT";

};

function priceSnapshot(value: unknown) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;

    return {
        salePrice: row.salePrice == null ? null : String(row.salePrice),
        minPrice: row.minPrice == null ? null : String(row.minPrice),
        costPrice: row.costPrice == null ? null : String(row.costPrice),
        serviceCost: row.serviceCost == null ? null : String(row.serviceCost),
        landedCost: row.landedCost == null ? null : String(row.landedCost),
        pricingNote: row.pricingNote == null ? null : String(row.pricingNote),
    };
}

function buildContentSnapshot(input: {
    titleOverride?: string | null;
    hookText?: string | null;
    body?: string | null;
    bulletSpecs?: unknown[] | null;
    hashTags?: string | null;
}) {
    return {
        titleOverride: normalizeText(input.titleOverride),
        hookText: normalizeText(input.hookText),
        body: normalizeText(input.body),
        bulletSpecs: normalizeArray(input.bulletSpecs as any),
        hashTags: normalizeText(input.hashTags),
    };
}

function buildSpecSnapshot(input: {
    brand?: string | null;
    model?: string | null;
    referenceNumber?: string | null;
    caseShape?: string | null;
    primaryCaseMaterial?: string | null;
    dialColor?: string | null;
    movementType?: string | null;
    calibre?: string | null;
    yearText?: string | null;
    conditionGrade?: string | null;
}) {
    return {
        brand: normalizeText(input.brand),
        model: normalizeText(input.model),
        referenceNumber: normalizeText(input.referenceNumber),
        caseShape: normalizeText(input.caseShape),
        primaryCaseMaterial: normalizeText(input.primaryCaseMaterial),
        dialColor: normalizeText(input.dialColor),
        movementType: normalizeText(input.movementType),
        calibre: normalizeText(input.calibre),
        yearText: normalizeText(input.yearText),
        conditionGrade: normalizeText(input.conditionGrade),
    };
}

function hasContentSnapshotData(
    content: ReturnType<typeof buildContentSnapshot>,
) {
    return (
        Boolean(content.titleOverride) ||
        Boolean(content.hookText) ||
        Boolean(content.body) ||
        Boolean(content.hashTags) ||
        content.bulletSpecs.length > 0
    );
}

function normalizeSpecStatusForSubmit(value?: string | null): WatchSpecStatus {
    const status = String(value ?? "PENDING").toUpperCase();
    if (status === WatchSpecStatus.PARTIAL) return WatchSpecStatus.PARTIAL;
    if (status === WatchSpecStatus.READY) return WatchSpecStatus.READY;
    if (status === WatchSpecStatus.FAILED) return WatchSpecStatus.FAILED;
    return WatchSpecStatus.PENDING;
}


function cleanSkuText(value?: string | null) {
    const text = String(value ?? "").trim().toUpperCase();
    return text || null;
}

function normalizeBrandTextForSku(value?: string | null) {
    return String(value ?? "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function buildWatchSkuPrefixForSubmit(brandName?: string | null) {
    const normalized = normalizeBrandTextForSku(brandName);
    if (!normalized) return "UNK";

    const words = normalized
        .split(/\s+/)
        .map((word) => word.replace(/[^A-Z0-9]/g, ""))
        .filter(Boolean);

    if (!words.length) return "UNK";

    const known: Record<string, string> = {
        OMEGA: "OME",
        ROLEX: "RLX",
        LONGINES: "LNG",
        ORIS: "ORI",
        EXACTLY: "XCT",
        "RAYMOND WEIL": "RMW",
        SEIKO: "SEI",
        CITIZEN: "CTZ",
        CARTIER: "CAR",
        TISSOT: "TIS",
        BULOVA: "BLV",
    };

    const joined = words.join(" ");
    if (known[joined]) return known[joined];
    if (known[words[0]]) return known[words[0]];

    if (words.length >= 2) {
        return words
            .map((word) => word[0])
            .join("")
            .slice(0, 3)
            .padEnd(3, "X");
    }

    const single = words[0];
    if (single.length <= 3) return single.padEnd(3, "X");

    const consonants = single.replace(/[AEIOUY]/g, "");
    if (consonants.length >= 3) return consonants.slice(0, 3);

    return single.slice(0, 3).padEnd(3, "X");
}

function formatSkuDateForSubmit(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = String(date.getFullYear());
    return `${dd}${mm}${yyyy}`;
}

function padSkuSeqForSubmit(value: number) {
    return String(value).padStart(3, "0");
}

async function genUniqueWatchSkuForSubmit(
    tx: any,
    input: {
        productId: string;
        brandName?: string | null;
        date?: Date | null;
    },
) {
    const prefix = buildWatchSkuPrefixForSubmit(input.brandName);
    const datePart = formatSkuDateForSubmit(input.date ?? new Date());
    const base = `${prefix}-${datePart}`;

    const rows = await tx.product.findMany({
        where: {
            sku: { startsWith: `${base}-` },
            NOT: { id: input.productId },
        },
        select: { sku: true },
        orderBy: { sku: "desc" },
    });

    let maxSeq = 0;

    for (const row of rows) {
        const match = row.sku?.match(new RegExp(`^${base}-(\\d{3})$`));
        if (!match) continue;

        const seq = Number(match[1]);
        if (Number.isFinite(seq) && seq > maxSeq) {
            maxSeq = seq;
        }
    }

    return `${base}-${padSkuSeqForSubmit(maxSeq + 1)}`;
}
async function syncWatchSaleStageAfterPostAssets(input: {
    productId: string;
    hasContentData: boolean;
    hasGalleryImages: boolean;
}) {
    const nextSaleStage =
        input.hasContentData && input.hasGalleryImages ? "READY" : "PROCESSING";

    await prisma.watch.updateMany({
        where: {
            productId: input.productId,
            saleStage: {
                in: ["DRAFT", "PROCESSING", "READY"] as any,
            },
            serviceStage: {
                notIn: ["PENDING", "IN_SERVICE"] as any,
            },
        },
        data: {
            saleStage: nextSaleStage as any,
            updatedAt: new Date(),
        },
    });
}
async function resolveSubmittedWatchSku(
    tx: any,
    input: {
        productId: string;
        submittedSku?: string | null;
        currentBrandId?: string | null;
        nextBrandId?: string | null;
        brandName?: string | null;
    },
) {
    const submittedSku = cleanSkuText(input.submittedSku);
    const nextBrandId = input.nextBrandId ?? null;
    const currentBrandId = input.currentBrandId ?? null;
    const brandChanged = currentBrandId !== nextBrandId;

    const expectedPrefix = buildWatchSkuPrefixForSubmit(input.brandName);
    const submittedMatchesNextBrand = submittedSku
        ? submittedSku.startsWith(`${expectedPrefix}-`)
        : false;

    const duplicated = submittedSku
        ? await tx.product.findFirst({
            where: {
                sku: submittedSku,
                NOT: { id: input.productId },
            },
            select: { id: true },
        })
        : null;

    if (!submittedSku || brandChanged || !submittedMatchesNextBrand || duplicated) {
        return genUniqueWatchSkuForSubmit(tx, {
            productId: input.productId,
            brandName: input.brandName,
            date: new Date(),
        });
    }

    return submittedSku;
}

async function syncProductPostTargets(
    tx: any,
    input: {
        productId: string;
        postTargetIds?: string[] | null;
    },
) {
    const nextIds = Array.from(
        new Set(
            (input.postTargetIds ?? [])
                .map((id) => String(id ?? "").trim())
                .filter(Boolean),
        ),
    );

    const existing = await tx.productPostTarget.findMany({
        where: { productId: input.productId },
        select: { postTargetId: true },
        orderBy: { createdAt: "asc" },
    });

    const existingIds = existing.map((item: any) => String(item.postTargetId));

    const toDelete = existingIds.filter((id: string) => !nextIds.includes(id));
    const toCreate = nextIds.filter((id) => !existingIds.includes(id));

    if (toDelete.length) {
        await tx.productPostTarget.deleteMany({
            where: {
                productId: input.productId,
                postTargetId: { in: toDelete },
            },
        });
    }

    for (const postTargetId of toCreate) {
        await tx.productPostTarget.create({
            data: {
                productId: input.productId,
                postTargetId,
            },
        });
    }
}

async function assertMediaWorkspaceAssetsAvailable(input: {
    productId: string;
    keys: string[];
}) {
    const keys = Array.from(new Set(input.keys.map((key) => key.trim()).filter(Boolean)));

    if (!keys.length) return;

    const reserved = await prisma.mediaAsset.findFirst({
        where: {
            key: { in: keys },
            productId: {
                not: input.productId,
            },
            status: {
                in: ["CHOSEN", "ATTACHED"] as any,
            },
        },
        select: {
            key: true,
            productId: true,
        },
    });

    if (!reserved) return;

    throw new Error(
        `Ảnh ${reserved.key} đang được chọn cho watch khác, không thể lưu trùng.`,
    );
}

export async function submitWatchFormApplication(
    values: WatchFormValues,
    context: SubmitWatchFormContext,
): Promise<SubmitWatchFormResult> {
    const productId = String(values.productId || "").trim();

    if (!productId) {
        throw new Error("Thiếu productId khi lưu watch.");
    }
    const current = await prisma.watch.findUnique({
        where: { productId },
        include: {
            product: {
                include: {
                    productImage: {
                        where: { role: "GALLERY" as any },
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    },
                },
            },
            watchSpecV2: true,
            watchContent: true,
            reviewStates: true,
        },
    });

    if (!current) {
        throw new Error("Không tìm thấy watch.");
    }

    const beforeContent = buildContentSnapshot({
        titleOverride: current.watchContent?.titleOverride,
        hookText: current.watchContent?.hookText,
        body: current.watchContent?.body,
        bulletSpecs: current.watchContent?.bulletSpecs as any,
        hashTags: (current.watchContent as any)?.hashTags,
    });
    const beforeSpec = buildSpecSnapshot({
        brand: current.watchSpecV2?.brand,
        model: current.watchSpecV2?.model,
        referenceNumber: current.watchSpecV2?.referenceNumber,
        caseShape: current.watchSpecV2?.caseShape,
        primaryCaseMaterial: current.watchSpecV2?.primaryCaseMaterial,
        dialColor: current.watchSpecV2?.dialColor,
        movementType: current.movementType,
        calibre: current.watchSpecV2?.calibre,
        yearText: current.yearText,
        conditionGrade: current.conditionGrade,
    });

    const saveIntent = String((values as any).saveIntent ?? "NORMAL").toUpperCase();
    const isMediaWorkspaceSave = saveIntent === "MEDIA_WORKSPACE";

    const afterContent =
        saveIntent === "SUBMIT_IMAGE"
            ? beforeContent
            : buildContentSnapshot(values.content);
    const afterSpec = buildSpecSnapshot({
        brand: values.spec.specBrand || undefined,
        model: values.spec.model,
        referenceNumber: values.spec.referenceNumber,
        caseShape: values.spec.caseShape,
        primaryCaseMaterial: values.spec.primaryCaseMaterial,
        dialColor: values.spec.dialColor,
        movementType: values.basic.movementType,
        calibre: values.spec.calibre,
        yearText: values.basic.yearText,
        conditionGrade: values.basic.conditionGrade,
    });
    const beforeImageKeys = normalizeImageKeys(
        current.product.productImage.map((x: any) => ({ key: x.fileKey })),
    );

    const requestedPoolImages = dedupeMediaItems(values.media.poolImages ?? []);
    const requestedGalleryImages = dedupeMediaItems(
        values.media.galleryImages ?? [],
    );
    const afterImageKeysBeforeMove =
        saveIntent === "SUBMIT_CONTENT"
            ? beforeImageKeys
            : normalizeImageKeys(requestedGalleryImages);

    const contentChanged = !sameJson(beforeContent, afterContent);
    const specChanged = !sameJson(beforeSpec, afterSpec);
    const imagesChanged = !sameJson(beforeImageKeys, afterImageKeysBeforeMove);

    const contentReviewStatus = String(
        current.reviewStates.find((item: any) => item.targetType === "CONTENT")
            ?.status ?? "DRAFT",
    ).toUpperCase();
    const imageReviewStatus = String(
        current.reviewStates.find((item: any) => item.targetType === "IMAGE")
            ?.status ?? "DRAFT",
    ).toUpperCase();

    if (
        contentChanged &&
        contentReviewStatus === "APPROVED" &&
        !context.canReviewContent
    ) {
        throw new Error(
            "Nội dung đã được duyệt. Bạn không có quyền chỉnh sửa nội dung đã duyệt.",
        );
    }

    if (
        imagesChanged &&
        imageReviewStatus === "APPROVED" &&
        !context.canReviewContent
    ) {
        throw new Error(
            "Hình ảnh đã được duyệt. Bạn không có quyền chỉnh sửa hình ảnh đã duyệt.",
        );
    }

    await prisma.$transaction(async (tx) => {
        const brand = values.basic.brandId
            ? await tx.brand.findUnique({
                where: { id: values.basic.brandId },
                select: { id: true, name: true },
            })
            : null;

        if (values.basic.brandId && !brand) {
            throw new Error("Brand không hợp lệ.");
        }

        const safeSku = await resolveSubmittedWatchSku(tx, {
            productId,
            submittedSku: values.header.sku,
            currentBrandId: current.product.brandId ?? null,
            nextBrandId: values.basic.brandId || null,
            brandName: brand?.name ?? values.spec.specBrand ?? null,
        });

        await tx.product.update({
            where: { id: productId },
            data: {
                title: textOrUndefined(values.basic.title),
                slug: textOrUndefined(values.basic.slug),
                sku: safeSku,
                brand: values.basic.brandId
                    ? { connect: { id: values.basic.brandId } }
                    : { disconnect: true },
                vendor: values.basic.vendorId
                    ? { connect: { id: values.basic.vendorId } }
                    : { disconnect: true },
                productCategory: values.basic.categoryId
                    ? { connect: { id: values.basic.categoryId } }
                    : { disconnect: true },
            },
        });

        await syncProductPostTargets(tx, {
            productId,
            postTargetIds: values.basic.postTargetIds ?? [],
        });

        await tx.watch.update({
            where: { id: current.id },
            data: {
                gender: pickEnumOrUndefined(values.basic.gender, WatchFormEnums.Gender),
                style: pickEnumOrNull(values.basic.style, WatchFormEnums.WatchStyle),
                siteChannel: pickEnumOrUndefined(
                    values.basic.siteChannel,
                    WatchFormEnums.WatchSiteChannel,
                ),
                conditionGrade: values.basic.conditionGrade || null,
                movementType: pickEnumOrNull(
                    values.basic.movementType,
                    WatchFormEnums.MovementType,
                ),
                movementCalibre: values.basic.movementCalibre || null,
                serialNumber: values.basic.serialNumber || null,
                yearText: values.basic.yearText || null,
                specStatus: normalizeSpecStatusForSubmit(values.specStatus),
            },
        });

        const specData = {
            brand: brand?.name ?? null,
            model: values.spec.model || null,
            referenceNumber: values.spec.referenceNumber || null,
            nickname: values.spec.nickname || null,
            strapSetType: pickEnumOrNull(
                values.spec.strapSetType,
                WatchFormEnums.WatchStrapSetType,
            ),
            strapComponentSource: pickEnumOrNull(
                values.spec.strapComponentSource,
                WatchFormEnums.WatchStrapComponentSource,
            ),
            caseShape: pickEnumOrNull(values.spec.caseShape, WatchFormEnums.CaseType),
            caseSizeMM: toDecimal(values.spec.caseSizeMM),
            lugToLugMM: toDecimal(values.spec.lugToLugMM),
            thicknessMM: toDecimal(values.spec.thicknessMM),
            crystal: pickEnumOrNull(values.spec.crystal, WatchFormEnums.Glass),
            dialColor: values.spec.dialColor || null,
            dialFinish: values.spec.dialFinish || null,
            movementType: pickEnumOrNull(
                values.basic.movementType,
                WatchFormEnums.MovementType,
            ),
            calibre: values.spec.calibre || null,
            materialProfile: pickEnumOrDefault(
                values.spec.materialProfile,
                WatchFormEnums.WatchMaterialProfile,
                WatchFormEnums.WatchMaterialProfile.SINGLE_MATERIAL,
            ),
            primaryCaseMaterial: pickEnumOrDefault(
                values.spec.primaryCaseMaterial,
                WatchFormEnums.WatchCaseMaterialFamily,
                WatchFormEnums.WatchCaseMaterialFamily.STAINLESS_STEEL,
            ),
            secondaryCaseMaterial: pickEnumOrNull(
                values.spec.secondaryCaseMaterial,
                WatchFormEnums.WatchCaseMaterialFamily,
            ),
            goldTreatment: pickEnumOrNull(
                values.spec.goldTreatment,
                WatchFormEnums.WatchGoldTreatment,
            ),
            goldColors: pickGoldColors(values.spec.goldColors),
            goldKarat: values.spec.goldKarat ? Number(values.spec.goldKarat) : null,
            braceletType: pickEnumOrNull(
                values.spec.braceletType,
                WatchFormEnums.Strap,
            ),
            strapMaterialText: values.spec.strapMaterialText || null,
            waterResistance: values.spec.waterResistance || null,
            powerReserve: values.spec.powerReserve || null,
            buckleType: values.spec.buckleType || null,
            boxIncluded: Boolean((values.spec as any).boxIncluded),
            bookletIncluded: Boolean((values.spec as any).bookletIncluded),
            cardIncluded: Boolean((values.spec as any).cardIncluded),
            materialNote: values.spec.materialNote || null,
        };

        await tx.watchSpecV2.upsert({
            where: { watchId: current.id },
            create: { watchId: current.id, ...specData },
            update: specData,
        });

        await tx.watchContent.upsert({
            where: { watchId: current.id },
            create: {
                watchId: current.id,
                contentStatus: "DRAFT",
                titleOverride: values.content.titleOverride || null,
                hookText: values.content.hookText || null,
                body: values.content.body || null,
                bulletSpecs: values.content.bulletSpecs ?? [],
                hashTags: values.content.hashTags || null,
            } as any,
            update: {
                titleOverride: values.content.titleOverride || null,
                hookText: values.content.hookText || null,
                body: values.content.body || null,
                bulletSpecs: values.content.bulletSpecs ?? [],
                hashTags: values.content.hashTags || null,
            } as any,
        });
    });

    const galleryOriginalKeys = new Set(
        requestedGalleryImages.map(mediaKey).filter(Boolean),
    );
    const remainingPoolImages = requestedPoolImages.filter((item) => {
        const key = mediaKey(item);
        return key && !galleryOriginalKeys.has(key);
    });

    if (isMediaWorkspaceSave && imagesChanged) {
        await assertMediaWorkspaceAssetsAvailable({
            productId,
            keys: [...remainingPoolImages, ...requestedGalleryImages]
                .map(mediaKey)
                .filter(Boolean),
        });
    }

    let normalizedGalleryImages = requestedGalleryImages;
    let normalizedPoolImages = remainingPoolImages;

    if (imagesChanged) {
        // NAS/media reconciliation is comparatively expensive. Only run it when
        // gallery keys actually changed; content/progress-only saves must not
        // move and re-attach every existing image again.
        await releaseRemovedWatchPoolImagesToActive({
            productId,
            keepItems: [...remainingPoolImages, ...requestedGalleryImages],
        });

        normalizedGalleryImages = await moveWatchGalleryImagesToChosen(
            requestedGalleryImages,
            { productId, acquisitionId: current.acquisitionId },
        );

        normalizedPoolImages = await moveWatchPoolImagesToChosenPool(
            remainingPoolImages,
            { productId },
        );

        const galleryImageInputs = normalizedGalleryImages
            .map((item, index) => {
                const key = mediaKey(item);

                if (!key) return null;

                return {
                    fileKey: key,
                    isForAdmin: true,
                    isForStorefront: true,
                    sortOrder: index,
                };
            })
            .filter(Boolean) as Array<{
                fileKey: string;
                isForAdmin: boolean;
                isForStorefront: boolean;
                sortOrder: number;
            }>;

        await replaceWatchGalleryImagesRepo(prisma as any, {
            productId,
            images: galleryImageInputs,
        });

        await markGalleryMediaAssetsAttached({
            productId,
            images: galleryImageInputs,
        });
        await ensureWatchInlineImageFromFirstGallery({
            productId,
        });
    }
    const hasContentData = hasContentSnapshotData(afterContent);
    const hasGalleryImages = normalizedGalleryImages.length > 0;

    await syncWatchSaleStageAfterPostAssets({
        productId,
        hasContentData,
        hasGalleryImages,
    });

    if (contentChanged) {
        await emitWatchContentModifiedEvent(prisma, {
            watch: {
                id: current.id,
                productId,
            },
            actorUserId: context.userId ?? null,
        }, { deferConsumers: context.deferConsumers });
    }

    if (specChanged) {
        await emitWatchSpecUpdatedEvent(prisma, {
            watch: {
                id: current.id,
                productId,
                product: {
                    title: current.product?.title ?? values.basic.title ?? null,
                    sku: current.product?.sku ?? values.header.sku ?? null,
                },
            },
            actorUserId: context.userId ?? null,
            before: beforeSpec,
            after: afterSpec,
        }, { deferConsumers: context.deferConsumers });
    }

    if (imagesChanged) {
        await emitWatchMediaAssetAttachedEvent(prisma, {
            watch: {
                id: current.id,
                productId,
                product: {
                    title: current.product?.title ?? values.basic.title ?? null,
                    sku: current.product?.sku ?? values.header.sku ?? null,
                },
            },
            actorUserId: context.userId ?? null,
            sourceId: productId,
            note: "Watch Workbench image save.",
        }, { deferConsumers: context.deferConsumers });
    }

    const pricingResult = context.canEditPrice
        ? await updateWatchPricingWithDiff(productId, {
            salePrice: values.pricing.salePrice,
            minPrice: values.pricing.minPrice,
            costPrice: values.pricing.costPrice,
            serviceCost: values.pricing.serviceCost,
            landedCost: values.pricing.landedCost,
            pricingNote: values.pricing.pricingNote,
        })
        : null;

    if (pricingResult && pricingResult.changedFields.length > 0) {
        await emitWatchPriceUpdatedEvent(prisma, {
            watch: {
                id: pricingResult.watchId,
                productId,
                product: {
                    title: pricingResult.product?.title ?? values.basic.title ?? null,
                    sku: pricingResult.product?.sku ?? values.header.sku ?? null,
                },
            },
            actorUserId: context.userId ?? null,
            changedFields: pricingResult.changedFields,
            before: priceSnapshot(pricingResult.before),
            after: priceSnapshot(pricingResult.after),
        }, { deferConsumers: context.deferConsumers });

        await notifyUsersByRole({
            role: "SALE",
            type: "WATCH_PRICE_UPDATED",
            title: "Giá watch vừa được cập nhật",
            message: `${pricingResult.product?.title || values.basic.title || "Watch"} vừa được chỉnh giá.`,
            priority: "NORMAL",
            metadata: {
                route: `/admin/watches/${productId}?focus=pricing`,
                productId,
                focus: "pricing",
                sku: pricingResult.product?.sku ?? values.header.sku ?? null,
                title: pricingResult.product?.title ?? values.basic.title ?? null,
                changedFields: pricingResult.changedFields,
            },
        });
    }


    return {
        ok: true,
        message: "Đã lưu watch.",
        contentChanged,
        imagesChanged,
        hasContentData,
        media: {
            poolImages: normalizedPoolImages,
            galleryImages: normalizedGalleryImages,
        },
        reviewSubmitTargets: !context.canReviewContent
            ? ([
                contentChanged && hasContentData ? "CONTENT" : null,
                imagesChanged ? "IMAGE" : null,
            ].filter(Boolean) as Array<"CONTENT" | "IMAGE">)
            : ([] as ReviewSubmitTarget[]),
        askSubmitReview:
            !context.canReviewContent &&
            ((contentChanged && hasContentData) || imagesChanged),
        askContinueContent:
            !context.canReviewContent && imagesChanged && !hasContentData,
        contentReviewStatus: contentChanged ? "DRAFT" : undefined,
        imageReviewStatus: imagesChanged ? "DRAFT" : undefined,
    };
}
