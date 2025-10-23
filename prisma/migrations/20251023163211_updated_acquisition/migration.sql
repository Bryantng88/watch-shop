-- CreateEnum
CREATE TYPE "AcquisitionStatus" AS ENUM ('DRAFT', 'POSTED', 'CANCELED');

-- AlterTable
ALTER TABLE "Acquisition" ADD COLUMN     "accquisitionStt" "AcquisitionStatus" NOT NULL DEFAULT 'DRAFT';
