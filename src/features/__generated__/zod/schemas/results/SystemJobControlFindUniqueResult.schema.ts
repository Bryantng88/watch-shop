import * as z from 'zod';
export const SystemJobControlFindUniqueResultSchema = z.nullable(z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  batchSize: z.number().int(),
  pausedReason: z.string().optional(),
  metadata: z.unknown().optional(),
  updated_at: z.date(),
  updated_by: z.string().optional()
}));