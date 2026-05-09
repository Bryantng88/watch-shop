import { normalizeKey } from "@/server/lib/product-image-storage";

export const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

export function getFileNameFromKey(key: string) {
  const normalized = normalizeKey(key);
  const parts = normalized.split("/").filter(Boolean);
  return parts[parts.length - 1] || normalized;
}

export function getParentPrefixFromKey(key: string) {
  const normalized = normalizeKey(key);
  const parts = normalized.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

export function getExtFromKey(key: string) {
  const name = getFileNameFromKey(key);
  const index = name.lastIndexOf(".");
  return index >= 0 ? name.slice(index + 1).toLowerCase() : null;
}

export function shouldHideMediaName(name: string) {
  return !name || name.startsWith("@") || name.startsWith(".") || name === "Thumbs.db";
}

export function inferMediaStatusFromKey(key: string) {
  const normalized = normalizeKey(key).toLowerCase();
  if (normalized.includes("/chosen/")) return "CHOSEN" as const;
  if (normalized.includes("/archived/") || normalized.includes("/archive/")) return "ARCHIVED" as const;
  return "ACTIVE" as const;
}

export function toPickedMediaAsset(item: {
  key: string;
  fileName?: string | null;
  sortOrder?: number | null;
}) {
  return {
    key: item.key,
    fileKey: item.key,
    url: `/api/media/sign?key=${encodeURIComponent(item.key)}`,
    name: item.fileName ?? getFileNameFromKey(item.key),
    sortOrder: item.sortOrder ?? 0,
  };
}
