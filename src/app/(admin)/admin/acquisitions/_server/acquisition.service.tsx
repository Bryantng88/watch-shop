"use server";

import { prisma, DB } from "@/server/db/client";
import * as dto from "./acquisition.dto";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import * as repoAcq from "./acquisition.repo";
import { AcquisitionType } from "@prisma/client";
import { Prisma, ProductStatus, ContentStatus, MovementType, CaseType, Gender, CaseMaterial, Glass, GoldColor, Strap } from "@prisma/client";
import { createInvoiceFromAcquisition } from "../../invoices/_servers/invoices.repo";
import { createTechnicalCheckFromAcquisitionTx } from "../../services/_server/service_request.service";
import { ItemInput } from "./acquisition.dto";
import { genUniqueProductSku } from "../../products/_server/helper";
import * as acquisitionAiService from "./acquisition-ai.service";
import {
    getAiMetaFromDescription,
    getStrapSpecFromDescription,
    getWatchFlagsFromDescription,
    parseAcquisitionItemMeta,
} from "./item-metadata";

type AcqViewKey = "all" | "draft" | "posted" | "canceled";
type ExistingAcqItem = Awaited<ReturnType<typeof repoAcq.findAcqItems>>[number];

type AiDraftPayload = {
    extractedSpec?: any;
    generatedDraft?: any;
    meta?: any;
};

const firstValue = (v: unknown) => (Array.isArray(v) ? v[0] : v);

function asString(v: unknown) {
    const raw = firstValue(v);
    if (raw == null || raw === "") return undefined;
    return String(raw);
}

function asNumber(v: unknown, fallback: number) {
    const raw = firstValue(v);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

function normalizeSort(v: unknown) {
    const raw = String(firstValue(v) ?? "updatedDesc");
    if (
        raw === "updatedDesc" ||
        raw === "updatedAsc" ||
        raw === "createdDesc" ||
        raw === "createdAsc" ||
        raw === "acquiredDesc" ||
        raw === "acquiredAsc"
    ) {
        return raw;
    }
    return "updatedDesc";
}

function normalizeView(v: unknown): AcqViewKey {
    const raw = String(firstValue(v) ?? "all").toLowerCase();
    if (raw === "draft" || raw === "posted" || raw === "canceled") return raw;
    return "all";
}

function normalizeType(v: unknown) {
    const raw = String(firstValue(v) ?? "").toUpperCase();
    if (
        raw === "PURCHASE" ||
        raw === "CONSIGNMENT" ||
        raw === "TRADE_IN" ||
        raw === "BUY_BACK"
    ) {
        return raw;
    }
    return undefined;
}

function normalizeStatus(v: unknown) {
    const raw = String(firstValue(v) ?? "").toUpperCase();
    if (raw === "DRAFT" || raw === "POSTED" || raw === "CANCELED") return raw;
    return undefined;
}

function statusFromView(view: AcqViewKey) {
    switch (view) {
        case "draft":
            return "DRAFT";
        case "posted":
            return "POSTED";
        case "canceled":
            return "CANCELED";
        default:
            return undefined;
    }
}

function computeActiveAcquisitionTotal(items: Array<{ quantity?: number | null; unitCost?: any; status?: string | null }>) {
    return items
        .filter((row) => String(row.status ?? "").toUpperCase() !== "CANCELLED")
        .reduce(
            (sum, row) => sum + (Number(row.quantity ?? 0) || 0) * (Number(row.unitCost ?? 0) || 0),
            0
        );
}

function toDraftItem(raw: dto.CreateAcquisitionInput["items"][number]) {
    return {
        ...raw,
        productTitle: String((raw as any).productTitle ?? raw.title ?? "").trim() || "Untitled watch",
        quantity: Number(raw.quantity ?? 1),
        unitCost: Number(raw.unitCost ?? 0),
        productType: (raw.productType ?? "WATCH") as any,
    };
}

async function resolveVendorIdForPosting(acq: Awaited<ReturnType<typeof repoAcq.getAcqtById>>, vendorName: string) {
    let vendorId = acq?.vendorId ?? null;

    if (!vendorId && vendorName) {
        const vendor = await prisma.vendor.findFirst({
            where: { name: vendorName },
            select: { id: true },
        });
        vendorId = vendor?.id ?? null;
    }

    return vendorId;
}

function getAiImageUrls(aiMeta: ReturnType<typeof getAiMetaFromDescription>) {
    return (aiMeta?.images ?? [])
        .map((x) => String(x?.url ?? "").trim())
        .filter(Boolean);
}

async function persistAiDraftToItem(
    tx: DB,
    itemId: string,
    description: string | null | undefined,
    aiDraft: AiDraftPayload,
    aiHint: string | null,
    images: Array<{ key?: string | null; url?: string | null }>
) {
    const meta = parseAcquisitionItemMeta(description);

    await tx.acquisitionItem.update({
        where: { id: itemId },
        data: {
            description: JSON.stringify({
                ...(meta.kind ? { kind: meta.kind } : { kind: "watch" }),
                ...(meta.watchFlags ? { watchFlags: meta.watchFlags } : {}),
                ...(meta.strapSpec ? { strapSpec: meta.strapSpec } : {}),
                ...(meta.quickSpec ? { quickSpec: meta.quickSpec } : {}),
                aiMeta: {
                    ...(meta.aiMeta ?? {}),
                    aiHint,
                    images,
                    ai: aiDraft,
                },
            }),
        },
    });
}

async function ensureAiGeneratedForWatchItem(tx: DB, item: ExistingAcqItem) {
    const aiMeta = getAiMetaFromDescription(item.description);
    let aiExtracted = aiMeta?.ai?.extractedSpec ?? null;
    let aiGenerated = aiMeta?.ai?.generatedDraft ?? null;

    if (aiExtracted) {
        return { aiMeta, aiExtracted, aiGenerated };
    }

    const imageUrls = getAiImageUrls(aiMeta);
    if (!imageUrls.length) {
        return { aiMeta, aiExtracted: null, aiGenerated: null };
    }

    try {
        const aiDraft = await acquisitionAiService.generateAcquisitionDraft({
            origin:
                process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000",
            imageUrls,
            imageEntries: aiMeta?.images ?? [],
            titleHint: item.productTitle ?? null,
            hintText: aiMeta?.aiHint ?? null,
            vendorName: null,
            cost: Number(item.unitCost ?? 0),
        });

        await persistAiDraftToItem(
            tx,
            item.id,
            item.description,
            aiDraft,
            aiMeta?.aiHint ?? null,
            aiMeta?.images ?? []
        );

        aiExtracted = aiDraft.extractedSpec;
        aiGenerated = aiDraft.generatedDraft;
    } catch (e) {
        console.error("[AI_POST_ACQUISITION] generate draft failed:", e);
    }

    return { aiMeta, aiExtracted, aiGenerated };
}


function toDecimal(value: unknown): Prisma.Decimal | null {
    if (value == null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? new Prisma.Decimal(n) : null;
}

function toInt(value: unknown): number | null {
    if (value == null || value === "") return null;
    const n = Number(value);
    return Number.isInteger(n) ? n : null;
}

function toStringOrNull(value: unknown): string | null {
    if (value == null) return null;
    const s = String(value).trim();
    return s ? s : null;
}

function safeJsonParse<T = any>(value?: string | null): T | null {
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

function mapMovementType(value: unknown): MovementType | null {
    const v = String(value ?? "").trim().toUpperCase();
    if (!v) return null;

    if (v === "MANUAL") return MovementType.HAND_WOUND;

    if (v in MovementType) {
        return MovementType[v as keyof typeof MovementType];
    }

    return null;
}

function mapCaseType(value: unknown): CaseType | null {
    const v = String(value ?? "").trim().toUpperCase();
    if (!v) return null;

    if (v === "RECTANGULAR" || v === "TANK") return CaseType.TANK;
    if (v === "ROUND" && "ROUND" in CaseType) {
        return CaseType["ROUND" as keyof typeof CaseType];
    }
    if (v === "SQUARE" && "SQUARE" in CaseType) {
        return CaseType["SQUARE" as keyof typeof CaseType];
    }
    if (v === "TONNEAU" && "TONNEAU" in CaseType) {
        return CaseType["TONNEAU" as keyof typeof CaseType];
    }
    if (v === "CUSHION" && "CUSHION" in CaseType) {
        return CaseType["CUSHION" as keyof typeof CaseType];
    }

    const allowed = new Set(Object.keys(CaseType));
    if (allowed.has(v)) {
        return CaseType[v as keyof typeof CaseType];
    }

    return CaseType.OTHER;
}

function mapGender(value: unknown): Gender | null {
    const v = String(value ?? "").trim().toUpperCase();
    if (!v) return null;

    const allowed = new Set(Object.keys(Gender));
    if (allowed.has(v)) {
        return Gender[v as keyof typeof Gender];
    }

    return null;
}

function mapCaseMaterial(value: unknown): CaseMaterial | null {
    const v = String(value ?? "").trim().toUpperCase();
    if (!v) return null;

    if (v === "PLATED") return CaseMaterial.OTHER;

    const allowed = new Set(Object.keys(CaseMaterial));
    if (allowed.has(v)) {
        return CaseMaterial[v as keyof typeof CaseMaterial];
    }

    return null;
}

function mapGoldColor(value: unknown): GoldColor | null {
    const v = String(value ?? "").trim().toUpperCase();
    if (!v) return null;

    if (v === "YELLOW_GOLD") return GoldColor.YELLOW;
    if (v === "WHITE_GOLD") return GoldColor.WHITE;
    if (v === "ROSE_GOLD") return GoldColor.ROSE;

    const allowed = new Set(Object.keys(GoldColor));
    if (allowed.has(v)) {
        return GoldColor[v as keyof typeof GoldColor];
    }

    return null;
}

function mapStrap(value: unknown): Strap | null {
    const v = String(value ?? "").trim().toUpperCase();
    if (!v) return null;

    if (v === "FABRIC") return Strap.CANVASS;

    const allowed = new Set(Object.keys(Strap));
    if (allowed.has(v)) {
        return Strap[v as keyof typeof Strap];
    }

    return null;
}

function mapGlass(value: unknown): Glass | null {
    const v = String(value ?? "").trim().toUpperCase();
    if (!v) return null;

    const allowed = new Set(Object.keys(Glass));
    if (allowed.has(v)) {
        return Glass[v as keyof typeof Glass];
    }

    return null;
}

async function resolvePostedWatchAiData(
    tx: DB,
    item: ExistingAcqItem,
    aiMeta: any
) {
    let aiExtracted = aiMeta?.ai?.extractedSpec ?? null;
    let aiGenerated = aiMeta?.ai?.generatedDraft ?? null;
    console.log("[ACQ_POST][AI_META]", {
        itemId: item.id,
        aiMeta,
        images: aiMeta?.images,
    });
    if (
        !aiExtracted &&
        Array.isArray(aiMeta?.images) &&
        aiMeta.images.length > 0
    ) {
        const imageUrls = (aiMeta?.images ?? [])
            .map((x: any) => String(x?.url ?? "").trim())
            .filter(Boolean);

        console.log("[ACQ_POST][AI_INPUT]", {
            itemId: item.id,
            imageUrls,
            hint: aiMeta?.aiHint ?? null,
        });
        try {
            const aiDraft = await acquisitionAiService.generateAcquisitionDraft({
                origin:
                    process.env.NEXT_PUBLIC_APP_URL ||
                    process.env.APP_URL ||
                    "http://localhost:3000",
                imageUrls: aiMeta.images
                    .map((x: any) => String(x?.url ?? "").trim())
                    .filter(Boolean),
                imageEntries: aiMeta?.images ?? [],
                titleHint: item.productTitle ?? null,
                hintText: aiMeta?.aiHint ?? null,
                vendorName: null,
                cost: Number(item.unitCost ?? 0),
            });

            aiExtracted = aiDraft?.extractedSpec ?? null;
            aiGenerated = aiDraft?.generatedDraft ?? null;
            console.log("[ACQ_POST][AI_OUTPUT]", {
                itemId: item.id,
                extracted: aiDraft?.extractedSpec ?? null,
                generated: aiDraft?.generatedDraft ?? null,
            });
            const currentMeta = safeJsonParse<Record<string, any>>(item.description) ?? {};
            await tx.acquisitionItem.update({
                where: { id: item.id },
                data: {
                    description: JSON.stringify({
                        ...currentMeta,
                        aiMeta: {
                            ...(aiMeta ?? {}),
                            aiHint: aiMeta?.aiHint ?? null,
                            images: aiMeta?.images ?? [],
                            ai: aiDraft,
                        },
                    }),
                },
            });
        } catch (e) {
            console.error("[ACQ_POST][AI_GENERATE_FAILED]", {
                itemId: item.id,
                error: e instanceof Error ? e.message : e,
            });
        }
    }

    return { aiExtracted, aiGenerated };
}

async function resolveBrandConnectFromAi(tx: DB, brandName: unknown) {
    const normalized = toStringOrNull(brandName);
    if (!normalized) return undefined;

    const matchedBrand = await tx.brand.findFirst({
        where: {
            name: {
                equals: normalized,
                mode: "insensitive" as any,
            },
        },
        select: { id: true },
    });

    if (!matchedBrand?.id) return undefined;
    return { connect: { id: matchedBrand.id } };
}

async function createBaseWatchProduct(
    tx: DB,
    input: {
        title: string;
        sku: string;
        vendorId: string;
        productType: any;
        primaryImageKey?: string | null;
        brandConnect?: { connect: { id: string } };
    }
) {
    return tx.product.create({
        data: {
            title: input.title,
            sku: input.sku,
            status: ProductStatus.AVAILABLE,
            contentStatus: ContentStatus.DRAFT,
            type: input.productType,
            primaryImageUrl: input.primaryImageKey ?? null,
            vendor: { connect: { id: input.vendorId } },
            ...(input.brandConnect ? { brand: input.brandConnect } : {}),
        },
        select: {
            id: true,
            sku: true,
            primaryImageUrl: true,
        },
    });
}

async function createBaseVariantForPostedWatch(
    tx: DB,
    input: {
        productId: string;
        sku: string;
        quantity?: number | null;
        unitCost?: number | Prisma.Decimal | null;
    }
) {
    return tx.productVariant.create({
        data: {
            productId: input.productId,
            sku: input.sku,
            stockQty: Number(input.quantity ?? 1),
            costPrice: new Prisma.Decimal(Number(input.unitCost ?? 0)),
            availabilityStatus: "HIDDEN" as any,
        },
        select: {
            id: true,
            sku: true,
        },
    });
}

async function createWatchSpecSafe(
    tx: DB,
    input: {
        productId: string;
        itemId: string;
        aiExtracted: any;
    }
) {
    const { productId, itemId, aiExtracted } = input;
    if (!aiExtracted) return;

    const probable = aiExtracted?.probableVisualFacts ?? {};

    const resolvedCaseType =
        mapCaseType(aiExtracted.caseType) ?? mapCaseType(probable.caseType);

    const resolvedGender = mapGender(aiExtracted.gender);

    const resolvedMovement =
        mapMovementType(aiExtracted.movement) ?? mapMovementType(probable.movement);

    const resolvedCaseMaterial =
        mapCaseMaterial(aiExtracted.caseMaterial) ??
        mapCaseMaterial(probable.caseMaterial);

    const resolvedStrap =
        mapStrap(aiExtracted.strapType) ?? mapStrap(probable.strapType);

    const resolvedGlass =
        mapGlass(aiExtracted.glass) ?? mapGlass(probable.glass);

    const resolvedDialColor =
        toStringOrNull(aiExtracted.dialColor) ??
        toStringOrNull(probable.dialColor);

    const resolvedWidth =
        toDecimal(aiExtracted.widthEstimateMm) ??
        toDecimal(probable.widthEstimateMm);

    const resolvedLength = toDecimal(aiExtracted.lengthEstimateMm);
    const resolvedThickness = toDecimal(aiExtracted.thicknessEstimateMm);

    const resolvedRef = toStringOrNull(aiExtracted.bestRefCandidate);
    const resolvedModel = toStringOrNull(aiExtracted.modelFamily);
    const resolvedYear = toStringOrNull(aiExtracted.yearEstimate);
    const resolvedCaliber = toStringOrNull(aiExtracted.bestCaliberCandidate);
    const resolvedGoldKarat = toInt(aiExtracted.goldKarat);
    const resolvedGoldColor = mapGoldColor(aiExtracted.goldColor);

    const resolvedBoxIncluded =
        aiExtracted?.likelyAccessories?.boxIncluded == null
            ? null
            : Boolean(aiExtracted.likelyAccessories.boxIncluded);

    const resolvedBookletIncluded =
        aiExtracted?.likelyAccessories?.bookletIncluded == null
            ? null
            : Boolean(aiExtracted.likelyAccessories.bookletIncluded);

    const resolvedCardIncluded =
        aiExtracted?.likelyAccessories?.cardIncluded == null
            ? null
            : Boolean(aiExtracted.likelyAccessories.cardIncluded);

    const hasMeaningfulSpec =
        Boolean(resolvedRef) ||
        Boolean(resolvedModel) ||
        Boolean(resolvedYear) ||
        Boolean(resolvedCaseType) ||
        Boolean(resolvedGender) ||
        Boolean(resolvedMovement) ||
        Boolean(resolvedCaliber) ||
        Boolean(resolvedCaseMaterial) ||
        resolvedGoldKarat != null ||
        Boolean(resolvedGoldColor) ||
        resolvedLength != null ||
        resolvedWidth != null ||
        resolvedThickness != null ||
        Boolean(resolvedStrap) ||
        Boolean(resolvedGlass) ||
        Boolean(resolvedDialColor) ||
        resolvedBoxIncluded != null ||
        resolvedBookletIncluded != null ||
        resolvedCardIncluded != null;

    console.log("[ACQ_POST][WATCH_SPEC_RESOLVED]", {
        itemId,
        productId,
        probable,
        resolvedCaseType,
        resolvedGender,
        resolvedMovement,
        resolvedCaseMaterial,
        resolvedStrap,
        resolvedGlass,
        resolvedDialColor,
        resolvedWidth,
        resolvedLength,
        resolvedThickness,
    });

    if (!hasMeaningfulSpec) {
        console.warn("[ACQ_POST][WATCH_SPEC_SKIPPED_EMPTY_AI]", {
            itemId,
            productId,
            probable,
        });
        return;
    }

    try {
        await tx.watchSpec.create({
            data: {
                product: {
                    connect: { id: productId },
                },
                ref: resolvedRef,
                model: resolvedModel,
                year: resolvedYear,
                caseType: resolvedCaseType,
                gender: resolvedGender,
                movement: resolvedMovement,
                caliber: resolvedCaliber,
                caseMaterial: resolvedCaseMaterial,
                goldKarat: resolvedGoldKarat,
                goldColor: resolvedGoldColor,
                length: resolvedLength,
                width: resolvedWidth,
                thickness: resolvedThickness,
                strap: resolvedStrap,
                glass: resolvedGlass,
                dialColor: resolvedDialColor,
                boxIncluded: resolvedBoxIncluded ?? false,
                bookletIncluded: resolvedBookletIncluded ?? false,
                cardIncluded: resolvedCardIncluded ?? false,
            },
        });
    } catch (e) {
        console.error("[ACQ_POST][WATCH_SPEC_CREATE_FAILED]", {
            itemId,
            productId,
            error: e instanceof Error ? e.message : e,
            aiExtracted,
            probable,
        });
    }
}

async function createProductContentSafe(
    tx: DB,
    input: {
        productId: string;
        itemId: string;
        generatedTitle: string;
        aiExtracted: any;
        aiGenerated: any;
        aiMeta: any;
    }
) {
    const { productId, itemId, generatedTitle, aiExtracted, aiGenerated, aiMeta } = input;

    if (!aiGenerated && !aiExtracted) return;

    try {
        await tx.productContent.create({
            data: {
                productId,
                titleSnapshot: generatedTitle,
                brandSnapshot: toStringOrNull(aiExtracted?.brandName),
                refSnapshot: toStringOrNull(aiExtracted?.bestRefCandidate),
                sizeSnapshot:
                    toStringOrNull(aiExtracted?.widthEstimateMm) ||
                    toStringOrNull(aiExtracted?.lengthEstimateMm),
                movementSnapshot: toStringOrNull(aiExtracted?.movement),
                glassSnapshot: toStringOrNull(aiExtracted?.glass),
                strapClaspSnapshot: toStringOrNull(aiExtracted?.strapType),
                modelSnapshot: toStringOrNull(aiExtracted?.modelFamily),
                yearSnapshot: toStringOrNull(aiExtracted?.yearEstimate),
                generatedContent:
                    toStringOrNull(aiGenerated?.listingCopy) ||
                    toStringOrNull(aiGenerated?.generatedContent),
                promptNote: toStringOrNull(aiMeta?.aiHint),
                generatedAt: new Date(),
            },
        });
    } catch (e) {
        console.error("[ACQ_POST][PRODUCT_CONTENT_CREATE_FAILED]", {
            itemId,
            productId,
            error: e instanceof Error ? e.message : e,
        });
    }
}

async function maybeCreateTechnicalCheckForPostedWatch(
    tx: DB,
    input: {
        acqId: string;
        itemId: string;
        productId: string;
        variantId: string;
        productSku?: string | null;
        variantSku?: string | null;
        primaryImageUrl?: string | null;
        needService?: boolean;
    }
) {
    if (!input.needService) return;

    await createTechnicalCheckFromAcquisitionTx(tx as any, {
        productId: input.productId,
        variantId: input.variantId,
        skuSnapshot: input.productSku ?? input.variantSku ?? null,
        primaryImageUrlSnapshot: input.primaryImageUrl ?? null,
        notes: `Tạo từ phiếu nhập ${input.acqId}: Kiểm tra kỹ thuật tổng quát`,
    });
}

async function createStrapProductForPostedItem(
    tx: DB,
    params: { item: ExistingAcqItem; vendorId: string }
) {
    const { item, vendorId } = params;
    const strapSpec = getStrapSpecFromDescription(item.description);
    const aiMeta = getAiMetaFromDescription(item.description);
    const sku = await genUniqueProductSku(tx as any, item.productType ?? "WATCH_STRAP");
    const primaryImageKey = aiMeta?.images?.[0]?.key ?? null;

    const created = await tx.product.create({
        data: {
            title: item.productTitle,
            sku,
            status: ProductStatus.AVAILABLE,
            contentStatus: ContentStatus.DRAFT,
            type: "WATCH_STRAP" as any,
            vendor: { connect: { id: vendorId } },
            primaryImageUrl: primaryImageKey,
            variants: {
                create: [
                    {
                        sku,
                        stockQty: Number(item.quantity ?? 1),
                        costPrice: new Prisma.Decimal(Number(item.unitCost ?? 0)),
                        price: new Prisma.Decimal(
                            strapSpec?.sellPrice != null ? Number(strapSpec.sellPrice) : Number(item.unitCost ?? 0)
                        ),
                        availabilityStatus: "HIDDEN" as any,
                        strapSpec: {
                            create: {
                                lugWidthMM: Number(strapSpec?.lugWidthMM ?? 20),
                                buckleWidthMM: Number(strapSpec?.buckleWidthMM ?? 18),
                                color: strapSpec?.color ?? "Black",
                                material: (strapSpec?.material as any) ?? "LEATHER",
                                quickRelease:
                                    strapSpec?.quickRelease == null ? true : Boolean(strapSpec.quickRelease),
                            },
                        },
                    },
                ],
            },
        },
        select: {
            id: true,
            variants: { select: { id: true }, take: 1 },
        },
    });

    await tx.acquisitionItem.update({
        where: { id: item.id },
        data: {
            productId: created.id,
            variantId: created.variants?.[0]?.id ?? null,
        },
    });
}

async function createWatchProductForPostedItem(
    tx: DB,
    params: {
        acqId: string;
        vendorId: string;
        item: ExistingAcqItem;
    }
) {
    const { acqId, vendorId, item } = params;

    const watchFlags = getWatchFlagsFromDescription(item.description);
    const aiMeta = getAiMetaFromDescription(item.description);

    const { aiExtracted, aiGenerated } = await resolvePostedWatchAiData(
        tx,
        item,
        aiMeta
    );

    const productType = (item.productType ?? "WATCH") as any;
    const sku = await genUniqueProductSku(tx as any, productType);
    const primaryImageKey = aiMeta?.images?.[0]?.key ?? null;

    const brandConnect = await resolveBrandConnectFromAi(
        tx,
        aiExtracted?.brandName
    );

    const generatedTitle =
        toStringOrNull(aiGenerated?.generatedTitle) ||
        toStringOrNull(item.productTitle) ||
        "Untitled draft product";

    const createdProduct = await createBaseWatchProduct(tx, {
        title: generatedTitle,
        sku,
        vendorId,
        productType,
        primaryImageKey,
        brandConnect,
    });

    const createdVariant = await createBaseVariantForPostedWatch(tx, {
        productId: createdProduct.id,
        sku,
        quantity: Number(item.quantity ?? 1),
        unitCost: Number(item.unitCost ?? 0),
    });

    await createWatchSpecSafe(tx, {
        productId: createdProduct.id,
        itemId: item.id,
        aiExtracted,
    });

    await createProductContentSafe(tx, {
        productId: createdProduct.id,
        itemId: item.id,
        generatedTitle,
        aiExtracted,
        aiGenerated,
        aiMeta,
    });

    await tx.acquisitionItem.update({
        where: { id: item.id },
        data: {
            productId: createdProduct.id,
            variantId: createdVariant.id,
        },
    });

    await maybeCreateTechnicalCheckForPostedWatch(tx, {
        acqId,
        itemId: item.id,
        productId: createdProduct.id,
        variantId: createdVariant.id,
        productSku: createdProduct.sku ?? null,
        variantSku: createdVariant.sku ?? null,
        primaryImageUrl: createdProduct.primaryImageUrl ?? null,
        needService: Boolean(watchFlags?.needService ?? false),
    });
}
async function createProductForPostedItem(
    tx: DB,
    params: {
        acqId: string;
        vendorId: string;
        item: ExistingAcqItem;
    }
) {
    if (params.item.productType === "WATCH_STRAP") {
        return createStrapProductForPostedItem(tx, {
            item: params.item,
            vendorId: params.vendorId,
        });
    }

    return createWatchProductForPostedItem(tx, params);
}

async function syncProductFromAcquisitionItem(tx: DB, itemId: string) {
    const item = await tx.acquisitionItem.findUnique({
        where: { id: itemId },
        include: {
            product: true,
            variant: true,
        },
    });

    if (!item?.productId) return;

    await tx.product.update({
        where: { id: item.productId },
        data: {
            title: item.productTitle,
        },
    });

    if (item.variantId) {
        await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
                stockQty: Number(item.quantity ?? 0),
                costPrice: item.unitCost ?? undefined,
            },
        });
    }
}

async function ensureItemCanBeCancelled(tx: DB, item: ExistingAcqItem) {
    if (!item.productId) return;

    const linked = await tx.product.findUnique({
        where: { id: item.productId },
        select: {
            id: true,
            _count: {
                select: {
                    orderItems: true,
                    InvoiceItem: true,
                    ServiceRequest: true,
                    maintenanceRecords: true,
                    Reservation: true,
                },
            },
        },
    });

    if (!linked) return;

    const blockers = [
        linked._count.orderItems > 0 ? "đơn hàng" : null,
        linked._count.InvoiceItem > 0 ? "hóa đơn" : null,
        linked._count.ServiceRequest > 0 ? "phiếu service" : null,
        linked._count.maintenanceRecords > 0 ? "maintenance log" : null,
        linked._count.Reservation > 0 ? "reservation" : null,
    ].filter(Boolean);

    if (blockers.length > 0) {
        throw new Error(
            `Không thể hủy dòng \"${item.productTitle}\" vì sản phẩm đã phát sinh ${blockers.join(", ")}.`
        );
    }
}

async function archiveProductForCancelledAcquisitionItem(tx: DB, item: ExistingAcqItem) {
    if (!item.productId) return;

    await tx.product.update({
        where: { id: item.productId },
        data: {
            status: ProductStatus.HOLD,
            contentStatus: ContentStatus.ARCHIVED,
        },
    });

    await tx.productVariant.updateMany({
        where: { productId: item.productId },
        data: {
            stockQty: 0,
            availabilityStatus: "HIDDEN" as any,
        },
    });
}

export async function getAdminAcquisitionList(raw: Record<string, unknown>) {
    const page = Math.max(1, asNumber(raw.page, 1));
    const pageSize = Math.max(1, Math.min(200, asNumber(raw.pageSize, DEFAULT_PAGE_SIZE)));

    const q = asString(raw.q)?.trim();
    const vendorId = asString(raw.vendorId);
    const type = normalizeType(raw.type);
    const sort = normalizeSort(raw.sort);
    const acquiredFrom = asString(raw.from ?? raw.acquiredFrom);
    const acquiredTo = asString(raw.to ?? raw.acquiredTo);
    const view = normalizeView(raw.view);
    const explicitStatus = normalizeStatus(raw.status);
    const activeStatus = explicitStatus ?? statusFromView(view);

    const baseFilters = {
        page,
        pageSize,
        q,
        vendorIds: vendorId ? [vendorId] : undefined,
        customerIds: undefined,
        type: type ? [type] : undefined,
        status: undefined,
        acquiredFrom,
        acquiredTo,
        hasInvoice: undefined,
        sort,
    } as any;

    const listFilters = {
        ...baseFilters,
        status: activeStatus ? [activeStatus] : undefined,
    } as any;

    const whereBase = buildAcqWhere(baseFilters);
    const whereList = buildAcqWhere(listFilters);

    const [{ rows, total }, all, draft, posted, canceled] = await Promise.all([
        repoAcq.getAcqList(whereList, buildAcqOrderBy(sort as any), (page - 1) * pageSize, pageSize),
        prisma.acquisition.count({ where: whereBase }),
        prisma.acquisition.count({ where: buildAcqWhere({ ...baseFilters, status: ["DRAFT"] } as any) }),
        prisma.acquisition.count({ where: buildAcqWhere({ ...baseFilters, status: ["POSTED"] } as any) }),
        prisma.acquisition.count({ where: buildAcqWhere({ ...baseFilters, status: ["CANCELED"] } as any) }),
    ]);

    const items = rows.map((a) => {
        const activeItems = (a.acquisitionItem ?? []).filter(
            (it) => String(it.status ?? "").toUpperCase() !== "CANCELLED"
        );

        return {
            id: a.id,
            refNo: a.refNo,
            notes: a.notes,
            type: a.type,
            status: a.accquisitionStt,
            vendorName: a.vendor?.name ?? null,
            itemCount: activeItems.length,
            hasInvoice: a._count.invoice > 0,
            createdAt: a.createdAt,
            cost: computeActiveAcquisitionTotal(activeItems),
            updatedAt: a.updatedAt,
            currency: a.currency ?? "VND",
        };
    });

    return {
        items,
        total,
        page,
        pageSize,
        counts: {
            all,
            draft,
            posted,
            canceled,
        },
    };
}

export async function getAcquisitionDetail(id: string) {
    const acq = await repoAcq.getAcqtById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    return acq;
}

export async function createAcquisitionWithItem(input: dto.CreateAcquisitionInput) {
    return await prisma.$transaction(async (tx) => {
        let vendorId = input.vendorId;

        if (!vendorId && input.quickVendorName) {
            const newVendor = await tx.vendor.create({
                data: { name: input.quickVendorName },
            });
            vendorId = newVendor.id;
        }

        if (!vendorId) {
            throw new Error("Thiếu vendor");
        }

        const acq = await repoAcq.createDraft(tx, {
            vendorId,
            currency: input.currency,
            type: input.type,
            createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
            notes: input.notes,
        });

        let total = 0;
        for (const raw of input.items) {
            const item = toDraftItem(raw);
            await repoAcq.createAcqItem(tx, acq.id, item as any);
            total += item.quantity * item.unitCost;
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);
        return { id: acq.id };
    });
}

export async function postAcquisition(acqId: string, vendorName: string) {
    const acq = await repoAcq.getAcqtById(acqId);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");

    const vendorId = await resolveVendorIdForPosting(acq, vendorName);
    if (!vendorId) {
        throw new Error("Không tìm thấy vendor để post phiếu");
    }

    const items = acq.acquisitionItem ?? [];
    const newItems = items.filter((item) => !item.productId);
    const existingItems = items.filter((item) => !!item.productId);

    const result = await prisma.$transaction(
        async (tx) => {
            if (existingItems.length > 0) {
                const productIds = Array.from(
                    new Set(existingItems.map((x) => x.productId).filter((v): v is string => !!v))
                );

                if (productIds.length) {
                    const variants = await tx.productVariant.findMany({
                        where: { productId: { in: productIds } },
                        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
                        select: {
                            id: true,
                            productId: true,
                        },
                    });

                    const variantMap = new Map<string, string>();
                    for (const row of variants) {
                        if (!variantMap.has(row.productId)) {
                            variantMap.set(row.productId, row.id);
                        }
                    }

                    for (const row of existingItems) {
                        if (row.variantId || !row.productId) continue;
                        const resolvedVariantId = variantMap.get(row.productId);
                        if (!resolvedVariantId) continue;

                        await tx.acquisitionItem.update({
                            where: { id: row.id },
                            data: { variantId: resolvedVariantId },
                        });
                    }
                }
            }

            for (const item of newItems) {
                await createProductForPostedItem(tx, {
                    acqId: acq.refNo ?? acq.id,
                    vendorId,
                    item: item as ExistingAcqItem,
                });
            }

            await tx.acquisitionItem.updateMany({
                where: { acquisitionId: acqId, status: "DRAFT" as any },
                data: { status: "SENT" as any },
            });

            return repoAcq.changeDraftToPost(tx, acqId);
        },
        {
            maxWait: 10000,
            timeout: 60000,
        }
    );

    await prisma.$transaction(
        async (tx) => {
            await createInvoiceFromAcquisition(tx as any, acqId);
        },
        {
            maxWait: 10000,
            timeout: 30000,
        }
    );

    return result;
}

export async function postMultipleAcquisitions(acquisitionIds: string[]) {
    const posted: string[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const acqId of acquisitionIds) {
        try {
            const acq = await repoAcq.getAcqtById(acqId);

            if (!acq) {
                failed.push({ id: acqId, error: "Không tìm thấy phiếu nhập" });
                continue;
            }

            if (acq.accquisitionStt !== "DRAFT") {
                failed.push({
                    id: acqId,
                    error: "Chỉ phiếu DRAFT mới được duyệt",
                });
                continue;
            }

            await postAcquisition(acqId, "");
            posted.push(acqId);
        } catch (e) {
            failed.push({
                id: acqId,
                error: e instanceof Error ? e.message : "Bulk post failed",
            });
        }
    }

    return { posted, failed };
}

export async function cancelAcquisition(id: string) {
    const acq = await repoAcq.getAcqtById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.accquisitionStt === "POSTED") {
        throw new Error("Không thể hủy phiếu đã đăng");
    }

    return prisma.acquisition.update({
        where: { id },
        data: { accquisitionStt: "CANCELED" as any },
    });
}

export async function updateAcqItem(tx: DB, it: any) {
    return repoAcq.updateAcqItem(tx, it);
}

async function updateDraftAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const existing = await repoAcq.findAcqItems(tx, acqId);

    const existingIds = new Set(existing.map((i) => i.id));
    const receivedIds = new Set(items.map((i) => i.id));

    const toDelete = [...existingIds].filter((id) => !receivedIds.has(id));

    if (toDelete.length > 0) {
        await repoAcq.deleteAcqItems(tx, toDelete);
    }

    for (const it of items) {
        if (it.id.startsWith("tmp-")) {
            await repoAcq.createAcqItem(tx, acqId, it);
        } else {
            await updateAcqItem(tx, it);
        }
    }
}

async function updatePostedAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const existing = await repoAcq.findAcqItems(tx, acqId);
    const existingMap = new Map(existing.map((item) => [item.id, item]));
    const receivedIds = new Set(items.filter((i) => !i.id.startsWith("tmp-")).map((i) => i.id));

    for (const item of existing) {
        if (item.status === "CANCELLED") continue;
        if (!receivedIds.has(item.id)) {
            await ensureItemCanBeCancelled(tx, item);
            await archiveProductForCancelledAcquisitionItem(tx, item);
            await tx.acquisitionItem.update({
                where: { id: item.id },
                data: {
                    status: "CANCELLED" as any,
                    returnedAt: new Date(),
                    notes: item.notes
                        ? `${item.notes}\n[ADJUSTMENT] Dòng bị hủy khỏi phiếu nhập sau khi đã post.`
                        : "[ADJUSTMENT] Dòng bị hủy khỏi phiếu nhập sau khi đã post.",
                },
            });
        }
    }

    for (const incoming of items) {
        if (incoming.id.startsWith("tmp-")) {
            const created = await repoAcq.createAcqItem(tx, acqId, incoming);
            const fresh = await tx.acquisitionItem.findUnique({ where: { id: created.id } });
            if (!fresh) continue;
            await tx.acquisitionItem.update({
                where: { id: fresh.id },
                data: { status: "SENT" as any },
            });
            const acq = await tx.acquisition.findUnique({
                where: { id: acqId },
                select: { id: true, refNo: true, vendorId: true },
            });
            if (!acq?.vendorId) {
                throw new Error("Phiếu nhập đã post nhưng không có vendor để tạo product mới.");
            }
            const freshWithStatus = await tx.acquisitionItem.findUnique({ where: { id: fresh.id } });
            if (!freshWithStatus) continue;
            await createProductForPostedItem(tx, {
                acqId: acq.refNo ?? acq.id,
                vendorId: acq.vendorId,
                item: freshWithStatus as ExistingAcqItem,
            });
            continue;
        }

        const existingItem = existingMap.get(incoming.id);
        if (!existingItem) {
            throw new Error(`Không tìm thấy dòng phiếu nhập ${incoming.id}`);
        }
        if (existingItem.status === "CANCELLED") {
            throw new Error(`Dòng \"${existingItem.productTitle}\" đã bị hủy, không thể chỉnh sửa tiếp.`);
        }

        await updateAcqItem(tx, incoming);
        await tx.acquisitionItem.update({
            where: { id: incoming.id },
            data: { status: "SENT" as any },
        });
        await syncProductFromAcquisitionItem(tx, incoming.id);
    }
}

export async function updateAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const acq = await tx.acquisition.findUnique({
        where: { id: acqId },
        select: { accquisitionStt: true },
    });
    if (!acq) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    if (acq.accquisitionStt === "POSTED") {
        await updatePostedAcquisitionItems(tx, acqId, items);
    } else {
        await updateDraftAcquisitionItems(tx, acqId, items);
    }

    const all = await repoAcq.findAcqItems(tx, acqId);
    const total = computeActiveAcquisitionTotal(all as any[]);

    await repoAcq.updateAcqTotal(tx, acqId, total);

    return { success: true, total };
}

export async function updateAcquisitionWithItems(
    acqId: string,
    payload: {
        vendorId?: string;
        acquiredAt?: string | Date | null;
        currency?: string | null;
        type?: AcquisitionType | string | null;
        notes?: string | null;
        items?: ItemInput[];
    }
) {
    const acq = await repoAcq.getAcqtById(acqId);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.accquisitionStt === "CANCELED") {
        throw new Error("Phiếu đã hủy, không thể chỉnh sửa");
    }

    const items = Array.isArray(payload?.items) ? payload.items : [];
    if (!items.length) {
        throw new Error("Phiếu nhập phải còn ít nhất 1 dòng sản phẩm");
    }

    return prisma.$transaction(async (tx) => {
        await tx.acquisition.update({
            where: { id: acqId },
            data: {
                vendorId: payload.vendorId ?? undefined,
                acquiredAt: payload.acquiredAt ? new Date(payload.acquiredAt) : undefined,
                currency: payload.currency ?? undefined,
                type: (payload.type as AcquisitionType | undefined) ?? undefined,
                notes: payload.notes ?? undefined,
            },
            select: { id: true },
        });

        await updateAcquisitionItems(tx, acqId, items);

        const updated = await repoAcq.getAcqtById(acqId, tx);
        return { success: true, id: acqId, acquisition: updated };
    });
}
