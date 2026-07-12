import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type {
  BlueprintPublishedVersion,
} from "./blueprint-published-version.types";

type StoreFile = {
  version: 1;
  publishedVersions: BlueprintPublishedVersion[];
};

export type BlueprintPublishedVersionStoreOptions = {
  storePath?: string;
};

const DEFAULT_STORE_PATH = path.join(
  process.cwd(),
  ".data",
  "blueprint-published-versions.json",
);

function storePath(options?: BlueprintPublishedVersionStoreOptions) {
  return options?.storePath ?? DEFAULT_STORE_PATH;
}

function cloneVersion(version: BlueprintPublishedVersion) {
  return JSON.parse(JSON.stringify(version)) as BlueprintPublishedVersion;
}

async function ensureStoreDir(options?: BlueprintPublishedVersionStoreOptions) {
  await mkdir(path.dirname(storePath(options)), { recursive: true });
}

async function readStore(
  options?: BlueprintPublishedVersionStoreOptions,
): Promise<StoreFile> {
  try {
    const raw = await readFile(storePath(options), "utf8");
    const parsed = JSON.parse(raw) as StoreFile;

    return {
      version: 1,
      publishedVersions: Array.isArray(parsed.publishedVersions)
        ? parsed.publishedVersions
        : [],
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return { version: 1, publishedVersions: [] };
    }
    throw error;
  }
}

async function writeStore(
  store: StoreFile,
  options?: BlueprintPublishedVersionStoreOptions,
) {
  await ensureStoreDir(options);
  await writeFile(
    storePath(options),
    `${JSON.stringify(store, null, 2)}\n`,
    "utf8",
  );
}

export async function listBlueprintPublishedVersionRecords(
  options?: BlueprintPublishedVersionStoreOptions,
) {
  const store = await readStore(options);
  return store.publishedVersions
    .map(cloneVersion)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function listBlueprintPublishedVersionRecordsForBlueprint(
  blueprintKey: string,
  options?: BlueprintPublishedVersionStoreOptions,
) {
  const records = await listBlueprintPublishedVersionRecords(options);
  return records
    .filter((record) => record.blueprintKey === blueprintKey)
    .sort((a, b) => b.version - a.version);
}

export async function getLatestBlueprintPublishedVersionRecord(
  blueprintKey: string,
  options?: BlueprintPublishedVersionStoreOptions,
) {
  const records = await listBlueprintPublishedVersionRecordsForBlueprint(
    blueprintKey,
    options,
  );

  return records[0] ?? null;
}

export async function getBlueprintPublishedVersionRecord(
  id: string,
  options?: BlueprintPublishedVersionStoreOptions,
) {
  const store = await readStore(options);
  const record = store.publishedVersions.find((item) => item.id === id);

  return record ? cloneVersion(record) : null;
}

export async function appendBlueprintPublishedVersionRecord(
  input: Omit<BlueprintPublishedVersion, "id" | "publishedAt"> & {
    publishedAt?: string;
  },
  options?: BlueprintPublishedVersionStoreOptions,
) {
  const store = await readStore(options);
  const duplicate = store.publishedVersions.some(
    (record) =>
      record.blueprintKey === input.blueprintKey &&
      record.version === input.version,
  );

  if (duplicate) {
    throw new Error(
      `Blueprint ${input.blueprintKey} version ${input.version} is already published.`,
    );
  }

  const record: BlueprintPublishedVersion = {
    ...cloneVersion(input as BlueprintPublishedVersion),
    id: randomUUID(),
    publishedAt: input.publishedAt ?? new Date().toISOString(),
  };

  store.publishedVersions.unshift(record);
  await writeStore(store, options);

  return cloneVersion(record);
}
