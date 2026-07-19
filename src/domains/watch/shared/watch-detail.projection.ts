export type WatchTechnicalIssueProjection = {
  id: string;
  summary: string;
  status: string;
  isConfirmed: boolean;
  updatedAt: string;
};

export type WatchServiceRequestProjection = {
  id: string;
  refNo: string;
  status: string;
  note: string | null;
  vendorName: string | null;
  issueCount: number;
  activeIssueCount: number;
  workspaceTaskItemId: string | null;
  workspaceHref: string | null;
  updatedAt: string;
  issues: WatchTechnicalIssueProjection[];
};

export type WatchServiceProjection = {
  requestCount: number;
  activeRequestCount: number;
  issueCount: number;
  activeIssueCount: number;
  requests: WatchServiceRequestProjection[];
};

export type WatchDetailProjection = {
  detail: Record<string, unknown>;
  service: WatchServiceProjection;
  tradeHistory: unknown;
};
