import { randomUUID } from "node:crypto";
import { normalizeKey } from "@/server/lib/storage-key";
import { mediaSourceRoot } from "./media-source-path";

function safeFilename(value: string) {
  const basename = value.replaceAll("\\", "/").split("/").pop() || "file";
  return basename
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}._() -]+/gu, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "") || "file";
}

/**
 * The only policy allowed to create canonical media keys.
 * Business state (segment, owner, role, lifecycle) intentionally does not
 * participate in the key, so changing business state never requires a NAS move.
 */
export class MediaPathPolicy {
  sourceRoot(input: {
    segment: "MEN" | "WOMEN" | "UNISEX";
    purpose: "inline" | "edit";
  }) {
    return normalizeKey(mediaSourceRoot(input.segment, input.purpose));
  }

  canonicalOriginal(input: { mediaObjectId?: string; filename: string }) {
    const mediaObjectId = input.mediaObjectId || randomUUID();
    return normalizeKey(
      `media/objects/${mediaObjectId}/original/${safeFilename(input.filename)}`,
    );
  }

  derivative(input: {
    mediaObjectId: string;
    variant: string;
    extension: string;
  }) {
    const variant = safeFilename(input.variant).replace(/\.[^.]+$/, "");
    const extension = input.extension.replace(/^\./, "").toLowerCase();
    return normalizeKey(
      `media/objects/${input.mediaObjectId}/derivatives/${variant}.${extension}`,
    );
  }

  exportPrefix(input: {
    segment: "MEN" | "WOMEN" | "UNISEX";
    productCode: string;
  }) {
    return normalizeKey(
      `exports/${input.segment.toLowerCase()}/${safeFilename(input.productCode)}`,
    );
  }

  isCanonical(key: string) {
    return /^media\/objects\/[^/]+\/(original|derivatives)\//.test(normalizeKey(key));
  }

  isSource(key: string) {
    return /^media\/(men|women|unisex)\/(inline|edit)\//.test(
      normalizeKey(key),
    );
  }
}

export const mediaPathPolicy = new MediaPathPolicy();
