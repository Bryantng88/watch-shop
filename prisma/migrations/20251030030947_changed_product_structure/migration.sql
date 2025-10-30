/*
  Warnings:

  - The values [IN_STOCK] on the enum `AvailabilityStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "AvailabilityStatus_new" AS ENUM ('INACTIVE', 'ACTIVE', 'HIDDEN', 'RESERVED', 'SOLD', 'HOLD');
ALTER TABLE "ProductVariant" ALTER COLUMN "availabilityStatuts" TYPE "AvailabilityStatus_new" USING ("availabilityStatuts"::text::"AvailabilityStatus_new");
ALTER TYPE "AvailabilityStatus" RENAME TO "AvailabilityStatus_old";
ALTER TYPE "AvailabilityStatus_new" RENAME TO "AvailabilityStatus";
DROP TYPE "public"."AvailabilityStatus_old";
COMMIT;

-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE 'DRAFT';

-- DropIndex
DROP INDEX "public"."Product_status_idx";

-- DropIndex
DROP INDEX "public"."Product_status_type_publishedAt_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
ADD COLUMN     "contentStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "availabilityStatuts" "AvailabilityStatus" NOT NULL DEFAULT 'HIDDEN';

-- CreateIndex
CREATE INDEX "Product_contentStatus_idx" ON "Product"("contentStatus");

-- CreateIndex
CREATE INDEX "Product_contentStatus_type_publishedAt_idx" ON "Product"("contentStatus", "type", "publishedAt");
