export type FinanceChannel = "MEN" | "WOMEN";

export type FinanceContributionInput = {
  id: string;
  channel: FinanceChannel | null;
  kind: "PRODUCT" | "SERVICE" | "DISCOUNT";
  revenue: number;
  cost: number;
};

export type FinanceContribution = FinanceContributionInput & {
  allocatedRevenue: number;
  allocatedCost: number;
};

export type FinanceChannelWeight = {
  channel: FinanceChannel;
  weight: number;
};

export type FinanceReportPeriod = {
  key: "MONTH" | "QUARTER";
  label: string;
  startAt: string;
  endAt: string;
  revenue: number;
  otherIncome: number;
  collected: number;
  cost: number;
  profit: number;
  openingBalance: number;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  closingBalance: number;
  transactionCount: number;
  revenueBreakdown: Array<{
    key: string;
    label: string;
    count: number;
    amount: number;
  }>;
  costBreakdown: Array<{
    key: string;
    label: string;
    amount: number;
  }>;
  details: Record<"revenue" | "collected" | "cost" | "profit", Array<{
    id: string;
    code: string;
    source: string;
    label: string;
    amount: number;
    margin: number | null;
    href: string;
  }>>;
};

export type FinancePaymentBreakdown = {
  key: string;
  label: string;
  owner: string;
  count: number;
  amount: number;
  overdue: number;
};

export type FinanceChannelReport = {
  channel: FinanceChannel | "ALL";
  periods: FinanceReportPeriod[];
  trend: Array<{
    label: string;
    revenue: number;
    profit: number;
    margin: number;
  }>;
  pendingPayments: {
    in: FinancePaymentBreakdown[];
    out: FinancePaymentBreakdown[];
  };
};

export type FinanceReportProjectionData = {
  formulaVersion: 2;
  generatedAt: string;
  channels: FinanceChannelReport[];
  quality: {
    unallocatedOrderItemCount: number;
    unallocatedPaymentCount: number;
    recognitionDateFallbackCount: number;
    settlementDateFallbackCount: number;
  };
};
