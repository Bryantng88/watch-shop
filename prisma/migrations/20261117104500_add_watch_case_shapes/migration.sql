-- Add choices without reclassifying existing Watches.
ALTER TYPE "CaseType" ADD VALUE IF NOT EXISTS 'RECTANGULAR';
ALTER TYPE "CaseType" ADD VALUE IF NOT EXISTS 'TV';
