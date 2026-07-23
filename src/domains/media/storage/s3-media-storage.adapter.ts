import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { normalizeKey } from "@/server/lib/storage-key";
import { s3, S3_BUCKET } from "@/server/s3";
import type {
  MediaStorage,
  MoveStoredMediaInput,
  StoredMediaMetadata,
} from "./media-storage.port";

function copySource(key: string) {
  return `${S3_BUCKET}/${encodeURIComponent(normalizeKey(key)).replace(/%2F/g, "/")}`;
}

export class S3MediaStorage implements MediaStorage {
  async stat(key: string): Promise<StoredMediaMetadata | null> {
    const normalized = normalizeKey(key);
    if (!normalized) return null;

    try {
      const result = await s3.send(
        new HeadObjectCommand({ Bucket: S3_BUCKET, Key: normalized }),
      );
      return {
        key: normalized,
        sizeBytes: result.ContentLength ?? null,
        etag: result.ETag?.replaceAll('"', "") ?? null,
        contentType: result.ContentType ?? null,
      };
    } catch (error: unknown) {
      const detail = error as {
        name?: string;
        $metadata?: { httpStatusCode?: number };
      };
      const status = detail.$metadata?.httpStatusCode;
      if (status === 404 || detail.name === "NotFound" || detail.name === "NoSuchKey") {
        return null;
      }
      throw error;
    }
  }

  async exists(key: string) {
    return Boolean(await this.stat(key));
  }

  async read(key: string) {
    const normalized = normalizeKey(key);
    if (!normalized) throw new Error("Media key is required.");
    const result = await s3.send(
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: normalized }),
    );
    if (!result.Body) throw new Error(`Media object body is empty: ${normalized}`);
    return {
      key: normalized,
      sizeBytes: result.ContentLength ?? null,
      etag: result.ETag?.replaceAll('"', "") ?? null,
      contentType: result.ContentType ?? null,
      bytes: await result.Body.transformToByteArray(),
    };
  }

  async copy(sourceKey: string, destinationKey: string) {
    const source = normalizeKey(sourceKey);
    const destination = normalizeKey(destinationKey);
    if (!source || !destination) throw new Error("Media source/destination key is required.");

    const sourceMetadata = await this.stat(source);
    if (!sourceMetadata) throw new Error(`Media source does not exist: ${source}`);

    await s3.send(
      new CopyObjectCommand({
        Bucket: S3_BUCKET,
        CopySource: copySource(source),
        Key: destination,
      }),
    );

    const destinationMetadata = await this.stat(destination);
    if (!destinationMetadata) {
      throw new Error(`Media copy could not be verified: ${destination}`);
    }
    if (
      sourceMetadata.sizeBytes !== null &&
      destinationMetadata.sizeBytes !== sourceMetadata.sizeBytes
    ) {
      throw new Error(`Media copy size mismatch: ${source} -> ${destination}`);
    }
    return destinationMetadata;
  }

  async move(input: MoveStoredMediaInput) {
    const sourceKey = normalizeKey(input.sourceKey);
    const destinationKey = normalizeKey(input.destinationKey);
    if (sourceKey === destinationKey) {
      const metadata = await this.stat(sourceKey);
      if (!metadata) throw new Error(`Media object does not exist: ${sourceKey}`);
      return {
        sourceKey,
        destinationKey,
        copied: false,
        sourceDeleted: false,
        metadata,
      };
    }

    const metadata = await this.copy(sourceKey, destinationKey);
    const shouldDelete = input.deleteSource !== false;
    if (shouldDelete) await this.delete(sourceKey);

    return {
      sourceKey,
      destinationKey,
      copied: true,
      sourceDeleted: shouldDelete,
      metadata,
    };
  }

  async delete(key: string) {
    const normalized = normalizeKey(key);
    if (!normalized) return;
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: normalized }));
  }

  async sign(key: string, expiresInSeconds = 600) {
    return getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: normalizeKey(key) }),
      { expiresIn: expiresInSeconds },
    );
  }

  async list(input: {
    prefix?: string;
    delimiter?: string;
    cursor?: string | null;
    maxKeys?: number;
  }) {
    const normalizedPrefix = normalizeKey(input.prefix);
    // A trailing slash is significant when listing an S3-compatible folder
    // with a delimiter. Dropping it makes QNAP return the current folder as
    // its own CommonPrefix and hides objects directly inside that folder.
    const prefix =
      normalizedPrefix && String(input.prefix ?? "").replaceAll("\\", "/").endsWith("/")
        ? `${normalizedPrefix}/`
        : normalizedPrefix;
    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: prefix || undefined,
        Delimiter: input.delimiter,
        ContinuationToken: input.cursor || undefined,
        MaxKeys: Math.min(Math.max(input.maxKeys ?? 1000, 1), 1000),
      }),
    );
    return {
      items: (result.Contents ?? [])
        .map((item) => ({
          key: normalizeKey(item.Key),
          sizeBytes: item.Size ?? null,
          etag: item.ETag?.replaceAll('"', "") ?? null,
          contentType: null,
          lastModified: item.LastModified ?? null,
        }))
        .filter((item) => Boolean(item.key)),
      prefixes: (result.CommonPrefixes ?? [])
        .map((item) => normalizeKey(item.Prefix))
        .filter(Boolean),
      nextCursor: result.NextContinuationToken ?? null,
      truncated: Boolean(result.IsTruncated),
    };
  }
}

export const mediaStorage: MediaStorage = new S3MediaStorage();
