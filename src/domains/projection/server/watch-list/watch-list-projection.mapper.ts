import { mapWatchRow } from "@/domains/watch/ui/list/helpers";
import type { WatchRow } from "@/domains/watch/ui/list/types";
import type {
  WatchListProjectionData,
  WatchListProjectionMediaState,
  WatchListProjectionRow,
  WatchListProjectionSourceRow,
  WatchListSaleStatus,
  WatchListServiceStatus,
} from "./watch-list-projection.types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function cleanNullable(value: unknown) {
  const text = clean(value);
  return text || null;
}

function isoDate(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function numberNullable(value: unknown) {
  if (value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function upper(value: unknown) {
  return clean(value).toUpperCase();
}

function workflowState(state: WatchListProjectionMediaState | null) {
  return upper(state?.workflowState) || upper(state?.taskStatus);
}

function isDone(state: string) {
  return ["DONE", "COMPLETED", "COMPLETE"].includes(state);
}

function isCancelled(state: string) {
  return ["CANCELED", "CANCELLED", "REMOVED", "ARCHIVED"].includes(state);
}

function hasGalleryImages(row: WatchRow) {
  return Boolean(
    row.hasImages ||
    Number(row.imagesCount ?? 0) > 0,
  );
}

function newestMediaState(
  states: WatchListProjectionMediaState[] | undefined,
  workTypeKey: WatchListProjectionMediaState["workTypeKey"],
) {
  return (states ?? [])
    .filter((item) => item.workTypeKey === workTypeKey)
    .sort((a, b) => clean(b.updatedAt).localeCompare(clean(a.updatedAt)))[0] ?? null;
}

function mapMediaStatus(row: WatchRow, source: WatchListProjectionSourceRow) {
  const states = source.__mediaState ?? [];
  const publish = newestMediaState(states, "publish");
  const media = newestMediaState(states, "media-processing");
  const photoshoot = newestMediaState(states, "photoshoot");
  const publishState = workflowState(publish);
  const mediaState = workflowState(media);
  const photoshootState = workflowState(photoshoot);

  if (row.isPosted || isDone(publishState)) {
    return { status: "POSTED" as const, label: "Đã hoàn tất" };
  }

  if (publish && ["CONTENT_FEEDBACK", "IMAGE_FEEDBACK", "RECALLED", "BLOCKED"].includes(publishState)) {
    return { status: "NEEDS_REWORK" as const, label: "Cần xử lý lại" };
  }

  if (publish && !isCancelled(publishState)) {
    const publishLabel: Record<string, string> = {
      WAITING_CONTENT: "Waiting Content",
      CONTENT_REVIEW: "Content Review",
      WAITING_IMAGE: "Waiting Image",
      IMAGE_REVIEW: "Image Review",
      READY_TO_POST: "Ready To Post",
    };
    return {
      status: "READY_TO_PUBLISH" as const,
      label: publishLabel[publishState] ?? "Ready To Post",
    };
  }

  if (media && !isCancelled(mediaState)) {
    if (["FEEDBACK", "RECALLED", "BLOCKED"].includes(mediaState)) {
      return { status: "NEEDS_REWORK" as const, label: "Cần xử lý lại" };
    }

    if (isDone(mediaState)) {
      return { status: "READY_TO_PUBLISH" as const, label: "Ready To Post" };
    }

    return { status: "MEDIA_PROCESSING" as const, label: "Đang xử lý media" };
  }

  if (photoshoot && !isCancelled(photoshootState)) {
    if (["FEEDBACK", "RECALLED", "BLOCKED"].includes(photoshootState)) {
      return { status: "NEEDS_REWORK" as const, label: "Cần chụp lại" };
    }

    if (isDone(photoshootState)) {
      return { status: "MEDIA_READY" as const, label: "Đã chụp xong" };
    }

    return { status: "PHOTOSHOOT" as const, label: "Đang chụp hình" };
  }

  // An inline/acquisition image is product identity data, not evidence that the
  // watch entered the media workflow. Only photoshoot events may advance the
  // media status.
  return { status: "NO_IMAGE" as const, label: "Chưa gửi photoshoot" };
}

function mapServiceStatus(row: WatchRow, source: WatchListProjectionSourceRow): {
  status: WatchListServiceStatus;
  label: string;
} {
  const serviceState = upper(source.serviceStage ?? row.serviceState);

  if (serviceState === "DONE") return { status: "DONE", label: "Đã xong" };
  if (serviceState === "IN_SERVICE") return { status: "IN_SERVICE", label: "Đang service" };
  if (serviceState === "PENDING") return { status: "WAITING", label: "Chờ service" };
  if (Number(row.serviceIssuesCount ?? 0) > 0) return { status: "ISSUE", label: "Cần kiểm tra" };

  return { status: "NOT_REQUIRED", label: "Không cần service" };
}

function mapServiceStatusForProjection(row: WatchRow, source: WatchListProjectionSourceRow): {
  status: WatchListServiceStatus;
  label: string;
} {
  if (source.__serviceState) {
    return {
      status: source.__serviceState.status,
      label: source.__serviceState.statusLabel,
    };
  }

  return mapServiceStatus(row, source);
}

function mediaWorkspaceHrefForStatus(
  source: WatchListProjectionSourceRow,
  status: string,
) {
  const states = source.__mediaState ?? [];
  const publish = newestMediaState(states, "publish");
  const media = newestMediaState(states, "media-processing");
  const photoshoot = newestMediaState(states, "photoshoot");

  switch (upper(status)) {
    case "POSTED":
    case "READY_TO_PUBLISH":
      return publish?.workspaceHref ?? media?.workspaceHref ?? null;
    case "NEEDS_REWORK":
      return media?.workspaceHref ?? photoshoot?.workspaceHref ?? null;
    case "MEDIA_PROCESSING":
      return media?.workspaceHref ?? null;
    case "MEDIA_READY":
      return photoshoot?.workspaceHref ?? null;
    case "PHOTOSHOOT":
      return photoshoot?.workspaceHref ?? null;
    default:
      return null;
  }
}

function mapSaleStatus(row: WatchRow): {
  status: WatchListSaleStatus;
  label: string;
} {
  const saleState = upper(row.saleState);

  if (saleState === "SOLD") return { status: "SOLD", label: "Đã bán" };
  if (saleState === "HOLD") return { status: "HOLD", label: "Giữ hàng" };
  if (saleState === "CONSIGNED_TO") return { status: "CONSIGNED", label: "Consigned" };

  return { status: "READY", label: "Sẵn sàng" };
}

function mapV2Row(
  row: WatchRow,
  source: WatchListProjectionSourceRow,
): WatchListProjectionRow {
  const media = mapMediaStatus(row, source);
  const service = mapServiceStatusForProjection(row, source);
  const sale = mapSaleStatus(row);

  return {
    watchId: source.id,
    productId: source.productId,
    sku: cleanNullable(source.product?.sku ?? row.sku),
    title: cleanNullable(source.product?.title ?? row.title),
    imageUrl: cleanNullable(row.imageUrl),
    imageKey: cleanNullable(row.imageKey),
    brandName: cleanNullable(source.product?.brand?.name ?? row.brandName),
    vendorName: cleanNullable(source.product?.vendor?.name ?? row.vendorName),
    mediaStatus: media.status,
    mediaStatusLabel: media.label,
    mediaWorkspaceHref: mediaWorkspaceHrefForStatus(source, media.status),
    serviceStatus: service.status,
    serviceStatusLabel: service.label,
    serviceRequestId: source.__serviceState?.serviceRequestId ?? null,
    serviceWorkspaceHref: source.__serviceState?.workspaceHref ?? null,
    saleStatus: sale.status,
    saleStatusLabel: sale.label,
    salePrice: numberNullable(row.salePrice),
    updatedAt: isoDate(row.updatedAt),
  };
}

function searchText(input: WatchListProjectionData) {
  return [
    input.filters.watchId,
    input.filters.productId,
    input.filters.sku,
    input.filters.title,
    input.filters.brandName,
    input.filters.vendorName,
    input.row.slug,
  ]
    .map(clean)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function withProjectionFriendlyDates(row: WatchRow): WatchRow {
  return {
    ...row,
    createdAt: isoDate(row.createdAt),
    updatedAt: isoDate(row.updatedAt),
  };
}

export function mapWatchListSourceRowToProjectionData(
  source: WatchListProjectionSourceRow,
): WatchListProjectionData {
  const row = withProjectionFriendlyDates(mapWatchRow({
    ...source,
    serviceState: source.serviceStage ?? (source as { serviceState?: unknown }).serviceState,
  }));
  const v2Row = mapV2Row(row, source);

  return {
    row,
    v2Row,
    filters: {
      watchId: source.id,
      productId: source.productId,
      sku: cleanNullable(source.product?.sku),
      title: cleanNullable(source.product?.title),
      brandId: cleanNullable(source.product?.brandId),
      brandName: cleanNullable(source.product?.brand?.name ?? row.brandName),
      vendorId: cleanNullable(source.product?.vendorId),
      vendorName: cleanNullable(source.product?.vendor?.name ?? row.vendorName),
      audienceSegment: cleanNullable(source.audienceSegment),
      mediaPipelineKey: cleanNullable(source.mediaPipelineKey),
      saleStage: cleanNullable(source.saleStage),
      serviceStage: cleanNullable(source.serviceStage),
      stockStage: cleanNullable(source.stockStage),
      hasContent: Boolean(row.hasContent),
      hasImages: hasGalleryImages(row),
      isPosted: Boolean(row.isPosted),
      reviewStatus: cleanNullable(row.reviewStatus),
      contentStatus: cleanNullable(row.contentStatus),
      specStatus: cleanNullable(row.specStatus),
      mediaStatus: v2Row.mediaStatus,
      serviceStatus: v2Row.serviceStatus,
      saleStatus: v2Row.saleStatus,
      salePrice: numberNullable(row.salePrice),
      listPrice: numberNullable(row.listPrice),
      createdAt: isoDate(row.createdAt),
      updatedAt: isoDate(row.updatedAt),
    },
  };
}

export function watchListProjectionSearchText(data: WatchListProjectionData) {
  return searchText(data);
}

export function watchListProjectionSortAt(data: WatchListProjectionData) {
  return data.filters.updatedAt ? new Date(data.filters.updatedAt) : null;
}

export function asWatchListProjectionData(
  value: unknown,
): WatchListProjectionData | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Partial<WatchListProjectionData>;
  if (!data.row || !data.filters) return null;
  if (!clean(data.filters.watchId) || !clean(data.filters.productId)) return null;
  return data as WatchListProjectionData;
}
