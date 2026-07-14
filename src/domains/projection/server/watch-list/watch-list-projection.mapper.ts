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
  const publishState = upper(publish?.workflowState ?? publish?.taskStatus);
  const mediaState = upper(media?.workflowState ?? media?.taskStatus);
  const photoshootState = upper(photoshoot?.workflowState ?? photoshoot?.taskStatus);

  if (row.isPosted || publishState === "DONE") {
    return { status: "POSTED" as const, label: "Đã đăng" };
  }

  if (publish && publishState !== "RECALLED") {
    return { status: "READY_TO_PUBLISH" as const, label: "Chờ đăng bài" };
  }

  if (media) {
    if (["FEEDBACK", "RECALLED", "BLOCKED"].includes(mediaState)) {
      return { status: "NEEDS_REWORK" as const, label: "Cần xử lý lại" };
    }

    if (mediaState === "DONE") {
      return { status: "READY_TO_PUBLISH" as const, label: "Chờ đăng bài" };
    }

    return { status: "MEDIA_PROCESSING" as const, label: "Đang xử lý media" };
  }

  if (photoshoot) {
    if (["FEEDBACK", "RECALLED", "BLOCKED"].includes(photoshootState)) {
      return { status: "NEEDS_REWORK" as const, label: "Cần chụp lại" };
    }

    return { status: "PHOTOSHOOT" as const, label: "Đang chụp hình" };
  }

  if (!row.hasImages && Number(row.imagesCount ?? 0) <= 0) {
    return { status: "NO_IMAGE" as const, label: "Chưa có ảnh" };
  }

  return { status: "MEDIA_PROCESSING" as const, label: "Đang xử lý media" };
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
  const service = mapServiceStatus(row, source);
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
    serviceStatus: service.status,
    serviceStatusLabel: service.label,
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
      saleStage: cleanNullable(source.saleStage),
      serviceStage: cleanNullable(source.serviceStage),
      stockStage: cleanNullable(source.stockStage),
      hasContent: Boolean(row.hasContent),
      hasImages: Boolean(row.hasImages),
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
