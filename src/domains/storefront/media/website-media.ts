import { z } from "zod";
export const WEBSITE_IMAGE_FOLDERS = [
  { id: "editorial", label: "Ảnh nội dung website", prefix: "storefront/editorial/" },
  { id: "hero", label: "Ảnh mở đầu / Hero", prefix: "storefront/hero/" },
  { id: "about", label: "Về Vintic", prefix: "storefront/about/" },
  { id: "collections", label: "Bộ sưu tập", prefix: "storefront/collections/" },
  { id: "journal", label: "Chuyện đồng hồ", prefix: "storefront/journal/" },
  { id: "branding", label: "Logo & thương hiệu", prefix: "storefront/branding/" },
] as const;
export const websiteFolder = z.enum(["editorial", "hero", "about", "collections", "journal", "branding"]);
export type WebsiteFolder = z.infer<typeof websiteFolder>;
export type WebsiteImage = { key: string; name: string; url: string; sizeBytes?: number | null; lastModified?: string | null };
export type WebsiteImagePage = { items: WebsiteImage[]; nextCursor: string | null; truncated: boolean };

export function websiteImageUrl(key: string) {
  return `/api/admin/storefront/media/image?key=${encodeURIComponent(key)}`;
}
