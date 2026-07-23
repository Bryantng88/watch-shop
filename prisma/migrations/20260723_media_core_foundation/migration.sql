-- Add segment and pipeline fields without changing the existing gender behavior.
CREATE TYPE "AudienceSegment" AS ENUM ('MEN', 'WOMEN', 'UNISEX');
CREATE TYPE "MediaPipelineKey" AS ENUM ('MEN_STANDARD', 'WOMEN_LITE', 'UNISEX_STANDARD');
CREATE TYPE "MediaObjectAvailability" AS ENUM ('UNVERIFIED', 'AVAILABLE', 'MOVE_PENDING', 'MISSING', 'QUARANTINED', 'DELETED');
CREATE TYPE "MediaOwnerType" AS ENUM ('WATCH', 'ACQUISITION', 'PRODUCT', 'LISTING');
CREATE TYPE "MediaRole" AS ENUM ('COVER', 'GALLERY', 'INLINE', 'SOCIAL', 'THUMBNAIL');
CREATE TYPE "MediaBindingLifecycle" AS ENUM ('DRAFT', 'SELECTED', 'ATTACHED', 'APPROVED', 'PUBLISHED', 'REMOVED');
CREATE TYPE "MediaOperationType" AS ENUM ('COPY', 'MOVE', 'DELETE', 'VERIFY', 'INGEST', 'EXPORT');
CREATE TYPE "MediaOperationStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

ALTER TABLE "Acquisition"
ADD COLUMN "audienceSegment" "AudienceSegment" NOT NULL DEFAULT 'MEN';

ALTER TABLE "Watch"
ADD COLUMN "audienceSegment" "AudienceSegment" NOT NULL DEFAULT 'MEN',
ADD COLUMN "mediaPipelineKey" "MediaPipelineKey" NOT NULL DEFAULT 'MEN_STANDARD';

-- Preserve the current Watch classification during rollout.
UPDATE "Watch"
SET
  "audienceSegment" = CASE
    WHEN "gender"::text = 'WOMEN' THEN 'WOMEN'::"AudienceSegment"
    WHEN "gender"::text = 'UNISEX' THEN 'UNISEX'::"AudienceSegment"
    ELSE 'MEN'::"AudienceSegment"
  END,
  "mediaPipelineKey" = CASE
    WHEN "gender"::text = 'WOMEN' THEN 'WOMEN_LITE'::"MediaPipelineKey"
    WHEN "gender"::text = 'UNISEX' THEN 'UNISEX_STANDARD'::"MediaPipelineKey"
    ELSE 'MEN_STANDARD'::"MediaPipelineKey"
  END;

CREATE INDEX "Acquisition_audienceSegment_acquiredAt_idx"
ON "Acquisition"("audienceSegment", "acquiredAt");
CREATE INDEX "Watch_audienceSegment_updatedAt_idx"
ON "Watch"("audienceSegment", "updatedAt");
CREATE INDEX "Watch_mediaPipelineKey_updatedAt_idx"
ON "Watch"("mediaPipelineKey", "updatedAt");

CREATE TABLE "MediaObject" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "bucket" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "originalFileName" TEXT,
  "mimeType" TEXT,
  "sizeBytes" BIGINT,
  "checksum" TEXT,
  "etag" TEXT,
  "availability" "MediaObjectAvailability" NOT NULL DEFAULT 'UNVERIFIED',
  "verifiedAt" TIMESTAMP(3),
  "missingAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MediaObject_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaBinding" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "mediaObjectId" TEXT NOT NULL,
  "ownerType" "MediaOwnerType" NOT NULL,
  "ownerId" TEXT NOT NULL,
  "role" "MediaRole" NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "audienceSegment" "AudienceSegment" NOT NULL,
  "lifecycle" "MediaBindingLifecycle" NOT NULL DEFAULT 'DRAFT',
  "pipelineKey" "MediaPipelineKey",
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MediaBinding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaOperation" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "idempotencyKey" TEXT NOT NULL,
  "mediaObjectId" TEXT,
  "type" "MediaOperationType" NOT NULL,
  "status" "MediaOperationStatus" NOT NULL DEFAULT 'PENDING',
  "sourceKey" TEXT,
  "destinationKey" TEXT,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "requestedByUserId" TEXT,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MediaOperation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaObject_storageKey_key" ON "MediaObject"("storageKey");
CREATE INDEX "MediaObject_availability_updatedAt_idx" ON "MediaObject"("availability", "updatedAt");
CREATE INDEX "MediaObject_checksum_idx" ON "MediaObject"("checksum");
CREATE UNIQUE INDEX "MediaBinding_ownerType_ownerId_role_sortOrder_key"
ON "MediaBinding"("ownerType", "ownerId", "role", "sortOrder");
CREATE INDEX "MediaBinding_mediaObjectId_lifecycle_idx" ON "MediaBinding"("mediaObjectId", "lifecycle");
CREATE INDEX "MediaBinding_ownerType_ownerId_lifecycle_idx" ON "MediaBinding"("ownerType", "ownerId", "lifecycle");
CREATE INDEX "MediaBinding_audienceSegment_pipelineKey_idx" ON "MediaBinding"("audienceSegment", "pipelineKey");
CREATE UNIQUE INDEX "MediaOperation_idempotencyKey_key" ON "MediaOperation"("idempotencyKey");
CREATE INDEX "MediaOperation_status_createdAt_idx" ON "MediaOperation"("status", "createdAt");
CREATE INDEX "MediaOperation_mediaObjectId_createdAt_idx" ON "MediaOperation"("mediaObjectId", "createdAt");

ALTER TABLE "MediaBinding"
ADD CONSTRAINT "MediaBinding_mediaObjectId_fkey"
FOREIGN KEY ("mediaObjectId") REFERENCES "MediaObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MediaOperation"
ADD CONSTRAINT "MediaOperation_mediaObjectId_fkey"
FOREIGN KEY ("mediaObjectId") REFERENCES "MediaObject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
