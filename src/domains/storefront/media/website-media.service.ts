import { mediaStorage } from "@/domains/media/storage";
import { editorialKey } from "../content/contract";
import { WEBSITE_IMAGE_FOLDERS, websiteImageUrl, type WebsiteFolder } from "./website-media";
export async function findWebsiteImage(key: string) {
  if (!editorialKey.safeParse(key).success || !key) return null;
  const metadata = await mediaStorage.stat(key);
  if (!metadata) return null;
  return { key, name: key.split("/").pop() || key, url: websiteImageUrl(key), sizeBytes: metadata.sizeBytes };
}
export async function listWebsiteImages(folder: WebsiteFolder, cursor: string | null) {
  const prefix = WEBSITE_IMAGE_FOLDERS.find(item => item.id === folder)!.prefix;
  const result = await mediaStorage.list({ prefix, cursor, maxKeys: 60 });
  const items = await Promise.all(result.items.filter(item => item.key.startsWith(prefix) && editorialKey.safeParse(item.key).success).map(async item => ({
    key: item.key, name: item.key.split("/").pop() || item.key, url: websiteImageUrl(item.key), sizeBytes: item.sizeBytes, lastModified: item.lastModified?.toISOString() ?? null,
  })));
  return { items, nextCursor: result.nextCursor, truncated: result.truncated };
}
