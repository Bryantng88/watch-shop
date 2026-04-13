import { normalizeKey } from "@/server/lib/product-image-storage";
import { moveMediaObject } from "@/server/lib/media-storage";

export const ACQUISITION_INLINE_IMAGE_PREFIX = "products/inline/chosen";

export async function prepareAcquisitionInlineImage(fileKey: string) {
  const normalized = normalizeKey(fileKey);
  if (!normalized) {
    throw new Error("Thiếu fileKey.");
  }

  const moved = await moveMediaObject({
    fromKey: normalized,
    toPrefix: ACQUISITION_INLINE_IMAGE_PREFIX,
    deleteSource: true,
    overwrite: false,
  });

  const key = normalizeKey(moved.key);

  return {
    key,
    url: `/api/media/sign?key=${encodeURIComponent(key)}`,
    fromKey: normalizeKey(moved.fromKey),
    copied: moved.copied,
    deleted: moved.deleted,
  };
}

export async function prepareAcquisitionInlineImages(fileKeys: string[]) {
  const uniqueKeys = Array.from(
    new Set((fileKeys ?? []).map((item) => normalizeKey(item)).filter(Boolean))
  );

  if (!uniqueKeys.length) {
    throw new Error("Thiếu danh sách ảnh.");
  }

  const items: Array<{
    key: string;
    url: string;
    fromKey: string;
    copied: boolean;
    deleted: boolean;
  }> = [];

  const failed: Array<{
    fileKey: string;
    error: string;
  }> = [];

  for (const fileKey of uniqueKeys) {
    try {
      const prepared = await prepareAcquisitionInlineImage(fileKey);
      items.push(prepared);
    } catch (error: any) {
      failed.push({
        fileKey,
        error: error?.message || "Không thể xử lý ảnh.",
      });
    }
  }

  return {
    items,
    failed,
  };
}