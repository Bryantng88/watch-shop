ALTER TABLE "MediaObject"
  ADD COLUMN "sourceMediaObjectId" TEXT,
  ADD COLUMN "derivativeVariant" TEXT,
  ADD COLUMN "derivativeRecipeHash" TEXT;

ALTER TABLE "MediaObject"
  ADD CONSTRAINT "MediaObject_sourceMediaObjectId_fkey"
  FOREIGN KEY ("sourceMediaObjectId") REFERENCES "MediaObject"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "MediaObject_sourceMediaObjectId_availability_idx"
  ON "MediaObject"("sourceMediaObjectId", "availability");

CREATE UNIQUE INDEX "MediaObject_sourceMediaObjectId_derivativeVariant_derivativeRecipeHash_key"
  ON "MediaObject"("sourceMediaObjectId", "derivativeVariant", "derivativeRecipeHash");
