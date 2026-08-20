import { prisma } from "@/server/db/client";
import { queryFinanceReportProjection } from "@/domains/report/finance/finance-report.projection";
import type { SalesReportData } from "./sales-report.types";
import { normalizeAnalyticsSource } from "@/domains/analytics/storefront/storefront-analytics.shared";

const ratio = (value: number, total: number) => total > 0 ? Math.round((value / total) * 10_000) / 100 : 0;

type SalesReportAccess = {
  canViewFinance: boolean;
  canViewProductCost: boolean;
  canViewPayments: boolean;
};

export async function getSalesReport(access: SalesReportAccess): Promise<SalesReportData> {
  const to = new Date();
  const from = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1));
  const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1_000)));
  const canReadInventoryCost = access.canViewFinance && access.canViewProductCost;
  const inventoryPromise = canReadInventoryCost
    ? prisma.product.findMany({
        where: { type: "WATCH" },
        select: { id: true, title: true, slug: true, status: true, publishedAt: true, watch: { select: { watchPrice: { select: { landedCost: true } } } } },
      }).then((products) => products.map((product) => ({
        id: product.id,
        title: product.title,
        slug: product.slug,
        status: product.status,
        publishedAt: product.publishedAt,
        landedCost: Number(product.watch?.watchPrice?.landedCost ?? 0),
      })))
    : prisma.product.findMany({
        where: { type: "WATCH" },
        select: { id: true, title: true, slug: true, status: true, publishedAt: true },
      }).then((products) => products.map((product) => ({ ...product, landedCost: null })));
  const [events, requests, inventory, financeProjection] = await Promise.all([
    prisma.storefrontAnalyticsEvent.findMany({
      where: { occurredAt: { gte: from, lte: to }, isInternal: false, deviceType: { not: "bot" } },
      select: { eventName: true, anonymousIdHash: true, sessionIdHash: true, productId: true, source: true },
    }),
    prisma.purchaseRequest.findMany({
      where: { channel: "STOREFRONT", analyticsIsInternal: false, OR: [{ createdAt: { gte: from, lte: to } }, { convertedAt: { gte: from, lte: to } }] },
      select: { orderId: true, createdAt: true, convertedAt: true, analyticsSessionIdHash: true, analyticsSource: true, items: { select: { productId: true } } },
    }),
    inventoryPromise,
    access.canViewFinance ? queryFinanceReportProjection(prisma) : Promise.resolve(null),
  ]);

  const sessions = new Set(events.map((event) => event.sessionIdHash));
  const visitors = new Set(events.map((event) => event.anonymousIdHash));
  const viewEvents = events.filter((event) => event.eventName === "product_viewed");
  const requestPageViews = events.filter((event) => event.eventName === "request_page_viewed" || event.eventName === "request_started").length;
  const formStarts = events.filter((event) => event.eventName === "request_form_started").length;
  const cartAdds = events.filter((event) => event.eventName === "cart_item_added").length;
  const createdRequests = requests.filter((request) => request.createdAt >= from && request.createdAt <= to);
  const attributedRequests = createdRequests.filter((request) => request.analyticsSessionIdHash).length;
  const convertedOrders = requests.filter((request) => request.orderId && request.convertedAt && request.convertedAt >= from && request.convertedAt <= to).length;
  const convertedCreatedRequests = createdRequests.filter((request) => request.orderId).length;
  const requestSessions = new Set(createdRequests.flatMap((request) => request.analyticsSessionIdHash ? [request.analyticsSessionIdHash] : []));

  const sourceRows = new Map<string, { sessions: Set<string>; requests: number }>();
  for (const event of events) {
    const source = normalizeAnalyticsSource(event.source);
    const row = sourceRows.get(source) ?? { sessions: new Set<string>(), requests: 0 };
    row.sessions.add(event.sessionIdHash);
    sourceRows.set(source, row);
  }
  for (const request of createdRequests) {
    const source = normalizeAnalyticsSource(request.analyticsSource || "unknown");
    const row = sourceRows.get(source) ?? { sessions: new Set<string>(), requests: 0 };
    row.requests += 1;
    sourceRows.set(source, row);
  }

  const viewsByProduct = new Map<string, number>();
  for (const event of viewEvents) if (event.productId) viewsByProduct.set(event.productId, (viewsByProduct.get(event.productId) ?? 0) + 1);
  const requestsByProduct = new Map<string, number>();
  for (const request of createdRequests) for (const item of request.items) requestsByProduct.set(item.productId, (requestsByProduct.get(item.productId) ?? 0) + 1);
  const inventoryById = new Map(inventory.map((product) => [product.id, product]));
  const rankedProductIds = [...new Set([...viewsByProduct.keys(), ...requestsByProduct.keys()])]
    .sort((a, b) => (viewsByProduct.get(b) ?? 0) - (viewsByProduct.get(a) ?? 0))
    .slice(0, 10);

  const financeAll = financeProjection?.channels.find((channel) => channel.channel === "ALL");
  const financePeriod = financeAll?.periods.find((period) => period.key === "MONTH") ?? financeAll?.periods[0];

  return {
    generatedAt: to.toISOString(),
    period: { from: from.toISOString(), to: to.toISOString(), days },
    traffic: { sessions: sessions.size, visitors: visitors.size, productViews: viewEvents.length, requestPageViews, formStarts, cartAdds },
    funnel: { purchaseRequests: createdRequests.length, attributedRequests, convertedOrders, sessionToRequestRate: ratio(requestSessions.size, sessions.size), requestToOrderRate: ratio(convertedCreatedRequests, createdRequests.length) },
    inventory: {
      total: inventory.length,
      live: inventory.filter((product) => product.publishedAt).length,
      available: inventory.filter((product) => product.status === "AVAILABLE").length,
      held: inventory.filter((product) => product.status === "HOLD").length,
      sold: inventory.filter((product) => product.status === "SOLD").length,
      landedValue: canReadInventoryCost
        ? inventory.reduce((sum, product) => sum + Number(product.landedCost ?? 0), 0)
        : null,
    },
    finance: financePeriod ? {
      revenue: access.canViewFinance ? financePeriod.revenue : null,
      collected: access.canViewFinance && access.canViewPayments ? financePeriod.collected : null,
      grossProfit: access.canViewFinance && access.canViewProductCost ? financePeriod.profit : null,
    } : null,
    sources: [...sourceRows.entries()].map(([source, row]) => ({ source, sessions: row.sessions.size, requests: row.requests })).sort((a, b) => b.sessions - a.sessions).slice(0, 8),
    products: rankedProductIds.flatMap((productId) => {
      const product = inventoryById.get(productId);
      return product ? [{ productId, title: product.title, slug: product.slug, views: viewsByProduct.get(productId) ?? 0, requests: requestsByProduct.get(productId) ?? 0, status: product.status }] : [];
    }),
  };
}
