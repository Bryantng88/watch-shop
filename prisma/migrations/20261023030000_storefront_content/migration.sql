CREATE TABLE "StorefrontDocument" (
  "id" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "draft" JSONB NOT NULL,
  "published" JSONB,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "publishedAt" TIMESTAMP(3),
  "updatedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StorefrontDocument_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "StorefrontDocument_kind_check" CHECK ("kind" IN ('HOME', 'ARTICLE')),
  CONSTRAINT "StorefrontDocument_home_check" CHECK (("kind" = 'HOME') = ("id" = 'home'))
);
CREATE INDEX "StorefrontDocument_kind_publishedAt_idx" ON "StorefrontDocument"("kind", "publishedAt");
-- Slugs belong to the published snapshot so editing a draft cannot break links.
CREATE UNIQUE INDEX "StorefrontDocument_public_slug_key"
ON "StorefrontDocument" (("published"->>'slug'))
WHERE "kind" = 'ARTICLE' AND "published" IS NOT NULL;
