/*"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { generateAcquisitionSpec } from "./acquisition-ai.service";
import {
  mapWatchSpecFromAi,
  buildProductTitleFromWatchAi,
} from "./acquisition-spec-mapper";
import { resolveBrandFromAcquisitionAi } from "./acquisition-brand-resolver";
import { genUniqueAcquisitionSku } from "@/domains/acquisition/shared/sku.helper";

type Tx = Prisma.TransactionClient;
type JsonObject = Record<string, any>;

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

function getImageUrlsFromAiMeta(aiMeta: any): string[] {
  return getImageEntriesFromAiMeta(aiMeta)
    .map((item) => item?.url)
    .filter((url): url is string => typeof url === "string" && url.trim().length > 0);
}

function isPresent(value: unknown) {
  return value !== null && value !== undefined && value !== "";
}

function hasMeaningfulSpec(spec: Record<string, unknown>) {
  return Object.values(spec).some(isPresent);
}

function omitNullish<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null && value !== undefined)
  ) as Partial<T>;
}

function buildSafeWatchSpecCreate(productId: string, spec: Record<string, unknown>) {
  return {
    productId,
    ...omitNullish(spec),
    updatedAt: new Date(),
  };
}

function buildSafeWatchSpecUpdate(spec: Record<string, unknown>) {
  return {
    ...omitNullish(spec),
  };
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

function shouldRefreshSku(input: {
  productType?: string | null;
  currentSku?: string | null;
  resolvedBrandName?: string | null;
}) {
  if (String(input.productType ?? "").toUpperCase() !== "WATCH") return false;
  if (!input.resolvedBrandName) return false;
  if (!input.currentSku) return true;

  const sku = String(input.currentSku);
  return /^WAT-\d{4}-\d{4}$/i.test(sku) || /^PRD-\d{4}-\d{4}$/i.test(sku);
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

export async function processAcquisitionSpecJob(
  tx: Tx,
  input: {
    acquisitionItemId: string;
  }
) {
  const item = await tx.acquisitionItem.findUnique({
    where: { id: input.acquisitionItemId },
    include: {
      acquisition: true,
      product: {
        include: {
          brand: true,
        },
      },
    },
  });

  if (!item || !item.productId || !item.product) {
    throw new Error("Acquisition item or product not found");
  }

  if (item.product.type !== "WATCH") {
    await tx.acquisitionSpecJob.update({
      where: { acquisitionItemId: item.id },
      data: {
        status: "DONE",
        lastError: null,
        finishedAt: new Date(),
      },
    });
    return;
  }

  const currentAiMeta = getAiMetaFromDescription(item.description);
  const imageEntries = getImageEntriesFromAiMeta(currentAiMeta);
  const imageUrls = getImageUrlsFromAiMeta(currentAiMeta);

  const ai =
    currentAiMeta?.ai?.extractedSpec
      ? currentAiMeta.ai
      : await generateAcquisitionSpec({
        title: item.productTitle ?? item.product.title,
        brand: item.product.brand?.name ?? null,
        model: null,
        notes: item.notes ?? item.acquisition?.notes ?? null,
        condition: null,
        images: imageUrls,
      });

  if (!ai?.extractedSpec) {
    throw new Error("AI did not return extractedSpec");
  }

  const resolvedBrand =
    item.product.brand ??
    (await resolveBrandFromAcquisitionAi(tx as any, {
      titleHint: item.productTitle ?? item.product.title,
      aiHint: currentAiMeta?.aiHint ?? null,
      extractedSpec: ai.extractedSpec,
    }));

  const resolvedBrandName =
    resolvedBrand?.name ??
    item.product.brand?.name ??
    ai?.extractedSpec?.confirmedFacts?.brandName ??
    ai?.extractedSpec?.brandName ??
    ai?.extractedSpec?.suggestedFacts?.probableBrand ??
    ai?.extractedSpec?.probableVisualFacts?.probableBrand ??
    null;

  await persistAiDraftToItem(tx, item.id, item.description, {
    aiHint: currentAiMeta?.aiHint ?? null,
    images: imageEntries,
    ai,
  });

  const nextSku = shouldRefreshSku({
    productType: item.product.type,
    currentSku: item.product.sku,
    resolvedBrandName,
  })
    ? await genUniqueAcquisitionSku(tx as any, {
      kind: "WATCH",
      brandName: resolvedBrandName,
      date: item.acquisition?.acquiredAt ?? new Date(),
    })
    : undefined;

  const mappedSpec = mapWatchSpecFromAi(ai.extractedSpec);

  await tx.product.update({
    where: { id: item.productId },
    data: {
      title: buildProductTitleFromWatchAi({
        brand: resolvedBrandName,
        extractedSpec: ai.extractedSpec,
        fallback: item.productTitle ?? item.product.title,
      }),
      ...(resolvedBrand && !item.product.brandId
        ? { brandId: resolvedBrand.id }
        : {}),
      ...(nextSku ? { sku: nextSku } : {}),
    },
  });

  if (hasMeaningfulSpec(mappedSpec)) {
    await tx.watchSpec.upsert({
      where: { productId: item.productId },
      create: buildSafeWatchSpecCreate(item.productId, mappedSpec),
      update: buildSafeWatchSpecUpdate(mappedSpec),
    });
  }

  await tx.acquisitionSpecJob.update({
    where: { acquisitionItemId: item.id },
    data: {
      status: "DONE",
      lastError: null,
      finishedAt: new Date(),
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
      lastError: input.errorMessage,
      finishedAt: new Date(),
      runAfter: new Date(Date.now() + 5 * 60 * 1000),
    },
  });
}

export async function processQueuedAcquisitionSpecJobs(input?: {
  limit?: number;
  includeFailed?: boolean;
}) {
  const limit = Math.max(1, Math.min(Number(input?.limit ?? 3), 10));
  const includeFailed = Boolean(input?.includeFailed);

  const jobs = await prisma.acquisitionSpecJob.findMany({
    where: {
      status: includeFailed
        ? { in: ["PENDING", "FAILED"] }
        : "PENDING",
      runAfter: { lte: new Date() },
    },
    orderBy: [{ runAfter: "asc" }, { createdAt: "asc" }],
    take: limit,
    include: {
      acquisitionItem: true,
    },
  });

  let processed = 0;
  let failed = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (const job of jobs) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.acquisitionSpecJob.update({
          where: { id: job.id },
          data: {
            status: "RUNNING",
            startedAt: new Date(),
            attempts: { increment: 1 },
            lastError: null,
          },
        });

        await processAcquisitionSpecJob(tx, {
          acquisitionItemId: job.acquisitionItemId,
        });
      });

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
  */