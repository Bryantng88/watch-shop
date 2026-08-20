import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

import { prisma } from "@/server/db/client";
import { storefrontAnalyticsBatchSchema, type StorefrontAnalyticsContext } from "./storefront-analytics.contract";

const analyticsSalt = process.env.STOREFRONT_ANALYTICS_SALT ?? process.env.PUBLIC_ORDER_FINGERPRINT_SECRET ?? "watch-shop";
const hashId = (value: string) => createHash("sha256").update(`${analyticsSalt}:${value}`).digest("hex");
const clean = (value: unknown) => String(value ?? "").trim() || null;

function referrerHost(value?: string) {
  if (!value) return null;
  try { return new URL(value).hostname.slice(0, 255) || null; } catch { return null; }
}

function deviceType(userAgent: string | null) {
  const value = String(userAgent ?? "").toLowerCase();
  if (/bot|crawler|spider|headless/.test(value)) return "bot";
  if (/ipad|tablet/.test(value)) return "tablet";
  if (/mobile|iphone|android/.test(value)) return "mobile";
  return "desktop";
}

export function analyticsAttribution(context?: StorefrontAnalyticsContext | null) {
  if (!context) return null;
  return {
    analyticsAnonymousIdHash: hashId(context.anonymousId),
    analyticsSessionIdHash: hashId(context.sessionId),
    analyticsSource: clean(context.source),
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
  const device = deviceType(request.headers.get("user-agent"));
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
        source: clean(event.context.source),
        medium: clean(event.context.medium),
        campaign: clean(event.context.campaign),
        referrerHost: referrerHost(event.referrer),
        deviceType: device,
      };
    });
  if (events.length) await prisma.storefrontAnalyticsEvent.createMany({ data: events, skipDuplicates: true });
  return { accepted: events.length };
}
