import { createHash } from "node:crypto";

import sharp from "sharp";

import { mediaStorage } from "@/domains/media/storage";
import { normalizeKey } from "@/server/lib/storage-key";

const THUMBNAIL_CACHE_ROOT = "media/cache/nas-browser/v1";
const THUMBNAIL_SIZE = 256;
const MAX_SOURCE_BYTES = 50 * 1024 * 1024;
const MAX_CONCURRENT_GENERATIONS = 2;
const MAX_PREWARM_ITEMS = 24;
const MAX_PENDING_PREWARM_ITEMS = 48;
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

type ThumbnailResult = {
  bytes: Uint8Array;
  etag: string | null;
  cacheHit: boolean;
};

const pendingByCacheKey = new Map<string, Promise<ThumbnailResult>>();
const generationQueue: Array<() => void> = [];
let activeGenerations = 0;
const prewarmQueue: Array<{ key: string; version?: string | null }> = [];
const prewarmQueuedKeys = new Set<string>();
let activePrewarmWorkers = 0;

export function nasBrowserThumbnailUrl(input: {
  key: string;
  version?: string | null;
}) {
  const params = new URLSearchParams({ key: normalizeKey(input.key) });
  const version = String(input.version ?? "").trim();
  if (version) params.set("v", version.slice(0, 160));
  return `/api/media/thumbnail?${params.toString()}`;
}

export function nasBrowserThumbnailCacheKey(input: {
  key: string;
  version?: string | null;
}) {
  const key = normalizeKey(input.key);
  const version = String(input.version ?? "unversioned").trim() || "unversioned";
  const digest = createHash("sha256")
    .update(JSON.stringify([key, version, THUMBNAIL_SIZE, "webp-68-effort-2"]))
    .digest("hex");
  return `${THUMBNAIL_CACHE_ROOT}/${digest.slice(0, 2)}/${digest}.webp`;
}

function validateSourceKey(value: string) {
  const key = normalizeKey(value);
  if (!key || !IMAGE_EXT_RE.test(key)) throw new Error("Media thumbnail key is invalid.");
  if (key === THUMBNAIL_CACHE_ROOT || key.startsWith(`${THUMBNAIL_CACHE_ROOT}/`)) {
    throw new Error("Nested media thumbnails are not allowed.");
  }
  return key;
}

async function withGenerationSlot<T>(operation: () => Promise<T>): Promise<T> {
  if (activeGenerations >= MAX_CONCURRENT_GENERATIONS) {
    await new Promise<void>((resolve) => generationQueue.push(resolve));
  } else {
    activeGenerations += 1;
  }
  try {
    return await operation();
  } finally {
    const next = generationQueue.shift();
    if (next) next();
    else activeGenerations -= 1;
  }
}

async function readCachedThumbnail(cacheKey: string): Promise<ThumbnailResult | null> {
  const metadata = await mediaStorage.stat(cacheKey);
  if (!metadata) return null;
  const cached = await mediaStorage.read(cacheKey);
  return { bytes: cached.bytes, etag: cached.etag, cacheHit: true };
}

export async function renderNasMediaThumbnail(source: Uint8Array) {
  return sharp(source, {
    failOn: "error",
    limitInputPixels: 80_000_000,
    sequentialRead: true,
  })
    .autoOrient()
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
    })
    .webp({ quality: 68, effort: 2 })
    .toBuffer();
}

export function selectNasMediaThumbnailPrewarmCandidates(
  items: Array<{ key: string; version?: string | null }>,
) {
  const seen = new Set<string>();
  const selected: Array<{ key: string; version?: string | null }> = [];

  for (const item of items) {
    const key = normalizeKey(item.key);
    if (!key || seen.has(key) || !IMAGE_EXT_RE.test(key)) continue;
    seen.add(key);
    selected.push({ key, version: item.version });
    if (selected.length >= MAX_PREWARM_ITEMS) break;
  }

  return selected;
}

export function prewarmNasMediaThumbnails(
  items: Array<{ key: string; version?: string | null }>,
) {
  const candidates = selectNasMediaThumbnailPrewarmCandidates(items);
  for (const candidate of candidates) {
    if (prewarmQueue.length >= MAX_PENDING_PREWARM_ITEMS) break;
    const identity = `${candidate.key}\u0000${candidate.version ?? ""}`;
    if (prewarmQueuedKeys.has(identity)) continue;
    prewarmQueuedKeys.add(identity);
    prewarmQueue.push(candidate);
  }

  while (
    activePrewarmWorkers < MAX_CONCURRENT_GENERATIONS &&
    prewarmQueue.length > 0
  ) {
    activePrewarmWorkers += 1;
    void (async () => {
      try {
        while (prewarmQueue.length > 0) {
          const candidate = prewarmQueue.shift();
          if (!candidate) break;
          const identity = `${candidate.key}\u0000${candidate.version ?? ""}`;
          try {
            await getNasMediaThumbnail(candidate);
          } catch {
            // A failed derivative falls back to the original URL in the browser.
          } finally {
            prewarmQueuedKeys.delete(identity);
          }
        }
      } finally {
        activePrewarmWorkers -= 1;
      }
    })();
  }
}

export async function getNasMediaThumbnail(input: {
  key: string;
  version?: string | null;
}): Promise<ThumbnailResult> {
  const key = validateSourceKey(input.key);
  const cacheKey = nasBrowserThumbnailCacheKey({ key, version: input.version });
  const cached = await readCachedThumbnail(cacheKey);
  if (cached) return cached;

  const existing = pendingByCacheKey.get(cacheKey);
  if (existing) return existing;

  const pending = withGenerationSlot(async () => {
    const cachedAfterQueue = await readCachedThumbnail(cacheKey);
    if (cachedAfterQueue) return cachedAfterQueue;

    const source = await mediaStorage.read(key);
    if (source.sizeBytes !== null && source.sizeBytes > MAX_SOURCE_BYTES) {
      throw new Error("Media source is too large for a browser thumbnail.");
    }
    if (source.bytes.byteLength > MAX_SOURCE_BYTES) {
      throw new Error("Media source is too large for a browser thumbnail.");
    }

    const bytes = await renderNasMediaThumbnail(source.bytes);

    const stored = await mediaStorage.write({
      key: cacheKey,
      bytes,
      contentType: "image/webp",
      cacheControl: "private, max-age=31536000, immutable",
    });
    return { bytes, etag: stored.etag, cacheHit: false };
  });

  pendingByCacheKey.set(cacheKey, pending);
  try {
    return await pending;
  } finally {
    pendingByCacheKey.delete(cacheKey);
  }
}
