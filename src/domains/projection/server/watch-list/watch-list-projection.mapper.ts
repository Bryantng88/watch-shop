import { mapWatchRow } from "@/domains/watch/ui/list/helpers";
import type { WatchRow } from "@/domains/watch/ui/list/types";
import type {
  WatchListProjectionData,
  WatchListProjectionSourceRow,
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
  const row = withProjectionFriendlyDates(mapWatchRow(source));

  return {
    row,
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
