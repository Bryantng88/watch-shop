ALTER TYPE "PurchaseRequestContactPreference" ADD VALUE IF NOT EXISTS 'WHATSAPP';
ALTER TYPE "PurchaseRequestContactPreference" ADD VALUE IF NOT EXISTS 'INSTAGRAM';

ALTER TABLE "PurchaseRequest"
ADD COLUMN "contactHandle" TEXT;
