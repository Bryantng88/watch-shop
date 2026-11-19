import { z } from "zod";
export const WEBSITE_IMAGE_FOLDERS = [
  { id: "editorial", label: "Ảnh nội dung website", prefix: "storefront/editorial/" },
  { id: "hero", label: "Ảnh mở đầu / Hero", prefix: "storefront/hero/" },
] as const;
export const websiteFolder = z.enum(["editorial", "hero"]);
export type WebsiteFolder = z.infer<typeof websiteFolder>;
export type WebsiteImage = { key: string; name: string; url: string; sizeBytes?: number | null; lastModified?: string | null };
export type WebsiteImagePage = { items: WebsiteImage[]; nextCursor: string | null; truncated: boolean };
