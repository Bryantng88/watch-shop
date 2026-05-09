import type { ImageRole, MediaAssetStatus, Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { getExtFromKey, getFileNameFromKey, getParentPrefixFromKey, inferMediaStatusFromKey } from "./media-asset.utils";

export type UpsertMediaAssetInput = {
  key: string;
  profile?: string | null;
  sizeBytes?: number | null;
  etag?: string | null;
  lastModified?: Date | null;
  status?: MediaAssetStatus;
  productId?: string | null;
  acquisitionId?: string | null;
  role?: ImageRole | null;
  sortOrder?: number | null;
  movedFromKey?: string | null;
};

export function mediaAssetSelect() {
  return {
    id: true,
    key: true,
    parentPrefix: true,
    fileName: true,
    ext: true,
    sizeBytes: true,
    etag: true,
    lastModified: true,
    profile: true,
    status: true,
    productId: true,
    acquisitionId: true,
    role: true,
    sortOrder: true,
    isMissing: true,
    missingAt: true,
    lastSeenAt: true,
    movedFromKey: true,
  } satisfies Prisma.MediaAssetSelect;
}

export async function upsertMediaAssetRepo(db: DB, input: UpsertMediaAssetInput) {
  const client = dbOrTx(db);
  const key = String(input.key ?? "").trim();
  if (!key) throw new Error("Media key không hợp lệ");

  const fileName = getFileNameFromKey(key);
  const parentPrefix = getParentPrefixFromKey(key);
  const ext = getExtFromKey(key);
  const now = new Date();

  const status = input.status ?? inferMediaStatusFromKey(key);

  return client.mediaAsset.upsert({
    where: { key },
    create: {
      key,
      parentPrefix,
      fileName,
      ext,
      sizeBytes: input.sizeBytes ?? null,
      etag: input.etag ?? null,
      lastModified: input.lastModified ?? null,
      profile: input.profile ?? null,
      status,
      productId: input.productId ?? null,
      acquisitionId: input.acquisitionId ?? null,
      role: input.role ?? null,
      sortOrder: input.sortOrder ?? 0,
      isMissing: false,
      missingAt: null,
      lastSeenAt: now,
      movedFromKey: input.movedFromKey ?? null,
    },
    update: {
      parentPrefix,
      fileName,
      ext,
      ...(input.sizeBytes !== undefined ? { sizeBytes: input.sizeBytes } : {}),
      ...(input.etag !== undefined ? { etag: input.etag } : {}),
      ...(input.lastModified !== undefined ? { lastModified: input.lastModified } : {}),
      ...(input.profile !== undefined ? { profile: input.profile } : {}),
      status,
      ...(input.productId !== undefined ? { productId: input.productId } : {}),
      ...(input.acquisitionId !== undefined ? { acquisitionId: input.acquisitionId } : {}),
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder ?? 0 } : {}),
      isMissing: false,
      missingAt: null,
      lastSeenAt: now,
      ...(input.movedFromKey !== undefined ? { movedFromKey: input.movedFromKey } : {}),
    },
    select: mediaAssetSelect(),
  });
}

export async function markMediaAssetArchivedRepo(db: DB, key: string) {
  const client = dbOrTx(db);

  return client.mediaAsset.updateMany({
    where: { key },
    data: {
      status: "ARCHIVED",
      productId: null,
      acquisitionId: null,
      role: null,
      isMissing: true,
      missingAt: new Date(),
    },
  });
}

export async function markMissingMediaAssetsNotInKeysRepo(
  db: DB,
  input: { prefix: string; keys: string[] }
) {
  const client = dbOrTx(db);

  return client.mediaAsset.updateMany({
    where: {
      parentPrefix: input.prefix,
      key: { notIn: input.keys },
      isMissing: false,
    },
    data: {
      status: "MISSING",
      isMissing: true,
      missingAt: new Date(),
    },
  });
}

export async function listMediaAssetsRepo(
  db: DB,
  input: {
    prefix?: string | null;
    profile?: string | null;
    status?: MediaAssetStatus | null;
    productId?: string | null;
    acquisitionId?: string | null;
  }
) {
  const client = dbOrTx(db);

  return client.mediaAsset.findMany({
    where: {
      ...(input.prefix ? { parentPrefix: input.prefix } : {}),
      ...(input.profile ? { profile: input.profile } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.productId ? { productId: input.productId } : {}),
      ...(input.acquisitionId ? { acquisitionId: input.acquisitionId } : {}),
      isMissing: false,
    },
    orderBy: [{ sortOrder: "asc" }, { lastModified: "desc" }, { createdAt: "desc" }],
    select: mediaAssetSelect(),
  });
}

export async function listWatchChosenMediaAssetsRepo(
  db: DB,
  input: { productId: string; acquisitionId?: string | null }
) {
  const client = dbOrTx(db);

  return client.mediaAsset.findMany({
    where: {
      status: "CHOSEN",
      isMissing: false,
      OR: [
        { productId: input.productId },
        ...(input.acquisitionId ? [{ acquisitionId: input.acquisitionId }] : []),
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: mediaAssetSelect(),
  });
}
