export type DashboardTone = "slate" | "blue" | "amber" | "emerald" | "rose" | "violet";

export type OperationsDashboardStage = {
  key: string;
  label: string;
  count: number;
  href: string;
  actionLabel: string;
  metrics?: Array<{ label: string; value: string; detail: string }>;
};

export type OperationsDashboardQueue = {
  key: "orders" | "purchase-requests" | "media" | "technical" | "payments" | "personal-work";
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

export type OperationsDashboardData = {
  generatedAt: string;
  totalActive: number;
  completionTrend: Array<{ date: string; label: string; count: number }>;
  attention: OperationsDashboardAttentionItem[];
  priorityAction: OperationsDashboardAttentionItem | null;
  queues: OperationsDashboardQueue[];
};
