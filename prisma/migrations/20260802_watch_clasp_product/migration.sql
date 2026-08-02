ALTER TYPE "ProductType" ADD VALUE IF NOT EXISTS 'WATCH_CLASP';

CREATE TABLE "ClaspVariantSpec" (
  "variantId" TEXT NOT NULL,
  "claspType" "StrapClaspType" NOT NULL,
  "widthMM" INTEGER NOT NULL,
  "originType" "StrapOriginType" NOT NULL DEFAULT 'AFTERMARKET',
  "brandName" TEXT,
  "color" TEXT,
  "finish" TEXT,
  "minStockQty" INTEGER NOT NULL DEFAULT 0,
  "targetStockQty" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClaspVariantSpec_pkey" PRIMARY KEY ("variantId"),
  CONSTRAINT "ClaspVariantSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ClaspVariantSpec_claspType_idx" ON "ClaspVariantSpec"("claspType");
CREATE INDEX "ClaspVariantSpec_widthMM_idx" ON "ClaspVariantSpec"("widthMM");
CREATE INDEX "ClaspVariantSpec_originType_idx" ON "ClaspVariantSpec"("originType");
