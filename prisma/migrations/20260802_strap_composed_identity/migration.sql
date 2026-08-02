CREATE TYPE "StrapSurface" AS ENUM ('SMOOTH', 'GRAINED');

ALTER TABLE "StrapVariantSpec"
ADD COLUMN "brandName" TEXT,
ADD COLUMN "leatherType" TEXT,
ADD COLUMN "surface" "StrapSurface";
