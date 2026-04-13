"use server";

import { prisma, DB } from "@/server/db/client";
import * as acquisitionAiService from "./acquisition-ai.service";
import * as repoAcq from "../core/acquisition.repo";
import {
  getAiMetaFromDescription,
  parseAcquisitionItemMeta,
} from "../content/acquisition-item-metadata";
import {
  buildProductTitleFromAi,
  mapCaseMaterial,
  mapCaseType,
  mapGender,
  mapGlass,
  mapGoldColor,
  mapMovementType,
  mapStrap,
  resolveSpecStatusFromAi,
} from "../shared/acquisition.mapper";
import {
  safeJsonParse,
  toDecimal,
  toInt,
  toStringOrNull,
} from "../shared/helper";

type ExistingAcqItem = Awaited<ReturnType<typeof repoAcq.findAcqItems>>[number];

type AiDraftPayload = {
  extractedSpec?: any;
  generatedDraft?: any | null;
  meta?: any;
};

type PostedWatchAiBundle = {
  aiMeta: any;
  aiExtracted: any;
  aiGenerated: any | null;
  aiDraft: AiDraftPayload | null;
};

function getAiImageUrls(aiMeta: ReturnType<typeof getAiMetaFromDescription>) {
  return (aiMeta?.images ?? []).map((x) => String(x?.url ?? "").trim()).filter(Boolean);
}

export async function enqueueAcquisitionSpecJob(
  tx: DB,
  input: {
    acquisitionItemId: string;
    productId: string;
  }
) {
  await (tx as any).acquisitionSpecJob.upsert({
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

  console.log("[ACQ_SPEC_JOB][ENQUEUED]", input);
}

export async function persistAiDraftToItem(
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

export async function preparePostedWatchAiDataOutsideTx(
  item: ExistingAcqItem,
  aiMetaInput?: any
): Promise<PostedWatchAiBundle> {
  const aiMeta = aiMetaInput ?? getAiMetaFromDescription(item.description);
  let aiExtracted = aiMeta?.ai?.extractedSpec ?? null;
  let aiGenerated = aiMeta?.ai?.generatedDraft ?? null;
  let aiDraft: AiDraftPayload | null = aiMeta?.ai ?? null;

  if (aiExtracted) {
    return { aiMeta, aiExtracted, aiGenerated, aiDraft };
  }

  const imageUrls = getAiImageUrls(aiMeta);
  if (!imageUrls.length && !(aiMeta?.images?.length > 0)) {
    return { aiMeta, aiExtracted: null, aiGenerated: null, aiDraft: null };
  }

  const generated = await acquisitionAiService.generateAcquisitionDraft({
    origin: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000",
    imageUrls,
    imageEntries: aiMeta?.images ?? [],
    titleHint: item.productTitle ?? null,
    hintText: aiMeta?.aiHint ?? null,
    vendorName: null,
    cost: Number(item.unitCost ?? 0),
  });

  aiDraft = generated;
  aiExtracted = generated?.extractedSpec ?? null;
  aiGenerated = generated?.generatedDraft ?? null;

  return { aiMeta, aiExtracted, aiGenerated, aiDraft };
}

export async function persistPostedWatchAiData(
  tx: DB,
  item: ExistingAcqItem,
  bundle: PostedWatchAiBundle
) {
  if (!bundle.aiDraft) return;

  const currentMeta = safeJsonParse<Record<string, any>>(item.description) ?? {};
  await tx.acquisitionItem.update({
    where: { id: item.id },
    data: {
      description: JSON.stringify({
        ...currentMeta,
        aiMeta: {
          ...(bundle.aiMeta ?? {}),
          aiHint: bundle.aiMeta?.aiHint ?? null,
          images: bundle.aiMeta?.images ?? [],
          ai: bundle.aiDraft,
        },
      }),
    },
  });
}

export async function resolveBrandConnectFromAi(tx: DB, brandName: unknown) {
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

export async function createWatchSpecSafe(
  tx: DB,
  input: {
    productId: string;
    aiExtracted: any;
  }
) {
  const { productId, aiExtracted } = input;
  if (!aiExtracted) return;

  const probable = aiExtracted?.probableVisualFacts ?? {};

  const resolvedCaseType = mapCaseType(aiExtracted.caseType) ?? mapCaseType(probable.caseType);
  const resolvedGender = mapGender(aiExtracted.gender);
  const resolvedMovement = mapMovementType(aiExtracted.movement) ?? mapMovementType(probable.movement);
  const resolvedCaseMaterial =
    mapCaseMaterial(aiExtracted.caseMaterial) ?? mapCaseMaterial(probable.caseMaterial);
  const resolvedStrap = mapStrap(aiExtracted.strapType) ?? mapStrap(probable.strapType);
  const resolvedGlass = mapGlass(aiExtracted.glass) ?? mapGlass(probable.glass);
  const resolvedDialColor = toStringOrNull(aiExtracted.dialColor) ?? toStringOrNull(probable.dialColor);
  const resolvedWidth = toDecimal(aiExtracted.widthEstimateMm) ?? toDecimal(probable.widthEstimateMm);
  const resolvedLength = toDecimal(aiExtracted.lengthEstimateMm);
  const resolvedThickness = toDecimal(aiExtracted.thicknessEstimateMm);
  const resolvedRef = toStringOrNull(aiExtracted.bestRefCandidate);
  const resolvedModel = toStringOrNull(aiExtracted.modelFamily);
  const resolvedYear = toStringOrNull(aiExtracted.yearEstimate);
  const resolvedCaliber = toStringOrNull(aiExtracted.bestCaliberCandidate);
  const resolvedGoldKarat = toInt(aiExtracted.goldKarat);
  const resolvedGoldColor = mapGoldColor(aiExtracted.goldColor);

  const resolvedBoxIncluded =
    aiExtracted?.likelyAccessories?.boxIncluded == null ? null : Boolean(aiExtracted.likelyAccessories.boxIncluded);
  const resolvedBookletIncluded =
    aiExtracted?.likelyAccessories?.bookletIncluded == null ? null : Boolean(aiExtracted.likelyAccessories.bookletIncluded);
  const resolvedCardIncluded =
    aiExtracted?.likelyAccessories?.cardIncluded == null ? null : Boolean(aiExtracted.likelyAccessories.cardIncluded);

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

  if (!hasMeaningfulSpec) return;

  await tx.watchSpec.upsert({
    where: { productId },
    update: {
      ref: resolvedRef,
      model: resolvedModel,
      year: resolvedYear,
      caseType: resolvedCaseType ?? undefined,
      gender: resolvedGender ?? undefined,
      movement: resolvedMovement ?? undefined,
      caliber: resolvedCaliber,
      caseMaterial: resolvedCaseMaterial ?? undefined,
      goldKarat: resolvedGoldKarat,
      goldColor: resolvedGoldColor ?? undefined,
      length: resolvedLength,
      width: resolvedWidth,
      thickness: resolvedThickness,
      strap: resolvedStrap ?? undefined,
      glass: resolvedGlass ?? undefined,
      dialColor: resolvedDialColor,
      boxIncluded: resolvedBoxIncluded ?? false,
      bookletIncluded: resolvedBookletIncluded ?? false,
      cardIncluded: resolvedCardIncluded ?? false,
    },
    create: {
      product: { connect: { id: productId } },
      ref: resolvedRef,
      model: resolvedModel,
      year: resolvedYear,
      caseType: resolvedCaseType ?? undefined,
      gender: resolvedGender ?? undefined,
      movement: resolvedMovement ?? undefined,
      caliber: resolvedCaliber,
      caseMaterial: resolvedCaseMaterial ?? undefined,
      goldKarat: resolvedGoldKarat,
      goldColor: resolvedGoldColor ?? undefined,
      length: resolvedLength,
      width: resolvedWidth,
      thickness: resolvedThickness,
      strap: resolvedStrap ?? undefined,
      glass: resolvedGlass ?? undefined,
      dialColor: resolvedDialColor,
      boxIncluded: resolvedBoxIncluded ?? false,
      bookletIncluded: resolvedBookletIncluded ?? false,
      cardIncluded: resolvedCardIncluded ?? false,
    },
  });
}

export async function processQueuedAcquisitionSpecJobs(input?: {
  limit?: number;
  acquisitionItemIds?: string[];
  includeFailed?: boolean;
}) {
  const normalizedIds = Array.from(
    new Set((input?.acquisitionItemIds ?? []).map((x) => String(x).trim()).filter(Boolean))
  );

  const statuses = input?.includeFailed ? ["PENDING", "FAILED"] : ["PENDING"];

  const jobs = await (prisma as any).acquisitionSpecJob.findMany({
    where: {
      status: { in: statuses },
      runAfter: { lte: new Date() },
      ...(normalizedIds.length
        ? {
          acquisitionItemId: {
            in: normalizedIds,
          },
        }
        : {}),
    },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    take: Math.max(1, Math.min(input?.limit ?? 6, 10)),
  });

  let processed = 0;

  console.log("[ACQ_SPEC_JOB][RUNNER_START]", {
    limit: input?.limit ?? null,
    acquisitionItemIds: normalizedIds,
    includeFailed: Boolean(input?.includeFailed),
  });
  console.log("[ACQ_SPEC_JOB][FOUND_JOBS]", jobs.length);

  for (const job of jobs) {
    console.log("[ACQ_SPEC_JOB][JOB]", {
      jobId: job.id,
      acquisitionItemId: job.acquisitionItemId,
      status: job.status,
    });

    const claim = await (prisma as any).acquisitionSpecJob.updateMany({
      where: {
        id: job.id,
        status: { in: statuses },
      },
      data: {
        status: "RUNNING",
        startedAt: new Date(),
        attempts: Number(job.attempts ?? 0) + 1,
        lastError: null,
      },
    });

    console.log("[ACQ_SPEC_JOB][CLAIM_RESULT]", {
      jobId: job.id,
      count: claim?.count ?? 0,
    });

    if (!claim?.count) continue;

    try {
      const item = await prisma.acquisitionItem.findUnique({
        where: { id: job.acquisitionItemId },
        include: { product: true },
      });

      if (!item?.productId || !item.product) {
        throw new Error("Thiếu acquisition item hoặc product để gen spec.");
      }

      const aiMeta = getAiMetaFromDescription(item.description);
      const preparedAi = await preparePostedWatchAiDataOutsideTx(item as ExistingAcqItem, aiMeta);
      const aiExtracted = preparedAi.aiExtracted;

      if (!aiExtracted) {
        throw new Error("AI không trả về extractedSpec.");
      }

      const built = buildProductTitleFromAi({
        aiExtracted,
        aiMeta: preparedAi.aiMeta,
        item: item as ExistingAcqItem,
      });

      await prisma.$transaction(async (tx) => {
        await persistPostedWatchAiData(tx, item as ExistingAcqItem, preparedAi);

        const brandConnect = await resolveBrandConnectFromAi(tx, built.resolvedBrandName);

        await tx.product.update({
          where: { id: item.productId! },
          data: {
            title: built.title,
            nickname: built.nickname,
            specStatus: resolveSpecStatusFromAi(aiExtracted),
            ...(brandConnect ? { brand: brandConnect } : {}),
          },
        });

        await createWatchSpecSafe(tx, {
          productId: item.productId!,
          aiExtracted,
        });

        await (tx as any).acquisitionSpecJob.update({
          where: { id: job.id },
          data: {
            status: "DONE",
            finishedAt: new Date(),
            lastError: null,
          },
        });
      });

      processed += 1;

      console.log("[ACQ_SPEC_JOB][DONE]", {
        jobId: job.id,
        acquisitionItemId: job.acquisitionItemId,
        productId: item.productId,
      });
    } catch (error) {
      console.error("[ACQ_SPEC_JOB][FAILED]", {
        jobId: job.id,
        acquisitionItemId: job.acquisitionItemId,
        error: error instanceof Error ? error.message : String(error),
      });

      await (prisma as any).acquisitionSpecJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          finishedAt: new Date(),
          lastError: error instanceof Error ? error.message : String(error),
          runAfter: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      if (job.productId) {
        await prisma.product.updateMany({
          where: { id: job.productId },
          data: { specStatus: "FAILED" },
        });
      }
    }
  }

  return { processed };
}