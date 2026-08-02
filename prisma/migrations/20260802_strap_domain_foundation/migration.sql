CREATE TYPE "StrapOriginType" AS ENUM ('OEM', 'AFTERMARKET', 'UNKNOWN');
CREATE TYPE "StrapInventoryPolicy" AS ENUM ('STOCKED', 'NON_STOCK', 'SERIALIZED');
CREATE TYPE "StrapOwnershipMode" AS ENUM ('SHOP_INVENTORY', 'WATCH_ATTACHED', 'CUSTOMER_OWNED');
CREATE TYPE "StrapClaspType" AS ENUM ('PIN_BUCKLE', 'DEPLOYANT', 'FOLDING', 'BRACELET_CLASP', 'NONE', 'OTHER');
CREATE TYPE "StrapLengthClass" AS ENUM ('SHORT', 'STANDARD', 'LONG', 'CUSTOM');
CREATE TYPE "StrapInventoryMovementType" AS ENUM ('RECEIPT', 'SALE', 'INSTALL', 'REMOVE', 'ADJUST', 'RETURN', 'TRANSFER');
CREATE TYPE "StrapCatalogOptionKind" AS ENUM ('COLOR', 'MATERIAL', 'CLASP_TYPE', 'FINISH', 'LENGTH_CLASS', 'STORAGE_LOCATION');

ALTER TYPE "TaskExecutionTargetType" ADD VALUE IF NOT EXISTS 'STRAP';

ALTER TABLE "StrapVariantSpec"
  ADD COLUMN "originType" "StrapOriginType" NOT NULL DEFAULT 'AFTERMARKET',
  ADD COLUMN "inventoryPolicy" "StrapInventoryPolicy" NOT NULL DEFAULT 'STOCKED',
  ADD COLUMN "claspType" "StrapClaspType",
  ADD COLUMN "claspWidthMM" INTEGER,
  ADD COLUMN "claspOriginType" "StrapOriginType",
  ADD COLUMN "finish" TEXT,
  ADD COLUMN "lengthClass" "StrapLengthClass",
  ADD COLUMN "minStockQty" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "targetStockQty" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "braceletReference" TEXT,
  ADD COLUMN "defaultFullLinks" INTEGER,
  ADD COLUMN "defaultHalfLinks" INTEGER,
  ADD COLUMN "defaultEndLinks" INTEGER;

CREATE TABLE "WatchStrapInstallation" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "watchId" TEXT NOT NULL,
  "strapVariantId" TEXT NOT NULL,
  "ownershipMode" "StrapOwnershipMode" NOT NULL,
  "installedFullLinks" INTEGER,
  "installedHalfLinks" INTEGER,
  "spareFullLinks" INTEGER,
  "spareHalfLinks" INTEGER,
  "endLinkCount" INTEGER,
  "wristSizeMM" INTEGER,
  "installedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "removedAt" TIMESTAMPTZ(6),
  "installedByUserId" TEXT,
  "removedByUserId" TEXT,
  "sourceOrderId" TEXT,
  "serviceRequestId" TEXT,
  "note" TEXT,
  CONSTRAINT "WatchStrapInstallation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "WatchStrapInstallation_watchId_fkey" FOREIGN KEY ("watchId") REFERENCES "Watch"("id") ON DELETE CASCADE,
  CONSTRAINT "WatchStrapInstallation_strapVariantId_fkey" FOREIGN KEY ("strapVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT
);
CREATE INDEX "WatchStrapInstallation_watchId_removedAt_idx" ON "WatchStrapInstallation"("watchId", "removedAt");
CREATE INDEX "WatchStrapInstallation_strapVariantId_removedAt_idx" ON "WatchStrapInstallation"("strapVariantId", "removedAt");
CREATE UNIQUE INDEX "WatchStrapInstallation_one_active_watch_idx" ON "WatchStrapInstallation"("watchId") WHERE "removedAt" IS NULL;
CREATE UNIQUE INDEX "WatchStrapInstallation_one_active_strap_idx" ON "WatchStrapInstallation"("strapVariantId") WHERE "removedAt" IS NULL;

CREATE TABLE "StrapInventoryMovement" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "strapVariantId" TEXT NOT NULL,
  "movementType" "StrapInventoryMovementType" NOT NULL,
  "quantity" INTEGER NOT NULL,
  "balanceAfter" INTEGER,
  "watchId" TEXT,
  "orderId" TEXT,
  "serviceRequestId" TEXT,
  "actorUserId" TEXT,
  "sourceType" TEXT,
  "sourceId" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StrapInventoryMovement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "StrapInventoryMovement_strapVariantId_fkey" FOREIGN KEY ("strapVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT
);
CREATE INDEX "StrapInventoryMovement_strapVariantId_createdAt_idx" ON "StrapInventoryMovement"("strapVariantId", "createdAt");
CREATE INDEX "StrapInventoryMovement_movementType_createdAt_idx" ON "StrapInventoryMovement"("movementType", "createdAt");
CREATE INDEX "StrapInventoryMovement_watchId_idx" ON "StrapInventoryMovement"("watchId");
CREATE INDEX "StrapInventoryMovement_orderId_idx" ON "StrapInventoryMovement"("orderId");

CREATE TABLE "StrapCatalogOption" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "kind" "StrapCatalogOptionKind" NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "colorHex" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StrapCatalogOption_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StrapCatalogOption_kind_code_key" ON "StrapCatalogOption"("kind", "code");
CREATE INDEX "StrapCatalogOption_kind_isActive_sortOrder_idx" ON "StrapCatalogOption"("kind", "isActive", "sortOrder");
