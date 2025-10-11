-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('PRE_OWNED', 'VINTAGE', 'NEW');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "tag" "Tag" NOT NULL DEFAULT 'PRE_OWNED';
