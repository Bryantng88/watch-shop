import { mediaDisplayUrl } from "@/domains/shared/media/server/display-image";
import type { BusinessPreviewImage } from "./business-entity.types";

type ImageSource = { fileKey: string; role: string; alt?: string | null };
type BoundImage = { role: string; mediaObject: { storageKey: string; availability: string; originalFileName?: string | null } };

export function buildWatchPreviewImages(input: {
  cover?: string | null; fallback?: string | null; title: string;
  images: ImageSource[]; bindings: BoundImage[];
}) {
  const unavailable = new Set(input.bindings.filter(b => ["MISSING", "QUARANTINED", "DELETED"].includes(b.mediaObject.availability)).map(b => b.mediaObject.storageKey));
  const candidates = [
    ...(input.cover ? [{ fileKey: input.cover, role: "COVER", alt: input.title }] : []),
    ...input.images.filter(i => i.role === "COVER"),
    ...input.images.filter(i => i.role === "GALLERY"),
    ...input.bindings.filter(b => ["COVER", "GALLERY"].includes(b.role)).map(b => ({ fileKey: b.mediaObject.storageKey, role: b.role, alt: b.mediaObject.originalFileName })),
  ];
  const unique = new Map<string, BusinessPreviewImage>();
  for (const candidate of candidates) {
    const key = candidate.fileKey.trim();
    const url = mediaDisplayUrl(key);
    if (!url || unique.has(key) || unavailable.has(key)) continue;
    unique.set(key, { id: key, url, alt: candidate.alt || input.title, label: candidate.role === "COVER" ? "Cover" : "Gallery" });
  }
  if (!unique.size && input.fallback && !unavailable.has(input.fallback)) {
    const url = mediaDisplayUrl(input.fallback);
    if (url) unique.set(input.fallback, { id: input.fallback, url, alt: input.title, label: "Đại diện" });
  }
  return [...unique.values()];
}

/** Pool membership and final gallery selection have distinct lifecycle semantics. */
export function buildWatchMediaReviewImages(input: {
  cover?: string | null; fallback?: string | null; title: string; images: ImageSource[];
  pool: Array<{ fileKey: string; name: string; lifecycle: string; availability: string }>;
}) {
  const available = input.pool.filter(image => !["MISSING", "QUARANTINED", "DELETED"].includes(image.availability));
  const unavailable = new Set(input.pool.filter(image => ["MISSING", "QUARANTINED", "DELETED"].includes(image.availability)).map(image => image.fileKey));
  const selected = buildWatchPreviewImages({
    cover: input.cover && !unavailable.has(input.cover) ? input.cover : null, fallback: null, title: input.title,
    images: input.images.filter(image => !unavailable.has(image.fileKey)),
    bindings: available.filter(image => ["ATTACHED", "APPROVED", "PUBLISHED"].includes(image.lifecycle))
      .map(image => ({ role: "GALLERY", mediaObject: { storageKey: image.fileKey, availability: image.availability, originalFileName: image.name } })),
  });
  const selectedKeys = new Set(selected.map(image => image.id));
  const pool = buildWatchPreviewImages({ title: input.title, images: input.images.filter(image => image.role === "GALLERY" && !unavailable.has(image.fileKey)),
    bindings: available.map(image => ({ role: "GALLERY", mediaObject: { storageKey: image.fileKey, availability: image.availability, originalFileName: image.name } })) });
  return { selected, pool: pool.map(image => ({ ...image, selected: selectedKeys.has(image.id) })), unselectedCount: pool.filter(image => !selectedKeys.has(image.id)).length };
}
