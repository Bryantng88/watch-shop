import * as z from 'zod';
export const SystemJobRunLogCreateResultSchema = z.object({
  id: z.string(),
  processorKey: z.string(),
  triggerSource: z.string(),
  status: z.string(),
  processedCount: z.number().int(),
  errorCount: z.number().int(),
  note: z.string().optional(),
  detail: z.unknown().optional(),
  startedAt: z.date(),
  finishedAt: z.date().optional()
});