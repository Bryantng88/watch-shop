export type DashboardTone = "slate" | "blue" | "amber" | "emerald" | "rose" | "violet";

export type OperationsDashboardStage = {
  key: string;
  label: string;
  count: number;
  href: string;
  actionLabel: string;
};

export type OperationsDashboardQueue = {
  key: "orders" | "purchase-requests" | "media" | "technical";
  label: string;
  description: string;
  href: string;
  activeCount: number;
  actionLabel: string;
  insights: Array<{
    key: string;
    label: string;
    count: number;
    href: string;
    severity: "neutral" | "attention" | "risk";
  }>;
  stages: OperationsDashboardStage[];
};

export type OperationsDashboardMetric = {
  key: "receivable" | "payable" | "overdue" | "unassigned" | "completed";
  label: string;
  value: number;
  valueType: "count" | "currency";
  helper: string;
  href: string;
  tone: DashboardTone;
};

export type OperationsDashboardAttentionItem = {
  id: string;
  domain: "ORDER" | "PURCHASE_REQUEST" | "MEDIA" | "TECHNICAL";
  title: string;
  reference: string | null;
  reason: string;
  ageLabel: string;
  ownerLabel: string;
  actionLabel: string;
  href: string;
  tone: DashboardTone;
};

export type OperationsDashboardBottleneck = {
  label: string;
  count: number;
  queueLabel: string;
  href: string;
  share: number;
};

export type OperationsDashboardData = {
  generatedAt: string;
  totalActive: number;
  metrics: OperationsDashboardMetric[];
  bottleneck: OperationsDashboardBottleneck | null;
  attention: OperationsDashboardAttentionItem[];
  priorityAction: OperationsDashboardAttentionItem | null;
  queues: OperationsDashboardQueue[];
};
