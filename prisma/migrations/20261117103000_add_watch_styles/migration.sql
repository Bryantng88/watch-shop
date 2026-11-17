-- Additive only: existing Watch styles and rows are preserved.
ALTER TYPE "WatchStyle" ADD VALUE IF NOT EXISTS 'DIVER';
ALTER TYPE "WatchStyle" ADD VALUE IF NOT EXISTS 'PILOT';
ALTER TYPE "WatchStyle" ADD VALUE IF NOT EXISTS 'RACING';
