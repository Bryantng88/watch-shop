export const MEDIA_POST_UNCLASSIFIED_FILTER = "__UNCLASSIFIED__" as const;

export type MediaPostThemeFilters = {
  query?: string;
  brandId?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  movementType?: string;
  caseShape?: string;
  style?: string;
  stockStage?: string;
  siteChannel?: string;
  audienceSegment?: string;
  publishedOnly?: boolean;
};

export type MediaPostThemeGalleryImage = {
  key: string;
  url: string;
  sortOrder: number;
};

export type MediaPostThemeWatchCandidate = {
  watchId: string;
  productId: string;
  title: string;
  sku: string | null;
  brandId: string | null;
  brandName: string | null;
  price: string | null;
  movementType: string | null;
  caseShape: string | null;
  style: string | null;
  gallery: MediaPostThemeGalleryImage[];
};

export type MediaPostThemeSelection = {
  watchId: string;
  sourceGalleryKey: string;
};

export type MediaPostThemeDefinition = {
  label: string;
  filters: MediaPostThemeFilters;
};
