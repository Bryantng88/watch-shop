export type DashboardTone = "slate" | "blue" | "amber" | "emerald" | "rose" | "violet";

export type DashboardMetric = {
  key: string;
  label: string;
  value: number;
  helper?: string;
  href?: string;
  tone?: DashboardTone;
  format?: "number" | "money";
};

export type DashboardPipelineItem = {
  key: string;
  label: string;
  value: number;
  href?: string;
  tone?: DashboardTone;
};

export type DashboardActionItem = {
  key: string;
  label: string;
  value: number;
  helper?: string;
  href?: string;
  tone?: DashboardTone;
  format?: "number" | "money";
};

export type DashboardRecentItem = {
  id: string;
  type: "ORDER" | "SHIPMENT" | "WATCH" | "ACQUISITION";
  title: string;
  subtitle?: string;
  href?: string;
  updatedAt?: string | Date | null;
};

export type AdminDashboardData = {
  generatedAt: string;
  metrics: DashboardMetric[];
  watch: {
    total: number;
    pipeline: DashboardPipelineItem[];
    readiness: DashboardPipelineItem[];
  };
  order: {
    total: number;
    pipeline: DashboardPipelineItem[];
    actions: DashboardActionItem[];
  };
  shipment: {
    total: number;
    pipeline: DashboardPipelineItem[];
    actions: DashboardActionItem[];
  };
  acquisition: {
    total: number;
    pipeline: DashboardPipelineItem[];
  };
  finance: {
    orderValue: number;
    paidAmount: number;
    remainingAmount: number;
    collectedCodAmount: number;
    pendingPaymentAmount: number;
  };
  recent: DashboardRecentItem[];
};
