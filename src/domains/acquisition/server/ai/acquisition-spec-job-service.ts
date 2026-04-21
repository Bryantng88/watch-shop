"use server";

import { Prisma } from "@prisma/client";
import { genUniqueAcquisitionSku, type AcquisitionSkuKind } from "@/domains/acquisition/shared/sku.helper";
import { generateAcquisitionSpec } from "./acquisition-ai.service";
import { mapWatchSpecFromAi, buildProductTitleFromWatchAi } from "./acquisition-spec-mapper";
import { resolveBrandFromAcquisitionAi } from "./acquisition-brand-resolver";

type Tx = Prisma.TransactionClient;

function safeJsonParse(value?: string | null) {
    if (!value) return {};
    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
}

function stringifyJson(value: unknown) {
    return JSON.stringify(value ?? {});
}

function getImagesFromMeta(meta: any): string[] {
    return (meta?.aiMeta?.images ?? [])
        .map((item: any) => item?.url)
        .filter((url: unknown): url is string => typeof url === "string" && !!url);
}

function resolveSkuKind(item: {
    type?: string | null;
    product?: {
        type?: string | null;
    } | null;
}): AcquisitionSkuKind {
    const raw = String(item.product?.type ?? item.type ?? "").toUpperCase();

    if (raw.includes("STRAP")) return "STRAP";
    if (raw.includes("BOX")) return "BOX";
    return "WATCH";
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
            status: "PENDING",
            errorMessage: null,
            processedAt: null,
        },
        create: {
            acquisitionItemId: input.acquisitionItemId,
            productId: input.productId,
            status: "PENDING",
        },
    });
}

export async function processAcquisitionSpecJob(
    tx: Tx,
    input: {
        acquisitionItemId: string;
    }
) {
    const item = await tx.acquisitionItem.findUnique({
        where: { id: input.acquisitionItemId },
        include: {
            Acquisition: true,
            Product: {
                include: {
                    brand: true,
                },
            },
        },
    });

    if (!item || !item.productId || !item.Product) {
        throw new Error("Acquisition item or product not found");
    }

    const currentMeta = safeJsonParse(item.description);
    const images = getImagesFromMeta(currentMeta);

    const ai = await generateAcquisitionSpec({
        title: item.productTitle ?? item.Product.title,
        brand: item.Product.brand?.name ?? null,
        model: null,
        notes: item.notes ?? item.Acquisition?.notes ?? null,
        condition: item.condition ?? item.Acquisition?.condition ?? null,
        images,
    });

    const resolvedBrand =
        item.Product.brand ??
        (await resolveBrandFromAcquisitionAi(tx as any, {
            titleHint: item.productTitle ?? item.Product.title,
            aiHint: null,
            extractedSpec: ai.extractedSpec,
        }));

    const skuKind = resolveSkuKind(item);

    if (!item.Product.sku) {
        const sku = await genUniqueAcquisitionSku(tx, {
            kind: skuKind,
            brandName: resolvedBrand?.name ?? item.Product.brand?.name ?? null,
            date: item.Acquisition?.acquiredAt ?? new Date(),
        });

        await tx.product.update({
            where: { id: item.productId },
            data: { sku },
        });
    }

    if (skuKind === "WATCH") {
        const spec = mapWatchSpecFromAi(ai.extractedSpec);

        await tx.watchSpec.upsert({
            where: { productId: item.productId },
            create: {
                productId: item.productId,
                ...spec,
            },
            update: {
                ...spec,
            },
        });

        await tx.product.update({
            where: { id: item.productId },
            data: {
                title: buildProductTitleFromWatchAi({
                    brand: resolvedBrand?.name ?? item.product.brand?.name,
                    extractedSpec: ai.extractedSpec,
                    fallback: item.productTitle ?? item.product.title,
                }),
                ...(resolvedBrand && !item.product.brandId
                    ? { brandId: resolvedBrand.id }
                    : {}),
            },
        });
    } else {
        await tx.product.update({
            where: { id: item.productId },
            data: {
                ...(resolvedBrand && !item.product.brandId
                    ? { brandId: resolvedBrand.id }
                    : {}),
            },
        });
    }

    await tx.acquisitionItem.update({
        where: { id: item.id },
        data: {
            description: stringifyJson({
                ...currentMeta,
                aiMeta: {
                    ...(currentMeta as any)?.aiMeta,
                    ai,
                },
            }),
        },
    });

    await tx.acquisitionSpecJob.update({
        where: { acquisitionItemId: item.id },
        data: {
            status: "DONE",
            errorMessage: null,
            processedAt: new Date(),
        },
    });
}

export async function failAcquisitionSpecJob(
    tx: Tx,
    input: {
        acquisitionItemId: string;
        errorMessage: string;
    }
) {
    await tx.acquisitionSpecJob.update({
        where: { acquisitionItemId: input.acquisitionItemId },
        data: {
            status: "FAILED",
            errorMessage: input.errorMessage,
            processedAt: new Date(),
        },
    });
}