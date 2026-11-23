-- Additive ownership only. Existing media records and lifecycle enums are unchanged.
ALTER TYPE "MediaOwnerType" ADD VALUE IF NOT EXISTS 'TASK_ITEM';
ALTER TYPE "MediaOwnerType" ADD VALUE IF NOT EXISTS 'TASK_CHECKLIST';
