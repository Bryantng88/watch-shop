import * as z from 'zod';
export const SystemJobControlUpsertResultSchema = z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  batchSize: z.number().int(),
  pausedReason: z.string().optional(),
  metadata: z.unknown().optional(),
  updatedAt: z.date(),
  updatedBy: z.string().optional()
});