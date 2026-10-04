export type WatchDecisionReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type WatchDecisionStatus =
  | "BLOCKED"
  | "NEEDS_SERVICE_DECISION"
  | "NEEDS_PRICING"
  | "NEEDS_MEDIA"
  | "NEEDS_CONTENT"
  | "WAITING_REVIEW"
  | "READY_TO_PUBLISH"
  | "PUBLISHED";

export type WatchDecisionAction = {
  key: string;
  label: string;
  href?: string | null;
  tone?: "primary" | "warning" | "neutral";
};

export type WatchDecisionSnapshot = {
  watchId: string;
  productId: string;
  progress: number;
  service: {
    stage: string;
    requestId: string | null;
    requestRef: string | null;
    requestStatus: string | null;
    openIssueCount: number;
    ready: boolean;
  };
  pricing: {
    costPrice: number | null;
    serviceCost: number | null;
    landedCost: number | null;
    listPrice: number | null;
    salePrice: number | null;
    minPrice: number | null;
    effectiveCost: number | null;
    marginAmount: number | null;
    marginPercent: number | null;
    maxDiscountAmount: number | null;
    canDiscount: boolean;
    ready: boolean;
  };
  media: {
    galleryCount: number;
    availableCount: number;
    missingCount: number;
    hasCover: boolean;
    reviewStatus: WatchDecisionReviewStatus;
    ready: boolean;
  };
  content: {
    hasContent: boolean;
    reviewStatus: WatchDecisionReviewStatus;
    ready: boolean;
  };
  storefront: {
    published: boolean;
    priceVisible: boolean;
    ready: boolean;
  };
  decision: {
    status: WatchDecisionStatus;
    label: string;
    summary: string;
    blockers: string[];
    warnings: string[];
    allowedActions: WatchDecisionAction[];
    recommendedAction: WatchDecisionAction | null;
  };
};
