import { prisma } from "@/server/db/client";
import { queryFinanceReportProjection } from "@/domains/report/finance/finance-report.projection";
import type { SalesReportData } from "./sales-report.types";

const ratio = (value: number, total: number) => total > 0 ? Math.round((value / total) * 10_000) / 100 : 0;

export async function getSalesReport(days = 30): Promise<SalesReportData> {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1_000);
  const [events, requests, inventory, financeProjection] = await Promise.all([
    prisma.storefrontAnalyticsEvent.findMany({
      where: { occurredAt: { gte: from, lte: to }, deviceType: { not: "bot" } },
      select: { eventName: true, anonymousIdHash: true, sessionIdHash: true, productId: true, source: true },
    }),
    prisma.purchaseRequest.findMany({
      where: { channel: "STOREFRONT", createdAt: { gte: from, lte: to } },
      select: { orderId: true, analyticsSessionIdHash: true, analyticsSource: true, items: { select: { productId: true } } },
    }),
    prisma.product.findMany({
      where: { type: "WATCH" },
      select: { id: true, title: true, slug: true, status: true, publishedAt: true, watch: { select: { watchPrice: { select: { landedCost: true } } } } },
    }),
    queryFinanceReportProjection(prisma),
  ]);

  const sessions = new Set(events.map((event) => event.sessionIdHash));
  const visitors = new Set(events.map((event) => event.anonymousIdHash));
  const viewEvents = events.filter((event) => event.eventName === "product_viewed");
  const requestStarts = events.filter((event) => event.eventName === "request_started").length;
  const attributedRequests = requests.filter((request) => request.analyticsSessionIdHash).length;
  const convertedOrders = requests.filter((request) => request.orderId).length;

  const sourceRows = new Map<string, { sessions: Set<string>; requests: number }>();
  for (const event of events) {
    const source = event.source || "direct";
    const row = sourceRows.get(source) ?? { sessions: new Set<string>(), requests: 0 };
    row.sessions.add(event.sessionIdHash);
    sourceRows.set(source, row);
  }
  for (const request of requests) {
    const source = request.analyticsSource || "unknown";
    const row = sourceRows.get(source) ?? { sessions: new Set<string>(), requests: 0 };
    row.requests += 1;
    sourceRows.set(source, row);
  }

  const viewsByProduct = new Map<string, number>();
  for (const event of viewEvents) if (event.productId) viewsByProduct.set(event.productId, (viewsByProduct.get(event.productId) ?? 0) + 1);
  const requestsByProduct = new Map<string, number>();
  for (const request of requests) for (const item of request.items) requestsByProduct.set(item.productId, (requestsByProduct.get(item.productId) ?? 0) + 1);
  const inventoryById = new Map(inventory.map((product) => [product.id, product]));
  const rankedProductIds = [...new Set([...viewsByProduct.keys(), ...requestsByProduct.keys()])]
    .sort((a, b) => (viewsByProduct.get(b) ?? 0) - (viewsByProduct.get(a) ?? 0))
    .slice(0, 10);

  const financeAll = financeProjection?.channels.find((channel) => channel.channel === "ALL");
  const financePeriod = financeAll?.periods.find((period) => period.key === "MONTH") ?? financeAll?.periods[0];

  return {
    generatedAt: to.toISOString(),
    period: { from: from.toISOString(), to: to.toISOString(), days },
    traffic: { sessions: sessions.size, visitors: visitors.size, productViews: viewEvents.length, requestStarts },
    funnel: { purchaseRequests: requests.length, attributedRequests, convertedOrders, sessionToRequestRate: ratio(requests.length, sessions.size), requestToOrderRate: ratio(convertedOrders, requests.length) },
    inventory: {
      total: inventory.length,
      live: inventory.filter((product) => product.publishedAt).length,
      available: inventory.filter((product) => product.status === "AVAILABLE").length,
      held: inventory.filter((product) => product.status === "HOLD").length,
      sold: inventory.filter((product) => product.status === "SOLD").length,
      landedValue: inventory.reduce((sum, product) => sum + Number(product.watch?.watchPrice?.landedCost ?? 0), 0),
    },
    finance: financePeriod ? { revenue: financePeriod.revenue, collected: financePeriod.collected, grossProfit: financePeriod.profit } : null,
    sources: [...sourceRows.entries()].map(([source, row]) => ({ source, sessions: row.sessions.size, requests: row.requests })).sort((a, b) => b.sessions - a.sessions).slice(0, 8),
    products: rankedProductIds.flatMap((productId) => {
      const product = inventoryById.get(productId);
      return product ? [{ productId, title: product.title, slug: product.slug, views: viewsByProduct.get(productId) ?? 0, requests: requestsByProduct.get(productId) ?? 0, status: product.status }] : [];
    }),
  };
}
