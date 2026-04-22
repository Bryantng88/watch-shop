import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  processorKey: z.boolean().optional(),
  triggerSource: z.boolean().optional(),
  status: z.boolean().optional(),
  processedCount: z.boolean().optional(),
  errorCount: z.boolean().optional(),
  note: z.boolean().optional(),
  detail: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  finishedAt: z.boolean().optional()
}).strict();
export const SystemJobRunLogSelectObjectSchema: z.ZodType<Prisma.SystemJobRunLogSelect> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogSelect>;
export const SystemJobRunLogSelectObjectZodSchema = makeSchema();
