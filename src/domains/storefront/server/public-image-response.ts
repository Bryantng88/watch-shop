import sharp, { type Metadata } from "sharp";

export const MAX_PUBLIC_IMAGE_BYTES = 20 * 1024 * 1024;
export type PublicImageFailure = "UPSTREAM_STATUS" | "EMPTY_BODY" | "IMAGE_TOO_LARGE" | "INVALID_IMAGE" | "UNSUPPORTED_IMAGE";
export class PublicImageError extends Error {
  constructor(readonly code: PublicImageFailure, readonly upstreamStatus?: number) {
    super(code);
  }
}

/** Validate bytes rather than trusting legacy object-store Content-Type metadata. */
export async function readPublicImageResponse(upstream: Response) {
  const reject = async (code: PublicImageFailure): Promise<never> => {
    await upstream.body?.cancel().catch(() => undefined);
    throw new PublicImageError(code, upstream.status);
  };
  if (!upstream.ok) return reject("UPSTREAM_STATUS");
  const declared = Number(upstream.headers.get("content-length") ?? 0);
  if (declared > MAX_PUBLIC_IMAGE_BYTES) return reject("IMAGE_TOO_LARGE");
  if (!upstream.body) throw new PublicImageError("EMPTY_BODY");
  const reader = upstream.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_PUBLIC_IMAGE_BYTES) {
        await reader.cancel().catch(() => undefined);
        throw new PublicImageError("IMAGE_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  if (!size) throw new PublicImageError("EMPTY_BODY");
  const bytes = Buffer.concat(chunks, size);
  let metadata: Metadata;
  try {
    metadata = await sharp(bytes).metadata();
  } catch {
    throw new PublicImageError("INVALID_IMAGE");
  }
  const types: Record<string, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", tiff: "image/tiff" };
  const contentType = metadata.format === "heif" && metadata.compression === "av1"
    ? "image/avif" : types[metadata.format ?? ""];
  if (!contentType || !metadata.width || !metadata.height) throw new PublicImageError("UNSUPPORTED_IMAGE");
  return { bytes, contentType };
}
