export type StoredMediaMetadata = {
  key: string;
  sizeBytes: number | null;
  etag: string | null;
  contentType: string | null;
};

export type StoredMediaListItem = StoredMediaMetadata & {
  lastModified: Date | null;
};

export type StoredMediaListResult = {
  items: StoredMediaListItem[];
  prefixes: string[];
  nextCursor: string | null;
  truncated: boolean;
};

export type StoredMediaContent = StoredMediaMetadata & {
  bytes: Uint8Array;
};

export type MoveStoredMediaInput = {
  sourceKey: string;
  destinationKey: string;
  deleteSource?: boolean;
};

export type MoveStoredMediaResult = {
  sourceKey: string;
  destinationKey: string;
  copied: boolean;
  sourceDeleted: boolean;
  metadata: StoredMediaMetadata;
};

export interface MediaStorage {
  exists(key: string): Promise<boolean>;
  stat(key: string): Promise<StoredMediaMetadata | null>;
  read(key: string): Promise<StoredMediaContent>;
  copy(sourceKey: string, destinationKey: string): Promise<StoredMediaMetadata>;
  move(input: MoveStoredMediaInput): Promise<MoveStoredMediaResult>;
  delete(key: string): Promise<void>;
  sign(key: string, expiresInSeconds?: number): Promise<string>;
  list(input: {
    prefix?: string;
    delimiter?: string;
    cursor?: string | null;
    maxKeys?: number;
  }): Promise<StoredMediaListResult>;
}
