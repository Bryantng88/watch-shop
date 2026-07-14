import type { WatchListFilters, WatchListResult, WatchRow } from "@/domains/watch/ui/list/types";

export type WatchListMediaStatus =
  | "PHOTOSHOOT"
  | "MEDIA_PROCESSING"
  | "READY_TO_PUBLISH"
  | "POSTED"
  | "NEEDS_REWORK"
  | "NO_IMAGE";

export type WatchListServiceStatus =
  | "NOT_REQUIRED"
  | "WAITING"
  | "IN_SERVICE"
  | "DONE"
  | "ISSUE";

export type WatchListSaleStatus =
  | "READY"
  | "HOLD"
  | "SOLD"
  | "CONSIGNED";

export type WatchListProjectionRow = {
  watchId: string;
  productId: string;
  sku: string | null;
  title: string | null;
  imageUrl: string | null;
  imageKey: string | null;
  brandName: string | null;
  vendorName: string | null;
  mediaStatus: WatchListMediaStatus;
  mediaStatusLabel: string;
  mediaWorkspaceHref: string | null;
  serviceStatus: WatchListServiceStatus;
  serviceStatusLabel: string;
  serviceRequestId: string | null;
  serviceWorkspaceHref: string | null;
  saleStatus: WatchListSaleStatus;
  saleStatusLabel: string;
  salePrice: number | null;
  updatedAt: string | null;
};

export type WatchListProjectionMediaState = {
  watchId: string;
  workTypeKey: "photoshoot" | "media-processing" | "publish";
  workflowKey: string | null;
  workflowState: string | null;
  taskStatus: string | null;
  taskItemId: string | null;
  workspaceHref: string | null;
  updatedAt: string | null;
};

export type WatchListProjectionServiceState = {
  watchId: string;
  serviceRequestId: string;
  status: WatchListServiceStatus;
  statusLabel: string;
  serviceRequestStatus: string | null;
  technicalIssueStatus: string | null;
  taskItemId: string | null;
  workspaceHref: string | null;
  updatedAt: string | null;
};

export type WatchListProjectionData = {
  row: WatchRow;
  v2Row?: WatchListProjectionRow;
  filters: {
    watchId: string;
    productId: string;
    sku: string | null;
    title: string | null;
    brandId: string | null;
    brandName: string | null;
    vendorId: string | null;
    vendorName: string | null;
    saleStage: string | null;
    serviceStage: string | null;
    stockStage: string | null;
    hasContent: boolean;
    hasImages: boolean;
    isPosted: boolean;
    reviewStatus: string | null;
    contentStatus: string | null;
    specStatus: string | null;
    mediaStatus?: WatchListMediaStatus | null;
    serviceStatus?: WatchListServiceStatus | null;
    saleStatus?: WatchListSaleStatus | null;
    salePrice: number | null;
    listPrice: number | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
};

export type WatchListProjectionSourceRow = {
  id: string;
  productId: string;
  saleStage: unknown;
  serviceStage: unknown;
  stockStage: unknown;
  conditionGrade: unknown;
  specStatus: unknown;
  isContentDownloaded: boolean;
  isImageDownloaded: boolean;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    title: string | null;
    sku: string | null;
    slug: string | null;
    brandId: string | null;
    vendorId: string | null;
    brand: { id: string; name: string | null } | null;
    vendor: { id: string; name: string | null } | null;
    postTargets: Array<{
      createdAt: Date;
      postTargetId: string;
      postTarget: {
        id: string;
        name: string;
        platform: string | null;
      };
    }>;
    productImage: Array<{
      id: string;
      role: unknown;
      fileKey: string;
      sortOrder: number;
      createdAt: Date;
    }>;
  };
  watchSpecV2: {
    id: string;
    brand: string | null;
    model: string | null;
    referenceNumber: string | null;
  } | null;
  watchPrice: {
    salePrice: unknown;
    listPrice: unknown;
    costPrice: unknown;
    minPrice: unknown;
  } | null;
  watchContent: {
    id: string;
    titleOverride: string | null;
    hookText: string | null;
    body: string | null;
    summary: string | null;
    bulletSpecs: string[];
  } | null;
  reviewStates: Array<{
    id: string;
    targetType: unknown;
    status: unknown;
    reviewedAt: Date | null;
    reviewedById: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
  }>;
  __imagesCount?: number;
  __mediaState?: WatchListProjectionMediaState[];
  __serviceState?: WatchListProjectionServiceState | null;
};

export type WatchListProjectionListResult = WatchListResult & {
  projection?: {
    source: "projection" | "source";
    fallbackReason?: string;
  };
};

export type WatchListProjectionCompareResult = {
  ok: boolean;
  sourceCount: number;
  projectionCount: number;
  missingInProjection: string[];
  extraInProjection: string[];
  changedRows: Array<{
    id: string;
    fields: string[];
  }>;
};

export type WatchListProjectionQueryInput = WatchListFilters;
