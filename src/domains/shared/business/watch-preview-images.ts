import { mediaDisplayUrl } from "@/domains/shared/media/server/display-image";

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
  const unique = new Map<string, { id: string; url: string; alt: string; label: string }>();
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
