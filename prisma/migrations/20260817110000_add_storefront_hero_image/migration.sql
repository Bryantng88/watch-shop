CREATE TABLE "StorefrontHeroImage" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "storageKey" TEXT NOT NULL,
    "derivativeKey" TEXT,
    "originalFileName" TEXT NOT NULL,
    "altText" TEXT,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "focalX" INTEGER NOT NULL DEFAULT 50,
    "focalY" INTEGER NOT NULL DEFAULT 50,
    "overlayOpacity" INTEGER NOT NULL DEFAULT 55,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StorefrontHeroImage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StorefrontHeroImage_storageKey_key" ON "StorefrontHeroImage"("storageKey");
CREATE INDEX "StorefrontHeroImage_isActive_updatedAt_idx" ON "StorefrontHeroImage"("isActive", "updatedAt");
CREATE UNIQUE INDEX "StorefrontHeroImage_single_active_key" ON "StorefrontHeroImage"("isActive") WHERE "isActive" = true;
