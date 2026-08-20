import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

import { prisma } from "@/server/db/client";
import { storefrontAnalyticsBatchSchema, type StorefrontAnalyticsContext } from "./storefront-analytics.contract";
import { normalizeAnalyticsSource, STOREFRONT_INTERNAL_COOKIE } from "./storefront-analytics.shared";

const analyticsSalt = () => {
  const configured = process.env.STOREFRONT_ANALYTICS_SALT ?? process.env.PUBLIC_ORDER_FINGERPRINT_SECRET;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") throw new Error("STOREFRONT_ANALYTICS_SALT_REQUIRED");
  return "watch-shop-local";
};
const hashId = (value: string) => createHash("sha256").update(`${analyticsSalt()}:${value}`).digest("hex");
const clean = (value: unknown) => String(value ?? "").trim() || null;

function referrerHost(value?: string) {
  if (!value) return null;
  try { return new URL(value).hostname.slice(0, 255) || null; } catch { return null; }
}

function visitorType(userAgent: string | null) {
  const value = String(userAgent ?? "").toLowerCase();
  if (/bot|crawler|spider|headless/.test(value)) return "bot";
  return "human";
}

export function analyticsAttribution(context?: StorefrontAnalyticsContext | null) {
  if (!context) return null;
  return {
    analyticsAnonymousIdHash: hashId(context.anonymousId),
    analyticsSessionIdHash: hashId(context.sessionId),
    analyticsSource: normalizeAnalyticsSource(context.source),
    analyticsMedium: clean(context.medium),
    analyticsCampaign: clean(context.campaign),
    analyticsLandingPath: clean(context.landingPath),
  };
}

export async function ingestStorefrontAnalytics(raw: unknown, request: NextRequest) {
  const batch = storefrontAnalyticsBatchSchema.parse(raw);
  const now = new Date();
  const productIds = [...new Set(batch.events.map((event) => event.productId).filter((id): id is string => Boolean(id)))];
  const validProducts = productIds.length
    ? await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true } })
    : [];
  const validProductIds = new Set(validProducts.map((item) => item.id));
  const device = visitorType(request.headers.get("user-agent"));
  const address = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-real-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
  const requestFingerprintHash = hashId(`${address}|${request.headers.get("user-agent") ?? "unknown"}`);
  const isInternal = request.cookies.get(STOREFRONT_INTERNAL_COOKIE)?.value === "1";
  const events = batch.events
    .filter((event) => !event.productId || validProductIds.has(event.productId))
    .map((event) => {
      const occurredAt = new Date(event.occurredAt);
      const safeOccurredAt = Math.abs(now.getTime() - occurredAt.getTime()) <= 24 * 60 * 60 * 1_000 ? occurredAt : now;
      return {
        eventId: event.eventId,
        eventName: event.eventName,
        occurredAt: safeOccurredAt,
        anonymousIdHash: hashId(event.context.anonymousId),
        sessionIdHash: hashId(event.context.sessionId),
        productId: event.productId ?? null,
        path: event.path,
        source: normalizeAnalyticsSource(event.context.source),
        medium: clean(event.context.medium),
        campaign: clean(event.context.campaign),
        referrerHost: referrerHost(event.referrer),
        deviceType: device,
        requestFingerprintHash,
        isInternal,
      };
    });
  if (events.length) {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`analytics-rate:${requestFingerprintHash}`}, 0))`;
      const recentCount = await tx.storefrontAnalyticsEvent.count({
        where: { requestFingerprintHash, createdAt: { gte: new Date(now.getTime() - 60_000) } },
      });
      if (recentCount + events.length > 120) throw new Error("STOREFRONT_ANALYTICS_RATE_LIMITED");
      await tx.storefrontAnalyticsEvent.createMany({ data: events, skipDuplicates: true });
    });
  }
  return { accepted: events.length };
}
