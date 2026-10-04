import {
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaRole,
  ServiceRequestStatus,
  TechnicalIssueExecutionStatus,
} from "@prisma/client";

import { prisma, type DB } from "@/server/db/client";
import { buildWatchDecision } from "./watch-decision.rules";
import type { WatchDecisionReviewStatus, WatchDecisionSnapshot } from "./watch-decision.types";

const ACTIVE_SERVICE_STATUSES = [
  ServiceRequestStatus.DRAFT,
  ServiceRequestStatus.DIAGNOSING,
  ServiceRequestStatus.WAIT_APPROVAL,
  ServiceRequestStatus.IN_PROGRESS,
];

function numberOrNull(value: unknown) {
  if (value == null || value === "") return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function reviewStatus(states: Array<{ targetType: string; status: string }>, targetType: "CONTENT" | "IMAGE") {
  return String(states.find((item) => item.targetType === targetType)?.status ?? "DRAFT") as WatchDecisionReviewStatus;
}

export async function getWatchDecisionSnapshot(
  watchId: string,
  db: DB = prisma,
): Promise<WatchDecisionSnapshot | null> {
  const watch = await db.watch.findUnique({
    where: { id: watchId },
    select: {
      id: true,
      productId: true,
      serviceStage: true,
      watchPrice: true,
      watchContent: {
        select: { titleOverride: true, summary: true, hookText: true, body: true, bulletSpecs: true },
      },
      reviewStates: { select: { targetType: true, status: true } },
      product: {
        select: {
          publishedAt: true,
          priceVisibility: true,
          storefrontImageKey: true,
          productImage: {
            where: { role: "GALLERY" },
            select: { fileKey: true },
          },
          serviceRequest: {
            where: { status: { in: ACTIVE_SERVICE_STATUSES } },
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            take: 1,
            select: {
              id: true,
              refNo: true,
              status: true,
              technicalIssue: { select: { executionStatus: true } },
            },
          },
        },
      },
    },
  });
  if (!watch) return null;

  const bindings = await db.mediaBinding.findMany({
    where: {
      ownerType: MediaOwnerType.WATCH,
      ownerId: watch.id,
      role: MediaRole.GALLERY,
      lifecycle: { in: [MediaBindingLifecycle.ATTACHED, MediaBindingLifecycle.APPROVED, MediaBindingLifecycle.PUBLISHED] },
    },
    select: { mediaObject: { select: { storageKey: true, availability: true } } },
  });

  const galleryKeys = new Set(watch.product.productImage.map((item) => item.fileKey));
  for (const binding of bindings) galleryKeys.add(binding.mediaObject.storageKey);
  const missingCount = bindings.filter((item) => ["MISSING", "QUARANTINED", "DELETED"].includes(item.mediaObject.availability)).length;
  const availableCount = Math.max(0, galleryKeys.size - missingCount);

  const price = watch.watchPrice;
  const costPrice = numberOrNull(price?.costPrice);
  const serviceCost = numberOrNull(price?.serviceCost);
  const landedPrice = numberOrNull(price?.landedCost);
  const effectiveCost = landedPrice ?? (costPrice == null ? null : costPrice + (serviceCost ?? 0));
  const salePrice = numberOrNull(price?.salePrice);
  const minPrice = numberOrNull(price?.minPrice);
  const marginAmount = salePrice != null && effectiveCost != null ? salePrice - effectiveCost : null;
  const marginPercent = marginAmount != null && salePrice ? (marginAmount / salePrice) * 100 : null;
  const maxDiscountAmount = salePrice != null && minPrice != null ? Math.max(0, salePrice - minPrice) : null;

  const activeService = watch.product.serviceRequest[0] ?? null;
  const closedIssueStatuses = new Set<TechnicalIssueExecutionStatus>([
    TechnicalIssueExecutionStatus.DONE,
    TechnicalIssueExecutionStatus.CANCELED,
  ]);
  const openIssueCount = activeService?.technicalIssue.filter(
    (issue) => !closedIssueStatuses.has(issue.executionStatus),
  ).length ?? 0;
  const serviceReady = !activeService && ["NOT_ASSESSED", "NOT_REQUIRED", "DONE"].includes(String(watch.serviceStage));
  const imageReviewStatus = reviewStatus(watch.reviewStates, "IMAGE");
  const contentReviewStatus = reviewStatus(watch.reviewStates, "CONTENT");
  const content = watch.watchContent;
  const hasContent = Boolean(
    content && [content.titleOverride, content.summary, content.hookText, content.body, ...(content.bulletSpecs ?? [])]
      .some((value) => String(value ?? "").trim()),
  );

  const parts = {
    watchId: watch.id,
    productId: watch.productId,
    service: {
      stage: String(watch.serviceStage),
      requestId: activeService?.id ?? null,
      requestRef: activeService?.refNo ?? null,
      requestStatus: activeService ? String(activeService.status) : null,
      openIssueCount,
      ready: serviceReady,
    },
    pricing: {
      costPrice,
      serviceCost,
      landedCost: landedPrice,
      listPrice: numberOrNull(price?.listPrice),
      salePrice,
      minPrice,
      effectiveCost,
      marginAmount,
      marginPercent,
      maxDiscountAmount,
      canDiscount: maxDiscountAmount != null && maxDiscountAmount > 0,
      ready: salePrice != null && effectiveCost != null && minPrice != null && salePrice >= minPrice,
    },
    media: {
      galleryCount: galleryKeys.size,
      availableCount,
      missingCount,
      hasCover: Boolean(watch.product.storefrontImageKey),
      reviewStatus: imageReviewStatus,
      ready: galleryKeys.size > 0 && availableCount > 0 && missingCount === 0 && Boolean(watch.product.storefrontImageKey) && imageReviewStatus === "APPROVED",
    },
    content: {
      hasContent,
      reviewStatus: contentReviewStatus,
      ready: hasContent && contentReviewStatus === "APPROVED",
    },
    storefront: {
      published: Boolean(watch.product.publishedAt),
      priceVisible: String(watch.product.priceVisibility) === "SHOW",
      ready: false,
    },
  };

  const result = buildWatchDecision(parts);
  return {
    ...parts,
    storefront: { ...parts.storefront, ready: result.decision.status === "READY_TO_PUBLISH" || parts.storefront.published },
    ...result,
  };
}
