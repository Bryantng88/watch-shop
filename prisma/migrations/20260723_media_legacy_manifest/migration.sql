CREATE TYPE "MediaLegacyClassification" AS ENUM (
  'DB_AND_NAS_OK',
  'LEGACY_SOURCE_MOVED',
  'DB_PRESENT_NAS_MISSING',
  'PRODUCT_REFERENCE_BROKEN',
  'UNBOUND',
  'NEEDS_REVIEW'
);

CREATE TYPE "MediaLegacyDecision" AS ENUM (
  'PENDING',
  'MIGRATE',
  'MIGRATED',
  'QUARANTINE',
  'IGNORE'
);

CREATE TABLE "MediaLegacyManifest" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "legacyMediaAssetId" TEXT NOT NULL,
  "legacyKey" TEXT NOT NULL,
  "classification" "MediaLegacyClassification" NOT NULL,
  "decision" "MediaLegacyDecision" NOT NULL DEFAULT 'PENDING',
  "physicalExists" BOOLEAN NOT NULL,
  "productImageId" TEXT,
  "productId" TEXT,
  "acquisitionId" TEXT,
  "movedFromKey" TEXT,
  "mediaObjectId" TEXT,
  "note" TEXT,
  "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "migratedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MediaLegacyManifest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaLegacyManifest_legacyMediaAssetId_key"
ON "MediaLegacyManifest"("legacyMediaAssetId");
CREATE INDEX "MediaLegacyManifest_classification_decision_idx"
ON "MediaLegacyManifest"("classification", "decision");
CREATE INDEX "MediaLegacyManifest_mediaObjectId_idx"
ON "MediaLegacyManifest"("mediaObjectId");
