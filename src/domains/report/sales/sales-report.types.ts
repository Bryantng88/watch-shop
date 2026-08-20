export type SalesReportData = {
  generatedAt: string;
  period: { from: string; to: string; days: number };
  traffic: { sessions: number; visitors: number; productViews: number; requestPageViews: number; formStarts: number; cartAdds: number };
  internalTraffic: { sessions: number; visitors: number; events: number; purchaseRequests: number };
  funnel: { purchaseRequests: number; attributedRequests: number; convertedOrders: number; sessionToRequestRate: number; requestToOrderRate: number };
  inventory: { total: number; live: number; available: number; held: number; sold: number; landedValue: number | null };
  finance: { revenue: number | null; collected: number | null; grossProfit: number | null } | null;
  sources: Array<{ source: string; sessions: number; requests: number }>;
  products: Array<{ productId: string; title: string; slug: string | null; views: number; requests: number; status: string }>;
};
