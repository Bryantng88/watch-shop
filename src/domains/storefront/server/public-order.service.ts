import { createHash, randomUUID } from "node:crypto";

import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import { emitPurchaseRequestBusinessEvent } from "@/domains/purchase-request/server/events";
import { prisma } from "@/server/db/client";
import {
  publicOrderIdempotencyKeySchema,
  publicOrderRequestSchema,
  type PublicOrderAccepted,
  type SubmitPublicOrderCommand,
} from "../contracts";
import { findOrderablePublicWatchIds } from "./public-catalog.repo";
import { analyticsAttribution } from "@/domains/analytics/storefront/storefront-analytics.server";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX = 5;
const MAX_REQUEST_ITEMS = 20;

export class PublicOrderProductsUnavailableError extends Error {
  constructor(readonly productIds: string[]) {
    super("PUBLIC_ORDER_PRODUCT_UNAVAILABLE");
    this.name = "PublicOrderProductsUnavailableError";
  }
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length >= 10) return `0${digits.slice(2)}`;
  return digits;
}

function requireNormalizedPhone(value: string) {
  const normalized = normalizePhone(value);
  if (normalized.length < 8 || normalized.length > 15) throw new Error("PUBLIC_ORDER_PHONE_INVALID");
  return normalized;
}

function canonicalRequest(request: ReturnType<typeof publicOrderRequestSchema.parse>) {
  const { analytics: _analytics, ...businessRequest } = request;
  void _analytics;
  return JSON.stringify({
    ...businessRequest,
    items: [...request.items].sort((a, b) => a.productId.localeCompare(b.productId)),
  });
}

export async function submitPublicOrder(
  raw: SubmitPublicOrderCommand,
  context: {
    fingerprint: string;
    analyticsInternal?: boolean;
    runtime?: BusinessEventDispatchOptions;
    now?: Date;
  },
): Promise<PublicOrderAccepted & { replayed: boolean }> {
  const request = publicOrderRequestSchema.parse(raw.request);
  const idempotencyKey = publicOrderIdempotencyKeySchema.parse(raw.idempotencyKey);
  if (request.website) throw new Error("PUBLIC_ORDER_BOT_REJECTED");

  const requestHash = digest(canonicalRequest(request));
  const namespacedKey = `${raw.channel}:${raw.externalRequestId?.trim() || idempotencyKey}`;
  const existingReceipt = await prisma.purchaseRequestIngressReceipt.findUnique({
    where: { requestKey: namespacedKey },
    select: {
      requestHash: true,
      disposition: true,
      addedItemCount: true,
      purchaseRequest: { select: { id: true, reference: true } },
    },
  });
  if (existingReceipt) {
    if (existingReceipt.requestHash !== requestHash) throw new Error("PUBLIC_ORDER_IDEMPOTENCY_CONFLICT");
    return {
      requestId: existingReceipt.purchaseRequest.id,
      reference: existingReceipt.purchaseRequest.reference,
      status: "RECEIVED",
      disposition: existingReceipt.disposition,
      addedItemCount: existingReceipt.addedItemCount,
      replayed: true,
    };
  }

  const productIds = Array.from(new Set(request.items.map((item) => item.productId)));
  const eligibleIds = new Set(await findOrderablePublicWatchIds(prisma, productIds));
  const unavailable = productIds.filter((id) => !eligibleIds.has(id));
  if (unavailable.length) throw new PublicOrderProductsUnavailableError(unavailable);

  const now = context.now ?? new Date();
  const normalizedPhone = requireNormalizedPhone(request.phone);
  const fingerprintHash = digest(`${process.env.PUBLIC_ORDER_FINGERPRINT_SECRET ?? "watch-shop"}:${context.fingerprint}`);
  const id = randomUUID();
  const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");
  const reference = `PR-${datePart}-${id.slice(0, 8).toUpperCase()}`;
  const attribution = analyticsAttribution(request.analytics);

  const result = await runBusinessEventTransaction(async (tx, delivery) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`purchase-request:${namespacedKey}`}, 0))`;
    const replay = await tx.purchaseRequestIngressReceipt.findUnique({
      where: { requestKey: namespacedKey },
      select: {
        requestHash: true,
        disposition: true,
        addedItemCount: true,
        purchaseRequest: { select: { id: true, reference: true } },
      },
    });
    if (replay) {
      if (replay.requestHash !== requestHash) throw new Error("PUBLIC_ORDER_IDEMPOTENCY_CONFLICT");
      return {
        id: replay.purchaseRequest.id,
        reference: replay.purchaseRequest.reference,
        disposition: replay.disposition,
        addedItemCount: replay.addedItemCount,
        replayed: true,
      };
    }

    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`purchase-request-phone:${normalizedPhone}`}, 0))`;

    const mergeTarget = await tx.purchaseRequest.findFirst({
      where: { normalizedPhone, status: "WAITING", orderId: null },
      orderBy: { updatedAt: "desc" },
      include: { items: { select: { productId: true } } },
    });

    if (mergeTarget) {
      const existingProductIds = new Set(mergeTarget.items.map((item) => item.productId));
      const addedProductIds = productIds.filter((productId) => !existingProductIds.has(productId));
      if (mergeTarget.items.length + addedProductIds.length > MAX_REQUEST_ITEMS) {
        throw new Error("PUBLIC_ORDER_TOO_MANY_ITEMS");
      }

      let addedTitles: string[] = [];
      if (addedProductIds.length) {
        const products = await tx.product.findMany({
          where: { id: { in: addedProductIds } },
          select: { id: true, title: true, watch: { select: { watchPrice: { select: { salePrice: true } } } } },
        });
        const productById = new Map(products.map((product) => [product.id, product]));
        addedTitles = products.map((product) => product.title);
        await tx.purchaseRequestItem.createMany({
          data: addedProductIds.map((productId) => {
            const product = productById.get(productId);
            if (!product) throw new Error("PUBLIC_ORDER_PRODUCT_UNAVAILABLE");
            return {
              purchaseRequestId: mergeTarget.id,
              productId,
              titleSnapshot: product.title,
              listPriceSnapshot: product.watch?.watchPrice?.salePrice ?? 0,
              quantity: 1,
            };
          }),
        });
        await tx.purchaseRequestActivity.create({
          data: {
            purchaseRequestId: mergeTarget.id,
            type: "NOTE",
            note: `Khách bổ sung ${addedProductIds.length} Watch từ Storefront: ${addedTitles.join(", ")}.`,
          },
        });
      }

      await tx.purchaseRequest.update({
        where: { id: mergeTarget.id },
        data: {
          customerName: request.customerName,
          customerEmail: request.customerEmail,
          ...(mergeTarget.customerEmail?.toLowerCase() !== request.customerEmail.toLowerCase() ? {
            emailVerificationStatus: "NOT_SENT",
            emailVerificationTokenHash: null,
            emailVerificationExpiresAt: null,
            emailVerificationSentAt: null,
            emailVerifiedAt: null,
            emailDeliveryFailedAt: null,
            emailVerificationAttemptedAt: null,
            emailVerificationSendCount: 0,
            emailVerificationWindowStartedAt: null,
          } : {}),
          contactPreference: request.contactPreference,
          contactHandle: request.contactHandle ?? null,
          address: request.address ?? mergeTarget.address,
          city: request.city ?? mergeTarget.city,
          district: request.district ?? mergeTarget.district,
          ward: request.ward ?? mergeTarget.ward,
          customerNote: request.note ?? mergeTarget.customerNote,
          ...(attribution ? {
            analyticsAnonymousIdHash: mergeTarget.analyticsAnonymousIdHash ?? attribution.analyticsAnonymousIdHash,
            analyticsSessionIdHash: mergeTarget.analyticsSessionIdHash ?? attribution.analyticsSessionIdHash,
            analyticsSource: mergeTarget.analyticsSource ?? attribution.analyticsSource,
            analyticsMedium: mergeTarget.analyticsMedium ?? attribution.analyticsMedium,
            analyticsCampaign: mergeTarget.analyticsCampaign ?? attribution.analyticsCampaign,
            analyticsLandingPath: mergeTarget.analyticsLandingPath ?? attribution.analyticsLandingPath,
          } : {}),
          updatedAt: now,
        },
      });
      const receipt = await tx.purchaseRequestIngressReceipt.create({
        data: {
          requestKey: namespacedKey,
          requestHash,
          purchaseRequestId: mergeTarget.id,
          disposition: "MERGED",
          addedItemCount: addedProductIds.length,
        },
        select: { id: true },
      });
      if (attribution) {
        await tx.storefrontAnalyticsEvent.create({
          data: {
            eventId: `purchase-request:${receipt.id}:submitted`,
            eventName: "request_submitted",
            occurredAt: now,
            anonymousIdHash: attribution.analyticsAnonymousIdHash,
            sessionIdHash: attribution.analyticsSessionIdHash,
            purchaseRequestId: mergeTarget.id,
            path: "/request",
            source: attribution.analyticsSource,
            medium: attribution.analyticsMedium,
            campaign: attribution.analyticsCampaign,
            metadataJson: { disposition: "MERGED", addedItemCount: addedProductIds.length },
          },
        });
      }
      if (addedProductIds.length) {
        delivery.track(await emitPurchaseRequestBusinessEvent(tx, {
          eventKey: "purchase_request.items_added",
          eventInstanceId: receipt.id,
          purchaseRequestId: mergeTarget.id,
          reference: mergeTarget.reference,
          channel: raw.channel,
          productIds: addedProductIds,
          addedItemCount: addedProductIds.length,
          occurredAt: now,
        }));
      }
      return {
        id: mergeTarget.id,
        reference: mergeTarget.reference,
        requestHash,
        disposition: "MERGED" as const,
        addedItemCount: addedProductIds.length,
        replayed: false,
      };
    }

    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`public-rate:${fingerprintHash}`}, 0))`;
    const recentRequestCount = await tx.purchaseRequest.count({
      where: { fingerprintHash, createdAt: { gte: new Date(now.getTime() - RATE_LIMIT_WINDOW_MS) } },
    });
    if (recentRequestCount >= RATE_LIMIT_MAX) throw new Error("PUBLIC_ORDER_RATE_LIMITED");

    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, watch: { select: { watchPrice: { select: { salePrice: true } } } } },
    });
    const productById = new Map(products.map((product) => [product.id, product]));
    const created = await tx.purchaseRequest.create({
      data: {
        id,
        reference,
        channel: raw.channel,
        externalRequestId: raw.externalRequestId?.trim() || null,
        requestKey: namespacedKey,
        requestHash,
        fingerprintHash,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        phone: request.phone,
        normalizedPhone,
        contactPreference: request.contactPreference,
        contactHandle: request.contactHandle ?? null,
        address: request.address ?? null,
        city: request.city ?? null,
        district: request.district ?? null,
        ward: request.ward ?? null,
        customerNote: request.note ?? null,
        ...attribution,
        analyticsIsInternal: context.analyticsInternal === true,
        items: {
          create: request.items.map((item) => {
            const product = productById.get(item.productId);
            if (!product) throw new Error("PUBLIC_ORDER_PRODUCT_UNAVAILABLE");
            return {
              productId: item.productId,
              titleSnapshot: product.title,
              listPriceSnapshot: product.watch?.watchPrice?.salePrice ?? 0,
              quantity: 1,
            };
          }),
        },
        activities: {
          create: {
            type: "NOTE",
            note: `Khách gửi yêu cầu mua ${productIds.length} Watch từ Storefront.`,
          },
        },
      },
      select: { id: true, reference: true, requestHash: true },
    });
    const receipt = await tx.purchaseRequestIngressReceipt.create({
      data: {
        requestKey: namespacedKey,
        requestHash,
        purchaseRequestId: created.id,
        disposition: "CREATED",
        addedItemCount: productIds.length,
      },
      select: { id: true },
    });
    if (attribution) {
      await tx.storefrontAnalyticsEvent.create({
        data: {
          eventId: `purchase-request:${receipt.id}:submitted`,
          eventName: "request_submitted",
          occurredAt: now,
          anonymousIdHash: attribution.analyticsAnonymousIdHash,
          sessionIdHash: attribution.analyticsSessionIdHash,
          purchaseRequestId: created.id,
          path: attribution.analyticsLandingPath ?? "/request",
          source: attribution.analyticsSource,
          medium: attribution.analyticsMedium,
          campaign: attribution.analyticsCampaign,
          metadataJson: { disposition: "CREATED", addedItemCount: productIds.length },
          isInternal: context.analyticsInternal === true,
        },
      });
    }
    delivery.track(await emitPurchaseRequestBusinessEvent(tx, {
      eventKey: "purchase_request.created",
      eventInstanceId: receipt.id,
      purchaseRequestId: created.id,
      reference: created.reference,
      channel: raw.channel,
      productIds,
      addedItemCount: productIds.length,
      occurredAt: now,
    }));
    return { ...created, disposition: "CREATED" as const, addedItemCount: productIds.length, replayed: false };
  }, context.runtime);

  return { requestId: result.id, reference: result.reference, status: "RECEIVED", disposition: result.disposition, addedItemCount: result.addedItemCount, replayed: result.replayed };
}
