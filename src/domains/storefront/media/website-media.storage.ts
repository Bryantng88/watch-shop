import { S3Client } from "@aws-sdk/client-s3";
import { mediaStorage } from "@/domains/media/storage";
import { S3MediaStorage } from "@/domains/media/storage/s3-media-storage.adapter";
import type { MediaStorage, MoveStoredMediaInput, WriteStoredMediaInput } from "@/domains/media/storage/media-storage.port";
import { editorialKey } from "../content/contract";
import { WEBSITE_IMAGE_FOLDERS } from "./website-media";

/** Optional website-only override; watch/product storage never reads these variables. */
export function websiteStorageConfiguration(env: Record<string, string | undefined>) {
  const names = ["WEBSITE_S3_ENDPOINT", "WEBSITE_S3_BUCKET", "WEBSITE_S3_ACCESS_KEY", "WEBSITE_S3_SECRET_KEY"] as const;
  if (!names.some(name => env[name])) return null;
  if (!names.every(name => env[name])) throw new Error("Website storage configuration is incomplete.");
  const endpoint = new URL(env.WEBSITE_S3_ENDPOINT!);
  if (!["http:", "https:"].includes(endpoint.protocol) || endpoint.username || endpoint.password) throw new Error("Website storage endpoint is invalid.");
  return { endpoint: env.WEBSITE_S3_ENDPOINT!, region: env.WEBSITE_S3_REGION || "us-east-1", bucket: env.WEBSITE_S3_BUCKET!, accessKeyId: env.WEBSITE_S3_ACCESS_KEY!, secretAccessKey: env.WEBSITE_S3_SECRET_KEY! };
}
function assertImage(key: string) {
  if (!key || !editorialKey.safeParse(key).success) throw new Error("Only website image keys are allowed.");
}
/** Scope every operation, including any future callers, to website images only. */
export function websiteStorageBoundary(storage: MediaStorage): MediaStorage {
  return {
    stat(key) { assertImage(key); return storage.stat(key); },
    exists(key) { assertImage(key); return storage.exists(key); },
    read(key) { assertImage(key); return storage.read(key); },
    write(input: WriteStoredMediaInput) { assertImage(input.key); return storage.write(input); },
    copy(source, destination) { assertImage(source); assertImage(destination); return storage.copy(source, destination); },
    move(input: MoveStoredMediaInput) { assertImage(input.sourceKey); assertImage(input.destinationKey); return storage.move(input); },
    delete(key) { assertImage(key); return storage.delete(key); },
    sign(key, expiry) { assertImage(key); return storage.sign(key, expiry); },
    list(input) {
      const prefix = input.prefix || "";
      if (prefix.includes("..") || prefix.includes("\\") || !WEBSITE_IMAGE_FOLDERS.some(folder => prefix.startsWith(folder.prefix))) throw new Error("Only website folders are allowed.");
      return storage.list(input);
    },
  };
}
const configuration = websiteStorageConfiguration(process.env);
export const websiteMediaStorage = websiteStorageBoundary(configuration ? new S3MediaStorage(new S3Client({
  endpoint: configuration.endpoint, region: configuration.region, forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED",
  credentials: { accessKeyId: configuration.accessKeyId, secretAccessKey: configuration.secretAccessKey },
}), configuration.bucket) : mediaStorage);
